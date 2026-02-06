import { GoogleGenAI } from "@google/genai";
import { VehicleRequest } from "../types";

// Note: In a real production app, this key should come from a backend or a user input prompt if not in env.
// For this demo, we assume process.env.API_KEY is available or we handle the error gracefully.
const apiKey = process.env.API_KEY || '';

export const analyzeOperations = async (requests: VehicleRequest[]): Promise<string> => {
  if (!apiKey) {
    return "Chave de API não configurada. Configure a API Key para obter insights.";
  }

  try {
    const ai = new GoogleGenAI({ apiKey });
    
    // Prepare a summarized prompt
    const dataSummary = JSON.stringify(requests.map(r => ({
      type: r.requestType,
      status: r.status,
      date: r.pickupDate,
      driver: r.assignedDriver ? 'Sim' : 'Não'
    })));

    const prompt = `
      Atue como um gerente de frota experiente. Analise os seguintes dados de pedidos (em JSON) e forneça um resumo operacional breve (máximo 3 parágrafos) em Português.
      
      Dados: ${dataSummary}
      
      Foque em:
      1. Volume de pendentes vs confirmados.
      2. Alertas sobre falta de motoristas (se houver).
      3. Sugestão de ação imediata.
      
      Use formatação Markdown simples.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
    });

    return response.text || "Não foi possível gerar a análise.";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "Erro ao conectar com a IA. Verifique sua chave de API ou tente novamente mais tarde.";
  }
};