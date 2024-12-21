import sys
import os
import modal
from fastapi import Response, HTTPException, Query, Request
from datetime import datetime, timezone
import requests

image = (
    modal.Image.debian_slim(python_version="3.12")
    .pip_install(
        "accelerate==0.33.0",
        "diffusers==0.31.0",
        "fastapi[standard]==0.115.4",
        "huggingface-hub[hf_transfer]==0.25.2",
        "sentencepiece==0.2.0",
        "torch==2.5.1",
        "torchvision==0.20.1",
        "transformers~=4.44.0",
        "requests",
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
        repo_id = "stabilityai/stable-diffusion-3.5-large-turbo"

        login(token=os.environ["HUGGING_FACE_ACCESS_TOKEN"])

        self.pipe = StableDiffusion3Pipeline.from_pretrained(repo_id, torch_dtype=torch.bfloat16)

        self.pipe = self.pipe.to("cuda")
        self.API_KEY = os.environ["API_KEY"]



    @modal.web_endpoint()
    def generate(self, request: Request, prompt: str = Query(..., description="The prompt for image generation")):

        api_key = request.headers.get("X-API-Key")
        if api_key != self.API_KEY:
            raise HTTPException(
                status_code= 401,
                detail = "Unauthorized",
            )

        image = self.pipe(
            prompt,
            num_inference_steps=4,
            guidance_scale=0.0,
        ).images[0]

        buffer = io.BytesIO()
        image.save(buffer, format="JPEG")
        return Response(content=buffer.getvalue(), media_type="image/jpeg")
    
    @modal.web_endpoint()
    def health(self):
        """Lightweight endpoint for keeping the container warm"""
        return {"status": "healthy", "timestamp": datetime.now(timezone.utc).isoformat()}


# Warm-keeping function that runs every 5 minutes
@app.function(
    schedule=modal.Cron("*/5 * * * *"),
    secrets=[modal.Secret.from_name("API_KEY")]
)
def keep_warm():
    health_url = "https://jballo--pent-img-gen-api-model-health.modal.run"
    generate_url = "https://jballo--pent-img-gen-api-model-generate.modal.run"

    # First check health endpoint (no api key needed)
    health_response = requests.get(health_url)
    print(f"Health check at: {health_response.json()['timestamp']}")

    # Then make a test request to generate endpoint with API Key
    # headers = {"X-API-Key": os.environ["API_KEY"]}
    # generate_response = requests.get(generate_url, headers=headers)
    # print(f"Generate endpoint tested successfully at: {datetime.now(timezone.utc).isoformat()}")
