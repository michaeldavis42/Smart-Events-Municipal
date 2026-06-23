import { EventModel, SocialPostModel, ReviewModel, SponsorModel } from './types';

export const INITIAL_EVENTS: EventModel[] = [
  {
    id: 1,
    name: "Festival Lumínico Santiago",
    location: "Parque Forestal, Santiago",
    date: "2026-06-25",
    slots: 500,
    participants: 412,
    category: "Cultural",
    status: "Próximo",
    description: "Una experiencia inmersiva de luces, arte digital y proyecciones 3D sobre monumentos históricos. Incluye intervenciones sonoras y food trucks locales.",
    image: "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?q=80&w=1200",
    lat: -33.4369,
    lng: -70.6411,
    organizer_name: "Corporación Cultural de Santiago",
    organizer_email: "cultura@municipalidad.cl",
    organizer_phone: "+56 2 2456 7890"
  },
  {
    id: 2,
    name: "Media Maratón San Cristóbal",
    location: "Acceso Pedro de Valdivia, Parque Metropolitano",
    date: "2026-06-15",
    slots: 1000,
    participants: 980,
    category: "Deportivo",
    status: "Completado",
    description: "La maratón de altura más tradicional de la ciudad. Desafía tus límites subiendo hasta la imponente virgen del cerro San Cristóbal.",
    image: "https://images.unsplash.com/photo-1476480862126-209bfaa8edc8?q=80&w=1200",
    lat: -33.4184,
    lng: -70.6139,
    organizer_name: "Departamento de Deportes Providencia",
    organizer_email: "deportes@providencia.cl",
    organizer_phone: "+56 2 2890 1234"
  },
  {
    id: 3,
    name: "Feria de Innovación y Libros",
    location: "Plaza Ñuñoa, Ñuñoa",
    date: "2026-06-20", // Matches today as "En curso" / "Hoy" in our context
    slots: 300,
    participants: 285,
    category: "Educativo",
    status: "En curso",
    description: "Charlas tecnológicas, presentaciones literarias emergentes, talleres de robótica para niños y stands interactivos en el corazón de la plaza.",
    image: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?q=80&w=1200",
    lat: -33.4532,
    lng: -70.5975,
    organizer_name: "Ñuñoa Innova",
    organizer_email: "contacto@nunoainnova.cl",
    organizer_phone: "+56 2 2999 8888"
  },
  {
    id: 4,
    name: "Sinfonía bajo las Estrellas",
    location: "Anfiteatro Parque de las Esculturas",
    date: "2026-07-05",
    slots: 250,
    participants: 120,
    category: "Musical",
    status: "Próximo",
    description: "La orquesta filarmónica interpreta piezas clásicas bajo la luz de la luna, a orillas del río Mapocho. Cupos limitados para una noche mágica.",
    image: "https://images.unsplash.com/photo-1465847899084-d164df4dedc6?q=80&w=1200",
    lat: -33.4191,
    lng: -70.6121,
    organizer_name: "Fundación Arte Providencial",
    organizer_email: "arte@providencia.cl",
    organizer_phone: "+56 2 2777 6666"
  },
  {
    id: 5,
    name: "Encuentro de Emprendedores Verdes",
    location: "Parque Bicentenario, Vitacura",
    date: "2026-07-12",
    slots: 400,
    participants: 215,
    category: "Social",
    status: "Próximo",
    description: "Feria de sustentabilidad, reciclaje creativo y negocios de impacto ambiental. Conecta con las mejores ideas sustentables de la región.",
    image: "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?q=80&w=1200",
    lat: -33.3986,
    lng: -70.5989,
    organizer_name: "Vitacura Sustentable",
    organizer_email: "sustentable@vitacura.cl",
    organizer_phone: "+56 2 2111 2222"
  }
];

