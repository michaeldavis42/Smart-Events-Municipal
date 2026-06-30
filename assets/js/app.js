const API = 'http://localhost:3000/api';
let token = localStorage.getItem('token') || null;
let currentUser = JSON.parse(localStorage.getItem('user')) || null;
let events = [];
let currentLang = localStorage.getItem('lang') || 'es';

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
  try { if (!token || !('serviceWorker' in navigator) || !('PushManager' in window)) return; const reg = await navigator.serviceWorker.register('/sw.js'); const sub = await reg.pushManager.subscribe({ userVisibleOnly: true, applicationServerKey: urlBase64ToUint8Array('BGpGu9gIryGLBokNw4a5KtL1jfjuvaZODKH6dc2d_eKMlAAB8o7EaKrKtp6BtmtQd-Pzn25FWG0XZMkoh_jIvio') }); await api.post('/notifications/subscribe', sub); } catch {}
}
function urlBase64ToUint8Array(b) { const p = '='.repeat((4-b.length%4)%4); return Uint8Array.from([...window.atob((b+p).replace(/-/g,'+').replace(/_/g,'/'))].map(c => c.charCodeAt(0))); }

// =========================
// DARK MODE
// =========================
let dark = localStorage.getItem('darkMode') !== 'false';
if (!dark) document.body.classList.add('dark-mode');
darkModeBtn.addEventListener('click', () => { document.body.classList.toggle('dark-mode'); dark = !dark; localStorage.setItem('darkMode', dark); darkModeBtn.innerHTML = dark ? '<i class="fa-solid fa-moon"></i>' : '<i class="fa-solid fa-sun"></i>'; });
