import { NextResponse } from "next/server"

export async function POST(req: Request) {
    try {
        const { text, voice, model = "speech-2.6-hd", speed, vol, pitch, language } = await req.json()

        if (!text) {
            return NextResponse.json({ error: "Text is required" }, { status: 400 })
        }

        const envBaseUrl = process.env.AI_API_BASE_URL || "https://ai.t8star.cn/v1"
        const rootUrl = new URL(envBaseUrl).origin
        const apiKey = process.env.AI_API_KEY

        // Fallback Mock
        if (!apiKey) {
            await new Promise((resolve) => setTimeout(resolve, 1000))
            return NextResponse.json({
                task_id: 987654321,
                base_resp: {
                    status_code: 0,
                    status_msg: "success"
                }
            })
        }

        const payload = {
            model: model,
            text: text,
            language_boost: language || "auto",
            voice_setting: {
                voice_id: voice || "male-qn-qingse",
                speed: speed ?? 1,
                vol: vol ?? 1,
                pitch: pitch ?? 0,
            },
            audio_setting: {
                sample_rate: 32000,
                bitrate: 128000,
                format: "mp3",
                channel: 1,
            }
        }

        const response = await fetch(`${rootUrl}/minimax/v1/t2a_async_v2`, {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${apiKey}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify(payload),
        })

        if (!response.ok) {
            const errorText = await response.text()
            console.error("Async Speech API Error:", response.status, errorText)
            throw new Error(`API Error: ${response.status} - ${errorText}`)
        }

        const data = await response.json()
        return NextResponse.json(data)

    } catch (error) {
        console.error("Async Speech Error:", error)
        return NextResponse.json(
            { error: "Failed to create speech task" },
            { status: 500 }
        )
    }
}
