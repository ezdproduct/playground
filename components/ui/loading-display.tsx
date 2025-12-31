import { Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"

interface LoadingDisplayProps {
    className?: string
    text?: string
}

export function LoadingDisplay({ className, text = "Loading..." }: LoadingDisplayProps) {
    return (
        <div className={cn("flex flex-col items-center gap-2 text-muted-foreground", className)}>
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <span className="text-sm">{text}</span>
        </div>
    )
}
