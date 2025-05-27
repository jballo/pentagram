import { NextResponse } from "next/server";
import { put } from "@vercel/blob";
import crypto from "crypto";
import { auth } from "@clerk/nextjs/server";

export async function POST(request: Request) {
  try {
    await auth.protect();
    
    const body = await request.json();
    const { text, count } = body;

    console.log("Text: ",text);
    console.log("Count: ", count);

    // const apiSecret = request.headers.get("X-API-SECRET");
    
    // if (apiSecret !== process.env.API_SECRET) {
    //   return NextResponse.json({ error: "Unauthorized" }, { status: 401});
    // }

    // Call Image Generation API
    const start = new Date().getTime();

    const url = new URL(process.env.GENERATE_IMAGE_ENDPOINT || "");

    url.searchParams.set("prompt", text);
    url.searchParams.set("imgCount", count);

    // console.log("Requesting URL: ", url.toString());

    const response = await fetch(url.toString(),{
      method: "GET",
      headers: {
        "X-API-Key": process.env.API_KEY || "",
        Accept: "multipart/mixed"
      }
    });
    
    const elapsed = new Date().getTime() - start;
    console.log("Time to generate image: ", elapsed, "ms");
    const timeElapsedSeconds = elapsed / 1000;
    console.log("Time to generate image: ", timeElapsedSeconds, "s");

    if (!response.ok) {
      const errorText = await response.text();
      console.error("API Response: ", errorText);
      throw new Error(
        `HTTP error! status: ${response.status}, message: ${errorText}`
      );
    }

    const buffer = await response.arrayBuffer();
    const contentType = response.headers.get("content-type");
    const boundary = contentType?.split("boundary=")[1];

    if (!boundary) {
      throw new Error("No boundary found in multipart response");
    }

    // Process the multipart response correctly
    const parts = Buffer.from(buffer)
      .toString('binary')
      .split(`--${boundary}`)
      .filter(part => part.includes('Content-Type: image/jpeg'));

    const images = await Promise.all(parts.map(async part => {
      // Find the actual image data after headers
      const imageStart = part.indexOf('\r\n\r\n') + 4;
      const imageData = part.slice(imageStart);
      
      if (!imageData) return null;

      // Convert binary data to base64
      const base64Data = Buffer.from(imageData, 'binary').toString('base64');
      
      // Generate unique filename and upload to blob storage
      const filename = `${crypto.randomUUID()}.jpg`;
      const blob = await put(filename, Buffer.from(base64Data, 'base64'), {
        access: "public",
        contentType: "image/jpeg",
      });

      return blob.url;
    }));

    const validImages = images.filter(Boolean);

    if (validImages.length === 0) {
      throw new Error("No valid images found in response");
    }

    return NextResponse.json({
      success: true,
      imageUrls: validImages
    });

  } catch (error) {
    console.error("Error processing request: ", error);
    return NextResponse.json(
      { success: false, error: "Failed to process request" },
      { status: 500 }
    );
  }
}
