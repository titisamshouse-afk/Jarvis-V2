import express from "express";
import OpenAI from "openai";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
app.use(express.json({ limit: "1mb" }));
app.use(express.static(path.join(__dirname, "public")));

app.get("/api/status", (_req, res) => {
  res.json({
    status: "online",
    assistant: "JARVIS",
    aiConfigured: Boolean(process.env.GROQ_API_KEY),
    provider: "Groq",
    model: process.env.GROQ_MODEL || "llama-3.3-70b-versatile",
    uptime: Math.floor(process.uptime())
  });
});

app.post("/api/chat", async (req, res) => {
  try {
    if (!process.env.GROQ_API_KEY) {
      return res.status(503).json({ error: "Groq is not configured yet. Add GROQ_API_KEY to the Render service environment variables." });
    }
    const messages = Array.isArray(req.body.messages) ? req.body.messages.slice(-20) : [];
    const safeMessages = messages
      .filter(m => m && ["user", "assistant"].includes(m.role) && typeof m.content === "string")
      .map(m => ({ role: m.role, content: m.content.slice(0, 6000) }));
    if (!safeMessages.length || safeMessages.at(-1).role !== "user") {
      return res.status(400).json({ error: "Send a user message to begin." });
    }
    const client = new OpenAI({
      apiKey: process.env.GROQ_API_KEY,
      baseURL: "https://api.groq.com/openai/v1"
    });
    const completion = await client.chat.completions.create({
      model: process.env.GROQ_MODEL || "llama-3.3-70b-versatile",
      messages: [
        { role: "system", content: "You are JARVIS, a capable, calm, concise personal AI assistant. Speak naturally with subtle dry wit when appropriate. Be honest about limitations. Never claim to have performed actions you cannot perform. Ask for confirmation before consequential external actions. You are running inside the user's personal JARVIS dashboard." },
        ...safeMessages
      ],
      temperature: 0.7
    });
    res.json({ reply: completion.choices[0]?.message?.content || "I couldn't form a response." });
  } catch (error) {
    console.error("Groq chat error:", error);
    res.status(500).json({
      error: error?.status === 401
        ? "The Groq API key was rejected. Check GROQ_API_KEY in Render."
        : error?.status === 400
          ? "Groq rejected the request. Check that GROQ_MODEL is available in your Groq account."
          : "JARVIS encountered an error while contacting Groq."
    });
  }
});

app.get("*", (_req, res) => res.sendFile(path.join(__dirname, "public", "index.html")));
const port = process.env.PORT || 3000;
app.listen(port, "0.0.0.0", () => console.log(`JARVIS listening on ${port}`));
