import sys

import modal
import modal.gpu

# pip install -U diffusers
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
    )
    .env({"HF_HUB_ENABLE_HF_TRANSFER": "1"})  # faster downloads
)


app = modal.App(name="example-hello-world", image=image)


with image.imports():
    import io
    import os
    import torch
    from fastapi import Response
    from diffusers import FluxPipeline
    from diffusers import StableDiffusionPipeline
    from diffusers import StableDiffusion3Pipeline
    from huggingface_hub import login



@app.cls(image=image, gpu="a100", secrets=[modal.Secret.from_name("custom-secret")])
class Model:
    @modal.build()
    @modal.enter()
    def load_weights(self):
        # self.pipe = FluxPipeline.from_pretrained("black-forest-labs/FLUX.1-schnell", torch_dtype=torch.bfloat16)
        # self.pipe.to("cuda") # ~40seconds
        # self.pipe.enable_model_cpu_offload() #save some VRAM by offloading the model to CPU. Remove this if you have enough GPU power

        # self.pipe = StableDiffusionPipeline.from_pretrained("sd-legacy/stable-diffusion-v1-5", torch_dtype=torch.float16)
        # self.pipe = self.pipe.to("cuda")

        login(token=os.environ["HUGGING_FACE_ACCES_TOKEN"])
        self.pipe = StableDiffusion3Pipeline.from_pretrained("stabilityai/stable-diffusion-3.5-large-turbo", torch_dtype=torch.bfloat16)
        self.pipe = self.pipe.to("cuda")



    @modal.web_endpoint()
    def generate(self, prompt="Two russian blue cats holding a sign that says hello world"):
        # image for flux schnell
        # image = self.pipe(
        #     prompt,
        #     guidance_scale=0.0,
        #     num_inference_steps=4,
        #     max_sequence_length=256,
        #     generator=torch.Generator("cpu").manual_seed(0)
        # ).images[0]
        # image for stable diffusion 1.5
        # image = self.pipe(prompt).images[0]
        # image for stable diffusion 3.5 large turbo
        image = self.pipe(
            prompt,
            num_inference_steps=4,
            guidance_scale=0.0,
        ).images[0]

        buffer = io.BytesIO()
        image.save(buffer, format="JPEG")
        return Response(content=buffer.getvalue(), media_type="image/jpeg")



