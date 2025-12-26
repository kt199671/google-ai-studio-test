
import { GoogleGenAI } from "@google/genai";

/**
 * 分子に関する情報をGemini APIを使用して取得します。
 * @param moleculeName 分子の名前
 * @param formula 化学式
 * @param question (任意) ユーザーからの質問
 * @returns AIによる解説テキスト
 */
export async function askGeminiAboutMolecule(moleculeName: string, formula: string, question?: string): Promise<string> {
  // Always use new GoogleGenAI({ apiKey: process.env.API_KEY }) as per guidelines
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

  try {
    const prompt = question 
      ? `分子「${moleculeName}」 (${formula}) についての質問に答えてください: ${question}`
      : `分子「${moleculeName}」 (${formula}) の化学的な特徴、構造上の利点、日常生活や科学における重要性について、初心者にもわかりやすく200文字程度で解説してください。`;

    // Use gemini-3-flash-preview for basic text tasks and Q&A
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        systemInstruction: "あなたは親切な化学の専門家です。専門用語は使いすぎず、直感的な言葉で解説してください。回答は日本語で行ってください。",
        temperature: 0.7,
      }
    });

    // Access .text property directly (not a method)
    return response.text || "申し訳ありません。情報を取得できませんでした。";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "AIからの応答を取得中にエラーが発生しました。";
  }
}
