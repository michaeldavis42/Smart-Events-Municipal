# SmartEvents Municipal

Plataforma inteligente de gestión de eventos municipales con emparejamiento de proveedores, feed social, encuestas, análisis con IA y soporte PWA.

## Stack

- **Frontend:** HTML + CSS + JS vanilla (5 CSS modulares, 9 JS modulares)
- **Backend:** Node.js + Express + MySQL
- **Auth:** JWT + bcrypt (con soporte Google OAuth)
- **Notificaciones:** Web Push API + Service Worker
- **PWA:** Manifest + Service Worker para instalación

## Requisitos

- Node.js 18+
- MySQL 8+
- Navegador moderno (Chrome, Firefox, Edge)

## Setup rápido

```bash
# 1. Clonar e instalar dependencias
cd backend
npm install

# 2. Configurar variables de entorno
# Editar backend/.env con tus credenciales MySQL
cp .env.example .env

# 3. Iniciar backend (crea BD y tablas automáticamente)
npm run dev

# 4. En otra terminal, abrir frontend
# Opcion A: Abrir index.html directo
start index.html

# Opcion B: Con Live Server (VS Code)
# Click derecho en index.html > "Open with Live Server"
```

## Variables de entorno (`.env`)

| Variable | Descripción |
|---|---|
| `DB_HOST` | Host MySQL (default: localhost) |
| `DB_USER` | Usuario MySQL (default: root) |
| `DB_PASSWORD` | Contraseña MySQL |
| `DB_NAME` | Nombre BD (default: smartevents) |
| `JWT_SECRET` | Secreto para firmar tokens JWT |
| `OPENAI_API_KEY` | API key de OpenAI (opcional, fallback local) |
| `GOOGLE_CLIENT_ID` | Client ID de Google OAuth (opcional) |
| `VAPID_PUBLIC_KEY` | Clave pública para Web Push |
| `VAPID_PRIVATE_KEY` | Clave privada para Web Push |

## Estructura del proyecto

```
/
├── index.html              # Frontend SPA
├── manifest.json            # PWA manifest
├── sw.js                    # Service Worker
├── assets/
│   ├── css/                 # 5 archivos CSS modulares
│   │   ├── base.css         # Reset, variables, tipografía
│   │   ├── layout.css       # Nav, hero, secciones, footer
│   │   ├── components.css   # Botones, modales, tarjetas, formularios
│   │   ├── modules.css      # Dashboard, timeline, social, providers, admin
│   │   └── dark-mode.css    # Tema oscuro
│   ├── js/                  # 9 archivos JS modulares
│   │   ├── lang.js          # Traducciones (ES/EN/FR/DE/PT)
│   │   ├── app.js           # Globals, API, i18n, notificaciones, dark mode
│   │   ├── auth.js          # Login, registro, perfil, buscar personas
│   │   ├── eventos.js       # CRUD eventos, reseñas, encuestas, Nearby
│   │   ├── comunidad.js     # Feed social, likes, comentarios
│   │   ├── dashboard.js     # Estadísticas, chart, heatmap, IA, PDF, calendario
│   │   ├── providers.js     # Dashboard proveedor, perfil, matches
│   │   ├── admin.js         # Panel admin: eventos, sponsors, usuarios
│   │   └── init.js          # Listeners, inicialización
│   └── images/
├── backend/
│   ├── server.js            # Entry point Express
│   ├── config/db.js         # Pool MySQL + auto-init DB
│   ├── middleware/auth.js   # JWT middleware
│   └── routes/              # 16 archivos de rutas
│       ├── auth.js          # Auth, perfil, Google OAuth
│       ├── events.js        # CRUD eventos, filtros, búsqueda
│       ├── registrations.js # Inscripciones
│       ├── reviews.js       # Reseñas tipo Letterboxd
│       ├── social.js        # Posts, likes, comentarios
│       ├── sponsors.js      # Patrocinadores
│       ├── surveys.js       # Encuestas post-evento
│       ├── providers.js     # Proveedores, matches, contacto
│       ├── stats.js         # Estadísticas del dashboard
│       ├── ai.js            # Análisis con IA (OpenAI + fallback)
│       ├── calendar.js      # Sincronización Google Calendar
│       └── notifications.js # Web Push notifications
├── database/schema.sql      # Schema de referencia
├── setup.ps1                # Script de setup para Windows
├── styles.css               # Backup del CSS monolítico anterior
└── script.js                # Backup del JS monolítico anterior
```

## Endpoints principales

| Método | Ruta | Descripción |
|---|---|---|
| POST | `/api/auth/login` | Iniciar sesión |
| POST | `/api/auth/register` | Registrar usuario |
| POST | `/api/auth/google` | Login con Google |
| GET | `/api/events` | Listar eventos (filtros) |
| GET | `/api/events/nearby` | Eventos cercanos (Haversine) |
| GET | `/api/stats` | Estadísticas del dashboard |
| GET | `/api/ai/analysis` | Análisis con IA |
| POST | `/api/providers/profile` | Guardar perfil proveedor |
| GET | `/api/providers/matches` | Emparejamiento inteligente |

## Funcionalidades

- **Eventos:** CRUD completo, filtros por categoría y popularidad, búsqueda, geolocalización cercana (10 km)
- **Reseñas:** Sistema tipo Letterboxd (1-5 estrellas), promedio por evento, modal de reseñas propias
- **Feed Social:** Publicaciones con imágenes, likes toggle, comentarios en modal, asociación a eventos
- **Dashboard:** Stats cards, Chart.js, heatmap por comuna, análisis IA, exportación PDF
- **Timeline:** Pestañas Próximos/Hoy/Finalizados con tarjetas cronológicas
- **Proveedores:** Perfil con 12 campos, barra de completitud, scoring por categoría, solicitud de contacto
- **Encuestas:** Post-evento con satisfacción (1-5), opinión y sugerencias
- **Notificaciones Push:** Web Push API con Service Worker
- **Calendario:** Sincronización a Google Calendar con fallback direct link
- **Admin:** Crear eventos, agregar sponsors, gestión de usuarios
- **Perfil:** Editar info empresa, cambiar password/email, solicitar rol organizer, eliminar cuenta
- **Multi-idioma:** Español, English, Français, Deutsch, Português
- **Dark Mode:** Toggle persistente en localStorage
- **PWA:** Instalable via manifest.json + sw.js
