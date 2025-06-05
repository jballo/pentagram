import { PrismaClient } from "@prisma/client/edge";
import { withAccelerate } from "@prisma/extension-accelerate";
import PostsClient from "./PostsClient";


export default async function Posts() {

    const prisma = new PrismaClient().$extends(withAccelerate());

    // const posts = await prisma.post.findMany({
    //     orderBy: {
    //         createdAt: 'desc'
    //     }
    // });

    const postsAndLikesQuery = await prisma.post.findMany({
        include: {
            likes: true
        }
    });

    console.log("postsAndLikesQuery: ", postsAndLikesQuery);




    return (<div className="grid sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-10">
        <PostsClient initialPosts={postsAndLikesQuery} />
    </div>);
}