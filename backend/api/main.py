# Import necessary libraries and modules
import os
import modal
from fastapi import Response, HTTPException, Query, Request
from datetime import datetime, timezone
import requests

# Set up the modal image environment with necessary dependencies
image = (
    modal.Image.debian_slim(python_version="3.12")
    .apt_install("git")
    .pip_install(
        "accelerate==1.7.0",
        "diffusers==0.33.1",
        "fastapi[standard]==0.115.12",
        "huggingface-hub[hf_transfer]==0.32.2",
        "torch==2.7.0",
        "git+https://github.com/huggingface/transformers@main",
        "requests==2.32.3",
        "torchao==0.11.0",
        "sentencepiece==0.2.0"
    )
    .env({
        "HF_HUB_CACHE": "/cache",
        "HF_HUB_ENABLE_HF_TRANSFER": "1"
    })  # faster downloads
)

# Initialize the modal application with the defined image
app = modal.App(name="pent-img-gen-api", image=image)

# Import additional dependencies inside the image context
with image.imports():
    import io
    import os
    import torch
    from fastapi import Response
    from huggingface_hub import login
    from diffusers import FluxPipeline, FluxTransformer2DModel, TorchAoConfig


# Define a class to load model weights and handle image generation
cache_vol = modal.Volume.from_name("hf-hub-cache")
@app.cls(
    image=image, 
    gpu="a100", 
    secrets=[modal.Secret.from_name("pent-secrets")],
    scaledown_window=300,
    volumes={"/cache": cache_vol}
)
class Model:
    # Method to load model weights from Hugging Face Hub
    @modal.enter() # Ensures this is the first method called when the container is initialized
    def load_weights(self):
        # Log into Hugging Face Hub using the access token from environment variable
        login(token=os.environ["HUGGING_FACE_ACCESS_TOKEN"])

        # Define the model and quantization configuration
        model_id = "black-forest-labs/FLUX.1-schnell"
        dtype = torch.bfloat16

        quantization_config = TorchAoConfig("int8wo") # Set the quantization config for faster inference
        transformer = FluxTransformer2DModel.from_pretrained(
            model_id,
            subfolder="transformer",
            quantization_config=quantization_config,
            torch_dtype=dtype,
        )
        # Load the pre-trained model pipeline
        self.pipe = FluxPipeline.from_pretrained(
            model_id,
            transformer=transformer,
            torch_dtype=dtype,
        )
        self.pipe.to("cuda") # Move the model to GPU for faster inference
        self.API_KEY = os.environ["API_KEY"]

    # Method to verify API key for authorization
    # @modal.method()
    # @staticmethod
    def verify_auth_header(self, api_key):
        if api_key != self.API_KEY:
            raise HTTPException(
                status_code= 401,
                detail = "Unauthorized", # Raise an error if the API key does not match
            )

    # Method to generate an image based on a given prompt
    @modal.method()
    def generate_image(self, prompt="Trees"):
        # Generate image using the pipeline
        image = self.pipe(
            prompt, num_inference_steps=2, guidance_scale=1.0, max_sequence_length=512, width=512, height=512
        ).images[0]

        # Convert the generated image to JPEG format
        buffer = io.BytesIO()
        image.save(buffer, format="JPEG")
        img = buffer.getvalue()

        # Prepare the image as part of a multipart response
        boundary = b'--boundary--'
        content_length = str(len(img)).encode()

        part = (
            b'\r\n'
            + boundary + b'\r\n'
            b'Content-Type: image/jpeg\r\n'
            b'Content-Length: ' + content_length + b'\r\n\r\n'
            + img
        )
        # Return the image as a part of the multipart response
        return part


    # Web endpoint to handle image generation requests
    @modal.fastapi_endpoint()
    def generate(self, request: Request, prompt: str = Query(..., description="The prompt for image generation"), imgCount: int = Query(..., description="The number of images to produces", ge=1,  le=3)):

        # Check the API key in request headers for authentication
        api_key = request.headers.get("X-API-Key")
        self.verify_auth_header(api_key)

        # Generate a list of prompts based on imgCount
        prompt_list = [prompt] * imgCount

        # Initialize multipart boundary and images list
        boundary = b'--boundary--'
        images = []

        # Generate images for each prompt
        for img in self.generate_image.map(prompt_list):
            images.append(img)

        # Add final boundary to indicate the end of the multipart response
        images.append(b'\r\n' + boundary + b'--\r\n')
        
        
        # Combine all image parts into a single bytes object
        body = b''.join(images)
        
        # Return the combined image content as a multipart response
        return Response(
            content=body,
            media_type=f'multipart/mixed; boundary={boundary[2:-2].decode()}'
        )
    
    # Web endpoint for a health check to keep the container warm
    @modal.fastapi_endpoint()
    def health(self, request: Request):
        """Lightweight endpoint for keeping the container warm"""
        # Check the API key for authentication
        api_key = request.headers.get("X-API-Key")
        self.verify_auth_header(api_key)

        return {"status": "healthy", "timestamp": datetime.now(timezone.utc).isoformat()}


# # Function to keep the container warm by pinging the health endpoint every 5 minutes
# @app.function(
#     schedule=modal.Cron("*/5 6-18 * * *"), # Cron expression to run every 5 minutes between 6 AM (UTC) and 6 PM (UTC)
#     secrets=[modal.Secret.from_name("API_KEY")]
# )
# def keep_warm():
#     health_endpoint = os.environ["HEALTH_ENDPOINT"]
#     api_key = os.environ["API_KEY"]  # Fetch the API key from environment variables
    

#     # Headers with API key for authentication
#     headers = {
#         "X-API-Key": api_key
#     }
#     # Perform a health check to keep the container active
#     health_response = requests.get(health_endpoint, headers=headers)
#     if health_response.status_code == 200:
#         print("Container is now warm.")
#         print(f"Health check at: {health_response.json()['timestamp']}")
#     else:
#         print("Container failed to warm up.")



# # Function to trigger image generation at 6:03 AM to pre-load the model to be ready for first inference and onwards
# @app.function(
#     schedule=modal.Cron("3 6 * * *"),  # Cron for 6:03 AM (UTC) daily
#     secrets=[modal.Secret.from_name("API_KEY")]
# )
# def generate_daily_image():
#     generate_endpoint = os.environ["GENERATE_ENDPOINT"]
#     prompt = "Sunset"  # Example prompt for the image generation
#     api_key = os.environ["API_KEY"]  # Fetch the API key from environment variables

#     # Headers with API key for authentication
#     headers = {
#         "X-API-Key": api_key
#     }

#     # Call the image generation endpoint to ensure the model is ready
#     print("Loading model weights...")
#     response = requests.get(generate_endpoint, params={"prompt": prompt, "imgCount": 1}, headers=headers)
    
#     if response.status_code == 200:
#         print("Model ready for inferences.")
#     else:
#         print(f"Failed to make model ready.")
