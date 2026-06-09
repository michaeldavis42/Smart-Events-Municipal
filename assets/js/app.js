const API = 'http://localhost:3000/api';
let token = localStorage.getItem('token') || null;
let currentUser = JSON.parse(localStorage.getItem('user')) || null;
let events = [];
let currentLang = localStorage.getItem('lang') || 'es';

const lang = {
  es: {
    nav_home:'Inicio', nav_events:'Eventos', nav_social:'Comunidad', nav_dashboard:'Dashboard', nav_providers:'Proveedores', nav_login:'Ingresar',
    hero_desc:'Descubre eventos, turismo y actividades cerca de ti. Explora, inscríbete, califica y comparte tu experiencia.',
    hero_explore:'Explorar eventos',
    features_title:'Tu guía de eventos', new:'Nuevo',
    f_nearby:'Eventos cerca de ti', f_nearby_desc:'Geolocalización para encontrar actividades culturales, deportivas y turísticas en tu zona.',
    f_reviews:'Reseñas como Letterboxd', f_reviews_desc:'Califica eventos con estrellas, escribe reseñas y comparte tu experiencia.',
    f_feed:'Feed Social', f_feed_desc:'Publica fotos, comparte experiencias, da me gusta y comenta publicaciones.',
    f_timeline:'Línea de Tiempo', f_timeline_desc:'Visualiza eventos próximos, en curso y finalizados.',
    timeline_title:'Línea de Tiempo', tl_upcoming:'Próximos', tl_ongoing:'Hoy', tl_finished:'Finalizados',
    events_title:'Eventos Disponibles', all_categories:'Todas las categorías', all:'Todos', most_popular:'Más populares', least_popular:'Menos populares',
    nearby_me:'Cerca de mí', search_people:'Buscar personas',
    social_title:'Comunidad', publish:'Publicar', social_login:'Inicia sesión para publicar en la comunidad.',
    dashboard_title:'Dashboard', total_events:'Eventos totales', total_participants:'Participantes totales', popular_event:'Evento más popular', popular_category:'Categoría destacada',
    heatmap_title:'Mapa de Calor por Comuna', ai_title:'Análisis con IA', refresh:'Refrescar análisis',
    export_pdf:'Exportar PDF', test_notification:'Probar notificación',
    create_event:'Crear nuevo evento', add_sponsor:'Agregar patrocinador', user_management:'Gestión de usuarios',
    contact:'Contacto', social:'Redes Sociales', footer_desc:'Plataforma inteligente de gestión de eventos.',
    event_registration:'Inscripción Evento',
    survey_title:'Encuesta Post Evento', survey_sat:'Satisfacción', survey_opinion:'Tu opinión', survey_suggest:'Sugerencias', survey_submit:'Enviar encuesta',
    f_providers:'Emparejamiento Inteligente', f_providers_desc:'Conecta proveedores de servicios con organizadores de eventos.',
    providers_title:'Proveedores de Servicios', prov_dashboard:'Dashboard', prov_profile:'Mi Perfil', prov_matches:'Emparejamiento', prov_save:'Guardar perfil', prov_complete_first:'Completa tu perfil al 100% para ver eventos compatibles.'
  },
  en: {
    nav_home:'Home', nav_events:'Events', nav_social:'Community', nav_dashboard:'Dashboard', nav_providers:'Providers', nav_login:'Login',
    hero_desc:'Discover events, tourism and activities near you. Explore, register, rate and share your experience.',
    hero_explore:'Explore events',
    features_title:'Your event guide', new:'New',
    f_nearby:'Events near you', f_nearby_desc:'Geolocation to find cultural, sports and tourism activities in your area.',
    f_reviews:'Letterboxd-style Reviews', f_reviews_desc:'Rate events with stars, write reviews and share with the community.',
    f_feed:'Social Feed', f_feed_desc:'Post photos, share experiences, like and comment on community posts.',
    f_timeline:'Timeline', f_timeline_desc:'View upcoming, ongoing and past events in a chronological view.',
    timeline_title:'Timeline', tl_upcoming:'Upcoming', tl_ongoing:'Today', tl_finished:'Past',
    events_title:'Available Events', all_categories:'All categories', all:'All', most_popular:'Most popular', least_popular:'Least popular',
    nearby_me:'Near me', search_people:'Search people',
    social_title:'Community', publish:'Publish', social_login:'Log in to post in the community.',
    dashboard_title:'Dashboard', total_events:'Total events', total_participants:'Total participants', popular_event:'Most popular event', popular_category:'Top category',
    heatmap_title:'Heatmap by District', ai_title:'AI Analysis', refresh:'Refresh analysis',
    export_pdf:'Export PDF', test_notification:'Test notification',
    create_event:'Create event', add_sponsor:'Add sponsor', user_management:'User management',
    contact:'Contact', social:'Social Media', footer_desc:'Smart event management platform.',
    event_registration:'Event Registration',
    survey_title:'Post-Event Survey', survey_sat:'Satisfaction', survey_opinion:'Your opinion', survey_suggest:'Suggestions', survey_submit:'Submit survey',
    f_providers:'Smart Matching', f_providers_desc:'Connect service providers with event organizers.',
    providers_title:'Service Providers', prov_dashboard:'Dashboard', prov_profile:'My Profile', prov_matches:'Matching', prov_save:'Save profile', prov_complete_first:'Complete your profile at 100% to see compatible events.'
  },
  fr: {
    nav_home:'Accueil', nav_events:'Événements', nav_social:'Communauté', nav_dashboard:'Tableau', nav_providers:'Prestataires', nav_login:'Connexion',
    hero_desc:'Découvrez des événements, du tourisme et des activités près de chez vous. Explorez, inscrivez-vous, notez et partagez votre expérience.',
    hero_explore:'Explorer les événements',
    features_title:'Votre guide événementiel', new:'Nouveau',
    f_nearby:'Événements près de chez vous', f_nearby_desc:'Géolocalisation pour trouver des activités culturelles, sportives et touristiques dans votre région.',
    f_reviews:'Avis façon Letterboxd', f_reviews_desc:'Notez les événements, écrivez des avis et partagez-les avec la communauté.',
    f_feed:'Fil Social', f_feed_desc:'Publiez des photos, partagez vos expériences, likez et commentez les publications.',
    f_timeline:'Chronologie', f_timeline_desc:'Visualisez les événements à venir, en cours et passés.',
    timeline_title:'Chronologie', tl_upcoming:'À venir', tl_ongoing:'Aujourd\'hui', tl_finished:'Passés',
    events_title:'Événements Disponibles', all_categories:'Toutes les catégories', all:'Tous', most_popular:'Les plus populaires', least_popular:'Les moins populaires',
    nearby_me:'Près de moi', search_people:'Rechercher des personnes',
    social_title:'Communauté', publish:'Publier', social_login:'Connectez-vous pour publier dans la communauté.',
    dashboard_title:'Tableau de bord', total_events:'Événements totaux', total_participants:'Participants totaux', popular_event:'Événement le plus populaire', popular_category:'Catégorie en vedette',
    heatmap_title:'Carte de chaleur par commune', ai_title:'Analyse IA', refresh:'Actualiser',
    export_pdf:'Exporter PDF', test_notification:'Tester notification',
    create_event:'Créer un événement', add_sponsor:'Ajouter un sponsor', user_management:'Gestion des utilisateurs',
    contact:'Contact', social:'Réseaux Sociaux', footer_desc:'Plateforme intelligente de gestion d\'événements.',
    event_registration:'Inscription à l\'événement',
    survey_title:'Enquête Post-Événement', survey_sat:'Satisfaction', survey_opinion:'Votre avis', survey_suggest:'Suggestions', survey_submit:'Soumettre',
    f_providers:'Appariement Intelligent', f_providers_desc:'Connectez les prestataires de services avec les organisateurs d\'événements.',
    providers_title:'Prestataires de Services', prov_dashboard:'Tableau de bord', prov_profile:'Mon Profil', prov_matches:'Appariement', prov_save:'Enregistrer', prov_complete_first:'Complétez votre profil à 100% pour voir les événements compatibles.'
  },
  de: {
    nav_home:'Start', nav_events:'Veranstaltungen', nav_social:'Community', nav_dashboard:'Dashboard', nav_providers:'Anbieter', nav_login:'Anmelden',
    hero_desc:'Entdecken Sie Veranstaltungen, Tourismus und Aktivitäten in Ihrer Nähe. Erkunden, anmelden, bewerten und teilen Sie Ihre Erfahrungen.',
    hero_explore:'Veranstaltungen erkunden',
    features_title:'Ihr Veranstaltungsführer', new:'Neu',
    f_nearby:'Veranstaltungen in Ihrer Nähe', f_nearby_desc:'Geolokalisierung, um kulturelle, sportliche und touristische Aktivitäten in Ihrer Region zu finden.',
    f_reviews:'Bewertungen wie bei Letterboxd', f_reviews_desc:'Bewerten Sie Veranstaltungen mit Sternen, schreiben Sie Rezensionen und teilen Sie sie.',
    f_feed:'Social Feed', f_feed_desc:'Fotos posten, Erfahrungen teilen, liken und kommentieren.',
    f_timeline:'Zeitleiste', f_timeline_desc:'Sehen Sie bevorstehende, laufende und vergangene Veranstaltungen.',
    timeline_title:'Zeitleiste', tl_upcoming:'Bevorstehend', tl_ongoing:'Heute', tl_finished:'Vergangen',
    events_title:'Verfügbare Veranstaltungen', all_categories:'Alle Kategorien', all:'Alle', most_popular:'Beliebteste', least_popular:'Am wenigsten beliebte',
    nearby_me:'In meiner Nähe', search_people:'Personen suchen',
    social_title:'Community', publish:'Veröffentlichen', social_login:'Melden Sie sich an, um in der Community zu posten.',
    dashboard_title:'Dashboard', total_events:'Veranstaltungen gesamt', total_participants:'Teilnehmer gesamt', popular_event:'Beliebteste Veranstaltung', popular_category:'Top-Kategorie',
    heatmap_title:'Heatmap nach Bezirk', ai_title:'KI-Analyse', refresh:'Aktualisieren',
    export_pdf:'PDF exportieren', test_notification:'Benachrichtigung testen',
    create_event:'Veranstaltung erstellen', add_sponsor:'Sponsor hinzufügen', user_management:'Benutzerverwaltung',
    contact:'Kontakt', social:'Soziale Medien', footer_desc:'Intelligente Veranstaltungsmanagement-Plattform.',
    event_registration:'Veranstaltungsanmeldung',
    survey_title:'Umfrage nach der Veranstaltung', survey_sat:'Zufriedenheit', survey_opinion:'Ihre Meinung', survey_suggest:'Vorschläge', survey_submit:'Absenden',
    f_providers:'Intelligentes Matching', f_providers_desc:'Verbinden Sie Dienstleister mit Veranstaltern.',
    providers_title:'Dienstleister', prov_dashboard:'Dashboard', prov_profile:'Mein Profil', prov_matches:'Matching', prov_save:'Speichern', prov_complete_first:'Vervollständigen Sie Ihr Profil zu 100%, um kompatible Veranstaltungen zu sehen.'
  },
  pt: {
    nav_home:'Início', nav_events:'Eventos', nav_social:'Comunidade', nav_dashboard:'Painel', nav_providers:'Fornecedores', nav_login:'Entrar',
    hero_desc:'Descubra eventos, turismo e atividades perto de você. Explore, inscreva-se, avalie e compartilhe sua experiência.',
    hero_explore:'Explorar eventos',
    features_title:'Seu guia de eventos', new:'Novo',
    f_nearby:'Eventos perto de você', f_nearby_desc:'Geolocalização para encontrar atividades culturais, esportivas e turísticas na sua área.',
    f_reviews:'Avaliações estilo Letterboxd', f_reviews_desc:'Avalie eventos com estrelas, escreva resenhas e compartilhe com a comunidade.',
    f_feed:'Feed Social', f_feed_desc:'Publique fotos, compartilhe experiências, curta e comente publicações.',
    f_timeline:'Linha do Tempo', f_timeline_desc:'Veja eventos próximos, em andamento e finalizados.',
    timeline_title:'Linha do Tempo', tl_upcoming:'Próximos', tl_ongoing:'Hoje', tl_finished:'Finalizados',
    events_title:'Eventos Disponíveis', all_categories:'Todas as categorias', all:'Todos', most_popular:'Mais populares', least_popular:'Menos populares',
    nearby_me:'Perto de mim', search_people:'Buscar pessoas',
    social_title:'Comunidade', publish:'Publicar', social_login:'Faça login para publicar na comunidade.',
    dashboard_title:'Painel', total_events:'Total de eventos', total_participants:'Total de participantes', popular_event:'Evento mais popular', popular_category:'Categoria destaque',
    heatmap_title:'Mapa de Calor por Bairro', ai_title:'Análise com IA', refresh:'Atualizar análise',
    export_pdf:'Exportar PDF', test_notification:'Testar notificação',
    create_event:'Criar evento', add_sponsor:'Adicionar patrocinador', user_management:'Gerenciar usuários',
    contact:'Contato', social:'Redes Sociais', footer_desc:'Plataforma inteligente de gestão de eventos.',
    event_registration:'Inscrição no Evento',
    survey_title:'Pesquisa Pós-Evento', survey_sat:'Satisfação', survey_opinion:'Sua opinião', survey_suggest:'Sugestões', survey_submit:'Enviar pesquisa',
    f_providers:'Emparelhamento Inteligente', f_providers_desc:'Conecte fornecedores de serviços com organizadores de eventos.',
    providers_title:'Fornecedores de Serviços', prov_dashboard:'Painel', prov_profile:'Meu Perfil', prov_matches:'Emparelhamento', prov_save:'Salvar perfil', prov_complete_first:'Complete seu perfil em 100% para ver eventos compatíveis.'
  }
};

