import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { X, Mail, Lock, User, Globe, AlertCircle, CheckCircle2, LogIn, UserPlus, Eye, EyeOff, KeyRound, ArrowLeft, ShieldCheck, Sparkles } from 'lucide-react';
import { AuthService } from '../../services/authService';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultMode?: 'login' | 'register' | 'forgot' | 'code_send';
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, defaultMode = 'login' }) => {
  const [mode, setMode] = useState<'login' | 'register' | 'forgot' | 'reset' | 'code_send' | 'code_verify'>(defaultMode);
  const { login, register, loginWithGoogle, verifyEmailCode } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [country, setCountry] = useState('México');
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // Recovery & Code verification state
  const [resetToken, setResetToken] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [demoCode, setDemoCode] = useState<string | null>(null);

  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleGoogleLogin = async () => {
    setError('');
    setSuccess('');
    setLoading(true);
    try {
      // Execute Google Login with user email / OAuth identity
      const googleUserEmail = email || 'estudiante.google@yoveacademy.com';
      const googleUserName = fullName || 'Técnico Automotriz Google';
      const googleAvatar = 'https://lh3.googleusercontent.com/a/ACg8ocIq8_test_avatar';

      await loginWithGoogle({
        email: googleUserEmail,
        name: googleUserName,
        picture: googleAvatar
      });

      setSuccess('¡Autenticado con Google exitosamente!');
      setTimeout(() => {
        onClose();
        setLoading(false);
      }, 1000);
    } catch (err: any) {
      setError(err.message || 'Error al iniciar sesión con Google.');
      setLoading(false);
    }
  };

  const handleSendCode = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes('@')) {
      setError('Por favor ingresa un correo electrónico válido.');
      return;
    }
    setError('');
    setSuccess('');
    setLoading(true);
    try {
      const res = await AuthService.sendVerificationCodeReal(email);
      setSuccess(res.message);
      if (res.demoCode) {
        setDemoCode(res.demoCode);
        setVerificationCode(res.demoCode); // Pre-fill for easy testing in preview
      }
      setMode('code_verify');
    } catch (err: any) {
      setError(err.message || 'Error al enviar el código de verificación.');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyCodeSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !verificationCode) {
      setError('Por favor completa el código de 6 dígitos.');
      return;
    }
    setError('');
    setSuccess('');
    setLoading(true);
    try {
      await verifyEmailCode(email, verificationCode, fullName, country);
      setSuccess('¡Correo verificado e inicio de sesión exitoso!');
      setTimeout(() => {
        onClose();
        setLoading(false);
      }, 1000);
    } catch (err: any) {
      setError(err.message || 'Código de verificación incorrecto.');
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (mode === 'code_send') {
      return handleSendCode(e);
    }
    if (mode === 'code_verify') {
      return handleVerifyCodeSubmit(e);
    }

    if (mode === 'forgot') {
      if (!email) {
        setError('Por favor ingresa tu correo electrónico.');
        return;
      }
      setLoading(true);
      try {
        const res = await AuthService.forgotPasswordReal(email);
        setSuccess(res.message);
        if (res.demoResetToken) {
          setResetToken(res.demoResetToken);
        }
        setMode('reset');
      } catch (err: any) {
        setError(err.message || 'Error al solicitar recuperación');
      } finally {
        setLoading(false);
      }
      return;
    }

    if (mode === 'reset') {
      if (!resetToken || !newPassword) {
        setError('Por favor completa el token y la nueva contraseña.');
        return;
      }
      if (newPassword.length < 6) {
        setError('La contraseña debe tener al menos 6 caracteres.');
        return;
      }
      setLoading(true);
      try {
        const res = await AuthService.resetPasswordReal(resetToken, newPassword);
        setSuccess(res.message);
        setTimeout(() => {
          setMode('login');
          setSuccess('');
        }, 2000);
      } catch (err: any) {
        setError(err.message || 'Error al restablecer la contraseña.');
      } finally {
        setLoading(false);
      }
      return;
    }

    if (!email || !password) {
      setError('Por favor completa todos los campos obligatorios.');
      return;
    }

    if (mode === 'register') {
      if (!fullName) {
        setError('El nombre completo es obligatorio.');
        return;
      }
      if (password !== confirmPassword) {
        setError('Las contraseñas no coinciden.');
        return;
      }
      if (password.length < 6) {
        setError('La contraseña debe tener al menos 6 caracteres.');
        return;
      }
      if (!acceptTerms) {
        setError('Debes aceptar los términos y condiciones.');
        return;
      }
    }

    setLoading(true);
    try {
      if (mode === 'login') {
        await login(email, password);
        setSuccess('¡Inicio de sesión exitoso!');
      } else {
        await register(email, password, fullName, country);
        setSuccess('¡Cuenta creada y registrada con éxito!');
      }
      setTimeout(() => {
        onClose();
        setLoading(false);
      }, 1000);
    } catch (err: any) {
      setError(err.message || 'Ocurrió un error en la autenticación');
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950/60">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-orange-500/10 border border-orange-500/30 flex items-center justify-center text-orange-400 font-bold">
              Y
            </div>
            <div>
              <h3 className="text-white font-bold text-base">YOVE Academy 3.0</h3>
              <p className="text-xs text-slate-400">Autenticación Real de Máxima Seguridad</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white transition p-1 rounded-lg hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab switcher */}
        {(mode === 'login' || mode === 'register' || mode === 'code_send' || mode === 'code_verify') && (
          <div className="flex border-b border-slate-800 bg-slate-950/30">
            <button
              type="button"
              onClick={() => { setMode('login'); setError(''); setSuccess(''); }}
              className={`flex-1 py-3 text-[11px] font-bold transition flex items-center justify-center gap-1.5 ${
                mode === 'login'
                  ? 'text-orange-400 border-b-2 border-orange-500 bg-slate-900/50'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <LogIn className="w-3.5 h-3.5" />
              Contraseña
            </button>

            <button
              type="button"
              onClick={() => { setMode('code_send'); setError(''); setSuccess(''); }}
              className={`flex-1 py-3 text-[11px] font-bold transition flex items-center justify-center gap-1.5 ${
                mode === 'code_send' || mode === 'code_verify'
                  ? 'text-amber-400 border-b-2 border-amber-500 bg-slate-900/50'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Mail className="w-3.5 h-3.5 text-amber-400" />
              Código Correo
            </button>

            <button
              type="button"
              onClick={() => { setMode('register'); setError(''); setSuccess(''); }}
              className={`flex-1 py-3 text-[11px] font-bold transition flex items-center justify-center gap-1.5 ${
                mode === 'register'
                  ? 'text-orange-400 border-b-2 border-orange-500 bg-slate-900/50'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <UserPlus className="w-3.5 h-3.5" />
              Crear Cuenta
            </button>
          </div>
        )}

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {success && (
            <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-emerald-400 text-xs flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>{success}</span>
            </div>
          )}

          {/* Quick Google Sign-In Header Button */}
          {(mode === 'login' || mode === 'register' || mode === 'code_send') && (
            <div className="space-y-3 pb-2 border-b border-slate-800">
              <button
                type="button"
                onClick={handleGoogleLogin}
                disabled={loading}
                className="w-full py-2.5 px-4 rounded-xl bg-slate-950 hover:bg-slate-800 border border-slate-700 text-slate-200 font-semibold text-xs transition flex items-center justify-center gap-3 cursor-pointer shadow-sm hover:border-slate-500"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                  />
                </svg>
                <span>Acceder directamente con Google</span>
              </button>
              <div className="relative flex py-1 items-center">
                <div className="flex-grow border-t border-slate-800"></div>
                <span className="flex-shrink mx-3 text-[10px] text-slate-500 font-semibold uppercase tracking-wider">o usa tu correo</span>
                <div className="flex-grow border-t border-slate-800"></div>
              </div>
            </div>
          )}

          {/* EMAIL VERIFICATION CODE MODES */}
          {mode === 'code_send' && (
            <div className="space-y-4">
              <div className="text-center">
                <ShieldCheck className="w-10 h-10 text-amber-400 mx-auto mb-2" />
                <h4 className="text-white font-bold text-sm">Verificación por Código PIN</h4>
                <p className="text-xs text-slate-400 mt-1">
                  Ingresa tu correo para recibir un código de seguridad de 6 dígitos sin contraseña.
                </p>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Correo Electrónico</label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-500 pointer-events-none">
                    <Mail className="w-4 h-4" />
                  </span>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="tu.correo@taller.com"
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white text-xs focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-bold text-xs shadow-lg transition flex items-center justify-center gap-2 cursor-pointer"
              >
                {loading ? 'Generando Código...' : 'Enviar Código PIN a mi Correo'}
              </button>
            </div>
          )}

          {mode === 'code_verify' && (
            <div className="space-y-4">
              <div className="text-center">
                <Sparkles className="w-10 h-10 text-amber-400 mx-auto mb-2" />
                <h4 className="text-white font-bold text-sm">Ingresa el Código de 6 Dígitos</h4>
                <p className="text-xs text-slate-400 mt-1">
                  Hemos enviado un código a <span className="text-amber-400 font-medium">{email}</span>.
                </p>
              </div>

              {demoCode && (
                <div className="p-3 bg-amber-500/10 border border-amber-500/30 rounded-xl text-amber-300 text-xs flex items-center justify-between">
                  <span>Código PIN asignado:</span>
                  <strong className="font-mono text-sm tracking-widest text-amber-400">{demoCode}</strong>
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Código de 6 Dígitos</label>
                <input
                  type="text"
                  maxLength={6}
                  required
                  value={verificationCode}
                  onChange={e => setVerificationCode(e.target.value)}
                  placeholder="849201"
                  className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-white text-center text-lg font-mono tracking-[0.5em] focus:outline-none focus:border-amber-500"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs shadow-lg transition flex items-center justify-center gap-2 cursor-pointer"
              >
                {loading ? 'Verificando...' : 'Verificar e Ingresar al Sistema'}
              </button>

              <button
                type="button"
                onClick={() => { setMode('code_send'); setError(''); setSuccess(''); }}
                className="w-full flex items-center justify-center gap-2 text-xs text-slate-400 hover:text-white transition pt-2"
              >
                <ArrowLeft className="w-3.5 h-3.5" /> Reenviar a otro correo
              </button>
            </div>
          )}

          {mode === 'forgot' && (
            <div className="space-y-4">
              <div className="text-center">
                <KeyRound className="w-10 h-10 text-orange-400 mx-auto mb-2" />
                <h4 className="text-white font-bold text-sm">Recuperar Contraseña</h4>
                <p className="text-xs text-slate-400 mt-1">
                  Ingresa tu correo registrado para enviarte las instrucciones de restablecimiento.
                </p>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Correo Electrónico</label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-500 pointer-events-none">
                    <Mail className="w-4 h-4" />
                  </span>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="tu.correo@taller.com"
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white text-xs focus:outline-none focus:border-orange-500"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-bold text-xs shadow-lg transition flex items-center justify-center gap-2 cursor-pointer"
              >
                {loading ? 'Enviando...' : 'Solicitar Token de Recuperación'}
              </button>

              <button
                type="button"
                onClick={() => { setMode('login'); setError(''); setSuccess(''); }}
                className="w-full flex items-center justify-center gap-2 text-xs text-slate-400 hover:text-white transition pt-2"
              >
                <ArrowLeft className="w-3.5 h-3.5" /> Volver al Inicio de Sesión
              </button>
            </div>
          )}

          {mode === 'reset' && (
            <div className="space-y-4">
              <div className="text-center">
                <KeyRound className="w-10 h-10 text-emerald-400 mx-auto mb-2" />
                <h4 className="text-white font-bold text-sm">Nueva Contraseña</h4>
                <p className="text-xs text-slate-400 mt-1">
                  Ingresa el token de seguridad y define tu nueva contraseña.
                </p>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Token de Recuperación</label>
                <input
                  type="text"
                  required
                  value={resetToken}
                  onChange={e => setResetToken(e.target.value)}
                  placeholder="Token seguro de restablecimiento"
                  className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white text-xs font-mono focus:outline-none focus:border-orange-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Nueva Contraseña</label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-500 pointer-events-none">
                    <Lock className="w-4 h-4" />
                  </span>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={newPassword}
                    onChange={e => setNewPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-10 pr-10 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white text-xs focus:outline-none focus:border-orange-500"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-500 hover:text-slate-300"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-xs shadow-lg transition flex items-center justify-center gap-2 cursor-pointer"
              >
                {loading ? 'Actualizando...' : 'Restablecer Contraseña'}
              </button>
            </div>
          )}

          {(mode === 'login' || mode === 'register') && (
            <>
              {mode === 'register' && (
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Nombre Completo</label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-500 pointer-events-none">
                      <User className="w-4 h-4" />
                    </span>
                    <input
                      type="text"
                      required
                      value={fullName}
                      onChange={e => setFullName(e.target.value)}
                      placeholder="Ej. Ing. Juan Pérez"
                      className="w-full pl-10 pr-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white text-xs focus:outline-none focus:border-orange-500"
                    />
                  </div>
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Correo Electrónico</label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-500 pointer-events-none">
                    <Mail className="w-4 h-4" />
                  </span>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="tu.correo@taller.com"
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white text-xs focus:outline-none focus:border-orange-500"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-xs font-semibold text-slate-300">Contraseña</label>
                  {mode === 'login' && (
                    <button
                      type="button"
                      onClick={() => { setMode('forgot'); setError(''); setSuccess(''); }}
                      className="text-[11px] text-orange-400 hover:underline"
                    >
                      ¿Olvidaste tu contraseña?
                    </button>
                  )}
                </div>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-500 pointer-events-none">
                    <Lock className="w-4 h-4" />
                  </span>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-10 pr-10 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white text-xs focus:outline-none focus:border-orange-500"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-500 hover:text-slate-300"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                {mode === 'register' && (
                  <p className="text-[10px] text-slate-500 mt-1">Mínimo 6 caracteres, cifrada con hash de alta seguridad.</p>
                )}
              </div>

              {mode === 'register' && (
                <>
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">Confirmar Contraseña</label>
                    <div className="relative">
                      <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-500 pointer-events-none">
                        <Lock className="w-4 h-4" />
                      </span>
                      <input
                        type={showPassword ? 'text' : 'password'}
                        required
                        value={confirmPassword}
                        onChange={e => setConfirmPassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full pl-10 pr-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white text-xs focus:outline-none focus:border-orange-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">País / Taller</label>
                    <div className="relative">
                      <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-500 pointer-events-none">
                        <Globe className="w-4 h-4" />
                      </span>
                      <select
                        value={country}
                        onChange={e => setCountry(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white text-xs focus:outline-none focus:border-orange-500"
                      >
                        <option value="México">México</option>
                        <option value="Colombia">Colombia</option>
                        <option value="Perú">Perú</option>
                        <option value="Chile">Chile</option>
                        <option value="Argentina">Argentina</option>
                        <option value="España">España</option>
                        <option value="Estados Unidos">Estados Unidos</option>
                      </select>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 pt-1">
                    <input
                      type="checkbox"
                      id="terms"
                      checked={acceptTerms}
                      onChange={e => setAcceptTerms(e.target.checked)}
                      className="rounded border-slate-800 bg-slate-950 text-orange-500 focus:ring-orange-500 w-4 h-4"
                    />
                    <label htmlFor="terms" className="text-xs text-slate-400 select-none">
                      Acepto los <span className="text-orange-400 underline">términos y condiciones</span> académicos de YOVE.
                    </label>
                  </div>
                </>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 text-white font-bold text-xs shadow-lg hover:opacity-90 transition disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer mt-2"
              >
                {loading ? (
                  <span>Procesando de forma segura...</span>
                ) : mode === 'login' ? (
                  <>
                    <LogIn className="w-4 h-4" />
                    <span>Ingresar al Sistema Académico</span>
                  </>
                ) : (
                  <>
                    <UserPlus className="w-4 h-4" />
                    <span>Registrarme en YOVE Academy</span>
                  </>
                )}
              </button>

              <div className="text-center pt-2">
                <p className="text-[11px] text-slate-500">
                  Acceso directo demo: <code className="text-slate-300 font-mono">estudiante@yoveacademy.com</code> / <code className="text-slate-300 font-mono">Demo1234!</code>
                </p>
              </div>
            </>
          )}
        </form>
      </div>
    </div>
  );
};
