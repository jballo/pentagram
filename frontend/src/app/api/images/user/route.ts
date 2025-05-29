import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client/edge";
import { withAccelerate } from "@prisma/extension-accelerate";
import { auth } from "@clerk/nextjs/server";

interface Post {
  title: string;
  model: string;
  prompt: string;
  url: string;
  authorId: string;
  createdAt: Date;
}

export async function GET(req: Request) {
  const prisma = new PrismaClient().$extends(withAccelerate());
  const headers = req.headers;
  const user_id = headers.get("x-user-id");

  try {
    await auth.protect();
    console.log("user_id: ", user_id);

    if (!user_id) throw new Error(`No user id in headers`);
    const posts = await prisma.post.findMany({
      where: {
        authorId: user_id,
      },
    });

    console.log("posts: ", posts);

    const parsedPosts: Post[] = [];

    posts.map(post => {
      parsedPosts.push({
        title: post.title,
        model: post.model,
        prompt: post.prompt,
        url: post.url,
        authorId: post.authorId,
        createdAt: post.createdAt,
      });
    });

    return NextResponse.json({ content: parsedPosts }, { status: 200 });
  } catch (error) {
    console.log("Error: ", error);
    return NextResponse.json(
      { error: "Failed to retrieve user images" },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
