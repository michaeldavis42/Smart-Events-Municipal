import React from 'react';
import { MapPin, Star, MessageSquare, Clock, Handshake } from 'lucide-react';
import { transKeys, LangType } from '../translations';

interface FeaturesProps {
  currentLang: LangType;
  darkMode: boolean;
}

export default function Features({ currentLang, darkMode }: FeaturesProps) {
  const t = (key: keyof typeof transKeys['es']) => {
    return transKeys[currentLang]?.[key] || transKeys['es'][key] || key;
  };

  const featureItems = [
    {
      icon: <MapPin className="h-6 w-6 text-sky-450" />,
      title: t('f_nearby'),
      desc: t('f_nearby_desc'),
      gradient: 'from-sky-500/10 to-indigo-500/5',
      border: 'hover:border-sky-500/35',
      badgeColor: 'bg-sky-500/10 text-sky-400 border-sky-500/20'
    },
    {
      icon: <Star className="h-6 w-6 text-yellow-450" />,
      title: t('f_reviews'),
      desc: t('f_reviews_desc'),
      gradient: 'from-yellow-500/10 to-amber-500/5',
      border: 'hover:border-yellow-500/35',
      badgeColor: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20'
    },
    {
      icon: <MessageSquare className="h-6 w-6 text-emerald-450" />,
      title: t('f_feed'),
      desc: t('f_feed_desc'),
      gradient: 'from-emerald-500/10 to-teal-500/5',
      border: 'hover:border-emerald-500/35',
      badgeColor: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
    },
    {
      icon: <Clock className="h-6 w-6 text-purple-450" />,
      title: t('f_timeline'),
      desc: t('f_timeline_desc'),
      gradient: 'from-purple-500/10 to-pink-500/5',
      border: 'hover:border-purple-500/35',
      badgeColor: 'bg-purple-500/10 text-purple-400 border-purple-500/20'
    },
    {
      icon: <Handshake className="h-6 w-6 text-teal-450" />,
      title: t('f_providers'),
      desc: t('f_providers_desc'),
      gradient: 'from-teal-500/10 to-cyan-500/5',
      border: 'hover:border-teal-500/35',
      badgeColor: 'bg-teal-500/10 text-teal-400 border-teal-500/20'
    }
  ];

  return (
    <section id="destacados" className={`py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto transition-colors duration-300`}>
      <div className="text-center max-w-3xl mx-auto mb-12">
        <h2 className="text-3xl font-display font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-4xl flex items-center justify-center gap-2">
          <CompassIcon className="h-7 w-7 text-sky-400" />
          <span>{t('features_title')}</span>
        </h2>
        <p className="mt-4 text-slate-500 dark:text-slate-400 text-sm sm:text-base leading-relaxed">
          {currentLang === 'pt' ? 'Explore as conexões e ferramentas municipais pensadas para as suas dinâmicas urbanas cotidianas.' : currentLang === 'en' ? 'Explore advanced features developed to help you make the absolute most of local cultural catalogs.' : 'Conoce cada una de las herramientas diseñadas para coordinar, registrar y enriquecer tu experiencia en la comuna.'}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
        {featureItems.map((f, i) => (
          <div
            key={i}
            className={`cursor-default rounded-2xl p-6 border transition-all duration-300 relative group bg-gradient-to-b ${f.gradient} ${
              darkMode ? 'bg-slate-900/60 border-slate-800' : 'bg-white border-slate-200'
            } ${f.border}`}
          >
            {/* Top Indicator Accent */}
            <div className="flex justify-between items-start mb-4">
              <div className={`p-3 rounded-xl ${
                darkMode ? 'bg-slate-950/80 border border-slate-800' : 'bg-slate-50 border border-slate-100'
              }`}>
                {f.icon}
              </div>
              <span className={`text-[9px] font-bold px-2 py-0.5 rounded border ${f.badgeColor}`}>
                {t('new')}
              </span>
            </div>

            <h3 className="text-base font-bold font-display text-slate-900 dark:text-slate-100 group-hover:text-sky-400 transition-colors">
              {f.title}
            </h3>
            <p className="mt-2 text-xs text-slate-500 dark:text-slate-400 leading-relaxed font-sans">
              {f.desc}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}

function CompassIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="10" />
      <polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76" />
    </svg>
  );
}
