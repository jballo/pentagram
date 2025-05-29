
import { Suspense } from "react";
import PostsLoading from "./loading";
import Posts from "./components/Posts";

export default function Home() {
  return (
    <main className="flex flex-col flex-grow mx-auto w-full gap-5 p-6">
      <h1 className="text-4xl">Image Feed</h1>
      <Suspense fallback={<PostsLoading />}>
        <Posts />
      </Suspense>
    </main>
  );
}
