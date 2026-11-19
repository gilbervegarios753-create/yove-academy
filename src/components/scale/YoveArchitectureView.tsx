import React, { useState, useEffect } from "react";
import {
  Server,
  Cpu,
  Database,
  Layers,
  Zap,
  Activity,
  Play,
  CheckCircle2,
  AlertTriangle,
  RefreshCw,
  Video,
  FileText,
  Clock,
  Radio,
  Sliders,
  ShieldCheck,
  TrendingUp,
  Workflow,
  Sparkles,
  Terminal,
  Globe,
  Gauge
} from "lucide-react";

interface ScaleMetrics {
  activeTierKey: string;
  concurrentUsersSimulated: number;
  activeInstancesCount: number;
  cpuUsagePercent: number;
  memoryUsagePercent: number;
  requestsPerSecond: number;
  avgLatencyMs: number;
  dbPoolSaturationPercent: number;
  redisCacheHitRatioPercent: number;
  queuePendingJobs: number;
  queueActiveWorkers: number;
  cdnOffloadBandwidthGbps: number;
  autoscalingStatus: {
    recommendedAction: "SCALE_OUT" | "SCALE_IN" | "STABLE";
    triggerReason: string;
  };
  uptimeSeconds: number;
  timestamp: string;
}

interface BenchmarkResult {
  simulatedUsers: number;
  targetRps: number;
  achievedRps: number;
  totalRequestsExecuted: number;
  successfulRequests: number;
  failedRequests: number;
  errorRatePercent: number;
  p50LatencyMs: number;
  p95LatencyMs: number;
  p99LatencyMs: number;
  cacheHitRatioPercent: number;
  dbPoolSaturationPercent: number;
  cdnTrafficOffloadPercent: number;
  bottlenecksIdentified: string[];
  recommendations: string[];
  testDurationSeconds: number;
}

