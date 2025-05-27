"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/atoms/accordion";
import { Card, CardContent } from "@/atoms/card";
import { Input } from "@/atoms/input";
import { Image } from "@nextui-org/image";
import { ChangeEvent, useState } from "react";

export default function DashboardPage() {
  const [inputText, setInputText] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const [imageUrls, setImageUrls] = useState<string[]>([
    "https://nextui.org/images/hero-card-complete.jpeg",
  ]);
  const [imgCount, setImgCount] = useState<number>(1);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // const result = await generateImage(inputText, imgCount);

      const response = await fetch(`/api/images/generate`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          text: inputText,
          count: imgCount,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to generate image");
      }

      const result = await response.json();

      if (result.imageUrls && result.imageUrls.length > 0) {
        console.log("Image count from api: ", result.imageUrls.length);
        const images: string[] = [];
        for (let i = 0; i < result.imageUrls.length; i++) {
          images.push(result.imageUrls[i]);
        }

        setImageUrls(images);
      }

      setImgCount(1);
      setInputText("");
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.valueAsNumber;
    setImgCount(value);
  };

  return (
    <div className="flex flex-col flex-grow mx-auto w-full p-6 gap-5">
      <h2 className="text-4xl">Lets Create Some Images!</h2>
      {/* Text Field Form */}
      <div className="w-full mx-auto mt-auto">
        <form onSubmit={handleSubmit} className="w-full">
          <div className="flex gap-2">
            <input
              type="text"
              value={inputText}
              onChange={e => setInputText(e.target.value)}
              className="flex-1 p-3 rounded-lg bg-black/[.05] dark:bg-white/[.06] border border-black/[.08] dark:border-white/[.145] focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white border-black dark:border-white uppercase bg-white text-black transition duration-200 text-sm shadow-[1px_1px_rgba(0,0,0),2px_2px_rgba(0,0,0),3px_3px_rgba(0,0,0),4px_4px_rgba(0,0,0),5px_5px_0px_0px_rgba(0,0,0)] dark:shadow-[1px_1px_rgba(255,255,255),2px_2px_rgba(255,255,255),3px_3px_rgba(255,255,255),4px_4px_rgba(255,255,255),5px_5px_0px_0px_rgba(255,255,255)]"
              placeholder="Describe the image you want to generate..."
              disabled={isLoading}
            />
            <Input
              type="number"
              min={1}
              max={3}
              value={imgCount}
              onChange={handleChange}
              className="w-28 p-3 h-12 rounded-lg bg-black/[.05] dark:bg-white/[.06] border border-black/[.08] dark:border-white/[.145] focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white border-black dark:border-white uppercase bg-white text-black transition duration-200 text-sm shadow-[1px_1px_rgba(0,0,0),2px_2px_rgba(0,0,0),3px_3px_rgba(0,0,0),4px_4px_rgba(0,0,0),5px_5px_0px_0px_rgba(0,0,0)] dark:shadow-[1px_1px_rgba(255,255,255),2px_2px_rgba(255,255,255),3px_3px_rgba(255,255,255),4px_4px_rgba(255,255,255),5px_5px_0px_0px_rgba(255,255,255)]"
            />
            <button
              type="submit"
              disabled={isLoading}
              className="px-8 py-0.5  border-2 border-black dark:border-white uppercase bg-white text-black transition duration-200 text-sm shadow-[1px_1px_rgba(0,0,0),2px_2px_rgba(0,0,0),3px_3px_rgba(0,0,0),4px_4px_rgba(0,0,0),5px_5px_0px_0px_rgba(0,0,0)] dark:shadow-[1px_1px_rgba(255,255,255),2px_2px_rgba(255,255,255),3px_3px_rgba(255,255,255),4px_4px_rgba(255,255,255),5px_5px_0px_0px_rgba(255,255,255)] "
            >
              {isLoading ? "Generating..." : "Generate"}
            </button>
          </div>
        </form>
      </div>
      <div className="flex flex-row gap-6">
        <div className="flex flex-col">
          {imageUrls &&
            imageUrls.length > 0 &&
            imageUrls.map((img, index) => (
              <Image
                key={index}
                isBlurred
                isZoomed
                alt="NextUI hero Image"
                src={imageUrls[index]}
                // width={800}
                className="w-full"
              />
            ))}
        </div>
        <Accordion type="single" collapsible>
          <AccordionItem value="item-1">
            <AccordionTrigger>
              <h3 className="text-2xl">
                Select Model (Default: black-forest-labs/FLUX.1-schnell)
              </h3>
            </AccordionTrigger>
            <AccordionContent>
              <div className="flex flex-col gap-3">
                <Card className="bg-cyan-200 py-4 border-black dark:border-white uppercase  text-black transition duration-200 text-sm shadow-[1px_1px_rgba(0,0,0),2px_2px_rgba(0,0,0),3px_3px_rgba(0,0,0),4px_4px_rgba(0,0,0),5px_5px_0px_0px_rgba(0,0,0)] dark:shadow-[1px_1px_rgba(255,255,255),2px_2px_rgba(255,255,255),3px_3px_rgba(255,255,255),4px_4px_rgba(255,255,255),5px_5px_0px_0px_rgba(255,255,255)]">
                  <CardContent>
                    <p className="text-medium">
                      black-forest-labs/FLUX.1-schnell
                    </p>
                  </CardContent>
                </Card>
                <Card className="py-4 bg-white border-black dark:border-white uppercase text-black transition duration-200 text-sm shadow-[1px_1px_rgba(0,0,0),2px_2px_rgba(0,0,0),3px_3px_rgba(0,0,0),4px_4px_rgba(0,0,0),5px_5px_0px_0px_rgba(0,0,0)] dark:shadow-[1px_1px_rgba(255,255,255),2px_2px_rgba(255,255,255),3px_3px_rgba(255,255,255),4px_4px_rgba(255,255,255),5px_5px_0px_0px_rgba(255,255,255)]">
                  <CardContent>
                    <p className="text-medium">(Coming Soon) Midjourney</p>
                  </CardContent>
                </Card>
                <Card className="py-4 bg-white border-black dark:border-white uppercas text-black transition duration-200 text-sm shadow-[1px_1px_rgba(0,0,0),2px_2px_rgba(0,0,0),3px_3px_rgba(0,0,0),4px_4px_rgba(0,0,0),5px_5px_0px_0px_rgba(0,0,0)] dark:shadow-[1px_1px_rgba(255,255,255),2px_2px_rgba(255,255,255),3px_3px_rgba(255,255,255),4px_4px_rgba(255,255,255),5px_5px_0px_0px_rgba(255,255,255)]">
                  <CardContent>
                    <p className="text-medium">
                      (Coming Soon) black-forest-labs/FLUX.1-dev
                    </p>
                  </CardContent>
                </Card>
                <Card className="py-4 bg-white border-black dark:border-white uppercase text-black transition duration-200 text-sm shadow-[1px_1px_rgba(0,0,0),2px_2px_rgba(0,0,0),3px_3px_rgba(0,0,0),4px_4px_rgba(0,0,0),5px_5px_0px_0px_rgba(0,0,0)] dark:shadow-[1px_1px_rgba(255,255,255),2px_2px_rgba(255,255,255),3px_3px_rgba(255,255,255),4px_4px_rgba(255,255,255),5px_5px_0px_0px_rgba(255,255,255)]">
                  <CardContent>
                    <p className="text-medium">
                      (Coming Soon) stable-diffusion-3.5-large-turbo
                    </p>
                  </CardContent>
                </Card>
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
    </div>
  );
}
