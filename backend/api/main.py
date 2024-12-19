import sys

import modal
import modal.gpu
from pathlib import Path

# create a Volume, or retrieve it if it exists
volume = modal.Volume.from_name("model-weights-vol", create_if_missing=True)
MODEL_DIR = Path("/models")

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
    from diffusers import StableDiffusion3Pipeline
    from huggingface_hub import login
    from huggingface_hub import snapshot_download


@app.function(
    volumes={MODEL_DIR: volume},  # "mount" the Volume, sharing it with your function
    image=image,  # only download dependencies needed here
)
def download_model(
    repo_id: str="stabilityai/stable-diffusion-3.5-large-turbo",
    revision: str=None,  # include a revision to prevent surprises!
    ):

    login(token=os.environ["HUGGING_FACE_ACCES_TOKEN"])
    snapshot_download(repo_id=repo_id, local_dir=MODEL_DIR / repo_id)
    print(f"Model downloaded to {MODEL_DIR / repo_id}")

@app.cls(image=image, gpu="a100", secrets=[modal.Secret.from_name("custom-secret")], volumes={MODEL_DIR: volume})
class Model:
    @modal.build()
    @modal.enter()
    def load_weights(self, repo_id: str="stabilityai/stable-diffusion-3.5-large-turbo"):

        weightLocation = os.path.join(MODEL_DIR, repo_id)
        # login(token=os.environ["HUGGING_FACE_ACCES_TOKEN"])
        self.pipe = StableDiffusion3Pipeline.from_pretrained(weightLocation, torch_dtype=torch.bfloat16)
        self.pipe = self.pipe.to("cuda")



    @modal.web_endpoint()
    def generate(self, prompt="Two russian blue cats holding a sign that says hello world"):
        image = self.pipe(
            prompt,
            num_inference_steps=4,
            guidance_scale=0.0,
        ).images[0]

        buffer = io.BytesIO()
        image.save(buffer, format="JPEG")
        return Response(content=buffer.getvalue(), media_type="image/jpeg")
