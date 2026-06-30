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

// Notifications
document.getElementById('sendTestNotificationBtn')?.addEventListener('click', async () => {
  if (!token) return alert('Debes iniciar sesión');
  try { await api.post('/notifications/send', { title: 'SmartEvents', body: 'Notificación de prueba' }); alert('Enviada'); } catch { alert('Error'); }
});
