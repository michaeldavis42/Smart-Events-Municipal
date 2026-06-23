import React, { useState, useEffect } from 'react';
import { Handshake, FileEdit, BarChart2, ShieldAlert, BadgeCheck, PhoneCall, Globe, CheckCircle, Award } from 'lucide-react';
import { transKeys, LangType } from '../translations';
import { ProviderProfileModel, EventModel } from '../types';

interface ProviderHubProps {
  currentLang: LangType;
  darkMode: boolean;
  events: EventModel[];
}

export default function ProviderHub({ currentLang, darkMode, events }: ProviderHubProps) {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'profile' | 'matches'>('dashboard');
  const [contactedStatus, setContactedStatus] = useState<Record<number, boolean>>({});

  // Ficha comercial state
  const [profile, setProfile] = useState<ProviderProfileModel>({
    business_name: 'Sabores del Sur Catering',
    responsible_name: 'Marcos Benavente',
    email: 'contacto@saboresdelsur.cl',
    phone: '+56 9 8888 7777',
    category: 'Catering',
    description: 'Servicio premium de catering ecológico y banquetería de primer nivel con insumos endémicos de la región para eventos artísticos e institucionales.',
    location: 'Providencia, Santiago',
    price_range: '$150.000 - $500.000',
    capacity: 'Hasta 250 personas',
    availability: 'Lunes a Sábado, todo el día',
    social_links: 'https://instagram.com/saboresdelsur',
    logo_url: 'https://images.unsplash.com/photo-1555244162-803834f70033?q=80&w=200'
  });

  const t = (key: keyof typeof transKeys['es']) => {
    return transKeys[currentLang]?.[key] || transKeys['es'][key] || key;
  };

  // Dynamically compute profile completeness level %
  const calculateCompleteness = () => {
    const fields = Object.values(profile) as string[];
    const completed = fields.filter(f => f.trim() !== '').length;
    return Math.round((completed / fields.length) * 100);
  };

  const completeness = calculateCompleteness();

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    alert('¡Ficha Comercial actualizada en el catálogo central de proveedores municipales!\nSu porcentaje de cumplimiento se ha calculado en: ' + completeness + '%.');
    setActiveTab('dashboard');
  };

  const handleContact = (eventId: number) => {
    setContactedStatus(prev => ({ ...prev, [eventId]: true }));
    alert('Felicidades! Se ha enviado su ficha acreditada al organizador del evento.\nSe coordinará una reunión exploratoria de servicios a la brevedad.');
  };

  // Simulated MATCH scoring algorithm based on category overlap
  const getMatchingScore = (eventCategory: string) => {
    // If catering, music, decoration sound overlaps well with Cultural/Social/Musical
    if (profile.category === 'Catering' || profile.category === 'Catering' || profile.category === 'Fotografía') {
      if (['Cultural', 'Social', 'Musical'].includes(eventCategory)) return 95;
      return 70;
    }
    if (profile.category === 'Música/DJ' || profile.category === 'Sonido e iluminación') {
      if (eventCategory === 'Musical') return 98;
      if (eventCategory === 'Cultural' || eventCategory === 'Social') return 85;
      return 60;
    }
    return 75; // Default solid cross-matching
  };

  return (
    <section id="proveedores" className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-b border-dashed dark:border-slate-800 border-slate-200">
      
      {/* Title block */}
      <div className="mb-10 text-center md:text-left">
        <h2 className="text-3xl font-display font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-4xl flex items-center justify-center md:justify-start gap-2">
          <Handshake className="h-7 w-7 text-sky-400" />
          <span>{t('providers_title')}</span>
        </h2>
        <p className="mt-2 text-slate-500 dark:text-slate-400 text-xs sm:text-sm max-w-xl">
          {currentLang === 'pt' ? 'Conexão B2B inteligente. Inscreva seu negócio de buffet, música ou foto e receba licitações.' : currentLang === 'en' ? 'B2B Smart Connection. Register your local catering, audio or visual service to win direct contracts.' : 'Conexión inteligente B2B municipal. Inscribe tu servicio local de banquetería, fotografía o música y participa automáticamente en licitaciones por rubro.'}
        </p>
      </div>

      {/* Tabs Selector Navigation */}
      <div className="flex border-b border-slate-205 dark:border-slate-805 mb-8 overflow-x-auto whitespace-nowrap scrollbar-none">
        <button
          onClick={() => setActiveTab('dashboard')}
          className={`pb-4 px-4 text-xs sm:text-sm font-semibold border-b-2 flex items-center gap-1.5 transition-all outline-none ${
            activeTab === 'dashboard'
              ? 'border-sky-500 text-sky-450 font-bold'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <BarChart2 className="h-4 w-4" />
          {t('prov_dashboard')}
        </button>
        <button
          onClick={() => setActiveTab('profile')}
          className={`pb-4 px-4 text-xs sm:text-sm font-semibold border-b-2 flex items-center gap-1.5 transition-all outline-none ${
            activeTab === 'profile'
              ? 'border-sky-500 text-sky-450 font-bold'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <FileEdit className="h-4 w-4" />
          {t('prov_profile')}
        </button>
        <button
          onClick={() => setActiveTab('matches')}
          className={`pb-4 px-4 text-xs sm:text-sm font-semibold border-b-2 flex items-center gap-1.5 transition-all outline-none ${
            activeTab === 'matches'
              ? 'border-sky-500 text-sky-450 font-bold'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <Handshake className="h-4 w-4" />
          {t('prov_matches')}
        </button>
      </div>

      {/* COMPONENT BODY */}
      <div>
        
        {/* DASHBOARD TAB */}
        {activeTab === 'dashboard' && (
          <div className="space-y-6">
            
            {/* Health indicators */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              
              <div className={`p-5 rounded-2xl border text-center ${
                darkMode ? 'bg-slate-900/60 border-slate-800' : 'bg-white border-slate-200 shadow-sm'
              }`}>
                <div className={`mx-auto p-3 rounded-full w-12 h-12 flex items-center justify-center ${
                  completeness === 100 ? 'bg-emerald-500/10 text-emerald-400' : 'bg-yellow-500/10 text-yellow-500'
                }`}>
                  <BadgeCheck className="h-6 w-6" />
                </div>
                <p className="text-2xl font-extrabold text-slate-900 dark:text-white mt-3">{completeness}%</p>
                <small className="text-[10px] text-slate-400 font-medium uppercase mt-1 block">Perfil Completado</small>
              </div>

              <div className={`p-5 rounded-2xl border text-center ${
                darkMode ? 'bg-slate-900/60 border-slate-800' : 'bg-white border-slate-205 shadow-sm'
              }`}>
                <div className="mx-auto p-3 rounded-full w-12 h-12 flex items-center justify-center bg-sky-500/10 text-sky-400">
                  <Handshake className="h-6 w-6" />
                </div>
                <p className="text-2xl font-extrabold text-slate-900 dark:text-white mt-3">
                  {completeness === 100 ? events.length - 1 : 0}
                </p>
                <small className="text-[10px] text-slate-400 font-medium uppercase mt-1 block">Eventos Compatibles</small>
              </div>

              <div className={`p-5 rounded-2xl border text-center ${
                darkMode ? 'bg-slate-900/60 border-slate-800' : 'bg-white border-slate-205 shadow-sm'
              }`}>
                <div className="mx-auto p-3 rounded-full w-12 h-12 flex items-center justify-center bg-indigo-500/10 text-indigo-400">
                  <PhoneCall className="h-6 w-6" />
                </div>
                <p className="text-2xl font-extrabold text-slate-900 dark:text-white mt-3">
                  {Object.keys(contactedStatus).length}
                </p>
                <small className="text-[10px] text-slate-400 font-medium uppercase mt-1 block">Postulaciones Enviadas</small>
              </div>

              <div className={`p-5 rounded-2xl border text-center ${
                darkMode ? 'bg-slate-900/60 border-slate-800' : 'bg-white border-slate-205 shadow-sm'
              }`}>
                <div className="mx-auto p-3 rounded-full w-12 h-12 flex items-center justify-center bg-pink-500/10 text-pink-400">
                  <Award className="h-6 w-6" />
                </div>
                <p className="text-sm font-semibold text-slate-900 dark:text-white mt-4 block truncate">
                  {profile.business_name || 'Sin negocio'}
                </p>
                <small className="text-[10px] text-slate-400 font-medium uppercase mt-1 block">Ficha Comercial Activa</small>
              </div>

            </div>

            {/* Completeness progress visual tracker bar */}
            <div className={`p-6 rounded-2xl border ${
              darkMode ? 'bg-slate-900/40 border-slate-800' : 'bg-slate-50 border-slate-150'
            }`}>
              <div className="flex md:items-center justify-between mb-3 flex-col md:flex-row gap-2">
                <div>
                  <h4 className="text-sm font-bold text-slate-900 dark:text-white flex items-center">
                    {completeness === 100 ? (
                      <>
                        <CheckCircle className="h-4.5 w-4.5 text-emerald-500 mr-1.5" />
                        <span className="text-emerald-500">{currentLang === 'pt' ? 'Perfil 100% Completo! Algoritmo Ativado' : currentLang === 'en' ? 'Profile 100% Match Ready! Algorithm Enabled' : '¡Ficha comercial acreditada al 100%! Algoritmo habilitado'}</span>
                      </>
                    ) : (
                      <>
                        <ShieldAlert className="h-4.5 w-4.5 text-yellow-500 mr-1.5 animate-bounce" />
                        <span className="text-slate-800 dark:text-slate-350">{currentLang === 'pt' ? 'Ficha Incompleta. Algoritmo Desativado' : currentLang === 'en' ? 'Incomplete Profile. Matching Disabled' : 'Ficha incompleta. Algoritmo matchmaking deshabilitado'}</span>
                      </>
                    )}
                  </h4>
                  <p className="text-[10px] text-slate-400 mt-1 max-w-xl">
                    Para integrarte de lleno en las licitaciones directas de la municipalidad, debes rellenar cada uno de los campos requeridos en la pestaña de 'Ficha Comercial'.
                  </p>
                </div>
                <span className="text-xs font-bold font-mono text-slate-500">{completeness}%</span>
              </div>

              <div className="h-2.5 w-full bg-slate-205 dark:bg-slate-950 rounded-full overflow-hidden border dark:border-slate-855">
                <div 
                  className={`h-full rounded-full transition-all duration-500 bg-gradient-to-r ${
                    completeness === 100 ? 'from-emerald-500 to-teal-500' : 'from-yellow-550 to-amber-500'
                  }`} 
                  style={{ width: `${completeness}%` }}
                />
              </div>
            </div>

          </div>
        )}

        {/* PROFILE PROFILE EDIT TAB */}
        {activeTab === 'profile' && (
          <form onSubmit={handleSaveProfile} className={`p-6 rounded-2xl border space-y-4 ${
            darkMode ? 'bg-slate-900/35 border-slate-800' : 'bg-white border-slate-250 shadow-sm'
          }`}>
            <h3 className="font-display font-bold text-sm sm:text-base text-slate-900 dark:text-slate-100 uppercase tracking-wider mb-4 border-b border-dashed dark:border-slate-800 border-slate-100 pb-2">
              Formulario de Acreditación Comercial
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">Nombre de la Empresa *</label>
                <input
                  type="text"
                  required
                  value={profile.business_name}
                  onChange={(e) => setProfile({ ...profile, business_name: e.target.value })}
                  className={`w-full px-4 py-2.5 rounded-xl border text-xs sm:text-sm outline-none transition-all ${
                    darkMode ? 'bg-slate-950 border-slate-800 focus:border-sky-505 text-slate-100' : 'bg-slate-50 border-slate-200 focus:border-sky-505 text-slate-800'
                  }`}
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">Nombre Representante Legal *</label>
                <input
                  type="text"
                  required
                  value={profile.responsible_name}
                  onChange={(e) => setProfile({ ...profile, responsible_name: e.target.value })}
                  className={`w-full px-4 py-2.5 rounded-xl border text-xs sm:text-sm outline-none transition-all ${
                    darkMode ? 'bg-slate-950 border-slate-800 focus:border-sky-505 text-slate-100' : 'bg-slate-50 border-slate-200 focus:border-sky-505 text-slate-800'
                  }`}
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">Email Comercial de Contacto *</label>
                <input
                  type="email"
                  required
                  value={profile.email}
                  onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                  className={`w-full px-4 py-2.5 rounded-xl border text-xs sm:text-sm outline-none transition-all ${
                    darkMode ? 'bg-slate-950 border-slate-800 focus:border-sky-505 text-slate-100' : 'bg-slate-50 border-slate-200 focus:border-sky-505 text-slate-800'
                  }`}
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">Teléfono Directo de Contacto *</label>
                <input
                  type="tel"
                  required
                  value={profile.phone}
                  onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                  className={`w-full px-4 py-2.5 rounded-xl border text-xs sm:text-sm outline-none transition-all ${
                    darkMode ? 'bg-slate-950 border-slate-800 focus:border-sky-505 text-slate-100' : 'bg-slate-50 border-slate-200 focus:border-sky-505 text-slate-800'
                  }`}
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">Rubro Comercial Especializado *</label>
                <select
                  value={profile.category}
                  onChange={(e) => setProfile({ ...profile, category: e.target.value })}
                  className={`w-full px-4 py-2.5 rounded-xl border text-xs sm:text-sm outline-none cursor-pointer transition-all ${
                    darkMode ? 'bg-slate-950 border-slate-800 focus:border-sky-505 text-slate-100' : 'bg-slate-50 border-slate-200 focus:border-sky-505 text-slate-800'
                  }`}
                >
                  <option value="Catering">Catering / Banquetería</option>
                  <option value="Música/DJ">Música / DJ</option>
                  <option value="Decoración">Decoración</option>
                  <option value="Sonido e iluminación">Sonido e Iluminación</option>
                  <option value="Fotografía">Fotografía Profesional</option>
                  <option value="Animación infantil">Animación infantil</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">Región / Lugar de Cobertura *</label>
                <input
                  type="text"
                  required
                  value={profile.location}
                  onChange={(e) => setProfile({ ...profile, location: e.target.value })}
                  className={`w-full px-4 py-2.5 rounded-xl border text-xs sm:text-sm outline-none transition-all ${
                    darkMode ? 'bg-slate-950 border-slate-800 focus:border-sky-505 text-slate-100' : 'bg-slate-50 border-slate-200 focus:border-sky-505 text-slate-800'
                  }`}
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">Licitación Estimada / Rango Tarifas *</label>
                <input
                  type="text"
                  required
                  value={profile.price_range}
                  placeholder="ej: $100.000 - $350.000"
                  onChange={(e) => setProfile({ ...profile, price_range: e.target.value })}
                  className={`w-full px-4 py-2.5 rounded-xl border text-xs sm:text-sm outline-none transition-all ${
                    darkMode ? 'bg-slate-950 border-slate-800 focus:border-sky-505 text-slate-100' : 'bg-slate-50 border-slate-200 focus:border-sky-505 text-slate-800'
                  }`}
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">Capacidad Máxima *</label>
                <input
                  type="text"
                  required
                  value={profile.capacity}
                  placeholder="ej: Hasta 500 personas"
                  onChange={(e) => setProfile({ ...profile, capacity: e.target.value })}
                  className={`w-full px-4 py-2.5 rounded-xl border text-xs sm:text-sm outline-none transition-all ${
                    darkMode ? 'bg-slate-950 border-slate-800 focus:border-sky-505 text-slate-100' : 'bg-slate-50 border-slate-200 focus:border-sky-505 text-slate-800'
                  }`}
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">Disponibilidades Horarias *</label>
                <input
                  type="text"
                  required
                  value={profile.availability}
                  onChange={(e) => setProfile({ ...profile, availability: e.target.value })}
                  className={`w-full px-4 py-2.5 rounded-xl border text-xs sm:text-sm outline-none transition-all ${
                    darkMode ? 'bg-slate-950 border-slate-800 focus:border-sky-505 text-slate-100' : 'bg-slate-50 border-slate-200 focus:border-sky-505 text-slate-800'
                  }`}
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">Sitio Web / Link porfolio *</label>
                <input
                  type="url"
                  required
                  value={profile.social_links}
                  onChange={(e) => setProfile({ ...profile, social_links: e.target.value })}
                  className={`w-full px-4 py-2.5 rounded-xl border text-xs sm:text-sm outline-none transition-all ${
                    darkMode ? 'bg-slate-950 border-slate-800 focus:border-sky-505 text-slate-100' : 'bg-slate-50 border-slate-200 focus:border-sky-505 text-slate-800'
                  }`}
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">Logo o Foto Comercial (URL) *</label>
                <input
                  type="url"
                  required
                  value={profile.logo_url}
                  onChange={(e) => setProfile({ ...profile, logo_url: e.target.value })}
                  className={`w-full px-4 py-2.5 rounded-xl border text-xs sm:text-sm outline-none transition-all ${
                    darkMode ? 'bg-slate-950 border-slate-800 focus:border-sky-505 text-slate-100' : 'bg-slate-50 border-slate-200 focus:border-sky-505 text-slate-800'
                  }`}
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">Descripción de sus Servicios *</label>
                <textarea
                  required
                  value={profile.description}
                  rows={3}
                  onChange={(e) => setProfile({ ...profile, description: e.target.value })}
                  className={`w-full px-4 py-2.5 rounded-xl border text-xs sm:text-sm outline-none transition-all resize-none ${
                    darkMode ? 'bg-slate-950 border-slate-800 focus:border-sky-505 text-slate-100' : 'bg-slate-50 border-slate-200 focus:border-sky-505 text-slate-800'
                  }`}
                />
              </div>
            </div>

            <div className="pt-4 flex justify-end">
              <button
                type="submit"
                className="inline-flex items-center justify-center px-6 py-2.5 border border-transparent rounded-xl text-xs font-semibold text-white bg-gradient-to-r from-sky-500 to-indigo-600 hover:opacity-95 transform hover:-translate-y-0.5 transition-all cursor-pointer shadow-md shadow-sky-500/10"
              >
                {t('prov_save')}
              </button>
            </div>
          </form>
        )}

        {/* MATCH OPEN CONTRACTS TAB */}
        {activeTab === 'matches' && (
          <div>
            {completeness < 100 ? (
              <div className={`p-8 rounded-2xl border border-dashed text-center ${
                darkMode ? 'bg-slate-900/30 border-slate-800 text-slate-400' : 'bg-slate-50 border-slate-205 text-slate-500'
              }`}>
                <ShieldAlert className="h-10 w-10 text-yellow-450 mx-auto animate-bounce mb-3" />
                <h4 className="font-semibold text-sm sm:text-base text-slate-900 dark:text-slate-200 mb-1">{t('prov_complete_first')}</h4>
                <p className="text-xs text-slate-450 mt-1.5">Rellena el formulario de acreditadora al 100% para participar legalmente.</p>
                <button
                  onClick={() => setActiveTab('profile')}
                  className="mt-4 inline-flex items-center text-xs font-bold text-sky-400 hover:underline"
                >
                  Ir a rellenar ficha comercial →
                </button>
              </div>
            ) : (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-bold text-slate-400 uppercase">Procesos de Licitaciones Abiertos</span>
                  <span className="text-[10px] text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded uppercase font-bold tracking-wide">ALGORITMO ACTIVO</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {events.filter(e => e.status !== 'Completado').map((e) => {
                    const matchScore = getMatchingScore(e.category);
                    const isContacted = contactedStatus[e.id] || false;

                    return (
                      <div
                        key={e.id}
                        className={`p-5 rounded-2xl border transition-all duration-300 relative group flex flex-col justify-between ${
                          darkMode 
                            ? 'bg-slate-900/60 border-slate-800 hover:border-slate-700' 
                            : 'bg-white border-slate-200 hover:border-slate-300 hover:shadow-sm'
                        }`}
                      >
                        <div>
                          {/* Top indicator match % */}
                          <div className="flex items-center justify-between mb-3 border-b dark:border-slate-850 border-slate-100 pb-2.5">
                            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Licitación #{e.id * 892}</span>
                            <span className="text-xs font-bold font-mono text-emerald-400 flex items-center bg-emerald-500/10 px-2 py-0.5 rounded-lg border border-emerald-500/20">
                              {matchScore}% Match
                            </span>
                          </div>

                          <h4 className="font-display font-bold text-[#faf9f9] dark:text-white group-hover:text-sky-400 transition-colors">
                            {e.name}
                          </h4>

                          <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 line-clamp-2">
                            {e.description || 'Proceso abierto para coordinaciones de apoyo en catering, fotografía o dinamismo musical.'}
                          </p>

                          <div className="mt-4 space-y-1 text-[11px] text-slate-400 font-medium">
                            <p><strong>Rubro Solicitado:</strong> {e.category} / Logística</p>
                            <p><strong>Presupuesto Techo:</strong> {profile.price_range}</p>
                            <p><strong>Promotor:</strong> {e.organizer_name || 'Alcaldía Santiago'}</p>
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="mt-6 pt-4 border-t dark:border-slate-850 border-slate-100 flex items-center justify-between flex-wrap gap-2">
                          <span className="text-[10px] text-slate-500 dark:text-slate-500 font-mono">
                            Fecha tope: {e.date}
                          </span>
                          
                          <button
                            onClick={() => handleContact(e.id)}
                            disabled={isContacted}
                            className={`px-4 py-2 rounded-xl text-xs font-bold cursor-pointer transition-all ${
                              isContacted
                                ? 'bg-emerald-500/15 text-emerald-400 cursor-default border border-emerald-500/20'
                                : 'bg-gradient-to-r from-sky-500 to-indigo-600 hover:opacity-95 text-white active:scale-95'
                            }`}
                          >
                            {isContacted 
                              ? (currentLang === 'pt' ? 'Contatado ✓' : currentLang === 'en' ? 'Contacted ✓' : 'Postulado ✓') 
                              : (currentLang === 'pt' ? 'Postular' : currentLang === 'en' ? 'Apply Contract' : 'Postular / Contactar')}
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        )}

      </div>

    </section>
  );
}
