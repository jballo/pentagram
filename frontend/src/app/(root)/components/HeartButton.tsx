"use client";

import { HeartIcon } from "lucide-react";

export default function HeartButton({ id }: { id: number }) {

    const likePost = async () => {
        try {
            const response = await fetch(`/api/posts/like`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ id })
            })

            if (!response.ok) throw new Error(`Failed to like or unlike post`);

            const result = await response.json();

            console.log("Result: ", result);

        } catch (error) {
            console.log("Error: ", error);
        }
    }

    return (<button onClick={likePost}>
        <HeartIcon />
    </button>);
}