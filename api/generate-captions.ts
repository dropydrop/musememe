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
    const { image, templateDescription, templateName } = req.body;

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

    // Build model chain with fallbacks
    const contextLine = templateName && templateDescription
      ? `Contexte : l'image est le template "${templateName}" qui représente "${templateDescription}". Adapte les légendes à cette scène précise.\n\n`
      : "";

    const promptMultimodal = `${contextLine}Tu es un créateur de mèmes légendaire, extrêmement sarcastique, spirituel et comique.
Analyse cette image d'un point de vue de l'humour internet et propose précisément 5 légendes (captions) différentes, uniques, très drôles, rédigées UNIQUEMENT en français.
Chaque légende doit être parfaitement adaptée aux expressions faciales, au ridicule, à l'ironie ou à la tension dramatique de la situation observée.
Varie les thèmes d'humour :
- Humour de développeur / informatique / travail de bureau
- Situations gênantes du quotidien (sommeil, nourriture, réveil, conversations)
- Sarcasme mordant et auto-dérision du genre "Moi quand..." ou "Moi qui..." ou "POV (point de vue)..."
- Absurde et décalé
Garde les légendes relativement courtes (maximum 15 mots pour tenir proprement sur le mème).
N'ajoute aucun commentaire, introduction, conclusion. Retourne strictement un tableau JSON de 5 chaînes de caractères.`;

    const promptTextOnly = templateName && templateDescription
      ? `Tu es un créateur de mèmes légendaire, extrêmement sarcastique, spirituel et comique.
Basé UNIQUEMENT sur la description suivante d'un template de mème, propose précisément 5 légendes (captions) différentes, uniques, très drôles, rédigées UNIQUEMENT en français.

Template : "${templateName}"
Description : "${templateDescription}"

Les légendes doivent coller parfaitement à la scène décrite.
Varie les thèmes d'humour : développeur/informatique, situations gênantes du quotidien, sarcasme et auto-dérision ("Moi quand...", "Moi qui...", "POV..."), absurde et décalé.
Garde les légendes courtes (max 15 mots).
N'ajoute aucun commentaire, introduction, conclusion. Retourne strictement un tableau JSON de 5 chaînes de caractères.`
      : null;

    // Define attempts: [model, contentParts]
    type Attempt = [string, Record<string, any>[]];
    const attempts: Attempt[] = [
      ["gemini-3.5-flash", [imagePart, { text: promptMultimodal }]],
    ];
    if (promptTextOnly) {
      attempts.push(["gemini-3.1-flash-lite", [{ text: promptTextOnly }]]);
    }

    let lastError: any = null;
    let captions: string[] | null = null;

    for (const [model, parts] of attempts) {
      try {
        const aiResponse = await ai.models.generateContent({
          model,
          contents: { parts },
          config: {
            responseMimeType: "application/json",
            responseSchema: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: "Liste contenant exactement 5 mèmes textuels drôles en français.",
            },
          },
        });

        const text = aiResponse.text;
        if (!text) throw new Error("Réponse vide");

        const parsed = JSON.parse(text);
        if (!Array.isArray(parsed)) throw new Error("Format invalide");

        captions = parsed.slice(0, 5);
        break;
      } catch (err: any) {
        lastError = err;
        const isQuota = err.message?.includes("exhausted")
          || err.message?.includes("quota")
          || err.message?.includes("429")
          || err.message?.includes("rate limit")
          || err.status === 429;
        if (!isQuota) break;
        console.warn(`Quota exhausted on ${model}, retrying next model...`);
      }
    }

    if (captions) {
      return res.json({ captions, fallback: false });
    }

    throw lastError || new Error("Aucun modèle disponible.");

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
