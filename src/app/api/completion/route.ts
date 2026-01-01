import { google } from '@ai-sdk/google';
import { streamText } from 'ai';

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

export async function POST(req: Request) {
    const { prompt, context } = await req.json();

    const result = await streamText({
        model: google('gemini-2.5-flash-preview-09-2025'),
        system: `You are a professional HR assistant and technical recruiter. 
    Your task is to generate a concise, high-quality list of job requirements based on the provided job title and description.
    
    Guidelines:
    - Provide 5-8 specific, actionable requirements.
    - Each requirement should be on a new line.
    - Do NOT include numbering, bullet points (like * or -), or introductory text.
    - Focus on skills, experience, and educational background appropriate for the role.
    - Output ONLY the requirements, one per line.`,
        prompt: `Job Title: ${context.title}\nJob Description: ${context.description}\n\nAdditional context or request: ${prompt}`,
    });

    return result.toTextStreamResponse();
}
