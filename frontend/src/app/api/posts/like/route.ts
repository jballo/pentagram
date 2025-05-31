import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client/edge";
import { withAccelerate } from "@prisma/extension-accelerate";
import { auth, currentUser } from "@clerk/nextjs/server";

export async function POST(req: Request) {
    
    try {
        await auth.protect();
        const prisma = new PrismaClient().$extends(withAccelerate());
        const user = await currentUser();

        if (!user?.id) throw new Error(`No user signed in`);


        const body = await req.json();
        const { id } = body;

        const existingLike = await prisma.like.findUnique({
            where: {
                authorId_postId: {
                    authorId: user.id,
                    postId: id
                }
            }
        });

        if (existingLike) {
            // Unlike the post
            await prisma.like.delete({
                where: {
                    id: existingLike.id
                }
            });
            console.log("Post like deleted 🗑️");
        } else {
            // Like the post
            await prisma.like.create({
                data: {
                    postId: id,
                    authorId: user.id,
                }
            });
            console.log("Post liked 👍🏽");
        }
        
        return NextResponse.json({content: "Succesfully liked or unliked post"})
    } catch (error) {
        console.log("Error: ", error);
        return NextResponse.json({error: "Failed to like post or unlike post"}, { status: 500 });
    }
}