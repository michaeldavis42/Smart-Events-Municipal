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
    providerNavItem.style.display = 'block';
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
    providerNavItem.style.display = 'none';
    providerSection.style.display = 'none';
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

// =========================
// PROFILE
// =========================
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

// =========================
// PUBLIC PROFILE
// =========================
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

// =========================
// SEARCH PEOPLE
// =========================
searchPeopleBtn.addEventListener('click', () => { searchPeopleModal.style.display = 'flex'; document.getElementById('peopleSearchResults').innerHTML = ''; document.getElementById('peopleSearchInput').value = ''; });
closeSearchPeople.addEventListener('click', () => searchPeopleModal.style.display = 'none');
let pst; peopleSearchInput.addEventListener('input', () => { clearTimeout(pst); pst = setTimeout(async () => { const q = peopleSearchInput.value; if (!q) return; const u = await api.get(`/auth/search?q=${encodeURIComponent(q)}`); document.getElementById('peopleSearchResults').innerHTML = u.map(x => `<div class="user-search-card" onclick="showPublicProfile(${x.id})"><img src="${x.avatar_url || 'https://cdn-icons-png.flaticon.com/512/3135/3135715.png'}" class="search-avatar" /><div><strong>${x.name}</strong><p>${x.company_name || x.email}</p><span class="tag">${x.role}</span></div></div>`).join('') || '<p>Sin resultados</p>'; }, 300); });
