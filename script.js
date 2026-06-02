const API = 'http://localhost:3000/api';
let token = localStorage.getItem('token') || null;
let currentUser = JSON.parse(localStorage.getItem('user')) || null;
let events = [];
let map = null;
let mapMarkers = [];
let calDate = new Date();
let currentLang = localStorage.getItem('lang') || 'es';

const lang = {
  es: {
    nav_home:'Inicio', nav_events:'Eventos', nav_social:'Comunidad', nav_calendar:'Calendario', nav_dashboard:'Dashboard', nav_login:'Ingresar',
    hero_desc:'Descubre eventos, turismo y actividades cerca de ti. Explora, inscríbete, califica y comparte tu experiencia.',
    hero_explore:'Explorar eventos', hero_map:'Ver mapa',
    features_title:'Tu guía de eventos', new:'Nuevo',
    f_nearby:'Eventos cerca de ti', f_nearby_desc:'Geolocalización para encontrar actividades culturales, deportivas y turísticas en tu zona.',
    f_reviews:'Reseñas como Letterboxd', f_reviews_desc:'Califica eventos con estrellas, escribe reseñas y comparte tu experiencia.',
    f_feed:'Feed Social', f_feed_desc:'Publica fotos, comparte experiencias, da me gusta y comenta publicaciones.',
    f_timeline:'Línea de Tiempo', f_timeline_desc:'Visualiza eventos próximos, en curso y finalizados.',
    map_title:'Mapa de Eventos',
    timeline_title:'Línea de Tiempo', tl_upcoming:'Próximos', tl_ongoing:'Hoy', tl_finished:'Finalizados',
    events_title:'Eventos Disponibles', all_categories:'Todas las categorías', all:'Todos', most_popular:'Más populares', least_popular:'Menos populares',
    nearby_me:'Cerca de mí', search_people:'Buscar personas',
    social_title:'Comunidad', publish:'Publicar', social_login:'Inicia sesión para publicar en la comunidad.',
    calendar_title:'Calendario Visual',
    dashboard_title:'Dashboard', total_events:'Eventos totales', total_participants:'Participantes totales', popular_event:'Evento más popular', popular_category:'Categoría destacada',
    heatmap_title:'Mapa de Calor por Comuna', ai_title:'Análisis con IA', refresh:'Refrescar análisis',
    export_pdf:'Exportar PDF', test_notification:'Probar notificación',
    create_event:'Crear nuevo evento', add_sponsor:'Agregar patrocinador', user_management:'Gestión de usuarios',
    contact:'Contacto', social:'Redes Sociales', footer_desc:'Plataforma inteligente de gestión de eventos.',
    event_registration:'Inscripción Evento',
    survey_title:'Encuesta Post Evento', survey_sat:'Satisfacción', survey_opinion:'Tu opinión', survey_suggest:'Sugerencias', survey_submit:'Enviar encuesta'
  },
  en: {
    nav_home:'Home', nav_events:'Events', nav_social:'Community', nav_calendar:'Calendar', nav_dashboard:'Dashboard', nav_login:'Login',
    hero_desc:'Discover events, tourism and activities near you. Explore, register, rate and share your experience.',
    hero_explore:'Explore events', hero_map:'View map',
    features_title:'Your event guide', new:'New',
    f_nearby:'Events near you', f_nearby_desc:'Geolocation to find cultural, sports and tourism activities in your area.',
    f_reviews:'Letterboxd-style Reviews', f_reviews_desc:'Rate events with stars, write reviews and share with the community.',
    f_feed:'Social Feed', f_feed_desc:'Post photos, share experiences, like and comment on community posts.',
    f_timeline:'Timeline', f_timeline_desc:'View upcoming, ongoing and past events in a chronological view.',
    map_title:'Event Map',
    timeline_title:'Timeline', tl_upcoming:'Upcoming', tl_ongoing:'Today', tl_finished:'Past',
    events_title:'Available Events', all_categories:'All categories', all:'All', most_popular:'Most popular', least_popular:'Least popular',
    nearby_me:'Near me', search_people:'Search people',
    social_title:'Community', publish:'Publish', social_login:'Log in to post in the community.',
    calendar_title:'Visual Calendar',
    dashboard_title:'Dashboard', total_events:'Total events', total_participants:'Total participants', popular_event:'Most popular event', popular_category:'Top category',
    heatmap_title:'Heatmap by District', ai_title:'AI Analysis', refresh:'Refresh analysis',
    export_pdf:'Export PDF', test_notification:'Test notification',
    create_event:'Create event', add_sponsor:'Add sponsor', user_management:'User management',
    contact:'Contact', social:'Social Media', footer_desc:'Smart event management platform.',
    event_registration:'Event Registration',
    survey_title:'Post-Event Survey', survey_sat:'Satisfaction', survey_opinion:'Your opinion', survey_suggest:'Suggestions', survey_submit:'Submit survey'
  },
  pt: {
    nav_home:'Início', nav_events:'Eventos', nav_social:'Comunidade', nav_calendar:'Calendário', nav_dashboard:'Painel', nav_login:'Entrar',
    hero_desc:'Descubra eventos, turismo e atividades perto de você. Explore, inscreva-se, avalie e compartilhe sua experiência.',
    hero_explore:'Explorar eventos', hero_map:'Ver mapa',
    features_title:'Seu guia de eventos', new:'Novo',
    f_nearby:'Eventos perto de você', f_nearby_desc:'Geolocalização para encontrar atividades culturais, esportivas e turísticas na sua área.',
    f_reviews:'Avaliações estilo Letterboxd', f_reviews_desc:'Avalie eventos com estrelas, escreva resenhas e compartilhe com a comunidade.',
    f_feed:'Feed Social', f_feed_desc:'Publique fotos, compartilhe experiências, curta e comente publicações.',
    f_timeline:'Linha do Tempo', f_timeline_desc:'Veja eventos próximos, em andamento e finalizados.',
    map_title:'Mapa de Eventos',
    timeline_title:'Linha do Tempo', tl_upcoming:'Próximos', tl_ongoing:'Hoje', tl_finished:'Finalizados',
    events_title:'Eventos Disponíveis', all_categories:'Todas as categorias', all:'Todos', most_popular:'Mais populares', least_popular:'Menos populares',
    nearby_me:'Perto de mim', search_people:'Buscar pessoas',
    social_title:'Comunidade', publish:'Publicar', social_login:'Faça login para publicar na comunidade.',
    calendar_title:'Calendário Visual',
    dashboard_title:'Painel', total_events:'Total de eventos', total_participants:'Total de participantes', popular_event:'Evento mais popular', popular_category:'Categoria destaque',
    heatmap_title:'Mapa de Calor por Bairro', ai_title:'Análise com IA', refresh:'Atualizar análise',
    export_pdf:'Exportar PDF', test_notification:'Testar notificação',
    create_event:'Criar evento', add_sponsor:'Adicionar patrocinador', user_management:'Gerenciar usuários',
    contact:'Contato', social:'Redes Sociais', footer_desc:'Plataforma inteligente de gestão de eventos.',
    event_registration:'Inscrição no Evento',
    survey_title:'Pesquisa Pós-Evento', survey_sat:'Satisfação', survey_opinion:'Sua opinião', survey_suggest:'Sugestões', survey_submit:'Enviar pesquisa'
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

document.getElementById('langSelector').addEventListener('change', (e) => {
  currentLang = e.target.value;
  localStorage.setItem('lang', currentLang);
  applyTranslation();
  document.documentElement.lang = currentLang === 'pt' ? 'pt' : currentLang;
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
// AUTH
// =========================
function setAuth(user, t) {
  token = t; currentUser = user;
  if (t) localStorage.setItem('token', t); else localStorage.removeItem('token');
  if (user) localStorage.setItem('user', JSON.stringify(user)); else localStorage.removeItem('user');
  updateAuthUI();
}

function updateAuthUI() {
  if (currentUser) {
    authNavItem.style.display = 'none';
    userNavItem.style.display = 'flex';
    userNameDisplay.textContent = currentUser.name;
    document.getElementById('socialPublishBox').style.display = 'block';
    document.getElementById('socialLoginMsg').style.display = 'none';
    if (currentUser.role === 'admin' || currentUser.role === 'organizer') {
      adminNavItem.style.display = 'block';
      adminSection.style.display = 'block';
      loadUsers(); loadSponsorEvents();
    } else { adminNavItem.style.display = 'none'; adminSection.style.display = 'none'; }
  } else {
    authNavItem.style.display = 'block';
    userNavItem.style.display = 'none';
    adminNavItem.style.display = 'none';
    adminSection.style.display = 'none';
    document.getElementById('socialPublishBox').style.display = 'none';
    document.getElementById('socialLoginMsg').style.display = 'block';
  }
}

loginBtn.addEventListener('click', () => {
  ['loginForm','forgotForm'].forEach(id => document.getElementById(id).style.display = 'none');
  document.getElementById('registerForm').style.display = 'none';
  document.getElementById('loginForm').style.display = 'block';
  document.getElementById('authModalTitle').textContent = 'Iniciar sesión';
  authModal.style.display = 'flex';
});

closeAuth.addEventListener('click', () => authModal.style.display = 'none');
closeModal.addEventListener('click', () => modal.style.display = 'none');
closeDetail.addEventListener('click', () => detailModal.style.display = 'none');
closeProfile.addEventListener('click', () => profileModal.style.display = 'none');
closePublicProfile.addEventListener('click', () => publicProfileModal.style.display = 'none');
closeSearchPeople.addEventListener('click', () => searchPeopleModal.style.display = 'none');
closeMyReviews.addEventListener('click', () => myReviewsModal.style.display = 'none');
closeSurvey.addEventListener('click', () => surveyModal.style.display = 'none');
closeComments.addEventListener('click', () => commentsModal.style.display = 'none');

document.getElementById('showRegisterLink').addEventListener('click', (e) => {
  e.preventDefault();
  document.getElementById('loginForm').style.display = 'none';
  document.getElementById('forgotForm').style.display = 'none';
  document.getElementById('registerForm').style.display = 'block';
  document.getElementById('authModalTitle').textContent = 'Crear cuenta';
});

document.getElementById('showLoginLink').addEventListener('click', (e) => {
  e.preventDefault();
  document.getElementById('loginForm').style.display = 'block';
  document.getElementById('registerForm').style.display = 'none';
  document.getElementById('forgotForm').style.display = 'none';
  document.getElementById('authModalTitle').textContent = 'Iniciar sesión';
});

document.getElementById('showForgotLink').addEventListener('click', (e) => {
  e.preventDefault();
  document.getElementById('loginForm').style.display = 'none';
  document.getElementById('registerForm').style.display = 'none';
  document.getElementById('forgotForm').style.display = 'block';
  document.getElementById('authModalTitle').textContent = 'Recuperar contraseña';
});

document.getElementById('backToLoginLink').addEventListener('click', (e) => {
  e.preventDefault();
  document.getElementById('loginForm').style.display = 'block';
  document.getElementById('registerForm').style.display = 'none';
  document.getElementById('forgotForm').style.display = 'none';
  document.getElementById('authModalTitle').textContent = 'Iniciar sesión';
});

['loginSubmitBtn','registerSubmitBtn','forgotSubmitBtn'].forEach(id => {
  document.getElementById(id).addEventListener('click', async () => {
    if (id === 'loginSubmitBtn') {
      const email = document.getElementById('loginEmail').value;
      const password = document.getElementById('loginPassword').value;
      try { const d = await api.post('/auth/login', { email, password }); setAuth(d.user, d.token); authModal.style.display = 'none'; loadEvents(); } catch (e) { alert(e.error); }
    }
    if (id === 'registerSubmitBtn') {
      const name = document.getElementById('registerName').value;
      const email = document.getElementById('registerEmail').value;
      const password = document.getElementById('registerPassword').value;
      const role = document.getElementById('registerRole').value;
      if (!name || !email) return alert('Nombre y email obligatorios');
      try { const d = await api.post('/auth/register', { name, email, password: password || undefined, role }); setAuth(d.user, d.token); authModal.style.display = 'none'; loadEvents(); } catch (e) { alert(e.error); }
    }
    if (id === 'forgotSubmitBtn') {
      const email = document.getElementById('forgotEmail').value;
      if (!email) return alert('Ingresa tu correo');
      try { const d = await api.post('/auth/forgot-password', { email }); if (d.resetToken) { const np = prompt('Modo desarrollo. Nueva contraseña:'); if (np) { await api.post('/auth/reset-password', { token: d.resetToken, newPassword: np }); alert('Contraseña restablecida'); } } else alert(d.message); authModal.style.display = 'none'; } catch (e) { alert(e.error); }
    }
  });
});

document.getElementById('googleLoginBtn').addEventListener('click', () => {
  alert('Configura Google Client ID en Google Cloud Console y descomenta el script GIS en el HTML para usar Google Login.');
});

logoutBtn.addEventListener('click', () => { setAuth(null, null); loadEvents(); });

window.addEventListener('click', (e) => {
  [authModal, modal, detailModal, profileModal, publicProfileModal, searchPeopleModal, myReviewsModal, surveyModal, commentsModal].forEach(m => {
    if (e.target === m) m.style.display = 'none';
  });
});

// Profile
profileBtn.addEventListener('click', showProfile);
async function showProfile() {
  if (!currentUser) return;
  try {
    const profile = await api.get(`/auth/profile/${currentUser.id}`);
    document.getElementById('profileContent').innerHTML = `
      <div class="profile-header">
        <img src="${profile.avatar_url || 'https://cdn-icons-png.flaticon.com/512/3135/3135715.png'}" class="profile-avatar" />
        <div><h3>${profile.name}</h3><p>${profile.email}</p><span class="tag">${profile.role}</span><p><small>Miembro desde ${new Date(profile.created_at).toLocaleDateString('es-CL')}</small></p></div>
      </div>
      <div class="profile-tabs">
        <button class="tab-btn active" data-tab="edit">Editar perfil</button>
        <button class="tab-btn" data-tab="security">Seguridad</button>
        <button class="tab-btn" data-tab="role">Rol</button>
        <button class="tab-btn danger-tab" data-tab="delete">Eliminar cuenta</button>
      </div>
      <div class="tab-content active" id="tab-edit">
        <h4>Información de empresa / perfil</h4>
        <input type="text" id="pfCompany" placeholder="Nombre de empresa" value="${profile.company_name || ''}" />
        <textarea id="pfCompanyDesc" placeholder="Descripción" rows="2">${profile.company_description || ''}</textarea>
        <input type="text" id="pfPhone" placeholder="Teléfono" value="${profile.phone || ''}" />
        <input type="url" id="pfWebsite" placeholder="Sitio web" value="${profile.website || ''}" />
        <textarea id="pfBio" placeholder="Biografía" rows="2">${profile.bio || ''}</textarea>
        <input type="url" id="pfAvatar" placeholder="URL foto de perfil" value="${profile.avatar_url || ''}" />
        <button class="primary-btn" id="saveProfileBtn">Guardar cambios</button>
      </div>
      <div class="tab-content" id="tab-security">
        <h4>Cambiar contraseña</h4><input type="password" id="pfCurrentPw" placeholder="Contraseña actual" /><input type="password" id="pfNewPw" placeholder="Nueva contraseña" />
        <button class="primary-btn" id="changePwBtn">Actualizar</button>
        <hr style="margin:20px 0;opacity:0.1;" />
        <h4>Cambiar email</h4><input type="email" id="pfNewEmail" value="${profile.email}" /><button class="primary-btn" id="changeEmailBtn">Actualizar correo</button>
      </div>
      <div class="tab-content" id="tab-role">
        <h4>Rol actual: <span class="tag">${profile.role}</span></h4>
        ${profile.role === 'user' ? '<p style="margin:15px 0;">Solicita ser organizador.</p><button class="primary-btn" id="becomeOrganizerBtn">Solicitar ser organizador</button>' : '<p>Ya tienes permisos de organizador.</p>'}
      </div>
      <div class="tab-content" id="tab-delete">
        <div class="delete-warning"><i class="fa-solid fa-triangle-exclamation fa-2x"></i><h4>Eliminar cuenta</h4><p>Esta acción no se puede deshacer.</p><button class="danger-btn" id="deleteAccountBtn">Eliminar mi cuenta</button></div>
      </div>`;
    profileModal.style.display = 'flex';
    document.querySelectorAll('.tab-btn').forEach(b => b.addEventListener('click', () => {
      document.querySelectorAll('.tab-btn').forEach(x => x.classList.remove('active'));
      document.querySelectorAll('.tab-content').forEach(x => x.classList.remove('active'));
      b.classList.add('active');
      document.getElementById(`tab-${b.dataset.tab}`).classList.add('active');
    }));
    document.getElementById('saveProfileBtn')?.addEventListener('click', async () => {
      try { await api.put('/auth/profile', { company_name:document.getElementById('pfCompany').value, company_description:document.getElementById('pfCompanyDesc').value, phone:document.getElementById('pfPhone').value, website:document.getElementById('pfWebsite').value, bio:document.getElementById('pfBio').value, avatar_url:document.getElementById('pfAvatar').value }); alert('Perfil actualizado'); } catch(e) { alert(e.error); }
    });
    document.getElementById('changePwBtn')?.addEventListener('click', async () => {
      const c = document.getElementById('pfCurrentPw').value, n = document.getElementById('pfNewPw').value;
      if (!c || !n) return alert('Completa ambos campos');
      try { await api.put('/auth/password', { currentPassword: c, newPassword: n }); alert('Contraseña actualizada'); document.getElementById('pfCurrentPw').value = ''; document.getElementById('pfNewPw').value = ''; } catch(e) { alert(e.error); }
    });
    document.getElementById('changeEmailBtn')?.addEventListener('click', async () => {
      const e = document.getElementById('pfNewEmail').value;
      if (!e) return alert('Ingresa un email');
      try { await api.put('/auth/email', { email: e }); alert('Email actualizado. Vuelve a iniciar sesión.'); setAuth(null, null); loadEvents(); profileModal.style.display = 'none'; } catch(ex) { alert(ex.error); }
    });
    document.getElementById('becomeOrganizerBtn')?.addEventListener('click', async () => {
      try { const d = await api.put('/auth/role', { role: 'organizer' }); setAuth(d.user, d.token); alert('Ahora eres organizador'); profileModal.style.display = 'none'; loadEvents(); } catch(e) { alert(e.error); }
    });
    document.getElementById('deleteAccountBtn')?.addEventListener('click', async () => {
      if (!confirm('¿Estás seguro?') || !confirm('¿Realmente quieres eliminar tu cuenta?')) return;
      try { await api.del('/auth/account'); alert('Cuenta eliminada'); setAuth(null, null); loadEvents(); profileModal.style.display = 'none'; } catch(e) { alert(e.error); }
    });
  } catch { /* silent */ }
}

async function showPublicProfile(userId) {
  try {
    const p = await api.get(`/auth/profile/${userId}`);
    document.getElementById('publicProfileContent').innerHTML = `
      <div class="profile-header"><img src="${p.avatar_url || 'https://cdn-icons-png.flaticon.com/512/3135/3135715.png'}" class="profile-avatar" /><div><h3>${p.name}</h3><p>${p.email}</p><span class="tag">${p.role}</span></div></div>
      ${p.company_name ? `<div style="margin-top:20px;padding:20px;background:rgba(255,255,255,0.03);border-radius:16px;"><h4>${p.company_name}</h4>${p.company_description ? `<p>${p.company_description}</p>` : ''}${p.phone ? `<p><i class="fa-solid fa-phone"></i> ${p.phone}</p>` : ''}${p.website ? `<p><i class="fa-solid fa-globe"></i> <a href="${p.website}" target="_blank">${p.website}</a></p>` : ''}</div>` : ''}
      ${p.bio ? `<p style="margin-top:15px;">${p.bio}</p>` : ''}`;
    publicProfileModal.style.display = 'flex';
  } catch { alert('Usuario no encontrado'); }
}

searchPeopleBtn.addEventListener('click', () => { searchPeopleModal.style.display = 'flex'; document.getElementById('peopleSearchResults').innerHTML = ''; document.getElementById('peopleSearchInput').value = ''; });
let pst; peopleSearchInput.addEventListener('input', () => { clearTimeout(pst); pst = setTimeout(async () => { const q = peopleSearchInput.value; if (!q) return; const u = await api.get(`/auth/search?q=${encodeURIComponent(q)}`); document.getElementById('peopleSearchResults').innerHTML = u.map(x => `<div class="user-search-card" onclick="showPublicProfile(${x.id})"><img src="${x.avatar_url || 'https://cdn-icons-png.flaticon.com/512/3135/3135715.png'}" class="search-avatar" /><div><strong>${x.name}</strong><p>${x.company_name || x.email}</p><span class="tag">${x.role}</span></div></div>`).join('') || '<p>Sin resultados</p>'; }, 300); });

// =========================
// EVENTS
// =========================
async function loadEvents() {
  try {
    const params = new URLSearchParams();
    if (searchInput.value) params.set('search', searchInput.value);
    if (categoryFilter.value !== 'all') params.set('category', categoryFilter.value);
    events = await api.get(`/events?${params.toString()}`);
    renderEvents();
    updateDashboard();
    updateMap();
    renderTimeline();
    renderCalendar();
    checkNearbyWidget();
  } catch { events = []; renderEvents(); }
}

function renderStars(r, s=1) { const f = Math.floor(r), h = r % 1 >= 0.5 ? 1 : 0, e = 5 - f - h; const c = s ? `<span class="stars">` : ''; const cl = s ? `</span>` : ''; return c + '★'.repeat(f) + (h ? '½' : '') + '☆'.repeat(e) + cl; }
function renderStarsInput(r) { return Array.from({length:5}, (_,i) => `<span class="star-input ${i<r?'active':''}" data-value="${i+1}">★</span>`).join(''); }

async function renderEvents(f) {
  const list = f || events;
  container.innerHTML = '';
  if (!list.length) { container.innerHTML = `<p style="grid-column:1/-1;text-align:center;padding:40px;">No hay eventos</p>`; return; }
  let dl = [...list];
  const pop = popularityFilter.value;
  if (pop === 'high') dl.sort((a,b) => b.participants - a.participants);
  if (pop === 'low') dl.sort((a,b) => a.participants - b.participants);
  if (pop === 'nearby' && userCoords) dl.sort((a,b) => haversine(userCoords.lat,userCoords.lng,a.lat,a.lng) - haversine(userCoords.lat,userCoords.lng,b.lat,b.lng));

  for (const ev of dl) {
    const img = ev.image || 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?q=80&w=2070';
    const sc = ev.status === 'Completado' ? 'status-completed' : ev.status === 'Próximo' ? 'status-upcoming' : 'status-available';
    let ah = '';
    try { const rd = await api.get(`/reviews/event/${ev.id}`); if (rd.total > 0) ah = `<div class="review-summary">${renderStars(rd.average)} <small>${rd.total}</small></div>`; } catch {}
    let nt = '';
    if (userCoords && ev.lat && ev.lng) { const d = haversine(userCoords.lat,userCoords.lng,ev.lat,ev.lng); if (d < 10) nt = `<span class="nearby-badge"><i class="fa-solid fa-location-dot"></i> ${d.toFixed(1)} km</span>`; }
    const c = document.createElement('div'); c.className = 'event-card';
    c.innerHTML = `<img src="${img}" loading="lazy" /><div class="event-info"><h3>${ev.name} ${nt}</h3><p><i class="fa-solid fa-calendar"></i> ${formatDate(ev.date)}</p><p><i class="fa-solid fa-location-dot"></i> ${ev.location}</p><p>${ev.description||''}</p><p><strong>Categoría:</strong> ${ev.category} | <strong>Cupos:</strong> ${ev.slots} <strong>Inscritos:</strong> ${ev.participants}</p>${ah}<div class="event-status ${sc}">${ev.status}</div><div class="event-buttons"><button onclick="openRegistration(${ev.id})">Inscribirse</button><button onclick="showEventDetail(${ev.id})">Detalles</button>${(currentUser&&['admin','organizer'].includes(currentUser.role))?`<button onclick="deleteEvent(${ev.id})" style="background:#ef4444;color:white;">Eliminar</button>`:''}</div></div>`;
    container.appendChild(c);
  }
}

function haversine(l1,o1,l2,o2) { if (!l1||!o1||!l2||!o2) return Infinity; const R=6371, a=Math.sin, dL=(l2-l1)*Math.PI/180, dO=(o2-o1)*Math.PI/180; return R*2*Math.atan2(Math.sqrt(a(dL/2)**2+Math.cos(l1*Math.PI/180)*Math.cos(l2*Math.PI/180)*a(dO/2)**2), Math.sqrt(1-a(dL/2)**2-Math.cos(l1*Math.PI/180)*Math.cos(l2*Math.PI/180)*a(dO/2)**2)); }
function formatDate(d) { return new Date(d+'T12:00:00').toLocaleDateString('es-CL', {year:'numeric',month:'long',day:'numeric'}); }

// Nearby btn
nearbyBtn.addEventListener('click', () => {
  if (!navigator.geolocation) return alert('Geolocalización no disponible');
  navigator.geolocation.getCurrentPosition(p => { userCoords = { lat: p.coords.latitude, lng: p.coords.longitude }; popularityFilter.value = 'nearby'; renderEvents(); checkNearbyWidget(); }, () => alert('Activa la ubicación'));
});

async function checkNearbyWidget() {
  if (!userCoords) { nearbyWidget.style.display = 'none'; return; }
  try {
    const all = await api.get('/events');
    let nearest = null, minD = Infinity;
    all.forEach(e => { if (e.lat && e.lng) { const d = haversine(userCoords.lat,userCoords.lng,e.lat,e.lng); if (d < minD) { minD = d; nearest = e; } } });
    if (nearest && minD < 10) {
      document.getElementById('nearbyWidgetText').textContent = `Hay un evento a ${minD.toFixed(1)} km: ${nearest.name}`;
      nearbyWidget.style.display = 'flex';
      nearbyWidget.onclick = () => showEventDetail(nearest.id);
    } else { nearbyWidget.style.display = 'none'; }
  } catch { nearbyWidget.style.display = 'none'; }
}

// =========================
// EVENT DETAIL + REVIEWS + SPONSORS + SURVEY
// =========================
async function showEventDetail(id) {
  try {
    const ev = await api.get(`/events/${id}`);
    const img = ev.image || 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?q=80&w=2070';
    const rd = await api.get(`/reviews/event/${id}`);
    const ur = currentUser ? rd.reviews.find(r => r.user_id === currentUser.id) : null;
    const sponsors = await api.get(`/sponsors/event/${id}`);
    let surveyAvg = ''; try { const sv = await api.get(`/surveys/event/${id}`); if (sv.stats.total > 0) surveyAvg = `<span class="stars">${renderStars(sv.stats.avg_satisfaction,0)}</span> <small>${sv.stats.total} respuestas</small>`; } catch {}

    const spoHtml = sponsors.length ? `<div class="sponsors-section"><h4><i class="fa-solid fa-handshake"></i> Patrocinadores</h4><div class="sponsors-list">${sponsors.map(s => `<div class="sponsor-card">${s.logo_url ? `<img src="${s.logo_url}" />` : ''}<div><strong>${s.name}</strong>${s.description ? `<p>${s.description}</p>` : ''}${s.website ? `<a href="${s.website}" target="_blank">Sitio web</a>` : ''}</div></div>`).join('')}</div></div>` : '';

    const content = document.getElementById('eventDetailContent');
    content.innerHTML = `
      <img src="${img}" style="width:100%;height:250px;object-fit:cover;border-radius:15px;margin-bottom:20px;" />
      <h2>${ev.name}</h2>
      <p><i class="fa-solid fa-calendar"></i> ${formatDate(ev.date)}</p>
      <p><i class="fa-solid fa-location-dot"></i> ${ev.location}</p>
      <p>${ev.description || 'Sin descripción'}</p>
      <p><strong>Categoría:</strong> ${ev.category} | <strong>Cupos:</strong> ${ev.slots} | <strong>Inscritos:</strong> ${ev.participants}</p>
      <p><strong>Estado:</strong> ${ev.status} ${surveyAvg ? `| Satisfacción: ${surveyAvg}` : ''}</p>
      <div class="detail-actions">
        <button class="primary-btn" onclick="syncToCalendar(${ev.id})"><i class="fa-solid fa-calendar-plus"></i> Google Calendar</button>
        <button class="secondary-btn" onclick="closeDetailModal();openRegistration(${ev.id})">Inscribirse</button>
        ${currentUser ? `<button class="secondary-btn" onclick="closeDetailModal();openSurvey(${ev.id})"><i class="fa-solid fa-clipboard-check"></i> Encuesta</button>` : ''}
      </div>
      ${spoHtml}
      <div class="reviews-section">
        <h3><i class="fa-solid fa-star"></i> Reseñas ${rd.total > 0 ? `${renderStars(rd.average)} <small>(${rd.total})</small>` : ''}</h3>
        ${currentUser ? `
          <div class="review-form">
            <h4>${ur ? 'Tu reseña' : 'Califica este evento'}</h4>
            <div class="star-rating" id="starRating">${renderStarsInput(ur ? ur.rating : 0)}</div>
            <textarea id="reviewComment" placeholder="Escribe tu reseña..." rows="2">${ur ? (ur.comment||'') : ''}</textarea>
            <button class="primary-btn" onclick="submitReview(${ev.id})">${ur ? 'Actualizar' : 'Publicar'} reseña</button>
          </div>` : '<p style="margin-top:15px;"><a href="#" onclick="document.getElementById(\'loginBtn\').click();return false;">Inicia sesión</a> para reseñar.</p>'}
        <div class="reviews-list">${rd.reviews.map(r => `<div class="review-card"><div class="review-header"><strong onclick="showPublicProfile(${r.user_id})" style="cursor:pointer;">${r.user_name}</strong>${renderStars(r.rating)}</div>${r.comment ? `<p>${r.comment}</p>` : ''}<small class="review-date">${new Date(r.created_at).toLocaleDateString('es-CL')}</small></div>`).join('') || '<p style="opacity:0.5;">Sin reseñas aún.</p>'}</div>
      </div>`;

    content.querySelectorAll('.star-input').forEach(s => s.addEventListener('click', () => {
      const v = parseInt(s.dataset.value);
      document.getElementById('starRating').innerHTML = renderStarsInput(v);
      document.getElementById('starRating').dataset.rating = v;
    }));
    detailModal.style.display = 'flex';
  } catch { alert('Error al cargar'); }
}

async function submitReview(id) {
  if (!currentUser) return alert('Debes iniciar sesión');
  const r = parseInt((document.getElementById('starRating').dataset.rating || 0));
  if (!r) return alert('Selecciona estrellas');
  try { await api.post('/reviews', { event_id: id, rating: r, comment: document.getElementById('reviewComment').value }); alert('Reseña guardada'); showEventDetail(id); } catch(e) { alert(e.error); }
}

// =========================
// REGISTRATION
// =========================
function openRegistration(id) { selectedEventId = id; if (currentUser) { document.getElementById('participantName').value = currentUser.name; document.getElementById('participantEmail').value = currentUser.email; } modal.style.display = 'flex'; }
registrationForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  try { await api.post('/registrations', { event_id: selectedEventId, participant_name: document.getElementById('participantName').value, participant_email: document.getElementById('participantEmail').value }); alert('Inscripción exitosa'); modal.style.display = 'none'; registrationForm.reset(); loadEvents(); } catch(e) { alert(e.error); }
});

async function deleteEvent(id) { if (!confirm('¿Eliminar?')) return; try { await api.del(`/events/${id}`); loadEvents(); } catch(e) { alert(e.error); } }

// =========================
// SURVEY
// =========================
async function openSurvey(eventId) {
  selectedEventId = eventId;
  document.getElementById('surveyContent').innerHTML = `
    <p><strong>${t('survey_sat')} (1-5):</strong></p>
    <div class="star-rating" id="surveyRating">${renderStarsInput(0)}</div>
    <textarea id="surveyOpinion" placeholder="${t('survey_opinion')}..." rows="2"></textarea>
    <textarea id="surveySuggestion" placeholder="${t('survey_suggest')}..." rows="2"></textarea>
    <button class="primary-btn" onclick="submitSurvey()">${t('survey_submit')}</button>`;
  surveyModal.style.display = 'flex';
  document.getElementById('surveyContent').querySelectorAll('.star-input').forEach(s => s.addEventListener('click', () => {
    const v = parseInt(s.dataset.value);
    document.getElementById('surveyRating').innerHTML = renderStarsInput(v);
    document.getElementById('surveyRating').dataset.rating = v;
  }));
}

async function submitSurvey() {
  const r = parseInt((document.getElementById('surveyRating').dataset.rating || 0));
  if (!r) return alert('Selecciona satisfacción');
  try { await api.post('/surveys', { event_id: selectedEventId, satisfaction: r, opinion: document.getElementById('surveyOpinion').value, suggestion: document.getElementById('surveySuggestion').value }); alert('Encuesta enviada'); surveyModal.style.display = 'none'; } catch(e) { alert(e.error); }
}

// =========================
// MY REVIEWS
// =========================
myReviewsBtn.addEventListener('click', async () => {
  if (!currentUser) return;
  try {
    const regs = await api.get('/registrations/my');
    const items = await Promise.all(regs.map(async r => {
      let rh = '<p style="opacity:0.4;">Sin calificar</p>';
      try { const rd = await api.get(`/reviews/event/${r.event_id}`); const mr = rd.reviews.find(x => x.user_id === currentUser.id); if (mr) rh = `${renderStars(mr.rating)}${mr.comment ? `<p>${mr.comment}</p>` : ''}`; } catch {}
      return `<div class="my-review-item"><h4>${r.event_name}</h4><p><small>${formatDate(r.date)}</small></p>${rh}</div>`;
    }));
    document.getElementById('myReviewsList').innerHTML = items.join('') || '<p>Sin inscripciones.</p>';
    myReviewsModal.style.display = 'flex';
  } catch {}
});

// =========================
// SOCIAL FEED
// =========================
async function loadSocialFeed() {
  try {
    const posts = await api.get('/social');
    const h = document.getElementById('socialPosts');
    h.innerHTML = posts.map(p => {
      const likes = JSON.parse(p.liked_by || '[]');
      const liked = currentUser ? likes.includes(currentUser.id) : false;
      return `<div class="social-post">
        <div class="sp-header"><strong onclick="showPublicProfile(${p.user_id})" style="cursor:pointer;">${p.user_name}</strong><small>${new Date(p.created_at).toLocaleDateString('es-CL')}</small>${p.event_id ? `<small style="opacity:0.5;"> 📌 ${p.event_name||''}</small>` : ''}</div>
        <p>${p.content}</p>
        ${p.image ? `<img src="${p.image}" class="sp-image" />` : ''}
        <div class="sp-actions">
          <button class="sp-btn ${liked ? 'liked' : ''}" onclick="toggleLike(${p.id}, this)"><i class="fa-solid fa-heart"></i> <span>${p.like_count||0}</span></button>
          <button class="sp-btn" onclick="showComments(${p.id})"><i class="fa-solid fa-comment"></i> <span>${p.comment_count||0}</span></button>
        </div>
      </div>`;
    }).join('');
  } catch {}
}

async function toggleLike(postId, btn) {
  if (!currentUser) return alert('Debes iniciar sesión');
  try {
    const d = await api.post(`/social/${postId}/like`);
    btn.classList.toggle('liked', d.liked);
    const c = btn.querySelector('span');
    c.textContent = parseInt(c.textContent) + (d.liked ? 1 : -1);
  } catch {}
}

async function showComments(postId) {
  try {
    const cmts = await api.get(`/social/${postId}/comments`);
    const h = document.getElementById('commentsContent');
    h.innerHTML = `
      ${currentUser ? `<div style="display:flex;gap:10px;margin-bottom:15px;"><input type="text" id="commentInput" placeholder="Escribe un comentario..." style="flex:1;"/><button class="primary-btn" onclick="addComment(${postId})">Enviar</button></div>` : '<p>Inicia sesión para comentar.</p>'}
      <div class="comments-list">${cmts.map(c => `<div class="comment-item"><strong onclick="showPublicProfile(${c.user_id})" style="cursor:pointer;">${c.user_name}</strong> <span>${c.content}</span> <small>${new Date(c.created_at).toLocaleDateString('es-CL')}</small></div>`).join('') || '<p style="opacity:0.5;">Sin comentarios.</p>'}</div>`;
    commentsModal.style.display = 'flex';
  } catch {}
}

async function addComment(postId) {
  const inp = document.getElementById('commentInput');
  if (!inp.value) return;
  try { await api.post(`/social/${postId}/comments`, { content: inp.value }); inp.value = ''; showComments(postId); loadSocialFeed(); } catch(e) { alert(e.error); }
}

document.getElementById('socialPublishBtn').addEventListener('click', async () => {
  const content = document.getElementById('socialContent').value;
  const image = document.getElementById('socialImage').value;
  const event_id = document.getElementById('socialEventSelect').value;
  if (!content) return alert('Escribe algo');
  try { await api.post('/social', { content, image: image || undefined, event_id: event_id || undefined }); document.getElementById('socialContent').value = ''; document.getElementById('socialImage').value = ''; loadSocialFeed(); } catch(e) { alert(e.error); }
});

async function loadSocialEvents() {
  try {
    const evs = await api.get('/events');
    const sel = document.getElementById('socialEventSelect');
    sel.innerHTML = '<option value="">Sin evento</option>' + evs.map(e => `<option value="${e.id}">${e.name}</option>`).join('');
  } catch {}
}

// =========================
// TIMELINE
// =========================
async function renderTimeline() {
  try {
    const tl = await api.get('/stats/timeline');
    document.querySelectorAll('.tl-btn').forEach(b => b.addEventListener('click', () => {
      document.querySelectorAll('.tl-btn').forEach(x => x.classList.remove('active'));
      b.classList.add('active');
      renderTimelineList(tl[b.dataset.tl]);
    }));
    renderTimelineList(tl.upcoming);
  } catch {}
}

function renderTimelineList(items) {
  const h = document.getElementById('timelineContainer');
  if (!items || !items.length) { h.innerHTML = '<p style="text-align:center;opacity:0.5;">Sin eventos en esta categoría</p>'; return; }
  const activeTab = document.querySelector('.tl-btn.active')?.dataset.tl || 'upcoming';
  const statusLabel = { upcoming: 'Próximo', ongoing: 'Hoy', finished: 'Finalizado' };
  h.innerHTML = items.map((e, i) => {
    const side = i % 2 === 0 ? 'left' : 'right';
    const img = e.image ? `<img src="${e.image}" class="tl-img" loading="lazy" />` : '';
    return `<div class="tl-item tl-${side}">
      <div class="tl-dot"></div>
      <div class="tl-content" onclick="showEventDetail(${e.id})">
        ${img}
        <h4>${e.name}</h4>
        <p><i class="fa-solid fa-calendar"></i> ${formatDate(e.date)}</p>
        <p><i class="fa-solid fa-location-dot"></i> ${e.location} · ${e.participants} inscritos</p>
        <span class="tl-status ${activeTab}">${statusLabel[activeTab] || 'Próximo'}</span>
      </div>
    </div>`;
  }).join('');
}

// =========================
// CALENDAR
// =========================
function renderCalendar() {
  const y = calDate.getFullYear(), m = calDate.getMonth();
  document.getElementById('calMonthYear').textContent = new Date(y,m).toLocaleDateString('es-CL', {month:'long',year:'numeric'});
  const first = new Date(y,m,1).getDay(), daysInMonth = new Date(y,m+1,0).getDate();
  const monthEvents = events.filter(e => { const d = new Date(e.date); return d.getMonth() === m && d.getFullYear() === y; });
  const today = new Date();
  let html = '<div class="cal-header">' + ['Dom','Lun','Mar','Mié','Jue','Vie','Sáb'].map(d => `<div>${d}</div>`).join('') + '</div>';
  for (let i = 0; i < first; i++) html += '<div></div>';
  for (let d = 1; d <= daysInMonth; d++) {
    const dateStr = `${y}-${String(m+1).padStart(2,'0')}-${String(d).padStart(2,'0')}`;
    const dayEvents = monthEvents.filter(e => e.date === dateStr);
    const isToday = y === today.getFullYear() && m === today.getMonth() && d === today.getDate();
    const dots = dayEvents.map(e => {
      const cat = (e.category || '').toLowerCase().replace('í','i').replace('ó','o');
      return `<span class="event-dot ${cat}" title="${e.name}"></span>`;
    }).join('');
    html += `<div class="cal-day ${dayEvents.length ? 'has-event' : ''} ${isToday ? 'today' : ''}" onclick="${dayEvents.length ? `showEventDetail(${dayEvents[0].id})` : ''}">
      <span>${d}</span>
      ${dayEvents.length ? `<div class="event-dots">${dots}</div><small>${dayEvents.length}</small>` : ''}
    </div>`;
  }
  document.getElementById('calendarGrid').innerHTML = html;
}

document.getElementById('calPrev').addEventListener('click', () => { calDate.setMonth(calDate.getMonth() - 1); renderCalendar(); });
document.getElementById('calNext').addEventListener('click', () => { calDate.setMonth(calDate.getMonth() + 1); renderCalendar(); });

// =========================
// DASHBOARD
// =========================
async function updateDashboard() {
  try {
    const s = await api.get('/stats/dashboard');
    document.getElementById('totalEvents').innerText = s.totalEvents;
    document.getElementById('totalParticipants').innerText = s.totalParticipants;
    document.getElementById('popularEvent').innerText = s.popularEvent?.name || '-';
    document.getElementById('popularCategory').innerText = s.popularCategory?.category || '-';
    createChart(s.events);
    loadAnalysis();
    loadHeatmap();
  } catch {
    document.getElementById('totalEvents').innerText = events.length;
    document.getElementById('totalParticipants').innerText = events.reduce((s,e) => s + e.participants, 0);
    const p = events.reduce((a,b) => a.participants > b.participants ? a : b, {name:'-'});
    document.getElementById('popularEvent').innerText = p.name;
    document.getElementById('popularCategory').innerText = events[0]?.category || '-';
    createChart(events);
    loadHeatmap();
  }
}

function createChart(data) {
  const ctx = document.getElementById('eventsChart');
  if (!ctx) return;
  new Chart(ctx, { type: 'bar', data: { labels: data.map(e => e.name), datasets: [{ label: 'Inscritos', data: data.map(e => e.participants), backgroundColor: '#0ea5e9', borderColor: '#38bdf8', borderWidth: 1, borderRadius: 5 }] }, options: { responsive: true, plugins: { legend: { labels: { color: '#fff' } } }, scales: { x: { ticks: { color: '#94a3b8' } }, y: { ticks: { color: '#94a3b8' }, beginAtZero: true } } } });
}

async function loadHeatmap() {
  try {
    const h = await api.get('/stats/heatmap');
    const max = Math.max(...h.locations.map(l => l.total_participants), 1);
    document.getElementById('heatmapContainer').innerHTML = h.locations.map(l => {
      const pct = (l.total_participants / max) * 100;
      const color = pct > 75 ? '#ef4444' : pct > 50 ? '#f59e0b' : pct > 25 ? '#38bdf8' : '#1e293b';
      return `<div class="heatmap-bar"><span class="hm-label">${l.location}</span><div class="hm-track"><div class="hm-fill" style="width:${pct}%;background:${color};"></div></div><span class="hm-value">${l.total_participants}</span></div>`;
    }).join('') || '<p style="text-align:center;opacity:0.5;">Sin datos de ubicación</p>';
  } catch { document.getElementById('heatmapContainer').innerHTML = '<p style="text-align:center;opacity:0.5;">Sin datos</p>'; }
}

// =========================
// AI ANALYSIS
// =========================
async function loadAnalysis() {
  const ad = document.getElementById('analysisMessages');
  try { if (!token) { ad.innerHTML = '<p>Inicia sesión para ver IA.</p>'; return; } const d = await api.get('/ai/analyze'); ad.innerHTML = d.analysis.map(a => `<p>✔ ${a}</p>`).join(''); } catch { ad.innerHTML = '<p>Configura OpenAI para análisis avanzado.</p>'; }
}
document.getElementById('refreshAnalysisBtn')?.addEventListener('click', loadAnalysis);

// PDF
document.getElementById('exportPdfBtn')?.addEventListener('click', async () => {
  if (!token) return alert('Debes iniciar sesión como admin');
  try { const r = await fetch(`${API}/stats/export/pdf`, { headers: { Authorization: `Bearer ${token}` } }); if (!r.ok) throw new Error(); const b = await r.blob(); const u = URL.createObjectURL(b); const a = document.createElement('a'); a.href = u; a.download = 'estadisticas.pdf'; a.click(); URL.revokeObjectURL(u); } catch { alert('Error al exportar'); }
});

// Calendar sync
async function syncToCalendar(id) {
  try { const e = await api.get(`/events/${id}`); const ed = new Date(e.date+'T12:00:00'); ed.setHours(ed.getHours()+2); const d = await api.post('/calendar/sync', { summary: e.name, description: e.description||'', location: e.location, startDate: e.date, endDate: ed.toISOString().split('T')[0] }); if (d.eventUrl) window.open(d.eventUrl, '_blank'); else if (d.googleCalendarLink) window.open(d.googleCalendarLink, '_blank'); } catch { alert('Error al sincronizar'); }
}

// Map
function initMap() { map = L.map('map').setView([-33.4489,-70.6693], 12); L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { attribution: '&copy; OpenStreetMap', maxZoom: 18 }).addTo(map); }
function updateMap() {
  if (!map) return;
  mapMarkers.forEach(m => map.removeLayer(m)); mapMarkers = [];
  events.forEach(e => { if (e.lat && e.lng) { const m = L.marker([e.lat, e.lng]).addTo(map).bindPopup(`<b>${e.name}</b><br>${e.location}`); mapMarkers.push(m); } });
  if (mapMarkers.length) map.fitBounds(L.featureGroup(mapMarkers).getBounds().pad(0.1));
}

// Notifications
document.getElementById('sendTestNotificationBtn')?.addEventListener('click', async () => {
  if (!token) return alert('Debes iniciar sesión');
  try { await api.post('/notifications/send', { title: 'SmartEvents', body: 'Notificación de prueba' }); alert('Enviada'); } catch { alert('Error'); }
});

async function subscribeToPush() {
  try { if (!token || !('serviceWorker' in navigator) || !('PushManager' in window)) return; const reg = await navigator.serviceWorker.register('/sw.js'); const sub = await reg.pushManager.subscribe({ userVisibleOnly: true, applicationServerKey: urlBase64ToUint8Array('BHW_8R7KkRh_nKq8LFZPxTKl_8fIdcq0JfGZd_8XgJk9QQ5H3Rn3sLVp0K0N7sTzGq0V0W0Y0Q0I0M0c0f0g0h0') }); await api.post('/notifications/subscribe', sub); } catch {}
}
function urlBase64ToUint8Array(b) { const p = '='.repeat((4-b.length%4)%4); return Uint8Array.from([...window.atob((b+p).replace(/-/g,'+').replace(/_/g,'/'))].map(c => c.charCodeAt(0))); }

// Dark mode
let dark = localStorage.getItem('darkMode') !== 'false';
if (!dark) document.body.classList.add('dark-mode');
darkModeBtn.addEventListener('click', () => { document.body.classList.toggle('dark-mode'); dark = !dark; localStorage.setItem('darkMode', dark); darkModeBtn.innerHTML = dark ? '<i class="fa-solid fa-moon"></i>' : '<i class="fa-solid fa-sun"></i>'; });

// Admin
document.getElementById('eventForm')?.addEventListener('submit', async (e) => {
  e.preventDefault();
  try { await api.post('/events', { name: document.getElementById('eventName').value, location: document.getElementById('eventLocation').value, date: document.getElementById('eventDate').value, slots: parseInt(document.getElementById('eventSlots').value), category: document.getElementById('eventCategory').value }); document.getElementById('eventForm').reset(); alert('Evento creado'); loadEvents(); } catch(e) { alert(e.error); }
});

document.getElementById('sponsorForm')?.addEventListener('submit', async (e) => {
  e.preventDefault();
  try { await api.post('/sponsors', { event_id: document.getElementById('sponsorEventSelect').value, name: document.getElementById('sponsorName').value, logo_url: document.getElementById('sponsorLogo').value || undefined, description: document.getElementById('sponsorDesc').value, website: document.getElementById('sponsorWebsite').value || undefined }); document.getElementById('sponsorForm').reset(); alert('Patrocinador agregado'); loadSponsorEvents(); } catch(e) { alert(e.error); }
});

async function loadSponsorEvents() {
  try { const evs = await api.get('/events'); const sel = document.getElementById('sponsorEventSelect'); sel.innerHTML = '<option value="">Seleccionar evento</option>' + evs.map(e => `<option value="${e.id}">${e.name}</option>`).join(''); } catch {}
}

async function loadUsers() {
  try { if (!token) return; const u = await api.get('/auth/users'); document.getElementById('usersList').innerHTML = u.map(x => `<div class="user-row"><span>${x.name}</span><span>${x.email}</span><span class="tag">${x.role}</span></div>`).join(''); } catch {}
}

// Filters
searchInput.addEventListener('input', loadEvents);
categoryFilter.addEventListener('change', loadEvents);
popularityFilter.addEventListener('change', () => renderEvents());

// Init
(async function init() {
  document.getElementById('langSelector').value = currentLang;
  applyTranslation();
  updateAuthUI();
  initMap();
  await loadEvents();
  await loadSocialFeed();
  await loadSocialEvents();
  subscribeToPush();
})();
