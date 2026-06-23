import { motion } from 'motion/react';
import { Compass, CalendarRange, Sparkles, MapPin } from 'lucide-react';
import { transKeys, LangType } from '../translations';

interface HeroProps {
  currentLang: LangType;
  darkMode: boolean;
  onExploreClick: () => void;
}

export default function Hero({ currentLang, darkMode, onExploreClick }: HeroProps) {
  const t = (key: keyof typeof transKeys['es']) => {
    return transKeys[currentLang]?.[key] || transKeys['es'][key] || key;
  };

  return (
    <div className={`relative overflow-hidden py-16 sm:py-24 border-b ${
      darkMode ? 'bg-slate-950 border-slate-900' : 'bg-slate-50 border-slate-200'
    }`}>
      {/* Decorative Blur Orbs */}
      <div className="absolute top-1/4 left-1/10 w-72 h-72 bg-sky-500/10 rounded-full blur-3xl" />
      <div className="absolute bottom-1/4 right-1/10 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="lg:grid lg:grid-cols-12 lg:gap-8 items-center">
          
          {/* Text content side */}
          <div className="sm:text-center md:max-w-2xl md:mx-auto lg:col-span-6 lg:text-left">
            <motion.div 
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center space-x-2 px-3 py-1 rounded-full text-xs font-semibold bg-sky-500/10 text-sky-400 border border-sky-400/20 mb-6"
            >
              <Sparkles className="h-3 w-3 animate-spin" />
              <span>{currentLang === 'pt' ? 'MUNICIPALIDADE INTELIGENTE' : currentLang === 'en' ? 'SMART MUNICIPAL HUB' : 'MUNICIPALIDAD DIGITAL'}</span>
            </motion.div>

            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-4xl tracking-tight font-display font-extrabold sm:text-5xl md:text-6xl text-slate-900 dark:text-white"
            >
              <span className="block">SmartEvents</span>
              <span className="block bg-gradient-to-r from-sky-400 via-indigo-400 to-pink-500 bg-clip-text text-transparent">
                {currentLang === 'pt' ? 'Eventos & Turismo' : currentLang === 'en' ? 'Events & Tourism' : 'Eventos y Turismo'}
              </span>
            </motion.h1>

            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="mt-4 text-base text-slate-500 dark:text-slate-400 sm:mt-5 sm:text-xl lg:text-lg xl:text-xl leading-relaxed"
            >
              {t('hero_desc')}
            </motion.p>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="mt-8 sm:max-w-lg sm:mx-auto lg:mx-0 flex flex-col sm:flex-row gap-4"
            >
              <button
                onClick={onExploreClick}
                className="inline-flex items-center justify-center px-6 py-3.5 border border-transparent text-base font-semibold rounded-xl text-white bg-gradient-to-r from-sky-500 via-indigo-500 to-indigo-600 hover:opacity-95 shadow-lg shadow-indigo-500/20 transform hover:-translate-y-0.5 transition-all cursor-pointer"
              >
                <Compass className="h-5 w-5 mr-2" />
                {t('hero_explore')}
              </button>
              
              <button
                onClick={() => {
                  const el = document.getElementById('proveedores');
                  if (el) el.scrollIntoView({ behavior: 'smooth' });
                }}
                className={`inline-flex items-center justify-center px-6 py-3.5 border text-base font-semibold rounded-xl transition-all ${
                  darkMode 
                    ? 'border-slate-700 hover:bg-slate-800 text-slate-200' 
                    : 'border-slate-200 hover:bg-slate-100 text-slate-700'
                }`}
              >
                <CalendarRange className="h-5 w-5 mr-2 text-indigo-400" />
                {currentLang === 'pt' ? 'Canal de Negócios' : currentLang === 'en' ? 'Business Matchmaking' : 'Canal Proveedores'}
              </button>
            </motion.div>
          </div>

          {/* Visual Presentation side */}
          <div className="mt-12 sm:mt-16 lg:mt-0 lg:col-span-6">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative mx-auto w-full max-w-md lg:max-w-none"
            >
              {/* Premium Mosaic Layout of Municipal Activity */}
              <div className="grid grid-cols-2 gap-4 h-[350px]">
                <div className="space-y-4">
                  <div className="h-[210px] rounded-2xl overflow-hidden relative group">
                    <img 
                      src="https://images.unsplash.com/photo-1492684223066-81342ee5ff30?q=80&w=600" 
                      alt="Event" 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent flex items-end p-4">
                      <span className="text-white text-xs font-semibold bg-sky-500/80 px-2 py-0.5 rounded flex items-center">
                        <MapPin className="h-3 w-3 mr-0.5" /> Santiago
                      </span>
                    </div>
                  </div>
                  <div className="h-[120px] rounded-2xl overflow-hidden bg-gradient-to-br from-sky-400 to-indigo-600 p-5 flex flex-col justify-end text-white shadow-lg">
                    <h4 className="font-display font-bold text-lg leading-tight">
                      {currentLang === 'pt' ? '12+ Espaços' : currentLang === 'en' ? '12+ Venues' : '12+ Recintos'}
                    </h4>
                    <p className="text-[10px] opacity-90">{currentLang === 'pt' ? 'Ativos na comunidade' : currentLang === 'en' ? 'Active city spaces' : 'Activos en toda la comuna'}</p>
                  </div>
                </div>
                <div className="space-y-4 pt-8">
                  <div className="h-[120px] rounded-2xl overflow-hidden bg-slate-900 text-white p-5 border border-slate-800 flex flex-col justify-between">
                    <span className="text-[10px] text-pink-400 font-bold uppercase tracking-wider font-mono">LIVE ENGAGEMENT</span>
                    <div>
                      <h4 className="font-display font-bold text-2xl">98%</h4>
                      <p className="text-[9px] text-slate-400">{currentLang === 'pt' ? 'Satisfação geral' : currentLang === 'en' ? 'Citizen rating level' : 'Satisfacción ciudadana general'}</p>
                    </div>
                  </div>
                  <div className="h-[190px] rounded-2xl overflow-hidden relative group">
                    <img 
                      src="https://images.unsplash.com/photo-1511578314322-379afb476865?q=80&w=600" 
                      alt="Cultural Activities" 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent flex items-end p-4">
                      <span className="text-white text-xs font-semibold bg-pink-500/80 px-2 py-0.5 rounded flex items-center">
                        {currentLang === 'pt' ? 'Turismo' : currentLang === 'en' ? 'Tourism' : 'Turismo'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>

        </div>
      </div>
    </div>
  );
}
