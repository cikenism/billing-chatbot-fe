import { supabase } from "@/lib/supabase";
import { useMutation } from "@tanstack/react-query";
import { stringify } from "querystring";

export function useLogin () {
    return useMutation({
        mutationFn: async ({
            email,
            password,
        }: {
            email: string;
            password: string;
        }) => {
            const { error, data } = await supabase.auth.signInWithPassword({
                email, password
            })

            if (error) throw error
            return data
        }
    })
}