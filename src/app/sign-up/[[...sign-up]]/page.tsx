"use client";
import { SignUp } from '@clerk/nextjs'
import { neobrutalism } from '@clerk/themes';

export default function Page() {
  return (
    <div className='flex w-full min-h-screen justify-center items-center'>
        <SignUp appearance={{ baseTheme: neobrutalism }} />
    </div>
  );
}