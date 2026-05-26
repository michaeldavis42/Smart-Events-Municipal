const API = 'http://localhost:3000/api';
let token = localStorage.getItem('token') || null;
let currentUser = JSON.parse(localStorage.getItem('user')) || null;
let events = [];
let map = null;
let mapMarkers = [];

const container = document.getElementById('eventsContainer');
const searchInput = document.getElementById('searchInput');
const categoryFilter = document.getElementById('categoryFilter');
const popularityFilter = document.getElementById('popularityFilter');
const modal = document.getElementById('registrationModal');
const authModal = document.getElementById('authModal');
const detailModal = document.getElementById('eventDetailModal');
const closeModal = document.querySelector('#registrationModal .close-modal');
const closeAuth = document.getElementById('closeAuthModal');
const closeDetail = document.getElementById('closeDetailModal');
const registrationForm = document.getElementById('registrationForm');
const loginBtn = document.getElementById('loginBtn');
const logoutBtn = document.getElementById('logoutBtn');
const authNavItem = document.getElementById('authNavItem');
const userNavItem = document.getElementById('userNavItem');
const userNameDisplay = document.getElementById('userNameDisplay');
const adminSection = document.getElementById('admin');
const adminNavItem = document.getElementById('adminNavItem');
const darkModeBtn = document.getElementById('darkModeBtn');

let selectedEventId = null;

const api = {
  get: async (url) => {
    const res = await fetch(`${API}${url}`, {
      headers: { Authorization: token ? `Bearer ${token}` : '' }
    });
    if (!res.ok) throw await res.json();
    return res.json();
  },
  post: async (url, body) => {
    const res = await fetch(`${API}${url}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: token ? `Bearer ${token}` : '' },
      body: JSON.stringify(body)
    });
    if (!res.ok) throw await res.json();
    return res.json();
  },
  put: async (url, body) => {
    const res = await fetch(`${API}${url}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify(body)
    });
    if (!res.ok) throw await res.json();
    return res.json();
  },
  del: async (url) => {
    const res = await fetch(`${API}${url}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` }
    });
    if (!res.ok) throw await res.json();
    return res.json();
  }
};

// =========================
// AUTH
// =========================
function setAuth(user, t) {
  token = t;
  currentUser = user;
  if (t) localStorage.setItem('token', t);
  else localStorage.removeItem('token');
  if (user) localStorage.setItem('user', JSON.stringify(user));
  else localStorage.removeItem('user');
  updateAuthUI();
}

function updateAuthUI() {
  if (currentUser) {
    authNavItem.style.display = 'none';
    userNavItem.style.display = 'flex';
    userNameDisplay.textContent = currentUser.name;
    if (currentUser.role === 'admin' || currentUser.role === 'organizer') {
      adminNavItem.style.display = 'block';
      adminSection.style.display = 'block';
      loadUsers();
    } else {
      adminNavItem.style.display = 'none';
      adminSection.style.display = 'none';
    }
  } else {
    authNavItem.style.display = 'block';
    userNavItem.style.display = 'none';
    adminNavItem.style.display = 'none';
    adminSection.style.display = 'none';
  }
}

loginBtn.addEventListener('click', () => {
  document.getElementById('loginForm').style.display = 'block';
  document.getElementById('registerForm').style.display = 'none';
  document.getElementById('authModalTitle').textContent = 'Iniciar sesión';
  authModal.style.display = 'flex';
});

closeAuth.addEventListener('click', () => authModal.style.display = 'none');
closeModal.addEventListener('click', () => modal.style.display = 'none');
closeDetail.addEventListener('click', () => detailModal.style.display = 'none');

document.getElementById('showRegisterLink').addEventListener('click', (e) => {
  e.preventDefault();
  document.getElementById('loginForm').style.display = 'none';
  document.getElementById('registerForm').style.display = 'block';
  document.getElementById('authModalTitle').textContent = 'Crear cuenta';
});

document.getElementById('showLoginLink').addEventListener('click', (e) => {
  e.preventDefault();
  document.getElementById('loginForm').style.display = 'block';
  document.getElementById('registerForm').style.display = 'none';
  document.getElementById('authModalTitle').textContent = 'Iniciar sesión';
});

document.getElementById('loginSubmitBtn').addEventListener('click', async () => {
  const email = document.getElementById('loginEmail').value;
  const password = document.getElementById('loginPassword').value;
  try {
    const data = await api.post('/auth/login', { email, password });
    setAuth(data.user, data.token);
    authModal.style.display = 'none';
    loadEvents();
  } catch (err) {
    alert(err.error || 'Error al iniciar sesión');
  }
});

