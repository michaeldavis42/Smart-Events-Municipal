import React, { useState } from 'react';
import { X, Star, Calendar, MapPin, Award, Users, MessageSquare, ShieldAlert, CheckCircle, Search } from 'lucide-react';
import { transKeys, LangType } from '../translations';
import { User, EventModel, ReviewModel, SponsorModel, SocialCommentModel } from '../types';

interface ModalsProps {
  currentLang: LangType;
  darkMode: boolean;
  currentUser: User | null;
  setCurrentUser: (u: User | null) => void;
  activeModal: string | null; // 'login' | 'detail' | 'survey' | 'comments' | 'profile' | 'public' | 'search' | 'myreviews' | 'register-event'
  onClose: () => void;
  selectedEvent: EventModel | null;
  reviews: ReviewModel[];
  onAddReview: (rating: number, comment: string) => void;
  sponsors: SponsorModel[];
  comments: SocialCommentModel[];
  onAddComment: (content: string) => void;
  onSaveProfile: (company: string, bio: string, avatar: string, phone: string, web: string) => void;
  publicUser: User | null;
  allUsers: User[];
  onUserClick: (userId: number) => void;
  onRegisterEvent: (name: string, email: string) => void;
}

export default function Modals({
  currentLang,
  darkMode,
  currentUser,
  setCurrentUser,
  activeModal,
  onClose,
  selectedEvent,
  reviews,
  onAddReview,
  sponsors,
  comments,
  onAddComment,
  onSaveProfile,
  publicUser,
  allUsers,
  onUserClick,
  onRegisterEvent
}: ModalsProps) {
  // Login form views
  const [authView, setAuthView] = useState<'login' | 'register' | 'forgot'>('login');
  const [logEmail, setLogEmail] = useState('');
  const [logPw, setLogPw] = useState('');
  
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPw, setRegPw] = useState('');
  const [regRole, setRegRole] = useState<'user' | 'organizer'>('user');

  // Review states inside Event details
  const [ratingInput, setRatingInput] = useState(5);
  const [commentInput, setCommentInput] = useState('');

  // Comment input inside Post Comments panel
  const [socialCmtInput, setSocialCmtInput] = useState('');

  // Profile Form States
  const [profCompany, setProfCompany] = useState(currentUser?.company_name || '');
  const [profBio, setProfBio] = useState(currentUser?.bio || '');
  const [profAvatar, setProfAvatar] = useState(currentUser?.avatar_url || '');
  const [profPhone, setProfPhone] = useState(currentUser?.phone || '');
  const [profWeb, setProfWeb] = useState(currentUser?.website || '');

  // Registration states
  const [regCitizenName, setRegCitizenName] = useState(currentUser?.name || '');
  const [regCitizenEmail, setRegCitizenEmail] = useState(currentUser?.email || '');

  // Survey states
  const [surveySat, setSurveySat] = useState(5);
  const [surveyOpinion, setSurveyOpinion] = useState('');
  const [surveySuggest, setSurveySuggest] = useState('');

  // Search Citizens
  const [searchCitizenTerm, setSearchCitizenTerm] = useState('');

  const t = (key: keyof typeof transKeys['es']) => {
    return transKeys[currentLang]?.[key] || transKeys['es'][key] || key;
  };

  if (!activeModal) return null;

  // Custom stars indicators helper
  const renderStars = (rating: number, countOnly = false) => {
    const rInt = Math.round(rating);
    return (
      <div className="flex items-center text-yellow-450 text-xs sm:text-sm">
        {'★'.repeat(rInt) + '☆'.repeat(5 - rInt)}
      </div>
    );
  };

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!logEmail.includes('@')) {
      alert('Por favor ingresa un correo electrónico válido');
      return;
    }
    const mockUser: User = {
      id: Math.round(Math.random() * 892) + 200,
      name: logEmail.split('@')[0].toUpperCase(),
      email: logEmail,
      role: 'user',
      avatar_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200',
      bio: 'Ciudadano comprometido con el desarrollo local de mi comuna.',
      created_at: new Date().toISOString()
    };
    setCurrentUser(mockUser);
    alert('¡Bienvenido! Sesión de Ciudadano local iniciada con éxito.');
    onClose();
  };

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!regName.trim() || !regEmail.includes('@')) return;

    const mockUser: User = {
      id: Math.round(Math.random() * 892) + 200,
      name: regName,
      email: regEmail,
      role: regRole,
      avatar_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200',
      bio: 'Registrado recientemente en la plataforma SmartEvents.',
      created_at: new Date().toISOString()
    };
    setCurrentUser(mockUser);
    alert('Felicidades! Su cuenta de ' + (regRole === 'organizer' ? 'Organizador de eventos' : 'Ciudadano') + ' ha sido creada.');
    onClose();
  };

  const handlePostReview = () => {
    if (!commentInput.trim()) {
      alert('Por favor escribe tu reseña opinando sobre el evento.');
      return;
    }
    onAddReview(ratingInput, commentInput);
    setCommentInput('');
    alert('¡Reseña guardada en la ficha de Evento con éxito!');
  };

  const handlePostCommentService = () => {
    if (!socialCmtInput.trim()) return;
    onAddComment(socialCmtInput);
    setSocialCmtInput('');
  };

  const handleSaveProfileForm = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveProfile(profCompany, profBio, profAvatar, profPhone, profWeb);
    alert('Detalles de perfil comercial actualizados.');
    onClose();
  };

  const handleCalendarSync = (eName: string, eLoc: string, eDate: string) => {
    const formattedDate = eDate.replace(/-/g, '');
    const googleLink = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(eName)}&dates=${formattedDate}/${formattedDate}&details=SmartEvents+Municipal+Acreditado&location=${encodeURIComponent(eLoc)}`;
    window.open(googleLink, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm transition-all animate-fade-in">
      <div className={`relative w-full max-w-lg rounded-2xl border shadow-2xl p-6 sm:p-8 overflow-hidden transition-all ${
        darkMode ? 'bg-slate-900 border-slate-800 text-slate-100' : 'bg-white border-slate-205 text-slate-800'
      }`}>
        
        {/* Top Absolute Close */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-lg text-slate-400 hover:text-slate-100 dark:hover:bg-slate-800 hover:bg-slate-100 cursor-pointer"
        >
          <X className="h-5 w-5" />
        </button>

        {/* ======================================================== */}
        {/* LOGIN AND REGISTRATION POPUP */}
        {/* ======================================================== */}
        {activeModal === 'login' && (
          <div>
            {authView === 'login' && (
              <form onSubmit={handleLoginSubmit} className="space-y-4 text-xs sm:text-sm">
                <div className="text-center mb-6">
                  <h3 className="text-xl font-display font-extrabold text-slate-900 dark:text-white">Iniciar Sesión</h3>
                  <p className="text-xs text-slate-450 dark:text-slate-500 mt-1">Conéctate utilizando tu cuenta ciudadana de la comuna.</p>
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Correo Electrónico *</label>
                  <input
                    type="email"
                    required
                    placeholder="ej: vecino@dominio.cl"
                    value={logEmail}
                    onChange={(e) => setLogEmail(e.target.value)}
                    className={`w-full px-4 py-2.5 rounded-xl border outline-none ${
                      darkMode ? 'bg-slate-955 border-slate-800 focus:border-sky-505 text-slate-100' : 'bg-slate-50 border-slate-205 focus:border-sky-505 text-slate-850'
                    }`}
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Contraseña de Cuenta</label>
                  <input
                    type="password"
                    placeholder="Contraseña establecida..."
                    value={logPw}
                    onChange={(e) => setLogPw(e.target.value)}
                    className={`w-full px-4 py-2.5 rounded-xl border outline-none ${
                      darkMode ? 'bg-slate-955 border-slate-800 focus:border-sky-505 text-slate-100' : 'bg-slate-50 border-slate-205 focus:border-sky-505 text-slate-800'
                    }`}
                  />
                  <div className="mt-2 text-right">
                    <button
                      type="button"
                      onClick={() => setAuthView('forgot')}
                      className="text-[10px] text-indigo-400 hover:underline cursor-pointer"
                    >
                      ¿Olvidaste tu contraseña?
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full inline-flex items-center justify-center py-2.5 rounded-xl text-xs sm:text-sm font-semibold text-white bg-gradient-to-r from-sky-500 to-indigo-600 hover:opacity-95 transform hover:-translate-y-0.5 transition-all cursor-pointer shadow-md shadow-sky-500/10"
                >
                  Confirmar Ingreso
                </button>

                <div className="text-center pt-4 border-t dark:border-slate-850 border-slate-100">
                  <p className="text-xs text-slate-400">
                    ¿Aún no te has registrado de forma digital?{' '}
                    <button
                      type="button"
                      onClick={() => setAuthView('register')}
                      className="text-sky-400 hover:underline font-bold font-mono text-[11px] cursor-pointer"
                    >
                      Regístrate gratis
                    </button>
                  </p>
                </div>
              </form>
            )}

            {authView === 'register' && (
              <form onSubmit={handleRegisterSubmit} className="space-y-4 text-xs sm:text-sm">
                <div className="text-center mb-6">
                  <h3 className="text-xl font-display font-extrabold text-slate-900 dark:text-white">Crear cuenta gratuita</h3>
                  <p className="text-xs text-slate-450 dark:text-slate-500 mt-1">Conéctate gratis para participar en la cartelera urbana.</p>
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Nombre Completo *</label>
                  <input
                    type="text"
                    required
                    placeholder="ej: Sebastián Reyes"
                    value={regName}
                    onChange={(e) => setRegName(e.target.value)}
                    className={`w-full px-4 py-2.5 rounded-xl border outline-none ${
                      darkMode ? 'bg-slate-955 border-slate-800 focus:border-sky-505 text-slate-100' : 'bg-slate-50 border-slate-205 focus:border-sky-505 text-slate-850'
                    }`}
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Correo Electrónico *</label>
                  <input
                    type="email"
                    required
                    placeholder="vecino@gmail.com"
                    value={regEmail}
                    onChange={(e) => setRegEmail(e.target.value)}
                    className={`w-full px-4 py-2.5 rounded-xl border outline-none ${
                      darkMode ? 'bg-slate-955 border-slate-800 focus:border-sky-505 text-slate-100' : 'bg-slate-50 border-slate-205 focus:border-sky-505 text-slate-850'
                    }`}
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Contraseña de Acceso</label>
                  <input
                    type="password"
                    placeholder="Mínimo 6 carácteres..."
                    value={regPw}
                    onChange={(e) => setRegPw(e.target.value)}
                    className={`w-full px-4 py-2.5 rounded-xl border outline-none ${
                      darkMode ? 'bg-slate-955 border-slate-800 focus:border-sky-505 text-slate-100' : 'bg-slate-50 border-slate-205 focus:border-sky-505 text-slate-800'
                    }`}
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Rol en la Comuna *</label>
                  <select
                    value={regRole}
                    onChange={(e) => setRegRole(e.target.value as any)}
                    className={`w-full px-4 py-2.5 rounded-xl border outline-none cursor-pointer ${
                      darkMode ? 'bg-slate-955 border-slate-800 text-slate-100' : 'bg-slate-50 border-slate-205 text-slate-850'
                    }`}
                  >
                    <option value="user">Ciudadano Local</option>
                    <option value="organizer">Organizador Municipal / Proveedor</option>
                  </select>
                </div>

                <button
                  type="submit"
                  className="w-full inline-flex items-center justify-center py-2.5 rounded-xl text-xs sm:text-sm font-semibold text-white bg-gradient-to-r from-sky-500 to-indigo-600 hover:opacity-95 shadow-md shadow-sky-500/10 cursor-pointer"
                >
                  Registrarse ahora
                </button>

                <div className="text-center pt-4 border-t dark:border-slate-850 border-slate-100">
                  <p className="text-xs text-slate-400">
                    ¿Ya posees cuenta registrada?{' '}
                    <button
                      type="button"
                      onClick={() => setAuthView('login')}
                      className="text-sky-400 hover:underline font-bold text-[11px] cursor-pointer"
                    >
                      Inicia Sesión
                    </button>
                  </p>
                </div>
              </form>
            )}

            {authView === 'forgot' && (
              <div className="space-y-4 text-xs sm:text-sm">
                <div className="text-center mb-6">
                  <h3 className="text-xl font-display font-extrabold text-slate-900 dark:text-white">Recuperar Acceso</h3>
                  <p className="text-xs text-slate-450 dark:text-slate-500 mt-1">Escribe tu correo para enviarte instrucciones de reinicio.</p>
                </div>
                <input
                  type="email"
                  placeholder="ej: tu.correo@dominio.cl"
                  className={`w-full px-4 py-2.5 rounded-xl border outline-none ${
                    darkMode ? 'bg-slate-955 border-slate-800 text-slate-100' : 'bg-slate-50 border-slate-205 text-slate-850'
                  }`}
                />
                <button
                  onClick={() => {
                    alert('Instrucciones enviadas! Revisa tu bandeja de entrada o buzón de spam.');
                    setAuthView('login');
                  }}
                  className="w-full inline-flex items-center justify-center py-2.5 rounded-xl text-xs sm:text-sm font-semibold text-white bg-gradient-to-r from-sky-500 to-indigo-600 shadow-sm cursor-pointer"
                >
                  Enviar Instrucciones
                </button>
                <div className="text-center pt-2">
                  <button onClick={() => setAuthView('login')} className="text-xs text-slate-400 hover:underline">Volver atrás</button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ======================================================== */}
        {/* EVENT DETAILS VIEW (WITH REVIEWS PANEL & CALENDAR LINK) */}
        {/* ======================================================== */}
        {activeModal === 'detail' && selectedEvent && (
          <div className="space-y-5 text-xs sm:text-sm max-h-[85vh] overflow-y-auto pr-1">
            <div className="relative h-44 rounded-xl overflow-hidden bg-slate-800">
              <img 
                src={selectedEvent.image || 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?q=80&w=600'} 
                alt={selectedEvent.name} 
                className="w-full h-full object-cover" 
              />
              <div className="absolute top-3 left-3">
                <span className="text-[9px] font-bold px-2 py-0.5 rounded bg-slate-950/80 text-white border border-white/10 uppercase font-mono tracking-wider">
                  {selectedEvent.category}
                </span>
              </div>
            </div>

            <div>
              <h3 className="text-xl sm:text-2xl font-display font-black text-slate-900 dark:text-white leading-tight">
                {selectedEvent.name}
              </h3>
              <p className="text-xs text-slate-450 dark:text-slate-500 mt-1">
                Organizado por: <strong>{selectedEvent.organizer_name || 'Corporación Municipal'}</strong> ({selectedEvent.organizer_email})
              </p>
            </div>

            <p className="text-slate-650 dark:text-slate-350 leading-relaxed font-sans text-xs sm:text-sm">
              {selectedEvent.description || 'No hay una descripción detallada cargada en este catálogo para este concierto o taller.'}
            </p>

            <div className={`p-4 rounded-xl border space-y-2 ${
              darkMode ? 'bg-slate-950 border-slate-850' : 'bg-slate-50 border-slate-200'
            }`}>
              <p className="flex items-center text-slate-600 dark:text-slate-300">
                <Calendar className="h-4 w-4 mr-2.5 text-sky-400" />
                <span>Fecha: <strong>{selectedEvent.date}</strong></span>
              </p>
              <p className="flex items-center text-slate-600 dark:text-slate-300">
                <MapPin className="h-4 w-4 mr-2.5 text-sky-400" />
                <span>Recinto: <strong>{selectedEvent.location}</strong></span>
              </p>
              <p className="flex items-center text-slate-600 dark:text-slate-300">
                <Users className="h-4 w-4 mr-2.5 text-sky-400" />
                <span>Inscritos totales: <strong>{selectedEvent.participants} ({selectedEvent.slots} cupos)</strong></span>
              </p>
            </div>

            {/* Google Calendar export trigger */}
            <div className="flex flex-wrap gap-2 pt-2 pb-4">
              <button
                onClick={() => handleCalendarSync(selectedEvent.name, selectedEvent.location, selectedEvent.date)}
                className="inline-flex items-center px-4 py-2 rounded-xl text-xs font-bold text-white bg-sky-505 hover:bg-sky-500 hover:shadow-md cursor-pointer"
              >
                Agregar a Google Calendar
              </button>
            </div>

            {/* Private Sponsors List if attached */}
            {sponsors.length > 0 && (
              <div className="border-t dark:border-slate-805 border-slate-100 pt-4">
                <span className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-widest block mb-3">Marcas Patrocinadoras</span>
                <div className="grid grid-cols-2 gap-3">
                  {sponsors.map(spo => (
                    <div 
                      key={spo.id}
                      className={`p-3 rounded-xl border flex items-center gap-2.5 ${
                        darkMode ? 'bg-slate-950/80 border-slate-850' : 'bg-slate-50 border-slate-150'
                      }`}
                    >
                      {spo.logo_url && (
                        <img src={spo.logo_url} alt={spo.name} className="h-8 w-8 object-contain rounded-full border bg-white border-slate-200" />
                      )}
                      <div>
                        <strong className="text-[11px] block text-slate-900 dark:text-slate-205">{spo.name}</strong>
                        <p className="text-[9px] text-slate-450 line-clamp-1">{spo.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Letterboxd style Reviews listing */}
            <div className="border-t dark:border-slate-805 border-slate-100 pt-5 space-y-4 text-xs sm:text-sm">
              <span className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-widest block">Reseñas de la Comunidad</span>
              
              {/* Write Review input form if logged on */}
              {currentUser ? (
                <div className={`p-4 rounded-xl border space-y-3 ${
                  darkMode ? 'bg-slate-950 border-slate-850' : 'bg-slate-50 border-slate-200'
                }`}>
                  <strong className="block text-xs font-bold font-display uppercase tracking-wider text-sky-400">Calificar y Reseñar Evento</strong>
                  
                  {/* Interactive rating select */}
                  <div className="flex items-center gap-1">
                    <span className="text-xs text-slate-400 font-medium mr-2">Estrellas:</span>
                    {Array.from({ length: 5 }, (_, i) => (
                      <button
                        key={i}
                        type="button"
                        onClick={() => setRatingInput(i + 1)}
                        className={`text-lg transition-transform ${
                          i < ratingInput ? 'text-yellow-405 transform scale-110' : 'text-slate-400 dark:text-slate-600'
                        }`}
                      >
                        ★
                      </button>
                    ))}
                  </div>

                  <textarea
                    value={commentInput}
                    onChange={(e) => setCommentInput(e.target.value)}
                    placeholder="Opina con franqueza acerca de los horarios, artistas o logística..."
                    rows={2}
                    className={`w-full p-3 rounded-lg border text-xs sm:text-sm outline-none resize-none ${
                      darkMode ? 'bg-slate-900 border-slate-805 text-slate-100' : 'bg-white border-slate-255 text-slate-800'
                    }`}
                  />
                  
                  <div className="flex justify-end">
                    <button
                      onClick={handlePostReview}
                      className="px-4 py-1.5 rounded-lg text-[10px] font-bold text-white bg-sky-505 hover:bg-sky-550 cursor-pointer shadow-md shadow-sky-500/10"
                    >
                      Publicar Reseña
                    </button>
                  </div>
                </div>
              ) : (
                <p className="text-xs text-slate-550 dark:text-slate-450 italic">
                  Inicia sesión para opinar de este espectáculo.
                </p>
              )}

              {/* Reviews Scroll layout */}
              <div className="space-y-3.5 max-h-[250px] overflow-y-auto pr-1">
                {reviews.filter(r => r.event_id === selectedEvent.id).length === 0 ? (
                  <p className="text-[10px] text-slate-500 italic">No hay calificaciones de espectadores cargadas aún.</p>
                ) : (
                  reviews.filter(r => r.event_id === selectedEvent.id).map(rev => (
                    <div 
                      key={rev.id}
                      className={`p-3.5 rounded-xl border space-y-1.5 ${
                        darkMode ? 'bg-slate-950/40 border-slate-805' : 'bg-slate-50 border-slate-200'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <strong 
                          onClick={() => { onUserClick(rev.user_id); }}
                          className="text-xs text-sky-400 hover:underline cursor-pointer block font-semibold"
                        >
                          {rev.user_name}
                        </strong>
                        {renderStars(rev.rating)}
                      </div>
                      <p className="text-xs text-slate-655 dark:text-slate-350 leading-relaxed pr-1">{rev.comment}</p>
                      <span className="text-[9px] text-slate-500 font-mono block">
                        {new Date(rev.created_at).toLocaleDateString()}
                      </span>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* POST COMMENTS LIST DIALOG MODAL */}
        {/* ======================================================== */}
        {activeModal === 'comments' && (
          <div className="space-y-4 text-xs sm:text-sm">
            <div className="border-b dark:border-slate-805 border-slate-100 pb-3 mb-4">
              <h3 className="text-lg font-display font-extrabold text-slate-900 dark:text-white flex items-center">
                <MessageSquare className="h-5 w-5 text-sky-400 mr-2" />
                Hilo de Comentarios
              </h3>
            </div>

            {/* Insertion Box */}
            {currentUser ? (
              <div className="flex gap-2">
                <input
                  type="text"
                  value={socialCmtInput}
                  onChange={(e) => setSocialCmtInput(e.target.value)}
                  placeholder="Añade una respuesta vecinal..."
                  className={`flex-1 px-4 py-2.5 rounded-xl border outline-none text-xs sm:text-sm ${
                    darkMode ? 'bg-slate-950 border-slate-800 focus:border-sky-505 text-slate-100' : 'bg-slate-50 border-slate-205 focus:border-sky-505 text-slate-850'
                  }`}
                />
                <button
                  onClick={handlePostCommentService}
                  className="px-4 py-2.5 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-sky-500 to-indigo-650 cursor-pointer shadow-sm"
                >
                  Comentar
                </button>
              </div>
            ) : (
              <p className="text-xs text-slate-500 italic">Inicia sesión como ciudadano para participar en el foro.</p>
            )}

            {/* List scroll */}
            <div className="space-y-3.5 max-h-[350px] overflow-y-auto pr-1">
              {comments.length === 0 ? (
                <p className="text-[10px] text-slate-500 italic py-4 text-center">No hay respuestas escritas aún para esta publicación.</p>
              ) : (
                comments.map(cmt => (
                  <div 
                    key={cmt.id}
                    className={`p-3 rounded-xl border ${
                      darkMode ? 'bg-slate-950/70 border-slate-850' : 'bg-slate-50 border-slate-200'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <strong 
                        onClick={() => onUserClick(cmt.user_id)}
                        className="text-xs text-sky-400 hover:underline cursor-pointer"
                      >
                        {cmt.user_name}
                      </strong>
                      <span className="text-[9px] text-slate-500 font-mono">
                        {new Date(cmt.created_at).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="text-xs text-slate-655 dark:text-slate-350 leading-relaxed pr-1">{cmt.content}</p>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* POST-EVENT CITIZEN SATISFACTION SURVEY */}
        {/* ======================================================== */}
        {activeModal === 'survey' && selectedEvent && (
          <div className="space-y-4 text-xs sm:text-sm">
            <div className="text-center mb-4">
              <h3 className="text-lg font-display font-black text-slate-900 dark:text-white flex items-center justify-center gap-1.5">
                <Award className="h-5.5 w-5.5 text-sky-400" />
                {t('survey_title')}
              </h3>
              <p className="text-[10px] text-slate-500 mt-1 uppercase font-mono">{selectedEvent.name}</p>
            </div>

            <div className="space-y-3.5">
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">{t('survey_sat')} (1-5)</label>
                <div className="flex items-center gap-1.5">
                  {Array.from({ length: 5 }, (_, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => setSurveySat(i + 1)}
                      className={`text-2xl transition-transform cursor-pointer ${
                        i < surveySat ? 'text-yellow-405 scale-110' : 'text-slate-400 dark:text-slate-600'
                      }`}
                    >
                      ★
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">{t('survey_opinion')}</label>
                <textarea
                  value={surveyOpinion}
                  onChange={(e) => setSurveyOpinion(e.target.value)}
                  placeholder="Dinos tu opinión sobre el sonido, organización..."
                  rows={2}
                  className={`w-full p-3 rounded-xl border text-xs sm:text-sm outline-none resize-none ${
                    darkMode ? 'bg-slate-950 border-slate-800 text-slate-100' : 'bg-slate-50 border-slate-205 text-slate-850'
                  }`}
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">{t('survey_suggest')}</label>
                <textarea
                  value={surveySuggest}
                  onChange={(e) => setSurveySuggest(e.target.value)}
                  placeholder="¿Qué te gustaría ver en los próximos eventos de la comuna?"
                  rows={2}
                  className={`w-full p-3 rounded-xl border text-xs sm:text-sm outline-none resize-none ${
                    darkMode ? 'bg-slate-955 border-slate-800 text-slate-100' : 'bg-slate-50 border-slate-205 text-slate-850'
                  }`}
                />
              </div>

              <button
                onClick={() => {
                  alert('¡Muchísimas gracias por ayudarnos a auditar la calidad municipal!\nSu encuesta ha quedado registrada en las bases de datos de la alcaldía.');
                  onClose();
                  setSurveyOpinion('');
                  setSurveySuggest('');
                }}
                className="w-full inline-flex items-center justify-center py-2.5 rounded-xl text-xs sm:text-sm font-semibold text-white bg-gradient-to-r from-sky-500 to-indigo-600 shadow-sm cursor-pointer"
              >
                {t('survey_submit')}
              </button>
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* CITIZEN PROFILE SETTER FORM MODAL */}
        {/* ======================================================== */}
        {activeModal === 'profile' && currentUser && (
          <form onSubmit={handleSaveProfileForm} className="space-y-4 text-xs sm:text-sm">
            <div className="text-center mb-4">
              <h3 className="text-lg font-display font-extrabold text-slate-900 dark:text-white">Editar mi Ficha Personal</h3>
              <p className="text-xs text-slate-450 dark:text-slate-500 mt-1">Sintoniza cómo te verán tus vecinos en los foros.</p>
            </div>

            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">Nombre Institucional o Empresa</label>
              <input
                type="text"
                value={profCompany}
                onChange={(e) => setProfCompany(e.target.value)}
                placeholder="ej: Emprendimientos Vitacura"
                className={`w-full px-4 py-2.5 rounded-xl border outline-none ${
                  darkMode ? 'bg-slate-950 border-slate-800 text-slate-100' : 'bg-slate-50 border-slate-205 text-slate-850'
                }`}
              />
            </div>

            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">Teléfono Movil</label>
              <input
                type="text"
                value={profPhone}
                onChange={(e) => setProfPhone(e.target.value)}
                placeholder="ej: +56 9 1234 5678"
                className={`w-full px-4 py-2.5 rounded-xl border outline-none ${
                  darkMode ? 'bg-slate-955 border-slate-800 text-slate-100' : 'bg-slate-50 border-slate-205 text-slate-850'
                }`}
              />
            </div>

            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">Sitio Web / Link Social</label>
              <input
                type="text"
                value={profWeb}
                onChange={(e) => setProfWeb(e.target.value)}
                placeholder="ej: https://porfolio.com"
                className={`w-full px-4 py-2.5 rounded-xl border outline-none ${
                  darkMode ? 'bg-slate-955 border-slate-800 text-slate-100' : 'bg-slate-50 border-slate-205 text-slate-850'
                }`}
              />
            </div>

            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">Avatar URL (Imagen)</label>
              <input
                type="url"
                value={profAvatar}
                onChange={(e) => setProfAvatar(e.target.value)}
                className={`w-full px-4 py-2.5 rounded-xl border outline-none ${
                  darkMode ? 'bg-slate-955 border-slate-805 text-slate-100' : 'bg-slate-50 border-slate-205 text-slate-850'
                }`}
              />
            </div>

            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">Biografía Ciudadana</label>
              <textarea
                value={profBio}
                rows={2}
                onChange={(e) => setProfBio(e.target.value)}
                placeholder="Cuéntanos un poco sobre ti, de qué sector eres..."
                className={`w-full p-3 rounded-xl border text-xs sm:text-sm outline-none resize-none ${
                  darkMode ? 'bg-slate-955 border-slate-800 text-slate-105' : 'bg-slate-50 border-slate-205 text-slate-850'
                }`}
              />
            </div>

            <button
              type="submit"
              className="w-full inline-flex items-center justify-center py-2.5 rounded-xl text-xs sm:text-sm font-semibold text-white bg-gradient-to-r from-sky-500 to-indigo-650 cursor-pointer shadow-sm"
            >
              Guardar Cambios de Perfil
            </button>
          </form>
        )}

        {/* ======================================================== */}
        {/* PUBLIC PROFILE VIEWER FOR CITIZEN CARDS */}
        {/* ======================================================== */}
        {activeModal === 'public' && publicUser && (
          <div className="space-y-4 text-xs sm:text-sm">
            <div className="flex items-center space-x-3.5 border-b dark:border-slate-805 border-slate-100 pb-4 mb-3">
              <img 
                src={publicUser.avatar_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200'} 
                alt={publicUser.name} 
                className="h-14 w-14 rounded-full object-cover border-2 border-indigo-505" 
              />
              <div>
                <h3 className="text-lg font-display font-black text-slate-900 dark:text-white leading-tight">{publicUser.name}</h3>
                <span className="text-[10px] font-mono font-bold bg-indigo-550/10 text-indigo-400 border border-indigo-500/15 px-2 py-0.5 rounded uppercase mt-1 inline-block">
                  {publicUser.role === 'admin' ? 'Administración' : publicUser.role === 'organizer' ? 'Organizador Autorizado' : 'Ciudadano local'}
                </span>
              </div>
            </div>

            <div className="space-y-3">
              <p className="text-slate-700 dark:text-slate-350 leading-relaxed font-sans mt-2 italic">
                "{publicUser.bio || 'Sin biografía escrita en el registro local.'}"
              </p>

              {publicUser.company_name && (
                <div className={`p-4 rounded-xl border ${
                  darkMode ? 'bg-slate-955 border-slate-855' : 'bg-slate-50 border-slate-200'
                }`}>
                  <strong className="block text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-1">Nombre Comercial institucional</strong>
                  <p className="text-xs font-bold text-slate-850 dark:text-white">{publicUser.company_name}</p>
                  
                  {publicUser.phone && (
                    <p className="text-[11px] text-slate-450 mt-1">Fono: {publicUser.phone}</p>
                  )}
                  {publicUser.website && (
                    <p className="text-[11px] text-sky-400 mt-0.5 truncate hover:underline">
                      <a href={publicUser.website} target="_blank" rel="noreferrer">{publicUser.website}</a>
                    </p>
                  )}
                </div>
              )}
            </div>

            <div className="pt-2 flex justify-end">
              <button
                onClick={onClose}
                className="px-4 py-2 rounded-xl text-xs font-bold text-slate-100 bg-slate-800 hover:bg-slate-750 cursor-pointer"
              >
                Cerrar Ventana
              </button>
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* CITIZENS SEARCH DIALOG MODAL */}
        {/* ======================================================== */}
        {activeModal === 'search' && (
          <div className="space-y-4 text-xs sm:text-sm">
            <h3 className="text-lg font-display font-extrabold text-slate-900 dark:text-white flex items-center">
              <Search className="h-5 w-5 text-sky-400 mr-2 animate-bounce" />
              Directorio de Ciudadanos
            </h3>

            <input
              type="text"
              value={searchCitizenTerm}
              onChange={(e) => setSearchCitizenTerm(e.target.value)}
              placeholder="Filtre listado por nombre, rol o email..."
              className={`w-full px-4 py-2.5 rounded-xl border outline-none ${
                darkMode ? 'bg-slate-950 border-slate-800 text-slate-100' : 'bg-slate-50 border-slate-205 text-slate-850'
              }`}
            />

            <div className="space-y-2.5 max-h-[300px] overflow-y-auto pr-1">
              {allUsers.filter(u => u.name.toLowerCase().includes(searchCitizenTerm.toLowerCase()) || u.role.toLowerCase().includes(searchCitizenTerm.toLowerCase())).length === 0 ? (
                <p className="text-center text-[10px] text-slate-550 italic py-4">No se hallaron ciudadanos vinculados con este filtro.</p>
              ) : (
                allUsers.filter(u => u.name.toLowerCase().includes(searchCitizenTerm.toLowerCase()) || u.role.toLowerCase().includes(searchCitizenTerm.toLowerCase())).map(u => (
                  <div
                    key={u.id}
                    onClick={() => { onUserClick(u.id); }}
                    className={`p-3.5 rounded-xl border flex items-center justify-between cursor-pointer transition-all hover:translate-x-1 ${
                      darkMode ? 'bg-slate-950/70 border-slate-850 hover:border-slate-700' : 'bg-slate-50 border-slate-200 hover:border-sky-400'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <img src={u.avatar_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200'} alt={u.name} className="h-8 w-8 rounded-full object-cover border border-sky-400" />
                      <div>
                        <strong className="block text-xs font-semibold text-slate-850 dark:text-slate-200">{u.name}</strong>
                        <span className="text-[10px] text-slate-450">{u.email}</span>
                      </div>
                    </div>
                    <span className="text-[9px] font-mono font-bold bg-indigo-500/10 text-indigo-400 border border-indigo-500/15 px-1.5 py-0.5 rounded uppercase">
                      {u.role === 'admin' ? 'Coordinador' : u.role === 'organizer' ? 'Organizador' : 'Vecino'}
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* ENROLLMENT CITIZEN REGISTRATION MODAL */}
        {/* ======================================================== */}
        {activeModal === 'register-event' && selectedEvent && (
          <form 
            onSubmit={(e) => {
              e.preventDefault();
              onRegisterEvent(regCitizenName, regCitizenEmail);
              onClose();
            }}
            className="space-y-4 text-xs sm:text-sm"
          >
            <div className="text-center mb-4">
              <h3 className="text-lg font-display font-extrabold text-slate-900 dark:text-white flex items-center justify-center gap-1.5">
                <CheckCircle className="h-5.5 w-5.5 text-emerald-500" />
                Inscripción de Ciudadano
              </h3>
              <p className="text-[10px] text-emerald-450 uppercase tracking-widest mt-1 font-mono">{selectedEvent.name}</p>
            </div>

            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed text-center">
              Tu inscripción es completamente gratuita respaldada por el presupuesto social municipal. Por favor confirma tus datos de asistencia técnica.
            </p>

            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">Nombre Completo *</label>
              <input
                type="text"
                required
                value={regCitizenName}
                onChange={(e) => setRegCitizenName(e.target.value)}
                placeholder="ej: Sebastián Reyes"
                className={`w-full px-4 py-2.5 rounded-xl border outline-none ${
                  darkMode ? 'bg-slate-950 border-slate-800 text-slate-100' : 'bg-slate-50 border-slate-205 text-slate-850'
                }`}
              />
            </div>

            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">Correo Ciudadano *</label>
              <input
                type="email"
                required
                value={regCitizenEmail}
                onChange={(e) => setRegCitizenEmail(e.target.value)}
                placeholder="ej: vecino@dominio.cl"
                className={`w-full px-4 py-2.5 rounded-xl border outline-none ${
                  darkMode ? 'bg-slate-955 border-slate-800 text-slate-100' : 'bg-slate-50 border-slate-205 text-slate-850'
                }`}
              />
            </div>

            <button
              type="submit"
              className="w-full inline-flex items-center justify-center py-2.5 rounded-xl text-xs sm:text-sm font-semibold text-white bg-gradient-to-r from-sky-500 to-indigo-650 cursor-pointer shadow-sm shadow-sky-500/10"
            >
              Confirmar Inscripción Gratuita
            </button>
          </form>
        )}

        {/* ======================================================== */}
        {/* MY ENROLLED REVIEWS SUMMARY MODAL LIST */}
        {/* ======================================================== */}
        {activeModal === 'myreviews' && (
          <div className="space-y-4 text-xs sm:text-sm">
            <h3 className="text-lg font-display font-extrabold text-slate-900 dark:text-white flex items-center">
              <Star className="h-5 w-5 text-yellow-450 mr-2 fill-current" />
              Mi Historial de Calificaciones
            </h3>

            <div className="space-y-3 max-h-[350px] overflow-y-auto pr-1">
              {reviews.filter(r => currentUser && r.user_id === currentUser.id).length === 0 ? (
                <p className="text-center text-[10px] text-slate-500 py-6 italic">Aún no has escrito reseñas en la cartelera municipal para ningún evento de la agenda.</p>
              ) : (
                reviews.filter(r => currentUser && r.user_id === currentUser.id).map(r => {
                  const correlatedEvent = selectedEvent; // Simulated fallback or standard labels
                  return (
                    <div 
                      key={r.id}
                      className={`p-3.5 rounded-xl border space-y-1 ${
                        darkMode ? 'bg-slate-950/85 border-slate-850' : 'bg-slate-50 border-slate-200'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <strong className="text-xs text-sky-400 block font-semibold">Valoración general</strong>
                        {renderStars(r.rating)}
                      </div>
                      <p className="text-xs text-slate-655 dark:text-slate-350 leading-relaxed pr-1">"{r.comment}"</p>
                      <span className="text-[9px] text-slate-500 font-mono block">Enviada el: {new Date(r.created_at).toLocaleDateString()}</span>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
