// =========================
// ADMIN — EVENT FORM
// =========================
document.getElementById('eventForm')?.addEventListener('submit', async (e) => {
  e.preventDefault();
  try { await api.post('/events', { name: document.getElementById('eventName').value, location: document.getElementById('eventLocation').value, date: document.getElementById('eventDate').value, slots: parseInt(document.getElementById('eventSlots').value), category: document.getElementById('eventCategory').value }); document.getElementById('eventForm').reset(); alert('Evento creado'); loadEvents(); } catch(e) { alert(e.error); }
});

// =========================
// ADMIN — SPONSOR FORM
// =========================
document.getElementById('sponsorForm')?.addEventListener('submit', async (e) => {
  e.preventDefault();
  try { await api.post('/sponsors', { event_id: document.getElementById('sponsorEventSelect').value, name: document.getElementById('sponsorName').value, logo_url: document.getElementById('sponsorLogo').value || undefined, description: document.getElementById('sponsorDesc').value, website: document.getElementById('sponsorWebsite').value || undefined }); document.getElementById('sponsorForm').reset(); alert('Patrocinador agregado'); loadSponsorEvents(); } catch(e) { alert(e.error); }
});

async function loadSponsorEvents() {
  try { const evs = await api.get('/events'); const sel = document.getElementById('sponsorEventSelect'); sel.innerHTML = '<option value="">Seleccionar evento</option>' + evs.map(e => `<option value="${e.id}">${e.name}</option>`).join(''); } catch {}
}

// =========================
// ADMIN — USER MANAGEMENT
// =========================
async function loadUsers() {
  try { if (!token) return; const u = await api.get('/auth/users'); document.getElementById('usersList').innerHTML = u.map(x => `<div class="user-row"><span>${x.name}</span><span>${x.email}</span><span class="tag">${x.role}</span></div>`).join(''); } catch {}
}
