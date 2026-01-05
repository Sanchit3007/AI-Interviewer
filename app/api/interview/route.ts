import { NextResponse } from 'next/server';
import Groq from 'groq-sdk';

// Initialize Groq
const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

const SYSTEM_PROMPT = `
You are a Senior Technical Interviewer at a top tech company.
Your goal is to evaluate a candidate's answer to a technical interview question.

**Grading Rubric:**
1. **Accuracy (40%):** Is the technical information correct?
2. **Depth (30%):** Did they explain *how* or *why*, or just give a surface-level definition?
3. **Clarity (30%):** Was the answer structured and easy to understand?

**Instructions:**
1. Compare the user's answer strictly against the provided question.
2. If the answer is irrelevant or gibberish, give a score of 0.
3. Your "feedback" must explicitly state what was missing or incorrect.
4. Your "betterAnswer" must be a concise, "Star Candidate" level response.

**Output Format (JSON Only):**
{
  "feedback": "Specific advice on what key concepts were missed and how to structure the answer better.",
  "rating": 0,
  "betterAnswer": "The perfect model answer for this specific question."
}
`;

export async function POST(req: Request) {
  try {
    const { message, question } = await req.json();

    if (!message || !question) {
      return NextResponse.json({ error: "Missing data" }, { status: 400 });
    }

    const chatCompletion = await groq.chat.completions.create({
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        { 
          role: 'user', 
          content: `INTERVIEW QUESTION: "${question}"\nCANDIDATE ANSWER: "${message}"` 
        },
      ],
      // ✨ THIS IS THE FIX: Using the newest supported model
      model: 'llama-3.3-70b-versatile', 
      
      temperature: 0.1,
      max_tokens: 1024,
      response_format: { type: 'json_object' },
    });

    const responseContent = chatCompletion.choices[0]?.message?.content;
    
    if (!responseContent) {
      throw new Error("Empty response from AI");
    }

    const parsedResponse = JSON.parse(responseContent);

    return NextResponse.json(parsedResponse);
    
  } catch (error) {
    console.error('Groq Error:', error);
    return NextResponse.json({
      feedback: "System error: Could not analyze answer. Please check the backend logs.",
      rating: 0,
      betterAnswer: "N/A"
    }, { status: 500 });
  }
}