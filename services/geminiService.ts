import { GoogleGenAI, Type } from "@google/genai";
import { Question, QuizConfig } from "../types";

// Initialize the client. API key is injected from the environment.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const generateQuizQuestions = async (config: QuizConfig): Promise<Question[]> => {
  try {
    const prompt = `
      You are a senior exam setter for the Rajasthan REET Mains (Grade 3 Teacher Recruitment) Exam.
      Create a multiple-choice quiz in HINDI (Devanagari script) with the following specifications:
      
      Target Subject/Paper: ${config.topic}
      Difficulty Level: ${config.difficulty}
      Number of Questions: ${config.questionCount}

      Instructions:
      1. All Text MUST BE IN HINDI. (English terms allowed in brackets where necessary).
      2. Strictly follow the REET Mains Syllabus (RSMSSB Pattern).
      3. For 'Level 1', cover Rajasthan GK, Current Affairs, Math, General Science, and Psychology.
      4. For 'Rajasthan GK Special', focus deeply on History, Art, Culture, Geography, and Rajasthani Language Literature.
      5. For Subject papers (Science/Math, SST, Hindi, etc.), focus on the specific subject content + Teaching Methods (Reet style).
      6. Ensure options are confusing and realistic (high quality distractors).
      7. Provide a detailed explanation in Hindi for the correct answer.
    `;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            questions: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  text: { type: Type.STRING, description: "The question text in Hindi" },
                  options: { 
                    type: Type.ARRAY, 
                    items: { type: Type.STRING },
                    description: "An array of 4 multiple choice options in Hindi"
                  },
                  correctAnswerIndex: { 
                    type: Type.INTEGER, 
                    description: "The zero-based index of the correct option (0-3)" 
                  },
                  explanation: { 
                    type: Type.STRING, 
                    description: "Explanation in Hindi of why the answer is correct" 
                  },
                },
                required: ["text", "options", "correctAnswerIndex", "explanation"],
              },
            },
          },
        },
      },
    });

    if (!response.text) {
      throw new Error("No response from Gemini");
    }

    const data = JSON.parse(response.text);
    
    // Add IDs to questions for React keys
    const questionsWithIds = data.questions.map((q: any, index: number) => ({
      ...q,
      id: `q-${Date.now()}-${index}`,
    }));

    return questionsWithIds;

  } catch (error) {
    console.error("Error generating quiz:", error);
    throw error;
  }
};