"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Loader2, Sparkles, Save, Globe, Github, Linkedin, Twitter, X, Plus } from "lucide-react";
import { toast } from "sonner";
import { updateProfile, generateAiBio } from "@/actions/profile";
import type { Database } from "@/types/supabase";

type Profile = Database["public"]["Tables"]["profiles"]["Row"];

interface ProfileFormProps {
    profile: Profile;
}

export function ProfileForm({ profile }: ProfileFormProps) {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [isGenerating, setIsGenerating] = useState(false);
    const [formData, setFormData] = useState({
        full_name: profile.full_name || "",
        company_name: profile.company_name || "",
        bio: profile.bio || "",
        website_url: profile.website_url || "",
        github_url: profile.github_url || "",
        linkedin_url: profile.linkedin_url || "",
        twitter_url: profile.twitter_url || "",
        skills: profile.skills || [],
    });
    const [newSkill, setNewSkill] = useState("");

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            const result = await updateProfile(formData);
            if (result.success) {
                toast.success("Profile updated successfully");
                router.refresh();
            } else {
                toast.error(result.error);
            }
        } catch {
            toast.error("An error occurred while saving");
        } finally {
            setLoading(false);
        }
    };

    const handleGenerateBio = async () => {
        if (formData.skills.length === 0) {
            toast.error("Add some skills first to help the AI generate a better bio!");
            return;
        }

        setIsGenerating(true);
        try {
            const result = await generateAiBio({
                name: formData.full_name,
                role: profile.role || "professional",
                skills: formData.skills,
            });

            if (result.bio) {
                setFormData(prev => ({ ...prev, bio: result.bio! }));
                toast.success("AI Bio generated!");
            } else {
                toast.error(result.error || "Failed to generate bio");
            }
        } catch {
            toast.error("AI generation failed");
        } finally {
            setIsGenerating(false);
        }
    };

    const addSkill = () => {
        if (newSkill.trim() && !formData.skills.includes(newSkill.trim())) {
            setFormData(prev => ({
                ...prev,
                skills: [...prev.skills, newSkill.trim()]
            }));
            setNewSkill("");
        }
    };

    const removeSkill = (skillToRemove: string) => {
        setFormData(prev => ({
            ...prev,
            skills: prev.skills.filter(s => s !== skillToRemove)
        }));
    };

    return (
        <form onSubmit={handleSave} className="space-y-8 animate-in fade-in duration-500">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Column: Basic Info */}
                <div className="lg:col-span-2 space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Professional Profile</CardTitle>
                            <CardDescription>
                                This information will be visible to {profile.role === "employer" ? "job seekers" : "potential employers"}.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="full_name">Full Name</Label>
                                    <Input
                                        id="full_name"
                                        value={formData.full_name}
                                        onChange={e => setFormData(prev => ({ ...prev, full_name: e.target.value }))}
                                        placeholder="John Doe"
                                    />
                                </div>
                                {profile.role === "employer" && (
                                    <div className="space-y-2">
                                        <Label htmlFor="company_name">Company Name</Label>
                                        <Input
                                            id="company_name"
                                            value={formData.company_name}
                                            onChange={e => setFormData(prev => ({ ...prev, company_name: e.target.value }))}
                                            placeholder="Acme Corp"
                                        />
                                    </div>
                                )}
                            </div>

                            <div className="space-y-2">
                                <div className="flex justify-between items-center">
                                    <Label htmlFor="bio">Professional Summary</Label>
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        size="sm"
                                        onClick={handleGenerateBio}
                                        disabled={isGenerating}
                                        className="text-primary hover:text-primary hover:bg-primary/5 gap-2"
                                    >
                                        {isGenerating ? (
                                            <Loader2 className="h-4 w-4 animate-spin" />
                                        ) : (
                                            <Sparkles className="h-4 w-4" />
                                        )}
                                        Generate with AI
                                    </Button>
                                </div>
                                <Textarea
                                    id="bio"
                                    rows={6}
                                    value={formData.bio}
                                    onChange={e => setFormData(prev => ({ ...prev, bio: e.target.value }))}
                                    placeholder="Tell the world what you do best..."
                                    className="resize-none"
                                />
                            </div>

                            <div className="space-y-4">
                                <Label>Skills & Specializations</Label>
                                <div className="flex flex-wrap gap-2 mb-3">
                                    {formData.skills.map(skill => (
                                        <Badge key={skill} variant="secondary" className="px-3 py-1 gap-1 group">
                                            {skill}
                                            <button
                                                type="button"
                                                onClick={() => removeSkill(skill)}
                                                className="ml-1 text-muted-foreground hover:text-destructive transition-colors"
                                            >
                                                <X className="h-3 w-3" />
                                            </button>
                                        </Badge>
                                    ))}
                                </div>
                                <div className="flex gap-2">
                                    <Input
                                        value={newSkill}
                                        onChange={e => setNewSkill(e.target.value)}
                                        onKeyDown={e => e.key === "Enter" && (e.preventDefault(), addSkill())}
                                        placeholder="Add a skill (e.g. React, Python, Marketing)"
                                        className="flex-1"
                                    />
                                    <Button type="button" variant="outline" onClick={addSkill} size="icon">
                                        <Plus className="h-4 w-4" />
                                    </Button>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Online Presence</CardTitle>
                            <CardDescription>
                                Add links to your professional profiles and website.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label className="flex items-center gap-2">
                                        <Globe className="h-4 w-4 text-muted-foreground" /> Website
                                    </Label>
                                    <Input
                                        value={formData.website_url}
                                        onChange={e => setFormData(prev => ({ ...prev, website_url: e.target.value }))}
                                        placeholder="https://yourportfolio.com"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label className="flex items-center gap-2">
                                        <Github className="h-4 w-4 text-muted-foreground" /> GitHub
                                    </Label>
                                    <Input
                                        value={formData.github_url}
                                        onChange={e => setFormData(prev => ({ ...prev, github_url: e.target.value }))}
                                        placeholder="https://github.com/username"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label className="flex items-center gap-2">
                                        <Linkedin className="h-4 w-4 text-muted-foreground" /> LinkedIn
                                    </Label>
                                    <Input
                                        value={formData.linkedin_url}
                                        onChange={e => setFormData(prev => ({ ...prev, linkedin_url: e.target.value }))}
                                        placeholder="https://linkedin.com/in/username"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label className="flex items-center gap-2">
                                        <Twitter className="h-4 w-4 text-muted-foreground" /> Twitter / X
                                    </Label>
                                    <Input
                                        value={formData.twitter_url}
                                        onChange={e => setFormData(prev => ({ ...prev, twitter_url: e.target.value }))}
                                        placeholder="https://twitter.com/username"
                                    />
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Right Column: Profile Preview / Actions */}
                <div className="space-y-6">
                    <Card className="sticky top-6">
                        <CardHeader>
                            <CardTitle>Profile Actions</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <Button
                                className="w-full gap-2 shadow-sm"
                                size="lg"
                                type="submit"
                                disabled={loading}
                            >
                                {loading ? (
                                    <Loader2 className="h-4 w-4 animate-spin" />
                                ) : (
                                    <Save className="h-4 w-4" />
                                )}
                                Save Changes
                            </Button>
                            <Button
                                type="button"
                                variant="outline"
                                className="w-full"
                                onClick={() => router.push("/dashboard")}
                            >
                                Back to Dashboard
                            </Button>

                            <div className="pt-4 border-t text-xs text-muted-foreground">
                                <p>Last updated: {profile.updated_at ? new Date(profile.updated_at).toLocaleDateString() : 'Never'}</p>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="bg-primary/5 border-primary/10">
                        <CardHeader>
                            <CardTitle className="text-sm">Pro Tip</CardTitle>
                        </CardHeader>
                        <CardContent className="text-xs text-muted-foreground leading-relaxed">
                            A complete profile increases your visibility to potential {profile.role === "employer" ? "candidates" : "employers"} by up to 3x. Don&apos;t forget to use the AI Bio generator!
                        </CardContent>
                    </Card>
                </div>
            </div>
        </form>
    );
}
