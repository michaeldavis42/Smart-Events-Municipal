import { useState, useEffect } from 'react';
import { Award, Mail, Phone, Facebook, Instagram, Twitter } from 'lucide-react';

// Components
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Features from './components/Features';
import Timeline from './components/Timeline';
import EventCatalog from './components/EventCatalog';
import SocialFeed from './components/SocialFeed';
import AnalyticsDashboard from './components/AnalyticsDashboard';
import ProviderHub from './components/ProviderHub';
import AdminPanel from './components/AdminPanel';
import Modals from './components/Modals';

// Data, API and Models
import { INITIAL_EVENTS, INITIAL_SPONSORS, INITIAL_REVIEWS, INITIAL_POSTS } from './data';
import { EventModel, SponsorModel, ReviewModel, SocialPostModel, SocialCommentModel, User } from './types';
import { transKeys, LangType } from './translations';
import * as api from './api';

export default function App() {
  // Global States with local storage initialization
  const [currentLang, setLang] = useState<LangType>(() => {
    return (localStorage.getItem('lang') as LangType) || 'es';
  });

  const [darkMode, setDarkMode] = useState<boolean>(() => {
    const saved = localStorage.getItem('darkMode');
    return saved !== null ? JSON.parse(saved) : true;
  });

  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    const stored = localStorage.getItem('user');
    if (stored) return JSON.parse(completedSet(stored));
    // Default initial seeded citizen user for immediate interaction
    return {
      id: 154,
      name: "Vecino Destacado",
      email: "carlos.m@municipalidad.cl",
      role: "admin",
      avatar_url: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=200",
      bio: "Amante del running, la fotografía social y el desarrollo cultural de nuestra comuna.",
      company_name: "Deportes Recoleta SpA",
      created_at: "2026-06-19T10:00:00Z"
    };
  });

  const [activeSection, setActiveSection] = useState('inicio');

  // Database states
  const [events, setEvents] = useState<EventModel[]>(() => {
    const stored = localStorage.getItem('events');
    return stored ? JSON.parse(stored) : INITIAL_EVENTS;
  });

  const [sponsors, setSponsors] = useState<SponsorModel[]>(() => {
    const stored = localStorage.getItem('sponsors');
    return stored ? JSON.parse(stored) : INITIAL_SPONSORS;
  });

  const [reviews, setReviews] = useState<ReviewModel[]>(() => {
    const stored = localStorage.getItem('reviews');
    return stored ? JSON.parse(stored) : INITIAL_REVIEWS;
  });

  const [posts, setPosts] = useState<SocialPostModel[]>(() => {
    const stored = localStorage.getItem('posts');
    return stored ? JSON.parse(stored) : INITIAL_POSTS;
  });

  // Modal control states
  const [activeModal, setActiveModal] = useState<string | null>(null);
  const [selectedEventId, setSelectedEventId] = useState<number | null>(null);
  
  // Comments thread state related to selected post
  const [selectedPostId, setSelectedPostId] = useState<number | null>(null);
  const [comments, setComments] = useState<SocialCommentModel[]>([]);

  // Public User state
  const [publicUser, setPublicUser] = useState<User | null>(null);

  // Geolocation Coords
  const [userCoords, setUserCoords] = useState<{ lat: number; lng: number } | null>(null);

  // Language helper translation key extractor
  const t = (key: keyof typeof transKeys['es']) => {
    return transKeys[currentLang]?.[key] || transKeys['es'][key] || key;
  };

  // Synchronize Dark / Light modes on mount/update
  useEffect(() => {
    localStorage.setItem('darkMode', JSON.stringify(darkMode));
    if (darkMode) {
      document.documentElement.classList.add('dark');
      document.body.style.backgroundColor = '#090d16';
    } else {
      document.documentElement.classList.remove('dark');
      document.body.style.backgroundColor = '#f8fafc';
    }
  }, [darkMode]);

  // Synchronize dynamic databases back inside Local Storage
  useEffect(() => {
    localStorage.setItem('events', JSON.stringify(events));
  }, [events]);

  useEffect(() => {
    localStorage.setItem('sponsors', JSON.stringify(sponsors));
  }, [sponsors]);

  useEffect(() => {
    localStorage.setItem('reviews', JSON.stringify(reviews));
  }, [reviews]);

  useEffect(() => {
    localStorage.setItem('posts', JSON.stringify(posts));
  }, [posts]);

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('user', JSON.stringify(currentUser));
    } else {
      localStorage.removeItem('user');
    }
  }, [currentUser]);

  useEffect(() => {
    localStorage.setItem('lang', currentLang);
  }, [currentLang]);

  function completedSet(stored: string): string {
    return stored;
  }

  // Citizen directory state (fetched from backend + local fallback)
  const [citizens, setCitizens] = useState<User[]>(() => {
    const stored = localStorage.getItem('citizens');
    if (stored) return JSON.parse(stored);
    return [
      { id: 101, name: "Camila Jara", email: "camila.jara@gmail.com", role: "user", bio: "Gusto por las artes visuales y los talleres literarios al aire libre.", avatar_url: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200", created_at: "2026-06-15" },
      { id: 102, name: "Sebastián Reyes", email: "seba.reyes@duocuc.cl", role: "user", bio: "Estudiante de turismo aventura y apasionado del trail running municipal.", created_at: "2026-06-10" },
      { id: 103, name: "María José Allende", email: "cote.allende@nunoa.cl", role: "user", bio: "Vecina activa de Ñuñoa. Madre de dos pequeños inventores.", created_at: "2026-06-12" },
      { id: 154, name: "Vecino Destacado", email: "carlos.m@municipalidad.cl", role: "admin", bio: "Ayudando en la logística y reportes analíticos de nuestra comuna.", created_at: "2026-06-18" }
    ];
  });

  // Fetch all data from backend on mount
  useEffect(() => {
    api.auth.citizens().then(data => {
      const mapped = data.map(u => ({
        id: u.id, name: u.name, email: u.email, role: u.role,
        bio: '', avatar_url: '',
        created_at: u.created_at || new Date().toISOString()
      }));
      setCitizens(mapped);
      localStorage.setItem('citizens', JSON.stringify(mapped));
    }).catch(() => {});

    api.events.list().then(data => {
      const mapped = data as unknown as EventModel[];
      if (mapped.length > 0) { setEvents(mapped); localStorage.setItem('events', JSON.stringify(mapped)); }
    }).catch(() => {});

    api.social.list().then(data => {
      const mapped = data as unknown as SocialPostModel[];
      if (mapped.length > 0) { setPosts(mapped); localStorage.setItem('posts', JSON.stringify(mapped)); }
    }).catch(() => {});
  }, []);

  const getAllCitizens = (): User[] => citizens;

  // Modals operations
  const handleOpenEventDetail = (id: number) => {
    setSelectedEventId(id);
    setActiveModal('detail');
  };

  const handleOpenRegistration = (id: number) => {
    setSelectedEventId(id);
    setActiveModal('register-event');
  };

  const handleOpenCommentsModal = (postId: number) => {
    setSelectedPostId(postId);
    const mockComments: SocialCommentModel[] = [
      { id: 1, post_id: postId, user_id: 102, user_name: "Sebastián Reyes", content: "¡Gran publicación vecino! Estaré atento si abren más vacantes.", created_at: "2026-06-19T16:00:00Z" },
      { id: 2, post_id: postId, user_id: 103, user_name: "María José Allende", content: "¡Concuerdo plenamente! Excelente iniciativa.", created_at: "2026-06-19T17:15:00Z" }
    ];
    // Check if we have some comment in memory or fall back to mock
    setComments(mockComments);
    setActiveModal('comments');
  };

  const handleOpenUserProfile = () => {
    setActiveModal('profile');
  };

  const handleOpenSearchCitizens = () => {
    setActiveModal('search');
  };

  const handleOpenMyReviews = () => {
    setActiveModal('myreviews');
  };

  const handleShowPublicProfile = (userId: number) => {
    const list = getAllCitizens();
    const found = list.find(u => u.id === userId);
    if (found) {
      setPublicUser(found);
      setActiveModal('public');
    } else {
      alert("Usuario no hallado en el directorio local de la comuna.");
    }
  };

  // Add items callbacks
  const handleAddReview = async (rating: number, comment: string) => {
    if (!currentUser || !selectedEventId) return;
    try {
      await api.reviews.create(selectedEventId, rating, comment);
      const newRev: ReviewModel = {
        id: Date.now(),
        event_id: selectedEventId,
        user_id: currentUser.id,
        user_name: currentUser.name,
        rating,
        comment,
        created_at: new Date().toISOString()
      };
      setReviews([newRev, ...reviews]);
    } catch { /* backend offline, keep local */ }
  };

  const handleAddComment = async (content: string) => {
    if (!currentUser || !selectedPostId) return;
    try {
      await api.social.addComment(selectedPostId, content);
      const newCmt: SocialCommentModel = {
        id: Date.now(),
        post_id: selectedPostId,
        user_id: currentUser.id,
        user_name: currentUser.name,
        content,
        created_at: new Date().toISOString()
      };
      setComments([...comments, newCmt]);
      setPosts(posts.map(p => p.id === selectedPostId ? { ...p, comment_count: p.comment_count + 1 } : p));
    } catch { /* backend offline, keep local */ }
  };

  const handlePostLike = async (postId: number) => {
    if (!currentUser) {
      alert('Debes iniciar sesión para reaccionar a publicaciones.');
      setActiveModal('login');
      return;
    }
    try {
      await api.social.toggleLike(postId);
    } catch { /* backend offline */ }
    setPosts(posts.map(p => {
      if (p.id === postId) {
        const liked = p.liked_by.includes(currentUser.id);
        const nextLikedBy = liked 
          ? p.liked_by.filter(id => id !== currentUser.id)
          : [...p.liked_by, currentUser.id];
        return {
          ...p,
          liked_by: nextLikedBy,
          like_count: p.like_count + (liked ? -1 : 1)
        };
      }
      return p;
    }));
  };

  const handleAddPost = async (text: string, imageUrl?: string, eventId?: number) => {
    if (!currentUser) return;
    try {
      const result = await api.social.create(text, imageUrl, eventId) as any;
      const eventNameFound = events.find(e => e.id === eventId)?.name;
      const newPost: SocialPostModel = {
        id: result.id || Date.now(),
        user_id: currentUser.id,
        user_name: currentUser.name,
        content: text,
        image: imageUrl,
        event_id: eventId,
        event_name: eventNameFound,
        like_count: 0,
        comment_count: 0,
        liked_by: [],
        created_at: new Date().toISOString()
      };
      setPosts([newPost, ...posts]);
    } catch { /* backend offline */ }
  };

  const handleSaveProfile = async (company: string, bio: string, avatar: string, phone: string, web: string) => {
    if (!currentUser) return;
    try {
      await api.auth.updateProfile({ company_name: company, bio, avatar_url: avatar, phone, website: web });
    } catch { /* backend offline */ }
    setCurrentUser({ ...currentUser, company_name: company, bio, avatar_url: avatar, phone, website: web });
  };

  const handleEventEnrollment = async (name: string, email: string) => {
    if (!selectedEventId) return;
    try {
      await api.registrations.create(selectedEventId, name, email);
    } catch { /* backend offline */ }
    setEvents(events.map(ev => {
      if (ev.id === selectedEventId) return { ...ev, participants: ev.participants + 1 };
      return ev;
    }));
    setTimeout(() => {
      if (confirm('¡Inscripción ciudadana exitosa!\n¿Te gustaría responder la encuesta rápida de satisfacción?')) {
        setActiveModal('survey');
      }
    }, 550);
  };

  const handleTriggerPush = () => {
    if (!("Notification" in window)) {
      alert("Su navegador no tiene permisos de notificación. Simulación: ¡Hay un concierto programado mañana!");
      return;
    }
    Notification.requestPermission().then((permission) => {
      if (permission === "granted") {
        new Notification("SmartEvents Municipal", {
          body: "¡Alerta Vecino! Se halla un nuevo evento cultural 'Festival Lumínico' programado cerca de tu sector esta semana. ¡No te lo pierdas!",
          icon: "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?q=80&w=100"
        });
      } else {
        alert("Simulación de notificación Push: ¡Alerta Vecino! Festival Lumínico se inaugurará mañana a las 20:00 hrs.");
      }
    });
  };

  return (
    <div id="inicio" className={`min-h-screen transition-colors duration-300 font-sans ${
      darkMode ? 'bg-[#090d16] text-[#faf9f9]' : 'bg-slate-50 text-slate-800'
    }`}>
      
      {/* Navigation menu */}
      <Navbar
        currentLang={currentLang}
        setLang={setLang}
        darkMode={darkMode}
        setDarkMode={setDarkMode}
        currentUser={currentUser}
        setCurrentUser={setCurrentUser}
        onOpenLogin={() => { setActiveModal('login'); }}
        onOpenMyReviews={handleOpenMyReviews}
        onOpenProfile={handleOpenUserProfile}
        onOpenSearch={handleOpenSearchCitizens}
        activeSection={activeSection}
        setActiveSection={setActiveSection}
      />

      {/* Main presentation page */}
      <main className="pb-12">
        <Hero
          currentLang={currentLang}
          darkMode={darkMode}
          onExploreClick={() => {
            const el = document.getElementById('eventos');
            if (el) el.scrollIntoView({ behavior: 'smooth' });
          }}
        />

        <Features currentLang={currentLang} darkMode={darkMode} />

        <Timeline
          currentLang={currentLang}
          darkMode={darkMode}
          events={events}
          onEventClick={handleOpenEventDetail}
        />

        <EventCatalog
          currentLang={currentLang}
          darkMode={darkMode}
          events={events}
          reviews={reviews}
          onEventClick={handleOpenEventDetail}
          onRegisterClick={handleOpenRegistration}
          userCoords={userCoords}
          setUserCoords={setUserCoords}
        />

        <SocialFeed
          currentLang={currentLang}
          darkMode={darkMode}
          posts={posts}
          events={events}
          currentUser={currentUser}
          onOpenLogin={() => { setActiveModal('login'); }}
          onPostLike={handlePostLike}
          onOpenComments={handleOpenCommentsModal}
          onAddPost={handleAddPost}
          onUserClick={handleShowPublicProfile}
        />

        <AnalyticsDashboard
          currentLang={currentLang}
          darkMode={darkMode}
          events={events}
          onTriggerPush={handleTriggerPush}
        />

        <ProviderHub
          currentLang={currentLang}
          darkMode={darkMode}
          events={events}
        />

        {currentUser && (currentUser.role === 'admin' || currentUser.role === 'organizer') && (
          <AdminPanel
            currentLang={currentLang}
            darkMode={darkMode}
            events={events}
            onAddEvent={(newEv) => setEvents([...events, newEv])}
            onAddSponsor={(newSpo) => setSponsors([...sponsors, newSpo])}
          />
        )}
      </main>

      {/* FOOTER */}
      <footer className={`border-t transition-colors duration-300 ${
        darkMode ? 'bg-slate-950 border-slate-900 text-slate-400' : 'bg-slate-100 border-slate-205 text-slate-600'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
            <div className="md:col-span-5 space-y-3">
              <div className="flex items-center">
                <Award className="h-6 w-6 text-sky-400 mr-2" />
                <span className="font-display font-black text-xl text-slate-900 dark:text-white">SmartEvents</span>
              </div>
              <p className="text-xs sm:text-sm leading-relaxed max-w-sm">
                {t('footer_desc')}
              </p>
            </div>

            <div className="md:col-span-3 space-y-3 text-xs sm:text-sm">
              <h4 className="font-bold text-slate-900 dark:text-white uppercase tracking-wider">{t('contact')}</h4>
              <p className="flex items-center"><Mail className="h-4 w-4 mr-2 text-sky-400" /> contacto@smartevents.cl</p>
              <p className="flex items-center"><Phone className="h-4 w-4 mr-2 text-sky-400" /> +56 9 9999 9999</p>
            </div>

            <div className="md:col-span-4 space-y-3">
              <h4 className="font-bold text-slate-900 dark:text-white uppercase tracking-wider text-xs sm:text-sm">{t('social')}</h4>
              <div className="flex space-x-4">
                <a href="#inicio" title="Facebook" className="p-2 rounded-lg bg-slate-500/5 hover:bg-sky-500/10 text-slate-400 hover:text-sky-400 transition-colors"><Facebook className="h-5 w-5" /></a>
                <a href="#inicio" title="Instagram" className="p-2 rounded-lg bg-slate-500/5 hover:bg-pink-500/10 text-slate-400 hover:text-pink-400 transition-colors"><Instagram className="h-5 w-5" /></a>
                <a href="#inicio" title="X Twitter" className="p-2 rounded-lg bg-slate-500/5 hover:bg-sky-400/10 text-slate-400 hover:text-sky-400 transition-colors"><Twitter className="h-5 w-5" /></a>
              </div>
            </div>
          </div>

          <div className="mt-8 pt-8 border-t dark:border-slate-900 border-slate-205 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 dark:text-slate-500">
            <span>© 2026 SmartEvents. Todos los derechos reservados.</span>
            <div className="flex space-x-4 mt-2 sm:mt-0">
              <a href="#inicio" className="hover:underline">Términos y condiciones</a>
              <a href="#inicio" className="hover:underline">Políticas de Privacidad</a>
            </div>
          </div>
        </div>
      </footer>

      {/* Connected dialog modal triggers */}
      <Modals
        currentLang={currentLang}
        darkMode={darkMode}
        currentUser={currentUser}
        setCurrentUser={setCurrentUser}
        activeModal={activeModal}
        onClose={() => setActiveModal(null)}
        selectedEvent={events.find(ev => ev.id === selectedEventId) || null}
        reviews={reviews}
        onAddReview={handleAddReview}
        sponsors={sponsors.filter(spo => spo.event_id === selectedEventId)}
        comments={comments}
        onAddComment={handleAddComment}
        onSaveProfile={handleSaveProfile}
        publicUser={publicUser}
        allUsers={getAllCitizens()}
        onUserClick={(id) => { setActiveModal(null); setTimeout(() => handleShowPublicProfile(id), 150); }}
        onRegisterEvent={handleEventEnrollment}
      />

    </div>
  );
}
