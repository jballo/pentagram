import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client/edge";
import { withAccelerate } from "@prisma/extension-accelerate";

export async function POST(req: Request) {
  const prisma = new PrismaClient().$extends(withAccelerate());
  try {
    const body = await req.json();
    const {
      post_id,
      post_title,
      post_model,
      post_prompt,
      post_url,
      post_authorId,
    } = body;
    console.log("id: ", post_id);
    console.log("title: ", post_title);
    console.log("model: ", post_model);
    console.log("prompt: ", post_prompt);
    console.log("url: ", post_url);
    console.log("authorId: ", post_authorId);

    await prisma.post.create({
      data: {
        id: post_id,
        title: post_title,
        model: post_model,
        prompt: post_prompt,
        url: post_url,
        authorId: post_authorId,
      },
    });

    return NextResponse.json(
      { content: "Successfully uploaded image" },
      { status: 200 }
    );
  } catch (error) {
    console.log("Error: ", error);
    return NextResponse.json(
      { error: "Failed to upload image" },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
