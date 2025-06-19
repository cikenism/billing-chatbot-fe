"use client"

import { useAuth } from "@/context/auth"
import { useRouter } from "next/navigation"
import { useEffect } from "react"

export const ProtectedRoute = ({ children}: { children: React.ReactNode}) => {
    const { session } = useAuth()
    const router = useRouter()

    useEffect(() => {
        if (!session) {
            router.replace('/')
        }
    }, [session])

    if (!session) return null
    
    return <>{children}</>
}