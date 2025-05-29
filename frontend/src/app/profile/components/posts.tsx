import { Card, CardContent, CardFooter, CardTitle } from "@/atoms/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/atoms/carousel";
import { currentUser } from "@clerk/nextjs/server";
import { Image } from "@nextui-org/image";
import {
  Calendar,
  HeartIcon,
  MessageCircle,
  Share2Icon,
  Text,
} from "lucide-react";

import { PrismaClient } from "@prisma/client/edge";
import { withAccelerate } from "@prisma/extension-accelerate";

export async function Posts() {
  const user = await currentUser();
  const prisma = new PrismaClient().$extends(withAccelerate());

  if (!user?.id) return <div>Please sign in to view your posts</div>;

  const posts = await prisma.post.findMany({
    where: {
      authorId: user.id,
    },
  });

  return (
    <Carousel>
      <CarouselContent>
        {posts.map((post) => (
          <CarouselItem key={post.id}>
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
  );
}
