import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

// Initialize Gemini SDK with telemetry and API key
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    }
  }
});

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Serve larger payloads for base64 images
  app.use(express.json({ limit: "15mb" }));
  app.use(express.urlencoded({ limit: "15mb", extended: true }));

  // API proxy endpoint to bypass CORS and prevent tainted canvas during download
  app.get("/api/proxy-image", async (req, res) => {
    try {
      const imageUrl = req.query.url;
      if (!imageUrl || typeof imageUrl !== "string") {
        return res.status(400).send("Parameter 'url' is required.");
      }
      
      const response = await fetch(imageUrl);
      if (!response.ok) {
        return res.status(response.status).send("Failed to fetch image");
      }
      
      const contentType = response.headers.get("content-type") || "image/jpeg";
      const arrayBuffer = await response.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      
      res.setHeader("Content-Type", contentType);
      res.setHeader("Access-Control-Allow-Origin", "*");
      return res.send(buffer);
    } catch (error: any) {
      console.error("Proxy error:", error);
      return res.status(500).send("Error proxying image");
    }
  });

  // API endpoint for generating magic French meme captions
  app.post("/api/generate-captions", async (req, res) => {
    try {
      const { image } = req.body;

      if (!image) {
        return res.status(400).json({ error: "L'image est requise." });
      }

      // Check if GEMINI_API_KEY is configured
      if (!process.env.GEMINI_API_KEY) {
        // Fallback captions during development/testing if API key is not present
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

      // Parse user uploaded base64 data url
      let mimeType = "image/jpeg";
      let base64Data = "";

      if (image.includes(";base64,")) {
        const parts = image.split(";base64,");
        const mimeMatch = parts[0].match(/data:(.*?)$/);
        mimeType = mimeMatch ? mimeMatch[1] : "image/jpeg";
        base64Data = parts[1];
      } else {
        // Assume direct base64 string
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
      // Fail gracefully with backup captions
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
  });

  // Serve static assets / Vite middleWare
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server is running at http://0.0.0.0:${PORT}`);
  });
}

startServer();