document.getElementById('registerSubmitBtn').addEventListener('click', async () => {
  const name = document.getElementById('registerName').value;
  const email = document.getElementById('registerEmail').value;
  const password = document.getElementById('registerPassword').value;
  if (!name || !email || !password) return alert('Todos los campos son obligatorios');
  try {
    const data = await api.post('/auth/register', { name, email, password });
    setAuth(data.user, data.token);
    authModal.style.display = 'none';
    loadEvents();
  } catch (err) {
    alert(err.error || 'Error al registrarse');
  }
});

logoutBtn.addEventListener('click', () => {
  setAuth(null, null);
  loadEvents();
});

window.addEventListener('click', (e) => {
  if (e.target === authModal) authModal.style.display = 'none';
  if (e.target === modal) modal.style.display = 'none';
  if (e.target === detailModal) detailModal.style.display = 'none';
});

// =========================
// LOAD EVENTS
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
  } catch {
    events = [];
    renderEvents();
  }
}

function renderEvents(filteredList) {
  const list = filteredList || events;
  container.innerHTML = '';

  if (list.length === 0) {
    container.innerHTML = '<p style="grid-column:1/-1;text-align:center;padding:40px;">No hay eventos disponibles</p>';
    return;
  }

  let displayList = [...list];
  const popularity = popularityFilter.value;
  if (popularity === 'high') displayList.sort((a, b) => b.participants - a.participants);
  if (popularity === 'low') displayList.sort((a, b) => a.participants - b.participants);

  displayList.forEach(event => {
    const card = document.createElement('div');
    card.classList.add('event-card');
    const img = event.image || 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?q=80&w=2070';
    const statusClass = event.status === 'Completado' ? 'status-completed' : event.status === 'Próximo' ? 'status-upcoming' : 'status-available';

    card.innerHTML = `
      <img src="${img}" alt="${event.name}" loading="lazy" />
      <div class="event-info">
        <h3>${event.name}</h3>
        <p><i class="fa-solid fa-calendar"></i> ${formatDate(event.date)}</p>
        <p><i class="fa-solid fa-location-dot"></i> ${event.location}</p>
        <p>${event.description || ''}</p>
        <p><strong>Categoría:</strong> ${event.category}</p>
        <p><strong>Cupos:</strong> ${event.slots} <strong>Inscritos:</strong> ${event.participants}</p>
        <div class="event-status ${statusClass}">${event.status}</div>
        <div class="event-buttons">
          <button onclick="openRegistration(${event.id})">Inscribirse</button>
          <button onclick="showEventDetail(${event.id})">Ver detalles</button>
          ${(currentUser && (currentUser.role === 'admin' || currentUser.role === 'organizer')) ? `<button onclick="deleteEvent(${event.id})" style="background:#ef4444;color:white;">Eliminar</button>` : ''}
        </div>
      </div>
    `;
    container.appendChild(card);
  });
}

function formatDate(dateStr) {
  const d = new Date(dateStr + 'T12:00:00');
  return d.toLocaleDateString('es-CL', { year: 'numeric', month: 'long', day: 'numeric' });
}

// =========================
// EVENT DETAIL MODAL
// =========================
async function showEventDetail(id) {
  try {
    const event = await api.get(`/events/${id}`);
    const content = document.getElementById('eventDetailContent');
    const img = event.image || 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?q=80&w=2070';
    content.innerHTML = `
      <img src="${img}" alt="${event.name}" style="width:100%;height:250px;object-fit:cover;border-radius:15px;margin-bottom:20px;" />
      <h2>${event.name}</h2>
      <p><i class="fa-solid fa-calendar"></i> ${formatDate(event.date)}</p>
      <p><i class="fa-solid fa-location-dot"></i> ${event.location}</p>
      <p>${event.description || 'Sin descripción'}</p>
      <p><strong>Categoría:</strong> ${event.category}</p>
      <p><strong>Cupos:</strong> ${event.slots} | <strong>Inscritos:</strong> ${event.participants}</p>
      <p><strong>Estado:</strong> ${event.status}</p>
      <div style="margin-top:20px;display:flex;gap:10px;flex-wrap:wrap;">
        <button class="primary-btn" onclick="syncToCalendar(${event.id})">
          <i class="fa-solid fa-calendar-plus"></i> Google Calendar
        </button>
        <button class="secondary-btn" onclick="document.getElementById('eventDetailModal').style.display='none';openRegistration(${event.id})">
          Inscribirse
        </button>
      </div>
    `;
    detailModal.style.display = 'flex';
  } catch {
    alert('Error al cargar detalles');
  }
}

