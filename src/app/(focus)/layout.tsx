"use client"

import Link from "next/link"
import { Briefcase, Share2, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { motion, useScroll, useSpring } from "motion/react"
import { useState, useCallback } from "react"
import { toast } from "sonner"

export default function FocusLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { scrollYProgress } = useScroll()
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  })

  const [copied, setCopied] = useState(false)

  const copyToClipboard = useCallback(async (url: string) => {
    try {
      await navigator.clipboard.writeText(url)
      setCopied(true)
      toast.success("Link copied to clipboard")
      setTimeout(() => setCopied(false), 2000)
    } catch {
      toast.error("Failed to copy link")
    }
  }, [])

  const handleShare = useCallback(async () => {
    const url = window.location.href
    const title = document.title

    if (navigator.share) {
      try {
        await navigator.share({ title, url })
      } catch (err) {
        if ((err as Error).name !== "AbortError") {
          await copyToClipboard(url)
        }
      }
    } else {
      await copyToClipboard(url)
    }
  }, [copyToClipboard])

  return (
    <div className="min-h-screen bg-background">
      {/* Reading Progress Bar */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-1 bg-primary origin-left z-50"
        style={{ scaleX }}
      />

      {/* Minimal Header */}
      <header className="sticky top-0 z-40 w-full border-b border-border/40 bg-background/80 backdrop-blur-xl">
        <div className="flex h-14 items-center justify-between px-4 max-w-prose mx-auto">
          {/* Logo */}
          <Link
            href="/"
            aria-label="Home"
            className="flex items-center gap-2 font-bold text-lg group transition-all"
          >
            <div className="p-1.5 rounded-lg bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-all">
              <Briefcase className="h-5 w-5" />
            </div>
            <span className="bg-linear-to-r from-foreground to-foreground/60 bg-clip-text text-transparent">
              JobBoard
            </span>
          </Link>

          {/* Share Button */}
          <Button
            variant="ghost"
            size="sm"
            onClick={handleShare}
            className="gap-2"
          >
            {copied ? (
              <Check className="h-4 w-4 text-green-600" />
            ) : (
              <Share2 className="h-4 w-4" />
            )}
            <span className="hidden sm:inline">Share</span>
          </Button>
        </div>
      </header>

      {/* Main Content - Prose Width */}
      <main className="max-w-prose mx-auto px-4 py-8">{children}</main>
    </div>
  )
}
