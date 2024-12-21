"use client";

import Header from "@/components/custom/header";
import ImageFeed from "@/components/custom/ImageFeed";
import ImageGenerate from "@/components/custom/ImageGenerate";
import UserProfile from "@/components/custom/UserProfile";
import { useState } from "react";


interface ImageGeneratorProps {
  generateImage: (
    text: string
  ) => Promise<{ success: boolean; imageUrl?: string; error?: string; }>;
}

export default function Dashboard({ generateImage }: ImageGeneratorProps) {
  const [view, setView] = useState<'feed' | 'generate' | 'profile'>("feed");

  return (
    // TODO: Update the UI here to show the images generated
    
    <div className="flex flex-col min-h-screen p-8">
      <Header setView={setView} />
      <main className="container mx-auto px-4 py-8 flex-grow flex flex-col">
        {/* Main content can go here */}
        {view === 'feed' && <ImageFeed />}
        {view === 'generate' && <ImageGenerate generateImage={generateImage} />}
        {view == 'profile' && <UserProfile />}
      </main>
    </div>
  );
}