export const INITIAL_SPONSORS: SponsorModel[] = [
  {
    id: 1,
    event_id: 1,
    name: "Enel Distribución",
    logo_url: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/6f/Enel_Group_logo.svg/320px-Enel_Group_logo.svg.png",
    description: "Patrocinador de energía renovable oficial para la iluminación eficiente del festival.",
    website: "https://www.enel.cl"
  },
  {
    id: 2,
    event_id: 1,
    name: "Banco de Chile",
    logo_url: "https://upload.wikimedia.org/wikipedia/commons/thumb/7/77/Logo_Banco_de_Chile.svg/320px-Logo_Banco_de_Chile.svg.png",
    description: "Apoyando al desarrollo de cultura abierta para toda la ciudadanía.",
    website: "https://ww3.bancochile.cl"
  },
  {
    id: 3,
    event_id: 2,
    name: "Adidas Running",
    logo_url: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/20/Adidas_Logo.svg/240px-Adidas_Logo.svg.png",
    description: "Premios e indumentaria técnica deportiva para todos los atletas de la cima.",
    website: "https://www.adidas.cl"
  },
  {
    id: 4,
    event_id: 3,
    name: "Sernatur",
    logo_url: "https://upload.wikimedia.org/wikipedia/commons/d/da/Logo_Sernatur.png",
    description: "Fomentando el turismo local e identidad bibliográfica comunal.",
    website: "https://www.sernatur.cl"
  }
];

export const INITIAL_REVIEWS: ReviewModel[] = [
  {
    id: 1,
    event_id: 2,
    user_id: 101,
    user_name: "Camila Jara",
    rating: 5,
    comment: "Una experiencia maravillosa. El ascenso estuvo rudo, pero la hidratación en ruta y la hermosa vista del amanecer en la virgen valieron cada segundo. ¡La organización de primera!",
    created_at: "2026-06-16T10:30:00Z"
  },
  {
    id: 2,
    event_id: 2,
    user_id: 102,
    user_name: "Sebastián Reyes",
    rating: 4,
    comment: "Excelente cronometraje de chip y mucha energía de los voluntarios. Solo sugeriría más contenedores de reciclaje para los vasos desechables de agua en la mitad del camino.",
    created_at: "2026-06-16T11:45:00Z"
  },
  {
    id: 3,
    event_id: 3,
    user_id: 103,
    user_name: "María José Allende",
    rating: 5,
    comment: "¡Me encantó la feria! El stand de robótica interactiva mantuvo a mis hijos entusiasmados toda la tarde. Compré tres novelas locales hermosas. Ñuñoa siempre entregando cultura premium.",
    created_at: "2026-06-20T18:15:00Z"
  }
];

export const INITIAL_POSTS: SocialPostModel[] = [
  {
    id: 1,
    user_id: 101,
    user_name: "Camila Jara",
    content: "¡Listo para el gran Festival Lumínico de esta semana! Si alguien anda cerca del Parque Forestal, pasen a sacarse fotos con las proyecciones 3D. ¡Va a ser épico! ✨🌌",
    image: "https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?q=80&w=800",
    event_id: 1,
    event_name: "Festival Lumínico Santiago",
    like_count: 24,
    comment_count: 2,
    liked_by: [102, 103],
    created_at: "2026-06-19T14:30:00Z"
  },
  {
    id: 2,
    user_id: 154,
    user_name: "Carlos Mendoza",
    content: "Comparto una postal del cierre de la maratón en el cerro San Cristóbal. El esfuerzo valió totalmente la pena por esta medalla y el orgullo de haber conquistado la cumbre con mi hija. 🙌🏽🏃🏽‍♂️",
    image: "https://images.unsplash.com/photo-1502680390469-be75c86b636f?q=80&w=800",
    event_id: 2,
    event_name: "Media Maratón San Cristóbal",
    like_count: 57,
    comment_count: 1,
    liked_by: [101],
    created_at: "2026-06-16T13:00:00Z"
  }
];
