import React, { useState } from 'react';
import { StudentProfile, Course } from '../../types';
import { GLOBAL_LEADERBOARD, DEFAULT_STUDENT_MISSIONS, ALL_BADGES } from '../../data/evaluationsData';
import {
  Award,
  BookOpen,
  Flame,
  Clock,
  Trophy,
  CheckCircle2,
  ArrowRight,
  PlayCircle,
  ShieldCheck,
  Sparkles,
  GraduationCap,
  BarChart2,
  CheckSquare,
  Zap,
  Target,
  Medal,
  Cpu,
  Wrench,
  Search
} from 'lucide-react';
import { FadeInOnScroll } from '../FadeInOnScroll';

interface StudentDashboardViewProps {
  profile: StudentProfile;
  courses: Course[];
  onOpenCourse: (course: Course) => void;
  onNavigateToView: (view: any) => void;
}

export const StudentDashboardView: React.FC<StudentDashboardViewProps> = ({
  profile,
  courses,
  onOpenCourse,
  onNavigateToView
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'courses' | 'missions' | 'badges' | 'leaderboard'>('overview');
  const [missions, setMissions] = useState(DEFAULT_STUDENT_MISSIONS);

  const enrolledCoursesList = (courses || []).filter(c => (profile?.enrolledCourses || []).includes(c.id));
  const completedCoursesList = (courses || []).filter(c => (profile?.completedCourses || []).includes(c.id));

  // Level Progression Math
  const getLevelTier = (xp: number) => {
    if (xp >= 6000) return { name: 'Experto YOVE', min: 6000, next: 10000, color: 'text-amber-400' };
    if (xp >= 3000) return { name: 'Diagnosta', min: 3000, next: 6000, color: 'text-purple-400' };
    if (xp >= 1500) return { name: 'Especialista', min: 1500, next: 3000, color: 'text-blue-400' };
    if (xp >= 500) return { name: 'Técnico', min: 500, next: 1500, color: 'text-emerald-400' };
    return { name: 'Aprendiz', min: 0, next: 500, color: 'text-gray-300' };
  };

  const currentTier = getLevelTier(profile.xp);
  const xpInLevel = profile.xp - currentTier.min;
  const xpNeeded = currentTier.next - currentTier.min;
  const levelProgressPercent = Math.min(100, Math.round((xpInLevel / xpNeeded) * 100));

  const handleClaimMission = (missionId: string, rewardXp: number) => {
    setMissions(prev =>
      prev.map(m => (m.id === missionId ? { ...m, completed: true } : m))
    );
  };

  return (
    <div className="py-10 bg-[#0a0e27] min-h-screen text-white pt-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Welcome Student Header Banner */}
        <FadeInOnScroll direction="up">
          <div className="bg-gradient-to-r from-[#0d163a] via-[#101b4d] to-[#0d163a] p-6 sm:p-8 rounded-3xl border border-blue-900/60 text-white relative overflow-hidden shadow-2xl space-y-6">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative z-10">
              
              <div className="flex items-center gap-4">
                <div className="relative">
                  <img
                    src={profile.avatarUrl}
                    alt={profile.fullName}
                    className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl border-2 border-[#ff6f00] object-cover shadow-xl"
                  />
                  <div className="absolute -bottom-2 -right-2 w-7 h-7 rounded-full bg-[#ff6f00] text-white flex items-center justify-center text-xs font-black shadow">
                    XP
                  </div>
                </div>

                <div>
                  <div className="flex items-center gap-2">
                    <span className={`px-3 py-0.5 rounded-full bg-black/60 text-xs font-black uppercase tracking-wider border border-white/10 ${currentTier.color}`}>
                      Nivel: {currentTier.name}
                    </span>
                    <span className="text-xs text-amber-300 font-bold flex items-center gap-1 bg-amber-950/60 px-2.5 py-0.5 rounded-full border border-amber-500/40">
                      <Flame className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                      Racha: {profile.streakDays} Días
                    </span>
                  </div>

                  <h1 className="text-2xl sm:text-3xl font-extrabold text-white mt-1">
                    Panel del Estudiante // {profile.fullName}
                  </h1>
                  <p className="text-xs sm:text-sm text-gray-300">
                    Academia Técnica YOVE — Control de Gamificación, Logros y Expediente
                  </p>
                </div>
              </div>

              {/* Metrics Summary */}
              <div className="flex items-center gap-4 bg-black/50 p-4 rounded-2xl border border-white/10 shrink-0 w-full md:w-auto justify-around shadow-inner">
                <div className="text-center px-2">
                  <div className="text-2xl font-black text-amber-400">{profile.xp}</div>
                  <div className="text-[10px] text-gray-400 font-bold uppercase">Puntos XP</div>
                </div>
                <div className="w-px h-8 bg-white/20" />
                <div className="text-center px-2">
                  <div className="text-2xl font-black text-emerald-400">{profile.studyHours}h</div>
                  <div className="text-[10px] text-gray-400 font-bold uppercase">Horas Estudio</div>
                </div>
                <div className="w-px h-8 bg-white/20" />
                <div className="text-center px-2">
                  <div className="text-2xl font-black text-blue-300">{(profile?.badges || []).length}</div>
                  <div className="text-[10px] text-gray-400 font-bold uppercase">Insignias</div>
                </div>
              </div>

            </div>

            {/* Level XP Progress Bar */}
            <div className="space-y-1.5 pt-2 border-t border-white/10">
              <div className="flex items-center justify-between text-xs text-gray-300">
                <span>Progreso de Nivel: <strong className="text-white">{currentTier.name}</strong></span>
                <span className="font-mono text-amber-300 font-bold">{profile.xp} / {currentTier.next} XP ({levelProgressPercent}%)</span>
              </div>
              <div className="w-full bg-black/60 h-2.5 rounded-full overflow-hidden p-0.5 border border-white/10">
                <div
                  className="bg-gradient-to-r from-[#ff6f00] via-amber-400 to-emerald-400 h-full rounded-full transition-all duration-500"
                  style={{ width: `${levelProgressPercent}%` }}
                />
              </div>
            </div>

          </div>
        </FadeInOnScroll>

        {/* Tab Selector */}
        <div className="flex flex-wrap items-center gap-2 border-b border-white/10 pb-4">
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition flex items-center gap-2 cursor-pointer ${
              activeTab === 'overview'
                ? 'bg-[#ff6f00] text-white shadow-lg'
                : 'bg-white/5 text-gray-300 hover:text-white hover:bg-white/10'
            }`}
          >
            <BarChart2 className="w-4 h-4" />
            <span>Vista General</span>
          </button>

          <button
            onClick={() => setActiveTab('courses')}
            className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition flex items-center gap-2 cursor-pointer ${
              activeTab === 'courses'
                ? 'bg-[#ff6f00] text-white shadow-lg'
                : 'bg-white/5 text-gray-300 hover:text-white hover:bg-white/10'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            <span>Cursos y Progreso ({enrolledCoursesList.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('missions')}
            className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition flex items-center gap-2 cursor-pointer ${
              activeTab === 'missions'
                ? 'bg-[#ff6f00] text-white shadow-lg'
                : 'bg-white/5 text-gray-300 hover:text-white hover:bg-white/10'
            }`}
          >
            <Target className="w-4 h-4 text-amber-400" />
            <span>Misiones y Recompensas</span>
          </button>

          <button
            onClick={() => setActiveTab('badges')}
            className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition flex items-center gap-2 cursor-pointer ${
              activeTab === 'badges'
                ? 'bg-[#ff6f00] text-white shadow-lg'
                : 'bg-white/5 text-gray-300 hover:text-white hover:bg-white/10'
            }`}
          >
            <Award className="w-4 h-4" />
            <span>Insignias y Logros ({ALL_BADGES.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('leaderboard')}
            className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition flex items-center gap-2 cursor-pointer ${
              activeTab === 'leaderboard'
                ? 'bg-[#ff6f00] text-white shadow-lg'
                : 'bg-white/5 text-gray-300 hover:text-white hover:bg-white/10'
            }`}
          >
            <Trophy className="w-4 h-4 text-amber-300" />
            <span>Ranking Global</span>
          </button>
        </div>

        {/* ======================================================== */}
        {/* TAB 1: OVERVIEW */}
        {/* ======================================================== */}
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            
            {/* Left Main Column: Active Tasks & Unlocked Badges */}
            <div className="lg:col-span-8 space-y-6">
              
              {/* Active Missions Preview */}
              <div className="bg-white/5 rounded-2xl border border-white/10 p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-base font-bold text-white flex items-center gap-2">
                    <Target className="w-5 h-5 text-amber-400" />
                    Misiones Diarias Activas
                  </h3>
                  <button
                    onClick={() => setActiveTab('missions')}
                    className="text-xs font-bold text-[#ff9100] hover:underline cursor-pointer"
                  >
                    Ver Todas
                  </button>
                </div>

                <div className="grid grid-cols-1 gap-3">
                  {missions.slice(0, 2).map((m) => (
                    <div
                      key={m.id}
                      className="p-4 rounded-xl bg-black/40 border border-white/10 flex items-center justify-between gap-4"
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">{m.icon || '🎯'}</span>
                        <div>
                          <div className="font-bold text-xs text-white">{m.title}</div>
                          <div className="text-[11px] text-gray-400">{m.description}</div>
                        </div>
                      </div>

                      <div className="shrink-0 text-right">
                        {m.completed ? (
                          <span className="px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-bold border border-emerald-500/30">
                            Completada (+{m.xpReward} XP)
                          </span>
                        ) : (
                          <span className="text-xs font-bold text-amber-400">+{m.xpReward} XP</span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Unlocked Badges Preview */}
              <div className="bg-white/5 rounded-2xl border border-white/10 p-6 space-y-4">
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <Award className="w-5 h-5 text-amber-400" />
                  Insignias Desbloqueadas Recientes
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {(profile?.badges || []).map((b) => (
                    <div
                      key={b.id}
                      className="p-4 rounded-xl bg-gradient-to-b from-amber-500/10 to-black/40 border border-amber-500/30 text-center space-y-2"
                    >
                      <div className="text-3xl">{b.icon}</div>
                      <div className="font-bold text-xs text-amber-300">{b.name}</div>
                      <div className="text-[10px] text-gray-400">{b.description}</div>
                    </div>
                  ))}
                </div>
              </div>

            </div>

            {/* Right Sidebar: Shortcuts to Labs & Cases */}
            <div className="lg:col-span-4 space-y-6">
              <div className="bg-gradient-to-b from-[#0f173a] to-[#0a0e27] p-6 rounded-2xl border border-blue-900/60 space-y-4">
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <Zap className="w-4 h-4 text-[#ff9100]" />
                  Aceleradores de Aprendizaje
                </h3>

                <div className="space-y-3">
                  <button
                    onClick={() => onNavigateToView('lab')}
                    className="w-full p-3.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-left transition flex items-center justify-between cursor-pointer group"
                  >
                    <div className="flex items-center gap-3">
                      <Cpu className="w-5 h-5 text-blue-400 group-hover:text-[#ff9100]" />
                      <div>
                        <div className="font-bold text-xs text-white">Laboratorio YOVE Lab</div>
                        <div className="text-[10px] text-gray-400">15 Simuladores Virtuales</div>
                      </div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-gray-400 group-hover:translate-x-1 transition" />
                  </button>

                  <button
                    onClick={() => onNavigateToView('cases')}
                    className="w-full p-3.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-left transition flex items-center justify-between cursor-pointer group"
                  >
                    <div className="flex items-center gap-3">
                      <Wrench className="w-5 h-5 text-emerald-400 group-hover:text-[#ff9100]" />
                      <div>
                        <div className="font-bold text-xs text-white">Casos Diagnósticos</div>
                        <div className="text-[10px] text-gray-400">Investigación de DTCs</div>
                      </div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-gray-400 group-hover:translate-x-1 transition" />
                  </button>

                  <button
                    onClick={() => onNavigateToView('evaluaciones')}
                    className="w-full p-3.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-left transition flex items-center justify-between cursor-pointer group"
                  >
                    <div className="flex items-center gap-3">
                      <Award className="w-5 h-5 text-amber-400 group-hover:text-[#ff9100]" />
                      <div>
                        <div className="font-bold text-xs text-white">Exámenes y Quizzes</div>
                        <div className="text-[10px] text-gray-400">Rinde tu examen final</div>
                      </div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-gray-400 group-hover:translate-x-1 transition" />
                  </button>
                </div>
              </div>
            </div>

          </div>
        )}

        {/* ======================================================== */}
        {/* TAB 2: COURSES PROGRESS */}
        {/* ======================================================== */}
        {activeTab === 'courses' && (
          <div className="space-y-6">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-[#ff9100]" />
              Mis Cursos Inscritos
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {enrolledCoursesList.map((course) => (
                <div
                  key={course.id}
                  className="bg-white/5 p-6 rounded-2xl border border-white/10 space-y-4 hover:border-[#ff6f00] transition"
                >
                  <div className="flex items-center justify-between">
                    <span className="px-2.5 py-0.5 rounded-full bg-blue-900/60 text-blue-200 text-[10px] font-bold uppercase">
                      {course.categoryLabel}
                    </span>
                    <span className="text-xs text-amber-300 font-bold">{course.duration}</span>
                  </div>

                  <h3 className="font-extrabold text-base text-white">{course.title}</h3>
                  <p className="text-xs text-gray-300 line-clamp-2">{course.description}</p>

                  <div className="pt-2">
                    <button
                      onClick={() => onOpenCourse(course)}
                      className="w-full py-2.5 rounded-xl bg-[#ff6f00] hover:bg-[#ff8f00] text-xs font-bold text-white transition shadow flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <PlayCircle className="w-4 h-4" />
                      <span>Continuar Estudiando</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* TAB 3: MISSIONS */}
        {/* ======================================================== */}
        {activeTab === 'missions' && (
          <div className="space-y-6">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <Target className="w-5 h-5 text-amber-400" />
              Misiones Diarias y Semanales
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {missions.map((m) => (
                <div
                  key={m.id}
                  className="bg-white/5 p-5 rounded-2xl border border-white/10 flex items-center justify-between gap-4"
                >
                  <div className="flex items-center gap-4">
                    <div className="text-3xl">{m.icon || '🎯'}</div>
                    <div className="space-y-1">
                      <div className="font-bold text-sm text-white">{m.title}</div>
                      <div className="text-xs text-gray-400">{m.description}</div>
                      <div className="text-[10px] text-amber-300 font-bold">Recompensa: +{m.xpReward} XP</div>
                    </div>
                  </div>

                  <div className="shrink-0">
                    {m.completed ? (
                      <span className="px-3 py-1.5 rounded-xl bg-emerald-500/20 text-emerald-300 text-xs font-bold border border-emerald-500/30 flex items-center gap-1">
                        <CheckCircle2 className="w-4 h-4" />
                        Completado
                      </span>
                    ) : (
                      <button
                        onClick={() => handleClaimMission(m.id, m.xpReward)}
                        className="px-4 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-orange-600 font-bold text-xs text-white hover:opacity-90 transition shadow cursor-pointer"
                      >
                        Reclamar XP
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* TAB 4: BADGES */}
        {/* ======================================================== */}
        {activeTab === 'badges' && (
          <div className="space-y-6">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <Award className="w-5 h-5 text-amber-400" />
              Colección Completa de Insignias YOVE
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
              {ALL_BADGES.map((b) => {
                const isUnlocked = (profile?.badges || []).some(pb => pb.id === b.id);

                return (
                  <div
                    key={b.id}
                    className={`p-5 rounded-2xl border text-center space-y-3 transition ${
                      isUnlocked
                        ? 'bg-gradient-to-b from-amber-500/20 to-black/60 border-amber-500/50 text-white'
                        : 'bg-white/5 border-white/10 text-gray-500 opacity-60'
                    }`}
                  >
                    <div className="text-4xl">{b.icon}</div>
                    <div className={`font-bold text-sm ${isUnlocked ? 'text-amber-300' : 'text-gray-400'}`}>
                      {b.name}
                    </div>
                    <div className="text-xs text-gray-400 leading-relaxed">{b.description}</div>
                    <div className="text-[10px] font-mono">
                      {isUnlocked ? (
                        <span className="text-emerald-400 font-bold">DESBLOQUEADO</span>
                      ) : (
                        <span className="text-gray-500">BLOQUEADO</span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* TAB 5: LEADERBOARD */}
        {/* ======================================================== */}
        {activeTab === 'leaderboard' && (
          <div className="bg-white/5 rounded-2xl border border-white/10 p-6 space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <Trophy className="w-5 h-5 text-amber-400" />
                Tabla de Clasificación Global de Técnicos
              </h2>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-gray-300">
                <thead className="bg-black/40 text-gray-400 uppercase text-[10px] font-bold">
                  <tr>
                    <th className="px-4 py-3">Posición</th>
                    <th className="px-4 py-3">Técnico Estudiante</th>
                    <th className="px-4 py-3">País</th>
                    <th className="px-4 py-3">Nivel</th>
                    <th className="px-4 py-3">Insignias</th>
                    <th className="px-4 py-3 text-right">Puntos XP</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {GLOBAL_LEADERBOARD.map((item) => (
                    <tr
                      key={item.id}
                      className={`hover:bg-white/5 transition ${
                        item.studentName === profile.fullName ? 'bg-amber-500/10 font-bold' : ''
                      }`}
                    >
                      <td className="px-4 py-3 font-bold text-base">
                        {item.rank === 1 && '🥇 1°'}
                        {item.rank === 2 && '🥈 2°'}
                        {item.rank === 3 && '🥉 3°'}
                        {item.rank > 3 && `${item.rank}°`}
                      </td>
                      <td className="px-4 py-3 flex items-center gap-3">
                        <img
                          src={item.avatarUrl}
                          alt={item.studentName}
                          className="w-8 h-8 rounded-full object-cover border border-white/20"
                        />
                        <span className="font-bold text-white">{item.studentName}</span>
                      </td>
                      <td className="px-4 py-3">
                        <span>{item.countryFlag} {item.country}</span>
                      </td>
                      <td className="px-4 py-3 font-bold text-blue-300">{item.level}</td>
                      <td className="px-4 py-3">{item.badgesCount} insignias</td>
                      <td className="px-4 py-3 text-right font-mono font-bold text-amber-400 text-sm">
                        {item.xp} XP
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
