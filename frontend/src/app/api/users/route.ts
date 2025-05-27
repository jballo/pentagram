import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client/edge'
import { withAccelerate } from '@prisma/extension-accelerate'
import { WebhookEvent } from '@clerk/nextjs/server';
import { headers } from 'next/headers';
import { Webhook } from 'svix';


const webhookSecret = process.env.CLERK_WEBHOOK_SECRET || ``


export async function POST(request: Request) {

    const prisma = new PrismaClient().$extends(withAccelerate());
    try {

        const payloadString = await request.text();
        const headerPayload = await headers();

        const svixHeaders = {
            'svix-id': headerPayload.get('svix-id')!,
            'svix-timestamp': headerPayload.get('svix-timestamp')!,
            'svix-signature': headerPayload.get('svix-signature')!,
        };

        const wh = new Webhook(webhookSecret);
        const event = wh.verify(payloadString, svixHeaders) as WebhookEvent;

        const type = event.type;

        console.log("type: ", type);
        console.log("event: ", event);

        if (type !== "user.created") throw new Error(`Wrong event from clerk webhook!`);
        
        const user_id = event.data.id;
        const user_email = event.data.email_addresses[0].email_address;

        await prisma.user.create({
            data: {
                id: user_id,
                email: user_email
            }
        });

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
    } finally {
        await prisma.$disconnect();
    }
}