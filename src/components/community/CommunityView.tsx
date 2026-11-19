import React, { useState, useEffect } from 'react';
import { COMMUNITY_POSTS_DATA } from '../../data/gamificationData';
import { CommunityPost, PostComment, UserRole } from '../../types';
import { useAuth } from '../../context/AuthContext';
import {
  MessageSquare,
  ThumbsUp,
  Tag,
  PlusCircle,
  User,
  ShieldCheck,
  Search,
  Send,
  CheckCircle2,
  AlertTriangle,
  Flag,
  Pin,
  Sparkles,
  Award,
  Filter,
  Check,
  X,
  MessageCircle,
  ShieldAlert
} from 'lucide-react';
import { FadeInOnScroll } from '../FadeInOnScroll';

interface CommunityViewProps {
  userRole?: UserRole;
  onNavigateToView?: (view: any) => void;
}

export const CommunityView: React.FC<CommunityViewProps> = ({ userRole = 'student' }) => {
  const { user, token } = useAuth();
  const [posts, setPosts] = useState<any[]>([]);
  const [loadingPosts, setLoadingPosts] = useState<boolean>(true);
  const [selectedCategory, setSelectedCategory] = useState<string>('Todos');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedTag, setSelectedTag] = useState<string | null>(null);

  // Creating post form state
  const [isCreatingPost, setIsCreatingPost] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newContent, setNewContent] = useState('');
  const [newCategory, setNewCategory] = useState('Diagnóstico Electrónico');
  const [newTagsString, setNewTagsString] = useState('Osciloscopio, DTC');

  // Expanded post for answers / comments
  const [activePostId, setActivePostId] = useState<string | null>(null);
  const [commentsMap, setCommentsMap] = useState<Record<string, any[]>>({});
  const [commentText, setCommentText] = useState<string>('');

  // Report modal state
  const [reportingTarget, setReportingTarget] = useState<{ type: string; id: string } | null>(null);
  const [reportReason, setReportReason] = useState('Contenido inapropiado o spam');

  // Moderation tab state
  const [activeTab, setActiveTab] = useState<'posts' | 'moderation'>('posts');
  const [moderationReports, setModerationReports] = useState<any[]>([]);

  // User profile preview modal
  const [profileModalUser, setProfileModalUser] = useState<any | null>(null);

  const categories = ['Todos', 'Diagnóstico Electrónico', 'Reparación de ECUs', 'Redes Automotrices', 'EV e Híbridos', 'Casos Resueltos', 'Error DTC', 'CAN Bus', 'Osciloscopio', 'Inyección', 'Electricidad', 'Híbridos', 'EV', 'ECU', 'ADAS'];
  const popularTags = ['Osciloscopio', 'DTC', 'CAN Bus', 'Inyección', 'Toyota', 'Nissan', 'VW', 'Diagramas', 'Híbridos', 'EV', 'ECU', 'ADAS'];

  const fetchPosts = () => {
    if (!token) return;
    setLoadingPosts(true);
    let url = `/api/v1/community/posts?category=${encodeURIComponent(selectedCategory)}`;
    if (searchQuery) url += `&search=${encodeURIComponent(searchQuery)}`;
    if (selectedTag) url += `&tag=${encodeURIComponent(selectedTag)}`;

    fetch(url, {
      headers: { 'Authorization': `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => {
        if (data.success && data.posts) {
          setPosts(data.posts);
        } else {
          setPosts([]);
        }
        setLoadingPosts(false);
      })
      .catch(err => {
        console.error("Error loading community posts:", err);
        setLoadingPosts(false);
      });
  };

  useEffect(() => {
    fetchPosts();
  }, [selectedCategory, searchQuery, selectedTag, token]);

  const fetchCommentsForPost = (postId: string) => {
    if (!token) return;
    fetch(`/api/v1/community/posts/${postId}/comments`, {
      headers: { 'Authorization': `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => {
        if (data.success && data.comments) {
          setCommentsMap(prev => ({ ...prev, [postId]: data.comments }));
        }
      })
      .catch(err => console.error("Error loading comments:", err));
  };

  const fetchModerationReports = () => {
    if (!token) return;
    fetch('/api/v1/community/moderation/reports', {
      headers: { 'Authorization': `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => {
        if (data.success && data.reports) {
          setModerationReports(data.reports);
        }
      })
      .catch(err => console.error("Error loading reports:", err));
  };

  useEffect(() => {
    if (activeTab === 'moderation' && (user?.role === 'ADMIN' || user?.role === 'SUPER_ADMIN' || user?.role === 'MODERATOR')) {
      fetchModerationReports();
    }
  }, [activeTab, user?.role, token]);

  const handleCreatePost = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newContent.trim() || !token) return;

    const parsedTags = newTagsString
      .split(',')
      .map(t => t.trim())
      .filter(t => t.length > 0);

    fetch('/api/v1/community/posts', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        title: newTitle,
        content: newContent,
        category: newCategory,
        tags: parsedTags
      })
    })
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setNewTitle('');
          setNewContent('');
          setIsCreatingPost(false);
          fetchPosts();
        }
      })
      .catch(err => console.error("Error creating post:", err));
  };

  const handleReact = (targetType: 'post' | 'comment', targetId: string, reactionType: string) => {
    if (!token) return;
    fetch('/api/v1/community/react', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        target_type: targetType,
        target_id: targetId,
        reaction_type: reactionType
      })
    })
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          fetchPosts();
          if (activePostId) fetchCommentsForPost(activePostId);
        }
      })
      .catch(err => console.error("Error reacting:", err));
  };

  const handleAddComment = (postId: string) => {
    if (!commentText.trim() || !token) return;

    fetch('/api/v1/community/comments', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        post_id: postId,
        content: commentText
      })
    })
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setCommentText('');
          fetchCommentsForPost(postId);
          fetchPosts();
        }
      })
      .catch(err => console.error("Error adding comment:", err));
  };

  const handleMarkSolution = (postId: string, commentId: string) => {
    if (!token) return;
    fetch('/api/v1/community/solution', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ post_id: postId, comment_id: commentId })
    })
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          fetchPosts();
          fetchCommentsForPost(postId);
        }
      })
      .catch(err => console.error("Error marking solution:", err));
  };

  const handleReport = (targetType: string, targetId: string) => {
    if (!token) return;
    fetch('/api/v1/community/report', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        target_type: targetType,
        target_id: targetId,
        reason: reportReason
      })
    })
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          alert("Reporte enviado con éxito.");
          setReportingTarget(null);
        }
      })
      .catch(err => console.error("Error reporting:", err));
  };

  const handleModerationAction = (targetType: string, targetId: string, action: string) => {
    if (!token) return;
    fetch('/api/v1/community/moderation/action', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        target_type: targetType,
        target_id: targetId,
        action,
        reason: 'Moderación de comunidad'
      })
    })
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          fetchPosts();
          fetchModerationReports();
        }
      })
      .catch(err => console.error("Error in moderation action:", err));
  };

  const handleDeletePost = (postId: string) => {
    if (!token || !confirm("¿Estás seguro de eliminar esta publicación?")) return;
    fetch(`/api/v1/community/posts/${postId}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          fetchPosts();
        }
      })
      .catch(err => console.error("Error deleting post:", err));
  };

  return (
    <div className="py-12 bg-[#0a0e27] min-h-screen text-white pt-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Header */}
        <FadeInOnScroll direction="up">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-white/10 pb-6">
            <div>
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-blue-900/60 text-[#ff9100] text-xs font-bold uppercase tracking-wider border border-blue-700/50">
                <MessageSquare className="w-3.5 h-3.5 text-amber-400" />
                YOVE Community // Foro Técnico Global
              </div>
              <h1 className="text-3xl font-extrabold text-white mt-2">
                Red de Diagnostas & Mecatrónicos Automotrices
              </h1>
              <p className="text-xs sm:text-sm text-gray-300 mt-1">
                Publica consultas sobre códigos DTC, oscilogramas, diagramas y casos reales. Comparte soluciones con instructores y especialistas.
              </p>
            </div>

            <div className="flex items-center gap-3">
              {(user?.role === 'ADMIN' || user?.role === 'SUPER_ADMIN' || user?.role === 'MODERATOR') && (
                <div className="flex bg-black/40 p-1 rounded-xl border border-white/10">
                  <button
                    onClick={() => setActiveTab('posts')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${activeTab === 'posts' ? 'bg-[#ff6f00] text-white' : 'text-gray-400 hover:text-white'}`}
                  >
                    Discusiones
                  </button>
                  <button
                    onClick={() => setActiveTab('moderation')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1 ${activeTab === 'moderation' ? 'bg-red-600 text-white' : 'text-gray-400 hover:text-white'}`}
                  >
                    <ShieldAlert className="w-3.5 h-3.5" />
                    Moderación
                  </button>
                </div>
              )}

              <button
                onClick={() => setIsCreatingPost(!isCreatingPost)}
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#ff6f00] to-[#ff9100] font-bold text-xs text-white shadow-lg hover:opacity-90 transition flex items-center gap-2 cursor-pointer shrink-0"
              >
                <PlusCircle className="w-4 h-4" />
                <span>{isCreatingPost ? 'Cancelar' : 'Publicar Consulta'}</span>
              </button>
            </div>
          </div>
        </FadeInOnScroll>

        {activeTab === 'moderation' && (user?.role === 'ADMIN' || user?.role === 'SUPER_ADMIN' || user?.role === 'MODERATOR') ? (
          <div className="space-y-6">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <ShieldAlert className="w-5 h-5 text-red-500" />
              Panel de Moderación de la Comunidad
            </h2>
            <div className="space-y-4">
              {moderationReports.length === 0 ? (
                <div className="p-8 text-center bg-white/5 rounded-2xl border border-white/10 text-gray-400 text-xs">
                  No hay reportes pendientes de moderación.
                </div>
              ) : (
                moderationReports.map((rep: any) => (
                  <div key={rep.id} className="p-4 rounded-xl bg-red-950/20 border border-red-500/30 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 text-xs font-bold text-red-400">
                        <span>Reporte de {rep.reporter_name}</span>
                        <span>• Target: {rep.target_type} ({rep.target_id})</span>
                      </div>
                      <p className="text-xs text-gray-200"><strong>Motivo:</strong> {rep.reason}</p>
                      <span className="text-[10px] text-gray-400">{rep.created_at}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleModerationAction(rep.target_type, rep.target_id, 'hide')}
                        className="px-3 py-1.5 rounded-lg bg-red-600 hover:bg-red-500 text-xs font-bold text-white"
                      >
                        Ocultar Contenido
                      </button>
                      <button
                        onClick={() => handleModerationAction(rep.target_type, rep.target_id, 'restore')}
                        className="px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-xs font-bold text-gray-300"
                      >
                        Restaurar
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        ) : (
          <>
            {/* Search & Tags Bar */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
              <div className="md:col-span-8 relative">
                <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-3" />
                <input
                  type="text"
                  placeholder="Buscar por DTC, modelo de motor, síntoma o autor (ej. P0171, Toyota, osciloscopio)..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-400 text-xs focus:outline-none focus:border-[#ff6f00]"
                />
              </div>

              <div className="md:col-span-4 flex items-center gap-2 overflow-x-auto">
                <span className="text-xs font-bold text-gray-400 shrink-0 flex items-center gap-1">
                  <Filter className="w-3.5 h-3.5" />
                  Etiqueta:
                </span>
                {selectedTag && (
                  <button
                    onClick={() => setSelectedTag(null)}
                    className="px-2.5 py-1 rounded-lg bg-[#ff6f00] text-white text-xs font-bold flex items-center gap-1 shrink-0"
                  >
                    <span>{selectedTag}</span>
                    <X className="w-3 h-3" />
                  </button>
                )}
                {popularTags.map((tag) => (
                  <button
                    key={tag}
                    onClick={() => setSelectedTag(selectedTag === tag ? null : tag)}
                    className={`px-2.5 py-1 rounded-lg text-xs font-bold whitespace-nowrap transition cursor-pointer border ${
                      selectedTag === tag
                        ? 'bg-blue-600 text-white border-blue-400'
                        : 'bg-white/5 text-gray-300 border-white/10 hover:bg-white/10'
                    }`}
                  >
                    #{tag}
                  </button>
                ))}
              </div>
            </div>

            {/* Categories Pills */}
            <div className="flex gap-2 overflow-x-auto pb-2 border-b border-white/10">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition cursor-pointer ${
                    selectedCategory === cat
                      ? 'bg-[#ff6f00] text-white shadow-md'
                      : 'bg-white/5 text-gray-300 hover:bg-white/10'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* CREATE POST FORM */}
            {isCreatingPost && (
              <form onSubmit={handleCreatePost} className="p-6 rounded-2xl bg-white/5 border border-white/10 space-y-4 animate-in fade-in duration-200">
                <h3 className="font-bold text-base text-white flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-amber-400" />
                  Crear Nueva Publicación en la Comunidad
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="md:col-span-2">
                    <label className="text-[10px] uppercase font-bold text-gray-400 block mb-1">Título de la Consulta / Caso</label>
                    <input
                      type="text"
                      placeholder="Ej. Fallo P0335 en Hilux 3.0 1KD-FTV con arranque prolongado"
                      value={newTitle}
                      onChange={(e) => setNewTitle(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl bg-black/50 border border-white/20 text-white text-xs focus:outline-none focus:border-[#ff6f00]"
                      required
                    />
                  </div>

                  <div>
                    <label className="text-[10px] uppercase font-bold text-gray-400 block mb-1">Categoría</label>
                    <select
                      value={newCategory}
                      onChange={(e) => setNewCategory(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl bg-black/50 border border-white/20 text-white text-xs font-bold focus:outline-none focus:border-[#ff6f00]"
                    >
                      {categories.filter(c => c !== 'Todos').map(c => (
                        <option key={c} value={c} className="bg-black text-white">{c}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="text-[10px] uppercase font-bold text-gray-400 block mb-1">Etiquetas (separadas por coma)</label>
                  <input
                    type="text"
                    placeholder="Osciloscopio, Toyota, CKP, P0335"
                    value={newTagsString}
                    onChange={(e) => setNewTagsString(e.target.value)}
                    className="w-full px-4 py-2 rounded-xl bg-black/50 border border-white/20 text-white text-xs focus:outline-none focus:border-[#ff6f00]"
                  />
                </div>

                <div>
                  <label className="text-[10px] uppercase font-bold text-gray-400 block mb-1">Descripción del Problema y Mediciones</label>
                  <textarea
                    placeholder="Detalla los síntomas del vehículo, voltajes medidos, lectura de escáner y pruebas realizadas..."
                    value={newContent}
                    onChange={(e) => setNewContent(e.target.value)}
                    rows={4}
                    className="w-full p-4 rounded-xl bg-black/50 border border-white/20 text-white text-xs focus:outline-none focus:border-[#ff6f00]"
                    required
                  />
                </div>

                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-[#ff6f00] hover:bg-[#ff8f00] font-bold text-xs text-white transition flex items-center gap-2 cursor-pointer shadow-lg"
                >
                  <Send className="w-4 h-4" />
                  <span>Publicar en la Comunidad (+25 XP)</span>
                </button>
              </form>
            )}

            {/* POSTS LIST */}
            <div className="space-y-6">
              {loadingPosts ? (
                <div className="p-12 text-center text-gray-400 text-xs">Cargando publicaciones de la comunidad...</div>
              ) : posts.length === 0 ? (
                <div className="p-12 text-center bg-white/5 rounded-2xl border border-white/10 text-gray-400 text-xs">
                  No se encontraron publicaciones. ¡Sé el primero en hacer una consulta!
                </div>
              ) : (
                posts.map((post) => {
                  const comments = commentsMap[post.id] || [];
                  const isOwner = user?.id === post.user_id || user?.role === 'SUPER_ADMIN' || user?.role === 'ADMIN' || user?.role === 'MODERATOR';

                  return (
                    <div
                      key={post.id}
                      className="p-6 rounded-2xl bg-white/5 border border-white/10 space-y-4 hover:border-white/20 transition relative"
                    >
                      {/* Solved Badge if solved */}
                      {post.solved_comment_id && (
                        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-950/80 text-emerald-300 text-[10px] font-bold border border-emerald-500/40">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                          CASO RESUELTO CON SOLUCIÓN ACEPTADA
                        </div>
                      )}

                      {/* Author Info Header */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <button
                            onClick={() => {
                              fetch(`/api/v1/users/profile/${post.user_id}`, {
                                headers: { 'Authorization': `Bearer ${token}` }
                              })
                              .then(res => res.json())
                              .then(data => {
                                if (data.success) {
                                  setProfileModalUser(data.profile);
                                }
                              })
                              .catch(err => console.error("Error loading profile:", err));
                            }}
                            className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#ff6f00] to-[#ff9100] font-bold text-xs flex items-center justify-center text-white shadow hover:opacity-90 transition cursor-pointer overflow-hidden"
                          >
                            {post.author_avatar ? (
                              <img src={post.author_avatar} alt={post.author_name} className="w-full h-full object-cover" />
                            ) : (
                              (post.author_name || 'U').substring(0, 2).toUpperCase()
                            )}
                          </button>

                          <div>
                            <div className="font-bold text-sm text-white flex items-center gap-2">
                              <button
                                onClick={() => {
                                  fetch(`/api/v1/users/profile/${post.user_id}`, {
                                    headers: { 'Authorization': `Bearer ${token}` }
                                  })
                                  .then(res => res.json())
                                  .then(data => {
                                    if (data.success) {
                                      setProfileModalUser(data.profile);
                                    }
                                  });
                                }}
                                className="hover:underline hover:text-[#ff9100] transition cursor-pointer"
                              >
                                {post.author_name}
                              </button>
                              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-blue-900/40 text-blue-300 border border-blue-700/40">
                                {post.author_level || post.author_role}
                              </span>
                            </div>
                            <div className="text-[10px] text-gray-400 flex items-center gap-2">
                              <span>{new Date(post.created_at).toLocaleDateString()}</span>
                              <span>•</span>
                              <span className="text-amber-300 font-bold">{post.category}</span>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => setReportingTarget({ type: 'post', id: post.id })}
                            className="text-gray-400 hover:text-red-400 p-1.5 rounded hover:bg-white/5 transition cursor-pointer"
                            title="Reportar publicación"
                          >
                            <Flag className="w-4 h-4" />
                          </button>
                          {isOwner && (
                            <button
                              onClick={() => handleDeletePost(post.id)}
                              className="text-gray-400 hover:text-red-500 p-1.5 rounded hover:bg-white/5 transition cursor-pointer text-xs"
                              title="Eliminar publicación"
                            >
                              Eliminar
                            </button>
                          )}
                        </div>
                      </div>

                      {/* Post Content */}
                      <div className="space-y-2">
                        <h3 className="text-lg font-bold text-white hover:text-[#ff9100] transition">
                          {post.title}
                        </h3>
                        <p className="text-xs text-gray-300 leading-relaxed whitespace-pre-line">
                          {post.content}
                        </p>
                      </div>

                      {/* Tags */}
                      <div className="flex flex-wrap gap-2 pt-1">
                        {post.tags.map((tag: string) => (
                          <span key={tag} className="text-[10px] font-bold text-blue-300 bg-blue-950/60 px-2.5 py-1 rounded-lg border border-blue-800/40">
                            #{tag}
                          </span>
                        ))}
                      </div>

                      {/* Actions Row */}
                      <div className="flex items-center justify-between border-t border-white/10 pt-3 text-xs">
                        <div className="flex items-center gap-4">
                          <button
                            onClick={() => handleReact('post', post.id, 'like')}
                            className={`flex items-center gap-1.5 transition cursor-pointer ${post.userReaction === 'like' ? 'text-[#ff9100]' : 'text-gray-300 hover:text-[#ff9100]'}`}
                          >
                            <ThumbsUp className="w-4 h-4" />
                            <span className="font-bold">
                              {post.reactions?.find((r: any) => r.reaction_type === 'like')?.cnt || 0}
                            </span>
                          </button>

                          <button
                            onClick={() => {
                              const willOpen = activePostId !== post.id;
                              setActivePostId(willOpen ? post.id : null);
                              if (willOpen) fetchCommentsForPost(post.id);
                            }}
                            className="flex items-center gap-1.5 text-gray-300 hover:text-white transition cursor-pointer"
                          >
                            <MessageCircle className="w-4 h-4 text-blue-400" />
                            <span className="font-bold">{post.commentsCount} Respuestas</span>
                          </button>
                        </div>

                        <button
                          onClick={() => {
                            const willOpen = activePostId !== post.id;
                            setActivePostId(willOpen ? post.id : null);
                            if (willOpen) fetchCommentsForPost(post.id);
                          }}
                          className="text-xs font-bold text-[#ff9100] hover:underline cursor-pointer"
                        >
                          {activePostId === post.id ? 'Ocultar Respuestas' : 'Ver Hilo Completo'}
                        </button>
                      </div>

                      {/* EXPANDED COMMENTS SECTION */}
                      {activePostId === post.id && (
                        <div className="pt-4 border-t border-white/10 space-y-4 animate-in fade-in">
                          <div className="text-xs font-bold text-gray-300 uppercase tracking-wider">
                            Respuestas de la Comunidad ({comments.length})
                          </div>

                          {/* Existing Comments */}
                          <div className="space-y-3">
                            {comments.length === 0 ? (
                              <div className="text-xs text-gray-500 italic">
                                Aún no hay respuestas en este hilo. ¡Sé el primero en colaborar!
                              </div>
                            ) : (
                              comments.map((comment: any) => (
                                <div
                                  key={comment.id}
                                  className={`p-4 rounded-xl border text-xs space-y-2 ${
                                    comment.is_solution
                                      ? 'bg-emerald-950/50 border-emerald-500/50 text-emerald-100'
                                      : 'bg-black/40 border-white/10 text-gray-200'
                                  }`}
                                >
                                  <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                      <span className="font-bold text-white">{comment.author_name}</span>
                                      <span className="text-[10px] text-gray-400">({comment.author_level || comment.author_role})</span>
                                      <span className="text-[10px] text-gray-500">• {new Date(comment.created_at).toLocaleDateString()}</span>
                                    </div>

                                    <div className="flex items-center gap-3">
                                      {comment.is_solution ? (
                                        <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 text-[10px] font-bold border border-emerald-500/30 flex items-center gap-1">
                                          <Check className="w-3 h-3" />
                                          Solución Aceptada
                                        </span>
                                      ) : (
                                        (user?.id === post.user_id || user?.role === 'SUPER_ADMIN' || user?.role === 'ADMIN') && (
                                          <button
                                            onClick={() => handleMarkSolution(post.id, comment.id)}
                                            className="text-[10px] font-bold text-emerald-400 hover:underline cursor-pointer"
                                          >
                                            Aceptar Solución (+100 XP)
                                          </button>
                                        )
                                      )}
                                    </div>
                                  </div>

                                  <p className="leading-relaxed">{comment.content}</p>
                                </div>
                              ))
                            )}
                          </div>

                          {/* Add Comment Input */}
                          <div className="flex gap-2 pt-2">
                            <input
                              type="text"
                              placeholder="Escribe tu respuesta técnica o recomendación (+10 XP)..."
                              value={commentText}
                              onChange={(e) => setCommentText(e.target.value)}
                              onKeyDown={(e) => {
                                if (e.key === 'Enter') handleAddComment(post.id);
                              }}
                              className="flex-1 px-4 py-2.5 rounded-xl bg-black/60 border border-white/20 text-white text-xs focus:outline-none focus:border-[#ff6f00]"
                            />
                            <button
                              onClick={() => handleAddComment(post.id)}
                              className="px-5 py-2.5 rounded-xl bg-[#ff6f00] hover:bg-[#ff8f00] text-xs font-bold text-white transition flex items-center gap-1.5 cursor-pointer"
                            >
                              <Send className="w-3.5 h-3.5" />
                              <span>Responder</span>
                            </button>
                          </div>

                        </div>
                      )}

                    </div>
                  );
                })
              )}
            </div>
          </>
        )}

        {/* REPORT MODAL */}
        {reportingTarget && (
          <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-[#0f173a] p-6 rounded-2xl border border-white/20 max-w-md w-full space-y-4 shadow-2xl">
              <h3 className="font-bold text-base text-white flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-amber-400" />
                Reportar Contenido para Moderación
              </h3>
              <p className="text-xs text-gray-300">
                Selecciona el motivo del reporte para enviar el caso al equipo de moderación:
              </p>

              <select
                value={reportReason}
                onChange={(e) => setReportReason(e.target.value)}
                className="w-full p-3 rounded-xl bg-black/60 border border-white/20 text-white text-xs font-bold"
              >
                <option value="Contenido inapropiado o spam">Contenido inapropiado o spam</option>
                <option value="Información técnica incorrecta o riesgosa">Información técnica incorrecta o riesgosa</option>
                <option value="Falta de respeto a miembros del foro">Falta de respeto a miembros del foro</option>
                <option value="Publicidad o venta no autorizada">Publicidad o venta no autorizada</option>
              </select>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  onClick={() => setReportingTarget(null)}
                  className="px-4 py-2 rounded-xl bg-white/10 text-xs font-bold text-gray-300 hover:bg-white/20"
                >
                  Cancelar
                </button>
                <button
                  onClick={() => handleReport(reportingTarget.type, reportingTarget.id)}
                  className="px-5 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-xs font-bold text-white"
                >
                  Enviar Reporte
                </button>
              </div>
            </div>
          </div>
        )}

        {/* USER PROFILE MODAL */}
        {profileModalUser && (
          <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-[#0f173a] p-6 rounded-2xl border border-amber-500/40 max-w-md w-full space-y-4 shadow-2xl relative">
              <button
                onClick={() => setProfileModalUser(null)}
                className="absolute top-4 right-4 text-gray-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-[#ff6f00] to-[#ff9100] font-black text-xl flex items-center justify-center text-white shadow-xl overflow-hidden">
                  {profileModalUser.avatar_url ? (
                    <img src={profileModalUser.avatar_url} alt="" className="w-full h-full object-cover" />
                  ) : (
                    (profileModalUser.full_name || 'U').substring(0, 2).toUpperCase()
                  )}
                </div>
                <div>
                  <h3 className="font-extrabold text-base text-white">{profileModalUser.full_name}</h3>
                  <span className="px-2.5 py-0.5 rounded-full bg-blue-900/60 text-blue-300 text-[10px] font-bold border border-blue-700/50">
                    {profileModalUser.level_name || profileModalUser.role}
                  </span>
                  <div className="text-[11px] text-gray-400 mt-1">📍 {profileModalUser.country || 'Latinoamérica'} • {profileModalUser.workshop_name || 'Taller YOVE'}</div>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2 text-center bg-black/40 p-3 rounded-xl border border-white/10 text-xs">
                <div>
                  <div className="text-[#ff9100] font-black">{profileModalUser.xp || 0}</div>
                  <div className="text-[10px] text-gray-400 uppercase">XP</div>
                </div>
                <div>
                  <div className="text-blue-400 font-black">{profileModalUser.streak_days || 0}</div>
                  <div className="text-[10px] text-gray-400 uppercase">Racha</div>
                </div>
                <div>
                  <div className="text-emerald-400 font-black">{profileModalUser.study_hours || 0}h</div>
                  <div className="text-[10px] text-gray-400 uppercase">Estudio</div>
                </div>
              </div>

              {profileModalUser.posts && profileModalUser.posts.length > 0 && (
                <div className="space-y-1">
                  <div className="text-[10px] uppercase font-bold text-gray-400">Publicaciones recientes ({profileModalUser.posts.length})</div>
                  <div className="max-h-32 overflow-y-auto space-y-1">
                    {profileModalUser.posts.map((p: any) => (
                      <div key={p.id} className="text-xs text-gray-300 bg-white/5 p-2 rounded-lg truncate">
                        • {p.title}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <button
                onClick={() => setProfileModalUser(null)}
                className="w-full py-2.5 rounded-xl bg-[#ff6f00] text-xs font-bold text-white hover:bg-[#ff8f00]"
              >
                Cerrar Perfil
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
