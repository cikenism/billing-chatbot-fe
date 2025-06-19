import { useAuth } from "@/context/auth"
import { useMounted } from "@/hooks/use-mounted"
import { useEffect } from "react"

export const SessionLogger = () => {
    const { session } = useAuth()
    const hasMounted = useMounted()

    useEffect(() => {
        if (hasMounted) {
            console.log('Session:', session)
        }
    }, [hasMounted, session])
    
    return null
}