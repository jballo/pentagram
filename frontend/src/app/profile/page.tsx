"use client";

import { Card, CardContent, CardFooter, CardTitle } from "@/atoms/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/atoms/carousel";
import { useUser } from "@clerk/nextjs";
import { Image } from "@nextui-org/image";
import {
  Calendar,
  HeartIcon,
  MessageCircle,
  Share2Icon,
  Text,
} from "lucide-react";
import { useEffect, useState } from "react";

interface Post {
  title: string;
  model: string;
  prompt: string;
  url: string;
  authorId: string;
  createdAt: Date;
}

export default function ProfilePage() {
  const { user } = useUser();
  const [posts, setPosts] = useState<Post[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      if (!user) return;
      try {
        const response = await fetch(`/api/images/user`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "X-User-Id": user.id,
          },
        });
        if (!response.ok) throw new Error(`Failed to retrieve users`);

        const result = await response.json();

        setPosts(result.content);
      } catch (error) {
        console.log("Error: ", error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    console.log("posts: ", posts);
  }, [posts]);

  return (
    <div className="w-full h-full flex flex-col p-6 gap-5">
      <div>
        <h1 className="text-4xl">Welcome User!</h1>
      </div>
      <div className="flex flex-col gap-5">
        <div className="w-full text-center">
          <h2 className="text-3xl">User Stats</h2>
          <div className="grid grid-cols-4">
            <h3 className="text-2xl">Follower Count: 30</h3>
            <h3 className="text-2xl">Post Count: 30</h3>
            <h3 className="text-2xl">Comment Count: 40</h3>
            <h3 className="text-2xl">Likes Received: 30</h3>
          </div>
        </div>
        <div>
          <h2 className="text-3xl">User Posts</h2>
          <div>
            <Carousel>
              <CarouselContent>
                {posts.map((post, index) => (
                  <CarouselItem key={index}>
                    <Card className="p-6">
                      <CardTitle className="p-6">{post.title}</CardTitle>
                      <CardContent className="flex justify-center">
                        <Image
                          // src={image.src}
                          src={post.url}
                          alt={post.title}
                          width={900}
                          height={600}
                        />
                      </CardContent>
                      <CardFooter className="flex flex-col w-full gap-3">
                        <div className="flex flex-row w-full gap-1.5">
                          <Text />
                          <p>Prompt: {post.prompt}</p>
                        </div>
                        <div className="flex flex-row w-full gap-1.5">
                          <Calendar />
                          <p>{post.createdAt.toLocaleString()}</p>
                        </div>
                        <div className="flex flex-row justify-between w-full">
                          <div className="flex gap-4">
                            <button>
                              <HeartIcon />
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
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious />
              <CarouselNext />
            </Carousel>
          </div>
        </div>
      </div>
    </div>
  );
}
