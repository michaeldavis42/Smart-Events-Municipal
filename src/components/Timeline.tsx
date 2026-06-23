import { useState } from 'react';
import { Calendar, MapPin, Users, Flame, Star } from 'lucide-react';
import { transKeys, LangType } from '../translations';
import { EventModel } from '../types';

interface TimelineProps {
  currentLang: LangType;
  darkMode: boolean;
  events: EventModel[];
  onEventClick: (id: number) => void;
}

export default function Timeline({ currentLang, darkMode, events, onEventClick }: TimelineProps) {
  const [activeTab, setActiveTab] = useState<'upcoming' | 'ongoing' | 'finished'>('upcoming');

  const t = (key: keyof typeof transKeys['es']) => {
    return transKeys[currentLang]?.[key] || transKeys['es'][key] || key;
  };

  // Classify events based on status
  const upcomingEvents = events.filter(e => e.status === 'Próximo');
  const ongoingEvents = events.filter(e => e.status === 'En curso');
  const finishedEvents = events.filter(e => e.status === 'Completado');

  const getActiveList = () => {
    if (activeTab === 'ongoing') return ongoingEvents;
    if (activeTab === 'finished') return finishedEvents;
    return upcomingEvents;
  };

  const activeList = getActiveList();

  const getStatusLabel = () => {
    if (activeTab === 'ongoing') return t('tl_ongoing');
    if (activeTab === 'finished') return t('tl_finished');
    return t('tl_upcoming');
  };

  const getStatusClass = () => {
    if (activeTab === 'ongoing') return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
    if (activeTab === 'finished') return 'bg-slate-500/10 text-slate-400 border-slate-500/20';
    return 'bg-sky-500/10 text-sky-400 border-sky-400/20';
  };

  return (
    <section id="timeline" className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-b border-dashed dark:border-slate-800 border-slate-200">
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-6">
        <div>
          <h2 className="text-3xl font-display font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-4xl flex items-center gap-2">
            <Flame className="h-6 w-6 text-indigo-400 animate-pulse" />
            <span>{t('timeline_title')}</span>
          </h2>
          <p className="mt-2 text-slate-500 dark:text-slate-400 text-xs sm:text-sm max-w-xl">
            {currentLang === 'pt' ? 'Filtre as atividades por cronograma e saiba o que acontecerá em breve ou o que já se tornou parte do nosso histórico.' : currentLang === 'en' ? 'Track actual events chronological order to inspect historic activities or register for the very next sessions.' : 'Filtra las actividades por cronograma y conoce lo que sucederá pronto, lo que ocurre hoy mismo o lo que ya forma parte del álbum histórico.'}
          </p>
        </div>

        {/* Tab selector */}
        <div className="flex p-1 rounded-xl bg-slate-100 dark:bg-slate-900 border dark:border-slate-800 border-slate-200 self-start md:self-end">
          <button
            onClick={() => setActiveTab('upcoming')}
            className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all duration-250 ${
              activeTab === 'upcoming'
                ? 'bg-sky-500 text-white shadow-md'
                : 'text-slate-600 dark:text-slate-400 hover:text-sky-400'
            }`}
          >
            {t('tl_upcoming')} ({upcomingEvents.length})
          </button>
          <button
            onClick={() => setActiveTab('ongoing')}
            className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all duration-250 ${
              activeTab === 'ongoing'
                ? 'bg-emerald-600 text-white shadow-md'
                : 'text-slate-600 dark:text-slate-400 hover:text-emerald-400'
            }`}
          >
            {t('tl_ongoing')} ({ongoingEvents.length})
          </button>
          <button
            onClick={() => setActiveTab('finished')}
            className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all duration-250 ${
              activeTab === 'finished'
                ? 'bg-slate-600 text-white shadow-md'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-300'
            }`}
          >
            {t('tl_finished')} ({finishedEvents.length})
          </button>
        </div>
      </div>

      <div className="relative">
        {/* Connecting Vertical line */}
        {activeList.length > 0 && (
          <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-[2px] bg-gradient-to-b from-sky-450 via-indigo-500/25 to-pink-500/0 md:transform md:-translate-x-1/2" />
        )}

        <div className="space-y-8">
          {activeList.length === 0 ? (
            <div className={`text-center py-12 rounded-2xl border border-dashed ${
              darkMode ? 'bg-slate-900/40 border-slate-800 text-slate-400' : 'bg-slate-50 border-slate-200 text-slate-500'
            }`}>
              <Calendar className="h-8 w-8 mx-auto opacity-30 mb-2" />
              <p className="text-sm font-medium">{currentLang === 'pt' ? 'Sem eventos registrados nesta categoria' : currentLang === 'en' ? 'No recorded events in this category' : 'No hay eventos en esta etapa actualmente'}</p>
            </div>
          ) : (
            activeList.map((e, index) => {
              const isEven = index % 2 === 0;
              return (
                <div 
                  key={e.id}
                  className={`relative flex flex-col md:flex-row items-start md:items-center ${
                    isEven ? 'md:flex-row-reverse' : ''
                  }`}
                >
                  {/* Dotted indicator */}
                  <div className="absolute left-[9px] md:left-1/2 top-4 md:top-1/2 w-4 h-4 rounded-full border-2 bg-slate-900 dark:bg-slate-950 border-sky-400 md:-translate-x-1/2 md:-translate-y-1/2 z-10 shadow-lg shadow-sky-400/20" />

                  {/* Spacer helper for widescreen layout */}
                  <div className="hidden md:block w-1/2" />

                  {/* Visual Content Box */}
                  <div className="w-full md:w-1/2 pl-10 md:pl-0 md:px-8">
                    <div 
                      onClick={() => onEventClick(e.id)}
                      className={`group cursor-pointer p-5 rounded-2xl border transition-all duration-300 transform hover:-translate-y-1 hover:shadow-lg ${
                        darkMode 
                          ? 'bg-slate-900/80 border-slate-800 hover:border-slate-750 text-slate-100 hover:shadow-sky-500/5' 
                          : 'bg-white border-slate-200 hover:border-sky-300 text-slate-800 hover:shadow-slate-200'
                      }`}
                    >
                      {e.image && (
                        <div className="h-32 w-full rounded-xl overflow-hidden mb-4 relative">
                          <img 
                            src={e.image} 
                            alt={e.name} 
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-slate-950/20 to-transparent flex items-end p-3">
                            <span className="text-white text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-sky-500/85">
                              {e.category}
                            </span>
                          </div>
                        </div>
                      )}

                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-display font-semibold text-base sm:text-lg group-hover:text-sky-400 transition-colors">
                          {e.name}
                        </h4>
                        <span className={`text-[9px] font-bold px-2 py-0.5 rounded border uppercase font-mono ${getStatusClass()}`}>
                          {getStatusLabel()}
                        </span>
                      </div>

                      <div className="space-y-1 text-xs text-slate-500 dark:text-slate-400 mb-3">
                        <p className="flex items-center">
                          <Calendar className="h-3.5 w-3.5 mr-1.5 text-sky-400" />
                          {new Date(e.date + 'T12:00:00').toLocaleDateString(currentLang === 'es' ? 'es-CL' : currentLang === 'pt' ? 'pt-BR' : 'en-US', {
                            weekday: 'long',
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          })}
                        </p>
                        <p className="flex items-center">
                          <MapPin className="h-3.5 w-3.5 mr-1.5 text-sky-400" />
                          {e.location}
                        </p>
                        <p className="flex items-center">
                          <Users className="h-3.5 w-3.5 mr-1.5 text-sky-400" />
                          {e.participants} {currentLang === 'pt' ? 'registrados' : currentLang === 'en' ? 'registrants' : 'inscritos'}
                        </p>
                      </div>

                      {e.description && (
                        <p className="text-xs text-slate-400 dark:text-slate-500 line-clamp-2">
                          {e.description}
                        </p>
                      )}
                    </div>
                  </div>

                </div>
              );
            })
          )}
        </div>
      </div>
    </section>
  );
}
