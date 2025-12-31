"use client";

import { useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Download, ImageIcon, Loader2 } from "lucide-react";
import { useMutation } from "@/hooks/use-mutation";
import { LoadingDisplay } from "@/components/ui/loading-display";
import { EmptyState } from "@/components/ui/empty-state";

const IMAGE_SIZES = ["256x256", "512x512", "1024x1024"] as const;

type ImageResponse = { imageUrl?: string; base64?: string };

export default function ImagePage() {
    const [prompt, setPrompt] = useState("");
    const [size, setSize] = useState<typeof IMAGE_SIZES[number]>("1024x1024");

    const { data, error, isLoading, mutate } = useMutation<ImageResponse, { prompt: string; size: string }>("/api/image");

    const handleGenerate = useCallback(async () => {
        if (!prompt) return;
        await mutate({ prompt, size });
    }, [prompt, size, mutate]);

    const image = data?.imageUrl || data?.base64;

    return (
        <div className="mx-auto max-w-3xl space-y-8">
            <div className="space-y-2 text-center">
                <h1 className="text-3xl font-bold tracking-tight">Text to Image</h1>
                <p className="text-muted-foreground">Transform your words into stunning visuals using AI.</p>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
                <Card className="flex flex-col">
                    <CardHeader>
                        <CardTitle>Configuration</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <label className="block text-sm font-medium">Description</label>
                            <Textarea
                                placeholder="A futuristic city with flying cars..."
                                className="min-h-[120px] resize-none"
                                value={prompt}
                                onChange={(e) => setPrompt(e.target.value)}
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="block text-sm font-medium">Size</label>
                            <div className="flex gap-2">
                                {IMAGE_SIZES.map((s) => (
                                    <Button
                                        key={s}
                                        variant={size === s ? "default" : "outline"}
                                        size="sm"
                                        onClick={() => setSize(s)}
                                        className="flex-1"
                                    >
                                        {s}
                                    </Button>
                                ))}
                            </div>
                        </div>
                    </CardContent>
                    <CardFooter className="mt-auto">
                        <Button
                            className="w-full"
                            onClick={handleGenerate}
                            disabled={isLoading || !prompt}
                        >
                            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Generate
                        </Button>
                    </CardFooter>
                </Card>

                <Card className="flex min-h-[350px] flex-col">
                    <CardHeader>
                        <CardTitle>Result</CardTitle>
                    </CardHeader>
                    <CardContent className="flex flex-1 items-center justify-center bg-muted/20 p-2">
                        {isLoading ? (
                            <LoadingDisplay text="Dreaming..." />
                        ) : image ? (
                            <div className="relative h-full w-full overflow-hidden rounded-md">
                                <img
                                    src={image}
                                    alt={prompt}
                                    className="h-full w-full object-contain"
                                />
                            </div>
                        ) : (
                            <EmptyState icon={ImageIcon} text="Image will appear here" />
                        )}
                        {error && <p className="mt-4 text-sm text-destructive">{error}</p>}
                    </CardContent>
                    <CardFooter className="justify-end gap-2">
                        {image && (
                            <Button variant="secondary" size="sm" asChild>
                                <a href={image} download="generated-image.png" target="_blank" rel="noopener noreferrer">
                                    <Download className="mr-2 h-4 w-4" />
                                    Download
                                </a>
                            </Button>
                        )}
                    </CardFooter>
                </Card>
            </div>
        </div>
    );
}
