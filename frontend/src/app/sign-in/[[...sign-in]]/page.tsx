"use client";
import { SignIn } from '@clerk/nextjs'
import { neobrutalism } from '@clerk/themes';

export default function Page() {
    return (
        <div className='flex w-full min-h-screen justify-center items-center'>
            <SignIn appearance={{ baseTheme: neobrutalism }}/>
        </div>
    );
}