// =========================
// i18n
// =========================
function t(key) { return lang[currentLang]?.[key] || lang.es[key] || key; }

function applyTranslation() {
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.dataset.i18n;
    if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') el.placeholder = t(key);
    else el.textContent = t(key);
  });
}

function switchLang(code) {
  currentLang = code;
  localStorage.setItem('lang', currentLang);
  document.querySelectorAll('.lang-cap').forEach(b => b.classList.toggle('active', b.dataset.lang === code));
  applyTranslation();
  document.documentElement.lang = code === 'pt' ? 'pt' : code;
  closeLangDropdown();
}

function toggleLangDropdown() {
  document.getElementById('langDropdown').classList.toggle('open');
}

function closeLangDropdown() {
  document.getElementById('langDropdown').classList.remove('open');
}

document.getElementById('langSelector').addEventListener('click', (e) => {
  const btn = e.target.closest('.lang-cap');
  if (btn) { switchLang(btn.dataset.lang); return; }
  const trigger = e.target.closest('.lang-trigger');
  if (trigger) toggleLangDropdown();
});

document.addEventListener('click', (e) => {
  if (!e.target.closest('.lang-selector')) closeLangDropdown();
});

// =========================
// DOM REFS
// =========================
const container = document.getElementById('eventsContainer');
const searchInput = document.getElementById('searchInput');
const categoryFilter = document.getElementById('categoryFilter');
const popularityFilter = document.getElementById('popularityFilter');
const modal = document.getElementById('registrationModal');
const authModal = document.getElementById('authModal');
const detailModal = document.getElementById('eventDetailModal');
const profileModal = document.getElementById('profileModal');
const publicProfileModal = document.getElementById('publicProfileModal');
const searchPeopleModal = document.getElementById('searchPeopleModal');
const myReviewsModal = document.getElementById('myReviewsModal');
const surveyModal = document.getElementById('surveyModal');
const commentsModal = document.getElementById('commentsModal');
const closeModal = document.querySelector('#registrationModal .close-modal');
const closeAuth = document.getElementById('closeAuthModal');
const closeDetail = document.getElementById('closeDetailModal');
const closeProfile = document.getElementById('closeProfileModal');
const closePublicProfile = document.getElementById('closePublicProfileModal');
const closeSearchPeople = document.getElementById('closeSearchPeopleModal');
const closeMyReviews = document.getElementById('closeMyReviewsModal');
const closeSurvey = document.getElementById('closeSurveyModal');
const closeComments = document.getElementById('closeCommentsModal');
const registrationForm = document.getElementById('registrationForm');
const loginBtn = document.getElementById('loginBtn');
const logoutBtn = document.getElementById('logoutBtn');
const myReviewsBtn = document.getElementById('myReviewsBtn');
const profileBtn = document.getElementById('profileBtn');
const searchPeopleBtn = document.getElementById('searchPeopleBtn');
const peopleSearchInput = document.getElementById('peopleSearchInput');
const authNavItem = document.getElementById('authNavItem');
const userNavItem = document.getElementById('userNavItem');
const userNameDisplay = document.getElementById('userNameDisplay');
const adminSection = document.getElementById('admin');
const adminNavItem = document.getElementById('adminNavItem');
const providerSection = document.getElementById('proveedores');
const providerNavItem = document.getElementById('providerNavItem');
const darkModeBtn = document.getElementById('darkModeBtn');
const nearbyBtn = document.getElementById('nearbyBtn');
const nearbyWidget = document.getElementById('nearbyWidget');

