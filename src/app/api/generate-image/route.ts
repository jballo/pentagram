import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { text } = body;

    console.log("Text: ",text);

    // TODO: Call your Image Generation API here
    // For now, we'll just echo back the text
    const start = new Date().getTime();
    const response = await fetch(`https://jballo--example-hello-world-model-generate-dev.modal.run/?prompt=${text}`);
    
    const elapsed = new Date().getTime() - start;
    console.log("Time to generate image: ", elapsed, "ms");
    const timeElapsedSeconds = elapsed / 1000;
    console.log("Time to generate image: ", timeElapsedSeconds, "s");
    if (!response.ok){
      return NextResponse.json(
        { success: false, error: "Failed to get image"},
        { status: 500 }
      );
    }

    // console.log(response);

    const blob = await response.blob();

    const headers = new Headers();

    headers.set("Content-Type", "image/*");

    return new NextResponse(blob, { status: 200, statusText: "OK", headers});
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Failed to process request" },
      { status: 500 }
    );
  }
}
