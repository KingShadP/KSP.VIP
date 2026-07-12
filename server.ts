import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { requireAuth, AuthRequest } from './src/middleware/auth.ts';
import { getGemini } from './src/lib/gemini.ts';
import { ThinkingLevel } from "@google/genai";

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API routes
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok" });
  });

  // Example authenticated route
  app.get("/api/me", requireAuth, (req: AuthRequest, res) => {
    res.json({ user: req.user });
  });

  app.post("/api/tarot", async (req, res) => {
    try {
      const ai = getGemini();
      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: "You are a mystical, cold, and disciplined tarot reader in a high-end cinematic universe. Give a one sentence, menacing but profound tarot reading. Keep it under 20 words.",
      });
      res.json({ reading: response.text });
    } catch (e: any) {
      console.error(e);
      res.status(500).json({ error: e.message || "Failed to generate reading" });
    }
  });

  app.post("/api/terminal/chat", requireAuth, async (req: AuthRequest, res) => {
    try {
      const { prompt, mode } = req.body;
      const ai = getGemini();
      
      let model = "gemini-3.5-flash";
      let config: any = {};
      
      if (mode === "deep") {
        model = "gemini-3.1-pro-preview";
        config = { thinkingConfig: { thinkingLevel: ThinkingLevel.HIGH } };
      } else if (mode === "quick") {
        model = "gemini-3.1-flash-lite";
      }

      const response = await ai.models.generateContent({
        model,
        contents: prompt,
        config
      });

      res.json({ text: response.text });
    } catch (e: any) {
      console.error(e);
      res.status(500).json({ error: e.message || "Failed to generate response" });
    }
  });

  app.post("/api/terminal/image", requireAuth, async (req: AuthRequest, res) => {
    try {
      const { prompt, size } = req.body;
      const ai = getGemini();
      
      const response = await ai.models.generateContent({
        model: "gemini-3-pro-image-preview",
        contents: prompt,
        config: {
          imageConfig: {
            imageSize: size || "1K",
            aspectRatio: "16:9"
          }
        }
      });

      let imageUrl = "";
      const parts = response.candidates?.[0]?.content?.parts || [];
      for (const part of parts) {
        if (part.inlineData) {
          imageUrl = `data:${part.inlineData.mimeType || "image/png"};base64,${part.inlineData.data}`;
          break;
        }
      }

      res.json({ imageUrl });
    } catch (e: any) {
      console.error(e);
      res.status(500).json({ error: e.message || "Failed to generate image" });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on port ${PORT}`);
  });
}

startServer();
