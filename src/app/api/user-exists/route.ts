import { db } from '@vercel/postgres';
import { NextResponse } from 'next/server';


export async function POST(request: Request) {
    const body = await request.json();
    const { id } = body;


    const client = await db.connect();

    try {

       const user = await client.sql`SELECT * FROM Users WHERE id = ${id}`;

       console.log(user.rows);
       
       if(user.rows.length === 0) {
            console.log("User does not exist.");
            return NextResponse.json({
                success: true,
                message:  "User does not exist.",
                userDoesExist: false,
            })
       }

       console.log("User does exist");
    
        return NextResponse.json({
            success: true,
            message: "User does exist.",
            userDoesExist: true
        });
        
    } catch (error) {
        console.error("Error processing request: ", error);
        return NextResponse.json(
            { success: false, error: "Failed to check if user exists"},
            { status: 500 }
        );
    }
}