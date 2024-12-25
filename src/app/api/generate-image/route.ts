import { NextResponse } from "next/server";
import { put } from "@vercel/blob";
import crypto from "crypto";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { text } = body;

    console.log("Text: ",text);

    const apiSecret = request.headers.get("X-API-SECRET");
    
    if (apiSecret !== process.env.API_SECRET) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401});
    }

    // Call Image Generation API
    const start = new Date().getTime();

    const url = new URL(process.env.GENERATE_IMAGE_ENDPOINT || "");

    url.searchParams.set("prompt", text);

    console.log("Requesting URL: ", url.toString());

    const response = await fetch(url.toString(),{
      method: "GET",
      headers: {
        "X-API-Key": process.env.API_KEY || "",
        Accept: "image/jpeg"
      }
    });
    
    const elapsed = new Date().getTime() - start;
    console.log("Time to generate image: ", elapsed, "ms");
    const timeElapsedSeconds = elapsed / 1000;
    console.log("Time to generate image: ", timeElapsedSeconds, "s");


    if (!response.ok){
      const errorText = await response.text();
      console.error("API Response: ", errorText);
      throw new Error(
        `HTTP error! status: ${response.status}, message: ${errorText}`
      );
    }

    // console.log(response);
    // const blob = await response.blob();
    // const headers = new Headers();
    // headers.set("Content-Type", "image/*");
    // return new NextResponse(blob, { status: 200, statusText: "OK", headers});

    const imageBuffer = await response.arrayBuffer();

    const filename = `${crypto.randomUUID()}.jpg`;

    const blob = await put(filename, imageBuffer, {
      access: "public",
      contentType: "image/jpeg",
    });

    return NextResponse.json({
      success: true,
      imageUrl: blob.url,
    });

  } catch (error) {
    console.error("Error processing request: ", error);
    return NextResponse.json(
      { success: false, error: "Failed to process request" },
      { status: 500 }
    );
  }
}
