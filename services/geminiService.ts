import { GoogleGenAI, GenerateContentResponse } from "@google/genai";
import { GeneratedContent } from '../types';

// Ensure API key is present
const apiKey = process.env.API_KEY || '';
const ai = new GoogleGenAI({ apiKey });

export const generateLessonContent = async (lessonTitle: string, lessonDescription: string): Promise<GeneratedContent> => {
  if (!apiKey) {
    return {
      markdown: "### Error: Missing API Key\nPlease ensure `process.env.API_KEY` is set to use the Gemini API."
    };
  }

  const prompt = `
    You are an expert Senior Python Instructor teaching a Senior Dart/Flutter Developer.
    
    Target Audience Profile:
    - Expert in Dart, Flutter, OOP, Async/Await.
    - Used to 'pub get', 'pubspec.yaml', strict typing.
    - Needs to learn Python specifically using 'uv' for package management (NOT pip directly).
    - Appreciates side-by-side code comparisons (Dart vs Python).
    
    Task:
    Create a comprehensive lesson for the topic: "${lessonTitle}".
    Description: "${lessonDescription}"
    
    Requirements:
    1. **Deep Technical Comparison**: Explain concepts by referencing Dart equivalents. (e.g., "This is similar to a Dart Record...").
    2. **UV Integration**: When discussing packages or environments, ALWAYS use 'uv' commands (e.g., 'uv init', 'uv add', 'uv run'). Do not suggest 'pip install' unless explaining legacy systems.
    3. **Code Blocks**: Provide code examples in both Dart (for familiarity) and Python (the target). Use strict type hinting in Python examples to make them comfortable.
    4. **Tone**: Professional, technical, concise. No fluff.
    5. **Quiz**: End with a single multiple-choice question to test understanding.

    Format the output strictly as JSON without markdown code fences around the JSON itself if possible, or I will strip them. 
    The JSON structure must be:
    {
      "markdown": "The full lesson content in Markdown format...",
      "quiz": {
        "question": "The question string",
        "options": ["Option A", "Option B", "Option C", "Option D"],
        "correctIndex": 0 // integer 0-3
      }
    }
  `;

  try {
    const response: GenerateContentResponse = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
      }
    });

    const text = response.text || "{}";
    const data = JSON.parse(text) as GeneratedContent;
    return data;
  } catch (error) {
    console.error("Gemini API Error:", error);
    return {
      markdown: `### Error Generating Lesson\n\nFailed to load content for *${lessonTitle}*. \n\nDebug info: ${error instanceof Error ? error.message : String(error)}`,
    };
  }
};

export const chatWithMentor = async (history: { role: 'user' | 'model'; text: string }[], message: string): Promise<string> => {
    if (!apiKey) return "API Key missing.";

    const chat = ai.chats.create({
        model: 'gemini-3-flash-preview',
        config: {
            systemInstruction: `
            You are a Senior Python Mentor for a Senior Dart Developer. 
            - Always prefer 'uv' for tooling advice.
            - Compare Python concepts to Dart/Flutter concepts to bridge the gap.
            - Encourage Pythonic code (list comprehensions, context managers, decorators) over "Java-style" or "Dart-style" Python.
            - Be concise and code-heavy.
            `
        },
        history: history.map(h => ({
            role: h.role,
            parts: [{ text: h.text }]
        }))
    });

    try {
        const result = await chat.sendMessage({ message });
        return result.text || "I couldn't generate a response.";
    } catch (error) {
        return "Sorry, I encountered an error connecting to the Python Mentor service.";
    }
};
