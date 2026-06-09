// =========================
// PROVIDERS
// =========================
providerNavItem.addEventListener('click', (e) => {
  e.preventDefault();
  providerSection.style.display = 'block';
  providerSection.scrollIntoView({ behavior: 'smooth' });
  loadProviderDashboard();
});

document.querySelectorAll('.provider-tab').forEach(t => t.addEventListener('click', () => {
  document.querySelectorAll('.provider-tab').forEach(x => x.classList.remove('active'));
  document.querySelectorAll('.provider-tab-content').forEach(x => x.classList.remove('active'));
  t.classList.add('active');
  const tab = document.getElementById(`ptab-${t.dataset.ptab}`);
  if (tab) tab.classList.add('active');
  if (t.dataset.ptab === 'dashboard') loadProviderDashboard();
  if (t.dataset.ptab === 'profile') loadProviderProfile();
  if (t.dataset.ptab === 'matches') loadProviderMatches();
}));

document.getElementById('providerForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  await saveProviderProfile();
});

async function loadProviderDashboard() {
  try {
    const d = await api.get('/providers/dashboard');
    if (!d.has_profile) {
      document.getElementById('providerDashboard').innerHTML = `
        <div style="grid-column:1/-1;text-align:center;padding:30px;background:#1e293b;border-radius:16px;">
          <i class="fa-solid fa-handshake fa-2x" style="color:#38bdf8;margin-bottom:15px;display:block;"></i>
          <p data-i18n="prov_complete_first">Completa tu perfil al 100% para ver eventos compatibles.</p>
        </div>`;
      return;
    }
    document.getElementById('providerDashboard').innerHTML = `
      <div class="provider-stat-card"><i class="fa-solid fa-percent fa-2x" style="color:${d.completion === 100 ? '#22c55e' : '#f59e0b'}"></i><p>${d.completion}%</p><small>Perfil completado</small></div>
      <div class="provider-stat-card"><i class="fa-solid fa-calendar fa-2x" style="color:#38bdf8"></i><p>${d.compatible}</p><small>Eventos compatibles</small></div>
      <div class="provider-stat-card"><i class="fa-solid fa-paper-plane fa-2x" style="color:#a855f7"></i><p>${d.requests_sent}</p><small>Solicitudes enviadas</small></div>
      <div class="provider-stat-card"><i class="fa-solid fa-clock fa-2x" style="color:${d.pending > 0 ? '#f59e0b' : '#64748b'}"></i><p>${d.pending}</p><small>Pendientes</small></div>`;
  } catch { document.getElementById('providerDashboard').innerHTML = '<p style="text-align:center;opacity:0.6;">Error al cargar dashboard.</p>'; }
}

async function loadProviderProfile() {
  try {
    const d = await api.get('/providers/profile');
    const fill = document.getElementById('completionFill');
    const text = document.getElementById('completionText');
    fill.style.width = `${d.completion}%`;
    text.textContent = `${d.completion}% completado`;
    document.getElementById('incompleteMessage').style.display = d.completion < 100 ? 'block' : 'none';
    if (d.profile) {
      const p = d.profile;
      document.getElementById('pfBusinessName').value = p.business_name || '';
      document.getElementById('pfResponsibleName').value = p.responsible_name || '';
      document.getElementById('pfEmail').value = p.email || '';
      document.getElementById('pfPhone').value = p.phone || '';
      document.getElementById('pfCategory').value = p.category || '';
      document.getElementById('pfDescription').value = p.description || '';
      document.getElementById('pfLocation').value = p.location || '';
      document.getElementById('pfPriceRange').value = p.price_range || '';
      document.getElementById('pfCapacity').value = p.capacity || '';
      document.getElementById('pfAvailability').value = p.availability || '';
      document.getElementById('pfSocialLinks').value = p.social_links || '';
      document.getElementById('pfLogoUrl').value = p.logo_url || '';
    }
  } catch { /* silent */ }
}

