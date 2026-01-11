"use client";

// src/app/routes/auth/login.tsx
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { supabase } from "@/lib/supabaseClient"
import { toast } from "sonner"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useAuth } from "@/hooks/use-auth"
import { useEffect } from "react"

const schema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
})

type loginForm = z.infer<typeof schema>
export default function LoginPage() {
  const { register, handleSubmit } = useForm<loginForm>({ resolver: zodResolver(schema) })
  const router = useRouter()
  const { user } = useAuth()

  // Redirect if already logged in
  useEffect(() => {
    if (user) {
      router.push("/jobs")
    }
  }, [user, router])

  if (user) return null

  const onSubmit = async (data: loginForm) => {
    const { error } = await supabase.auth.signInWithPassword(data)
    if (error) {
      toast.error(error.message)
    } else {
      toast.success("Welcome back!")
      router.push("/jobs")
    }
  }

  return (
    <div className="container py-20 flex justify-center">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl text-center">Login to JobBoard</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <Input {...register("email")} type="email" placeholder="Email" />
            <Input {...register("password")} type="password" placeholder="Password" />
            <Button type="submit" className="w-full">Login</Button>
          </form>
          <p className="text-center mt-4 text-sm">
                        Don&apos;t have an account?{" "}
                        <Link href="/signup" className="underline hover:text-primary">
                            Sign up
                        </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  )
}