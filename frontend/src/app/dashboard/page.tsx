"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/atoms/accordion";
import { Button } from "@/atoms/button";
import { Card, CardContent } from "@/atoms/card";
import { Input } from "@/atoms/input";
import { useUser } from "@clerk/nextjs";
import { Image } from "@nextui-org/image";
import { SaveIcon, Text } from "lucide-react";
import { ChangeEvent, useState } from "react";

interface ImageObj {
  id: string;
  title: string;
  model: string;
  prompt: string;
  url: string;
  authorId: string;
}

export default function DashboardPage() {
  const { user } = useUser();
  const [inputText, setInputText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [images, setImages] = useState<ImageObj[]>([]);
  const [imgCount, setImgCount] = useState<number>(1);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const prompt = inputText;
      const model = "FLUX.1-schnell";

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

      if (result.images && result.images.length > 0) {
        console.log("Image count from api: ", result.images.length);
        // const images: string[] = [];
        // for (let i = 0; i < result.imageUrls.length; i++) {
        //   images.push(result.imageUrls[i]);
        // }

        // setImageUrls(images);
        if (!user) {
          throw new Error(`No user signed in`);
        }

        const images: ImageObj[] = [];
        for (let i = 0; i < result.images.length; i++) {
          const id: string = result.images[i].filename.split(".")[0];
          const newImage: ImageObj = {
            id: id,
            title: "",
            model: model,
            prompt: prompt,
            url: result.images[i].url,
            authorId: user.id,
          };
          images.push(newImage);
        }

        setImages(images);
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

  const updatePrompt = (id: string, title: string) => {
    console.log("id: ", id);
    const newImages: ImageObj[] = images.map(img => {
      if (img.id === id) {
        return {
          ...img,
          title: title,
        };
      }
      return img;
    });
    setImages(newImages);
  };

  const uploadImage = async (id: string) => {
    try {
      console.log("id: ", id);

      const selectedImage = images.find(img => img.id === id);

      if (!selectedImage) throw new Error(`Failed to select image for upload`);

      const response = await fetch(`/api/images/upload`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          post_id: selectedImage.id,
          post_title: selectedImage.title,
          post_model: selectedImage.model,
          post_prompt: selectedImage.prompt,
          post_url: selectedImage.url,
          post_authorId: selectedImage.authorId,
        }),
      });

      if (!response.ok) throw new Error(`Failed to upload image`);

      const result = await response.json();

      console.log("Result: ", result);
    } catch (error) {
      console.log("Error: ", error);
    }
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
      <div className="flex flex-row gap-3">
        <div className="flex flex-col w-2/3">
          {images.length > 0 ? (
            <div className="flex flex-col w-full gap-8">
              {images.map((img, index) => (
                <div key={index} className="flex flex-col w-full gap-2">
                  <Image
                    isBlurred
                    isZoomed
                    alt="NextUI hero Image"
                    src={img.url}
                    // width={800}
                    className="w-full"
                  />
                  <div className="w-full flex flex-row gap-3">
                    <Text />
                    Prompt: {img.prompt}
                  </div>
                  <div className="flex flex-row w-full gap-3">
                    <Input
                      type="text"
                      placeholder="Title here..."
                      value={img.title}
                      onChange={e => updatePrompt(img.id, e.target.value)}
                    />
                    <Button
                      variant="outline"
                      onClick={() => uploadImage(img.id)}
                    >
                      <SaveIcon />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col w-full">
              <Image
                isBlurred
                isZoomed
                alt="NextUI hero Image"
                src="https://nextui.org/images/hero-card-complete.jpeg"
                className="w-full"
              />
            </div>
          )}
        </div>
        <Accordion type="single" collapsible className="w-1/3">
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
