"use client";

import Header from "@/components/custom/header";
import ImageFeed from "@/components/custom/ImageFeed";
import ImageGenerate from "@/components/custom/ImageGenerate";
import UserProfile from "@/components/custom/UserProfile";
import { useUser } from "@clerk/nextjs";
import { useEffect, useState } from "react";


interface ImageGeneratorProps {
  generateImage: (
    text: string
  ) => Promise<{ success: boolean; imageUrl?: string; error?: string; }>;
}

interface UserCreationProps {
  createUser: (
    id: string,
    name: string,
    email: string,
  ) => Promise<{success: boolean; message?: string; error?: string; }>;
}

interface UserExistenceProps {
  userExists: (
    id: string
  ) => Promise<{success: boolean; message?: string; userDoesExist: boolean; error?: string; }>;
}

interface DashboardProps {
  generateImage: ImageGeneratorProps["generateImage"];
  createUser: UserCreationProps["createUser"];
  userExists: UserExistenceProps["userExists"];
}

export default function Dashboard({ generateImage, createUser, userExists }: DashboardProps) {
  const { user, isSignedIn } = useUser();
  const [view, setView] = useState<'feed' | 'generate' | 'profile'>("feed");

  useEffect( () => {
    const userCreate = async () => {
      if(user && isSignedIn) {
        const id = user.id;
        const name = user.fullName || "";
        const email = user.primaryEmailAddress?.emailAddress || "";
  
        try {
          const userDoesExist = await userExists(id);
          
          if (!userDoesExist.userDoesExist) {
            const result = await createUser(id, name, email);
    
            if(!result.success) {
              throw new Error(result.error || "Failed to create user");
            }
    
            console.log("Succesfully created user");
          }
  
        } catch (error) {
          console.error("Error: ", error);
        }
      }
    }
    userCreate();
    
  }, [user, isSignedIn, createUser]);



  

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
