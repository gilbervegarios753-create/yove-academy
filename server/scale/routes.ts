/**
 * YOVE ACADEMY - SCALE & ARCHITECTURE API ROUTES
 */

import { Router } from "express";
import { observabilityMonitor } from "./observability";
import { cdnStorageEngine } from "./cdnStorageEngine";
import { redisCacheEngine } from "./redisCacheEngine";
import { dbPoolManager } from "./dbPoolManager";
import { asyncQueueEngine } from "./asyncQueueEngine";
import { loadTester } from "./loadTester";
import { SCALE_TIERS } from "./config";

const router = Router();

// 1. Scale Telemetry & Metrics
router.get("/status", (req, res) => {
  try {
    const metrics = observabilityMonitor.getMetrics();
    const dbStatus = dbPoolManager.getStatus();
    const cacheStats = redisCacheEngine.getStats();
    const queueMetrics = asyncQueueEngine.getMetrics();

    res.json({
      success: true,
      metrics,
      dbStatus,
      cacheStats,
      queueMetrics,
      availableTiers: SCALE_TIERS,
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// 2. Change Scaling Target Tier (10k, 25k, 50k, 100k)
router.post("/set-tier", (req, res) => {
  try {
    const { tierKey } = req.body;
    if (!SCALE_TIERS[tierKey]) {
      return res.status(400).json({ error: "Nivel de escalabilidad inválido. Opciones: 10k, 25k, 50k, 100k" });
    }

    observabilityMonitor.setTier(tierKey);
    asyncQueueEngine.setWorkersCount(SCALE_TIERS[tierKey].queueWorkersCount);

    res.json({
      success: true,
      message: `Plataforma YOVE Academy reconfigurada para el objetivo de escalabilidad ${tierKey.toUpperCase()}.`,
      activeTier: SCALE_TIERS[tierKey],
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// 3. CDN & Video Stream URL Signing Endpoint
router.get("/cdn/sign-url", (req, res) => {
  try {
    const { path, courseId, lessonId, type } = req.query;

    if (type === 'hls' && courseId && lessonId) {
      const hlsStreamInfo = cdnStorageEngine.getHlsStreamInfo(String(courseId), String(lessonId));
      return res.json({ success: true, hlsStreamInfo });
    }

    const targetPath = String(path || "/videos/sample-lesson.mp4");
    const signed = cdnStorageEngine.generateSignedUrl(targetPath, 3600, req.ip);

    res.json({ success: true, signedUrl: signed });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// 4. Async Worker Queue Endpoints
router.post("/queue/enqueue", (req, res) => {
  try {
    const { type, payload, priority } = req.body;
    if (!type) {
      return res.status(400).json({ error: "El tipo de tarea (type) es requerido." });
    }

    const task = asyncQueueEngine.enqueue(type, payload || {}, priority || 'normal');
    res.json({ success: true, task });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

router.get("/queue/metrics", (req, res) => {
  try {
    const metrics = asyncQueueEngine.getMetrics();
    const history = asyncQueueEngine.getTaskHistory(15);
    res.json({ success: true, metrics, history });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// 5. Redis Cache Control
router.get("/cache/stats", (req, res) => {
  try {
    const stats = redisCacheEngine.getStats();
    res.json({ success: true, stats });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

router.post("/cache/clear", (req, res) => {
  try {
    redisCacheEngine.clearAll();
    res.json({ success: true, message: "Caché Redis y memoria distribuida purgados." });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// 6. Live Load Test & Scale Benchmark Simulator (1k to 100k)
router.post("/benchmark", async (req, res) => {
  try {
    const { concurrentUsers = 10000, durationSeconds = 10 } = req.body;
    const usersCount = parseInt(String(concurrentUsers), 10);

    const result = await loadTester.runBenchmark(usersCount, durationSeconds);
    res.json({ success: true, result });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
