
import { GoogleGenAI, Type } from "@google/genai";

// Correct SDK initialization using a named parameter and direct environment variable access
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const generateQuestions = async (role: string, experience: string, skills: string) => {
  const prompt = `Generate exactly 10 high-quality technical interview questions and comprehensive answers for a ${role} position with ${experience} of experience. Focus on skills like ${skills}. 
  Return the result as a JSON array of objects, where each object has "question" and "answer" properties. Ensure questions range from fundamental concepts to advanced scenarios.`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              question: { type: Type.STRING },
              answer: { type: Type.STRING }
            },
            required: ["question", "answer"]
          }
        }
      }
    });

    return JSON.parse(response.text?.trim() || '[]').map((q: any) => ({
      ...q,
      id: Math.random().toString(36).substr(2, 9),
      isMastered: false
    }));
  } catch (error) {
    console.error("Error generating questions:", error);
    return [];
  }
};

export const generateMoreQuestions = async (topic: any, existingQuestions: string[]) => {
  const prompt = `You are an expert interviewer. The candidate is preparing for a ${topic.title} role (${topic.experience} exp) with skills: ${topic.skills.join(', ')}.
  
  They already have these questions: "${existingQuestions.join('", "')}".
  
  Generate 10 MORE unique, high-quality technical interview questions and answers that cover DIFFERENT sub-topics or advanced scenarios not covered above.
  Return as a JSON array of objects with "question" and "answer" properties.`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              question: { type: Type.STRING },
              answer: { type: Type.STRING }
            },
            required: ["question", "answer"]
          }
        }
      }
    });

    return JSON.parse(response.text?.trim() || '[]').map((q: any) => ({
      ...q,
      id: Math.random().toString(36).substr(2, 9),
      isMastered: false
    }));
  } catch (error) {
    console.error("Error generating more questions:", error);
    return [];
  }
};

export const generateDeepDive = async (topicTitle: string, question: string) => {
  const prompt = `You are a fun and world-class technical mentor. Provide a comprehensive, interesting, and "fun to read" research response for this interview topic.
  
  Topic: ${topicTitle}
  Question: ${question}
  
  Format the response as a fun mini-article with:
  1. 🌟 "The Big Picture": Use a fun real-world analogy (e.g., comparing React props to a relay race).
  2. 🛠️ "How it works": Break it down simply.
  3. 💻 "Code in Action": Provide a clean, commented code example using Markdown.
  4. 💡 "Pro Tip": A secret insight that makes the candidate stand out.
  5. ⚠️ "Don't Trip": Common pitfalls to avoid.
  
  Style: Use emojis, bold text, and a friendly, encouraging tone. Make it feel like an interesting tech blog post rather than a dry textbook.`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: prompt,
    });
    return response.text;
  } catch (error) {
    console.error("Error generating deep dive:", error);
    return "Failed to load additional information. Please try again.";
  }
};

export const generateConfusedExplanation = async (topicTitle: string, question: string, previousExplanation: string) => {
  const prompt = `The user is still confused about the following interview topic after reading a deep dive. 
  
  Topic: ${topicTitle}
  Question: ${question}
  
  Please provide a "Simpler Version" (ELI5 - Explain Like I'm 5 style). 
  - Use even simpler analogies.
  - Break it down into very small, step-by-step concepts.
  - Focus on the 'Why' before the 'How'.
  - Use very clear, bold headers.
  - Avoid complex jargon or explain it immediately if used.
  
  Make it encouraging and extremely easy to grasp.`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: prompt,
    });
    return response.text;
  } catch (error) {
    console.error("Error re-explaining:", error);
    return "I'm sorry, I'm having trouble simplifying this further right now. Let's try focusing on the basics of " + topicTitle;
  }
};

export const createPracticeChat = (topic: any) => {
  return ai.chats.create({
    model: 'gemini-3-pro-preview',
    config: {
      systemInstruction: `You are a Senior Lead Engineer and hiring manager for a ${topic.title} position.
      The candidate has ${topic.experience} of experience. Skills to assess: ${topic.skills.join(', ')}.
      
      YOUR GOAL:
      Conduct a high-stakes but fair mock interview. 
      
      YOUR STRUCTURE FOR EVERY TURN:
      1. FEEDBACK: Briefly critique the candidate's last answer. Mention what was strong and what was missing.
      2. RATING: Give a quick 1-10 rating for the last answer internally.
      3. NEXT QUESTION: Ask a follow-up if they were vague, or a new challenging question if they were clear.
      
      TONE:
      Professional, demanding of technical precision, but encouraging. Use markdown for structure.
      
      IMPORTANT:
      If the candidate's answer is very short, challenge them to explain the "why" or "how it works under the hood".`,
    }
  });
};

export const generateInterviewSummary = async (topic: any, chatHistory: string) => {
  const prompt = `You are a career coach. Analyze the following mock interview transcript for a ${topic.title} role.
  
  TRANSCRIPT:
  ${chatHistory}
  
  Provide a structured summary in JSON format with the following:
  1. overallScore (1-100)
  2. keyStrengths (Array of strings)
  3. focusAreas (Array of objects with "topic" and "reason")
  4. studyPlan (Array of 3 specific action items)
  5. summary (A 2-sentence encouraging closing statement)`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            overallScore: { type: Type.NUMBER },
            keyStrengths: { type: Type.ARRAY, items: { type: Type.STRING } },
            focusAreas: { 
              type: Type.ARRAY, 
              items: { 
                type: Type.OBJECT,
                properties: {
                  topic: { type: Type.STRING },
                  reason: { type: Type.STRING }
                }
              }
            },
            studyPlan: { type: Type.ARRAY, items: { type: Type.STRING } },
            summary: { type: Type.STRING }
          }
        }
      }
    });

    return JSON.parse(response.text?.trim() || '{}');
  } catch (error) {
    console.error("Error generating summary:", error);
    return null;
  }
};
