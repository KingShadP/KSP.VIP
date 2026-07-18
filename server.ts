import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { requireAuth, AuthRequest } from './src/middleware/auth.ts';
import { rateLimitAI } from './src/middleware/rateLimit.ts';
import { getGemini } from './src/lib/gemini.ts';
import { ThinkingLevel } from "@google/genai";

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.disable("x-powered-by"); // Security: hide express signature
  app.set("trust proxy", 1); // Security: trust first proxy to ensure correct IP for rate limiting
  app.use(express.json({ limit: "10kb" })); // Security: limit payload size to prevent DoS

  // Security headers middleware
  app.use((req, res, next) => {
    // Prevent MIME-sniffing
    res.setHeader("X-Content-Type-Options", "nosniff");
    // Prevent clickjacking
    res.setHeader("X-Frame-Options", "DENY");
    // Enable XSS filtering in legacy browsers
    res.setHeader("X-XSS-Protection", "1; mode=block");
    // Require HTTPS connections
    res.setHeader("Strict-Transport-Security", "max-age=31536000; includeSubDomains");
    // Control referrer information
    res.setHeader("Referrer-Policy", "strict-origin-when-cross-origin");
    // Basic Content Security Policy (allows inline styles/scripts for Vite development)
    res.setHeader("Content-Security-Policy", "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.gstatic.com https://apis.google.com; style-src 'self' 'unsafe-inline'; img-src 'self' data: https://firebasestorage.googleapis.com https://lh3.googleusercontent.com; connect-src 'self' https://identitytoolkit.googleapis.com https://securetoken.googleapis.com");
    next();
  });

  // API routes
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok" });
  });

  // Example authenticated route
  app.get("/api/me", requireAuth, (req: AuthRequest, res) => {
    res.json({ user: req.user });
  });

  app.post("/api/tarot", requireAuth, rateLimitAI, async (req: AuthRequest, res) => {
    try {
      const ai = getGemini();
      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: "You are a mystical, cold, and disciplined tarot reader in a high-end cinematic universe. Give a one sentence, menacing but profound tarot reading. Keep it under 20 words.",
      });
      res.json({ reading: response.text });
    } catch (e: any) {
      console.error('Error in /api/tarot:', e);
      res.status(500).json({ error: "Failed to generate reading" });
    }
  });

  app.post("/api/terminal/chat", requireAuth, rateLimitAI, async (req: AuthRequest, res) => {
    try {
      const { prompt, mode } = req.body;

      if (typeof prompt !== 'string' || !prompt.trim()) {
        return res.status(400).json({ error: "Invalid prompt format" });
      }
      if (prompt.length > 2000) {
        return res.status(400).json({ error: "Prompt exceeds maximum length of 2000 characters" });
      }
      if (mode && !['standard', 'deep', 'quick'].includes(mode)) {
        return res.status(400).json({ error: "Invalid mode parameter" });
      }

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
      console.error('Error in /api/terminal/chat:', e);
      res.status(500).json({ error: "Failed to generate response" });
    }
  });

  app.post("/api/terminal/image", requireAuth, rateLimitAI, async (req: AuthRequest, res) => {
    try {
      const { prompt, size } = req.body;

      if (typeof prompt !== 'string' || !prompt.trim()) {
        return res.status(400).json({ error: "Invalid prompt format" });
      }
      if (prompt.length > 2000) {
        return res.status(400).json({ error: "Prompt exceeds maximum length of 2000 characters" });
      }
      if (size && !['1K', '2K', '4K'].includes(size)) {
        return res.status(400).json({ error: "Invalid size parameter" });
      }

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
      console.error('Error in /api/terminal/image:', e);
      res.status(500).json({ error: "Failed to generate image" });
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
