import { useState, useEffect } from 'react';
import { Search, SlidersHorizontal, MapPin, Navigation, Star, Heart, Calendar, Users, Eye } from 'lucide-react';
import { transKeys, LangType } from '../translations';
import { EventModel, ReviewModel } from '../types';

interface EventCatalogProps {
  currentLang: LangType;
  darkMode: boolean;
  events: EventModel[];
  reviews: ReviewModel[];
  onEventClick: (id: number) => void;
  onRegisterClick: (id: number) => void;
  userCoords: { lat: number; lng: number } | null;
  setUserCoords: (coords: { lat: number; lng: number } | null) => void;
}

export default function EventCatalog({
  currentLang,
  darkMode,
  events,
  reviews,
  onEventClick,
  onRegisterClick,
  userCoords,
  setUserCoords
}: EventCatalogProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [sortFilter, setSortFilter] = useState<'all' | 'high' | 'low' | 'nearby'>('all');
  const [isLocLoading, setIsLocLoading] = useState(false);

  const t = (key: keyof typeof transKeys['es']) => {
    return transKeys[currentLang]?.[key] || transKeys['es'][key] || key;
  };

  // Haversine Distance Helper is extremely accurate
  const getDistance = (lat1?: number, lng1?: number, lat2?: number, lng2?: number) => {
    if (!lat1 || !lng1 || !lat2 || !lng2) return null;
    const R = 6371; // Earth radius in km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLng = (lng2 - lng1) * Math.PI / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
      Math.sin(dLng / 2) * Math.sin(dLng / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };

  // Filter and sort events
  const filteredEvents = events.filter((e) => {
    const matchesSearch = e.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          e.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          (e.description && e.description.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCategory = categoryFilter === 'all' || e.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const sortedEvents = [...filteredEvents].sort((a, b) => {
    if (sortFilter === 'high') return b.participants - a.participants;
    if (sortFilter === 'low') return a.participants - b.participants;
    if (sortFilter === 'nearby' && userCoords) {
      const distA = getDistance(userCoords.lat, userCoords.lng, a.lat, a.lng) || Infinity;
      const distB = getDistance(userCoords.lat, userCoords.lng, b.lat, b.lng) || Infinity;
      return distA - distB;
    }
    return 0; // Default ordering
  });

  // Calculate avg rating for an event
  const getEventRating = (eventId: number) => {
    const eventReviews = reviews.filter((r) => r.event_id === eventId);
    if (eventReviews.length === 0) return { avg: 0, count: 0 };
    const avg = eventReviews.reduce((sum, r) => sum + r.rating, 0) / eventReviews.length;
    return { avg, count: eventReviews.length };
  };

  // Hook up native browser geolocation
  const handleRequestLocation = () => {
    if (!navigator.geolocation) {
      alert('Geolocalización no soportada por tu navegador.');
      return;
    }
    setIsLocLoading(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setUserCoords({ lat: pos.coords.latitude, lng: pos.coords.longitude });
        setSortFilter('nearby');
        setIsLocLoading(false);
      },
      () => {
        alert('No pudimos acceder a tu ubicación. Por favor, habilítala en tu navegador.');
        setIsLocLoading(false);
      }
    );
  };

  return (
    <section id="eventos" className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-b border-dashed dark:border-slate-800 border-slate-200">
      
      {/* Title block */}
      <div className="mb-10 text-center md:text-left">
        <h2 className="text-3xl font-display font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-4xl flex items-center justify-center md:justify-start gap-2">
          <Calendar className="h-7 w-7 text-sky-400" />
          <span>{t('events_title')}</span>
        </h2>
        <p className="mt-2 text-slate-500 dark:text-slate-400 text-xs sm:text-sm max-w-xl">
          {currentLang === 'pt' ? 'Selecione e explore nossa agenda. Use filtros inteligentes por categoria ou ordene por proximidade.' : currentLang === 'en' ? 'Refine our physical catalog using simple categorizations and sort near your current place.' : 'Enfoca tus intereses utilizando filtros rápidos de catálogo o reordena los resultados según tu ubicación física actual.'}
        </p>
      </div>

      {/* Filter Bento Box */}
      <div className={`p-5 rounded-2xl border mb-8 flex flex-col md:flex-row flex-wrap items-center gap-4 ${
        darkMode ? 'bg-slate-900/40 border-slate-800' : 'bg-slate-50 border-slate-150'
      }`}>
        {/* Search Field */}
        <div className="relative flex-1 w-full min-w-[200px]">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 h-4.5 w-4.5" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder={currentLang === 'pt' ? 'Pesquisar eventos...' : currentLang === 'en' ? 'Search event...' : 'Buscar eventos por nombre, lugar...'}
            className={`w-full pl-11 pr-4 py-2.5 rounded-xl border text-sm outline-none transition-all ${
              darkMode 
                ? 'bg-slate-950 border-slate-800 focus:border-sky-500 text-slate-100 placeholder-slate-500' 
                : 'bg-white border-slate-250 focus:border-sky-500 text-slate-800 placeholder-slate-450'
            }`}
          />
        </div>

        {/* Category Dropdown */}
        <div className="w-full md:w-auto min-w-[160px]">
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className={`w-full px-3.5 py-2.5 rounded-xl border text-sm outline-none cursor-pointer transition-all ${
              darkMode 
                ? 'bg-slate-950 border-slate-800 focus:border-sky-500 text-slate-100' 
                : 'bg-white border-slate-250 focus:border-sky-500 text-slate-800'
            }`}
          >
            <option value="all">{t('all_categories')}</option>
            <option value="Cultural">Cultural</option>
            <option value="Deportivo">Deportivo / Sports</option>
            <option value="Educativo">Educativo / Education</option>
            <option value="Social">Social</option>
            <option value="Musical">Musical</option>
          </select>
        </div>

        {/* Sort Dropdown */}
        <div className="w-full md:w-auto min-w-[160px]">
          <select
            value={sortFilter}
            onChange={(e) => setSortFilter(e.target.value as any)}
            className={`w-full px-3.5 py-2.5 rounded-xl border text-sm outline-none cursor-pointer transition-all ${
              darkMode 
                ? 'bg-slate-950 border-slate-800 focus:border-sky-500 text-slate-100' 
                : 'bg-white border-slate-250 focus:border-sky-500 text-slate-800'
            }`}
          >
            <option value="all">{currentLang === 'pt' ? 'Ordenar por por padrão' : currentLang === 'en' ? 'Default Sorting' : 'Sin orden específico'}</option>
            <option value="high">{t('most_popular')}</option>
            <option value="low">{t('least_popular')}</option>
            {userCoords && <option value="nearby">{currentLang === 'pt' ? 'Mais próximos' : currentLang === 'en' ? 'Closest Distance' : 'Más cercanos a mí'}</option>}
          </select>
        </div>

        {/* Nearby Locator Button */}
        <button
          onClick={handleRequestLocation}
          disabled={isLocLoading}
          className={`w-full md:w-auto px-4 py-2.5 rounded-xl text-xs font-semibold cursor-pointer border flex items-center justify-center gap-1.5 transition-all ${
            isLocLoading ? 'opacity-50 cursor-not-allowed' : ''
          } ${
            userCoords
              ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400'
              : 'border-slate-350 hover:border-sky-450 dark:border-slate-800 dark:hover:border-sky-500 dark:bg-slate-950 text-slate-600 dark:text-slate-300'
          }`}
        >
          <Navigation className={`h-3.5 w-3.5 ${isLocLoading ? 'animate-spin' : ''}`} />
          {userCoords 
            ? (currentLang === 'pt' ? 'Localizado ✓' : currentLang === 'en' ? 'Located ✓' : 'Ubicado ✓') 
            : t('nearby_me')}
        </button>
      </div>

      {/* Events Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {sortedEvents.length === 0 ? (
          <div className={`col-span-full text-center py-16 rounded-2xl border border-dashed ${
            darkMode ? 'bg-slate-900/20 border-slate-800 text-slate-500' : 'bg-slate-50 border-slate-200 text-slate-400'
          }`}>
            <SlidersHorizontal className="h-10 w-10 mx-auto mb-2 opacity-30" />
            <p className="text-sm font-medium">{currentLang === 'pt' ? 'Nenhum resultado corresponde aos filtros selecionados.' : currentLang === 'en' ? 'No events match your current selection criteria.' : 'No encontramos eventos coincidentes en el catálogo.'}</p>
          </div>
        ) : (
          sortedEvents.map((e) => {
            const { avg, count } = getEventRating(e.id);
            const dist = userCoords && e.lat && e.lng ? getDistance(userCoords.lat, userCoords.lng, e.lat, e.lng) : null;
            const statusStyle = e.status === 'Completado' 
              ? 'bg-amber-500/10 text-amber-500 border-amber-500/20' 
              : e.status === 'En curso' 
                ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20 animate-pulse' 
                : 'bg-sky-500/10 text-sky-400 border-sky-400/20';

            return (
              <div
                key={e.id}
                className={`flex flex-col rounded-2xl border overflow-hidden transition-all duration-300 group ${
                  darkMode 
                    ? 'bg-slate-900/60 border-slate-800 hover:border-indigo-500/40 hover:shadow-lg hover:shadow-indigo-500/5' 
                    : 'bg-white border-slate-200 hover:border-sky-400 hover:shadow-md'
                }`}
              >
                {/* Event Cover Photo */}
                <div className="h-48 w-full overflow-hidden relative bg-slate-850">
                  <img
                    src={e.image || 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?q=80&w=600'}
                    alt={e.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                  />
                  {/* Floating tags */}
                  <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
                    <span className="text-[9px] font-bold px-2 py-0.5 rounded bg-slate-950/80 text-white backdrop-blur-md border border-white/10 uppercase tracking-wide">
                      {e.category}
                    </span>
                    {dist !== null && (
                      <span className="text-[9px] font-bold px-2 py-0.5 rounded bg-sky-500 text-white backdrop-blur-md shadow-sm border border-sky-400/20 flex items-center">
                        <MapPin className="h-2.5 w-2.5 mr-0.5" />
                        {dist.toFixed(1)} km
                      </span>
                    )}
                  </div>

                  <span className={`absolute top-3 right-3 text-[9px] font-bold px-2 py-0.5 rounded border ${statusStyle}`}>
                    {e.status === 'En curso' ? t('tl_ongoing') : e.status === 'Completado' ? t('tl_finished') : t('tl_upcoming')}
                  </span>
                </div>

                {/* Event Text Body */}
                <div className="p-5 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="font-display font-bold text-lg text-slate-900 dark:text-slate-100 group-hover:text-sky-450 transition-colors line-clamp-1">
                      {e.name}
                    </h3>

                    {/* Star feedback summary if has counts */}
                    {count > 0 ? (
                      <div className="flex items-center space-x-1.5 mt-1">
                        <div className="flex text-yellow-405 text-sm">
                          {'★'.repeat(Math.round(avg)) + '☆'.repeat(5 - Math.round(avg))}
                        </div>
                        <span className="text-[10px] text-slate-400 font-medium">({count} reseña{count > 1 ? 's' : ''})</span>
                      </div>
                    ) : (
                      <div className="text-[10px] text-slate-500 font-medium mt-1">
                        {currentLang === 'pt' ? 'Sem avaliações ainda' : currentLang === 'en' ? 'Be the first to review' : 'Sin calificaciones aún'}
                      </div>
                    )}

                    <p className="mt-3 text-xs text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed">
                      {e.description || 'No hay descripción detallada provista para este evento.'}
                    </p>

                    <div className="mt-4 space-y-1.5 text-xs text-slate-500 dark:text-slate-400 font-medium">
                      <p className="flex items-center">
                        <Calendar className="h-3.5 w-3.5 mr-2 text-sky-400" />
                        {new Date(e.date + 'T12:00:00').toLocaleDateString(currentLang === 'es' ? 'es-CL' : currentLang === 'pt' ? 'pt-BR' : 'en-US', {
                          day: 'numeric', month: 'short', year: 'numeric'
                        })}
                      </p>
                      <p className="flex items-center">
                        <MapPin className="h-3.5 w-3.5 mr-2 text-sky-400" />
                        <span className="truncate">{e.location}</span>
                      </p>
                      <p className="flex items-center">
                        <Users className="h-3.5 w-3.5 mr-2 text-sky-400" />
                        <span>Cupos ocupados: {e.participants} / {e.slots}</span>
                      </p>
                    </div>
                  </div>

                  {/* Operational Action Buttons */}
                  <div className="mt-6 pt-4 border-t dark:border-slate-800 border-slate-100 flex items-center gap-2">
                    <button
                      onClick={() => onRegisterClick(e.id)}
                      disabled={e.participants >= e.slots || e.status === 'Completado'}
                      className={`flex-1 flex justify-center items-center py-2 rounded-xl text-xs font-semibold cursor-pointer text-white bg-gradient-to-r from-sky-500 to-indigo-600 hover:opacity-95 transition-all shadow-sm ${
                        (e.participants >= e.slots || e.status === 'Completado') ? 'opacity-40 cursor-not-allowed filter grayscale' : ''
                      }`}
                    >
                      {e.status === 'Completado' 
                        ? (currentLang === 'pt' ? 'Finalizado' : currentLang === 'en' ? 'Ended' : 'Finalizado')
                        : e.participants >= e.slots 
                          ? (currentLang === 'pt' ? 'Esgotado' : currentLang === 'en' ? 'Sold Out' : 'Sin Cupos')
                          : (currentLang === 'pt' ? 'Inscrever' : currentLang === 'en' ? 'Register' : 'Inscribirse')}
                    </button>
                    
                    <button
                      onClick={() => onEventClick(e.id)}
                      title={currentLang === 'pt' ? 'Ver detalhes' : currentLang === 'en' ? 'View details' : 'Ver detalles'}
                      className={`px-3 py-2 rounded-xl border flex items-center justify-center transition-all cursor-pointer ${
                        darkMode 
                          ? 'border-slate-800 hover:border-sky-500/50 hover:bg-slate-900 text-slate-300' 
                          : 'border-slate-200 hover:border-sky-400 hover:bg-slate-50 text-slate-700'
                      }`}
                    >
                      <Eye className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

    </section>
  );
}
