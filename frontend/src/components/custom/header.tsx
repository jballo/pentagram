"use client"

import { Home, PlusSquare, User } from "lucide-react";
import { useRouter } from "next/navigation";
import { Button } from "../ui/button";
import { SignedIn, SignedOut, SignInButton, SignOutButton } from "@clerk/nextjs";

export default function Header() {
    const router = useRouter();

    return (
        <div className="flex flex-row w-full h-10 justify-between p-6">
            <h1 className="text-4xl">Pentagram</h1>
            <div className="flex gap-10">
                <button
                    onClick={() => router.push('/')}
                >
                    <Home />
                </button>
                <button
                    onClick={() => router.push('/dashboard')}
                >
                    <PlusSquare />
                </button>
                <button
                    onClick={() => router.push('/profile')}
                >
                    <User />
                </button>
                <SignedOut>
                    <SignInButton>
                        <Button>
                            Sign In
                        </Button>
                    </SignInButton>
                </SignedOut>
                <SignedIn>
                    <SignOutButton>
                        <Button>
                            Sign out
                        </Button>
                    </SignOutButton>
                </SignedIn>
            </div>
        </div>
    );
}