let selectedEventId = null;
let userCoords = null;

// =========================
// API
// =========================
const api = {
  get: async (url) => {
    const res = await fetch(`${API}${url}`, { headers: { Authorization: token ? `Bearer ${token}` : '' } });
    if (!res.ok) throw await res.json();
    return res.json();
  },
  post: async (url, body) => {
    const res = await fetch(`${API}${url}`, {
      method: 'POST', headers: { 'Content-Type': 'application/json', Authorization: token ? `Bearer ${token}` : '' },
      body: JSON.stringify(body)
    });
    if (!res.ok) throw await res.json();
    return res.json();
  },
  put: async (url, body) => {
    const res = await fetch(`${API}${url}`, {
      method: 'PUT', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify(body)
    });
    if (!res.ok) throw await res.json();
    return res.json();
  },
  del: async (url) => {
    const res = await fetch(`${API}${url}`, { method: 'DELETE', headers: { Authorization: `Bearer ${token}` } });
    if (!res.ok) throw await res.json();
    return res.json();
  }
};

// =========================
// CLOSE MODALS ON BG CLICK
// =========================
window.addEventListener('click', (e) => {
  [authModal, modal, detailModal, profileModal, publicProfileModal, searchPeopleModal, myReviewsModal, surveyModal, commentsModal].forEach(m => {
    if (e.target === m) m.style.display = 'none';
  });
});

