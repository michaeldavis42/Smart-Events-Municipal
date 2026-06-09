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
closeComments.addEventListener('click', () => commentsModal.style.display = 'none');

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
