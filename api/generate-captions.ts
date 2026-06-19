import type { Request, Response } from "express";
import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    }
  }
});

export default async function handler(req: Request, res: Response) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { image } = req.body;

    if (!image) {
      return res.status(400).json({ error: "L'image est requise." });
    }

    if (!process.env.GEMINI_API_KEY) {
      console.warn("GEMINI_API_KEY is not set. Using local french fallback captions.");
      return res.json({
        captions: [
          "Quand tu lances le code et que ça marche du premier coup sans bug 💻🔥",
          "Moi essayant d'expliquer pourquoi mon retard est scientifiquement justifiable ⏰🥱",
          "La tête que je fais quand on me dit 'On fait un appel de 5 minutes' 📞😩",
          "Moi à 3h du matin face aux conséquences d'une seule mauvaise décision 🍕🤡",
          "Attendre que la compile se termine en faisant semblant de travailler durement ☕💼"
        ],
        fallback: true
      });
    }

    let mimeType = "image/jpeg";
    let base64Data = "";

    if (image.includes(";base64,")) {
      const parts = image.split(";base64,");
      const mimeMatch = parts[0].match(/data:(.*?)$/);
      mimeType = mimeMatch ? mimeMatch[1] : "image/jpeg";
      base64Data = parts[1];
    } else {
      base64Data = image;
    }

    const imagePart = {
      inlineData: {
        mimeType: mimeType,
        data: base64Data,
      },
    };

    const textPart = {
      text: `Tu es un créateur de mèmes légendaire, extrêmement sarcastique, spirituel et comique.
Analyse cette image d'un point de vue de l'humour internet et propose précisément 5 légendes (captions) différentes, uniques, très drôles, rédigées UNIQUEMENT en français.
Chaque légende doit être parfaitement adaptée aux expressions faciales, au ridicule, à l'ironie ou à la tension dramatique de la situation observée.
Varie les thèmes d'humour :
- Humour de développeur / informatique / travail de bureau
- Situations gênantes du quotidien (sommeil, nourriture, réveil, conversations)
- Sarcasme mordant et auto-dérision du genre "Moi quand..." ou "Moi qui..." ou "POV (point de vue)..."
- Absurde et décalé
Garde les légendes relativement courtes (maximum 15 mots pour tenir proprement sur le mème).
N'ajoute aucun commentaire, introduction, conclusion. Retourne strictement un tableau JSON de 5 chaînes de caractères.`
    };

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: { parts: [imagePart, textPart] },
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.STRING,
          },
          description: "Liste contenant exactement 5 mèmes textuels drôles en français.",
        },
      },
    });

    const text = response.text;
    if (!text) {
      throw new Error("Réponse vide générée par l'IA.");
    }

    const captions = JSON.parse(text);
    if (Array.isArray(captions)) {
      return res.json({ captions: captions.slice(0, 5), fallback: false });
    } else {
      throw new Error("Le format du JSON généré n'est pas un tableau.");
    }

  } catch (error: any) {
    console.error("Erreur génération légendes:", error);
    return res.json({
      captions: [
        "Moi essayant de comprendre pourquoi ça ne marche pas alors que j'ai tapé exactement pareil 🧐💻",
        "POV: Quand tu dis 'Oui oui, je m'en occupe tout de suite' 🙄🛋️",
        "Moi qui attends que le café agisse avant de commettre l'irréparable ☕😬",
        "Quand le week-end commence enfin mais que tu as déjà ruiné ton rythme de sommeil 🛌🥴",
        "La panique totale quand quelqu'un sonne à la porte de manière inattendue 🚪⚠️"
      ],
      error: error.message || "Erreur interne",
      fallback: true
    });
  }
}
