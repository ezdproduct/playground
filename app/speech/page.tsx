"use client"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Download, Mic as MicIcon, Loader2 } from "lucide-react"
import { useMutation } from "@/hooks/use-mutation"
import { LoadingDisplay } from "@/components/ui/loading-display"
import { EmptyState } from "@/components/ui/empty-state"

type SpeechResponse = { audioUrl: string }

export default function SpeechPage() {
    const [text, setText] = useState("")
    const [voice, setVoice] = useState("male-qn-qingse")

    // Minimax voices
    const voices = [
        { id: "male-qn-qingse", name: "Qingse (Male)" },
        { id: "female-shaonv", name: "Shaonv (Female)" },
        { id: "male-qn-jingying", name: "Jingying (Male)" },
        { id: "presenter_male", name: "Presenter (Male)" },
    ]

    const {
        data,
        error,
        isLoading,
        mutate
    } = useMutation<SpeechResponse, { text: string; voice: string }>("/api/speech")

    const audioRef = useRef<HTMLAudioElement | null>(null)

    const handleGenerate = async () => {
        if (!text) return
        await mutate({ text, voice })
    }

    const audioUrl = data?.audioUrl

    return (
        <div className="mx-auto max-w-3xl space-y-8">
            <div className="space-y-2 text-center">
                <h1 className="text-3xl font-bold tracking-tight">Text to Speech</h1>
                <p className="text-muted-foreground">
                    Turn your text into lifelike spoken audio using Minimax.
                </p>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
                <Card className="flex flex-col md:col-span-1">
                    <CardHeader>
                        <CardTitle>Configuration</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <Label>Text</Label>
                            <Textarea
                                placeholder="Enter text to speak..."
                                className="min-h-[150px] resize-none"
                                value={text}
                                onChange={(e) => setText(e.target.value)}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label>Voice</Label>
                            <div className="grid grid-cols-2 gap-2">
                                {voices.map((v) => (
                                    <Button
                                        key={v.id}
                                        variant={voice === v.id ? "default" : "outline"}
                                        size="sm"
                                        onClick={() => setVoice(v.id)}
                                        className="capitalize truncate"
                                    >
                                        {v.name}
                                    </Button>
                                ))}
                            </div>
                        </div>
                    </CardContent>
                    <CardFooter className="mt-auto">
                        <Button
                            className="w-full"
                            onClick={handleGenerate}
                            disabled={isLoading || !text}
                        >
                            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Generate Speech
                        </Button>
                    </CardFooter>
                </Card>

                <Card className="flex min-h-[350px] flex-col md:col-span-1">
                    <CardHeader>
                        <CardTitle>Result</CardTitle>
                    </CardHeader>
                    <CardContent className="flex flex-1 flex-col items-center justify-center bg-muted/20 p-6 text-center">
                        {isLoading ? (
                            <LoadingDisplay text="Synthesizing..." />
                        ) : audioUrl ? (
                            <div className="flex w-full flex-col items-center gap-6">
                                <div className="flex h-24 w-24 items-center justify-center rounded-full bg-primary/10 text-primary">
                                    <MicIcon className="h-10 w-10" />
                                </div>
                                <audio
                                    ref={audioRef}
                                    src={audioUrl}
                                    controls
                                    className="w-full"
                                />
                            </div>
                        ) : (
                            <EmptyState icon={MicIcon} text="Audio will appear here" />
                        )}
                        {error && <p className="mt-4 text-sm text-destructive">{error}</p>}
                    </CardContent>
                    <CardFooter className="justify-end gap-2">
                        {audioUrl && (
                            <Button variant="secondary" size="sm" asChild>
                                <a href={audioUrl} download="speech.mp3">
                                    <Download className="mr-2 h-4 w-4" />
                                    Download
                                </a>
                            </Button>
                        )}
                    </CardFooter>
                </Card>
            </div>
        </div>
    )
}
