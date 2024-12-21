"use client";

import { useState } from "react";
import { Image } from "@nextui-org/image";



export default function ImageGenerate() {
    const [inputText, setInputText] = useState("");
      const [isLoading, setIsLoading] = useState(false);

      const [imageSrc, setImageSrc] = useState("https://nextui.org/images/hero-card-complete.jpeg")
    
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
    
        try {
          const response = await fetch("/api/generate-image", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ text: inputText }),
          });
    
          const data = await response.json();

          if(!data.success){
            throw new Error(data.error || "Failed to generate image");
          }

          if(data.imageUrl){
            // const img = new Image();
            // img.onload = () => {
            //   setImageSrc(data.imageUrl);
            // };
            // img.src = data.imageUrl;
            setImageSrc(data.imageUrl);
          }

          setInputText("");
        } catch (error) {
          console.error("Error:", error);
        } finally {
          setIsLoading(false);
        }
    };

    return (
        <div className="flex flex-col flex-grow mx-auto w-full">
            <h1>Lets Create Some Images!</h1>
            <Image
                isBlurred
                isZoomed
                alt="NextUI hero Image"
                src={imageSrc}
                width={300}
            />
            <footer className="w-full mx-auto mt-auto">
                <form onSubmit={handleSubmit} className="w-full">
                    <div className="flex gap-2">
                        <input
                            type="text"
                            value={inputText}
                            onChange={e => setInputText(e.target.value)}
                            className="flex-1 p-3 rounded-lg bg-black/[.05] dark:bg-white/[.06] border border-black/[.08] dark:border-white/[.145] focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white"
                            placeholder="Describe the image you want to generate..."
                            disabled={isLoading}
                        />
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="px-6 py-3 rounded-lg bg-foreground text-background hover:bg-[#383838] dark:hover:bg-[#ccc] transition-colors disabled:opacity-50"
                        >
                            {isLoading ? "Generating..." : "Generate"}
                        </button>
                    </div>
                </form>
            </footer>
        </div>
    );
}