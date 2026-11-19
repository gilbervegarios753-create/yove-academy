import { Router } from "express";
import { db } from "../db";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";
import { logSecurityEvent } from "./index";

dotenv.config();

const router = Router();

// Get Security Events
router.get("/events", (req: any, res) => {
  try {
    const events = db.prepare("SELECT * FROM security_events ORDER BY created_at DESC LIMIT 100").all();
    res.json({ success: true, events });
  } catch (e: any) {
    res.status(500).json({ error: "Error interno del servidor (Safe Mode)." });
  }
});

// Get Security Stats (Risk Score, Active Alerts)
router.get("/stats", (req: any, res) => {
  try {
    const totalEvents = (db.prepare("SELECT COUNT(*) as cnt FROM security_events").get() as any).cnt;
    const criticalEvents = (db.prepare("SELECT COUNT(*) as cnt FROM security_events WHERE severity = 'CRITICAL' OR severity = 'HIGH'").get() as any).cnt;
    const failedLogins = (db.prepare("SELECT COUNT(*) as cnt FROM security_events WHERE event_type = 'LOGIN_FAILED'").get() as any).cnt;
    
    // Risk Score Logic
    let riskScore = 10; // Base LOW
    if (failedLogins > 20) riskScore += 20;
    if (criticalEvents > 5) riskScore += 30;
    if (totalEvents > 1000) riskScore += 10;
    
    let threatLevel = "LOW";
    if (riskScore > 20) threatLevel = "MEDIUM";
    if (riskScore > 50) threatLevel = "HIGH";
    if (riskScore > 75) threatLevel = "CRITICAL";

    res.json({
      success: true,
      stats: {
        riskScore: Math.min(riskScore, 100),
        threatLevel,
        activeAlerts: criticalEvents,
        failedLogins,
        totalEvents
      }
    });
  } catch (e: any) {
    res.status(500).json({ error: "Error interno del servidor (Safe Mode)." });
  }
});

// AI Security Copilot
router.post("/copilot", async (req: any, res) => {
  try {
    const { prompt, eventContext } = req.body;
    
    if (!prompt) {
      return res.status(400).json({ error: "El prompt es obligatorio." });
    }

    const systemInstruction = `Eres YOVE SECURITY COPILOT, la IA Defensiva de YOVE SHIELD.
Tu objetivo es analizar alertas de seguridad, explicar incidentes y dar recomendaciones preventivas.
Reglas:
- NO puedes ejecutar comandos.
- NO debes inventar incidentes.
- Eres estrictamente un asistente consultivo para el administrador de seguridad.
- Responde de forma técnica, estructurada y en español.
- Nunca reveles claves privadas o tokens en tus respuestas.`;

    // Sanitize context
    let safeContext = "";
    if (eventContext) {
      const sanitized = { ...eventContext };
      delete sanitized.password;
      delete sanitized.token;
      safeContext = JSON.stringify(sanitized, null, 2);
    }

    const fullPrompt = `
Contexto del evento de seguridad (sanitizado):
${safeContext || 'Ninguno'}

Consulta del administrador:
${prompt}
`;

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return res.status(503).json({ error: "GEMINI_API_KEY no configurada en el entorno del servidor." });
    }
    const ai = new GoogleGenAI({ apiKey });

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: fullPrompt,
      config: {
        systemInstruction,
        temperature: 0.2,
      },
    });

    const aiResponse = response.text || "No se pudo generar un análisis de seguridad.";
    
    logSecurityEvent('AI_COPILOT_QUERY', 'INFO', req.user?.id || null, req.ip || 'unknown', { prompt: prompt.substring(0, 50) });

    res.json({ success: true, analysis: aiResponse });
  } catch (e: any) {
    console.error("[YOVE SHIELD] Copilot Error:", e);
    res.status(500).json({ error: "Error de comunicación con YOVE SECURITY COPILOT." });
  }
});

export default router;
