"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Component, ImageIcon, MicIcon, MessageSquareIcon, BoxIcon } from "lucide-react"
import { cn } from "@/lib/utils"

const tabs = [
    {
        name: "Chat",
        href: "/chat",
        icon: MessageSquareIcon,
    },
    {
        name: "Image",
        href: "/image",
        icon: ImageIcon,
    },
    {
        name: "Voice",
        href: "/voice",
        icon: MicIcon,
    },
    {
        name: "Models",
        href: "/models",
        icon: BoxIcon,
    },
]

export function Header() {
    const pathname = usePathname()

    const isActive = (href: string) => {
        if (href === "/chat" && pathname === "/") return true
        return pathname.startsWith(href)
    }

    return (
        <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="flex h-16 w-full items-center gap-4 px-4 md:px-6 lg:px-8">
                <div className="flex items-center gap-2">
                    <div className="flex items-center justify-center">
                        <Component className="h-6 w-6 text-foreground" />
                    </div>
                    <span className="text-xl font-semibold tracking-tight text-foreground hidden md:inline-block">AI Playground</span>
                </div>

                <nav className="flex flex-1 items-center gap-1 md:gap-2 overflow-x-auto scrollbar-hide">
                    {tabs.map((tab) => {
                        const active = isActive(tab.href)
                        return (
                            <Link
                                key={tab.href}
                                href={tab.href}
                                className={cn(
                                    "flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground whitespace-nowrap",
                                    active
                                        ? "bg-secondary text-foreground"
                                        : "text-muted-foreground"
                                )}
                            >
                                <tab.icon className="h-4 w-4" />
                                <span>{tab.name}</span>
                            </Link>
                        )
                    })}
                </nav>

                <div className="flex items-center justify-end">
                    {/* Placeholder for future User Auth / Settings */}
                </div>
            </div>
        </header>
    )
}