// =========================
// REGISTRATION
// =========================
function openRegistration(id) {
  selectedEventId = id;
  if (currentUser) {
    document.getElementById('participantName').value = currentUser.name;
    document.getElementById('participantEmail').value = currentUser.email;
  }
  modal.style.display = 'flex';
}

registrationForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const name = document.getElementById('participantName').value;
  const email = document.getElementById('participantEmail').value;
  if (!name || !email) return alert('Complete todos los campos');

  try {
    await api.post('/registrations', {
      event_id: selectedEventId,
      participant_name: name,
      participant_email: email
    });
    alert('Inscripción realizada correctamente');
    modal.style.display = 'none';
    registrationForm.reset();
    loadEvents();
  } catch (err) {
    alert(err.error || 'Error al inscribirse');
  }
});

// =========================
// DELETE EVENT (admin)
// =========================
async function deleteEvent(id) {
  if (!confirm('¿Eliminar este evento?')) return;
  try {
    await api.del(`/events/${id}`);
    loadEvents();
  } catch (err) {
    alert(err.error || 'Error al eliminar');
  }
}

// =========================
// DASHBOARD
// =========================
async function updateDashboard() {
  try {
    const stats = await api.get('/stats/dashboard');
    document.getElementById('totalEvents').innerText = stats.totalEvents;
    document.getElementById('totalParticipants').innerText = stats.totalParticipants;
    document.getElementById('popularEvent').innerText = stats.popularEvent?.name || '-';
    document.getElementById('popularCategory').innerText = stats.popularCategory?.category || '-';
    createChart(stats.events);
    loadAnalysis();
  } catch {
    // fallback a datos locales
    document.getElementById('totalEvents').innerText = events.length;
    const totalPart = events.reduce((s, e) => s + e.participants, 0);
    document.getElementById('totalParticipants').innerText = totalPart;
    const popular = events.reduce((a, b) => a.participants > b.participants ? a : b, { name: '-' });
    document.getElementById('popularEvent').innerText = popular.name;
    document.getElementById('popularCategory').innerText = events[0]?.category || '-';
    createChart(events);
  }
}

function createChart(data) {
  const ctx = document.getElementById('eventsChart');
  if (!ctx) return;
  new Chart(ctx, {
    type: 'bar',
    data: {
      labels: data.map(e => e.name),
      datasets: [{
        label: 'Inscritos',
        data: data.map(e => e.participants),
        backgroundColor: '#0ea5e9',
        borderColor: '#38bdf8',
        borderWidth: 1,
        borderRadius: 5
      }]
    },
    options: {
      responsive: true,
      plugins: { legend: { labels: { color: '#fff' } } },
      scales: {
        x: { ticks: { color: '#94a3b8' } },
        y: { ticks: { color: '#94a3b8' }, beginAtZero: true }
      }
    }
  });
}

// =========================
// AI ANALYSIS
// =========================
async function loadAnalysis() {
  const analysisDiv = document.getElementById('analysisMessages');
  try {
    if (!token) {
      analysisDiv.innerHTML = '<p>Inicia sesión para ver análisis con IA.</p>';
      return;
    }
    const data = await api.get('/ai/analyze');
    analysisDiv.innerHTML = data.analysis.map(a => `<p>✔ ${a}</p>`).join('');
  } catch {
    analysisDiv.innerHTML = '<p>Conecta el backend y configura OpenAI para análisis avanzado.</p>';
  }
}

document.getElementById('refreshAnalysisBtn')?.addEventListener('click', loadAnalysis);

// =========================
// PDF EXPORT
// =========================
document.getElementById('exportPdfBtn')?.addEventListener('click', async () => {
  try {
    if (!token) return alert('Debes iniciar sesión como admin');
    const res = await fetch(`${API}/stats/export/pdf`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    if (!res.ok) throw new Error();
    const blob = await res.blob();
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'estadisticas-smartevents.pdf';
    a.click();
    URL.revokeObjectURL(url);
  } catch {
    alert('Error al exportar PDF. Asegúrate de que el backend esté corriendo.');
  }
});

// =========================
// GOOGLE CALENDAR SYNC
// =========================
async function syncToCalendar(eventId) {
  try {
    const event = await api.get(`/events/${eventId}`);
    const endDate = new Date(event.date + 'T12:00:00');
    endDate.setHours(endDate.getHours() + 2);
    const data = await api.post('/calendar/sync', {
      summary: event.name,
      description: event.description || 'Evento SmartEvents Municipal',
      location: event.location,
      startDate: event.date,
      endDate: endDate.toISOString().split('T')[0]
    });

    if (data.eventUrl) {
      window.open(data.eventUrl, '_blank');
    } else if (data.googleCalendarLink) {
      window.open(data.googleCalendarLink, '_blank');
    }
  } catch {
    alert('Error al sincronizar con Google Calendar');
  }
}

// =========================
// MAPA INTERACTIVO
// =========================
function initMap() {
  map = L.map('map').setView([-33.4489, -70.6693], 12);
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; OpenStreetMap contributors',
    maxZoom: 18
  }).addTo(map);
}

