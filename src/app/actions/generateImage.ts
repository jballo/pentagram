"use server";


export async function generateImage(text: string, count: number) {
    try {
        const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:3000';
        const response = await fetch(`${BASE_URL}/api/generate-image`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "X-API-SECRET": process.env.API_SECRET || "",
            },
            body: JSON.stringify({ text, count }),
        })

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        return data;

    } catch (error) {
        console.error("Server Error: ", error);
        return {
            success: false,
            error:
                error instanceof Error ? error.message : "Failed to generate image",
        };
    }
}