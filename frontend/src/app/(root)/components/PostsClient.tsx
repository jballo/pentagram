"use client";

import { Card, CardContent, CardFooter, CardTitle } from "@/atoms/card";
import { useAuth } from "@clerk/nextjs";
import { HeartIcon, MessageCircle, Share2Icon, Text } from "lucide-react";
import Image from "next/image";
// import { useOptimistic } from "react";


interface Like {
    id: number;
    createdAt: Date;
    authorId: string;
    postId: number;
}

interface Post {
    model: string;
    createdAt: Date;
    id: number;
    title: string;
    prompt: string;
    url: string;
    authorId: string;
    updatedAt: Date;
    isDeleted: boolean;
    deletedAt: Date | null;
    likes: Like[]
}


export default function PostsClient({ initialPosts }: { initialPosts: Post[] }) {
    const { userId, isSignedIn, isLoaded } = useAuth();
    // const [optimisticPosts, setOptimisticPosts] = useOptimistic(
    //     initialPosts,
    //     (state, id) => state.map((post) => post.id === id ? {...post, } )
    // );



    const toggleLike = (id: number) => {

        try {
            if (!userId || !isSignedIn || !isLoaded) throw new Error(`user must be logged in to like a post`)
            console.log("Post liked: ", id);
            // setOptimisticPosts(id);


        } catch (error) {
            console.log("Error: ", error);
        }
    }


    return (<>
        {initialPosts.map((post) => (
            <Card
                key={post.id}
                className="flex flex-col p-10 gap-4 w-30 rounded-lg bg-black/[.05] dark:bg-white/[.06] border border-black/[.08] dark:border-white/[.145] focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white border-black dark:border-white uppercase bg-white text-black transition duration-200 text-sm shadow-[1px_1px_rgba(0,0,0),2px_2px_rgba(0,0,0),3px_3px_rgba(0,0,0),4px_4px_rgba(0,0,0),5px_5px_0px_0px_rgba(0,0,0)] dark:shadow-[1px_1px_rgba(255,255,255),2px_2px_rgba(255,255,255),3px_3px_rgba(255,255,255),4px_4px_rgba(255,255,255),5px_5px_0px_0px_rgba(255,255,255)]"
            >
                <CardTitle>{post.prompt}</CardTitle>
                <CardContent className="py-0">
                    <Image
                        src={post.url}
                        alt={post.prompt || "Generated image"}
                        width={300}
                        height={200}
                        onError={(error) => {
                            console.log("Image load error: ", error);
                        }}
                    />
                </CardContent>
                <CardFooter className="flex flex-col gap-2.5">
                    <div className="flex flex-row gap-3 w-full">
                        <Text />
                        <p className="h-[42px] overflow-auto">{post.prompt}</p>
                    </div>
                    <div className="flex flex-row w-full justify-between">
                        <div className="flex gap-4">
                            <button
                                onClick={() => toggleLike(post.id)}
                            >
                                {post.likes.find((liked) => liked.authorId === userId) ? (
                                    <HeartIcon className="fill-red-600 text-red-600" />

                                ) : (
                                    <HeartIcon />
                                )}
                            </button>
                            <button>
                                <MessageCircle />
                            </button>
                        </div>
                        <div>
                            <button>
                                <Share2Icon />
                            </button>
                        </div>
                    </div>
                </CardFooter>
            </Card>
        ))}
    </>)
}