import React, { useState, useRef, useEffect } from 'react';
import {
  Sparkles,
  Send,
  Bot,
  User,
  Wrench,
  AlertTriangle,
  ShieldCheck,
  RefreshCw,
  BookOpen,
  Plus,
  Trash2,
  GraduationCap,
  Activity,
  Car,
  CheckCircle2,
  Sliders,
  ChevronDown,
  ChevronUp,
  Layers,
  Award,
  Zap,
  Radio,
  FileText,
  HelpCircle,
  MessageSquare,
  ArrowRight,
  Gauge
} from 'lucide-react';
import { FadeInOnScroll } from '../FadeInOnScroll';
import { ContentService } from '../../services/contentService';
import { useAuth } from '../../context/AuthContext';

interface Message {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  timestamp: string;
  isEducationalDisclaimer?: boolean;
}

export interface VehicleContext {
  brand: string;
  model: string;
  year: number;
  engine: string;
  system: string;
  dtc: string;
  symptom: string;
}

export interface ChatSession {
  id: string;
  title: string;
  timestamp: string;
  vehicleContext: VehicleContext;
  messages: Message[];
}

interface YoveAIViewProps {
  initialPrompt?: string;
  onNavigateToView?: (view: any) => void;
  onOpenLabWithComponent?: (type: 'oscilloscope' | 'multimeter' | 'canbus') => void;
  onOpenCourse?: (course: any) => void;
  onEarnXp?: (xpAmount: number) => void;
}

const DEFAULT_CONTEXT: VehicleContext = {
  brand: 'Toyota',
  model: 'Yaris',
  year: 2019,
  engine: '1NZ-FE',
  system: 'Inyección Electrónica',
  dtc: 'P0171',
  symptom: 'Mezcla Pobre / Inestabilidad en ralentí'
};

const INITIAL_SESSIONS: ChatSession[] = [
  {
    id: 'session-default',
    title: 'Diagnóstico P0171 - Toyota Yaris 1NZ-FE',
    timestamp: 'Hoy, 10:15 AM',
    vehicleContext: DEFAULT_CONTEXT,
    messages: [
      {
        id: 'msg-welcome',
        sender: 'ai',
        text: `¡Hola, Estudiante Técnico! Soy **YOVE AI**, tu copiloto de inteligencia artificial para educación y diagnóstico mecatrónico automotriz.

📌 **Información del Vehículo en Contexto**:
• **Vehículo**: Toyota Yaris 2019 (Motor 1NZ-FE 1.5L)
• **Sistema**: Inyección Electrónica
• **Código DTC**: P0171 (System Too Lean - Mezcla Pobre)
• **Síntoma**: Inestabilidad en ralentí y vacilación al acelerar

---

🔍 **Análisis Técnico Educativo**:
El código **P0171** indica que el módulo de control del motor (PCM/ECM) ha detectado una condición de **mezcla de aire/combustible excesivamente pobre** en el Banco 1. Esto significa que la proporción estequiométrica (14.7:1) se ha desplazado a más de 16:1, requiriendo que la ECU añada más del +20% a +25% de combustible a través del ajuste a largo plazo (LTFT).

❓ **Preguntas y Datos Necesarios**:
1. ¿Cuál es el valor del ajuste de combustible a corto plazo (**STFT**) y largo plazo (**LTFT**) en ralentí y a 2,500 RPM?
2. Si el LTFT mejora a 2,500 RPM respecto a ralentí, el síntoma apunta fuertemente a una **fuga de vacío** posterior al mariposa de aceleración.
3. ¿Existen lecturas anómalas en el sensor de flujo de aire (MAF) en gramos/segundo?

⚠️ **Posibles Causas (Ordenadas por Probabilidad)**:
1. **Fuga de aire de admisión / vacío**: Fisura en manguera PCV, empaque de múltiple o cuerpo de aceleración.
2. **Sensor MAF sucio o descalibrado**: Elemento de hilo caliente contaminado con aceite o polvo.
3. **Baja presión de combustible**: Filtro obstruido o bomba fatigada (Presión de riel < 3.0 bar / 43 PSI).
4. **Fuga en sistema de escape previo al sensor O2**: Infiltración de aire fresco que engaña a la sonda lambda.

🔬 **Pruebas Recomendadas con Equipos**:
• **Multímetro / Escáner**: Mide voltaje de señal MAF (~1.2V a 1.4V en ralentí) y caídas de tensión en masas de sensor (<50mV).
• **Osciloscopio**: Verifica la respuesta dinámica del sensor de oxígeno Banda Ancha / A/F Ratio al acelerar bruscamente.
• **Máquina de humo**: Inyecta humo por la admisión para visibilizar fugas en juntas.

📊 **Interpretación y Orden de Diagnóstico**:
1° Inspección visual de tuberías de admisión.
2° Limpieza preventiva del MAF con aerosol dieléctrico específico.
3° Medición de presión de combustible en riel de inyectores.

🎓 **Siguiente Paso & Recomendación Educativa**:
Te sugiero estudiar el módulo de **Inyección Electrónica y Sensores de Mezcla** en YOVE Academy y simular la comprobación de la señal del sensor O2 en nuestro **Laboratorio de Osciloscopio**.`,
        timestamp: '10:15 AM'
      }
    ]
  }
];

