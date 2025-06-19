'use client'

import { useForm } from "react-hook-form"
import { useLogin } from "../hooks"
import { useAuth } from "@/context/auth"
import { useRouter } from "next/navigation"

type LoginFormValues = {
    email: string
    password: string
}

export default function LoginPage() {
    const { register, handleSubmit, formState: { errors }} = useForm<LoginFormValues>()
    const loginMutation = useLogin()
    const { setSession } = useAuth()
    const router = useRouter()

    const onSubmit = async (data: LoginFormValues) => {
        loginMutation.mutate(data, {
            onSuccess: (res) => {
                setSession(res.session)
                router.push('/chatbot')
            },
            onError: (err: any) => {
                alert(err.message || 'Login failed')
            }
        })
    }

    return (
        <div className="flex justify-center items-center h-screen">
            <div className="flex flex-col justify-center items-center gap-4 border p-8 rounded-md">
                <div>
                     <h1 className="text-xl">Login</h1>
                </div>
                <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-2">
                    <label htmlFor="email">Email</label>
                    <input
                    type="email"
                    className="border rounded-md p-2"
                    {...register('email', { required: 'Email is required'})}
                    />
                    {errors.email && (<p className="text-red-500 text-xs">{errors.email.message}</p>)}
                    <label htmlFor="password">Password</label>
                    <input
                    type="password"
                    className="border rounded-md p-2"
                    {...register('password', { required: 'Password is required'})}
                    />
                    {errors.password && (<p className="text-red-500 text-xs">{errors.password.message}</p>)}
                    <button
                    type="submit"
                    className="border rounded-md p-2 bg-blue-500 text-white hover:bg-blue-700"
                    disabled={loginMutation.isPending}
                    >
                        {loginMutation.isPending ? 'Logging in...' : 'Login'}
                    </button>
                </form>
            </div>
        </div>
    )
}