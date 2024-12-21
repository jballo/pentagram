import { db } from '@vercel/postgres';
import { NextResponse } from 'next/server';


export async function POST(request: Request) {
    const body = await request.json();
    const { id, name, email } = body;
    console.log("UUID: ", id);
    console.log("Name: ", name);
    console.log("Email: ", email);


    const client = await db.connect();

    try {
        await client.sql`CREATE TABLE IF NOT EXISTS Users ( Id varchar(255) PRIMARY KEY, Name varchar(255), Email varchar(255) );`;

        await client.sql`INSERT INTO Users (Id, Name, Email) VALUES (${id}, ${name}, ${email})`;

        return NextResponse.json({
            success: true,
            message: "User created successfully!"
        });
        
    } catch (error) {
        console.error("Error processing request: ", error);
        return NextResponse.json(
            { success: false, error: "Failed to create user"},
            { status: 500 }
        );
    }
}