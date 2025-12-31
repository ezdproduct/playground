import { NextResponse } from "next/server"

export async function POST(req: Request) {
    try {
        const { prompt, size = "1024x1024" } = await req.json()

        const baseUrl = process.env.AI_API_BASE_URL
        const apiKey = process.env.AI_API_KEY

        // Fallback Mock if no API key (for testing/demo)
        if (!apiKey || !baseUrl) {
            // Simulate delay
            await new Promise((resolve) => setTimeout(resolve, 2000))
            return NextResponse.json({
                // Return a placeholder image
                imageUrl: "https://images.unsplash.com/photo-1738167886981-d2275440d995?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxeZGl0b3JpYWwtZmVlZHwzfHx8ZW58MHx8fHx8"
            })
        }

        const response = await fetch(`${baseUrl}/images/generations`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${apiKey}`,
            },
            body: JSON.stringify({
                prompt,
                n: 1,
                size,
                response_format: "url",
            }),
        })

        if (!response.ok) {
            throw new Error(`API Error: ${response.statusText}`)
        }

        const data = await response.json()
        // Adapt to standard OpenAI format
        const imageUrl = data.data?.[0]?.url

        return NextResponse.json({ imageUrl })
    } catch (error) {
        console.error("Image Gen Error:", error)
        return NextResponse.json(
            { error: "Failed to generate image" },
            { status: 500 }
        )
    }
}
