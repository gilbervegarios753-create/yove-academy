import { GoogleGenAI } from "@google/genai";
import { db } from "../db";
import { performRAGRetrieval, sanitizePromptInput } from "../ai/ragEngine";
import { YOVE_AI_SYSTEM_PROMPT, buildUserPromptWithContext } from "../ai/prompts";
import { getUserByToken } from "../auth";

function classifyGeminiError(err: any): { code: string; message: string } {
  const msg = err?.message || String(err);
  if (msg.includes("API_KEY_INVALID") || msg.includes("API key not valid") || msg.includes("INVALID_ARGUMENT")) {
    return { code: "INVALID_API_KEY", message: "Clave GEMINI_API_KEY inválida o rechazada por el servidor." };
  }
  if (msg.includes("403") || msg.includes("PERMISSION_DENIED") || msg.includes("dunning") || msg.includes("deny")) {
    return { code: "PERMISSION_DENIED", message: "Permisos o cuota denegada en el proyecto de Google GenAI." };
  }
  if (msg.includes("429") || msg.includes("QUOTA_EXCEEDED") || msg.includes("RESOURCE_EXHAUSTED")) {
    return { code: "QUOTA_EXCEEDED", message: "Límite de cuota alcanzado en la API de Gemini." };
  }
  if (msg.includes("404") || msg.includes("MODEL_NOT_FOUND") || msg.includes("not found")) {
    return { code: "MODEL_NOT_FOUND", message: "Modelo no disponible en el proveedor." };
  }
  if (msg.includes("ETIMEDOUT") || msg.includes("timeout") || msg.includes("Timeout")) {
    return { code: "TIMEOUT", message: "Tiempo de espera agotado al conectar con la API de Gemini." };
  }
  return { code: "UNKNOWN_ERROR", message: "Error al comunicarse con la API de Gemini: " + msg.substring(0, 120) };
}

function generateLocalStructuredResponse(message: string, vehicleContext: any, ragResult: any): string {
  const dtcStr = vehicleContext?.dtc || ragResult?.dtcs?.[0]?.code || "";
  const brandStr = vehicleContext?.brand || "Vehículo General";
  const modelStr = vehicleContext?.model || "";
  const yearStr = vehicleContext?.year || "";
  const systemStr = vehicleContext?.system || "Mecatrónico";

  let response = `🔍 **Análisis Técnico Educativo (Modo Asistido YOVE AI)**
Para la consulta: "${message}"${vehicleContext ? ` en el contexto de **${brandStr} ${modelStr} (${yearStr})** [Sistema: ${systemStr}${dtcStr ? ` | DTC: ${dtcStr}` : ''}]` : ''}:

1. 🔍 **Análisis Técnico & Causa Raíz**:
- Si la consulta refiere a un código DTC (${dtcStr || 'P0171 / P0300 / P0335'}), la unidad de control (PCM/ECM) detecta una desviación en los valores de los sensores principales.
- Verifique la integridad física de conectores, alimentaciones de +5.0V VREF y la continuidad del cableado a masa (<50mV caída de tensión).

2. ❓ **Datos Necesarios**:
- Lecturas en tiempo real con escáner: Ajuste de combustible a corto plazo (STFT) y largo plazo (LTFT), además de cuadro congelado (Freeze Frame).
- Verificación del estado de la batería y masa principal del motor respecto a carrocería.

3. ⚠️ **Posibles Causas (Ordenadas por Probabilidad)**:
1° **Fuga de aire / vacío en admisión** o entrada no medida de aire.
2° **Sensor descalibrado / sucio** (MAF/MAP/CKP/CMP) o con interferencia de ruido eléctrico.
3° **Presión de combustible fuera de rango** (Bomba/Filtro/Regulador).
4° **Falla de masa de la ECU / PCM** o conector sulfatado.

4. 🔬 **Pruebas Recomendadas con Equipos de Diagnóstico**:
- **Multímetro Digital**: Mida la tensión de alimentación del sensor (5.0V) y la caída de tensión en la línea de masa (<50mV).
- **Osciloscopio Automotriz**: Verifique la forma de onda de la señal, frecuencia y ausencia de picos de ruido eléctrico.
- **Escáner OBD-II**: Compruebe que las lecturas cambien suavemente al acelerar en ralentí.

5. 📊 **Interpretación y Secuencia de Trabajo**:
- Si la señal presenta picos o ruido, inspeccione el arnés eléctrico antes de reemplazar sensores a ciegas.

6. 🎓 **Recomendación Educativa YOVE Academy**:
- Revise nuestros cursos de **Inyección Electrónica y Diagnóstico con Escáner / Osciloscopio** y practique con los laboratorios virtuales de simulación de señales.`;

  if (ragResult?.summaryText) {
    response += `\n\n---\n*Base de Conocimiento YOVE RAG*:\n${ragResult.summaryText}`;
  }

  return response;
}

