import { LucideIcon } from "lucide-react"
import { cn } from "@/lib/utils"

interface EmptyStateProps {
    icon: LucideIcon
    text: string
    className?: string
}

export function EmptyState({ icon: Icon, text, className }: EmptyStateProps) {
    return (
        <div className={cn("flex flex-col items-center gap-2 text-muted-foreground/50", className)}>
            <Icon className="h-12 w-12" />
            <span className="text-sm">{text}</span>
        </div>
    )
}
