"use server";

import Dashboard from "@/components/custom/Dashboard";
import { generateImage } from "./actions/generateImage";
import { createUser } from "./actions/createUser";
import { userExists } from "./actions/userExists";

export default async function Home() {
    return <Dashboard generateImage={generateImage} createUser={createUser} userExists={userExists} />
}