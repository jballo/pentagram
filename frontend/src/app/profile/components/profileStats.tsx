import { currentUser } from "@clerk/nextjs/server";
import { PrismaClient } from "@prisma/client/edge";
import { withAccelerate } from "@prisma/extension-accelerate";

interface Query {
    "_count": {
        "id": number,
    }
}

export default async function ProfileStats() {
    const user = await currentUser();
    const prisma = new PrismaClient().$extends(withAccelerate());

    if (!user?.id) return <div>Please sign in to view your stats</div>;

    const postCountQuery: Query = await prisma.post.aggregate({
        _count: {
            id: true
        },
        where: {
            authorId: user.id
        }
    });

    const likeCountQuery: Query = await prisma.like.aggregate({
        _count: {
            id: true,
        },
        where: {
            post: {
                authorId: user.id
            }
        }
    });

    const commentCountQuery: Query = await prisma.comment.aggregate({
        _count: {
            id: true,
        },
        where: {
            post: {
                authorId: user.id
            }
        }
    });





    const postCount = postCountQuery._count.id;
    const likeCount = likeCountQuery._count.id;
    const commentCount = commentCountQuery._count.id;

    return (<div className="w-full text-center">
        <h2 className="text-3xl">User Stats</h2>
        <div className="grid grid-cols-4">
            <h3 className="text-2xl">Follower Count: 30</h3>
            <h3 className="text-2xl">Post Count: {postCount}</h3>
            <h3 className="text-2xl">Comment Count: {commentCount}</h3>
            <h3 className="text-2xl">Likes Received: {likeCount}</h3>
        </div>
    </div>);

}