export function registerAiRoutes(app: any) {

  // 1. Health Endpoint (PROMPT 42)
  app.get("/api/v1/ai/health", (req: any, res: any) => {
    const apiKey = process.env.GEMINI_API_KEY;
    res.json({
      ok: true,
      provider: "gemini",
      configured: !!apiKey && apiKey.trim().length > 0,
      model: "gemini-2.5-flash",
      timestamp: new Date().toISOString()
    });
  });

  // 2. Real Gemini Test Endpoint (PROMPT 42)
  app.post("/api/v1/ai/test", async (req: any, res: any) => {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return res.status(200).json({
        ok: false,
        errorCode: "MISSING_API_KEY",
        message: "Clave de API GEMINI_API_KEY no configurada en variables de entorno."
      });
    }

    const message = req.body?.message || "Responde únicamente: YOVE AI OK";

    try {
      const ai = new GoogleGenAI({ apiKey });
      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: message
      });

      const text = response.text || "YOVE AI OK";
      return res.json({
        ok: true,
        text: text.trim()
      });
    } catch (err: any) {
      const classified = classifyGeminiError(err);
      console.log(`[YOVE AI TEST STATUS]: ${classified.code} - ${classified.message}`);
      return res.status(200).json({
        ok: false,
        errorCode: classified.code,
        message: classified.message
      });
    }
  });

  // 3. Main AI Chat Endpoint (PROMPT 42 - YOVE AI PRO END-TO-END)
  app.post(["/api/chat", "/api/v1/ai/chat"], async (req: any, res: any) => {
    const startTime = Date.now();
    try {
      const rawMessage = req.body?.message || "";
      const message = sanitizePromptInput(rawMessage);
      const {
        mode = "aprender",
        tutorLevel = "Técnico",
        vehicleContext,
        conversationId,
        history = []
      } = req.body;

      // Extract User from Session Token if provided
      const authHeader = req.headers.authorization;
      const token = authHeader && authHeader.startsWith('Bearer ') 
        ? authHeader.substring(7) 
        : (req.headers['x-session-token'] || req.query?.token);
      
      const authUser = token ? getUserByToken(token) : null;
      const userId = authUser?.id || req.user?.id || "guest_user";
      const apiKey = process.env.GEMINI_API_KEY;

      // 1. Perform Retrieval (RAG)
      const ragResult = performRAGRetrieval(message || "", vehicleContext);

      // 2. Build Enriched Prompt
      const userPrompt = buildUserPromptWithContext({
        message: message || "Ayuda técnica de diagnóstico",
        mode,
        tutorLevel,
        user: authUser || req.user,
        vehicleContext,
        ragResult
      });

      let responseText = "";
      let modelUsed = "gemini-2.5-flash";
      let promptTokens = 0;
      let candidateTokens = 0;
      let usedFallback = false;

      if (!apiKey) {
        usedFallback = true;
        responseText = generateLocalStructuredResponse(message || "Consulta General", vehicleContext, ragResult);
      } else {
        const ai = new GoogleGenAI({ apiKey });

        const chatHistory = Array.isArray(history)
          ? history.map((item: any) => ({
              role: item.role === "user" ? "user" : "model",
              parts: [{ text: item.text }]
            }))
          : [];

        const contents = [
          ...chatHistory,
          { role: "user", parts: [{ text: userPrompt }] }
        ];

        try {
          // Attempt Gemini API call with 10 second timeout
          const timeoutPromise = new Promise((_, reject) => 
            setTimeout(() => reject(new Error("Timeout waiting for Gemini response")), 10000)
          );

          const generatePromise = ai.models.generateContent({
            model: modelUsed,
            contents,
            config: {
              systemInstruction: YOVE_AI_SYSTEM_PROMPT,
              temperature: 0.3
            }
          });

          const response: any = await Promise.race([generatePromise, timeoutPromise]);

          responseText = response.text || generateLocalStructuredResponse(message || "Consulta General", vehicleContext, ragResult);

          if (response.usageMetadata) {
            promptTokens = response.usageMetadata.promptTokenCount || 0;
            candidateTokens = response.usageMetadata.candidatesTokenCount || 0;
          }
        } catch (genErr: any) {
          const classified = classifyGeminiError(genErr);
          console.log(`[YOVE AI ENGINE]: Using RAG Fallback (${classified.code})`);
          usedFallback = true;
          modelUsed = "local-rag-fallback";
          responseText = generateLocalStructuredResponse(message || "Consulta General", vehicleContext, ragResult);
        }
      }

      const durationMs = Date.now() - startTime;
      const totalTokens = promptTokens + candidateTokens || Math.round(((userPrompt || '').length + (responseText || '').length) / 4);

      // 3. Log Usage Costs & Metrics in SQLite
      try {
        const logId = `log_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
        db.prepare(`
          INSERT INTO ai_usage_logs (id, user_id, mode, model, tokens_approx, duration_ms, created_at)
          VALUES (?, ?, ?, ?, ?, ?, datetime('now'))
        `).run(logId, userId, mode, modelUsed, totalTokens, durationMs);
      } catch (logErr) {
        console.error("Error logging AI usage:", logErr);
      }

      // 4. Save/Update Conversation in DB
      const convId = conversationId || `conv_${Date.now()}`;
      if (userId && userId !== "guest_user") {
        try {
          const existing = db.prepare("SELECT id, messages_json FROM ai_conversations WHERE conversation_id = ?").get(convId) as any;
          let currentMsgs = [];
          if (existing?.messages_json) {
            try { currentMsgs = JSON.parse(existing.messages_json); } catch (e) {}
          }
          currentMsgs.push({ role: 'user', text: message, timestamp: new Date().toISOString() });
          currentMsgs.push({ role: 'model', text: responseText, timestamp: new Date().toISOString() });

          const title = message && message.length > 35 ? `${message.substring(0, 35)}...` : (message || "Consulta Mecatrónica");
          const now = new Date().toISOString();

          db.prepare(`
            INSERT INTO ai_conversations (id, user_id, conversation_id, title, mode, messages_json, vehicle_context_json, created_at, updated_at)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
            ON CONFLICT(conversation_id) DO UPDATE SET
              messages_json = excluded.messages_json,
              vehicle_context_json = excluded.vehicle_context_json,
              updated_at = excluded.updated_at
          `).run(
            existing?.id || `conv_db_${Date.now()}`,
            userId,
            convId,
            title,
            mode,
            JSON.stringify(currentMsgs),
            JSON.stringify(vehicleContext || {}),
            now,
            now
          );
        } catch (convErr) {
          console.error("Error persisting conversation:", convErr);
        }
      }

      return res.json({
        ok: true,
        success: true,
        reply: responseText,
        text: responseText,
        conversationId: convId,
        mode,
        tutorLevel,
        ragResult,
        sources: {
          courses: ragResult.courses || [],
          cases: ragResult.cases || [],
          labs: ragResult.labs || [],
          dtcs: ragResult.dtcs || []
        },
        usage: {
          model: modelUsed,
          durationMs,
          tokensApprox: totalTokens
        },
        fallback: usedFallback
      });

    } catch (error: any) {
      console.error("YOVE AI Endpoint Critical Error:", error);
      // Even in case of unhandled error, provide a working response
      const ragFallback = performRAGRetrieval(req.body?.message || "", req.body?.vehicleContext);
      const fallbackText = generateLocalStructuredResponse(req.body?.message || "Consulta General", req.body?.vehicleContext, ragFallback);

      return res.status(200).json({
        ok: true,
        success: true,
        reply: fallbackText,
        text: fallbackText,
        conversationId: req.body?.conversationId || `conv_${Date.now()}`,
        mode: req.body?.mode || "aprender",
        fallback: true
      });
    }
  });

  // 4. Get User Conversations History
  app.get(["/api/v1/ai/conversations", "/api/v1/ai/conversations/:userId"], (req: any, res: any) => {
    try {
      const authHeader = req.headers.authorization;
      const token = authHeader && authHeader.startsWith('Bearer ') 
        ? authHeader.substring(7) 
        : (req.headers['x-session-token'] || req.query?.token);
      
      const authUser = token ? getUserByToken(token) : null;
      const targetUserId = req.params?.userId || authUser?.id || req.user?.id;

      if (!targetUserId) {
        return res.json({ success: true, conversations: [] });
      }

      // Prevent IDOR if requesting another user's conversation without admin rights
      if (authUser && authUser.id !== targetUserId && !['ADMIN', 'SUPER_ADMIN'].includes(authUser.role)) {
        return res.status(403).json({ error: "Acceso denegado (403). No puedes consultar conversaciones de otro usuario." });
      }

      const conversations = db.prepare("SELECT * FROM ai_conversations WHERE user_id = ? ORDER BY updated_at DESC LIMIT 30").all(targetUserId);
      res.json({ success: true, conversations });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  // 5. Get Single Conversation
  app.get("/api/v1/ai/conversations/detail/:id", (req: any, res: any) => {
    try {
      const conv = db.prepare("SELECT * FROM ai_conversations WHERE conversation_id = ? OR id = ?").get(req.params.id, req.params.id) as any;
      if (!conv) {
        return res.status(404).json({ error: "Conversación no encontrada." });
      }
      res.json({ success: true, conversation: conv });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  // 6. Delete Conversation
  app.delete("/api/v1/ai/conversations/:id", (req: any, res: any) => {
    try {
      const authHeader = req.headers.authorization;
      const token = authHeader && authHeader.startsWith('Bearer ') 
        ? authHeader.substring(7) 
        : (req.headers['x-session-token'] || req.query?.token);
      
      const authUser = token ? getUserByToken(token) : null;
      const conv = db.prepare("SELECT * FROM ai_conversations WHERE conversation_id = ? OR id = ?").get(req.params.id, req.params.id) as any;

      if (!conv) {
        return res.status(404).json({ error: "Conversación no encontrada." });
      }

      if (authUser && authUser.id !== conv.user_id && !['ADMIN', 'SUPER_ADMIN'].includes(authUser.role)) {
        return res.status(403).json({ error: "Acceso denegado (403)." });
      }

      db.prepare("DELETE FROM ai_conversations WHERE conversation_id = ? OR id = ?").run(req.params.id, req.params.id);
      res.json({ success: true, message: "Conversación eliminada correctamente." });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  // 7. Save Conversation
  app.post("/api/v1/ai/conversations", (req: any, res: any) => {
    try {
      const { user_id, conversation_id, title, mode, messages_json, vehicle_context_json } = req.body;
      if (!user_id || !conversation_id) {
        return res.status(400).json({ error: "Faltan datos de la conversación." });
      }
      const now = new Date().toISOString();
      db.prepare(`
        INSERT INTO ai_conversations (id, user_id, conversation_id, title, mode, messages_json, vehicle_context_json, created_at, updated_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        ON CONFLICT(conversation_id) DO UPDATE SET
          title = excluded.title,
          mode = excluded.mode,
          messages_json = excluded.messages_json,
          vehicle_context_json = excluded.vehicle_context_json,
          updated_at = excluded.updated_at
      `).run(
        `conv_${conversation_id}`,
        user_id,
        conversation_id,
        title || 'Nueva Consulta',
        mode || 'aprender',
        JSON.stringify(messages_json || []),
        JSON.stringify(vehicle_context_json || {}),
        now,
        now
      );
      res.json({ success: true, conversationId: conversation_id });
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });

  // 8. AI Usage & Cost Analytics
  app.get("/api/v1/ai/usage", (req: any, res: any) => {
    try {
      const authHeader = req.headers.authorization;
      const token = authHeader && authHeader.startsWith('Bearer ') 
        ? authHeader.substring(7) 
        : (req.headers['x-session-token'] || req.query?.token);
      
      const authUser = token ? getUserByToken(token) : null;
      const userId = authUser?.id || req.user?.id;

      let logs: any[] = [];
      if (userId) {
        logs = db.prepare("SELECT * FROM ai_usage_logs WHERE user_id = ? ORDER BY created_at DESC LIMIT 50").all(userId) as any[];
      } else {
        logs = db.prepare("SELECT * FROM ai_usage_logs ORDER BY created_at DESC LIMIT 50").all() as any[];
      }

      const totalQueries = logs.length;
      const totalTokens = logs.reduce((acc: number, item: any) => acc + (item.tokens_approx || 0), 0);
      const avgDuration = totalQueries > 0 ? Math.round(logs.reduce((acc: number, item: any) => acc + (item.duration_ms || 0), 0) / totalQueries) : 0;

      res.json({
        success: true,
        stats: {
          totalQueries,
          totalTokens,
          avgDurationMs: avgDuration
        },
        logs
      });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  // 10. AI Course Content Generator Endpoint (Generate Modules, Lessons, Videos, Quizzes)
  app.post("/api/v1/ai/generate-course-content", async (req: any, res: any) => {
    try {
      const { courseTitle, category = "mechatronics", level = "Intermediate", topic } = req.body;
      const apiKey = process.env.GEMINI_API_KEY;

      const prompt = `Como instructor senior de ingeniería mecatrónica automotriz en YOVE Academy, genera una estructura de módulo completa y detallada para el programa "${courseTitle || topic}".
      Categoría: ${category}, Nivel: ${level}.
      Responde estrictamente en formato JSON válido con la siguiente estructura:
      {
        "moduleTitle": "Título del Módulo",
        "description": "Descripción concisa del módulo",
        "lessons": [
          {
            "id": "les-1",
            "title": "Lección 1: Título Técnico",
            "duration": "25 min",
            "type": "video",
            "textContent": "Resumen conceptual de la lección",
            "videoSearchTopic": "Termino para buscar video de YouTube sobre el tema"
          },
          {
            "id": "les-2",
            "title": "Lección 2: Práctica Guiada con Osciloscopio/Multímetro",
            "duration": "30 min",
            "type": "interactive",
            "textContent": "Pasos de medición y valores esperados",
            "activity": {
              "id": "act-1",
              "title": "Práctica de Taller",
              "instructions": "Instrucciones paso a paso",
              "requiredTools": ["Multímetro", "Osciloscopio"],
              "expectedOutput": "Resultado esperado"
            }
          }
        ],
        "quiz": {
          "id": "quiz-m1",
          "title": "Evaluación del Módulo",
          "passingScore": 80,
          "questions": [
            {
              "id": "q1",
              "question": "Pregunta técnica objetiva con 4 opciones?",
              "options": ["Opción A", "Opción B", "Opción C", "Opción D"],
              "correctAnswer": 1,
              "explanation": "Explicación técnica fundamentada"
            }
          ]
        }
      }`;

      if (apiKey) {
        try {
          const ai = new GoogleGenAI({ apiKey });
          const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: { temperature: 0.2 }
          });
          const text = response.text || "";
          const jsonMatch = text.match(/\{[\s\S]*\}/);
          if (jsonMatch) {
            const parsed = JSON.parse(jsonMatch[0]);
            return res.json({ success: true, generatedContent: parsed });
          }
        } catch (e: any) {
          console.log("[AI Course Generator] Gemini call fallback:", e.message);
        }
      }

      // Structured Local Fallback
      const fallbackModule = {
        moduleTitle: `Módulo Especializado: ${courseTitle || topic || 'Mecatrónica Automotriz'}`,
        description: `Unidad didáctica generada por YOVE AI para el dominio de ${courseTitle || 'sistemas mecatrónicos'}.`,
        lessons: [
          {
            id: `les-ai-1`,
            title: `Lección 1: Fundamentos Físicos de ${courseTitle || topic || 'Diagnóstico'}`,
            duration: '25 min',
            type: 'video',
            textContent: `Analiza la física de funcionamiento, curvas de tensión, caídas de voltaje y señales de control ECU.`
          },
          {
            id: `les-ai-2`,
            title: `Lección 2: Medición y Diagnóstico con Escáner y Osciloscopio`,
            duration: '30 min',
            type: 'interactive',
            textContent: `Procedimiento de conexión de puntas de osciloscopio, atenuación 10X y verificación de tiempo real.`,
            activity: {
              id: 'act-ai-1',
              title: 'Práctica de Laboratorio Automotriz',
              instructions: 'Realiza la medición de caída de tensión entre la masa del sensor y el negativo de la batería.',
              requiredTools: ['Multímetro True-RMS', 'Puntas de prueba aguja', 'Diagrama eléctrico OEM'],
              expectedOutput: 'Caída de tensión inferior a 50mV en condiciones de operación.'
            }
          }
        ],
        quiz: {
          id: 'quiz-ai-1',
          title: 'Evaluación Técnica de Comprensión',
          passingScore: 80,
          questions: [
            {
              id: 'q-ai-1',
              question: '¿Cuál es la caída de tensión máxima admisible en una línea de masa de sensor a la ECU?',
              options: ['500 mV', '50 mV', '2.5 V', '12 V'],
              correctAnswer: 1,
              explanation: 'Caídas de tensión mayores a 50mV en masas de sensores introducen offset de medición e interpretaciones erróneas en la ECU.'
            }
          ]
        }
      };

      return res.json({ success: true, generatedContent: fallbackModule, source: "yove-ai-generator" });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

}
