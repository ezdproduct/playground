"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
    ImageIcon,
    MicIcon,
    MessageSquareIcon,
    BoxIcon,
    ChevronLeft,
    ChevronRight,
    Sparkles
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useState, useMemo } from "react";
import { Button } from "@heroui/react";

const TABS = [
    {
        name: "Chat",
        href: "/chat",
        icon: MessageSquareIcon,
        color: "text-blue-500",
        bgColor: "bg-blue-500/10",
    },
    {
        name: "Image",
        href: "/image",
        icon: ImageIcon,
        color: "text-emerald-500",
        bgColor: "bg-emerald-500/10",
    },
    {
        name: "Voice",
        href: "/voice",
        icon: MicIcon,
        color: "text-purple-500",
        bgColor: "bg-purple-500/10",
    },
    {
        name: "Models",
        href: "/models",
        icon: BoxIcon,
        color: "text-orange-500",
        bgColor: "bg-orange-500/10",
    },
] as const;

export function Sidebar() {
    const pathname = usePathname();
    const [collapsed, setCollapsed] = useState(false);

    const isActive = useMemo(() => {
        return (href: string) => {
            if (href === "/chat" && pathname === "/") return true;
            return pathname.startsWith(href);
        };
    }, [pathname]);

    return (
        <aside
            className={cn(
                "h-full border-r bg-muted/20 transition-all duration-300 ease-in-out flex flex-col shrink-0",
                collapsed ? "w-[72px]" : "w-[260px]"
            )}
        >
            {/* Logo Area */}
            <div className={cn(
                "flex items-center gap-3 p-4 border-b transition-all duration-300",
                collapsed ? "justify-center px-2" : "px-5"
            )}>
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                    <Sparkles className="h-5 w-5" />
                </div>
                {!collapsed && (
                    <span className="text-lg font-bold tracking-tight text-foreground truncate">
                        AI Playground
                    </span>
                )}
            </div>

            {/* Navigation */}
            <nav className="flex-1 p-3 space-y-1.5 overflow-y-auto">
                {TABS.map((tab) => {
                    const active = isActive(tab.href);
                    return (
                        <Link
                            key={tab.href}
                            href={tab.href}
                            className={cn(
                                "flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-semibold transition-all duration-200 group",
                                active
                                    ? "bg-secondary text-foreground shadow-sm"
                                    : "text-muted-foreground hover:bg-muted hover:text-foreground",
                                collapsed && "justify-center px-3"
                            )}
                        >
                            <div className={cn(
                                "flex h-9 w-9 shrink-0 items-center justify-center rounded-xl transition-all",
                                active ? tab.bgColor : "bg-muted/50 group-hover:bg-muted"
                            )}>
                                <tab.icon className={cn("h-5 w-5", active ? tab.color : "text-muted-foreground group-hover:text-foreground")} />
                            </div>
                            {!collapsed && <span className="truncate">{tab.name}</span>}
                        </Link>
                    );
                })}
            </nav>

            {/* Collapse Toggle */}
            <div className="p-3 border-t">
                <Button
                    isIconOnly={collapsed}
                    variant="flat"
                    size="sm"
                    onPress={() => setCollapsed(!collapsed)}
                    className={cn(
                        "w-full rounded-xl transition-all",
                        collapsed ? "justify-center" : "justify-start gap-3 px-4"
                    )}
                >
                    {collapsed ? (
                        <ChevronRight className="h-4 w-4" />
                    ) : (
                        <>
                            <ChevronLeft className="h-4 w-4" />
                            <span className="text-sm font-medium">Thu gọn</span>
                        </>
                    )}
                </Button>
            </div>
        </aside>
    );
}
