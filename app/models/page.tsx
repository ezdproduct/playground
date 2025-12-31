"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { LoadingDisplay } from "@/components/ui/loading-display"
import { EmptyState } from "@/components/ui/empty-state"
import { BoxIcon, CalendarIcon, ShieldIcon } from "lucide-react"
import { useMutation } from "@/hooks/use-mutation"

type Model = {
    id: string
    object: string
    created: number
    owned_by: string
}

type ModelListResponse = {
    data: Model[]
    success: boolean
}

export default function ModelsPage() {
    // Using useMutation as a manual fetcher for now, or we could just use fetch/useEffect
    // Since useMutation is designed for manual triggering, let's use it but trigger on mount.
    // Ideally we would have a useQuery hook, but reuse is fine.
    const { data, error, isLoading, mutate } = useMutation<ModelListResponse, {}>("/api/models", "GET")
    const [mounted, setMounted] = useState(false)

    useEffect(() => {
        setMounted(true)
        mutate({})
    }, []) // Trigger once on mount

    const models = data?.data || []

    // Function to format timestamp to date
    const formatDate = (timestamp: number) => {
        return new Date(timestamp * 1000).toLocaleDateString()
    }

    return (
        <div className="mx-auto max-w-4xl space-y-8">
            <div className="space-y-2 text-center">
                <h1 className="text-3xl font-bold tracking-tight">Available Models</h1>
                <p className="text-muted-foreground">
                    Explore the AI models powered by T8 API.
                </p>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Model Registry</CardTitle>
                    <CardDescription>List of models active and ready for use.</CardDescription>
                </CardHeader>
                <CardContent className="p-0">
                    {isLoading ? (
                        <div className="p-12">
                            <LoadingDisplay text="Fetching models..." />
                        </div>
                    ) : error ? (
                        <div className="p-8 text-center text-destructive">
                            <p>Error: {error}</p>
                        </div>
                    ) : models.length === 0 ? (
                        <div className="p-12">
                            <EmptyState icon={BoxIcon} text="No models found." />
                        </div>
                    ) : (
                        <div className="divide-y">
                            {models.map((model) => (
                                <div key={model.id} className="flex flex-col gap-2 p-4 transition-colors hover:bg-muted/50 sm:flex-row sm:items-center sm:justify-between">
                                    <div className="space-y-1">
                                        <div className="flex items-center gap-2">
                                            <BoxIcon className="h-4 w-4 text-primary" />
                                            <span className="font-medium">{model.id}</span>
                                        </div>
                                        <div className="flex items-center gap-4 text-xs text-muted-foreground">
                                            <div className="flex items-center gap-1">
                                                <ShieldIcon className="h-3 w-3" />
                                                <span>{model.owned_by}</span>
                                            </div>
                                            <div className="flex items-center gap-1">
                                                <CalendarIcon className="h-3 w-3" />
                                                <span>{formatDate(model.created)}</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="text-xs text-muted-foreground bg-secondary px-2 py-1 rounded">
                                        {model.object}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    )
}
