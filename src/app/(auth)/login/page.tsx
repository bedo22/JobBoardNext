"use client";

// src/app/routes/auth/login.tsx
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
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
    <div className="space-y-6">
      <div className="space-y-2 text-center lg:text-left">
        <h1 className="text-3xl font-black tracking-tighter italic uppercase">Welcome Back</h1>
        <p className="text-muted-foreground font-medium">Enter your credentials to access your account</p>
      </div>
      
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="space-y-2">
          <Input {...register("email")} type="email" placeholder="email@example.com" className="h-12 border-border/40 bg-card/50 backdrop-blur-sm focus:ring-primary/20" />
        </div>
        <div className="space-y-2">
          <Input {...register("password")} type="password" placeholder="••••••••" className="h-12 border-border/40 bg-card/50 backdrop-blur-sm focus:ring-primary/20" />
        </div>
        <Button type="submit" className="w-full h-12 font-black uppercase tracking-widest shadow-lg shadow-primary/20 transition-all hover:scale-[1.02] active:scale-[0.98]">
           Sign In
        </Button>
      </form>

      <p className="text-center lg:text-left text-sm font-bold text-muted-foreground">
        Don&apos;t have an account?{" "}
        <Link href="/signup" className="text-primary underline decoration-primary/30 underline-offset-4 hover:decoration-primary transition-all">
          Create an account
        </Link>
      </p>
    </div>
  )
}