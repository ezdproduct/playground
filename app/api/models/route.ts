import { NextResponse } from "next/server"

export async function GET() {
    try {
        const baseUrl = process.env.AI_API_BASE_URL
        const apiKey = process.env.AI_API_KEY

        // Fallback Mock if no API key
        if (!apiKey || !baseUrl) {
            const mockData = {
                code: 200,
                data: [
                    {
                        id: "gpt-4o",
                        object: "model",
                        created: 1715366400,
                        owned_by: "system",
                        root: "gpt-4o"
                    },
                    {
                        id: "gpt-4-turbo",
                        object: "model",
                        created: 1712361600,
                        owned_by: "system",
                        root: "gpt-4-turbo"
                    }
                ],
                success: true
            }
            return NextResponse.json(mockData)
        }

        // Using user-provided headers configuration
        const response = await fetch(`${baseUrl}/models`, {
            method: "GET",
            headers: {
                "Content-Type": "application/vnd.api+json",
                "Authorization": apiKey // User specified raw key without Bearer prefix
            },
            redirect: "follow",
        })

        if (!response.ok) {
            throw new Error(`API Error: ${response.status} ${response.statusText}`)
        }

        const data = await response.json()
        return NextResponse.json(data)

    } catch (error) {
        console.error("Model List Error:", error)
        return NextResponse.json(
            { error: "Failed to fetch models" },
            { status: 500 }
        )
    }
}
