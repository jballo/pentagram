"use client"

import { Home, PlusSquare, User } from "lucide-react";
// import { Avatar } from "../ui/avatar";

interface HeaderProps {
    setView: React.Dispatch<React.SetStateAction<'feed' | 'generate' | 'profile'>>;
}

export default function Header({ setView }: HeaderProps) {
    return (
        <div className="flex flex-row w-full h-10 justify-between">
            <h1 className="text-4xl">Welcome to Pentagram</h1>
            <div className="flex gap-10">
                <button
                    onClick={() => {
                        setView('feed');
                    }}
                >
                    <Home />
                </button>
                <button
                    onClick={() => {
                        setView('generate');
                    }}
                >
                    <PlusSquare />
                </button>
                <button
                    onClick={() => {
                        setView('profile');
                    }}
                >
                    {/* <Avatar /> */}
                    <User />
                </button>
            </div>
        </div>
    );
}