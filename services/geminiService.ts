
import { GoogleGenAI, Type, Modality } from "@google/genai";

// Use process.env.API_KEY as per instructions
const getAI = () => new GoogleGenAI({ apiKey: process.env.API_KEY });

export const geminiService = {
  // 1. Global Infinite Job Search
  async searchJobs(query: string) {
    const ai = getAI();
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Search GLOBALLY for current job openings: ${query}. Include diverse international sources. Provide company names, roles, locations, and estimated salary ranges. Output in markdown format with clear headings.`,
      config: {
        tools: [{ googleSearch: {} }],
      },
    });
    return {
      text: response.text,
      sources: response.candidates?.[0]?.groundingMetadata?.groundingChunks || []
    };
  },

  // Salary Insights
  async getSalaryInsights(role: string, location: string) {
    const ai = getAI();
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Provide high-accuracy salary insights for the role: ${role} in ${location}. 
      Include: 
      1. Average Annual Salary (USD or Local Currency)
      2. Entry-level to Senior Range
      3. Year-over-year trend (Up/Down)
      4. A brief "Market Heat" assessment.
      Format the response in clean Markdown.`,
      config: {
        tools: [{ googleSearch: {} }],
      },
    });
    return response.text;
  },

  // 2. Deep Company Culture & Insights
  async getCompanyInsights(companyName: string) {
    const ai = getAI();
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Provide a detailed report on ${companyName}. Include: 1. Company Culture 2. Recent Employee Reviews (pros/cons) 3. Salary benchmarks for software roles 4. Recent news. Use real-time data.`,
      config: {
        tools: [{ googleSearch: {} }],
      },
    });
    return {
      text: response.text,
      sources: response.candidates?.[0]?.groundingMetadata?.groundingChunks || []
    };
  },

  // 3. Recommendation Engine
  async getRecommendations(profile: string) {
    const ai = getAI();
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: `Based on this user profile: "${profile}", suggest 5 specific career paths or high-growth roles they should apply for right now. Explain why for each.`,
      config: {
        thinkingConfig: { thinkingBudget: 10000 }
      }
    });
    return response.text;
  },

  // 4. Maps Grounding for Nearby Companies
  async findNearbyCompanies(latitude: number, longitude: number, industry: string) {
    const ai = getAI();
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `What are some top ${industry} companies or offices located near these coordinates? Provide a list with descriptions.`,
      config: {
        tools: [{ googleMaps: {} }],
        toolConfig: {
          retrievalConfig: {
            latLng: { latitude, longitude }
          }
        }
      },
    });
    return {
      text: response.text,
      sources: response.candidates?.[0]?.groundingMetadata?.groundingChunks || []
    };
  },

  // 5. Text-to-Speech (TTS)
  async speakText(text: string) {
    const ai = getAI();
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash-preview-tts",
      contents: [{ parts: [{ text: `Read this career insight: ${text}` }] }],
      config: {
        responseModalities: [Modality.AUDIO],
        speechConfig: {
          voiceConfig: {
            prebuiltVoiceConfig: { voiceName: 'Kore' },
          },
        },
      },
    });
    return response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
  },

  // 6. Fast AI Responses
  async quickChat(message: string) {
    const ai = getAI();
    const response = await ai.models.generateContent({
      model: 'gemini-flash-lite-latest',
      contents: message,
    });
    return response.text;
  },

  // 7. Resume Analysis (Visual)
  async analyzeResume(base64: string) {
    const ai = getAI();
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: {
        parts: [
          {
            inlineData: {
              data: base64,
              mimeType: 'image/png',
            },
          },
          {
            text: "Analyze this resume screenshot. Provide a professional assessment including strengths, weaknesses, and 3 specific actionable tips to improve it for a senior tech role.",
          },
        ],
      },
    });
    return response.text;
  },

  // 8. Detailed Career Strategy
  async getCareerStrategy(goal: string, current: string) {
    const ai = getAI();
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: `Current Status: ${current}\nTarget Goal: ${goal}\n\nProvide a detailed 5-year professional roadmap to reach this goal. Include key skills to learn, experience to gain, and milestones.`,
      config: {
        thinkingConfig: { thinkingBudget: 15000 }
      }
    });
    return response.text;
  },

  // New: Corporate LinkedIn Analytics
  async getCorporateAnalytics(companyName: string) {
    const ai = getAI();
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Provide a LinkedIn-style corporate analytics report for "${companyName}". 
      Include:
      1. Talent Flow (Where employees come from and go to)
      2. Brand Sentiment on LinkedIn
      3. Key hiring trends in their niche.
      4. Suggestions for employer branding improvement.
      Use real-time data from search grounding.`,
      config: {
        tools: [{ googleSearch: {} }],
      },
    });
    return {
      text: response.text,
      sources: response.candidates?.[0]?.groundingMetadata?.groundingChunks || []
    };
  }
};

// Helpers for audio
export const audioUtils = {
  decode(base64: string) {
    const binaryString = atob(base64);
    const len = binaryString.length;
    const bytes = new Uint8Array(len);
    for (let i = 0; i < len; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }
    return bytes;
  },

  encode(bytes: Uint8Array) {
    let binary = '';
    const len = bytes.byteLength;
    for (let i = 0; i < len; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    return btoa(binary);
  },

  async decodeAudioData(data: Uint8Array, ctx: AudioContext, sampleRate: number, numChannels: number): Promise<AudioBuffer> {
    const dataInt16 = new Int16Array(data.buffer);
    const frameCount = dataInt16.length / numChannels;
    const buffer = ctx.createBuffer(numChannels, frameCount, sampleRate);
    for (let channel = 0; channel < numChannels; channel++) {
      const channelData = buffer.getChannelData(channel);
      for (let i = 0; i < frameCount; i++) {
        channelData[i] = dataInt16[i * numChannels + channel] / 32768.0;
      }
    }
    return buffer;
  }
};
