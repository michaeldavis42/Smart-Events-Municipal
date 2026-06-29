# SmartEvents Municipal

Plataforma inteligente de gestión de eventos municipales con emparejamiento de proveedores, feed social, encuestas, análisis con IA y soporte PWA.

## Stack

- **Frontend:** React 19 + TypeScript + Vite + Tailwind CSS 4
- **Backend:** Node.js + Express + MySQL
- **Auth:** JWT + bcrypt (con soporte Google OAuth)
- **Notificaciones:** Web Push API + Service Worker
- **Documentación API:** Swagger UI (`/api-docs`)
- **PWA:** Manifest + Service Worker para instalación

## Requisitos

- Node.js 18+
- MySQL 8+
- Navegador moderno (Chrome, Firefox, Edge)

## Setup rápido

```bash
# 1. Clonar e instalar dependencias del backend
cd backend
npm install

# 2. Configurar variables de entorno
# Editar backend/.env con tus credenciales MySQL
cp .env.example .env

# 3. Iniciar backend (crea BD y tablas automáticamente)
npm run dev

# 4. En otra terminal, instalar e iniciar frontend
cd ..
npm install
npm run dev

# 5. Abrir http://localhost:3000
```

## Variables de entorno (`.env`)

| Variable | Descripción |
|---|---|
| `DB_HOST` | Host MySQL (default: localhost) |
| `DB_USER` | Usuario MySQL (default: root) |
| `DB_PASSWORD` | Contraseña MySQL |
| `DB_NAME` | Nombre BD (default: smartevents) |
| `JWT_SECRET` | Secreto para firmar tokens JWT (obligatorio) |
| `OPENAI_API_KEY` | API key de OpenAI (opcional, fallback local) |
| `GOOGLE_CLIENT_ID` | Client ID de Google OAuth (opcional) |
| `VAPID_PUBLIC_KEY` | Clave pública para Web Push |
| `VAPID_PRIVATE_KEY` | Clave privada para Web Push |

## Estructura del proyecto

```
/
├── index.html              # Entry point Vite
├── package.json            # Frontend dependencies
├── vite.config.ts          # Vite config (proxy /api → backend:3001)
├── tsconfig.json           # TypeScript config
├── src/                    # Frontend React
│   ├── main.tsx            # Punto de entrada React
│   ├── App.tsx             # Componente principal
│   ├── types.ts            # Interfaces TypeScript
│   ├── data.ts             # Datos semilla
│   ├── translations.ts     # Traducciones (ES/EN/PT/FR/DE)
│   ├── index.css           # Estilos Tailwind
│   └── components/         # 10 componentes
│       ├── Navbar.tsx
│       ├── Hero.tsx
│       ├── Features.tsx
│       ├── EventCatalog.tsx
│       ├── SocialFeed.tsx
│       ├── ProviderHub.tsx
│       ├── Timeline.tsx
│       ├── AnalyticsDashboard.tsx
│       ├── AdminPanel.tsx
│       └── Modals.tsx
├── backend/
│   ├── server.js           # Entry point Express (puerto 3001)
│   ├── .env                # Variables de entorno
│   ├── config/
│   │   ├── db.js           # Pool MySQL + auto-init DB
│   │   └── swagger.js      # Configuración Swagger/OpenAPI
│   ├── middleware/
│   │   ├── auth.js         # JWT middleware
│   │   └── errorHandler.js # Manejador global de errores
│   ├── utils/
│   │   └── response.js     # Helper de respuestas estandarizadas
│   └── routes/             # 12 archivos de rutas
│       ├── auth.js         # Auth, perfil, Google OAuth
│       ├── events.js       # CRUD eventos, filtros, búsqueda
│       ├── registrations.js
│       ├── reviews.js
│       ├── social.js
│       ├── sponsors.js
│       ├── surveys.js
│       ├── providers.js
│       ├── stats.js
│       ├── ai.js
│       ├── calendar.js
│       └── notifications.js
├── assets/                 # (Versión vanilla anterior, ya no usada)
├── database/schema.sql
└── setup.ps1
```

## Endpoints principales

| Método | Ruta | Descripción |
|---|---|---|
| POST | `/api/auth/login` | Iniciar sesión |
| POST | `/api/auth/register` | Registrar usuario (no admin) |
| POST | `/api/auth/google` | Login con Google |
| GET | `/api/auth/citizens` | Listar ciudadanos (público) |
| GET | `/api/events` | Listar eventos (filtros) |
| GET | `/api/events/nearby` | Eventos cercanos (Haversine) |
| GET | `/api/stats` | Estadísticas del dashboard |
| GET | `/api/ai/analysis` | Análisis con IA |
| GET | `/api-docs` | Documentación Swagger UI |

## Funcionalidades

- **Eventos:** CRUD completo, filtros por categoría y popularidad, búsqueda, geolocalización cercana
- **Reseñas:** Sistema tipo Letterboxd (1-5 estrellas), promedio por evento
- **Feed Social:** Publicaciones con imágenes, likes toggle, comentarios
- **Dashboard:** Stats cards, gráficos, análisis IA, exportación
- **Proveedores:** Perfil, scoring, solicitud de contacto
- **Encuestas:** Post-evento con satisfacción y sugerencias
- **Notificaciones Push:** Web Push API con Service Worker
- **Calendario:** Sincronización a Google Calendar
- **Admin:** Crear eventos, sponsors, gestión de usuarios
- **Multi-idioma:** Español, English, Français, Deutsch, Português
- **Dark Mode:** Toggle persistente
- **PWA:** Instalable
