"use client";

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { useAuth } from "@/hooks/use-auth"
import { supabase } from "@/lib/supabaseClient"
import { toast } from "sonner"
import { Upload, FileText, CheckCircle, PartyPopper } from "lucide-react"
import { submitApplication } from "@/actions/applications"
import { Confetti, type ConfettiRef } from "@/components/ui/confetti"

interface ApplyDialogProps {
    jobTitle: string
    jobId: string
}

export function ApplyDialog({ jobTitle, jobId }: ApplyDialogProps) {
    const { user } = useAuth()
    const [open, setOpen] = useState(false)
    const [coverLetter, setCoverLetter] = useState("")
    const [resumeFile, setResumeFile] = useState<File | null>(null)
    const [uploading, setUploading] = useState(false)
    const [success, setSuccess] = useState(false)
    const confettiRef = useRef<ConfettiRef>(null)

    const handleApply = async () => {
        if (!resumeFile) {
            toast.error("Please upload your resume")
            return
        }

        setUploading(true)

        const fileExt = resumeFile.name.split('.').pop()
        const fileName = `${user?.id}/${jobId}-${Date.now()}.${fileExt}`

        const { error: uploadError } = await supabase.storage
            .from('resumes')
            .upload(fileName, resumeFile)

        if (uploadError) {
            toast.error("Failed to upload resume")
            setUploading(false)
            return
        }

        const { data: { publicUrl } } = supabase.storage
            .from('resumes')
            .getPublicUrl(fileName)

        const result = await submitApplication({
            jobId,
            coverLetter,
            resumeUrl: publicUrl
        });

        if (result.error) {
            toast.error(result.error)
        } else {
            setSuccess(true)
            confettiRef.current?.fire({
                particleCount: 100,
                spread: 70,
                origin: { y: 0.6 }
            })
        }

        setUploading(false)
    }

    const handleClose = () => {
        setOpen(false)
        if (success) {
            window.location.reload()
        }
    }

    return (
        <Dialog open={open} onOpenChange={handleClose}>
            <DialogTrigger asChild>
                <Button size="lg" className="w-full text-lg">
                    <FileText className="mr-2 h-5 w-5" /> Apply Now
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-lg">
                <Confetti ref={confettiRef} className="absolute inset-0 pointer-events-none z-50" />
                
                {success ? (
                    <div className="py-12 text-center space-y-4">
                        <div className="mx-auto w-16 h-16 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center">
                            <CheckCircle className="h-10 w-10 text-emerald-600" />
                        </div>
                        <div className="space-y-2">
                            <h3 className="text-2xl font-bold flex items-center justify-center gap-2">
                                Application Sent! <PartyPopper className="h-6 w-6 text-yellow-500" />
                            </h3>
                            <p className="text-muted-foreground">
                                Your application for <strong>{jobTitle}</strong> has been submitted successfully.
                            </p>
                        </div>
                        <Button onClick={handleClose} className="mt-4">
                            Done
                        </Button>
                    </div>
                ) : (
                    <>
                        <DialogHeader>
                            <DialogTitle>Apply for {jobTitle}</DialogTitle>
                        </DialogHeader>

                        <div className="space-y-6 mt-4">
                            <div>
                                <Label>Cover Letter (Optional)</Label>
                                <Textarea
                                    placeholder="Tell us why you're the perfect fit..."
                                    value={coverLetter}
                                    onChange={(e) => setCoverLetter(e.target.value)}
                                    rows={6}
                                    className="mt-2"
                                />
                            </div>

                            <div>
                                <Label>Resume / CV</Label>
                                <div className="mt-2">
                                    <Input
                                        type="file"
                                        accept=".pdf,.doc,.docx"
                                        onChange={(e) => setResumeFile(e.target.files?.[0] || null)}
                                    />
                                    {resumeFile && (
                                        <p className="text-sm text-green-600 mt-2 flex items-center gap-1">
                                            <Upload className="h-4 w-4" /> {resumeFile.name}
                                        </p>
                                    )}
                                </div>
                            </div>

                            <Button onClick={handleApply} disabled={uploading} className="w-full">
                                {uploading ? "Submitting..." : "Submit Application"}
                            </Button>
                        </div>
                    </>
                )}
            </DialogContent>
        </Dialog>
    )
}
