"use client";
import { Skeleton } from "@/atoms/skeleton";

export default function PostsLoading() {
    return (<div className="grid sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-10">
        <Skeleton className="w-30 h-96 rounded-lg" />
        <Skeleton className="w-30 h-96 rounded-lg" />
        <Skeleton className="w-30 h-96 rounded-lg" />
        <Skeleton className="w-30 h-96 rounded-lg" />
        <Skeleton className="w-30 h-96 rounded-lg" />
        <Skeleton className="w-30 h-96 rounded-lg" />
        <Skeleton className="w-30 h-96 rounded-lg" />
        <Skeleton className="w-30 h-96 rounded-lg" />
    </div>);
}