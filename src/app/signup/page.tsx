"use client";

// src/app/routes/auth/signup.tsx
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
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
    <div className="container py-20 flex justify-center">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl text-center">Create Your Account</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div>
              <Label>Full Name</Label>
              <Input {...register("full_name")} placeholder="Ahmed Mohamed" className="mt-2" />
            </div>

            <div>
              <Label>Email</Label>
              <Input {...register("email")} type="email" placeholder="ahmed@example.com" className="mt-2" />
            </div>

            <div>
              <Label>Password</Label>
              <Input {...register("password")} type="password" placeholder="••••••••" className="mt-2" />
            </div>

            <div>
              <Label>I am a...</Label>
              <RadioGroup value={role} onValueChange={(v) => setValue("role", v as "seeker" | "employer")}>
                <div className="flex items-center space-x-3 mt-3">
                  <RadioGroupItem value="seeker" id="seeker" />
                  <Label htmlFor="seeker" className="cursor-pointer">Job Seeker</Label>
                </div>
                <div className="flex items-center space-x-3 mt-2">
                  <RadioGroupItem value="employer" id="employer" />
                  <Label htmlFor="employer" className="cursor-pointer">Employer / Company</Label>
                </div>
              </RadioGroup>
            </div>

            <Button type="submit" className="w-full" size="lg" disabled={isSubmitting}>
              {isSubmitting ? "Creating Account..." : "Sign Up"}
            </Button>
          </form>

          <p className="text-center mt-6 text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link href="/login" className="text-primary font-medium hover:underline">
              Login here
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  )
}