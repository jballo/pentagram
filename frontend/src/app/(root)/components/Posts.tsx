import { PrismaClient } from "@prisma/client/edge";
import { withAccelerate } from "@prisma/extension-accelerate";
import PostsClient from "./PostsClient";
// import { unstable_noStore as noStore } from "next/cache";


// export const dynamic = 'force-dynamic';
// export const revalidate = 0; // Disable caching for this component

export default async function Posts() {
    // prevent caching at the component level
    // noStore();
    const prisma = new PrismaClient().$extends(withAccelerate());

    const postsAndLikesQuery = await prisma.post.findMany({
        include: {
            likes: true
        },
        // cacheStrategy: {
        //     ttl: 0
        // }
    });

    console.log("postsAndLikesQuery: ", postsAndLikesQuery);




    return (<div className="grid sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-10">
        <PostsClient initialPosts={postsAndLikesQuery} />
    </div>);
}