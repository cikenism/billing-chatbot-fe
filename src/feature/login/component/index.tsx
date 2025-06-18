'use client'

import { useForm } from "react-hook-form"
import { useLogin } from "../hooks"

type LoginFormValues = {
    email: string
    password: string
}

export default function LoginPage() {
    const { register, handleSubmit, formState: { errors }} = useForm<LoginFormValues>()
    const loginMutation = useLogin()

    const onSubmit = async (data: LoginFormValues) => {
        try {
            await loginMutation.mutateAsync(data)
            alert('Login successful!')
        } catch (error: any) {
            alert(error.message)
        }
    }

    return (
        <div className="flex justify-center">
            <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-2">
                <h1>Login</h1>
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
                className="border rounded-md p-2"
                disabled={loginMutation.isPending}
                >
                    {loginMutation.isPending ? 'Logging in...' : 'Login'}
                </button>
            </form>
        </div>
    )
}