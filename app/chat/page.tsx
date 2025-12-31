"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Card } from "@/components/ui/card"
import { Send, User as UserIcon, Bot as BotIcon, Copy, Loader2, Trash2, MessageSquare } from "lucide-react"
import { cn } from "@/lib/utils"
import { useMutation } from "@/hooks/use-mutation"
import { EmptyState } from "@/components/ui/empty-state"

type Message = {
    role: "user" | "assistant"
    content: string
}

type ChatResponse = {
    text: string
    usage?: any
}

export default function ChatPage() {
    const [messages, setMessages] = useState<Message[]>([])
    const [input, setInput] = useState("")
    const scrollRef = useRef<HTMLDivElement>(null)

    const { mutate, isLoading } = useMutation<ChatResponse, { messages: Message[] }>("/api/chat")

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollIntoView({ behavior: "smooth" })
        }
    }, [messages, isLoading])

    const handleSend = async () => {
        if (!input.trim() || isLoading) return

        const userMessage: Message = { role: "user", content: input.trim() }
        const newHistory = [...messages, userMessage]

        setMessages(newHistory)
        setInput("")

        const response = await mutate({ messages: newHistory })

        if (response) {
            const assistantMessage: Message = { role: "assistant", content: response.text }
            setMessages((prev) => [...prev, assistantMessage])
        } else {
            // useMutation handles error state in 'error' prop, but we can also handle UI feedback here if needed
            // For simplicity, let's just append an error message if it failed and no data returned
            // But better to check if !response and error exists.
        }
    }

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault()
            handleSend()
        }
    }

    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text)
    }

    return (
        <div className="mx-auto flex h-[calc(100vh-140px)] max-w-3xl flex-col gap-4">
            <div className="flex items-center justify-between border-b pb-4">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">Chat</h1>
                    <p className="text-sm text-muted-foreground">
                        Conversation with AI Assistant
                    </p>
                </div>
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setMessages([])}
                    disabled={messages.length === 0 || isLoading}
                >
                    <Trash2 className="mr-2 h-4 w-4" />
                    Clear
                </Button>
            </div>

            <Card className="flex flex-1 flex-col overflow-hidden">
                <div className="flex-1 overflow-y-auto p-4 space-y-6">
                    {messages.length === 0 ? (
                        <EmptyState icon={MessageSquare} text="Start a conversation by typing a message below." className="h-full justify-center" />
                    ) : (
                        messages.map((msg, idx) => (
                            <div
                                key={idx}
                                className={cn(
                                    "flex gap-3",
                                    msg.role === "user" ? "justify-end" : "justify-start"
                                )}
                            >
                                {msg.role === "assistant" && (
                                    <div className="mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                                        <BotIcon className="h-5 w-5" />
                                    </div>
                                )}
                                <div
                                    className={cn(
                                        "relative max-w-[80%] rounded-lg px-4 py-2 text-sm",
                                        msg.role === "user"
                                            ? "bg-primary text-primary-foreground"
                                            : "bg-muted text-foreground"
                                    )}
                                >
                                    <div className="whitespace-pre-wrap leading-relaxed">
                                        {msg.content}
                                    </div>
                                    {msg.role === "assistant" && (
                                        <button
                                            onClick={() => copyToClipboard(msg.content)}
                                            className="absolute -bottom-6 left-0 text-xs text-muted-foreground hover:text-foreground opacity-0 transition-opacity group-hover:opacity-100 flex items-center gap-1"
                                            aria-label="Copy message"
                                        >
                                            <Copy className="h-3 w-3" /> Copy
                                        </button>
                                    )}
                                </div>
                                {msg.role === "user" && (
                                    <div className="mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-secondary text-secondary-foreground">
                                        <UserIcon className="h-5 w-5" />
                                    </div>
                                )}
                            </div>
                        ))
                    )}
                    {isLoading && (
                        <div className="flex gap-3 justify-start">
                            <div className="mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                                <BotIcon className="h-5 w-5" />
                            </div>
                            <div className="flex items-center gap-1 rounded-lg bg-muted px-4 py-3">
                                <span className="h-2 w-2 animate-bounce rounded-full bg-foreground/50 [animation-delay:-0.3s]"></span>
                                <span className="h-2 w-2 animate-bounce rounded-full bg-foreground/50 [animation-delay:-0.15s]"></span>
                                <span className="h-2 w-2 animate-bounce rounded-full bg-foreground/50"></span>
                            </div>
                        </div>
                    )}
                    <div ref={scrollRef} />
                </div>

                <div className="border-t bg-background p-4">
                    <div className="relative flex items-end gap-2">
                        <Textarea
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyDown={handleKeyDown}
                            placeholder="Type your message..."
                            className="min-h-[60px] resize-none pr-12 focus-visible:ring-0 focus-visible:ring-offset-0"
                            disabled={isLoading}
                            autoFocus
                        />
                        <Button
                            size="icon"
                            className="absolute bottom-2 right-2 h-8 w-8"
                            onClick={handleSend}
                            disabled={!input.trim() || isLoading}
                        >
                            {isLoading ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                                <Send className="h-4 w-4" />
                            )}
                            <span className="sr-only">Send</span>
                        </Button>
                    </div>
                    <div className="mt-2 text-center text-xs text-muted-foreground">
                        AI can make mistakes. Please check important information.
                    </div>
                </div>
            </Card>
        </div>
    )
}
