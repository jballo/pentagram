# Pentagram

Pentagram is a web application that allows users to generate images based on textual prompts. It leverages a FastAPI backend, Next.js frontend, and integrates with various services for authentication, database management, and image generation.

## Table of Contents

- Features
- Technologies Used
- Installation
- Usage
- API Routes
- Database Schema
- Environment Variables
- Contributing
- License

## Features

- **User Authentication**: Managed via Clerk.
- **Image Generation**: Generate images based on user-provided text prompts.
- **User Management**: Create and verify user accounts.
- **Responsive UI**: Built with Next.js and styled using CSS and Tailwind.

## Technologies Used

- **Frontend**:
  - Next.js
  - React
  - TypeScript
  - Tailwind CSS
  - Clerk for authentication

- **Backend**:
  - FastAPI
  - Modal
  - Vercel Postgres
  - Hugging Face Transformers
  - Diffusers

- **Other Services**:
  - Vercel Blob Storage

## Installation

1. **Clone the Repository**
   ```bash
   git clone https://github.com/yourusername/pentagram.git
   cd pentagram
   ```

2. **Install Dependencies**
   - **Backend**
     ```bash
     cd backend/api
     pip install -r requirements.txt
     ```
   - **Frontend**
     ```bash
     npm install
     ```

3. **Set Up Environment Variables**
   Create a `.env` file in the root directory and add the following:
   ```env
   API_SECRET=your_api_secret
   ```
  3a. **Setup Modal environment**
  ```bash
    python3 -m modal setup
  ```
  
  Go to modal dashboard and add secrets
  ```env
    API_SECRET=your_api_secret
    HEALTH_ENDPOINT=endpoint_once_served/deployed
    HUGGING_FACE_ACCESS_TOKEN=token_to_access_model
  ```

4. **Run the Application**
   - **Backend**
     ```bash
     modal serve backend/api/main.py
     ```
   - **Frontend**
     ```bash
     npm run dev
     ```

## Usage

1. **Access the Application**
   Open your browser and navigate to `http://localhost:3000`.

2. **Authenticate**
   Sign in using your preferred authentication method via Clerk.

3. **Generate Images**
   Navigate to the "Generate" section, enter a text prompt, and specify the number of images to generate.

4. **View Image Feed**
   Access the "Feed" section to view generated images.

5. **User Profile**
   Manage your user profile in the "Profile" section.

## API Routes

### 1. Check If User Exists

- **Endpoint**: `/api/user-exists`
- **Method**: POST


- **Description**: Checks if a user exists in the database.
- **Request Body**:
  ```json
  {
    "id": "user_id"
  }
  ```
- **Response**:
  ```json
  {
    "success": true,
    "message": "User does not exist.",
    "userDoesExist": false
  }
  ```

### 2. Create User

- **Endpoint**: `/api/create-user`
- **Method**: POST


- **Description**: Creates a new user in the database.
- **Request Body**:
  ```json
  {
    "id": "user_id",
    "name": "User Name",
    "email": "user@example.com"
  }
  ```
- **Response**:
  ```json
  {
    "success": true,
    "message": "User created successfully!"
  }
  ```

### 3. Generate Image

- **Endpoint**: `/api/generate-image`
- **Method**: POST


- **Description**: Generates images based on a text prompt.
- **Request Body**:
  ```json
  {
    "text": "A sunset over mountains",
    "count": 3
  }
  ```
- **Response**:
  ```json
  {
    "success": true,
    "imageUrls": [
      "https://blobstorage.com/image1.jpg",
      "https://blobstorage.com/image2.jpg",
      "https://blobstorage.com/image3.jpg"
    ]
  }
  ```

## Database Schema

- **Users Table**
  - **Id**: `varchar(255)` - Primary Key
  - **Name**: `varchar(255)`
  - **Email**: `varchar(255)`

## Environment Variables

- API_SECRET: Secret key for API authentication.


## Contributing

1. **Fork the Repository**
2. **Create a Feature Branch**
   ```bash
   git checkout -b Feat/(API/UI/UX)/FeatureName
   ```
3. **Commit Your Changes**
4. **Push to the Branch**
   ```bash
   git push origin Feat/(API/UI/UX)/FeatureName
   ```
5. **Open a Pull Request**

## License

This project is licensed under the MIT License.