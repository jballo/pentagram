import { NextResponse } from "next/server";
import { put } from "@vercel/blob";
import crypto from "crypto";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { text } = body;

    console.log("Text: ",text);

    // TODO: Call your Image Generation API here
    // For now, we'll just echo back the text
    const start = new Date().getTime();

    const url = new URL("https://jballo--pent-img-gen-api-model-generate.modal.run/");

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
    return NextResponse.json(
      { success: false, error: "Failed to process request" },
      { status: 500 }
    );
  }
}
