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
    renderTimeline();
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
closeModal.addEventListener('click', () => modal.style.display = 'none');
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
closeMyReviews.addEventListener('click', () => myReviewsModal.style.display = 'none');
