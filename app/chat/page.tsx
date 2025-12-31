"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { Button, Textarea } from "@heroui/react";
import {
    Plus,
    Send,
    User as UserIcon,
    Copy,
    Loader2,
    Trash2,
    MessageSquare,
    Image as ImageIcon,
    Mic,
    History,
    Sparkles,
    MoreVertical,
    Clock,
    Zap
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useMutation } from "@/hooks/use-mutation";

type Message = {
    role: "user" | "assistant";
    content: string;
};

type ChatResponse = {
    text: string;
    usage?: any;
};

const SUGGESTIONS = [
    { title: "Kế hoạch", desc: "Lên kế hoạch đi Đà Lạt 3 ngày 2 đêm tiết kiệm nhất", icon: Sparkles, color: "text-blue-500" },
    { title: "Sáng tạo", desc: "Viết một email chuyên nghiệp từ chối lời mời làm việc", icon: ImageIcon, color: "text-emerald-500" },
    { title: "Kiến thức", desc: "Giải thích về Quantum Computing cho một đứa trẻ 10 tuổi", icon: MessageSquare, color: "text-orange-500" },
    { title: "Lập trình", desc: "Viết function JavaScript để fetch dữ liệu từ một API", icon: Zap, color: "text-purple-500" },
];

export default function ChatPage() {
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState("");
    const scrollRef = useRef<HTMLDivElement>(null);
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    const { mutate, isLoading } = useMutation<ChatResponse, { messages: Message[] }>("/api/chat");

    useEffect(() => {
        scrollRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages, isLoading]);

    const handleSend = useCallback(async (textOverride?: string) => {
        const textToSend = textOverride || input;
        if (!textToSend.trim() || isLoading) return;

        const userMessage: Message = { role: "user", content: textToSend.trim() };
        const newHistory = [...messages, userMessage];

        setMessages(newHistory);
        setInput("");

        if (textareaRef.current) {
            textareaRef.current.style.height = "auto";
        }

        const response = await mutate({ messages: newHistory });

        if (response) {
            const assistantMessage: Message = { role: "assistant", content: response.text };
            setMessages((prev) => [...prev, assistantMessage]);
        }
    }, [input, isLoading, messages, mutate]);

    const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    }, [handleSend]);

    const copyToClipboard = useCallback((text: string) => {
        navigator.clipboard.writeText(text);
    }, []);

    return (
        <div className="flex flex-1 w-full h-full overflow-hidden">
            {/* Chat History Sidebar */}
            <div className="hidden lg:flex flex-col w-[280px] shrink-0 border-r bg-muted/10 h-full">
                <div className="p-4 flex flex-col h-full">
                    <Button
                        onPress={() => setMessages([])}
                        variant="flat"
                        size="lg"
                        className="w-full gap-3 bg-secondary/60 hover:bg-secondary border shadow-sm rounded-2xl font-bold px-5 transition-all group flex items-center justify-start shrink-0"
                    >
                        <Plus className="h-5 w-5 group-hover:rotate-90 transition-transform duration-300" />
                        Cuộc hội thoại mới
                    </Button>

                    <div className="mt-8 flex-1 overflow-y-auto space-y-1.5 pr-1">
                        <h3 className="text-[11px] font-bold text-muted-foreground/60 uppercase tracking-[0.12em] px-3 mb-3">
                            Lịch sử
                        </h3>

                        {messages.length > 0 ? (
                            <div className="group relative px-3 py-3 rounded-xl hover:bg-muted/80 bg-background/50 border border-transparent hover:border-border/50 transition-all cursor-pointer text-sm flex items-center gap-3 shadow-sm">
                                <MessageSquare className="h-4 w-4 text-blue-500/60 shrink-0" />
                                <span className="truncate font-medium text-foreground/80">{messages[0].content}</span>
                                <div className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity">
                                    <MoreVertical className="h-4 w-4 text-muted-foreground" />
                                </div>
                            </div>
                        ) : (
                            <div className="px-3 py-6 text-xs text-muted-foreground/40 italic text-center font-medium">
                                Chưa có lịch sử
                            </div>
                        )}

                        <div className="px-3 py-3 rounded-xl hover:bg-muted/40 transition-all cursor-pointer text-sm flex items-center gap-3 text-muted-foreground/60 font-medium">
                            <History className="h-4 w-4 shrink-0" />
                            <span className="truncate">Xem tất cả lịch sử</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Chat Area */}
            <div className="flex flex-1 flex-col h-full bg-background relative overflow-hidden">
                {/* Content Area */}
                <div className="flex-1 overflow-y-auto scroll-smooth">
                    <div className="mx-auto max-w-4xl px-6 md:px-10 w-full min-h-full flex flex-col py-8">
                        {messages.length === 0 ? (
                            <div className="flex-1 flex flex-col justify-center py-16 animate-in fade-in slide-in-from-bottom-12 duration-1000">
                                <div className="mb-16 space-y-4 text-center md:text-left">
                                    <h1 className="text-5xl md:text-7xl font-black tracking-tight bg-gradient-to-r from-blue-600 via-indigo-600 via-purple-600 via-rose-600 to-amber-500 bg-clip-text text-transparent animate-gradient-x bg-[length:200%_auto] pb-2 leading-[1.1]">
                                        Xin chào, Huỳnh
                                    </h1>
                                    <p className="text-3xl md:text-5xl text-muted-foreground/30 font-bold tracking-tight leading-tight">
                                        Hôm nay tôi có thể giúp gì?
                                    </p>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                                    {SUGGESTIONS.map((item, idx) => (
                                        <div
                                            key={idx}
                                            onClick={() => handleSend(item.desc)}
                                            className="group p-6 rounded-[32px] bg-muted/10 hover:bg-muted/40 transition-all cursor-pointer border-2 border-transparent hover:border-border/50 scale-100 hover:scale-[1.03] active:scale-[0.97] flex flex-col justify-between h-52 shadow-sm hover:shadow-xl"
                                        >
                                            <p className="text-base font-bold leading-snug line-clamp-4 text-foreground/70 group-hover:text-foreground transition-colors">{item.desc}</p>
                                            <div className="h-14 w-14 rounded-2xl bg-background flex items-center justify-center self-end shadow-md group-hover:shadow-lg group-hover:scale-110 transition-all duration-500">
                                                <item.icon className={cn("h-7 w-7 opacity-90", item.color)} />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ) : (
                            <div className="space-y-12 py-8">
                                {messages.map((msg, idx) => (
                                    <div key={idx} className={cn(
                                        "flex gap-6 md:gap-8 group max-w-full animate-in fade-in slide-in-from-bottom-4 duration-500",
                                        msg.role === "user" ? "flex-row-reverse text-right" : "flex-row text-left"
                                    )}>
                                        <div className={cn(
                                            "flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border-2 bg-background shadow-lg transition-all group-hover:scale-110 duration-500",
                                            msg.role === "assistant" ? "text-blue-600 border-blue-100/50" : "text-foreground border-muted"
                                        )}>
                                            {msg.role === "assistant" ? <Sparkles className="h-6 w-6" /> : <UserIcon className="h-6 w-6" />}
                                        </div>
                                        <div className={cn(
                                            "flex flex-col gap-4 relative max-w-[85%] md:max-w-[75%]",
                                            msg.role === "user" ? "items-end" : "items-start"
                                        )}>
                                            <div className={cn(
                                                "text-lg md:text-xl leading-relaxed whitespace-pre-wrap transition-all tracking-tight",
                                                msg.role === "user"
                                                    ? "bg-muted/60 backdrop-blur-md py-4 px-6 rounded-[28px] rounded-tr-none font-semibold shadow-md"
                                                    : "pt-2 font-medium text-foreground/90"
                                            )}>
                                                {msg.content}
                                            </div>
                                            {msg.role === "assistant" && (
                                                <div className="flex items-center gap-3 opacity-0 group-hover:opacity-100 transition-all duration-500 translate-y-2 group-hover:translate-y-0">
                                                    <Button
                                                        isIconOnly
                                                        variant="flat"
                                                        size="sm"
                                                        className="rounded-full bg-muted/30 hover:bg-muted shadow-sm"
                                                        onPress={() => copyToClipboard(msg.content)}
                                                    >
                                                        <Copy className="h-4 w-4" />
                                                    </Button>
                                                    <Button
                                                        isIconOnly
                                                        variant="flat"
                                                        size="sm"
                                                        className="rounded-full bg-muted/30 hover:bg-muted shadow-sm"
                                                    >
                                                        <Trash2 className="h-4 w-4 text-muted-foreground/60 hover:text-rose-500" />
                                                    </Button>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                ))}
                                {isLoading && (
                                    <div className="flex gap-6 md:gap-8 animate-in fade-in duration-500">
                                        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border-2 border-blue-100/50 bg-background shadow-lg text-blue-600">
                                            <Sparkles className="h-6 w-6 animate-pulse" />
                                        </div>
                                        <div className="flex flex-col gap-4 pt-2 w-full max-w-[75%]">
                                            <div className="space-y-4">
                                                <div className="h-6 bg-muted/40 animate-pulse rounded-full w-full"></div>
                                                <div className="h-6 bg-muted/40 animate-pulse rounded-full w-[85%]"></div>
                                                <div className="h-6 bg-muted/40 animate-pulse rounded-full w-[65%]"></div>
                                            </div>
                                        </div>
                                    </div>
                                )}
                                <div ref={scrollRef} className="h-32" />
                            </div>
                        )}
                    </div>
                </div>

                {/* Input Bar */}
                <div className="max-w-4xl mx-auto w-full px-6 pb-8 md:pb-12 z-20">
                    <div className="relative group/input">
                        <div className="absolute -inset-1.5 bg-gradient-to-r from-blue-600/15 via-purple-600/15 to-orange-600/15 rounded-[44px] blur-xl opacity-0 group-focus-within/input:opacity-100 transition-all duration-700" />
                        <div className="relative bg-muted/20 backdrop-blur-xl rounded-[32px] border border-muted-foreground/10 focus-within:border-primary/10 transition-all duration-500 shadow-xl p-3 flex flex-col group-focus-within/input:bg-background/50">
                            <Textarea
                                ref={textareaRef}
                                value={input}
                                onChange={(e) => {
                                    setInput(e.target.value);
                                    e.target.style.height = "auto";
                                    e.target.style.height = `${e.target.scrollHeight}px`;
                                }}
                                onKeyDown={handleKeyDown}
                                placeholder="Nhập yêu cầu tại đây..."
                                minRows={1}
                                maxRows={12}
                                classNames={{
                                    input: "text-xl py-3 px-4 resize-none font-semibold placeholder:text-muted-foreground/25 tracking-tight",
                                    inputWrapper: "bg-transparent shadow-none hover:bg-transparent focus-within:bg-transparent",
                                }}
                                variant="flat"
                            />
                            <div className="flex items-center justify-between px-3 pb-2 pt-2 border-t border-black/5 mt-3">
                                <div className="flex gap-2">
                                    <Button isIconOnly variant="flat" size="md" className="rounded-full bg-background/50 hover:bg-white text-muted-foreground/80 hover:text-blue-600 transition-all shadow-sm">
                                        <ImageIcon className="h-6 w-6" />
                                    </Button>
                                    <Button isIconOnly variant="flat" size="md" className="rounded-full bg-background/50 hover:bg-white text-muted-foreground/80 hover:text-blue-600 transition-all shadow-sm">
                                        <Mic className="h-6 w-6" />
                                    </Button>
                                </div>
                                <Button
                                    isIconOnly
                                    size="lg"
                                    className={cn(
                                        "h-14 w-14 transition-all duration-500 shadow-xl",
                                        input.trim()
                                            ? "bg-primary text-primary-foreground rounded-full shadow-primary/30 scale-100 rotate-0"
                                            : "bg-muted/80 text-muted-foreground/10 rounded-2xl scale-90 -rotate-12 opacity-40 shadow-none"
                                    )}
                                    onPress={() => handleSend()}
                                    disabled={!input.trim() || isLoading}
                                >
                                    {isLoading ? (
                                        <Loader2 className="h-7 w-7 animate-spin" />
                                    ) : (
                                        <Send className="h-6 w-6 -mr-0.5" />
                                    )}
                                </Button>
                            </div>
                        </div>
                    </div>
                    <div className="mt-6 flex items-center justify-center gap-2 text-[12px] text-muted-foreground/40 font-semibold">
                        <Clock className="h-3.5 w-3.5 opacity-50" />
                        <span>AI có thể đưa ra thông tin không chính xác. Vui lòng kiểm tra lại.</span>
                    </div>
                </div>
            </div>

            {/* Styles */}
            <style jsx global>{`
        @keyframes gradient-x {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        .animate-gradient-x {
          animation: gradient-x 15s ease-in-out infinite;
        }
      `}</style>
        </div>
    );
}
