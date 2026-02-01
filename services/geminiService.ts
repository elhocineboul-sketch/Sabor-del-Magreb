import { GoogleGenAI } from "@google/genai";
import { MenuItem } from "../types";

let ai: GoogleGenAI | null = null;

const getAIClient = () => {
  if (!ai) {
    // Guidelines require strictly using process.env.API_KEY directly
    // and assuming it is pre-configured and valid.
    ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  }
  return ai;
};

export const getMenuRecommendation = async (userQuery: string, menuItems: MenuItem[]): Promise<string> => {
  const client = getAIClient();
  
  // Safety check, though API_KEY is assumed valid per guidelines
  if (!client) {
    console.error("Gemini API Client could not be initialized.");
    return "Lo siento, el servicio no está disponible en este momento.";
  }

  const menuContext = menuItems.map(item => `${item.name} (${item.category}): ${item.description}`).join('\n');

  const systemInstruction = `
    Eres un camarero inteligente y amable en el restaurante "Sabor del Magreb".
    Aquí está nuestro menú:
    ${menuContext}

    Tu tarea es ayudar al cliente a elegir una comida basada en su solicitud.
    - Habla en español con un tono cálido y acogedor (puedes usar jerga marroquí ligera si aplica, como 'amigo' o 'bienvenido').
    - Sugiere solo una o dos comidas.
    - Explica por qué elegiste esa comida basándote en el deseo del cliente (ej: si quiere algo picante, sugiere los Tacos).
    - Sé breve (máximo 60 palabras).
  `;

  try {
    const response = await client.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: userQuery,
      config: {
        systemInstruction: systemInstruction,
      }
    });
    
    // In @google/genai v1.x, .text is a getter property
    return response.text || "Lo siento, no pude encontrar una recomendación adecuada.";
  } catch (error) {
    console.error("Error getting menu recommendation:", error);
    return "Lo siento, tuve un problema técnico. Por favor intenta de nuevo.";
  }
};