// =========================
// NOTIFICATIONS
// =========================
async function subscribeToPush() {
  try { if (!token || !('serviceWorker' in navigator) || !('PushManager' in window)) return; const reg = await navigator.serviceWorker.register('/sw.js'); const sub = await reg.pushManager.subscribe({ userVisibleOnly: true, applicationServerKey: urlBase64ToUint8Array('BHW_8R7KkRh_nKq8LFZPxTKl_8fIdcq0JfGZd_8XgJk9QQ5H3Rn3sLVp0K0N7sTzGq0V0W0Y0Q0I0M0c0f0g0h0') }); await api.post('/notifications/subscribe', sub); } catch {}
}
function urlBase64ToUint8Array(b) { const p = '='.repeat((4-b.length%4)%4); return Uint8Array.from([...window.atob((b+p).replace(/-/g,'+').replace(/_/g,'/'))].map(c => c.charCodeAt(0))); }

// =========================
// DARK MODE
// =========================
let dark = localStorage.getItem('darkMode') !== 'false';
if (!dark) document.body.classList.add('dark-mode');
darkModeBtn.addEventListener('click', () => { document.body.classList.toggle('dark-mode'); dark = !dark; localStorage.setItem('darkMode', dark); darkModeBtn.innerHTML = dark ? '<i class="fa-solid fa-moon"></i>' : '<i class="fa-solid fa-sun"></i>'; });
