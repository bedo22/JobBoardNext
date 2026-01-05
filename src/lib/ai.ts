import { google } from "@ai-sdk/google";
import { generateText } from "ai";
import { env } from "@/lib/env";

/**
 * Returns a configured Google Generative AI model instance.
 * @param modelId Optional override for the model ID. If not provided, uses the environment default.
 */
export function getAIModel(modelId?: string) {
    const selectedModel = modelId || env.AI_GOOGLE_MODEL || "gemini-1.5-flash";
    return google(selectedModel);
}

// Default export for convenience
export const aiModel = getAIModel();

/**
 * AI Service for Profile Bio Generation
 */
export async function generateProfileBio({
    name,
    role,
    skills,
    experience,
    modelId
}: {
    name: string;
    role: string;
    skills: string[];
    experience?: string;
    modelId?: string;
}) {
    const prompt = `
        You are an expert career coach and professional copywriter.
        Write a compelling, professional profile bio (about 3-4 sentences) for a ${role} named ${name}.
        
        Key details to include:
        - Core skills: ${skills.join(", ")}
        - Experience: ${experience || "Not specified"}
        
        The bio should be:
        - Professional yet personable.
        - Optimized for a job search platform.
        - Written in the first person.
        - Concise and impactful.
        
        Return ONLY the bio text, no other commentary.
    `;

    try {
        const { text } = await generateText({
            model: getAIModel(modelId),
            prompt: prompt,
        });

        return text.trim();
    } catch (error) {
        console.error("AI Generation Error:", error);
        throw new Error("Failed to generate profile bio");
    }
}
