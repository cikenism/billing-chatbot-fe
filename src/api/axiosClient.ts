import { supabase } from "@/lib/supabase";
import axios from "axios";
 
const axiosInstance = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    }
})

axiosInstance.interceptors.request.use( async (config) => {
    const { data: { session }} = await supabase.auth.getSession()

    if (session) {
        config.headers.Authorization = `Bearer ${session.access_token}`
    }
    return config
})

export default axiosInstance