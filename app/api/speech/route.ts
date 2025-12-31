import { NextResponse } from "next/server"

export async function POST(req: Request) {
    try {
        const { text, voice, speed, vol, pitch, language } = await req.json()

        if (!text) {
            return NextResponse.json({ error: "Text is required" }, { status: 400 })
        }

        const envBaseUrl = process.env.AI_API_BASE_URL
        if (!envBaseUrl) {
            return NextResponse.json({ error: "AI_API_BASE_URL not configured" }, { status: 500 })
        }
        const rootUrl = new URL(envBaseUrl).origin
        const apiKey = process.env.AI_API_KEY

        if (!apiKey) {
            return NextResponse.json({ error: "API Key not configured" }, { status: 500 })
        }

        // Minimax T2A V2 Payload
        const payload = {
            model: "speech-01-turbo",
            text: text,
            stream: false,
            voice_setting: {
                voice_id: voice || "male-qn-qingse",
                speed: speed ?? 1,
                vol: vol ?? 1,
                pitch: pitch ?? 0,
                emotion: "happy"
            },
            audio_setting: {
                sample_rate: 32000,
                bitrate: 128000,
                format: "mp3",
                channel: 1
            }
        }

        const url = `${rootUrl}/minimax/v1/t2a_v2`
        console.log(`[Speech] Sending request to ${url}`)

        const response = await fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${apiKey}`,
            },
            body: JSON.stringify(payload),
        })

        if (!response.ok) {
            const errorText = await response.text()
            console.error("[Speech] Upstream Error:", response.status, errorText)
            return NextResponse.json(
                { error: `Upstream API Error: ${response.status} - ${errorText}` },
                { status: response.status }
            )
        }

        const data = await response.json()

        if (data.base_resp?.status_code !== 0) {
            console.error("[Speech] Minimax Internal Error:", data.base_resp)
            return NextResponse.json(
                { error: `Minimax Error: ${data.base_resp?.status_msg}` },
                { status: 400 }
            )
        }

        const hexAudio = data.data?.audio
        if (!hexAudio) {
            throw new Error("No audio data received from upstream")
        }

        // Convert Hex to Base64
        const buffer = Buffer.from(hexAudio, "hex")
        const base64Audio = buffer.toString("base64")
        const audioUrl = `data:audio/mp3;base64,${base64Audio}`

        return NextResponse.json({ audioUrl })

    } catch (error: any) {
        console.error("[Speech] Critical Handling Error:", error)
        return NextResponse.json(
            { error: "Failed to generate speech" },
            { status: 500 }
        )
    }
}