async function saveProviderProfile() {
  const data = {
    business_name: document.getElementById('pfBusinessName').value,
    responsible_name: document.getElementById('pfResponsibleName').value,
    email: document.getElementById('pfEmail').value,
    phone: document.getElementById('pfPhone').value,
    category: document.getElementById('pfCategory').value,
    description: document.getElementById('pfDescription').value,
    location: document.getElementById('pfLocation').value,
    price_range: document.getElementById('pfPriceRange').value,
    capacity: document.getElementById('pfCapacity').value,
    availability: document.getElementById('pfAvailability').value,
    social_links: document.getElementById('pfSocialLinks').value,
    logo_url: document.getElementById('pfLogoUrl').value
  };
  try {
    const d = await api.post('/providers/profile', data);
    const fill = document.getElementById('completionFill');
    const text = document.getElementById('completionText');
    fill.style.width = `${d.completion}%`;
    text.textContent = `${d.completion}% completado`;
    document.getElementById('incompleteMessage').style.display = d.completion < 100 ? 'block' : 'none';
    alert('Perfil guardado');
  } catch (e) { alert(e.error || 'Error al guardar'); }
}

async function loadProviderMatches() {
  try {
    const d = await api.get('/providers/matches');
    const fill = document.getElementById('completionFill');
    const text = document.getElementById('completionText');
    if (fill && text) { fill.style.width = `${d.completion}%`; text.textContent = `${d.completion}% completado`; }
    const incompleteMsg = document.getElementById('providerIncompleteMsg');
    const container = document.getElementById('providerMatchesContainer');
    if (d.completion < 100) {
      incompleteMsg.style.display = 'block';
      container.innerHTML = '';
      return;
    }
    incompleteMsg.style.display = 'none';
    if (!d.matches || !d.matches.length) {
      container.innerHTML = '<p style="text-align:center;padding:40px;opacity:0.6;">No hay eventos compatibles con tu rubro.</p>';
      return;
    }
    container.innerHTML = d.matches.map(e => {
      const img = e.image || 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?q=80&w=2070';
      const scorePct = Math.round((e.match_score / 85) * 100);
      return `<div class="match-card">
        <div class="match-score"><span>${Math.min(scorePct, 100)}%</span><small>Coincidencia</small></div>
        <div class="match-info">
          <h4>${e.name}</h4>
          <p><i class="fa-solid fa-calendar"></i> ${formatDate(e.date)}</p>
          <p><i class="fa-solid fa-location-dot"></i> ${e.location} · ${e.participants} inscritos · ${e.slots} cupos</p>
          <div class="match-actions">
            <button class="btn-view" onclick="showEventDetail(${e.id})">Ver evento</button>
            <button class="btn-contact" onclick="contactOrganizer(${e.id}, this)">Contactar</button>
          </div>
          <div id="orgInfo-${e.id}"></div>
        </div>
      </div>`;
    }).join('');
  } catch { document.getElementById('providerMatchesContainer').innerHTML = '<p style="text-align:center;padding:40px;opacity:0.6;">Error al cargar coincidencias.</p>'; }
}

async function contactOrganizer(eventId, btn) {
  if (!token) return alert('Debes iniciar sesión');
  btn.disabled = true; btn.textContent = 'Enviando...';
  try {
    const d = await api.post('/providers/contact', { event_id: eventId });
    const org = await api.get(`/providers/organizer-info/${eventId}`);
    document.getElementById(`orgInfo-${eventId}`).innerHTML = `
      <div class="organizer-info-box">
        <p><i class="fa-solid fa-user"></i> <strong>${org.event.organizer_name}</strong></p>
        <p><i class="fa-solid fa-envelope"></i> ${org.event.organizer_email}</p>
        <p><i class="fa-solid fa-phone"></i> ${org.event.organizer_phone || 'No disponible'}</p>
        <p><i class="fa-solid fa-calendar-check"></i> ${org.event.name} — ${formatDate(org.event.date)}</p>
      </div>`;
    btn.textContent = 'Contactado ✓';
  } catch (e) {
    btn.disabled = false;
    btn.textContent = 'Contactar';
    alert(e.error || 'Error al contactar');
  }
}
