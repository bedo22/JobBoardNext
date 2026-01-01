// src/components/apply-dialog.tsx
"use client";

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { useAuth } from "@/hooks/use-auth"
import { supabase } from "@/lib/supabaseClient"
import { toast } from "sonner"
import { Upload, FileText } from "lucide-react"

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

  const handleApply = async () => {
    if (!resumeFile) {
      toast.error("Please upload your resume")
      return
    }

    setUploading(true)

    // 1. Upload resume to Supabase Storage
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

    // 2. Save application
    const { error } = await supabase
      .from('applications')
      .insert({
        job_id: jobId,
        seeker_id: user!.id,
        cover_letter: coverLetter,
        resume_url: publicUrl,
      })

    if (error) {
      toast.error("Failed to submit application")
    } else {
      toast.success("Application sent successfully!")
      setOpen(false)
    }

    setUploading(false)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="lg" className="w-full text-lg">
          <FileText className="mr-2 h-5 w-5" /> Apply Now
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-lg">
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
      </DialogContent>
    </Dialog>
  )
}