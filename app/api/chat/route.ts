import { NextResponse } from "next/server"

export async function POST(req: Request) {
    try {
        const { messages } = await req.json()

        const baseUrl = process.env.AI_API_BASE_URL
        const apiKey = process.env.AI_API_KEY

        // Fallback Mock
        if (!apiKey || !baseUrl) {
            await new Promise((resolve) => setTimeout(resolve, 1500))
            return NextResponse.json({
                text: "This is a simulated response because no API key is configured. I can help you test the UI!",
                usage: { prompt_tokens: 0, completion_tokens: 0, total_tokens: 0 }
            })
        }

        const response = await fetch(`${baseUrl}/chat/completions`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${apiKey}`,
            },
            body: JSON.stringify({
                model: "gpt-3.5-turbo", // Default or env var
                messages,
            }),
        })

        if (!response.ok) {
            throw new Error(`API Error: ${response.statusText}`)
        }

        const data = await response.json()
        const text = data.choices?.[0]?.message?.content || "No response."
        const usage = data.usage

        return NextResponse.json({ text, usage })
    } catch (error) {
        console.error("Chat Error:", error)
        return NextResponse.json(
            { error: "Failed to process chat" },
            { status: 500 }
        )
    }
}
