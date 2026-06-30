// =========================
// EVENT FILTERS
// =========================
searchInput.addEventListener('input', loadEvents);
categoryFilter.addEventListener('change', loadEvents);
popularityFilter.addEventListener('change', () => renderEvents());

// =========================
// MODAL CLOSE HANDLERS
// =========================
function closeDetailModal() { detailModal.style.display = 'none'; }

closeDetail.addEventListener('click', () => detailModal.style.display = 'none');
closeProfile.addEventListener('click', () => profileModal.style.display = 'none');
closePublicProfile.addEventListener('click', () => publicProfileModal.style.display = 'none');
closeSurvey.addEventListener('click', () => surveyModal.style.display = 'none');

// =========================
// INIT
// =========================
(async function init() {
  document.querySelector(`.lang-cap[data-lang="${currentLang}"]`)?.classList.add('active');
  document.getElementById('langTrigger').title = currentLang.toUpperCase();
  applyTranslation();
  updateAuthUI();
  await loadEvents();
  await loadSocialFeed();
  await loadSocialEvents();
  subscribeToPush();
})();