function updateMap() {
  if (!map) return;
  mapMarkers.forEach(m => map.removeLayer(m));
  mapMarkers = [];

  events.forEach(event => {
    if (event.lat && event.lng) {
      const marker = L.marker([event.lat, event.lng])
        .addTo(map)
        .bindPopup(`<b>${event.name}</b><br>${event.location}<br>Inscritos: ${event.participants}`);
      mapMarkers.push(marker);
    }
  });

  if (mapMarkers.length > 0) {
    const group = L.featureGroup(mapMarkers);
    map.fitBounds(group.getBounds().pad(0.1));
  }
}

// =========================
// NOTIFICACIONES PUSH
// =========================
document.getElementById('sendTestNotificationBtn')?.addEventListener('click', async () => {
  try {
    if (!token) return alert('Debes iniciar sesión');
    await api.post('/notifications/send', {
      title: 'SmartEvents Municipal',
      body: '¡Notificación de prueba! Los eventos están disponibles.'
    });
    alert('Notificación enviada');
  } catch {
    alert('Error al enviar notificación');
  }
});

async function subscribeToPush() {
  try {
    if (!token || !('serviceWorker' in navigator) || !('PushManager' in window)) return;
    const reg = await navigator.serviceWorker.register('/sw.js');
    const sub = await reg.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: urlBase64ToUint8Array('BHW_8R7KkRh_nKq8LFZPxTKl_8fIdcq0JfGZd_8XgJk9QQ5H3Rn3sLVp0K0N7sTzGq0V0W0Y0Q0I0M0c0f0g0h0')
    });
    await api.post('/notifications/subscribe', sub);
  } catch { /* push not available */ }
}

function urlBase64ToUint8Array(base64String) {
  const padding = '='.repeat((4 - base64String.length % 4) % 4);
  const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');
  const rawData = window.atob(base64);
  return Uint8Array.from([...rawData].map(char => char.charCodeAt(0)));
}

// =========================
// DARK MODE
// =========================
let dark = localStorage.getItem('darkMode') !== 'false';
if (!dark) document.body.classList.add('dark-mode');

darkModeBtn.addEventListener('click', () => {
  document.body.classList.toggle('dark-mode');
  dark = !dark;
  localStorage.setItem('darkMode', dark);
  darkModeBtn.innerHTML = dark ? '<i class="fa-solid fa-moon"></i>' : '<i class="fa-solid fa-sun"></i>';
});

// =========================
// ADMIN - CREATE EVENT
// =========================
document.getElementById('eventForm')?.addEventListener('submit', async (e) => {
  e.preventDefault();
  try {
    await api.post('/events', {
      name: document.getElementById('eventName').value,
      location: document.getElementById('eventLocation').value,
      date: document.getElementById('eventDate').value,
      slots: parseInt(document.getElementById('eventSlots').value),
      category: document.getElementById('eventCategory').value
    });
    document.getElementById('eventForm').reset();
    alert('Evento creado correctamente');
    loadEvents();
  } catch (err) {
    alert(err.error || 'Error al crear evento');
  }
});

// =========================
// ADMIN - LOAD USERS
// =========================
async function loadUsers() {
  try {
    if (!token) return;
    const users = await api.get('/auth/users');
    const list = document.getElementById('usersList');
    list.innerHTML = users.map(u => `
      <div class="user-row">
        <span>${u.name}</span>
        <span>${u.email}</span>
        <span class="tag">${u.role}</span>
      </div>
    `).join('');
  } catch { /* silent */ }
}

// =========================
// FILTROS
// =========================
searchInput.addEventListener('input', loadEvents);
categoryFilter.addEventListener('change', loadEvents);
popularityFilter.addEventListener('change', () => renderEvents());

// =========================
// INICIALIZACIÓN
// =========================
(async function init() {
  updateAuthUI();
  initMap();
  await loadEvents();
  subscribeToPush();
})();
