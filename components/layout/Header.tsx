"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Component } from "lucide-react";

export function Header() {
    const pathname = usePathname();

    return (
        <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="flex h-14 w-full items-center gap-4 px-4 md:px-6 lg:px-8">
                <Link href="/" className="flex items-center gap-2.5 hover:opacity-80 transition-opacity">
                    <div className="flex items-center justify-center">
                        <Component className="h-6 w-6 text-primary" />
                    </div>
                    <span className="text-lg font-bold tracking-tight text-foreground">
                        AI Playground
                    </span>
                </Link>

                <div className="flex-1" />

                <div className="flex items-center justify-end gap-2">
                    {/* Placeholder for future User Auth / Settings */}
                </div>
            </div>
        </header>
    );
}