export const YoveAIView: React.FC<YoveAIViewProps> = ({
  initialPrompt,
  onNavigateToView,
  onOpenLabWithComponent,
  onOpenCourse,
  onEarnXp
}) => {
  const [sessions, setSessions] = useState<ChatSession[]>(() => {
    const saved = localStorage.getItem('yove_ai_sessions_v2');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Error loading saved AI sessions', e);
      }
    }
    return INITIAL_SESSIONS;
  });

  const { user, token } = useAuth();
  const [activeSessionId, setActiveSessionId] = useState<string>('session-default');
  const [showContextPanel, setShowContextPanel] = useState<boolean>(true);
  const [showHistoryDrawer, setShowHistoryDrawer] = useState<boolean>(false);
  const [inputText, setInputText] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [activeMode, setActiveMode] = useState<string>('aprender');
  const [convertedCaseModal, setConvertedCaseModal] = useState<boolean>(false);
  const [createdCaseData, setCreatedCaseData] = useState<any>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const initialTriggered = useRef(false);

  // Active Session reference
  const activeSession = sessions.find(s => s.id === activeSessionId) || sessions[0] || INITIAL_SESSIONS[0];
  const [currentContext, setCurrentContext] = useState<VehicleContext>(activeSession.vehicleContext || DEFAULT_CONTEXT);

  // Save sessions to localStorage
  useEffect(() => {
    localStorage.setItem('yove_ai_sessions_v2', JSON.stringify(sessions));
  }, [sessions]);

  // Handle Initial Prompt if passed from another view
  useEffect(() => {
    if (initialPrompt && !initialTriggered.current) {
      initialTriggered.current = true;
      handleSendMessage(initialPrompt);
    }
  }, [initialPrompt]);

  useEffect(() => {
    scrollToBottom();
  }, [activeSession?.messages, isLoading]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // Create new session
  const handleCreateNewSession = () => {
    const newId = `session-${Date.now()}`;
    const newSession: ChatSession = {
      id: newId,
      title: 'Nueva Consulta Mecatrónica',
      timestamp: 'Ahora',
      vehicleContext: { ...currentContext },
      messages: [
        {
          id: `msg-${Date.now()}`,
          sender: 'ai',
          text: '¡Hola! He iniciado una nueva sesión de estudio y diagnóstico. Ajusta los parámetros del vehículo arriba o escribe directamente tu consulta sobre un DTC, sensor, síntoma o sistema mecatrónico.',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]
    };

    setSessions(prev => [newSession, ...prev]);
    setActiveSessionId(newId);
    setShowHistoryDrawer(false);
  };

  // Delete session
  const handleDeleteSession = (idToDelete: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (sessions.length <= 1) return;
    const filtered = sessions.filter(s => s.id !== idToDelete);
    setSessions(filtered);
    if (activeSessionId === idToDelete) {
      setActiveSessionId(filtered[0].id);
      setCurrentContext(filtered[0].vehicleContext);
    }
  };

  // Send message
  const handleSendMessage = async (textToSend?: string) => {
    const query = textToSend || inputText;
    if (!query.trim() || isLoading) return;

    const userMsg: Message = {
      id: `msg-user-${Date.now()}`,
      sender: 'user',
      text: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    // Update session title if default
    let updatedTitle = activeSession.title;
    if (activeSession.title === 'Nueva Consulta Mecatrónica') {
      updatedTitle = query.length > 30 ? `${query.substring(0, 30)}...` : query;
    }

    // Add user message to active session
    setSessions(prev =>
      prev.map(s => {
        if (s.id === activeSession.id) {
          return {
            ...s,
            title: updatedTitle,
            vehicleContext: { ...currentContext },
            messages: [...s.messages, userMsg]
          };
        }
        return s;
      })
    );

    if (!textToSend) setInputText('');
    setIsLoading(true);

    try {
      const history = activeSession.messages.map(m => ({
        role: m.sender === 'user' ? 'user' : 'model',
        text: m.text
      }));

      const res = await fetch('/api/v1/ai/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          message: query,
          mode: activeMode,
          vehicleContext: currentContext
        })
      });

      const data = await res.json();
      const aiReplyText = data.reply || data.text || 'No se pudo generar la respuesta de diagnóstico.';

      const aiMsg: Message = {
        id: `msg-ai-${Date.now()}`,
        sender: 'ai',
        text: aiReplyText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setSessions(prev =>
        prev.map(s => {
          if (s.id === activeSession.id) {
            return {
              ...s,
              messages: [...s.messages, aiMsg]
            };
          }
          return s;
        })
      );
    } catch (err) {
      console.error('Error in YOVE AI:', err);
      const errorMsg: Message = {
        id: `msg-err-${Date.now()}`,
        sender: 'ai',
        text: 'Ocurrió un error de comunicación con el servidor de diagnóstico YOVE AI. Por favor reintenta.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setSessions(prev =>
        prev.map(s => {
          if (s.id === activeSession.id) {
            return { ...s, messages: [...s.messages, errorMsg] };
          }
          return s;
        })
      );
    } finally {
      setIsLoading(false);
    }
  };

  // Action: Convert current chat query into a Diagnostic Case Exercise
  const handleConvertToPracticalCase = () => {
    const caseTitle = `Caso Práctico: ${currentContext.brand} ${currentContext.model} (${currentContext.year}) - DTC ${currentContext.dtc}`;
    const newCase = {
      id: `case-ai-${Date.now()}`,
      title: caseTitle,
      vehicle: `${currentContext.brand} ${currentContext.model} ${currentContext.year}`,
      engine: currentContext.engine,
      system: currentContext.system,
      dtc: currentContext.dtc,
      symptom: currentContext.symptom,
      difficulty: 'Intermedio',
      xpReward: 100,
      description: `Ejercicio de taller convertido automáticamente a partir de tu consulta con YOVE AI. Diagnostica y confirma la causa raíz para ${currentContext.brand} ${currentContext.model}.`,
      finalExplanation: `Verificación paso a paso realizada. Se confirmó la causa en el sistema de ${currentContext.system} para el DTC ${currentContext.dtc}.`
    };

    setCreatedCaseData(newCase);
    setConvertedCaseModal(true);

    if (onEarnXp) {
      onEarnXp(100);
    }
  };

  const quickPrompts = [
    `Análisis DTC ${currentContext.dtc || 'P0171'} en ${currentContext.brand} ${currentContext.model}`,
    'Explicar diferencia entre Sensor CKP Inductivo vs Hall con forma de onda',
    'Árbol de diagnóstico para fallo de encendido P0300',
    'Procedimiento para medir caída de tensión en masa de motor',
    'Generar quiz de 3 preguntas de evaluación sobre CAN Bus',
    'Recomendar cursos de inyección electrónica y diagnóstico'
  ];

  return (
    <div className="py-12 bg-[#0a0e27] min-h-screen text-white pt-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        
        {/* Header Title */}
        <FadeInOnScroll direction="up">
          <div className="text-center space-y-3">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-gradient-to-r from-[#ff6f00] to-[#ff9100] text-white text-xs font-black uppercase tracking-wider shadow-md">
              <Sparkles className="w-4 h-4 text-amber-200" />
              YOVE AI // Asistente de Educación y Diagnóstico Automotriz
            </div>

            <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
              Copiloto de Inteligencia Artificial Mecatrónica
            </h1>

            <p className="text-xs sm:text-sm text-gray-300 max-w-3xl mx-auto leading-relaxed">
              Resuelve dudas de estudio, interpreta códigos DTC, construye árboles de decisión de diagnóstico, genera ejercicios interactivos y conecta directamente con el Laboratorio Virtual y los Cursos LMS.
            </p>
          </div>
        </FadeInOnScroll>

        {/* Safety & Educational Disclaimer Banner (MANDATORY REQUIREMENT PROMPT 06 & PROMPT 25) */}
        <div className="p-4 rounded-2xl bg-amber-950/40 border border-amber-500/40 flex items-start gap-3 text-xs text-amber-200 shadow-xl">
          <ShieldCheck className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <h4 className="font-extrabold text-amber-300 uppercase tracking-wider text-[11px]">
              Diferenciación de Seguridad: Información Educativa vs. Diagnóstico Profesional
            </h4>
            <p className="text-[11px] leading-relaxed text-amber-100/90">
              YOVE AI provee guías pedagógicas y árboles de decisión orientados al estudio mecatrónico. No reemplaza la inspección física ni autoriza la sustitución de repuestos sin comprobación con multímetro, osciloscopio o escáner. <strong>Verificar especificaciones y procedimientos en la documentación técnica correspondiente al vehículo.</strong>
            </p>
          </div>
        </div>

        {/* Main Interface Layout: History Drawer + Vehicle Context + Chat */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-start">
          
          {/* Sidebar / Left Column: Vehicle Context & Session History */}
          <div className="space-y-4 lg:col-span-1">
            
            {/* 1. Vehicle Context Control Box */}
            <div className="p-5 rounded-2xl bg-gradient-to-b from-[#0e153b] to-[#0a0e27] border border-blue-800/50 space-y-4 shadow-xl">
              <div
                onClick={() => setShowContextPanel(!showContextPanel)}
                className="flex items-center justify-between cursor-pointer select-none pb-2 border-b border-white/10"
              >
                <div className="flex items-center gap-2 text-xs font-black text-[#ff9100] uppercase tracking-wider">
                  <Car className="w-4 h-4 text-[#ff9100]" />
                  Contexto del Vehículo
                </div>
                {showContextPanel ? <ChevronUp className="w-4 h-4 text-gray-400" /> : <ChevronDown className="w-4 h-4 text-gray-400" />}
              </div>

              {showContextPanel && (
                <div className="space-y-3 pt-1 text-xs">
                  <div>
                    <label className="text-[10px] font-bold text-gray-400 uppercase block mb-1">Marca / Fabricante</label>
                    <input
                      type="text"
                      value={currentContext.brand}
                      onChange={(e) => setCurrentContext({ ...currentContext, brand: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl bg-black/60 border border-white/20 text-white font-bold focus:outline-none focus:border-[#ff6f00]"
                      placeholder="Ej. Toyota"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] font-bold text-gray-400 uppercase block mb-1">Modelo & Año</label>
                    <div className="grid grid-cols-2 gap-2">
                      <input
                        type="text"
                        value={currentContext.model}
                        onChange={(e) => setCurrentContext({ ...currentContext, model: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl bg-black/60 border border-white/20 text-white font-bold focus:outline-none focus:border-[#ff6f00]"
                        placeholder="Ej. Yaris"
                      />
                      <input
                        type="number"
                        value={currentContext.year}
                        onChange={(e) => setCurrentContext({ ...currentContext, year: Number(e.target.value) })}
                        className="w-full px-3 py-2 rounded-xl bg-black/60 border border-white/20 text-white font-bold focus:outline-none focus:border-[#ff6f00]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-[10px] font-bold text-gray-400 uppercase block mb-1">Código de Motor</label>
                    <input
                      type="text"
                      value={currentContext.engine}
                      onChange={(e) => setCurrentContext({ ...currentContext, engine: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl bg-black/60 border border-white/20 text-white font-bold focus:outline-none focus:border-[#ff6f00]"
                      placeholder="Ej. 1NZ-FE 1.5L"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] font-bold text-gray-400 uppercase block mb-1">Sistema a Consultar</label>
                    <input
                      type="text"
                      value={currentContext.system}
                      onChange={(e) => setCurrentContext({ ...currentContext, system: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl bg-black/60 border border-white/20 text-white font-bold focus:outline-none focus:border-[#ff6f00]"
                      placeholder="Ej. Inyección Electrónica"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] font-bold text-gray-400 uppercase block mb-1">Código DTC</label>
                    <input
                      type="text"
                      value={currentContext.dtc}
                      onChange={(e) => setCurrentContext({ ...currentContext, dtc: e.target.value.toUpperCase() })}
                      className="w-full px-3 py-2 rounded-xl bg-black/60 border border-red-500/40 text-red-300 font-mono font-bold focus:outline-none focus:border-red-500"
                      placeholder="Ej. P0171"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] font-bold text-gray-400 uppercase block mb-1">Síntoma Observado</label>
                    <textarea
                      rows={2}
                      value={currentContext.symptom}
                      onChange={(e) => setCurrentContext({ ...currentContext, symptom: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl bg-black/60 border border-white/20 text-white text-xs focus:outline-none focus:border-[#ff6f00]"
                      placeholder="Ej. Inestabilidad en ralentí"
                    />
                  </div>

                  <button
                    onClick={() => {
                      const promptText = `Inicia diagnóstico educativo para ${currentContext.brand} ${currentContext.model} (${currentContext.year}) motor ${currentContext.engine}, sistema ${currentContext.system}, código DTC ${currentContext.dtc}. Síntoma: ${currentContext.symptom}. Proporciona árbol de decisión y pruebas sugeridas.`;
                      handleSendMessage(promptText);
                    }}
                    className="w-full py-2.5 rounded-xl bg-gradient-to-r from-[#ff6f00] to-[#ff9100] text-white font-extrabold text-xs shadow-md hover:opacity-90 transition cursor-pointer flex items-center justify-center gap-2"
                  >
                    <Zap className="w-3.5 h-3.5 text-amber-200" />
                    Cargar Contexto al Chat
                  </button>
                </div>
              )}
            </div>

            {/* 2. Session History List Box */}
            <div className="p-5 rounded-2xl bg-gradient-to-b from-[#0e153b] to-[#0a0e27] border border-blue-800/50 space-y-3 shadow-xl">
              <div className="flex items-center justify-between pb-2 border-b border-white/10">
                <div className="flex items-center gap-2 text-xs font-black text-white uppercase tracking-wider">
                  <MessageSquare className="w-4 h-4 text-blue-400" />
                  Historial de Consultas ({sessions.length})
                </div>

                <button
                  onClick={handleCreateNewSession}
                  className="p-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-[10px] font-bold flex items-center gap-1 transition cursor-pointer"
                  title="Nueva Consulta"
                >
                  <Plus className="w-3.5 h-3.5" />
                  Nueva
                </button>
              </div>

              <div className="space-y-1.5 max-h-[280px] overflow-y-auto pr-1">
                {sessions.map(s => (
                  <div
                    key={s.id}
                    onClick={() => {
                      setActiveSessionId(s.id);
                      if (s.vehicleContext) setCurrentContext(s.vehicleContext);
                    }}
                    className={`p-2.5 rounded-xl text-xs cursor-pointer transition flex items-center justify-between border ${
                      s.id === activeSessionId
                        ? 'bg-blue-900/60 border-blue-500 text-white font-bold shadow'
                        : 'bg-white/5 border-white/5 text-gray-300 hover:bg-white/10'
                    }`}
                  >
                    <div className="truncate space-y-0.5">
                      <p className="truncate text-xs font-bold">{s.title}</p>
                      <span className="text-[10px] text-gray-400 block font-mono">{s.timestamp}</span>
                    </div>

                    {sessions.length > 1 && (
                      <button
                        onClick={(e) => handleDeleteSession(s.id, e)}
                        className="p-1 rounded text-gray-400 hover:text-red-400 hover:bg-red-950/50 transition shrink-0 ml-1"
                        title="Eliminar consulta"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* 3. Action Box: Convert Conversation into Case */}
            <div className="p-5 rounded-2xl bg-gradient-to-br from-emerald-950/80 to-teal-950/80 border border-emerald-500/40 space-y-3 shadow-xl">
              <div className="flex items-center gap-2 text-xs font-extrabold text-emerald-300 uppercase tracking-wider">
                <GraduationCap className="w-4 h-4 text-emerald-400" />
                Conversión Pedagógica
              </div>

              <p className="text-[11px] text-emerald-100/90 leading-relaxed">
                Transforma los datos de esta consulta de IA en un <strong>Caso Práctico de Taller</strong> interactivo para resolverlo en el LMS.
              </p>

              <button
                onClick={handleConvertToPracticalCase}
                className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs shadow-lg transition cursor-pointer flex items-center justify-center gap-2"
              >
                <Award className="w-4 h-4 text-amber-300" />
                Convertir en Caso Práctico (+100 XP)
              </button>
            </div>

          </div>

          {/* Right Column (3 cols): Main Chat Area */}
          <div className="lg:col-span-3 bg-gradient-to-b from-[#0e1438] to-[#0a0e27] border border-blue-900/50 rounded-2xl shadow-2xl flex flex-col h-[700px] overflow-hidden">
            
            {/* Top Chat Bar */}
            <div className="px-6 py-4 bg-[#070a1e] border-b border-blue-900/40 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-[#ff6f00] to-[#ff9100] flex items-center justify-center text-white shadow-lg shrink-0">
                  <Bot className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-extrabold text-sm text-white flex items-center gap-2">
                    YOVE AI Diagnosta & Educador
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  </h3>
                  <div className="flex items-center gap-2 text-[11px] text-gray-300">
                    <span>{currentContext.brand} {currentContext.model} ({currentContext.year})</span>
                    <span>•</span>
                    <span className="text-amber-400 font-mono font-bold">{currentContext.dtc || 'Sin DTC'}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    if (onOpenLabWithComponent) onOpenLabWithComponent('oscilloscope');
                  }}
                  className="px-3 py-1.5 rounded-xl bg-emerald-600/80 hover:bg-emerald-500 text-white text-[11px] font-extrabold flex items-center gap-1.5 shadow transition cursor-pointer"
                >
                  <Activity className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Laboratorio</span>
                </button>

                <button
                  onClick={() => {
                    if (onNavigateToView) onNavigateToView('garage');
                  }}
                  className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-gray-200 text-[11px] font-extrabold flex items-center gap-1.5 border border-white/20 transition cursor-pointer"
                >
                  <Car className="w-3.5 h-3.5 text-[#ff9100]" />
                  <span className="hidden sm:inline">YOVE Garage</span>
                </button>

                <button
                  onClick={() => {
                    setSessions(prev =>
                      prev.map(s => (s.id === activeSession.id ? { ...s, messages: [s.messages[0]] } : s))
                    );
                  }}
                  className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-gray-300 text-xs flex items-center gap-1 transition"
                  title="Reiniciar chat actual"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Chat Messages Area */}
            <div className="flex-1 p-4 sm:p-6 overflow-y-auto space-y-5 bg-[#080c24]/50">
              {activeSession.messages.map((m) => (
                <div
                  key={m.id}
                  className={`flex gap-3.5 ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  {m.sender === 'ai' && (
                    <div className="w-9 h-9 rounded-2xl bg-gradient-to-tr from-[#ff6f00] to-[#ff9100] flex items-center justify-center text-white shrink-0 mt-1 shadow-lg">
                      <Bot className="w-4 h-4" />
                    </div>
                  )}

                  <div
                    className={`max-w-[90%] sm:max-w-[80%] p-4 sm:p-5 rounded-2xl text-xs sm:text-sm leading-relaxed space-y-3 ${
                      m.sender === 'user'
                        ? 'bg-gradient-to-r from-[#ff6f00] to-[#ff8f00] text-white font-medium shadow-lg'
                        : 'bg-[#0f163d] border border-blue-900/40 text-gray-200 shadow-xl'
                    }`}
                  >
                    <div className="whitespace-pre-wrap font-sans space-y-2">{m.text}</div>

                    <div className="flex items-center justify-between pt-2 border-t border-white/10 text-[10px]">
                      <span className="font-mono text-gray-400 opacity-75">{m.timestamp}</span>

                      {m.sender === 'ai' && (
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => {
                              if (onOpenLabWithComponent) onOpenLabWithComponent('oscilloscope');
                            }}
                            className="text-[#ff9100] hover:underline font-bold flex items-center gap-1"
                          >
                            <Activity className="w-3 h-3" />
                            Probar en Lab
                          </button>

                          <button
                            onClick={() => {
                              if (onNavigateToView) onNavigateToView('cursos');
                            }}
                            className="text-blue-300 hover:underline font-bold flex items-center gap-1"
                          >
                            <BookOpen className="w-3 h-3" />
                            Cursos LMS
                          </button>
                        </div>
                      )}
                    </div>
                  </div>

                  {m.sender === 'user' && (
                    <div className="w-9 h-9 rounded-2xl bg-blue-600 flex items-center justify-center text-white shrink-0 mt-1 shadow-lg">
                      <User className="w-4 h-4" />
                    </div>
                  )}
                </div>
              ))}

              {isLoading && (
                <div className="flex items-center gap-3 text-gray-300 text-xs p-4 rounded-2xl bg-[#0f163d] border border-blue-700/50 w-fit animate-pulse shadow-xl">
                  <Bot className="w-5 h-5 text-[#ff9100]" />
                  <div className="space-y-0.5">
                    <p className="font-bold text-white">YOVE AI analizando parámetros y árboles de diagnóstico...</p>
                    <p className="text-[10px] text-gray-400">Consultando base de conocimientos mecatrónicos de YOVE Academy</p>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Quick Action Suggested Prompts Chips */}
            <div className="px-4 py-2.5 bg-[#070a1e] border-t border-white/5 flex gap-2 overflow-x-auto">
              {quickPrompts.map((prompt, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSendMessage(prompt)}
                  disabled={isLoading}
                  className="px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-[11px] font-bold text-gray-200 hover:text-white whitespace-nowrap transition cursor-pointer shrink-0 flex items-center gap-1.5"
                >
                  <Zap className="w-3 h-3 text-[#ff9100]" />
                  {prompt}
                </button>
              ))}
            </div>

            {/* Chat Input Bar */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendMessage();
              }}
              className="p-4 bg-[#070a1e] border-t border-blue-900/40 flex items-center gap-3"
            >
              <input
                type="text"
                placeholder="Pregunta sobre DTC, funcionamiento de sensor/actuador, mediciones o ejercicios..."
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                className="flex-1 px-4 py-3 rounded-xl bg-black/70 border border-white/20 text-white placeholder-gray-500 text-xs sm:text-sm focus:outline-none focus:border-[#ff6f00]"
              />

              <button
                type="submit"
                disabled={!inputText.trim() || isLoading}
                className="px-5 py-3 rounded-xl bg-gradient-to-r from-[#ff6f00] to-[#ff9100] font-extrabold text-white shadow-lg hover:opacity-90 disabled:opacity-40 disabled:cursor-not-allowed transition flex items-center gap-2 text-xs cursor-pointer shrink-0"
              >
                <span>Enviar</span>
                <Send className="w-3.5 h-3.5" />
              </button>
            </form>

          </div>

        </div>

      </div>

      {/* Modal: Conversion to Practical Case Completed */}
      {convertedCaseModal && createdCaseData && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="p-6 rounded-2xl bg-gradient-to-b from-[#0e163d] to-[#0a0e27] border border-emerald-500/50 max-w-lg w-full space-y-5 shadow-2xl animate-fade-in">
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-black">
                  <Award className="w-6 h-6 text-amber-300" />
                </div>
                <div>
                  <h3 className="font-extrabold text-base text-white">¡Consulta Convertida en Caso Práctico!</h3>
                  <p className="text-xs text-emerald-300 font-semibold">+100 XP Otorgados a tu Perfil de Estudiante</p>
                </div>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-black/50 border border-white/10 space-y-2 text-xs">
              <p className="font-bold text-white text-sm">{createdCaseData.title}</p>
              <div className="text-gray-300 space-y-1">
                <p><strong>Vehículo:</strong> {createdCaseData.vehicle} (Motor {createdCaseData.engine})</p>
                <p><strong>Sistema:</strong> {createdCaseData.system}</p>
                <p><strong>Código DTC:</strong> <span className="text-red-300 font-mono font-bold">{createdCaseData.dtc}</span></p>
                <p><strong>Síntoma:</strong> {createdCaseData.symptom}</p>
              </div>
            </div>

            <p className="text-xs text-gray-300 leading-relaxed">
              El caso fue registrado exitosamente en tu perfil de entrenamiento. Puedes volver a revisar los árboles de diagnóstico y pruebas recomendadas en la sección de <strong>Casos Reales</strong>.
            </p>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={() => setConvertedCaseModal(false)}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-gray-200 text-xs font-bold transition cursor-pointer"
              >
                Cerrar
              </button>

              <button
                onClick={() => {
                  setConvertedCaseModal(false);
                  if (onNavigateToView) onNavigateToView('cases');
                }}
                className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-extrabold flex items-center gap-2 shadow transition cursor-pointer"
              >
                <span>Ir a Casos Reales</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
