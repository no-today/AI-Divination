import { GoogleGenAI, Type } from "@google/genai";
import { HexagramData } from "../types";

// Initialize the Gemini API
// We construct the config object explicitly to avoid passing undefined/null/empty strings as baseUrl
// which might cause the SDK to ignore the setting or fail.
const apiKey = process.env.API_KEY;
const baseUrl = process.env.API_BASE_URL;

const config: any = { apiKey: apiKey };

// Only set baseUrl if it is a valid, non-empty string
if (baseUrl && typeof baseUrl === 'string' && baseUrl.trim().length > 0) {
    config.httpOptions = {
      baseUrl: baseUrl // ← Cloudflare 反代地址
    };
}

// Debug log to verify if the custom URL is being picked up
console.log("[GeminiService] Initializing client. Config:", {
    hasApiKey: !!apiKey,
    rawBaseUrl: baseUrl
});

const ai = new GoogleGenAI(config);

export const getWangBiInterpretation = async (
  query: string,
  hexagram: HexagramData
): Promise<{ judgment: string; poem: string[] }> => {
  const model = "gemini-3-pro-preview";

  const systemPrompt = `
    You are Wang Bi (王弼), the genius philosopher.
    
    CONTEXT:
    User is asking a question. You have cast a hexagram.
    You must provide an interpretation in the style of a "Divination Card".

    INPUT:
    - Query: "${query}"
    - Hexagram: ${hexagram.name} (${hexagram.symbol}) - ${hexagram.nature}

    OUTPUT SCHEMA (JSON):
    {
      "judgment": "A concise 8-12 character summary phrase combining the image and meaning.",
      "poem": [
        "Line 1 of interpretation (Poetic, philosophical, approx 8-10 chars)",
        "Line 2",
        "Line 3",
        "Line 4"
      ]
    }

    STYLE GUIDE:
    - Tone: Ancient, elegant, philosophical, Wei-Jin Xuanxue (Metaphysics).
    - NO superstition. Focus on wisdom, strategy, and self-cultivation.
    - "Judgment" example: "地山谦，守正待时" (Earth Mountain Modesty, keep correct and wait).
    - "Poem" example:
      "谦卦示人以谦逊自持之道",
      "不亢不卑，守正修身",
      "与器相济，知己知彼",
      "进则有为，退则修德"

    STRICTLY RETURN JSON.
  `;

  try {
    const response = await ai.models.generateContent({
      model: model,
      contents: systemPrompt,
      config: {
        temperature: 1.0, 
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            judgment: { type: Type.STRING },
            poem: { 
              type: Type.ARRAY,
              items: { type: Type.STRING }
            }
          },
          required: ["judgment", "poem"]
        }
      }
    });

    const jsonStr = response.text;
    if (!jsonStr) {
        return {
            judgment: "道法自然，静观其变",
            poem: ["卦象幽微", "心诚则灵", "顺势而为", "万物自化"]
        };
    }

    return JSON.parse(jsonStr);

  } catch (error) {
    console.error("Wang Bi is in deep meditation:", error);
    return {
        judgment: "云深不知处",
        poem: ["此时无声", "胜有声", "静心修德", "以待天时"]
    };
  }
};

export const getDeepInterpretation = async (
    query: string,
    hexagram: HexagramData,
    currentInterpretation: { judgment: string }
): Promise<string> => {
    const model = "gemini-3-pro-preview";

    const systemPrompt = `
        You are Wang Bi (王弼). 
        The user asks: "${query}".
        The Hexagram is: ${hexagram.name} (${hexagram.nature}).
        
        TASK:
        Provide a "Deep Interpretation" (注疏).
        
        ABSTRACTION LEVEL: 5.5 (Strategic Wisdom).
        - Connect the Hexagram's nature to the specific situation implicitly.
        - Focus on the **Landscape (气象)** and **Strategy (处方)**.
        
        STRUCTURE (3 concise paragraphs, max 250 chars total):
        1. **The Landscape (观象)**: Describe the current "Qi" or situation dynamics (metaphorical but relevant).
        2. **The Mechanic (明理)**: The interaction of forces (Yin/Yang) causing this.
        3. **The Strategy (处方)**: The optimal philosophical stance/attitude to adopt.

        FORMAT:
        - Use **Bold** for the core concept of each paragraph.
        - Elegant Classical Chinese flavor (文言文风).
        - NO Markdown headers.
        - NO lists.
    `;

    try {
        const response = await ai.models.generateContent({
            model: model,
            contents: systemPrompt,
        });
        if (!response.text) throw new Error("No response text");
        return response.text;
    } catch (error) {
        // Throw error so UI knows to show retry button
        throw error;
    }
};

export const getConcreteAdvice = async (
    query: string,
    hexagram: HexagramData
): Promise<string> => {
    const model = "gemini-3-pro-preview";

    const systemPrompt = `
        You are Wang Bi (王弼) descending from the mountain to guide a commoner.
        The user asks: "${query}".
        The Hexagram is: ${hexagram.name}.
        
        TASK:
        Provide **Level 4 Abstraction** (Concrete Guidance / 具体指引).
        Translate the philosophy into real-world execution.

        LANGUAGE CONSTRAINT:
        - Even if the user asks in English or another language, the OUTPUT must be in Chinese.
        
        STRUCTURE (3 concise paragraphs, max 200 chars total):
        1. **The Metaphor (取象)**: "It is like..." (e.g., walking on ice, a guest at a feast). A concrete image of the situation.
        2. **The Action (行事)**: Specific, pragmatic action to take NOW. (e.g., "Do not sign the contract yet", "Seek a partner").
        3. **The Taboo (禁忌)**: What implies failure? What must NOT be done?

        FORMAT:
        - Direct and sharp.
        - Use **Bold** for key terms.
        - Less poetic, more advisory.
        - NO Markdown headers.
    `;

    try {
        const response = await ai.models.generateContent({
            model: model,
            contents: systemPrompt,
        });
        if (!response.text) throw new Error("No response text");
        return response.text;
    } catch (error) {
        throw error;
    }
};