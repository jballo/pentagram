import sys
import os
import modal
from fastapi import Response, HTTPException, Query, Request
from datetime import datetime, timezone
import requests
from fastapi.responses import StreamingResponse

image = (
    modal.Image.debian_slim(python_version="3.12")
    .apt_install("git")
    .pip_install(
        "accelerate==0.33.0",
        "diffusers==0.32.1",
        "fastapi[standard]==0.115.4",
        "huggingface-hub[hf_transfer]==0.25.2",
        "sentencepiece==0.2.0",
        "torch==2.5.1",
        "torchvision==0.20.1",
        "git+https://github.com/huggingface/transformers@main",
        "requests",
        "bitsandbytes",
        "t5",
        "torchao"
    )
    .env({"HF_HUB_ENABLE_HF_TRANSFER": "1"})  # faster downloads
)


app = modal.App(name="pent-img-gen-api", image=image)


with image.imports():
    import io
    import os
    import torch
    from fastapi import Response
    from diffusers import StableDiffusion3Pipeline
    from huggingface_hub import login
    from diffusers import BitsAndBytesConfig, SD3Transformer2DModel






@app.cls(
    image=image, 
    gpu="a100", 
    secrets=[modal.Secret.from_name("API_KEY")],
    container_idle_timeout=300
)
class Model:
    @modal.build()
    @modal.enter()
    def load_weights(self):

        login(token=os.environ["HUGGING_FACE_ACCESS_TOKEN"])

        from diffusers import FluxPipeline, FluxTransformer2DModel, TorchAoConfig

        model_id = "black-forest-labs/FLUX.1-schnell"
        dtype = torch.bfloat16

        quantization_config = TorchAoConfig("int8wo")
        transformer = FluxTransformer2DModel.from_pretrained(
            model_id,
            subfolder="transformer",
            quantization_config=quantization_config,
            torch_dtype=dtype,
        )

        self.pipe = FluxPipeline.from_pretrained(
            model_id,
            transformer=transformer,
            torch_dtype=dtype,
        )
        self.pipe.to("cuda")
        self.API_KEY = os.environ["API_KEY"]


    @modal.method()
    def generate_image(self, prompt="Trees"):
        print(prompt)
        image = self.pipe(
            prompt, num_inference_steps=2, guidance_scale=0.0, max_sequence_length=512, width=1008, height=658
        ).images[0]

        return image


    @modal.web_endpoint()
    def generate(self, request: Request, prompt: str = Query(..., description="The prompt for image generation")):

        api_key = request.headers.get("X-API-Key")
        if api_key != self.API_KEY:
            raise HTTPException(
                status_code= 401,
                detail = "Unauthorized",
            )

        prompt_list = [prompt, prompt]
        image_buffers = []
        for img in self.generate_image.map(prompt_list):
            buffer = io.BytesIO()
            img.save(buffer, format="JPEG")
            image_buffers.append(buffer.getvalue())


        # Create multipart response with proper byte handling
        boundary = b'--boundary--'
        parts = []
        

        for img in image_buffers:
            # Convert content length to bytes
            content_length = str(len(img)).encode()
            
            part = (
                b'\r\n'
                + boundary + b'\r\n'
                b'Content-Type: image/jpeg\r\n'
                b'Content-Length: ' + content_length + b'\r\n\r\n'
                + img
            )
            parts.append(part)
        
        # Add final boundary
        parts.append(b'\r\n' + boundary + b'--\r\n')
        
        # Join all parts into single bytes object
        body = b''.join(parts)
        
        return Response(
            content=body,
            media_type=f'multipart/mixed; boundary={boundary[2:-2].decode()}'
        )
    
    @modal.web_endpoint()
    def health(self):
        """Lightweight endpoint for keeping the container warm"""
        return {"status": "healthy", "timestamp": datetime.now(timezone.utc).isoformat()}


# Warm-keeping function that runs every 5 minutes between 6AM to 6PM
@app.function(
    schedule=modal.Cron("*/5 6-18 * * *"),
    secrets=[modal.Secret.from_name("API_KEY")]
)
def keep_warm():
    health_endpoint = os.environ["HEALTH_ENDPOINT"]

    # First check health endpoint (no api key needed)
    health_response = requests.get(health_endpoint)
    print(f"Health check at: {health_response.json()['timestamp']}")
