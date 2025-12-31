"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { MicIcon, FileAudioIcon, SearchIcon } from "lucide-react"
import { VoiceGenerator } from "@/components/voice/VoiceGenerator"
export default function VoicePage() {
    return (
        <div className="mx-auto max-w-5xl space-y-8">
            <div className="space-y-2 text-center">
                <h1 className="text-3xl font-bold tracking-tight">Voice Studio</h1>
                <p className="text-muted-foreground">
                    Generate speech using Minimax technology.
                </p>
            </div>

            <div className="min-h-[500px]">
                <VoiceGenerator />
            </div>
        </div>
    )
}
