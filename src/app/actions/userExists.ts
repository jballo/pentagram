"use server";

export async function userExists(id: string) {

    try {
        const response = await fetch(`http://localhost:3000/api/user-exists`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "X-API-SECRET": process.env.API_SECRET || "",
            },
            body: JSON.stringify({ id }),
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
                error instanceof Error ? error.message : "Failed to check if user exists",
        }
    }
}