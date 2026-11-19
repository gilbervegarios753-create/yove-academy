import React, { useState, useEffect } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { 
  Award, ShieldCheck, CheckCircle2, Search, QrCode, Download, Printer, Copy, Check,
  AlertTriangle, XCircle, RefreshCw, Filter, ShieldAlert, FileText, UserCheck, Plus, History
} from 'lucide-react';
import { FadeInOnScroll } from '../FadeInOnScroll';

interface VerifiedCertificateData {
  id: string;
  studentName: string;
  courseTitle: string;
  hours: string;
  level: string;
  issuedAt: string;
  certificateNumber: string;
  verificationCode: string;
  score: number;
  status: 'VALID' | 'REVOKED' | 'EXPIRED' | string;
  itemType?: string;
  revokedAt?: string | null;
  revokedReason?: string | null;
  verificationUrl?: string;
}

interface CertificatesViewProps {
  initialVerificationCode?: string;
}

export const CertificatesView: React.FC<CertificatesViewProps> = ({ initialVerificationCode }) => {
  const [activeTab, setActiveTab] = useState<'verify' | 'my' | 'admin'>('verify');
  const [searchCode, setSearchCode] = useState(initialVerificationCode || '');
  const [verifiedCert, setVerifiedCert] = useState<VerifiedCertificateData | null>(null);
  const [certHistory, setCertHistory] = useState<any[]>([]);
  const [searchAttempted, setSearchAttempted] = useState(false);
  const [loadingVerify, setLoadingVerify] = useState(false);
  const [verifyError, setVerifyError] = useState<string | null>(null);

  // My Certificates State
  const [myCertificates, setMyCertificates] = useState<VerifiedCertificateData[]>([]);
  const [loadingMyCerts, setLoadingMyCerts] = useState(false);

  // Admin / Revocation State
  const [isAdminMode, setIsAdminMode] = useState(false);
  const [adminCerts, setAdminCerts] = useState<VerifiedCertificateData[]>([]);
  const [adminSearch, setAdminSearch] = useState('');
  const [adminStatusFilter, setAdminStatusFilter] = useState('ALL');
  const [loadingAdmin, setLoadingAdmin] = useState(false);
  const [globalHistory, setGlobalHistory] = useState<any[]>([]);

  // Modals & Action States
  const [selectedCertForPrint, setSelectedCertForPrint] = useState<VerifiedCertificateData | null>(null);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  
  // Revocation Modal State
  const [revokeModalOpen, setRevokeModalOpen] = useState(false);
  const [targetCertToRevoke, setTargetCertToRevoke] = useState<VerifiedCertificateData | null>(null);
  const [revokeReason, setRevokeReason] = useState('');
  const [actionLoading, setActionLoading] = useState(false);

  // Revalidate Modal State
  const [revalidateModalOpen, setRevalidateModalOpen] = useState(false);
  const [targetCertToRevalidate, setTargetCertToRevalidate] = useState<VerifiedCertificateData | null>(null);
  const [revalidateNotes, setRevalidateNotes] = useState('');

  // Manual Emission Modal State
  const [issueModalOpen, setIssueModalOpen] = useState(false);
  const [newStudentName, setNewStudentName] = useState('');
  const [newCourseTitle, setNewCourseTitle] = useState('');
  const [newHours, setNewHours] = useState('45 Horas');
  const [newLevel, setNewLevel] = useState('Intermedio');
  const [newScore, setNewScore] = useState(100);

  // Initial Auto-Verification on mount if code provided in URL
  useEffect(() => {
    if (initialVerificationCode) {
      setSearchCode(initialVerificationCode);
      executeVerification(initialVerificationCode);
    }
    fetchMyCertificates();
    checkAdminRole();
  }, [initialVerificationCode]);

  const checkAdminRole = () => {
    fetch('/api/v1/auth/me')
      .then(res => res.json())
      .then(data => {
        if (data.success && data.user) {
          const role = data.user.role;
          if (role === 'ADMIN' || role === 'SUPER_ADMIN' || role === 'INSTRUCTOR') {
            setIsAdminMode(true);
          }
        }
      })
      .catch(() => setIsAdminMode(false));
  };

  const executeVerification = (codeToVerify: string) => {
    if (!codeToVerify.trim()) return;
    setLoadingVerify(true);
    setSearchAttempted(true);
    setVerifyError(null);
    setVerifiedCert(null);

    fetch(`/api/v1/certificates/verify/${encodeURIComponent(codeToVerify.trim())}`)
      .then(res => res.json())
      .then(data => {
        if (data.success && data.certificate) {
          setVerifiedCert(data.certificate);
          setCertHistory(data.history || []);
        } else {
          setVerifyError(data.error || 'Certificado no encontrado en los registros de la base de datos.');
        }
      })
      .catch(err => setVerifyError(`Error de conexión con el servidor: ${err.message}`))
      .finally(() => setLoadingVerify(false));
  };

  const handleVerifySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    executeVerification(searchCode);
  };

  const fetchMyCertificates = () => {
    setLoadingMyCerts(true);
    fetch('/api/v1/certificates/my')
      .then(res => res.json())
      .then(data => {
        if (data.success && Array.isArray(data.certificates)) {
          setMyCertificates(data.certificates);
        }
      })
      .catch(err => console.error(err))
      .finally(() => setLoadingMyCerts(false));
  };

  const fetchAdminCertificates = () => {
    setLoadingAdmin(true);
    fetch(`/api/v1/certificates/admin/list?search=${encodeURIComponent(adminSearch)}&status=${adminStatusFilter}`)
      .then(res => res.json())
      .then(data => {
        if (data.success && Array.isArray(data.certificates)) {
          setAdminCerts(data.certificates);
        }
      })
      .catch(err => console.error(err))
      .finally(() => setLoadingAdmin(false));

    fetch('/api/v1/certificates/admin/history')
      .then(res => res.json())
      .then(data => {
        if (data.success && Array.isArray(data.history)) {
          setGlobalHistory(data.history);
        }
      })
      .catch(err => console.error(err));
  };

  useEffect(() => {
    if (activeTab === 'admin') {
      fetchAdminCertificates();
    }
  }, [activeTab, adminStatusFilter, adminSearch]);

  const handleCopyLink = (code: string) => {
    const url = `${window.location.origin}/verify-certificate/${code}`;
    navigator.clipboard.writeText(url);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  // Revoke Action
  const handleExecuteRevoke = () => {
    if (!targetCertToRevoke || !revokeReason.trim()) {
      alert('Por favor especifica un motivo de revocación.');
      return;
    }
    setActionLoading(true);
    fetch('/api/v1/certificates/admin/revoke', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ certificateId: targetCertToRevoke.id, reason: revokeReason })
    })
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          alert('¡Certificado revocado exitosamente!');
          setRevokeModalOpen(false);
          setRevokeReason('');
          fetchAdminCertificates();
          if (verifiedCert && verifiedCert.id === targetCertToRevoke.id) {
            executeVerification(verifiedCert.verificationCode);
          }
        } else {
          alert(`Error: ${data.error}`);
        }
      })
      .catch(err => alert(`Error: ${err.message}`))
      .finally(() => setActionLoading(false));
  };

  // Revalidate Action
  const handleExecuteRevalidate = () => {
    if (!targetCertToRevalidate) return;
    setActionLoading(true);
    fetch('/api/v1/certificates/admin/revalidate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ certificateId: targetCertToRevalidate.id, notes: revalidateNotes })
    })
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          alert('¡Certificado revalidado exitosamente!');
          setRevalidateModalOpen(false);
          setRevalidateNotes('');
          fetchAdminCertificates();
          if (verifiedCert && verifiedCert.id === targetCertToRevalidate.id) {
            executeVerification(verifiedCert.verificationCode);
          }
        } else {
          alert(`Error: ${data.error}`);
        }
      })
      .catch(err => alert(`Error: ${err.message}`))
      .finally(() => setActionLoading(false));
  };

  // Manual Emission
  const handleExecuteIssue = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newStudentName || !newCourseTitle) {
      alert('Ingresa el nombre del estudiante y el título del curso.');
      return;
    }
    setActionLoading(true);
    fetch('/api/v1/certificates/admin/manual-issue', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        studentName: newStudentName,
        title: newCourseTitle,
        hours: newHours,
        level: newLevel,
        score: newScore
      })
    })
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          alert(`¡Certificado emitido con éxito! Código: ${data.certificate.verificationCode}`);
          setIssueModalOpen(false);
          setNewStudentName('');
          setNewCourseTitle('');
          fetchAdminCertificates();
        } else {
          alert(`Error: ${data.error}`);
        }
      })
      .catch(err => alert(`Error: ${err.message}`))
      .finally(() => setActionLoading(false));
  };

  return (
    <div className="py-12 bg-[#0a0e27] min-h-screen text-white pt-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        
        {/* Top Navigation Tabs */}
        <div className="flex items-center justify-between border-b border-white/10 pb-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-amber-500/20 text-amber-400 rounded-2xl border border-amber-500/30">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-black text-white">Sistema Criptográfico de Certificación</h1>
              <p className="text-xs text-gray-400">Verificación pública en base de datos en tiempo real y código QR oficial.</p>
            </div>
          </div>

          <div className="flex items-center gap-2 bg-slate-900 p-1.5 rounded-2xl border border-slate-800 text-xs font-bold">
            <button
              onClick={() => setActiveTab('verify')}
              className={`px-4 py-2 rounded-xl transition flex items-center gap-1.5 ${
                activeTab === 'verify' ? 'bg-[#ff6f00] text-white shadow-lg' : 'text-gray-400 hover:text-white'
              }`}
            >
              <Search className="w-3.5 h-3.5" />
              <span>Verificación Pública</span>
            </button>
            <button
              onClick={() => {
                setActiveTab('my');
                fetchMyCertificates();
              }}
              className={`px-4 py-2 rounded-xl transition flex items-center gap-1.5 ${
                activeTab === 'my' ? 'bg-[#ff6f00] text-white shadow-lg' : 'text-gray-400 hover:text-white'
              }`}
            >
              <Award className="w-3.5 h-3.5" />
              <span>Mis Certificados ({myCertificates.length})</span>
            </button>
            {isAdminMode && (
              <button
                onClick={() => setActiveTab('admin')}
                className={`px-4 py-2 rounded-xl transition flex items-center gap-1.5 ${
                  activeTab === 'admin' ? 'bg-purple-600 text-white shadow-lg' : 'text-purple-300 hover:text-white'
                }`}
              >
                <ShieldAlert className="w-3.5 h-3.5" />
                <span>Panel de Revocación / Admin</span>
              </button>
            )}
          </div>
        </div>

        {/* TAB 1: VERIFICACIÓN PÚBLICA */}
        {activeTab === 'verify' && (
          <div className="space-y-10">
            <FadeInOnScroll direction="up">
              <div className="max-w-xl mx-auto bg-white/5 p-6 sm:p-8 rounded-3xl border border-white/10 space-y-4 shadow-2xl backdrop-blur-md">
                <div className="text-center space-y-1">
                  <span className="text-[10px] font-black tracking-widest text-amber-400 uppercase">
                    CONSULTA DE BASE DE DATOS EN TIEMPO REAL
                  </span>
                  <h3 className="text-lg font-bold text-white flex items-center justify-center gap-2">
                    <Search className="w-5 h-5 text-[#ff9100]" />
                    Verificador de Autenticidad Online
                  </h3>
                  <p className="text-xs text-gray-400">
                    Ingresa el código único (ej. <code className="text-amber-300">YOVE-2026-8849</code> o <code className="text-amber-300">YV-CERT-8849</code>) para consultar el estado criptográfico.
                  </p>
                </div>

                <form onSubmit={handleVerifySubmit} className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Ej. YOVE-2026-8849"
                    value={searchCode}
                    onChange={(e) => setSearchCode(e.target.value)}
                    className="flex-1 px-4 py-3 rounded-2xl bg-black/60 border border-white/20 text-white placeholder-gray-500 text-sm focus:outline-none focus:border-[#ff6f00] font-mono font-bold"
                  />
                  <button
                    type="submit"
                    disabled={loadingVerify}
                    className="px-6 py-3 rounded-2xl bg-[#ff6f00] hover:bg-[#ff8f00] font-extrabold text-xs text-white transition shadow-lg shrink-0 cursor-pointer flex items-center gap-2"
                  >
                    {loadingVerify ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
                    <span>Validar DB</span>
                  </button>
                </form>

                {/* VERIFICATION RESULTS CARD */}
                {searchAttempted && (
                  <div className="pt-2 animate-in fade-in duration-300">
                    {loadingVerify ? (
                      <div className="p-6 text-center text-xs text-gray-400 space-y-2">
                        <RefreshCw className="w-5 h-5 animate-spin mx-auto text-amber-400" />
                        <span>Consultando base de datos segura de YOVE ACADEMY...</span>
                      </div>
                    ) : verifiedCert ? (
                      <div className={`p-6 rounded-3xl border space-y-4 text-center relative overflow-hidden shadow-2xl ${
                        verifiedCert.status === 'VALID' ? 'bg-emerald-950/60 border-emerald-500/50' :
                        verifiedCert.status === 'REVOKED' ? 'bg-rose-950/80 border-rose-500/80' :
                        'bg-amber-950/60 border-amber-500/50'
                      }`}>
                        {/* Status Badge Banner */}
                        <div className="flex justify-center">
                          {verifiedCert.status === 'VALID' ? (
                            <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-black border border-emerald-500/40">
                              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                              CERTIFICADO OFICIAL VÁLIDO EN BASE DE DATOS
                            </div>
                          ) : verifiedCert.status === 'REVOKED' ? (
                            <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-rose-500/20 text-rose-300 text-xs font-black border border-rose-500/60 animate-pulse">
                              <XCircle className="w-4 h-4 text-rose-400" />
                              ALERTA: CERTIFICADO REVOCADO POR LA ADMINISTRACIÓN
                            </div>
                          ) : (
                            <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-amber-500/20 text-amber-300 text-xs font-black border border-amber-500/40">
                              <AlertTriangle className="w-4 h-4 text-amber-400" />
                              ESTADO: {verifiedCert.status}
                            </div>
                          )}
                        </div>

                        {/* Title and Recipient */}
                        <div>
                          <span className="text-[10px] text-gray-400 uppercase tracking-widest block mb-1">
                            Acreditación de Programa Técnico
                          </span>
                          <h4 className="font-extrabold text-xl text-white">{verifiedCert.courseTitle}</h4>
                          <p className="text-xs text-gray-300 mt-2">
                            Otorgado oficialmente a: <strong className="text-amber-300 text-base block font-serif mt-0.5">{verifiedCert.studentName}</strong>
                          </p>
                        </div>

                        {/* Details grid */}
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px] bg-black/40 p-3 rounded-2xl border border-white/10 text-gray-300">
                          <div>
                            <span className="text-[9px] text-gray-500 block">HORAS</span>
                            <strong className="text-white">{verifiedCert.hours}</strong>
                          </div>
                          <div>
                            <span className="text-[9px] text-gray-500 block">NIVEL</span>
                            <strong className="text-white">{verifiedCert.level}</strong>
                          </div>
                          <div>
                            <span className="text-[9px] text-gray-500 block">PUNTUACIÓN</span>
                            <strong className="text-emerald-400">{verifiedCert.score}% Examen</strong>
                          </div>
                          <div>
                            <span className="text-[9px] text-gray-500 block">FECHA EMISIÓN</span>
                            <strong className="text-white">{new Date(verifiedCert.issuedAt).toLocaleDateString()}</strong>
                          </div>
                        </div>

                        {/* Revocation Warning Box if Revoked */}
                        {verifiedCert.status === 'REVOKED' && (
                          <div className="p-3.5 bg-rose-900/60 border border-rose-500/50 rounded-2xl text-left text-xs space-y-1 text-rose-200">
                            <strong className="text-rose-300 block flex items-center gap-1">
                              <AlertTriangle className="w-4 h-4 text-rose-400" />
                              Motivo de Revocación:
                            </strong>
                            <p className="text-[11px] text-rose-100">{verifiedCert.revokedReason || 'Revocado por decisión administrativa.'}</p>
                            {verifiedCert.revokedAt && (
                              <span className="text-[10px] text-rose-300/80 block pt-1">Fecha de Revocación: {new Date(verifiedCert.revokedAt).toLocaleString()}</span>
                            )}
                          </div>
                        )}

                        {/* Real QR Code Generator Section */}
                        <div className="p-4 bg-white text-slate-900 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4 border border-amber-500/40">
                          <div className="text-left space-y-1">
                            <span className="text-[10px] font-black text-amber-800 uppercase tracking-wider block">
                              CÓDIGO QR OFICIAL ESCANEABLE
                            </span>
                            <p className="text-[11px] text-slate-600 max-w-xs">
                              Escanea este código con cualquier cámara móvil para redirigir directamente a la URL oficial de verificación.
                            </p>
                            <div className="text-[11px] font-mono font-bold text-slate-800 pt-1">
                              Cod: {verifiedCert.verificationCode}
                            </div>
                          </div>

                          {/* Real Vector SVG QR */}
                          <div className="p-2.5 bg-white rounded-xl shadow-md border border-slate-200 shrink-0">
                            <QRCodeSVG
                              value={verifiedCert.verificationUrl || `${window.location.origin}/verify-certificate/${verifiedCert.verificationCode}`}
                              size={110}
                              level="H"
                              includeMargin={true}
                            />
                          </div>
                        </div>

                        {/* Audit History Log */}
                        {certHistory.length > 0 && (
                          <div className="p-3 bg-black/40 rounded-2xl text-left border border-white/10 space-y-2">
                            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider flex items-center gap-1">
                              <History className="w-3.5 h-3.5 text-amber-400" />
                              Historial de Trazabilidad en Base de Datos:
                            </span>
                            <div className="space-y-1.5 text-[11px] text-gray-300 pl-2 border-l-2 border-amber-500/30">
                              {certHistory.map((h, idx) => (
                                <div key={idx} className="flex items-start justify-between gap-2">
                                  <div>
                                    <span className={`font-bold px-1.5 py-0.5 rounded text-[9px] uppercase ${
                                      h.action === 'ISSUED' ? 'bg-emerald-900 text-emerald-300' :
                                      h.action === 'REVOKED' ? 'bg-rose-900 text-rose-300' :
                                      'bg-blue-900 text-blue-300'
                                    }`}>
                                      {h.action}
                                    </span>
                                    <span className="ml-2 font-medium">{h.notes}</span>
                                  </div>
                                  <span className="text-[10px] text-gray-500 shrink-0">{new Date(h.timestamp).toLocaleDateString()}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Action buttons */}
                        <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
                          <button
                            onClick={() => setSelectedCertForPrint(verifiedCert)}
                            className="px-5 py-2.5 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-xs font-extrabold text-white transition shadow-lg flex items-center gap-2 cursor-pointer"
                          >
                            <Printer className="w-4 h-4" />
                            <span>Imprimir / Exportar Documento PDF</span>
                          </button>

                          <button
                            onClick={() => handleCopyLink(verifiedCert.verificationCode)}
                            className="px-4 py-2.5 rounded-2xl bg-slate-800 hover:bg-slate-700 text-xs font-bold text-amber-300 transition border border-amber-500/30 flex items-center gap-1.5 cursor-pointer"
                          >
                            {copiedCode === verifiedCert.verificationCode ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                            <span>Copiar Enlace Directo</span>
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="p-5 rounded-2xl bg-rose-950/50 border border-rose-500/50 text-center space-y-2">
                        <AlertTriangle className="w-8 h-8 text-rose-400 mx-auto" />
                        <h4 className="text-sm font-bold text-white">Certificado No Encontrado</h4>
                        <p className="text-xs text-rose-200 max-w-md mx-auto">
                          {verifyError || 'No se encontró ningún registro que coincida con el código ingresado en la base de datos oficial.'}
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </FadeInOnScroll>
          </div>
        )}

        {/* TAB 2: MIS CERTIFICADOS (LOGGED IN STUDENT) */}
        {activeTab === 'my' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <Award className="w-5 h-5 text-[#ff6f00]" />
                Mis Acreditaciones Oficiales
              </h2>
            </div>

            {loadingMyCerts ? (
              <div className="p-10 text-center text-xs text-gray-400 flex items-center justify-center gap-2">
                <RefreshCw className="w-4 h-4 animate-spin text-amber-400" />
                <span>Cargando certificados emitidos...</span>
              </div>
            ) : myCertificates.length === 0 ? (
              <div className="p-12 border-2 border-dashed border-white/10 rounded-3xl text-center space-y-3 bg-white/5">
                <Award className="w-12 h-12 text-gray-500 mx-auto" />
                <h4 className="text-base font-bold text-white">Aún no cuentas con certificados emitidos en tu perfil</h4>
                <p className="text-xs text-gray-400 max-w-md mx-auto leading-relaxed">
                  Para obtener un certificado oficial debes completar el 100% de un curso técnico o ruta de aprendizaje y aprobar el examen teórico-práctico.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {myCertificates.map(cert => (
                  <div
                    key={cert.id}
                    className="bg-gradient-to-b from-[#0f173a] via-[#0a0e27] to-[#0f173a] p-6 sm:p-8 rounded-3xl border-2 border-amber-500/30 relative overflow-hidden shadow-2xl space-y-6 flex flex-col justify-between group hover:border-amber-400 transition-all"
                  >
                    <div className="flex items-center justify-between relative z-10">
                      <div className="flex items-center gap-2.5">
                        <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400">
                          <Award className="w-6 h-6" />
                        </div>
                        <div>
                          <span className="text-[10px] font-black text-amber-400 tracking-widest uppercase block">
                            YOVE ACADEMY // CERTIFIED
                          </span>
                          <h3 className="font-extrabold text-sm text-white">Acreditación Técnica Oficial</h3>
                        </div>
                      </div>

                      <button
                        onClick={() => handleCopyLink(cert.verificationCode)}
                        className="text-xs font-mono text-amber-300 font-bold bg-black/60 px-3 py-1.5 rounded-xl border border-amber-500/30 flex items-center gap-1.5 hover:bg-black/80 transition cursor-pointer"
                      >
                        {copiedCode === cert.verificationCode ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                        <span>{cert.verificationCode}</span>
                      </button>
                    </div>

                    <div className="text-center space-y-2 relative z-10 py-2">
                      <span className="text-[11px] text-gray-400 uppercase tracking-widest font-semibold block">
                        Se Acredita Oficialmente a:
                      </span>
                      <h4 className="text-2xl font-black text-amber-300 font-serif">
                        {cert.studentName}
                      </h4>
                      <p className="text-xs text-gray-300">
                        por cumplir los requisitos académicos y aprobar la evaluación diagnóstica del programa
                      </p>
                      <div className="text-lg font-extrabold text-white pt-1">
                        {cert.courseTitle}
                      </div>
                    </div>

                    {/* Footer with Real QR */}
                    <div className="flex items-center justify-between border-t border-amber-500/20 pt-4 relative z-10 text-xs">
                      <div className="space-y-0.5">
                        <div className="font-bold text-white">{cert.hours} Lectivas</div>
                        <div className="text-[10px] text-gray-400">Emisión: {new Date(cert.issuedAt).toLocaleDateString()}</div>
                        <span className={`inline-block text-[9px] font-extrabold uppercase px-2 py-0.5 rounded ${
                          cert.status === 'VALID' ? 'bg-emerald-900 text-emerald-300' : 'bg-rose-900 text-rose-300'
                        }`}>
                          {cert.status}
                        </span>
                      </div>

                      <div className="flex items-center gap-3">
                        <div className="p-1.5 bg-white rounded-xl shadow border border-slate-200">
                          <QRCodeSVG
                            value={cert.verificationUrl || `${window.location.origin}/verify-certificate/${cert.verificationCode}`}
                            size={70}
                            level="H"
                          />
                        </div>

                        <button
                          onClick={() => setSelectedCertForPrint(cert)}
                          className="p-3 rounded-xl bg-[#ff6f00] hover:bg-[#ff8f00] text-white shadow-lg transition cursor-pointer"
                          title="Ver / Imprimir PDF"
                        >
                          <Printer className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 3: ADMIN & REVOCATION PANEL */}
        {activeTab === 'admin' && isAdminMode && (
          <div className="space-y-8 bg-slate-900/90 p-6 sm:p-8 rounded-3xl border border-purple-500/30">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
              <div>
                <h3 className="text-lg font-extrabold text-white flex items-center gap-2">
                  <ShieldAlert className="w-5 h-5 text-purple-400" />
                  Panel de Administración y Revocación de Certificados
                </h3>
                <p className="text-xs text-slate-400">Emisión manual, revocar o revalidar certificados con auditoría en BD.</p>
              </div>

              <button
                onClick={() => setIssueModalOpen(true)}
                className="px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs rounded-xl shadow-md transition flex items-center gap-1.5"
              >
                <Plus className="w-4 h-4" />
                <span>Emitir Certificado Manual</span>
              </button>
            </div>

            {/* Filter controls */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="w-full sm:w-72 relative">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="text"
                  placeholder="Buscar alumno, curso o código..."
                  value={adminSearch}
                  onChange={e => setAdminSearch(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-500"
                />
              </div>

              <div className="flex items-center gap-2 text-xs font-bold">
                <span className="text-slate-400">Estado:</span>
                {['ALL', 'VALID', 'REVOKED'].map(st => (
                  <button
                    key={st}
                    onClick={() => setAdminStatusFilter(st)}
                    className={`px-3 py-1.5 rounded-lg uppercase tracking-wider text-[10px] transition ${
                      adminStatusFilter === st ? 'bg-purple-600 text-white' : 'bg-slate-800 text-slate-400 hover:text-white'
                    }`}
                  >
                    {st === 'ALL' ? 'Todos' : st === 'VALID' ? 'Válidos' : 'Revocados'}
                  </button>
                ))}
              </div>
            </div>

            {/* Certificates Table */}
            <div className="overflow-x-auto border border-slate-800 rounded-2xl">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-slate-800/80 text-slate-300 font-bold uppercase tracking-wider border-b border-slate-700">
                    <th className="p-3">Estudiante</th>
                    <th className="p-3">Programa / Curso</th>
                    <th className="p-3">Código Criptográfico</th>
                    <th className="p-3">Emisión</th>
                    <th className="p-3">Estado</th>
                    <th className="p-3 text-right">Acciones Admin</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800 text-slate-200">
                  {loadingAdmin ? (
                    <tr>
                      <td colSpan={6} className="p-6 text-center text-slate-500">Cargando registros...</td>
                    </tr>
                  ) : adminCerts.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="p-6 text-center text-slate-500">No se encontraron certificados en este filtro.</td>
                    </tr>
                  ) : (
                    adminCerts.map(c => (
                      <tr key={c.id} className="hover:bg-slate-800/50">
                        <td className="p-3 font-bold text-white">{c.studentName}</td>
                        <td className="p-3">{c.courseTitle}</td>
                        <td className="p-3 font-mono font-bold text-amber-400">{c.verificationCode}</td>
                        <td className="p-3 text-slate-400">{new Date(c.issuedAt).toLocaleDateString()}</td>
                        <td className="p-3">
                          <span className={`px-2 py-0.5 rounded font-black text-[10px] uppercase ${
                            c.status === 'VALID' ? 'bg-emerald-950 text-emerald-400 border border-emerald-500/40' :
                            'bg-rose-950 text-rose-400 border border-rose-500/40'
                          }`}>
                            {c.status}
                          </span>
                        </td>
                        <td className="p-3 text-right">
                          {c.status === 'VALID' ? (
                            <button
                              onClick={() => {
                                setTargetCertToRevoke(c);
                                setRevokeModalOpen(true);
                              }}
                              className="px-2.5 py-1 bg-rose-900/60 hover:bg-rose-800 text-rose-200 rounded-lg text-[11px] font-bold transition border border-rose-500/30"
                            >
                              Revocar
                            </button>
                          ) : (
                            <button
                              onClick={() => {
                                setTargetCertToRevalidate(c);
                                setRevalidateModalOpen(true);
                              }}
                              className="px-2.5 py-1 bg-emerald-900/60 hover:bg-emerald-800 text-emerald-200 rounded-lg text-[11px] font-bold transition border border-emerald-500/30"
                            >
                              Revalidar
                            </button>
                          )}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* Audit History Log */}
            <div className="space-y-3 pt-4 border-t border-slate-800">
              <h4 className="text-xs font-bold text-purple-300 uppercase tracking-wider flex items-center gap-1.5">
                <History className="w-4 h-4" />
                Historial de Trazabilidad y Auditoría en Base de Datos ({globalHistory.length})
              </h4>
              <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 max-h-60 overflow-y-auto space-y-2 text-xs">
                {globalHistory.map((h, i) => (
                  <div key={i} className="p-2 bg-slate-900 rounded-xl border border-slate-800 flex items-center justify-between">
                    <div>
                      <span className={`font-black px-2 py-0.5 rounded text-[9px] uppercase ${
                        h.action === 'ISSUED' ? 'bg-emerald-900 text-emerald-300' :
                        h.action === 'REVOKED' ? 'bg-rose-900 text-rose-300' :
                        'bg-blue-900 text-blue-300'
                      }`}>
                        {h.action}
                      </span>
                      <strong className="ml-2 text-white">{h.courseOrPathTitle}</strong>
                      <span className="ml-2 text-slate-400">por {h.performedByName}</span>
                    </div>
                    <div className="text-[10px] text-slate-500 font-mono">{new Date(h.timestamp).toLocaleString()}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

      </div>

      {/* REVOKE MODAL */}
      {revokeModalOpen && targetCertToRevoke && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-rose-500/50 p-6 rounded-3xl max-w-md w-full space-y-4 text-white shadow-2xl">
            <div className="flex items-center gap-3 text-rose-400">
              <AlertTriangle className="w-6 h-6" />
              <h3 className="text-base font-extrabold text-white">Revocar Certificado</h3>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              Estás a punto de revocar el certificado <code className="text-amber-300">{targetCertToRevoke.verificationCode}</code> perteneciente a <strong>{targetCertToRevoke.studentName}</strong>.
            </p>
            <div>
              <label className="text-xs font-bold text-slate-400 block mb-1">Motivo Obligatorio de Revocación *</label>
              <textarea
                rows={3}
                value={revokeReason}
                onChange={e => setRevokeReason(e.target.value)}
                placeholder="Ej. Incumplimiento de código de ética o alteración de calificaciones."
                className="w-full p-3 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-rose-500"
              />
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setRevokeModalOpen(false)}
                className="px-4 py-2 bg-slate-800 text-slate-300 rounded-xl font-bold text-xs"
              >
                Cancelar
              </button>
              <button
                onClick={handleExecuteRevoke}
                disabled={actionLoading}
                className="px-5 py-2 bg-rose-600 hover:bg-rose-500 text-white rounded-xl font-extrabold text-xs shadow-lg"
              >
                Confirmar Revocación
              </button>
            </div>
          </div>
        </div>
      )}

      {/* REVALIDATE MODAL */}
      {revalidateModalOpen && targetCertToRevalidate && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-emerald-500/50 p-6 rounded-3xl max-w-md w-full space-y-4 text-white shadow-2xl">
            <div className="flex items-center gap-3 text-emerald-400">
              <CheckCircle2 className="w-6 h-6" />
              <h3 className="text-base font-extrabold text-white">Revalidar Certificado</h3>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              Restablecerás el estado a <strong>VÁLIDO</strong> para el certificado <code className="text-amber-300">{targetCertToRevalidate.verificationCode}</code> de {targetCertToRevalidate.studentName}.
            </p>
            <div>
              <label className="text-xs font-bold text-slate-400 block mb-1">Notas de Revalidación (Opcional)</label>
              <input
                type="text"
                value={revalidateNotes}
                onChange={e => setRevalidateNotes(e.target.value)}
                placeholder="Ej. Corrección de datos y verificación de cumplimiento."
                className="w-full p-3 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white"
              />
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setRevalidateModalOpen(false)}
                className="px-4 py-2 bg-slate-800 text-slate-300 rounded-xl font-bold text-xs"
              >
                Cancelar
              </button>
              <button
                onClick={handleExecuteRevalidate}
                disabled={actionLoading}
                className="px-5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-extrabold text-xs shadow-lg"
              >
                Confirmar Revalidación
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MANUAL EMISSION MODAL */}
      {issueModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <form onSubmit={handleExecuteIssue} className="bg-slate-900 border border-purple-500/50 p-6 rounded-3xl max-w-lg w-full space-y-4 text-white shadow-2xl">
            <h3 className="text-base font-extrabold text-white">Emisión Manual de Certificado (Admin)</h3>
            
            <div className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-slate-300 block mb-1">Nombre Completo del Estudiante *</label>
                <input
                  type="text"
                  required
                  value={newStudentName}
                  onChange={e => setNewStudentName(e.target.value)}
                  placeholder="Ej. Ing. Carlos Manuel Mendoza"
                  className="w-full p-2.5 bg-slate-950 border border-slate-700 rounded-xl text-white"
                />
              </div>

              <div>
                <label className="font-bold text-slate-300 block mb-1">Título del Programa / Curso *</label>
                <input
                  type="text"
                  required
                  value={newCourseTitle}
                  onChange={e => setNewCourseTitle(e.target.value)}
                  placeholder="Ej. Máster en Osciloscopio y Diagnóstico CAN Bus"
                  className="w-full p-2.5 bg-slate-950 border border-slate-700 rounded-xl text-white"
                />
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="font-bold text-slate-300 block mb-1">Horas</label>
                  <input
                    type="text"
                    value={newHours}
                    onChange={e => setNewHours(e.target.value)}
                    className="w-full p-2.5 bg-slate-950 border border-slate-700 rounded-xl text-white"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-300 block mb-1">Nivel</label>
                  <select
                    value={newLevel}
                    onChange={e => setNewLevel(e.target.value)}
                    className="w-full p-2.5 bg-slate-950 border border-slate-700 rounded-xl text-white font-bold"
                  >
                    <option value="Inicial">Inicial</option>
                    <option value="Intermedio">Intermedio</option>
                    <option value="Avanzado">Avanzado</option>
                    <option value="Experto">Experto</option>
                  </select>
                </div>
                <div>
                  <label className="font-bold text-slate-300 block mb-1">Puntuación %</label>
                  <input
                    type="number"
                    value={newScore}
                    onChange={e => setNewScore(Number(e.target.value))}
                    className="w-full p-2.5 bg-slate-950 border border-slate-700 rounded-xl text-white"
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-slate-800">
              <button
                type="button"
                onClick={() => setIssueModalOpen(false)}
                className="px-4 py-2 bg-slate-800 text-slate-300 rounded-xl font-bold text-xs"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={actionLoading}
                className="px-5 py-2 bg-purple-600 hover:bg-purple-500 text-white rounded-xl font-extrabold text-xs shadow-lg"
              >
                Emitir y Registrar en BD
              </button>
            </div>
          </form>
        </div>
      )}

      {/* PRINT PREVIEW MODAL */}
      {selectedCertForPrint && (
        <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-white text-black p-8 sm:p-12 rounded-3xl max-w-3xl w-full space-y-6 shadow-2xl relative border-8 border-amber-600">
            
            <div className="text-center space-y-2">
              <div className="text-xs font-black tracking-widest text-amber-700 uppercase">
                ACADEMIA DE EDUCACIÓN Y DIAGNÓSTICO AUTOMOTRIZ YOVE
              </div>
              <h1 className="text-3xl sm:text-4xl font-serif font-black text-slate-900 uppercase tracking-tight">
                Certificado de Acreditación Técnica
              </h1>
              <p className="text-xs text-slate-600 italic">
                Sello de Excelencia en Mecatrónica & Diagnóstico Electrónico
              </p>
            </div>

            <div className="text-center space-y-3 py-6 border-y-2 border-amber-600/30">
              <p className="text-xs text-slate-700 uppercase tracking-widest font-semibold">
                Se otorga la presente acreditación oficial a:
              </p>
              <h2 className="text-3xl sm:text-4xl font-serif font-bold text-amber-900">
                {selectedCertForPrint.studentName}
              </h2>
              <p className="text-xs text-slate-600 max-w-lg mx-auto">
                por cumplir los requisitos teóricos y prácticos y superar el examen de suficiencia diagnóstica del programa:
              </p>
              <div className="text-xl sm:text-2xl font-extrabold text-slate-900 font-sans">
                {selectedCertForPrint.courseTitle}
              </div>
            </div>

            <div className="flex items-center justify-between text-xs text-slate-800 font-sans pt-2">
              <div className="space-y-1">
                <p><strong>Duración:</strong> {selectedCertForPrint.hours}</p>
                <p><strong>Nivel Acreditado:</strong> {selectedCertForPrint.level}</p>
                <p><strong>Fecha de Emisión:</strong> {new Date(selectedCertForPrint.issuedAt).toLocaleDateString()}</p>
                <p><strong>Número de Certificado:</strong> <code className="font-mono font-bold text-amber-900">{selectedCertForPrint.certificateNumber}</code></p>
                <p><strong>Código de Verificación:</strong> <code className="font-mono font-bold text-slate-900">{selectedCertForPrint.verificationCode}</code></p>
              </div>

              {/* Real Scannable Vector QR */}
              <div className="text-center flex flex-col items-center">
                <div className="p-2 bg-white rounded-xl border-2 border-amber-600 shadow-md">
                  <QRCodeSVG
                    value={selectedCertForPrint.verificationUrl || `${window.location.origin}/verify-certificate/${selectedCertForPrint.verificationCode}`}
                    size={95}
                    level="H"
                  />
                </div>
                <span className="text-[9px] font-black text-amber-900 uppercase mt-1">
                  Escanea para validar
                </span>
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-slate-200 print:hidden">
              <button
                onClick={() => setSelectedCertForPrint(null)}
                className="px-5 py-2.5 rounded-xl bg-slate-200 text-slate-800 text-xs font-bold hover:bg-slate-300 transition cursor-pointer"
              >
                Cerrar
              </button>
              <button
                onClick={() => window.print()}
                className="px-6 py-2.5 rounded-xl bg-[#ff6f00] text-white text-xs font-bold hover:bg-[#ff8f00] transition shadow-lg cursor-pointer flex items-center gap-2"
              >
                <Printer className="w-4 h-4" />
                <span>Imprimir / Exportar Documento PDF</span>
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
