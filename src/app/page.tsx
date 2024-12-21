"use server";

import Dashboard from "@/components/custom/Dashboard";
import { generateImage } from "./actions/generateImage";


export default async function Home() {
    return <Dashboard generateImage={generateImage} />
}