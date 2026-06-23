import { useState } from 'react';
import { MessageSquare, Heart, Image as ImageIcon, Send, Share2, Link2, Sparkles } from 'lucide-react';
import { transKeys, LangType } from '../translations';
import { SocialPostModel, EventModel, User } from '../types';

interface SocialFeedProps {
  currentLang: LangType;
  darkMode: boolean;
  posts: SocialPostModel[];
  events: EventModel[];
  currentUser: User | null;
  onOpenLogin: () => void;
  onPostLike: (postId: number) => void;
  onOpenComments: (postId: number) => void;
  onAddPost: (content: string, imageUrl?: string, eventId?: number) => void;
  onUserClick: (userId: number) => void;
}

export default function SocialFeed({
  currentLang,
  darkMode,
  posts,
  events,
  currentUser,
  onOpenLogin,
  onPostLike,
  onOpenComments,
  onAddPost,
  onUserClick
}: SocialFeedProps) {
  const [content, setContent] = useState('');
  const [image, setImage] = useState('');
  const [selectedEventId, setSelectedEventId] = useState('');

  const t = (key: keyof typeof transKeys['es']) => {
    return transKeys[currentLang]?.[key] || transKeys['es'][key] || key;
  };

  const handlePublish = () => {
    if (!content.trim()) {
      alert('Escribe algún contenido para tu publicación.');
      return;
    }
    const eId = selectedEventId ? parseInt(selectedEventId) : undefined;
    onAddPost(content, image || undefined, eId);
    setContent('');
    setImage('');
    setSelectedEventId('');
  };

  return (
    <section id="social" className="py-16 px-4 sm:px-6 lg:px-8 max-w-3xl mx-auto border-b border-dashed dark:border-slate-800 border-slate-200">
      
      {/* Title block */}
      <div className="mb-10 text-center">
        <h2 className="text-3xl font-display font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-4xl flex items-center justify-center gap-2">
          <MessageSquare className="h-7 w-7 text-sky-400" />
          <span>{t('social_title')}</span>
        </h2>
        <p className="mt-2 text-slate-500 dark:text-slate-400 text-xs sm:text-sm max-w-xl mx-auto">
          {currentLang === 'pt' ? 'Mural comunitário de vivências e fotografias. Veja o que os vizinhos andam comentando.' : currentLang === 'en' ? 'Community billboard of live neighborhood experiences. Review actual pictures shared.' : 'La pizarra comunitaria de vivencias reales y registro de momentos. Revisa lo que tus vecinos comentan sobre los espectáculos.'}
        </p>
      </div>

      {/* Editor Box */}
      {currentUser ? (
        <div className={`p-5 rounded-2xl border mb-8 transition-transform duration-300 ${
          darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-250 shadow-sm'
        }`}>
          <div className="flex items-center space-x-3 mb-4">
            <img 
              src={currentUser.avatar_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200'} 
              alt={currentUser.name} 
              className="h-9 w-9 rounded-full object-cover border border-sky-450" 
            />
            <div>
              <span className="text-sm font-semibold text-slate-900 dark:text-white">{currentUser.name}</span>
              <p className="text-[10px] text-slate-400">{currentUser.role === 'admin' ? 'Administrador' : currentUser.role === 'organizer' ? 'Organizador de Eventos' : 'Ciudadano Local'}</p>
            </div>
          </div>

          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder={currentLang === 'pt' ? 'Compartilhe sua experiência...' : currentLang === 'en' ? 'Share your event experience...' : 'Comparte tu experiencia comuntaria sobre un evento municipal...'}
            rows={3}
            className={`w-full p-4 rounded-xl border text-sm outline-none transition-all resize-none ${
              darkMode 
                ? 'bg-slate-950 border-slate-800 focus:border-sky-500 text-slate-100 placeholder-slate-500' 
                : 'bg-slate-50 border-slate-200 focus:border-sky-500 text-slate-800 placeholder-slate-400'
            }`}
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
            {/* Direct Image URL input */}
            <div className="relative">
              <ImageIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 h-4 w-4" />
              <input
                type="url"
                value={image}
                onChange={(e) => setImage(e.target.value)}
                placeholder={currentLang === 'pt' ? 'URL da imagem (opcional)...' : currentLang === 'en' ? 'Photo URL (optional)...' : 'URL de imagen (opcional)...'}
                className={`w-full pl-10 pr-4 py-2 rounded-xl border text-xs outline-none transition-all ${
                  darkMode 
                    ? 'bg-slate-950 border-slate-800 focus:border-sky-500 text-slate-100 placeholder-slate-550' 
                    : 'bg-slate-50 border-slate-200 focus:border-sky-550 text-slate-800 placeholder-slate-450'
                }`}
              />
            </div>

            {/* Link Optional Event Dropdown */}
            <div className="relative">
              <Link2 className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 h-4 w-4" />
              <select
                value={selectedEventId}
                onChange={(e) => setSelectedEventId(e.target.value)}
                className={`w-full pl-10 pr-4 py-2 rounded-xl border text-xs outline-none cursor-pointer transition-all ${
                  darkMode 
                    ? 'bg-slate-950 border-slate-800 focus:border-sky-500 text-slate-100' 
                    : 'bg-slate-50 border-slate-200 focus:border-sky-500 text-slate-800'
                }`}
              >
                <option value="">{currentLang === 'pt' ? 'Sem evento relacionado' : currentLang === 'en' ? 'Unlinked to an event' : 'Sin evento relacionado'}</option>
                {events.map(e => (
                  <option key={e.id} value={e.id}>{e.name}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="mt-4 pt-4 border-t dark:border-slate-805 border-slate-100 flex justify-end">
            <button
              onClick={handlePublish}
              className="inline-flex items-center justify-center px-4 py-2 border border-transparent rounded-xl text-xs font-semibold text-white bg-gradient-to-r from-sky-500 to-indigo-600 hover:opacity-95 transform hover:-translate-y-0.5 transition-all cursor-pointer shadow-md shadow-sky-500/10"
            >
              <Send className="h-3.5 w-3.5 mr-1.5" />
              {t('publish')}
            </button>
          </div>
        </div>
      ) : (
        <div className={`p-8 rounded-2xl border text-center border-dashed mb-8 ${
          darkMode ? 'bg-slate-900/40 border-slate-805 text-slate-400' : 'bg-slate-50 border-slate-200 text-slate-500'
        }`}>
          <p className="text-sm font-medium mb-3">
            {t('social_login')}
          </p>
          <button
            onClick={onOpenLogin}
            className="inline-flex items-center text-xs font-bold text-sky-400 hover:text-sky-350 hover:underline"
          >
            <Sparkles className="h-3.5 w-3.5 mr-1 animate-pulse" />
            {currentLang === 'pt' ? 'Iniciar sessão agora' : currentLang === 'en' ? 'Login into account' : 'Iniciar sesión en la red'}
          </button>
        </div>
      )}

      {/* Community Feed Posts */}
      <div className="space-y-6">
        {posts.length === 0 ? (
          <p className="text-center text-xs text-slate-500 dark:text-slate-450 py-8">
            {currentLang === 'pt' ? 'Nenhuma publicação criada no espaço social ainda.' : currentLang === 'en' ? 'No shared posts in this community board yet.' : 'Aún no existen publicaciones compartidas en este espacio comunitario.'}
          </p>
        ) : (
          posts.map((post) => {
            const hasCurrentUserLiked = currentUser ? post.liked_by.includes(currentUser.id) : false;

            return (
              <div
                key={post.id}
                className={`p-5 rounded-2xl border transition-all duration-305 ${
                  darkMode 
                    ? 'bg-slate-900/60 border-slate-800/80 hover:border-slate-750' 
                    : 'bg-white border-slate-200 hover:border-slate-300'
                }`}
              >
                {/* Post Header */}
                <div className="flex items-center justify-between mb-3.5">
                  <div 
                    onClick={() => onUserClick(post.user_id)}
                    className="flex items-center space-x-2.5 cursor-pointer hover:opacity-85"
                  >
                    <div className="h-8.5 w-8.5 rounded-full overflow-hidden bg-slate-800 border border-sky-455">
                      <img 
                        src={`https://images.unsplash.com/photo-${post.user_id === 154 ? '1500648767791-00dcc994a43e' : '1534528741775-53994a69daeb'}?q=80&w=200`} 
                        alt={post.user_name} 
                        className="w-full h-full object-cover" 
                      />
                    </div>
                    <div>
                      <strong className="text-xs sm:text-sm text-slate-900 dark:text-slate-100 block">{post.user_name}</strong>
                      <span className="text-[10px] text-slate-400">
                        {new Date(post.created_at).toLocaleDateString(currentLang === 'es' ? 'es-CL' : currentLang === 'pt' ? 'pt-BR' : 'en-US')}
                      </span>
                    </div>
                  </div>

                  {/* Optional Event label */}
                  {post.event_id && post.event_name && (
                    <span className="text-[9px] font-semibold px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/15 max-w-[150px] truncate">
                      📌 {post.event_name}
                    </span>
                  )}
                </div>

                {/* Post content text */}
                <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-350 leading-relaxed font-sans mt-2 whitespace-pre-wrap">
                  {post.content}
                </p>

                {/* Attached Image inside Social Feed */}
                {post.image && (
                  <div className="mt-3.5 rounded-xl overflow-hidden max-h-[300px] border dark:border-slate-805 border-slate-100">
                    <img
                      src={post.image}
                      alt="Attachment"
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                  </div>
                )}

                {/* Actions Toolbar */}
                <div className="mt-4 pt-3.5 border-t dark:border-slate-805/60 border-slate-100 flex items-center space-x-4">
                  {/* Like button reaction */}
                  <button
                    onClick={() => onPostLike(post.id)}
                    className={`inline-flex items-center space-x-1.5 text-xs font-semibold py-1.5 px-3 rounded-lg transition-colors cursor-pointer ${
                      hasCurrentUserLiked
                        ? 'bg-red-500/10 text-red-500'
                        : 'text-slate-400 dark:text-slate-400 hover:bg-slate-500/5 hover:text-slate-200'
                    }`}
                  >
                    <Heart className={`h-4.5 w-4.5 ${hasCurrentUserLiked ? 'fill-current' : ''}`} />
                    <span>{post.like_count}</span>
                  </button>

                  {/* Comment button toggling dialog */}
                  <button
                    onClick={() => onOpenComments(post.id)}
                    className="inline-flex items-center space-x-1.5 text-xs font-semibold text-slate-400 hover:text-sky-400 py-1.5 px-3 rounded-lg hover:bg-slate-500/5 transition-colors cursor-pointer"
                  >
                    <MessageSquare className="h-4.5 w-4.5" />
                    <span>{post.comment_count}</span>
                  </button>

                  {/* Simulated Share Link buttons */}
                  <button
                    onClick={() => {
                      alert('¡Enlace de publicación copiado para compartir con tus vecinos!');
                    }}
                    className="inline-flex items-center space-x-1 text-xs text-slate-400 hover:text-indigo-400 py-1.5 px-2 rounded-lg hover:bg-slate-500/5 transition-colors"
                  >
                    <Share2 className="h-4 w-4" />
                  </button>
                </div>

              </div>
            );
          })
        )}
      </div>

    </section>
  );
}
