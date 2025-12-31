"use client"

import { useState } from "react"

interface UseMutationState<T> {
    data: T | null
    error: string | null
    isLoading: boolean
}

interface UseMutationResult<T, A> extends UseMutationState<T> {
    mutate: (args: A) => Promise<T | null>
    reset: () => void
}

export function useMutation<T, A>(
    apiPath: string,
    method: "POST" | "GET" = "POST"
): UseMutationResult<T, A> {
    const [state, setState] = useState<UseMutationState<T>>({
        data: null,
        error: null,
        isLoading: false,
    })

    const mutate = async (args: A) => {
        setState({ data: null, error: null, isLoading: true })
        try {
            const options: RequestInit = {
                method,
                headers: { "Content-Type": "application/json" },
            }

            if (method !== "GET") {
                options.body = JSON.stringify(args)
            }

            const res = await fetch(apiPath, options)

            if (!res.ok) {
                throw new Error(`Request failed with status ${res.status}`)
            }

            const data = await res.json()
            setState({ data, error: null, isLoading: false })
            return data
        } catch (err) {
            const errorMessage =
                err instanceof Error ? err.message : "Something went wrong"
            setState({ data: null, error: errorMessage, isLoading: false })
            return null
        }
    }

    const reset = () => {
        setState({ data: null, error: null, isLoading: false })
    }

    return { ...state, mutate, reset }
}
