"use client";

import { Card, CardContent, CardFooter, CardTitle } from "@/atoms/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/atoms/carousel";
import { Image } from "@nextui-org/image";
import { HeartIcon, MessageCircle, Share2Icon } from "lucide-react";

const images = [
  {
    id: 1,
    src: "/placeholder.svg?height=300&width=300",
    prompt: "A futuristic cityscape",
  },
  {
    id: 2,
    src: "/placeholder.svg?height=300&width=300",
    prompt: "An alien landscape",
  },
  {
    id: 3,
    src: "/placeholder.svg?height=300&width=300",
    prompt: "A cyberpunk character",
  },
  {
    id: 4,
    src: "/placeholder.svg?height=300&width=300",
    prompt: "A steampunk invention",
  },
  {
    id: 5,
    src: "/placeholder.svg?height=300&width=300",
    prompt: "A magical forest",
  },
  {
    id: 6,
    src: "/placeholder.svg?height=300&width=300",
    prompt: "A magical forest",
  },
];

export default function ProfilePage() {
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
                {images.map(image => (
                  <CarouselItem key={image.id}>
                    <Card key={image.id} className="">
                      <CardTitle>{image.prompt}</CardTitle>
                      <CardContent className="flex justify-center">
                        <Image
                          // src={image.src}
                          src={
                            "https://nextui.org/images/hero-card-complete.jpeg"
                          }
                          alt={image.prompt}
                          width={900}
                          height={600}
                        />
                      </CardContent>
                      <CardFooter className="flex justify-between">
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
