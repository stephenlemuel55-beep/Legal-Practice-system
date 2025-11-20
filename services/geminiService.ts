import { GoogleGenAI, Modality } from "@google/genai";

// Initialize the client
// API Key is injected via process.env.API_KEY
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

/**
 * Perform Deep Legal Research using Gemini 3 Pro with Thinking Mode.
 * This is critical for analyzing Nigerian traditional data and forming arguments.
 */
export const conductDeepResearch = async (query: string): Promise<string> => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: `You are a senior Nigerian Legal Researcher. Conduct deep research on the following legal issue based on Nigerian Law (Constitution, Case Law, Acts).
      
      Query: ${query}
      
      Provide a comprehensive argument citing specific sections of the law and relevant precedents. Structure your response clearly.`,
      config: {
        thinkingConfig: { thinkingBudget: 32768 }, // Max budget for deep reasoning
      }
    });
    return response.text || "No results found.";
  } catch (error) {
    console.error("Research Error:", error);
    return "An error occurred while conducting deep research. Please try again.";
  }
};

/**
 * Analyze Legal Documents (Text or Image) using Gemini 3 Pro.
 */
export const analyzeDocument = async (text: string, imageBase64?: string, mimeType?: string): Promise<string> => {
  try {
    const parts: any[] = [];
    
    if (imageBase64 && mimeType) {
      parts.push({
        inlineData: {
          data: imageBase64,
          mimeType: mimeType
        }
      });
    }
    
    parts.push({
      text: `You are a Nigerian Legal Expert. Analyze this document/text. 
      Identify key clauses, potential risks, and conformity with Nigerian Law.
      
      Context/Text Provided: ${text}`
    });

    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: { parts },
    });

    return response.text || "Analysis failed.";
  } catch (error) {
    console.error("Analysis Error:", error);
    return "Unable to analyze document at this time.";
  }
};

/**
 * Predict Case Outcomes using Gemini 3 Pro with Thinking Mode.
 * Analyzes precedents and judicial behavior.
 */
export const predictCaseOutcome = async (caseFacts: string): Promise<string> => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: `You are an expert in Nigerian Legal Prediction. Based on the facts provided, predict the likely outcome of this case.
      Consider:
      1. Past case precedents in Nigerian courts.
      2. General behavior of judges in similar matters.
      3. Suggest close fact cases.
      
      Case Facts: ${caseFacts}`,
      config: {
        thinkingConfig: { thinkingBudget: 32768 },
      }
    });
    return response.text || "Prediction unavailable.";
  } catch (error) {
    console.error("Prediction Error:", error);
    return "Error generating prediction.";
  }
};

/**
 * Draft Legal Documents.
 * Uses Gemini 3 Pro for high-quality drafting.
 */
export const draftLegalDocument = async (type: string, details: string): Promise<string> => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: `Draft a legal document strictly adhering to Nigerian Legal Drafting Standards.
      
      Document Type: ${type}
      Specific Details: ${details}
      
      1. Draft the document professionally.
      2. After the document, provide a section titled "Legal Backing" where you cite the specific Nigerian Laws, Acts, or Rules that support the clauses used in this document.`,
    });
    return response.text || "Drafting failed.";
  } catch (error) {
    console.error("Drafting Error:", error);
    return "Error drafting document.";
  }
};

/**
 * Chat Assistant.
 * Uses Gemini 3 Pro for high-quality interaction.
 * Supports custom system instructions and multimodal history.
 */
export const sendChatMessage = async (
  history: {role: string, parts: any[]}[], 
  message: string,
  systemInstruction?: string
): Promise<string> => {
  try {
    const chat = ai.chats.create({
      model: 'gemini-3-pro-preview',
      history: history,
      config: {
        systemInstruction: systemInstruction || "You are U-Practice, a helpful AI legal assistant for Nigerian law practices. Be professional, concise, and accurate.",
      }
    });
    
    const response = await chat.sendMessage({ message });
    return response.text || "";
  } catch (error) {
    console.error("Chat Error:", error);
    return "I am currently unable to respond.";
  }
};

/**
 * Quick Legal Lookup.
 * Uses Gemini Flash Lite for low-latency responses.
 */
export const quickLegalLookup = async (term: string): Promise<string> => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-flash-lite-latest', // Flash Lite for speed
      contents: `Define this legal term or concept briefly in the context of Nigerian Law: ${term}`,
    });
    return response.text || "Definition not found.";
  } catch (error) {
    console.error("Lookup Error:", error);
    return "Lookup failed.";
  }
};

/**
 * Generate Speech (TTS).
 * Reads out legal summaries or arguments.
 */
export const generateSpeech = async (text: string): Promise<ArrayBuffer | null> => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-preview-tts',
      contents: { parts: [{ text }] },
      config: {
        responseModalities: [Modality.AUDIO],
        speechConfig: {
          voiceConfig: {
            prebuiltVoiceConfig: { voiceName: 'Kore' }, // Professional voice
          },
        },
      },
    });

    const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
    if (base64Audio) {
       // Decode base64 to ArrayBuffer
       const binaryString = atob(base64Audio);
       const len = binaryString.length;
       const bytes = new Uint8Array(len);
       for (let i = 0; i < len; i++) {
         bytes[i] = binaryString.charCodeAt(i);
       }
       return bytes.buffer;
    }
    return null;
  } catch (error) {
    console.error("TTS Error:", error);
    return null;
  }
};

/**
 * Get Legal News using Search Grounding.
 * Uses gemini-2.5-flash for speed and search tool.
 */
export const getLegalNews = async (): Promise<{ content: string; sources: { title: string; uri: string }[] }> => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: 'Find the latest legal news in Nigeria from the last 7 days, including Supreme Court judgments, NBA (Nigerian Bar Association) updates, and new bills passed by the National Assembly. Provide a summary of the top 5 stories.',
      config: {
        tools: [{ googleSearch: {} }],
      },
    });

    const sources = response.candidates?.[0]?.groundingMetadata?.groundingChunks
      ?.map((chunk: any) => chunk.web)
      .filter((web: any) => web && web.uri && web.title) || [];

    return {
      content: response.text || "No news found.",
      sources: sources as { title: string; uri: string }[]
    };
  } catch (error) {
    console.error("News Error:", error);
    return { content: "Failed to fetch news.", sources: [] };
  }
};

/**
 * Write Blog Article.
 * Uses Gemini 3 Pro to generate legal content.
 */
export const writeBlogArticle = async (topic: string): Promise<string> => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: `Write a professional legal blog article for a Nigerian audience on the topic: "${topic}".
      
      Structure:
      - Catchy Title
      - Introduction
      - Key Legal Points (citing relevant Nigerian laws)
      - Conclusion/Advice
      
      Tone: Professional yet accessible.`,
    });
    return response.text || "Failed to generate article.";
  } catch (error) {
    console.error("Blog Error:", error);
    return "Error generating article.";
  }
};