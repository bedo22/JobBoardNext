"use client";

// src/app/routes/auth/signup.tsx
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { supabase } from "@/lib/supabaseClient"
import { toast } from "sonner"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useEffect } from "react"

const schema = z.object({
  full_name: z.string().min(2, "Name too short"),
  email: z.string().email("Invalid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  role: z.enum(["seeker", "employer"]),
})

type FormData = z.infer<typeof schema>

export default function SignupPage() {
  const { register, handleSubmit, watch, setValue, formState: { isSubmitting } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { role: "seeker" }
  })
  const router = useRouter()
  // eslint-disable-next-line react-hooks/incompatible-library
  const role = watch("role")

  // Redirect if already logged in
  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (user) router.push("/jobs")
    })
  }, [router])

  const onSubmit = async (data: FormData) => {
    const { error, data: authData } = await supabase.auth.signUp({
      email: data.email,
      password: data.password,
      options: {
        data: {
          full_name: data.full_name,
          role: data.role, // This goes to auth.users.raw_user_meta_data
        }
      }
    })

    if (error) {
      toast.error(error.message)
      return
    }

    if (authData.user) {
      // DO NOT insert profile manually!
      // The trigger `handle_new_user` already created it with correct role
      toast.success(`Welcome ${data.full_name}! Account created successfully.`)

      // Small delay to let the trigger finish
      await new Promise(resolve => setTimeout(resolve, 800))

      // Redirect based on role
      router.push(data.role === "employer" ? "/dashboard" : "/jobs")
    }
  }

  return (
    <div className="space-y-6">
      <div className="space-y-2 text-center lg:text-left">
        <h1 className="text-3xl font-black tracking-tighter italic uppercase">Create Your Account</h1>
        <p className="text-muted-foreground font-medium">Join the elite network of talent and employers</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <div className="space-y-2">
          <Label className="font-bold text-xs uppercase tracking-widest text-muted-foreground/70">Full Name</Label>
          <Input {...register("full_name")} placeholder="Ahmed Mohamed" className="h-12 border-border/40 bg-card/50 backdrop-blur-sm" />
        </div>

        <div className="space-y-2">
          <Label className="font-bold text-xs uppercase tracking-widest text-muted-foreground/70">Email Address</Label>
          <Input {...register("email")} type="email" placeholder="ahmed@example.com" className="h-12 border-border/40 bg-card/50 backdrop-blur-sm" />
        </div>

        <div className="space-y-2">
          <Label className="font-bold text-xs uppercase tracking-widest text-muted-foreground/70">Password</Label>
          <Input {...register("password")} type="password" placeholder="••••••••" className="h-12 border-border/40 bg-card/50 backdrop-blur-sm" />
        </div>

        <div className="space-y-4 pt-2">
          <Label className="font-bold text-xs uppercase tracking-widest text-muted-foreground/70">I am a...</Label>
          <RadioGroup value={role} onValueChange={(v) => setValue("role", v as "seeker" | "employer")} className="grid grid-cols-2 gap-4">
            <div className={`flex items-center space-x-3 p-4 rounded-xl border transition-all cursor-pointer ${role === "seeker" ? "bg-primary/5 border-primary/40 ring-1 ring-primary/20" : "bg-card/50 border-border/40 hover:bg-muted"}`} onClick={() => setValue("role", "seeker")}>
              <RadioGroupItem value="seeker" id="seeker" />
              <Label htmlFor="seeker" className="font-bold cursor-pointer">Job Seeker</Label>
            </div>
            <div className={`flex items-center space-x-3 p-4 rounded-xl border transition-all cursor-pointer ${role === "employer" ? "bg-primary/5 border-primary/40 ring-1 ring-primary/20" : "bg-card/50 border-border/40 hover:bg-muted"}`} onClick={() => setValue("role", "employer")}>
              <RadioGroupItem value="employer" id="employer" />
              <Label htmlFor="employer" className="font-bold cursor-pointer">Employer</Label>
            </div>
          </RadioGroup>
        </div>

        <Button type="submit" className="w-full h-12 font-black uppercase tracking-widest shadow-lg shadow-primary/20 transition-all hover:scale-[1.02] active:scale-[0.98] mt-4" disabled={isSubmitting}>
          {isSubmitting ? "Generating Account..." : "Create Account"}
        </Button>
      </form>

      <p className="text-center lg:text-left text-sm font-bold text-muted-foreground">
        Already have an account?{" "}
        <Link href="/login" className="text-primary underline decoration-primary/30 underline-offset-4 hover:decoration-primary transition-all">
          Sign in here
        </Link>
      </p>
    </div>
  )
}