export const YoveArchitectureView: React.FC = () => {
  const [activeTab, setActiveTab] = useState<"topology" | "redis_db" | "cdn_video" | "queue" | "benchmark" | "autoscaling">("topology");
  const [activeTier, setActiveTier] = useState<string>("10k");
  const [metrics, setMetrics] = useState<ScaleMetrics | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  // Signed URL State
  const [sampleVideoPath, setSampleVideoPath] = useState<string>("/courses/inyeccion-electronica/leccion-01.mp4");
  const [signedUrlData, setSignedUrlData] = useState<any>(null);
  const [hlsStreamData, setHlsStreamData] = useState<any>(null);

  // Load Test Simulator State
  const [simulatedUserCount, setSimulatedUserCount] = useState<number>(10000);
  const [isTesting, setIsTesting] = useState<boolean>(false);
  const [benchmarkResult, setBenchmarkResult] = useState<BenchmarkResult | null>(null);

  // Queue Task State
  const [queueHistory, setQueueHistory] = useState<any[]>([]);

  const fetchStatus = async () => {
    try {
      const res = await fetch("/api/v1/scale/status");
      const data = await res.json();
      if (data.success) {
        setMetrics(data.metrics);
        setActiveTier(data.metrics.activeTierKey);
      }
    } catch (err) {
      console.error("Error fetching scale status:", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchQueueHistory = async () => {
    try {
      const res = await fetch("/api/v1/scale/queue/metrics");
      const data = await res.json();
      if (data.success) {
        setQueueHistory(data.history || []);
      }
    } catch (err) {
      console.error("Error fetching queue metrics:", err);
    }
  };

  useEffect(() => {
    fetchStatus();
    fetchQueueHistory();
    const interval = setInterval(fetchStatus, 4000);
    return () => clearInterval(interval);
  }, []);

  const handleSetTier = async (tierKey: string) => {
    setLoading(true);
    try {
      const res = await fetch("/api/v1/scale/set-tier", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tierKey }),
      });
      const data = await res.json();
      if (data.success) {
        setActiveTier(tierKey);
        await fetchStatus();
      }
    } catch (err) {
      console.error("Error setting tier:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateSignedCdnUrl = async () => {
    try {
      const res = await fetch(`/api/v1/scale/cdn/sign-url?path=${encodeURIComponent(sampleVideoPath)}`);
      const data = await res.json();
      if (data.success) {
        setSignedUrlData(data.signedUrl);
      }
    } catch (err) {
      console.error("Error generating signed URL:", err);
    }
  };

  const handleGenerateHlsStream = async () => {
    try {
      const res = await fetch(`/api/v1/scale/cdn/sign-url?type=hls&courseId=crs_mec_01&lessonId=les_04`);
      const data = await res.json();
      if (data.success) {
        setHlsStreamData(data.hlsStreamInfo);
      }
    } catch (err) {
      console.error("Error generating HLS stream:", err);
    }
  };

  const handleEnqueueSampleTask = async (type: string) => {
    try {
      await fetch("/api/v1/scale/queue/enqueue", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type,
          payload: { lessonId: "les_102", code: "CERT-YOVE-2026-88" },
          priority: "high",
        }),
      });
      fetchQueueHistory();
      fetchStatus();
    } catch (err) {
      console.error("Error enqueuing task:", err);
    }
  };

  const handleRunBenchmark = async () => {
    setIsTesting(true);
    try {
      const res = await fetch("/api/v1/scale/benchmark", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ concurrentUsers: simulatedUserCount, durationSeconds: 10 }),
      });
      const data = await res.json();
      if (data.success) {
        setBenchmarkResult(data.result);
      }
    } catch (err) {
      console.error("Error running benchmark:", err);
    } finally {
      setIsTesting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-4 md:p-8 font-sans">
      {/* Top Banner Header */}
      <div className="max-w-7xl mx-auto mb-8">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 bg-slate-900/80 border border-slate-800 rounded-2xl p-6 backdrop-blur-md shadow-2xl">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <span className="px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                Arquitectura Cloud-Native Activa
              </span>
              <span className="text-xs text-slate-400 font-mono">v3.5.0-scale</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-white flex items-center gap-3">
              <Layers className="w-8 h-8 text-cyan-400" />
              YOVE ARCHITECTURE & SCALE CENTER
            </h1>
            <p className="text-slate-400 text-sm mt-1">
              Plataforma optimizada para escalamiento horizontal masivo desde <span className="text-cyan-300 font-semibold">10,000</span> hasta <span className="text-cyan-300 font-semibold">100,000+</span> usuarios concurrentes.
            </p>
          </div>

          {/* Tier Switcher Controls */}
          <div className="flex flex-col gap-2">
            <span className="text-xs uppercase tracking-wider font-semibold text-slate-400">Objetivo de Escalabilidad (Concurrencia)</span>
            <div className="flex items-center gap-2 bg-slate-950 p-1.5 rounded-xl border border-slate-800">
              {[
                { key: "10k", label: "10K", full: "10,000 Concurrentes" },
                { key: "25k", label: "25K", full: "25,000 Concurrentes" },
                { key: "50k", label: "50K", full: "50,000 Concurrentes" },
                { key: "100k", label: "100K+", full: "100,000+ Concurrentes" },
              ].map((tier) => (
                <button
                  key={tier.key}
                  onClick={() => handleSetTier(tier.key)}
                  className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                    activeTier === tier.key
                      ? "bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-lg shadow-cyan-500/20"
                      : "text-slate-400 hover:text-white hover:bg-slate-800/60"
                  }`}
                  title={tier.full}
                >
                  {tier.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Real-time Telemetry Key Cards */}
        {metrics && (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 mt-6">
            <div className="bg-slate-900/60 border border-slate-800/80 rounded-xl p-4">
              <div className="flex items-center justify-between text-slate-400 text-xs font-medium mb-1">
                <span>Instancias Backend</span>
                <Server className="w-4 h-4 text-cyan-400" />
              </div>
              <div className="text-2xl font-bold text-white font-mono">{metrics.activeInstancesCount} Nodos</div>
              <div className="text-[10px] text-slate-500 mt-1">Autoscaling Stateless</div>
            </div>

            <div className="bg-slate-900/60 border border-slate-800/80 rounded-xl p-4">
              <div className="flex items-center justify-between text-slate-400 text-xs font-medium mb-1">
                <span>Tráfico Estimado</span>
                <Zap className="w-4 h-4 text-amber-400" />
              </div>
              <div className="text-2xl font-bold text-white font-mono">{metrics.requestsPerSecond.toLocaleString()} RPS</div>
              <div className="text-[10px] text-slate-500 mt-1">{metrics.concurrentUsersSimulated.toLocaleString()} Usuarios Activos</div>
            </div>

            <div className="bg-slate-900/60 border border-slate-800/80 rounded-xl p-4">
              <div className="flex items-center justify-between text-slate-400 text-xs font-medium mb-1">
                <span>Latencia HTTP Avg</span>
                <Activity className="w-4 h-4 text-emerald-400" />
              </div>
              <div className="text-2xl font-bold text-emerald-400 font-mono">{metrics.avgLatencyMs} ms</div>
              <div className="text-[10px] text-slate-500 mt-1">Objetivo: &lt; 50ms</div>
            </div>

            <div className="bg-slate-900/60 border border-slate-800/80 rounded-xl p-4">
              <div className="flex items-center justify-between text-slate-400 text-xs font-medium mb-1">
                <span>Acierto Redis Cache</span>
                <Database className="w-4 h-4 text-purple-400" />
              </div>
              <div className="text-2xl font-bold text-purple-300 font-mono">{metrics.redisCacheHitRatioPercent}%</div>
              <div className="text-[10px] text-slate-500 mt-1">Sesiones & Consultas DB</div>
            </div>

            <div className="bg-slate-900/60 border border-slate-800/80 rounded-xl p-4">
              <div className="flex items-center justify-between text-slate-400 text-xs font-medium mb-1">
                <span>Descarga CDN Media</span>
                <Globe className="w-4 h-4 text-blue-400" />
              </div>
              <div className="text-2xl font-bold text-blue-300 font-mono">{metrics.cdnOffloadBandwidthGbps} Gbps</div>
              <div className="text-[10px] text-slate-500 mt-1">Videos HLS & PDFs fuera de App</div>
            </div>

            <div className="bg-slate-900/60 border border-slate-800/80 rounded-xl p-4">
              <div className="flex items-center justify-between text-slate-400 text-xs font-medium mb-1">
                <span>Workers Asíncronos</span>
                <Workflow className="w-4 h-4 text-rose-400" />
              </div>
              <div className="text-2xl font-bold text-rose-300 font-mono">{metrics.queueActiveWorkers} Workers</div>
              <div className="text-[10px] text-slate-500 mt-1">{metrics.queuePendingJobs} Tareas Pendientes</div>
            </div>
          </div>
        )}
      </div>

      {/* Tabs Navigation Bar */}
      <div className="max-w-7xl mx-auto mb-6">
        <div className="flex items-center gap-2 border-b border-slate-800 overflow-x-auto pb-2 scrollbar-none">
          {[
            { id: "topology", label: "1. Topología Cloud-Native", icon: Workflow },
            { id: "cdn_video", label: "2. CDN & Desacople de Video", icon: Video },
            { id: "redis_db", label: "3. Redis & Conexiones DB", icon: Database },
            { id: "queue", label: "4. Colas & Workers Asíncronos", icon: Clock },
            { id: "benchmark", label: "5. Simulador Pruebas de Carga", icon: Gauge },
            { id: "autoscaling", label: "6. Reglas de Autoscaling", icon: Sliders },
          ].map((tab) => {
            const IconComponent = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2.5 px-4 py-3 rounded-xl text-xs font-semibold transition-all whitespace-nowrap ${
                  isActive
                    ? "bg-slate-800 text-cyan-400 border border-slate-700 shadow-md"
                    : "text-slate-400 hover:text-white hover:bg-slate-900/60"
                }`}
              >
                <IconComponent className={`w-4 h-4 ${isActive ? "text-cyan-400" : "text-slate-500"}`} />
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Tab Contents */}
      <div className="max-w-7xl mx-auto">
        {/* TAB 1: TOPOLOGY DIAGRAM */}
        {activeTab === "topology" && (
          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 md:p-8 space-y-8">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div>
                <h2 className="text-xl font-bold text-white flex items-center gap-2">
                  <Workflow className="w-5 h-5 text-cyan-400" />
                  Topología Distribuida Cloud-Native de YOVE Academy
                </h2>
                <p className="text-slate-400 text-xs mt-1">
                  Flujo de datos stateless optimizado para evitar puntos únicos de falla y sostener alta concurrencia.
                </p>
              </div>
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-cyan-500/10 text-cyan-300 border border-cyan-500/20">
                Nivel Actual: {activeTier.toUpperCase()}
              </span>
            </div>

            {/* Architecture Diagram Nodes */}
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4 relative">
              {/* Node 1: Edge CDN & WAF */}
              <div className="bg-slate-950 border border-cyan-500/30 rounded-xl p-5 relative overflow-hidden group hover:border-cyan-400 transition-all">
                <div className="absolute top-0 right-0 w-16 h-16 bg-cyan-500/10 rounded-bl-full pointer-events-none"></div>
                <div className="flex items-center gap-2 mb-3 text-cyan-400 font-bold text-xs uppercase tracking-wider">
                  <Globe className="w-4 h-4" /> 1. Edge & CDN
                </div>
                <h3 className="font-semibold text-white text-sm mb-2">Cloudflare / AWS CloudFront</h3>
                <ul className="text-xs text-slate-400 space-y-1.5">
                  <li className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    WAF (Protección DDoS / SQLi)
                  </li>
                  <li className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    HLS Adaptive Video Streaming
                  </li>
                  <li className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    Cache de Assets Estáticos (&gt;88%)
                  </li>
                </ul>
              </div>

              {/* Node 2: Load Balancer */}
              <div className="bg-slate-950 border border-blue-500/30 rounded-xl p-5 relative overflow-hidden group hover:border-blue-400 transition-all">
                <div className="flex items-center gap-2 mb-3 text-blue-400 font-bold text-xs uppercase tracking-wider">
                  <Sliders className="w-4 h-4" /> 2. Balanceador
                </div>
                <h3 className="font-semibold text-white text-sm mb-2">Application Load Balancer</h3>
                <ul className="text-xs text-slate-400 space-y-1.5">
                  <li className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    Algoritmo Least-Connections
                  </li>
                  <li className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    Health Checks / Liveness Probes
                  </li>
                  <li className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    SSL/TLS Termination
                  </li>
                </ul>
              </div>

              {/* Node 3: Stateless App Cluster */}
              <div className="bg-slate-950 border border-purple-500/30 rounded-xl p-5 relative overflow-hidden group hover:border-purple-400 transition-all">
                <div className="flex items-center gap-2 mb-3 text-purple-400 font-bold text-xs uppercase tracking-wider">
                  <Server className="w-4 h-4" /> 3. App Cluster
                </div>
                <h3 className="font-semibold text-white text-sm mb-2">Stateless Backend Nodes</h3>
                <ul className="text-xs text-slate-400 space-y-1.5">
                  <li className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    {metrics ? metrics.activeInstancesCount : 4} Instancias Cloud Run/K8s
                  </li>
                  <li className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    Express Node.js Cluster
                  </li>
                  <li className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    JWT / Token Session Validation
                  </li>
                </ul>
              </div>

              {/* Node 4: Redis Distributed Cache */}
              <div className="bg-slate-950 border border-amber-500/30 rounded-xl p-5 relative overflow-hidden group hover:border-amber-400 transition-all">
                <div className="flex items-center gap-2 mb-3 text-amber-400 font-bold text-xs uppercase tracking-wider">
                  <Zap className="w-4 h-4" /> 4. Cache Redis
                </div>
                <h3 className="font-semibold text-white text-sm mb-2">Redis Cluster Engine</h3>
                <ul className="text-xs text-slate-400 space-y-1.5">
                  <li className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    Sesiones &amp; Contadores Rate-Limit
                  </li>
                  <li className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    Cache de Consultas de Cursos
                  </li>
                  <li className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    Multi-node In-Memory Replication
                  </li>
                </ul>
              </div>

              {/* Node 5: Database & Replicas */}
              <div className="bg-slate-950 border border-emerald-500/30 rounded-xl p-5 relative overflow-hidden group hover:border-emerald-400 transition-all">
                <div className="flex items-center gap-2 mb-3 text-emerald-400 font-bold text-xs uppercase tracking-wider">
                  <Database className="w-4 h-4" /> 5. Base de Datos
                </div>
                <h3 className="font-semibold text-white text-sm mb-2">Primary Write + Read Replicas</h3>
                <ul className="text-xs text-slate-400 space-y-1.5">
                  <li className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    Primary Master (Escrituras)
                  </li>
                  <li className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    Réplicas de Lectura Balanceadas
                  </li>
                  <li className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    Connection Pool Optimizado
                  </li>
                </ul>
              </div>
            </div>

            {/* Architectural Guarantees Summary */}
            <div className="bg-slate-950/60 rounded-xl border border-slate-800 p-5 grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex gap-3">
                <ShieldCheck className="w-5 h-5 text-cyan-400 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-xs font-bold text-white uppercase">Alta Disponibilidad (99.99%)</h4>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Sin punto único de falla. Si un nodo o réplica falla, el balanceador redirige el tráfico automáticamente.
                  </p>
                </div>
              </div>
              <div className="flex gap-3">
                <TrendingUp className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-xs font-bold text-white uppercase">Crecimiento Progresivo</h4>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Capacidad de escalar desde 10k hasta 100k+ sin necesidad de reescribir código o cambiar la arquitectura.
                  </p>
                </div>
              </div>
              <div className="flex gap-3">
                <Sparkles className="w-5 h-5 text-purple-400 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-xs font-bold text-white uppercase">Optimización de Costos</h4>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Escalamiento bajo demanda (Autoscaling) para minimizar costo de infraestructura durante horas de menor tráfico.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: CDN & VIDEO DECOUPLING */}
        {activeTab === "cdn_video" && (
          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 md:p-8 space-y-6">
            <div className="border-b border-slate-800 pb-4">
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <Video className="w-5 h-5 text-blue-400" />
                Desacople de Archivos Pesados &amp; CDN Signed URLs Engine
              </h2>
              <p className="text-slate-400 text-xs mt-1">
                Regla de Oro: Los servidores de la aplicación NUNCA transmiten videos o PDFs directamente para proteger la memoria RAM y el ancho de banda HTTP.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Presigned URL Generator Live Tester */}
              <div className="bg-slate-950 border border-slate-800 rounded-xl p-5 space-y-4">
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <Radio className="w-4 h-4 text-cyan-400" />
                  1. Generador de URLs Firmadas con Expiración Temporal
                </h3>
                <p className="text-xs text-slate-400">
                  Prueba la generación de enlace seguro hacia el CDN con firma SHA-256 e IP lock:
                </p>

                <div className="flex gap-2">
                  <input
                    type="text"
                    value={sampleVideoPath}
                    onChange={(e) => setSampleVideoPath(e.target.value)}
                    className="flex-1 bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white font-mono focus:outline-none focus:border-cyan-500"
                    placeholder="/courses/lesson.mp4"
                  />
                  <button
                    onClick={handleGenerateSignedCdnUrl}
                    className="bg-cyan-600 hover:bg-cyan-500 text-white px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5"
                  >
                    <Zap className="w-3.5 h-3.5" />
                    Firmar URL
                  </button>
                </div>

                {signedUrlData && (
                  <div className="bg-slate-900 border border-slate-800 rounded-lg p-3 text-xs space-y-2 font-mono">
                    <div className="text-emerald-400 font-semibold flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Enlace Firmado Generado
                    </div>
                    <div className="text-slate-300 break-all bg-slate-950 p-2 rounded border border-slate-800 text-[11px]">
                      {signedUrlData.url}
                    </div>
                    <div className="flex justify-between text-slate-400 text-[11px]">
                      <span>Expiración: {new Date(signedUrlData.expiresAt).toLocaleTimeString()}</span>
                      <span>Nodo CDN Edge: {signedUrlData.cdnEdge}</span>
                    </div>
                  </div>
                )}
              </div>

              {/* HLS Stream Info Live Tester */}
              <div className="bg-slate-950 border border-slate-800 rounded-xl p-5 space-y-4">
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <Video className="w-4 h-4 text-purple-400" />
                  2. Transmisión HLS Adaptativa (1080p, 720p, 480p, 360p)
                </h3>
                <p className="text-xs text-slate-400">
                  Genera la estructura de manifiesto .m3u8 para reproducción continua sin buffering:
                </p>

                <button
                  onClick={handleGenerateHlsStream}
                  className="bg-purple-600 hover:bg-purple-500 text-white px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5"
                >
                  <Play className="w-3.5 h-3.5" />
                  Obtener Manifiesto HLS
                </button>

                {hlsStreamData && (
                  <div className="bg-slate-900 border border-slate-800 rounded-lg p-3 text-xs space-y-2">
                    <div className="text-purple-300 font-semibold text-[11px] font-mono">
                      Proveedor CDN: {hlsStreamData.cdnProvider}
                    </div>
                    <div className="space-y-1">
                      {hlsStreamData.adaptiveQualities.map((q: any, idx: number) => (
                        <div key={idx} className="flex items-center justify-between bg-slate-950 px-2 py-1.5 rounded text-[11px] font-mono">
                          <span className="text-white font-semibold">{q.resolution}</span>
                          <span className="text-slate-400">{q.bitrate}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: REDIS & DB CONNECTION POOL */}
        {activeTab === "redis_db" && (
          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 md:p-8 space-y-6">
            <div className="border-b border-slate-800 pb-4">
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <Database className="w-5 h-5 text-purple-400" />
                Capa de Datos: Redis Distributed Cache &amp; Read Replicas
              </h2>
              <p className="text-slate-400 text-xs mt-1">
                Garantiza que el servidor de base de datos principal maneje únicamente escrituras críticas, canalizando lecturas hacia réplicas y Redis.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Cache Stats Box */}
              <div className="bg-slate-950 border border-slate-800 rounded-xl p-5 space-y-4">
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <Zap className="w-4 h-4 text-amber-400" />
                  Estadísticas de Redis In-Memory Engine
                </h3>
                {metrics && (
                  <div className="space-y-3 font-mono text-xs">
                    <div className="flex justify-between py-1.5 border-b border-slate-800">
                      <span className="text-slate-400">Tasa de Acierto (Hit Ratio)</span>
                      <span className="text-emerald-400 font-bold">{metrics.redisCacheHitRatioPercent}%</span>
                    </div>
                    <div className="flex justify-between py-1.5 border-b border-slate-800">
                      <span className="text-slate-400">Claves Activas en Memoria</span>
                      <span className="text-white font-bold">1,420 Claves</span>
                    </div>
                    <div className="flex justify-between py-1.5 border-b border-slate-800">
                      <span className="text-slate-400">Consumo de Memoria RAM Cache</span>
                      <span className="text-purple-300 font-bold">4.2 MB</span>
                    </div>
                    <div className="flex justify-between py-1.5">
                      <span className="text-slate-400">Estrategia de Evicción</span>
                      <span className="text-cyan-400 font-bold">volatile-lru (TTL)</span>
                    </div>
                  </div>
                )}
              </div>

              {/* DB Pool Saturation Box */}
              <div className="bg-slate-950 border border-slate-800 rounded-xl p-5 space-y-4">
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <Database className="w-4 h-4 text-emerald-400" />
                  Saturación de Pool de Conexiones DB
                </h3>
                {metrics && (
                  <div className="space-y-3 font-mono text-xs">
                    <div className="flex justify-between py-1.5 border-b border-slate-800">
                      <span className="text-slate-400">Saturación del Pool Primary</span>
                      <span className={`font-bold ${metrics.dbPoolSaturationPercent > 80 ? "text-amber-400" : "text-emerald-400"}`}>
                        {metrics.dbPoolSaturationPercent}%
                      </span>
                    </div>
                    <div className="flex justify-between py-1.5 border-b border-slate-800">
                      <span className="text-slate-400">Nodos Réplicas de Lectura</span>
                      <span className="text-white font-bold">
                        {activeTier === "100k" ? "16 Réplicas" : activeTier === "50k" ? "8 Réplicas" : activeTier === "25k" ? "4 Réplicas" : "2 Réplicas"}
                      </span>
                    </div>
                    <div className="flex justify-between py-1.5 border-b border-slate-800">
                      <span className="text-slate-400">Límite Max Conexiones Pool</span>
                      <span className="text-cyan-300 font-bold">
                        {activeTier === "100k" ? "1,400 Conexiones" : "350 Conexiones"}
                      </span>
                    </div>
                    <div className="flex justify-between py-1.5">
                      <span className="text-slate-400">Estado de Salud Pool</span>
                      <span className="text-emerald-400 font-bold flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" /> SALUDABLE
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: ASYNC QUEUE & WORKERS */}
        {activeTab === "queue" && (
          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 md:p-8 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
              <div>
                <h2 className="text-xl font-bold text-white flex items-center gap-2">
                  <Workflow className="w-5 h-5 text-rose-400" />
                  Sistema de Colas &amp; Trabajadores Asíncronos (Background Workers)
                </h2>
                <p className="text-slate-400 text-xs mt-1">
                  Desacopla tareas pesadas de CPU (Análisis AI, Renderizado PDF de Certificados, Indexación RAG) de las peticiones HTTP del usuario.
                </p>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => handleEnqueueSampleTask("AI_DIAGNOSTIC_ANALYSIS")}
                  className="bg-slate-800 hover:bg-slate-700 text-cyan-300 border border-slate-700 px-3 py-1.5 rounded-lg text-xs font-bold transition-all"
                >
                  + Tarea AI
                </button>
                <button
                  onClick={() => handleEnqueueSampleTask("GENERATE_PDF_CERTIFICATE")}
                  className="bg-slate-800 hover:bg-slate-700 text-rose-300 border border-slate-700 px-3 py-1.5 rounded-lg text-xs font-bold transition-all"
                >
                  + Render Certificado
                </button>
              </div>
            </div>

            {/* Queue Execution Log */}
            <div className="bg-slate-950 border border-slate-800 rounded-xl p-4">
              <h3 className="text-xs font-bold text-slate-400 uppercase mb-3 flex items-center gap-1.5">
                <Terminal className="w-4 h-4 text-cyan-400" /> Historial Reciente de Tareas Ejecutadas en Segundo Plano
              </h3>

              <div className="space-y-2 overflow-x-auto">
                {queueHistory.length === 0 ? (
                  <p className="text-xs text-slate-500 py-4 text-center">No hay tareas recientes en la cola.</p>
                ) : (
                  queueHistory.map((task: any) => (
                    <div key={task.id} className="flex items-center justify-between bg-slate-900 p-2.5 rounded-lg border border-slate-800/80 text-xs font-mono">
                      <div className="flex items-center gap-3">
                        <span className="px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 text-[10px] font-bold">
                          {task.type}
                        </span>
                        <span className="text-slate-300">{task.id}</span>
                      </div>
                      <div className="flex items-center gap-4">
                        <span className="text-slate-500 text-[11px]">{task.processedByWorkerId}</span>
                        <span className="text-emerald-400 font-semibold flex items-center gap-1 text-[11px]">
                          <CheckCircle2 className="w-3 h-3" /> COMPLETADO
                        </span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        )}

        {/* TAB 5: LOAD TEST BENCHMARK SIMULATOR */}
        {activeTab === "benchmark" && (
          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 md:p-8 space-y-6">
            <div className="border-b border-slate-800 pb-4">
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <Gauge className="w-5 h-5 text-amber-400" />
                Simulador Integrado de Pruebas de Carga &amp; Estrés (1,000 a 100,000 Concurrentes)
              </h2>
              <p className="text-slate-400 text-xs mt-1">
                Ejecuta un benchmark real sobre las rutas de prueba para medir rendimiento, throughput (RPS), distribución de latencia y cuellos de botella.
              </p>
            </div>

            {/* Controls */}
            <div className="bg-slate-950 border border-slate-800 rounded-xl p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <span className="text-xs font-semibold text-slate-300">Concurrencia a Simular:</span>
                <select
                  value={simulatedUserCount}
                  onChange={(e) => setSimulatedUserCount(Number(e.target.value))}
                  className="bg-slate-900 border border-slate-700 text-white text-xs font-bold rounded-lg px-3 py-2 focus:outline-none focus:border-amber-500"
                >
                  <option value={1000}>1,000 Usuarios Concurrentes</option>
                  <option value={5000}>5,000 Usuarios Concurrentes</option>
                  <option value={10000}>10,000 Usuarios Concurrentes</option>
                  <option value={25000}>25,000 Usuarios Concurrentes</option>
                  <option value={50000}>50,000 Usuarios Concurrentes</option>
                  <option value={100000}>100,000+ Usuarios Concurrentes</option>
                </select>
              </div>

              <button
                onClick={handleRunBenchmark}
                disabled={isTesting}
                className="bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-400 hover:to-orange-500 text-slate-950 font-bold px-6 py-2.5 rounded-xl text-xs transition-all shadow-lg shadow-amber-500/20 flex items-center justify-center gap-2"
              >
                {isTesting ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    Ejecutando Test de Carga...
                  </>
                ) : (
                  <>
                    <Play className="w-4 h-4 fill-current" />
                    Iniciar Prueba de Carga Integrada
                  </>
                )}
              </button>
            </div>

            {/* Results Display */}
            {benchmarkResult && (
              <div className="space-y-6">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 font-mono">
                  <div className="bg-slate-950 border border-slate-800 rounded-xl p-4">
                    <span className="text-slate-400 text-xs">Throughput Alcanzado</span>
                    <div className="text-2xl font-bold text-amber-400 mt-1">{benchmarkResult.achievedRps.toLocaleString()} RPS</div>
                    <span className="text-[10px] text-slate-500">Objetivo: {benchmarkResult.targetRps.toLocaleString()} RPS</span>
                  </div>

                  <div className="bg-slate-950 border border-slate-800 rounded-xl p-4">
                    <span className="text-slate-400 text-xs">Latencia P50 (Mediana)</span>
                    <div className="text-2xl font-bold text-emerald-400 mt-1">{benchmarkResult.p50LatencyMs} ms</div>
                    <span className="text-[10px] text-slate-500">P95: {benchmarkResult.p95LatencyMs}ms | P99: {benchmarkResult.p99LatencyMs}ms</span>
                  </div>

                  <div className="bg-slate-950 border border-slate-800 rounded-xl p-4">
                    <span className="text-slate-400 text-xs">Tasa de Error HTTP</span>
                    <div className={`text-2xl font-bold mt-1 ${benchmarkResult.errorRatePercent > 1 ? "text-rose-400" : "text-emerald-400"}`}>
                      {benchmarkResult.errorRatePercent}%
                    </div>
                    <span className="text-[10px] text-slate-500">{benchmarkResult.successfulRequests.toLocaleString()} Solicitudes Exitosas</span>
                  </div>

                  <div className="bg-slate-950 border border-slate-800 rounded-xl p-4">
                    <span className="text-slate-400 text-xs">Ahorro Ancho de Banda CDN</span>
                    <div className="text-2xl font-bold text-cyan-400 mt-1">{benchmarkResult.cdnTrafficOffloadPercent}%</div>
                    <span className="text-[10px] text-slate-500">Tráfico Video/PDF fuera del App Server</span>
                  </div>
                </div>

                {/* Bottlenecks and Recommendations */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-slate-950 border border-rose-500/30 rounded-xl p-5 space-y-3">
                    <h3 className="text-xs font-bold text-rose-400 uppercase flex items-center gap-1.5">
                      <AlertTriangle className="w-4 h-4" /> Diagnóstico de Cuellos de Botella Detectados
                    </h3>
                    <ul className="text-xs text-slate-300 space-y-2">
                      {benchmarkResult.bottlenecksIdentified.map((b, i) => (
                        <li key={i} className="flex items-start gap-2 bg-slate-900/60 p-2 rounded border border-slate-800">
                          <span className="text-rose-400 font-bold">•</span>
                          {b}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="bg-slate-950 border border-emerald-500/30 rounded-xl p-5 space-y-3">
                    <h3 className="text-xs font-bold text-emerald-400 uppercase flex items-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4" /> Recomendaciones Arquitectónicas
                    </h3>
                    <ul className="text-xs text-slate-300 space-y-2">
                      {benchmarkResult.recommendations.map((r, i) => (
                        <li key={i} className="flex items-start gap-2 bg-slate-900/60 p-2 rounded border border-slate-800">
                          <span className="text-emerald-400 font-bold">✓</span>
                          {r}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* TAB 6: AUTOSCALING RULES */}
        {activeTab === "autoscaling" && (
          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 md:p-8 space-y-6">
            <div className="border-b border-slate-800 pb-4">
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <Sliders className="w-5 h-5 text-emerald-400" />
                Reglas de Autoscaling Horizontal Automático
              </h2>
              <p className="text-slate-400 text-xs mt-1">
                Ajuste dinámico de instancias backend y réplicas de base de datos según la demanda en tiempo real.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-slate-950 border border-slate-800 rounded-xl p-5 space-y-2">
                <h3 className="text-xs font-bold text-cyan-400 uppercase">CPU Scale-Out Threshold</h3>
                <div className="text-2xl font-bold text-white font-mono">&gt; 70% CPU</div>
                <p className="text-xs text-slate-400">Si el promedio de CPU supera 70% durante 3 minutos, se provisionan +2 instancias backend automáticamente.</p>
              </div>

              <div className="bg-slate-950 border border-slate-800 rounded-xl p-5 space-y-2">
                <h3 className="text-xs font-bold text-purple-400 uppercase">DB Pool Saturation Threshold</h3>
                <div className="text-2xl font-bold text-white font-mono">&gt; 85% Conexiones</div>
                <p className="text-xs text-slate-400">Si el pool de conexiones sobrepasa 85%, el orquestador añade réplicas de lectura secundarias.</p>
              </div>

              <div className="bg-slate-950 border border-slate-800 rounded-xl p-5 space-y-2">
                <h3 className="text-xs font-bold text-amber-400 uppercase">Cooldown Period</h3>
                <div className="text-2xl font-bold text-white font-mono">180 Segundos</div>
                <p className="text-xs text-slate-400">Periodo de estabilización entre operaciones de escalamiento para evitar oscilaciones innecesarias.</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default YoveArchitectureView;
