import React, { useState, useEffect } from 'react';
import { ShieldAlert, AlertTriangle, CheckCircle, Search, Shield, Zap, RefreshCw, X, ShieldCheck, Activity } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { ViewMode } from '../../types';

interface YoveShieldViewProps {
  onNavigateToView?: (view: ViewMode) => void;
}

interface SecurityEvent {
  id: string;
  event_type: string;
  severity: 'INFO' | 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  user_id: string | null;
  ip_address: string;
  details_json: string;
  created_at: string;
}

interface SecurityStats {
  riskScore: number;
  threatLevel: string;
  activeAlerts: number;
  failedLogins: number;
  totalEvents: number;
}

export const YoveShieldView: React.FC<YoveShieldViewProps> = ({ onNavigateToView }) => {
  const { user, token } = useAuth();
  const [stats, setStats] = useState<SecurityStats | null>(null);
  const [events, setEvents] = useState<SecurityEvent[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [copilotPrompt, setCopilotPrompt] = useState('');
  const [copilotResponse, setCopilotResponse] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<SecurityEvent | null>(null);

  useEffect(() => {
    fetchShieldData();
  }, []);

  const fetchShieldData = async () => {
    setLoading(true);
    try {
      const headers = { Authorization: `Bearer ${token}` };
      const [statsRes, eventsRes] = await Promise.all([
        fetch('/api/v1/shield/stats', { headers }),
        fetch('/api/v1/shield/events', { headers })
      ]);
      
      const statsData = await statsRes.json();
      const eventsData = await eventsRes.json();
      
      if (statsData.success) setStats(statsData.stats);
      if (eventsData.success) setEvents(eventsData.events);
    } catch (err) {
      console.error("Failed to load YOVE SHIELD data", err);
    } finally {
      setLoading(false);
    }
  };

  const askCopilot = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!copilotPrompt.trim()) return;

    setIsAnalyzing(true);
    try {
      const response = await fetch('/api/v1/shield/copilot', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          prompt: copilotPrompt,
          eventContext: selectedEvent ? JSON.parse(selectedEvent.details_json) : null
        })
      });
      const data = await response.json();
      if (data.success) {
        setCopilotResponse(data.analysis);
      } else {
        setCopilotResponse('Error al consultar al copilot.');
      }
    } catch (err) {
      setCopilotResponse('Fallo de red al conectar con YOVE DEFENSE AI.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const getThreatLevelColor = (level: string) => {
    switch (level) {
      case 'CRITICAL': return 'text-red-500 bg-red-500/10 border-red-500/50';
      case 'HIGH': return 'text-orange-500 bg-orange-500/10 border-orange-500/50';
      case 'MEDIUM': return 'text-yellow-500 bg-yellow-500/10 border-yellow-500/50';
      case 'LOW': return 'text-green-500 bg-green-500/10 border-green-500/50';
      default: return 'text-blue-500 bg-blue-500/10 border-blue-500/50';
    }
  };

  return (
    <div className="pt-24 min-h-screen bg-[#0a0e27] text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-gradient-to-r from-red-900/20 to-blue-900/20 p-6 rounded-2xl border border-red-900/30 shadow-2xl">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-red-500/20 flex items-center justify-center border border-red-500/50">
              <ShieldAlert className="w-6 h-6 text-red-500" />
            </div>
            <div>
              <h1 className="text-2xl font-black tracking-tight text-white flex items-center gap-2">
                YOVE SHIELD <span className="text-red-500">AI</span>
              </h1>
              <p className="text-sm text-gray-400">Plataforma de Ciberseguridad Defensiva y Zero Trust</p>
            </div>
          </div>
          <button 
            onClick={fetchShieldData}
            disabled={loading}
            className="px-4 py-2 bg-white/5 border border-white/10 rounded-lg hover:bg-white/10 transition flex items-center gap-2 text-xs font-bold"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            Actualizar Dashboard
          </button>
        </div>

        {loading && !stats ? (
          <div className="h-64 flex items-center justify-center">
            <RefreshCw className="w-8 h-8 text-red-500 animate-spin" />
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Left Column: Stats & Copilot */}
            <div className="space-y-6">
              <div className="bg-black/40 border border-white/10 rounded-2xl p-6">
                <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-4 flex items-center gap-2">
                  <Activity className="w-4 h-4" /> Score de Riesgo
                </h3>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-5xl font-black text-white">{stats?.riskScore}</span>
                  <span className={`px-3 py-1 rounded-full text-xs font-bold border ${getThreatLevelColor(stats?.threatLevel || 'LOW')}`}>
                    {stats?.threatLevel} THREAT
                  </span>
                </div>
                <div className="w-full bg-gray-800 rounded-full h-2 mt-4 overflow-hidden">
                  <div 
                    className={`h-full ${stats?.riskScore! > 50 ? 'bg-red-500' : 'bg-green-500'}`} 
                    style={{ width: `${stats?.riskScore}%` }}
                  ></div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-black/40 border border-white/10 rounded-2xl p-5">
                  <div className="text-gray-400 text-xs font-bold mb-1">Alertas Activas</div>
                  <div className="text-2xl font-black text-red-400">{stats?.activeAlerts}</div>
                </div>
                <div className="bg-black/40 border border-white/10 rounded-2xl p-5">
                  <div className="text-gray-400 text-xs font-bold mb-1">Fallos Login</div>
                  <div className="text-2xl font-black text-orange-400">{stats?.failedLogins}</div>
                </div>
              </div>

              {/* Security Copilot */}
              <div className="bg-gradient-to-b from-blue-900/20 to-black/40 border border-blue-500/20 rounded-2xl p-6 relative overflow-hidden">
                <div className="absolute top-0 right-0 p-4 opacity-10">
                  <ShieldCheck className="w-24 h-24 text-blue-500" />
                </div>
                <h3 className="text-sm font-bold text-blue-400 mb-4 flex items-center gap-2 relative z-10">
                  <Zap className="w-4 h-4" /> YOVE Security Copilot
                </h3>
                
                {selectedEvent && (
                  <div className="mb-4 p-3 bg-blue-950/50 border border-blue-900 rounded-lg flex items-center justify-between relative z-10">
                    <div className="text-xs text-gray-300 truncate">
                      <span className="font-bold text-white">Analizando evento:</span> {selectedEvent.event_type}
                    </div>
                    <button onClick={() => setSelectedEvent(null)}><X className="w-3 h-3 text-gray-400" /></button>
                  </div>
                )}

                <form onSubmit={askCopilot} className="relative z-10 mb-4">
                  <textarea
                    value={copilotPrompt}
                    onChange={(e) => setCopilotPrompt(e.target.value)}
                    placeholder="Pregunta a la IA sobre amenazas o pega un log..."
                    className="w-full bg-black/60 border border-white/10 rounded-xl p-3 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 min-h-[80px]"
                  />
                  <button 
                    type="submit" 
                    disabled={isAnalyzing || !copilotPrompt.trim()}
                    className="w-full mt-2 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-lg transition disabled:opacity-50"
                  >
                    {isAnalyzing ? 'Analizando...' : 'Analizar Amenaza'}
                  </button>
                </form>

                {copilotResponse && (
                  <div className="mt-4 p-4 bg-black/50 border border-white/5 rounded-xl relative z-10 max-h-60 overflow-y-auto">
                    <div className="text-xs text-gray-300 whitespace-pre-wrap">{copilotResponse}</div>
                  </div>
                )}
              </div>
            </div>

            {/* Right Column: Events Log */}
            <div className="lg:col-span-2 bg-black/40 border border-white/10 rounded-2xl p-6 flex flex-col h-[800px]">
              <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-4 flex items-center gap-2">
                <Search className="w-4 h-4" /> Auditoría de Eventos
              </h3>
              
              <div className="flex-1 overflow-y-auto pr-2 space-y-3">
                {events.length === 0 ? (
                  <div className="h-full flex items-center justify-center text-gray-500 text-sm">
                    No hay eventos de seguridad registrados.
                  </div>
                ) : (
                  events.map(ev => (
                    <div 
                      key={ev.id} 
                      className={`p-4 rounded-xl border transition cursor-pointer ${selectedEvent?.id === ev.id ? 'bg-white/10 border-blue-500' : 'bg-black/40 border-white/5 hover:bg-white/5'}`}
                      onClick={() => {
                        setSelectedEvent(ev);
                        setCopilotPrompt(`Por favor, analiza este evento de tipo ${ev.event_type} (${ev.severity}). ¿Qué acciones preventivas recomiendas?`);
                      }}
                    >
                      <div className="flex justify-between items-start mb-2">
                        <div className="flex items-center gap-2">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-black border ${getThreatLevelColor(ev.severity)}`}>
                            {ev.severity}
                          </span>
                          <span className="font-bold text-sm text-gray-200">{ev.event_type}</span>
                        </div>
                        <span className="text-[10px] text-gray-500">
                          {new Date(ev.created_at).toLocaleString()}
                        </span>
                      </div>
                      <div className="text-xs text-gray-400 font-mono bg-black/50 p-2 rounded border border-white/5 overflow-hidden text-ellipsis">
                        IP: {ev.ip_address} | User: {ev.user_id || 'Anónimo'} <br />
                        {ev.details_json}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

          </div>
        )}
      </div>
    </div>
  );
};
