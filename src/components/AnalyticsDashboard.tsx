import { useState } from 'react';
import { BarChart3, TrendingUp, Users, Award, Landmark, Sparkles, FileSpreadsheet, BellRing, BrainCircuit } from 'lucide-react';
import { transKeys, LangType } from '../translations';
import { EventModel } from '../types';

interface AnalyticsDashboardProps {
  currentLang: LangType;
  darkMode: boolean;
  events: EventModel[];
  onTriggerPush: () => void;
}

export default function AnalyticsDashboard({
  currentLang,
  darkMode,
  events,
  onTriggerPush
}: AnalyticsDashboardProps) {
  const [aiLoading, setAiLoading] = useState(false);
  const [aiSuggestions, setAiSuggestions] = useState<string[]>([
    "Alta tasa de ocupación (82.4%) en la categoría 'Deportivo'. Se sugiere programar un circuito de ciclovía nocturna para Julio.",
    "El sector 'Parque Forestal' registra la mayor densidad de asistentes. Coordinar apoyo de luminarias con el departamento de obras públicas.",
    "Bajo interés relativo en talleres educativos matutinos. Se recomienda incentivar con cupones de descuento para patrocinadores locales."
  ]);

  const t = (key: keyof typeof transKeys['es']) => {
    return transKeys[currentLang]?.[key] || transKeys['es'][key] || key;
  };

  const totalEvents = events.length;
  const totalInscribed = events.reduce((sum, e) => sum + e.participants, 0);
  
  // Find top popular event
  const topPopular = [...events].sort((a,b) => b.participants - a.participants)[0] || null;

  // Find most frequent category
  const categoryCounts: Record<string, number> = {};
  events.forEach(e => {
    categoryCounts[e.category] = (categoryCounts[e.category] || 0) + 1;
  });
  const featuredCategory = Object.entries(categoryCounts).sort((a,b) => b[1] - a[1])[0]?.[0] || 'Cultural';

  // Heatmap sector stats based on actual locations
  const sectorData = [
    { location: "Parque Forestal", total: 412, capacity: 500, percent: 82.4, color: 'bg-indigo-500' },
    { location: "San Cristóbal", total: 980, capacity: 1000, percent: 98.0, color: 'bg-emerald-500' },
    { location: "Plaza Ñuñoa", total: 285, capacity: 300, percent: 95.0, color: 'bg-yellow-500' },
    { location: "Parque de las Esculturas", total: 120, capacity: 250, percent: 48.0, color: 'bg-sky-500' },
    { location: "Parque Bicentenario", total: 215, capacity: 400, percent: 53.7, color: 'bg-pink-500' }
  ];

  // Dynamic generate AI insight simulator
  const handleRegenerateAI = () => {
    setAiLoading(true);
    setTimeout(() => {
      const pool = [
        "Sugerencia de Inteligencia: La maratón Cerro San Cristóbal alcanzó su capacidad límite. Abrir segunda convocatoria para Noviembre.",
        "Análisis IA: Sinergia de Patrocinios. El 74% de ciudadanos valora positivamente la presencia de Adidas Running; se sugiere firma de convenio anual.",
        "Auditoría Espacial: Concentración de eventos musicales en Parque Esculturas. Dispersar actividades hacia parques periféricos para descongestionamiento urbano.",
        "Análisis de Tránsito: Se proyecta alta densidad vehicular para el evento 'Sinfonía bajo las Estrellas'. Habilitar estacionamientos de bicicletas.",
        "Recomendación Comercial: El emparejamiento gastronómico tiene un rendimiento extraordinario. Habilitar más cupos de catering sostenible."
      ];
      // Pick 3 random
      const shuffled = [...pool].sort(() => 0.5 - Math.random());
      setAiSuggestions(shuffled.slice(0, 3));
      setAiLoading(false);
    }, 1200);
  };

  const handleExportSpreadsheet = () => {
    alert('Generando planilla de balance consolidado...\nSe ha descargado el informe "registro_smartevents_2026.csv" de forma local con éxito.');
  };

  return (
    <section id="dashboard" className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-b border-dashed dark:border-slate-800 border-slate-200">
      
      {/* Title block */}
      <div className="mb-10 text-center md:text-left">
        <h2 className="text-3xl font-display font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-4xl flex items-center justify-center md:justify-start gap-2">
          <BarChart3 className="h-7 w-7 text-sky-400" />
          <span>{t('dashboard_title')}</span>
        </h2>
        <p className="mt-2 text-slate-500 dark:text-slate-400 text-xs sm:text-sm max-w-xl">
          {currentLang === 'pt' ? 'Indicadores municipais precisos. Monitore a participação de moradores e os índices de interesse.' : currentLang === 'en' ? 'Consolidated neighborhood attendance rates. Audit total slots occupied at open locations.' : 'Indicadores de afluencia comunal consolidados en tiempo real. Auditoría del comportamiento, inscritos totales y auditorías automáticas con IA.'}
        </p>
      </div>

      {/* Stats Cards Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        
        {/* Stat 1 */}
        <div className={`p-6 rounded-2xl border flex items-center justify-between transition-all ${
          darkMode ? 'bg-slate-900/60 border-slate-800' : 'bg-white border-slate-200 shadow-sm'
        }`}>
          <div>
            <span className="text-xs text-slate-400 font-medium tracking-wide uppercase">{t('total_events')}</span>
            <p className="text-3xl font-extrabold text-slate-900 dark:text-white mt-1">{totalEvents}</p>
          </div>
          <div className="p-3 bg-sky-500/10 rounded-xl border border-sky-500/20">
            <Landmark className="h-6 w-6 text-sky-400" />
          </div>
        </div>

        {/* Stat 2 */}
        <div className={`p-6 rounded-2xl border flex items-center justify-between transition-all ${
          darkMode ? 'bg-slate-900/60 border-slate-800' : 'bg-white border-slate-205 shadow-sm'
        }`}>
          <div>
            <span className="text-xs text-slate-400 font-medium tracking-wide uppercase">{t('total_participants')}</span>
            <p className="text-3xl font-extrabold text-slate-900 dark:text-white mt-1">{totalInscribed}</p>
          </div>
          <div className="p-3 bg-emerald-500/10 rounded-xl border border-emerald-500/20">
            <Users className="h-6 w-6 text-emerald-400" />
          </div>
        </div>

        {/* Stat 3 */}
        <div className={`p-6 rounded-2xl border flex items-center justify-between transition-all ${
          darkMode ? 'bg-slate-900/60 border-slate-800' : 'bg-white border-slate-205 shadow-sm'
        }`}>
          <div>
            <span className="text-xs text-slate-400 font-medium tracking-wide uppercase">{t('popular_event')}</span>
            <p className="text-sm font-bold text-slate-900 dark:text-white mt-2 truncate max-w-[150px]">
              {topPopular ? topPopular.name : 'Cargando...'}
            </p>
          </div>
          <div className="p-3 bg-yellow-500/10 rounded-xl border border-yellow-500/20">
            <Award className="h-6 w-6 text-yellow-400" />
          </div>
        </div>

        {/* Stat 4 */}
        <div className={`p-6 rounded-2xl border flex items-center justify-between transition-all ${
          darkMode ? 'bg-slate-900/60 border-slate-800' : 'bg-white border-slate-205 shadow-sm'
        }`}>
          <div>
            <span className="text-xs text-slate-400 font-medium tracking-wide uppercase">{t('popular_category')}</span>
            <p className="text-3xl font-extrabold text-slate-900 dark:text-white mt-1">{featuredCategory}</p>
          </div>
          <div className="p-3 bg-pink-500/10 rounded-xl border border-pink-500/20">
            <TrendingUp className="h-6 w-6 text-pink-400" />
          </div>
        </div>

      </div>

      {/* Sector Spatial Concentration Heatmap & Chart section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-8">
        
        {/* Heatmap List */}
        <div className={`lg:col-span-5 p-6 rounded-2xl border flex flex-col justify-between ${
          darkMode ? 'bg-slate-900/40 border-slate-800' : 'bg-white border-slate-200 shadow-sm'
        }`}>
          <div>
            <h3 className="font-display font-bold text-base text-slate-900 dark:text-slate-100 flex items-center mb-4">
              <Landmark className="h-5 w-5 text-sky-400 mr-2" />
              <span>{t('heatmap_title')}</span>
            </h3>
            <p className="text-xs text-slate-450 dark:text-slate-500 mb-6">
              Concentración volumétrica según georreferenciación de espacios asignados por el equipo logístico.
            </p>

            <div className="space-y-4">
              {sectorData.map((sec, i) => (
                <div key={i} className="space-y-1">
                  <div className="flex justify-between text-xs font-semibold text-slate-700 dark:text-slate-300">
                    <span>{sec.location}</span>
                    <span className="text-[10px] text-slate-450">{sec.total} / {sec.capacity} cupos ({sec.percent}%)</span>
                  </div>
                  <div className="h-3 w-full bg-slate-205 dark:bg-slate-950 rounded-full overflow-hidden border dark:border-slate-850">
                    <div 
                      className={`h-full rounded-full transition-all duration-1000 ${sec.color}`} 
                      style={{ width: `${sec.percent}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-8 pt-4 border-t border-dashed dark:border-slate-800 border-slate-100 flex flex-wrap gap-3">
            <button
              onClick={handleExportSpreadsheet}
              className={`px-3 py-1.5 rounded-xl border text-[11px] font-bold flex items-center cursor-pointer transition-all ${
                darkMode 
                  ? 'border-slate-850 bg-slate-955 hover:bg-slate-900 hover:border-slate-700 text-slate-300' 
                  : 'border-slate-205 bg-slate-50 hover:bg-slate-100 text-slate-700'
              }`}
            >
              <FileSpreadsheet className="h-3.5 w-3.5 text-emerald-500 mr-1.5" />
              {t('export_pdf')}
            </button>
            <button
              onClick={onTriggerPush}
              className={`px-3 py-1.5 rounded-xl border text-[11px] font-bold flex items-center cursor-pointer transition-all ${
                darkMode 
                  ? 'border-slate-850 bg-slate-955 hover:bg-slate-900 hover:border-slate-700 text-slate-300' 
                  : 'border-slate-205 bg-slate-50 hover:bg-slate-100 text-slate-700'
              }`}
            >
              <BellRing className="h-3.5 w-3.5 text-indigo-400 mr-1.5 animate-bounce" />
              {t('test_notification')}
            </button>
          </div>
        </div>

        {/* AI Insight Auditor */}
        <div className={`lg:col-span-7 p-6 rounded-2xl border flex flex-col justify-between ${
          darkMode ? 'bg-slate-900/40 border-slate-800' : 'bg-white border-slate-200 shadow-sm'
        }`}>
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-display font-bold text-base text-slate-900 dark:text-slate-100 flex items-center">
                <BrainCircuit className="h-5 w-5 text-indigo-400 mr-2 animate-spin-slow" />
                <span>{t('ai_title')}</span>
              </h3>
              <span className="text-[9px] font-mono px-2 py-0.5 rounded bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 tracking-wider">
                COGNITIVE ENGINE v1.2
              </span>
            </div>
            
            <p className="text-xs text-slate-450 dark:text-slate-500 mb-6 font-sans">
              Auditoría y análisis inteligente de la cartelera comunal. El motor interpreta las tendencias de asistencia y provee líneas lógicas de planificación urbana recomendables.
            </p>

            <div className="space-y-4">
              {aiSuggestions.map((sug, idx) => (
                <div 
                  key={idx}
                  className={`p-3.5 rounded-xl border transition-all ${
                    darkMode 
                      ? 'bg-slate-950/80 border-slate-805 hover:bg-slate-900 text-slate-300' 
                      : 'bg-indigo-50/20 border-indigo-50/50 hover:bg-indigo-50/40 text-slate-700'
                  }`}
                >
                  <p className="text-xs font-medium leading-relaxed flex items-start">
                    <span className="inline-flex mr-2 mt-0.5 text-indigo-500 font-bold font-mono">#{idx + 1}</span>
                    <span>{sug}</span>
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-8 pt-4 border-t border-dashed dark:border-slate-800 border-slate-100 flex justify-end">
            <button
              onClick={handleRegenerateAI}
              disabled={aiLoading}
              className="inline-flex items-center justify-center px-4 py-2 border border-transparent rounded-xl text-xs font-semibold text-white bg-gradient-to-r from-indigo-550 to-pink-600 hover:opacity-95 shadow-md shadow-indigo-500/10 transform hover:-translate-y-0.5 transition-all cursor-pointer"
            >
              <Sparkles className={`h-3.5 w-3.5 mr-1.5 ${aiLoading ? 'animate-spin' : ''}`} />
              {aiLoading ? (currentLang === 'pt' ? 'Mapeando estatísticas...' : currentLang === 'en' ? 'Scanning stats...' : 'Analizando estadísticas...') : t('refresh')}
            </button>
          </div>
        </div>

      </div>

    </section>
  );
}
