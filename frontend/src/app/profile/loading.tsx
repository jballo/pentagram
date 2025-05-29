"use client";
import { Skeleton } from "@/atoms/skeleton";

export default function Loading() {
  return (<div className="flex flex-col items-center h-[66vh] w-full gap-2">
    <Skeleton className="h-2/3 w-2/3 rounded-xl" />
    <Skeleton className="h-[10%] w-4/5 rounded-xl" />
    <Skeleton className="h-[10%] w-4/5 rounded-xl" />
  </div>);
}
