import { Card, CardContent, CardFooter, CardTitle } from "@/atoms/card";
import { Image } from "@nextui-org/image";
import { PrismaClient } from "@prisma/client/edge";
import { withAccelerate } from "@prisma/extension-accelerate";
import { MessageCircle, Share2Icon, Text } from "lucide-react";
import HeartButton from "./HeartButton";


export default async function Posts() {

    const prisma = new PrismaClient().$extends(withAccelerate());

    const posts = await prisma.post.findMany({
        orderBy: {
            createdAt: 'desc'
        }
    });


    return (<div className="grid sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-10">
        {posts.map((post) => (
            <Card
                key={post.id}
                className="flex flex-col p-10 gap-4 w-30 rounded-lg bg-black/[.05] dark:bg-white/[.06] border border-black/[.08] dark:border-white/[.145] focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white border-black dark:border-white uppercase bg-white text-black transition duration-200 text-sm shadow-[1px_1px_rgba(0,0,0),2px_2px_rgba(0,0,0),3px_3px_rgba(0,0,0),4px_4px_rgba(0,0,0),5px_5px_0px_0px_rgba(0,0,0)] dark:shadow-[1px_1px_rgba(255,255,255),2px_2px_rgba(255,255,255),3px_3px_rgba(255,255,255),4px_4px_rgba(255,255,255),5px_5px_0px_0px_rgba(255,255,255)]"
            >
                <CardTitle>{post.prompt}</CardTitle>
                <CardContent className="py-0">
                    <Image
                        src={post.url}
                        alt={post.prompt}
                        width={300}
                        height={200}
                    />
                </CardContent>
                <CardFooter className="flex flex-col gap-2.5">
                    <div className="flex flex-row gap-3 w-full">
                        <Text />
                        <p className="h-[42px] overflow-auto">{post.prompt}</p>
                    </div>
                    <div className="flex flex-row w-full justify-between">
                        <div className="flex gap-4">
                            <HeartButton id={post.id} />
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
    </div>);
}