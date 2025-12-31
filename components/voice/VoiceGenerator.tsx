"use client"

import { useState, useRef } from "react"
import {
    Button,
    Textarea,
    Input,
    Card,
    CardBody,
    CardHeader,
    CardFooter,
    Slider,
    Select,
    SelectItem,
    Switch,
    Divider,
    Chip
} from "@heroui/react"
import { Download, Mic as MicIcon, Loader2, Copy, Settings2, PlayCircle, PauseCircle, CheckCircle2, UploadCloud } from "lucide-react"
import { useMutation } from "@/hooks/use-mutation"
import { LoadingDisplay } from "@/components/ui/loading-display"
import { EmptyState } from "@/components/ui/empty-state"

type SpeechResponse = {
    audioUrl?: string;
    task_id?: number;
    base_resp?: { status_code: number; status_msg: string }
}

export function VoiceGenerator() {
    const [text, setText] = useState("")
    const [voice, setVoice] = useState("300531147460696")
    const [customVoiceId, setCustomVoiceId] = useState("")

    const [voiceSource, setVoiceSource] = useState<"preset" | "id">("preset")
    const [isAsync, setIsAsync] = useState(false)
    const [lastTaskId, setLastTaskId] = useState<number | null>(null)
    const [showAdvanced, setShowAdvanced] = useState(false)

    // Advanced Params
    const [speed, setSpeed] = useState(1.0)
    const [vol, setVol] = useState(1.0)
    const [pitch, setPitch] = useState(0)
    const [audioSample, setAudioSample] = useState<HTMLAudioElement | null>(null)
    const [playingSampleId, setPlayingSampleId] = useState<string | null>(null)

    const voices = [
        {
            id: "300531147460696",
            name: "Lê Na 1 (Female)",
            sample: "https://cdn.hailuoai.video/moss/prod/2025-08-11-23/moss-audio/voice/u_1954807539111563893/demo/1754924930073858848-300531840442531_Vietnamese.mp3"
        },
        {
            id: "273554146070723",
            name: "Serene Man (Male)",
            sample: "https://filecdn.minimax.chat/public/57ae1722-d2d1-4bb2-90c5-cf931e03adaa.mp3"
        },
        {
            id: "262184394641601",
            name: "Confident Woman (Female)",
            sample: "https://filecdn.minimax.chat/public/c0128955-313f-4208-955d-960688c17a44.mp3"
        },
        {
            id: "262184394641600",
            name: "Friendly Man (Male)",
            sample: "https://filecdn.minimax.chat/public/cac2fe9d-993a-4163-bcf1-77fa06e08e71.mp3"
        },
        {
            id: "226905123659934",
            name: "Kind Girl (Female)",
            sample: "https://cdn.hailuoai.video/moss/prod/2025-01-15-19/moss-audio/voice_sample_audio/sample/1736941331583637464-/hailuo-audio-3878bcfd9c3f02f8b0b1f860ba58a81a.mp3"
        },
    ]

    const [language, setLanguage] = useState("auto")
    const languages = [
        { id: "auto", name: "Auto Detect" },
        { id: "vi-VN", name: "Vietnamese" },
        { id: "en-US", name: "English" },
    ]
    const audioRef = useRef<HTMLAudioElement>(null)

    const { mutate, data, isLoading, error } = useMutation<SpeechResponse, any>(
        isAsync ? "/api/speech/async" : "/api/speech"
    )

    const handlePlaySample = (e: React.MouseEvent, voiceId: string, url: string) => {
        e.stopPropagation()
        if (playingSampleId === voiceId) {
            audioSample?.pause()
            setPlayingSampleId(null)
            return
        }
        if (audioSample) audioSample.pause()
        const audio = new Audio(url)
        audio.onended = () => setPlayingSampleId(null)
        audio.play().catch(e => console.error("Play failed", e))
        setAudioSample(audio)
        setPlayingSampleId(voiceId)
    }

    const handleGenerate = async () => {
        if (!text) return
        setLastTaskId(null)
        let finalVoice = voice
        if (voiceSource === "id") finalVoice = customVoiceId
        if (!finalVoice) return

        const payload = {
            text,
            voice: finalVoice,
            speed,
            vol,
            pitch,
            language: language !== "auto" ? language : undefined
        }

        const res = await mutate(payload)
        if (res && res.task_id) setLastTaskId(res.task_id)
    }

    const audioUrl = data?.audioUrl

    const copyTaskId = () => {
        if (lastTaskId) navigator.clipboard.writeText(lastTaskId.toString())
    }

    return (
        <div className="mx-auto w-full max-w-[1800px] space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 h-full">

                {/* Section 1: Voice Selection & Settings (Left Column on Large screens) */}
                <div className="md:col-span-4 lg:col-span-3 space-y-6 flex flex-col">
                    {/* Voice Card */}
                    <Card className="border-none shadow-sm bg-white/60 backdrop-blur-md flex-1">
                        <CardHeader>
                            <h4 className="text-medium font-bold text-default-700">Voice Persona</h4>
                        </CardHeader>
                        <CardBody className="gap-4">
                            <div className="flex bg-default-100 rounded-lg p-1 gap-1">
                                <Button
                                    size="sm"
                                    className="flex-1"
                                    color={voiceSource === "preset" ? "primary" : "default"}
                                    variant={voiceSource === "preset" ? "flat" : "light"}
                                    onClick={() => setVoiceSource("preset")}
                                >
                                    Preset
                                </Button>
                                <Button
                                    size="sm"
                                    className="flex-1"
                                    color={voiceSource === "id" ? "primary" : "default"}
                                    variant={voiceSource === "id" ? "flat" : "light"}
                                    onClick={() => setVoiceSource("id")}
                                >
                                    Custom ID
                                </Button>
                            </div>

                            {voiceSource === "preset" ? (
                                <div className="flex flex-col gap-2 overflow-y-auto max-h-[400px] pr-2 scrollbar-hide">
                                    {voices.map((v) => (
                                        <div key={v.id}
                                            className={`p-3 rounded-xl border cursor-pointer transition-all flex items-center justify-between group
                                                ${voice === v.id ? "border-primary/50 bg-primary/5" : "border-transparent hover:bg-default-100"}
                                            `}
                                            onClick={() => setVoice(v.id)}
                                        >
                                            <div className="flex flex-col truncate">
                                                <span className={`text-sm font-semibold ${voice === v.id ? "text-primary" : "text-default-700"}`}>
                                                    {v.name}
                                                </span>
                                            </div>
                                            <Button
                                                isIconOnly
                                                size="sm"
                                                variant="light"
                                                radius="full"
                                                onClick={(e) => handlePlaySample(e, v.id, v.sample)}
                                                className={voice === v.id ? "text-primary" : "text-default-400"}
                                            >
                                                {playingSampleId === v.id ? <PauseCircle size={18} /> : <PlayCircle size={18} />}
                                            </Button>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <Input
                                    label="Voice ID"
                                    placeholder="Paste ID here..."
                                    value={customVoiceId}
                                    onValueChange={setCustomVoiceId}
                                    variant="faded"
                                />
                            )}
                        </CardBody>
                    </Card>

                    {/* Settings Card */}
                    <Card className="border-none shadow-sm bg-white/60 backdrop-blur-md">
                        <CardHeader>
                            <h4 className="text-medium font-bold text-default-700">Settings</h4>
                        </CardHeader>
                        <CardBody className="gap-6">
                            <Select
                                label="Language"
                                size="sm"
                                variant="faded"
                                selectedKeys={[language]}
                                onChange={(e) => setLanguage(e.target.value)}
                            >
                                {languages.map((l) => (
                                    <SelectItem key={l.id} value={l.id}>{l.name}</SelectItem>
                                ))}
                            </Select>

                            <div className="space-y-4">
                                <Slider
                                    label="Speed" step={0.1} minValue={0.5} maxValue={2.0} defaultValue={1.0}
                                    value={speed} onChange={(v) => setSpeed(v as number)} size="sm"
                                    className="max-w-full"
                                />
                                <Slider
                                    label="Volume" step={0.1} minValue={0.1} maxValue={10} defaultValue={1.0}
                                    value={vol} onChange={(v) => setVol(v as number)} size="sm"
                                    className="max-w-full"
                                />
                            </div>
                        </CardBody>
                    </Card>
                </div>

                {/* Section 2: Input & Output (Main Area) */}
                <div className="md:col-span-8 lg:col-span-9 grid grid-rows-1 lg:grid-rows-2 gap-6 h-full">

                    {/* Text Input Area (Large) */}
                    <Card className="border-none shadow-sm bg-white/60 backdrop-blur-md row-span-1">
                        <CardHeader className="flex flex-row justify-between items-center pb-2">
                            <h4 className="text-large font-bold">Text Input</h4>
                            <div className="flex items-center gap-4">
                                <Chip size="sm" variant="flat" color={isAsync ? "success" : "default"}>
                                    {isAsync ? "Async Mode" : "Instant Mode"}
                                </Chip>
                                <Switch
                                    size="sm"
                                    isSelected={isAsync}
                                    onValueChange={setIsAsync}
                                    color="success"
                                    thumbIcon={({ isSelected, className }) => isSelected ? <UploadCloud className={className} size={12} /> : <MicIcon className={className} size={12} />}
                                />
                            </div>
                        </CardHeader>
                        <CardBody className="pt-0 h-full">
                            <Textarea
                                classNames={{
                                    input: "text-lg leading-relaxed resize-none h-full",
                                    inputWrapper: "h-full bg-transparent shadow-none"
                                }}
                                placeholder="Enter text to speak..."
                                minRows={8}
                                maxRows={20}
                                value={text}
                                onValueChange={setText}
                                disableAutosize
                            />
                        </CardBody>
                        <CardFooter className="justify-between border-t border-default-100">
                            <span className="text-small text-default-400">{text.length} characters</span>
                            <Button
                                className="font-semibold min-w-[200px]"
                                color="primary"
                                size="lg"
                                radius="full"
                                endContent={isLoading ? <Loader2 className="animate-spin" /> : <MicIcon />}
                                isLoading={isLoading}
                                onClick={handleGenerate}
                                isDisabled={!text || (voiceSource === "id" && !customVoiceId)}
                            >
                                {isAsync ? "Combine" : "Generate Speech"}
                            </Button>
                        </CardFooter>
                    </Card>

                    {/* Result Area */}
                    <Card className="border-none shadow-sm bg-zinc-50/80 backdrop-blur-md row-span-1 min-h-[250px] relative overflow-hidden">

                        {audioUrl && (
                            <div className="absolute inset-0 z-0 opacity-10 bg-gradient-to-r from-primary to-secondary pointer-events-none" />
                        )}

                        <CardHeader>
                            <h4 className="text-large font-bold">Generation Result</h4>
                        </CardHeader>

                        <CardBody className="flex items-center justify-center p-0">
                            {isLoading ? (
                                <LoadingDisplay text={isAsync ? "Submitting Task..." : "Synthesizing..."} />
                            ) : isAsync && lastTaskId ? (
                                <div className="flex flex-col items-center gap-4 z-10">
                                    <div className="h-20 w-20 rounded-full bg-success-50 flex items-center justify-center text-success-600 shadow-sm animate-in zoom-in">
                                        <CheckCircle2 size={40} />
                                    </div>
                                    <div className="text-center space-y-1">
                                        <h3 className="text-2xl font-bold text-default-900">Task Submitted</h3>
                                        <p className="text-default-500">Your long text is being processed asynchronously.</p>
                                    </div>
                                    <div className="flex items-center gap-2 p-3 bg-white shadow-sm rounded-xl border border-default-200 mt-2">
                                        <code className="font-mono text-medium px-2">{lastTaskId}</code>
                                        <Divider orientation="vertical" className="h-6" />
                                        <Button isIconOnly size="sm" variant="light" onClick={copyTaskId}>
                                            <Copy size={16} />
                                        </Button>
                                    </div>
                                </div>
                            ) : audioUrl ? (
                                <div className="w-full max-w-2xl flex flex-col items-center gap-8 z-10 animate-in fade-in slide-in-from-bottom-4">
                                    <div className="w-full flex items-center justify-center gap-6">
                                        <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center shadow-sm">
                                            <PlayCircle className="h-8 w-8 text-primary" />
                                        </div>
                                        <audio ref={audioRef} src={audioUrl} controls className="w-full shadow-sm rounded-full" />
                                    </div>

                                    {!isAsync && (
                                        <div className="flex gap-4">
                                            <Button
                                                as="a"
                                                href={audioUrl}
                                                download="speech.mp3"
                                                color="primary"
                                                variant="shadow"
                                                size="lg"
                                                radius="full"
                                                startContent={<Download size={18} />}
                                            >
                                                Download MP3
                                            </Button>
                                        </div>
                                    )}
                                </div>
                            ) : (
                                <EmptyState icon={MicIcon} text="Ready to create something amazing" />
                            )}

                            {error && (
                                <div className="absolute bottom-4 left-4 right-4 p-3 bg-danger-50 text-danger border border-danger-200 rounded-lg text-sm text-center">
                                    {error}
                                </div>
                            )}
                        </CardBody>
                    </Card>
                </div>
            </div>
        </div>
    )
}
