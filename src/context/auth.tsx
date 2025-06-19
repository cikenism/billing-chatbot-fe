'use client'

import { supabase } from "@/lib/supabase";
import { Session } from "@supabase/supabase-js";
import { createContext, ReactNode, useContext, useEffect, useState } from "react";

type AuthContextType = {
    session: Session | null;
    setSession: ( session: Session | null ) => void
}

const AuhtContext = createContext<AuthContextType | undefined>(undefined)

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [ session, setSession ] = useState<Session | null>(null)

    useEffect(() => {
        supabase.auth.getSession().then(({ data }) => {
            setSession(data.session ?? null )
        })

        const { data: listener } = supabase.auth.onAuthStateChange((event, session) => {
            setSession(session)
        })

        return () => {
            listener.subscription.unsubscribe()
        }
    }, [])

    return (
        <AuhtContext.Provider value={{ session, setSession}}>
            {children}
        </AuhtContext.Provider>
    )
}

export const useAuth = () => {
    const context = useContext(AuhtContext)
    if (!context) throw new Error ('useAuth must be used within AuthProvider')
        return context
}