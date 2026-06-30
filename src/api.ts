const BASE = '/api';

function token(): string | null {
  return localStorage.getItem('token');
}

async function request<T>(method: string, path: string, body?: unknown): Promise<T> {
  const headers: Record<string, string> = { 'Content-Type': 'application/json' };
  const t = token();
  if (t) headers['Authorization'] = `Bearer ${t}`;
  const res = await fetch(`${BASE}${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: res.statusText }));
    throw new Error(err.error || `Error ${res.status}`);
  }
  return res.json();
}

function get<T>(path: string): Promise<T> { return request<T>('GET', path); }
function post<T>(path: string, body?: unknown): Promise<T> { return request<T>('POST', path, body); }
function put<T>(path: string, body?: unknown): Promise<T> { return request<T>('PUT', path, body); }
function del<T>(path: string): Promise<T> { return request<T>('DELETE', path); }

// ─── Auth ───────────────────────────────────────────
export const auth = {
  login: (email: string, password: string) =>
    post<{ token: string; user: { id: number; name: string; email: string; role: string } }>('/auth/login', { email, password }),
  register: (name: string, email: string, password: string, role: string = 'user') =>
    post<{ token: string; user: { id: number; name: string; email: string; role: string } }>('/auth/register', { name, email, password, role }),
  google: (googleId: string, name: string, email: string) =>
    post<{ token: string; user: { id: number; name: string; email: string; role: string } }>('/auth/google', { googleId, name, email }),
  me: () => get<{ id: number; name: string; email: string; role: string; avatar_url: string; bio: string }>('/auth/me'),
  profile: (id: number) => get<{ id: number; name: string; email: string; role: string; avatar_url: string; bio: string; company_name: string; phone: string; website: string }>(`/auth/profile/${id}`),
  search: (q: string) => get<Array<{ id: number; name: string; email: string; role: string }>>(`/auth/search?q=${encodeURIComponent(q)}`),
  updateProfile: (data: Record<string, string>) => put('/auth/profile', data),
  changePassword: (currentPassword: string, newPassword: string) => put('/auth/password', { currentPassword, newPassword }),
  changeEmail: (email: string) => put('/auth/email', { email }),
  deleteAccount: () => del('/auth/account'),
  forgotPassword: (email: string) => post<{ message: string }>('/auth/forgot-password', { email }),
  resetPassword: (token: string, newPassword: string) => post('/auth/reset-password', { token, newPassword }),
  citizens: () => get<Array<{ id: number; name: string; email: string; role: string; created_at: string }>>('/auth/citizens'),
};

// ─── Events ─────────────────────────────────────────
export const events = {
  list: (filters?: { search?: string; category?: string }) => {
    const q = new URLSearchParams();
    if (filters?.search) q.set('search', filters.search);
    if (filters?.category && filters.category !== 'all') q.set('category', filters.category);
    const qs = q.toString();
    return get<Array<Record<string, unknown>>>(`/events${qs ? '?' + qs : ''}`);
  },
  get: (id: number) => get<Record<string, unknown>>(`/events/${id}`),
  create: (data: Record<string, unknown>) => post('/events', data),
  update: (id: number, data: Record<string, unknown>) => put(`/events/${id}`, data),
  delete: (id: number) => del(`/events/${id}`),
};

// ─── Reviews ────────────────────────────────────────
export const reviews = {
  byEvent: (eventId: number) => get<{ reviews: Array<Record<string, unknown>>; average: number; count: number }>(`/reviews/event/${eventId}`),
  create: (event_id: number, rating: number, comment: string) => post('/reviews', { event_id, rating, comment }),
  delete: (id: number) => del(`/reviews/${id}`),
};

// ─── Social ─────────────────────────────────────────
export const social = {
  list: () => get<Array<Record<string, unknown>>>('/social'),
  create: (content: string, image?: string, event_id?: number) => post('/social', { content, image, event_id }),
  delete: (id: number) => del(`/social/${id}`),
  toggleLike: (id: number) => post(`/social/${id}/like`),
  likes: (id: number) => get<Array<{ id: number; name: string }>>(`/social/${id}/likes`),
  comments: (id: number) => get<Array<Record<string, unknown>>>(`/social/${id}/comments`),
  addComment: (id: number, content: string) => post(`/social/${id}/comments`, { content }),
};

// ─── Registrations ──────────────────────────────────
export const registrations = {
  create: (event_id: number, participant_name: string, participant_email: string) => post('/registrations', { event_id, participant_name, participant_email }),
  byEvent: (eventId: number) => get<Array<Record<string, unknown>>>(`/registrations/event/${eventId}`),
  my: () => get<Array<Record<string, unknown>>>('/registrations/my'),
};

// ─── Stats + AI ─────────────────────────────────────
export const stats = {
  dashboard: () => get<{ total_events: number; total_participants: number; popular_event: string; popular_category: string }>('/stats/dashboard'),
  heatmap: () => get<Array<{ lat: number; lng: number; count: number }>>('/stats/heatmap'),
  timeline: () => get<{ upcoming: Array<Record<string, unknown>>; ongoing: Array<Record<string, unknown>>; finished: Array<Record<string, unknown>> }>('/stats/timeline'),
  exportPdf: () => fetch(`${BASE}/stats/export/pdf`, { headers: token() ? { Authorization: `Bearer ${token()}` } : {} }).then(r => r.blob()),
};

export const ai = {
  analyze: () => get<{ analysis: string }>('/ai/analyze'),
};

// ─── Providers ──────────────────────────────────────
export const providers = {
  profile: {
    get: () => get<Record<string, unknown>>('/providers/profile'),
    save: (data: Record<string, string>) => post('/providers/profile', data),
  },
  matches: () => get<Array<Record<string, unknown>>>('/providers/matches'),
  dashboard: () => get<Record<string, unknown>>('/providers/dashboard'),
  contact: (event_id: number, message: string) => post('/providers/contact', { event_id, message }),
  contactRequests: () => get<Array<Record<string, unknown>>>('/providers/contact-requests'),
  organizerInfo: (eventId: number) => get<Record<string, unknown>>(`/providers/organizer-info/${eventId}`),
};

// ─── Sponsors ───────────────────────────────────────
export const sponsors = {
  byEvent: (eventId: number) => get<Array<Record<string, unknown>>>(`/sponsors/event/${eventId}`),
  create: (data: { event_id: number; name: string; logo_url?: string; description?: string; website?: string }) => post('/sponsors', data),
  delete: (id: number) => del(`/sponsors/${id}`),
};

// ─── Surveys ────────────────────────────────────────
export const surveys = {
  submit: (event_id: number, satisfaction: number, opinion?: string, suggestion?: string) => post('/surveys', { event_id, satisfaction, opinion, suggestion }),
  byEvent: (eventId: number) => get<{ average: number; count: number; surveys: Array<Record<string, unknown>> }>(`/surveys/event/${eventId}`),
};

// ─── Calendar ───────────────────────────────────────
export const calendar = {
  sync: (data: { summary: string; description?: string; location?: string; startDate: string; endDate?: string }) => post('/calendar/sync', data),
};

// ─── Notifications ──────────────────────────────────
export const notifications = {
  vapidKey: () => get<{ publicKey: string }>('/notifications/vapid-public-key'),
  subscribe: (subscription: PushSubscription) => post('/notifications/subscribe', subscription),
  send: (title: string, body: string, userId?: number) => post('/notifications/send', { title, body, userId }),
};
