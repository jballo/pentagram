"use server";
import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client/edge";
import { withAccelerate } from "@prisma/extension-accelerate";
import { auth } from "@clerk/nextjs/server";

export async function POST(req: Request) {
    const prisma = new PrismaClient().$extends(withAccelerate());

    try {
        await auth.protect();
        const body = await req.json();
        const {postId, userId} = body;

        const checkLikeQuery = await prisma.like.findFirst({
            where: {
                authorId: userId,
                postId: postId
            }
        });

        console.log("checkLikeQuery: ", checkLikeQuery);

        if (checkLikeQuery !== null) {
            // Like exists for post -> delete
            console.log("Like already exists -> unliked")

            const deleteLikeQuery = await prisma.like.delete({
                where: {
                    id: checkLikeQuery.id
                }
            });

            console.log("deleteLikeQuery: ", deleteLikeQuery);

        } else {
            //  like doesn't exist for post -> create
            console.log("Like doesn't exist -> like")
            const createLikeQuery = await prisma.like.create({
                data: {
                    postId: postId,
                    authorId: userId,
                }
            });

            console.log("createLikeQuery: ", createLikeQuery);
        }

        return NextResponse.json({ content: "Post (un)liked"}, {status: 200});
    } catch (error) {
        console.log("Error: ", error);
        return NextResponse.json({error: "Failed to (un)like post"}, {status: 500});
    }
}