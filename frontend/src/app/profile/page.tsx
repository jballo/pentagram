
import { Suspense } from "react";
import { Posts } from "./components/posts";
import Loading from "./loading";
import ProfileStats from "./components/profileStats";

export default function ProfilePage() {
  return (
    <div className="w-full h-full flex flex-col p-6 gap-5">
      <div>
        <h1 className="text-4xl">Welcome User!</h1>
      </div>
      <div className="flex flex-col gap-5">
        <Suspense fallback={<div>Loading...</div>} >
          <ProfileStats />
        </Suspense>
        <div className="w-full h-full">
          <h2 className="text-3xl">User Posts</h2>
          <div className="w-full h-full">
            <Suspense fallback={<Loading />}>
              <Posts />
            </Suspense>
          </div>
        </div>
      </div>
    </div>
  );
}
