"use client";

import { useActionState, startTransition, useEffect } from "react";
import { useForm, useWatch } from "react-hook-form";
import { useCompletion } from "@ai-sdk/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/hooks/use-auth";
import { useRouter, useSearchParams } from "next/navigation";
import { postJob } from "./actions";
import { supabase } from "@/lib/supabaseClient";
import { Sparkles, Loader2 } from "lucide-react";

// Schema for Client-Side Validation
const jobSchema = z.object({
    title: z.string().min(3, "Title must be at least 3 characters"),
    company_name: z.string().min(2, "Company name is required"),
    location: z.string().optional(),
    type: z.enum(["full-time", "part-time", "contract", "internship"]),
    location_type: z.enum(["onsite", "remote", "hybrid"]),
    salary_min: z.number({ message: "Must be a number" }).optional(),
    salary_max: z.number({ message: "Must be a number" }).optional(),
    description: z.string().min(50, "Description must be at least 50 characters"),
    requirements: z.string().min(1, "Requirements are required"),
    benefits: z.string().optional(),
});

type JobForm = z.infer<typeof jobSchema>;

export default function PostJobPage() {
    const { profile, isEmployer } = useAuth();
    const router = useRouter();
    const [state, formAction, isPending] = useActionState(postJob, { error: "", success: false });

    const { register, trigger, formState: { errors }, setValue, getValues, control } = useForm<JobForm>({
        resolver: zodResolver(jobSchema),
        mode: "onBlur",
        defaultValues: {
            company_name: profile?.company_name || "",
            location_type: "onsite",
            type: "full-time",
        }
    });

    const searchParams = useSearchParams();
    const editId = searchParams.get('edit');

    useEffect(() => {
        const prefill = async () => {
            if (!editId) return;
            const { data: job } = await supabase
                .from('jobs')
                .select('*')
                .eq('id', editId)
                .maybeSingle();
            if (!job) return;
            // Prefill fields; requirements/benefits are arrays in DB
            setValue('title', job.title);
            setValue('company_name', job.company_name);
            setValue('location', job.location || '');
            setValue('type', job.type || 'full-time');
            setValue('location_type', job.location_type || 'onsite');
            setValue('salary_min', job.salary_min || undefined);
            setValue('salary_max', job.salary_max || undefined);
            setValue('description', job.description || '');
            setValue('requirements', Array.isArray(job.requirements) ? job.requirements.join('\n') : '');
            setValue('benefits', Array.isArray(job.benefits) ? job.benefits.join('\n') : '');
        }
        void prefill();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [editId]);

    const { complete, completion, isLoading: isAiLoading } = useCompletion({
        api: "/api/completion",
        streamProtocol: "text",
        onFinish: (_prompt: string, completion: string) => {
            setValue("requirements", completion, { shouldValidate: true });
        },
    });

    // Update requirements field in real-time as AI streams
    const requirementsValue = useWatch({ control, name: "requirements" });
    const titleValue = useWatch({ control, name: "title" });
    const descriptionValue = useWatch({ control, name: "description" });
    const isGenerating = isAiLoading && completion;

    // Effectively combine existing value with completion during streaming
    // or just let completion take over if it's the primary generation source.
    const displayRequirements = isGenerating ? completion : requirementsValue;

    const handleGenerateAI = async () => {
        const title = getValues("title");
        const description = getValues("description");

        if (!title || !description) {
            alert("Please enter a job title and description first so the AI has context!");
            return;
        }

        await complete("", {
            body: {
                context: { title, description }
            }
        });
    };

    // Helper to sync React Hook Form with Server Action FormData
    const handleClientSubmit = async (formData: FormData) => {
        // Trigger validation before submission
        const isValidForm = await trigger();
        if (!isValidForm) return;

        // Add RHF values that might be controlled (like Select) to FormData if not present naturally,
        // but inputs usually work natively with FormData.
        // For Select components (shadcn), we need to ensure the hidden inputs or values are in FormData.
        // Actually, easiest way is to append RHF data to a new FormData or just use formAction if inputs have 'name'.
        // Shadcn Select doesn't use native select, so we need hidden inputs.

        // Let's manually append the Select values since they are controlled
        const values = getValues();
        formData.set("type", values.type);
        formData.set("location_type", values.location_type);

        startTransition(() => {
            formAction(formData);
        });
    };

    if (!isEmployer) {
        return (
            <div className="container py-20 text-center">
                <h1 className="text-3xl font-bold mb-4">Only employers can post jobs</h1>
                <Button onClick={() => router.push("/jobs")}>Browse Jobs</Button>
            </div>
        );
    }

    return (
        <div className="container py-10 max-w-3xl">
            <Card>
                <CardHeader>
                    <CardTitle className="text-3xl">{editId ? 'Edit Job' : 'Post a New Job'}</CardTitle>
                </CardHeader>
                <CardContent>
                    {state?.error && (
                        <div className="bg-destructive/15 text-destructive p-3 rounded-md mb-6">
                            {state.error}
                        </div>
                    )}

                    <form action={handleClientSubmit} className="space-y-6">
                        {editId && <input type="hidden" name="job_id" value={editId} />}
                        <div>
                            <Label>Job Title</Label>
                            <Input {...register("title")} name="title" placeholder="Senior React Developer" />
                            {errors.title && <p className="text-destructive text-sm mt-1">{errors.title.message}</p>}
                        </div>

                        <div>
                            <Label>Company Name</Label>
                            <Input {...register("company_name")} name="company_name" />
                            {errors.company_name && <p className="text-destructive text-sm mt-1">{errors.company_name.message}</p>}
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <Label>Job Type</Label>
                                {/* Hidden input for Server Action */}
                                <input type="hidden" name="type" value={getValues("type")} />
                                <Select onValueChange={(v) => setValue("type", v as "full-time" | "part-time" | "contract" | "internship")} defaultValue="full-time">
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="full-time">Full-time</SelectItem>
                                        <SelectItem value="part-time">Part-time</SelectItem>
                                        <SelectItem value="contract">Contract</SelectItem>
                                        <SelectItem value="internship">Internship</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <div>
                                <Label>Location Type</Label>
                                <input type="hidden" name="location_type" value={getValues("location_type")} />
                                <Select onValueChange={(v) => setValue("location_type", v as "onsite" | "remote" | "hybrid")} defaultValue="onsite">
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="onsite">On-site</SelectItem>
                                        <SelectItem value="remote">Remote</SelectItem>
                                        <SelectItem value="hybrid">Hybrid</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        <div>
                            <Label>Location (for on-site/hybrid)</Label>
                            <Input {...register("location")} name="location" placeholder="Cairo, Egypt" />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <Label>Min Salary (EGP)</Label>
                                <Input type="number" {...register("salary_min", { valueAsNumber: true })} name="salary_min" />
                                {errors.salary_min && <p className="text-destructive text-sm mt-1">{errors.salary_min.message}</p>}
                            </div>
                            <div>
                                <Label>Max Salary (EGP)</Label>
                                <Input type="number" {...register("salary_max", { valueAsNumber: true })} name="salary_max" />
                                {errors.salary_max && <p className="text-destructive text-sm mt-1">{errors.salary_max.message}</p>}
                            </div>
                        </div>

                        <div>
                            <Label>Description</Label>
                            <Textarea {...register("description")} name="description" rows={8} />
                            {errors.description && <p className="text-destructive text-sm mt-1">{errors.description.message}</p>}
                        </div>

                        <div>
                            <div className="flex justify-between items-center mb-2">
                                <Label>Requirements (one per line)</Label>
                                <Button
                                    type="button"
                                    variant="outline"
                                    size="sm"
                                    onClick={handleGenerateAI}
                                    disabled={isAiLoading || !titleValue || !descriptionValue }
                                    className="h-8 gap-2 bg-primary/5 hover:bg-primary/10 border-primary/20"
                                >
                                    {isAiLoading ? (
                                        <Loader2 className="h-3.5 w-3.5 animate-spin" />
                                    ) : (
                                        <Sparkles className="h-3.5 w-3.5 text-primary" />
                                    )}
                                    {isAiLoading ? "Generating..." : "Magic Generate"}
                                </Button>
                            </div>
                            <Textarea
                                {...register("requirements")}
                                name="requirements"
                                rows={6}
                                placeholder="3+ years React experience&#10;Strong TypeScript skills"
                                value={displayRequirements}
                                onChange={(e) => {
                                    setValue("requirements", e.target.value);
                                }}
                            />
                            {errors.requirements && <p className="text-destructive text-sm mt-1">{errors.requirements.message}</p>}
                        </div>

                        <div>
                            <Label>Benefits (one per line, optional)</Label>
                            <Textarea {...register("benefits")} name="benefits" rows={4} />
                        </div>

                        <Button type="submit" size="lg" className="w-full" disabled={isPending}>
                            {isPending ? "Posting Job..." : "Post Job"}
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </div>
    )
}
