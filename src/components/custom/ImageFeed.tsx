"use client";

import { Image } from "@nextui-org/image";
import { Card, CardContent, CardFooter, CardTitle } from "../ui/card";
import { HeartIcon, MessageCircle, Share2Icon } from "lucide-react";


const images = [
  { id: 1, src: '/placeholder.svg?height=300&width=300', prompt: 'A futuristic cityscape' },
  { id: 2, src: '/placeholder.svg?height=300&width=300', prompt: 'An alien landscape' },
  { id: 3, src: '/placeholder.svg?height=300&width=300', prompt: 'A cyberpunk character' },
  { id: 4, src: '/placeholder.svg?height=300&width=300', prompt: 'A steampunk invention' },
  { id: 5, src: '/placeholder.svg?height=300&width=300', prompt: 'A magical forest' },
  { id: 6, src: '/placeholder.svg?height=300&width=300', prompt: 'A magical forest' },
]
export default function ImageFeed() {

    return (
        <div className="flex flex-col flex-grow mx-auto w-full gap-5">
            <h1 className="text-4xl">Image Feed</h1>
            <div className="grid sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-10">
                {images.map((image) => (
                    <Card key={image.id} className="flex flex-col p-10 gap-4 w-30 rounded-lg bg-black/[.05] dark:bg-white/[.06] border border-black/[.08] dark:border-white/[.145] focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white border-black dark:border-white uppercase bg-white text-black transition duration-200 text-sm shadow-[1px_1px_rgba(0,0,0),2px_2px_rgba(0,0,0),3px_3px_rgba(0,0,0),4px_4px_rgba(0,0,0),5px_5px_0px_0px_rgba(0,0,0)] dark:shadow-[1px_1px_rgba(255,255,255),2px_2px_rgba(255,255,255),3px_3px_rgba(255,255,255),4px_4px_rgba(255,255,255),5px_5px_0px_0px_rgba(255,255,255)]">
                        <CardTitle>{image.prompt}</CardTitle>
                        <CardContent>
                            <Image 
                                // src={image.src}
                                src={"https://nextui.org/images/hero-card-complete.jpeg"}
                                alt={image.prompt}
                                width={300}
                                height={200}
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
                                    <Share2Icon/>
                                </button>
                            </div>
                        </CardFooter>
                    </Card>
                ))}
            </div>
        </div>
    );
}