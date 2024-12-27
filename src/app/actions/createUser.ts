"use server";

export async function createUser(id: string, name: string, email: string) {
    try {
        const response = await fetch(`http://localhost:3000/api/create-user`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "X-API-SECRET": process.env.API_SECRET || "",
            },
            body: JSON.stringify({ id, name, email}),
        });

        if(!response.ok) {
            throw new Error(`HTTPS error! status: ${response.status}`);
        }

        const data = await response.json();
        return data;

    } catch (error) {
        console.error("Server Error: ", error);
        return {
            success: false,
            error:
                error instanceof Error ? error.message : "Failed to create user",
        }
    }
}