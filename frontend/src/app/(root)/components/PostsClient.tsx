"use client";

import { Card, CardContent, CardFooter, CardTitle } from "@/atoms/card";
import { cn } from "@/lib/utils";
import { useAuth } from "@clerk/nextjs";
import { HeartIcon, MessageCircle, Share2Icon, Text } from "lucide-react";
import Image from "next/image";
import { useOptimistic, useState } from "react";

interface Like {
    id?: number;
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
    likes: Like[];
}

interface PostClientProps {
    initialPosts: Post[];
}

export default function PostsClient({ initialPosts }: PostClientProps) {
    const { userId, isSignedIn, isLoaded } = useAuth();

    // Add actual state for posts
    const [posts, setPosts] = useState(initialPosts);

    // Use the actual posts state as base for optimistic updates
    const [optimisticPosts, setOptimisticPosts] = useOptimistic(posts);

    const toggleLike = async (postId: number) => {
        try {
            if (!userId || !isSignedIn || !isLoaded) {
                throw new Error(`Must be signed in to (un)like post`);
            }

            // Optimistic update
            setOptimisticPosts((prev) =>
                prev.map((post) => {
                    if (post.id !== postId) return post;

                    const likeExists = post.likes.find(
                        (like) => like.authorId === userId
                    );

                    const newLikes: Like[] = likeExists
                        ? post.likes.filter((like) => like.authorId !== userId)
                        : [
                            ...post.likes,
                            {
                                id: -1,
                                createdAt: new Date(),
                                authorId: userId,
                                postId: post.id,
                            },
                        ];

                    return { ...post, likes: newLikes };
                })
            );

            console.log("Post liked: ", postId);

            const response = await fetch(`/api/likes`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ userId, postId }),
            });

            if (!response.ok) throw new Error(`Failed to (un)like post`);

            const result = await response.json();
            console.log("content: ", result.content);

            // Update actual state after successful API call
            setPosts((prev) =>
                prev.map((post) => {
                    if (post.id !== postId) return post;

                    const likeExists = post.likes.find(
                        (like) => like.authorId === userId
                    );

                    const newLikes: Like[] = likeExists
                        ? post.likes.filter((like) => like.authorId !== userId)
                        : [
                            ...post.likes,
                            {
                                // Use the actual like data from API response if available
                                id: result.content?.id || -1,
                                createdAt: new Date(),
                                authorId: userId,
                                postId: post.id,
                            },
                        ];

                    return { ...post, likes: newLikes };
                })
            );
        } catch (error) {
            console.log("Error: ", error);
            // Optionally revert optimistic update on error
            // The optimistic update will automatically revert since we don't update the real state
        }
    };

    return (
        <>
            {optimisticPosts.map((post) => (
                <Card
                    key={post.id}
                    className="flex flex-col p-10 gap-4 w-30 rounded-lg bg-black/[.05] dark:bg-white/[.06] border border-black/[.08] dark:border-white/[.145] focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white border-black dark:border-white uppercase bg-white text-black transition duration-200 text-sm shadow-[1px_1px_rgba(0,0,0),2px_2px_rgba(0,0,0),3px_3px_rgba(0,0,0),4px_4px_rgba(0,0,0),5px_5px_0px_0px_rgba(0,0,0)] dark:shadow-[1px_1px_rgba(255,255,255),2px_2px_rgba(255,255,255),3px_3px_rgba(255,255,255),4px_4px_rgba(255,255,255),5px_5px_0px_0px_rgba(255,255,255)]"
                >
                    <CardTitle>{post.title}</CardTitle>
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
                                <form action={() => toggleLike(post.id)}>
                                    <button
                                        type="submit"
                                        className={cn(
                                            post.likes.some((liked) => liked.authorId === userId)
                                                ? "text-red-600"
                                                : "text-gray-400"
                                        )}
                                    >
                                        <HeartIcon
                                            className={cn({
                                                "fill-red-600": post.likes.some(
                                                    (liked) => liked.authorId === userId
                                                ),
                                            })}
                                        />
                                    </button>
                                </form>
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
        </>
    );
}