import React, { useState } from 'react';
import { Shield, Plus, Landmark, Users, Handshake, Globe, Image as ImageIcon } from 'lucide-react';
import { transKeys, LangType } from '../translations';
import { EventModel, SponsorModel } from '../types';

interface AdminPanelProps {
  currentLang: LangType;
  darkMode: boolean;
  events: EventModel[];
  onAddEvent: (ev: EventModel) => void;
  onAddSponsor: (spo: SponsorModel) => void;
}

export default function AdminPanel({
  currentLang,
  darkMode,
  events,
  onAddEvent,
  onAddSponsor
}: AdminPanelProps) {
  // Event form states
  const [eventName, setEventName] = useState('');
  const [eventLoc, setEventLoc] = useState('');
  const [eventDate, setEventDate] = useState('2026-07-01');
  const [eventSlots, setEventSlots] = useState('150');
  const [eventCat, setEventCat] = useState<'Cultural' | 'Deportivo' | 'Educativo' | 'Social' | 'Musical'>('Cultural');
  const [eventDesc, setEventDesc] = useState('');
  const [eventImg, setEventImg] = useState('');

  // Sponsor form states
  const [spoEventId, setSpoEventId] = useState('');
  const [spoName, setSpoName] = useState('');
  const [spoLogo, setSpoLogo] = useState('');
  const [spoDesc, setSpoDesc] = useState('');
  const [spoWeb, setSpoWeb] = useState('');

  const t = (key: keyof typeof transKeys['es']) => {
    return transKeys[currentLang]?.[key] || transKeys['es'][key] || key;
  };

  // citizen directory database simulator
  const simulatedCitizens = [
    { name: "Sebastián Reyes", email: "seba.reyes@duocuc.cl", role: "Ciudadano", registered: "3 eventos" },
    { name: "Camila Jara", email: "camila.jara@gmail.com", role: "Proveedor", registered: "Planteamiento" },
    { name: "Carlos Mendoza", email: "carlos.m@municipalidad.cl", role: "Organizador", registered: "7 creados" },
    { name: "María José Allende", email: "cote.allende@nunoa.cl", role: "Ciudadano", registered: "1 evento" }
  ];

  const handleCreateEvent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!eventName.trim() || !eventLoc.trim()) return;

    const newEv: EventModel = {
      id: events.length + 1,
      name: eventName,
      location: eventLoc,
      date: eventDate,
      slots: parseInt(eventSlots) || 100,
      participants: 0,
      category: eventCat,
      status: 'Próximo',
      description: eventDesc,
      image: eventImg || 'https://images.unsplash.com/photo-1511578314322-379afb476865?q=80&w=400',
      lat: -33.437 + (Math.random() - 0.5) * 0.1, // Simulated coherent Santiago coords
      lng: -70.64 + (Math.random() - 0.5) * 0.1,
      organizer_name: "Municipalidad SmartEvents",
      organizer_email: "admin@smartevents.cl",
      organizer_phone: "+56 9 9999 8888"
    };

    onAddEvent(newEv);
    alert('Evento creado con éxito.');
    
    // reset form
    setEventName('');
    setEventLoc('');
    setEventDesc('');
    setEventImg('');
  };

  const handleCreateSponsor = (e: React.FormEvent) => {
    e.preventDefault();
    if (!spoName.trim() || !spoEventId) return;

    const newSpo: SponsorModel = {
      id: Math.round(Math.random() * 10000),
      event_id: parseInt(spoEventId),
      name: spoName,
      logo_url: spoLogo || 'https://images.unsplash.com/photo-1560179707-f14e90ef3623?q=80&w=100',
      description: spoDesc,
      website: spoWeb
    };

    onAddSponsor(newSpo);
    alert('Patrocinador asignado con éxito.');
    
    // reset form
    setSpoName('');
    setSpoLogo('');
    setSpoDesc('');
    setSpoWeb('');
  };

  return (
    <section id="admin" className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-b border-dashed dark:border-slate-800 border-slate-205">
      
      {/* Title block */}
      <div className="mb-10 text-center md:text-left">
        <h2 className="text-3xl font-display font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-4xl flex items-center justify-center md:justify-start gap-2">
          <Shield className="h-7 w-7 text-indigo-400" />
          <span>Panel de Coordinador Coordinador</span>
        </h2>
        <p className="mt-2 text-slate-500 dark:text-slate-400 text-xs sm:text-sm max-w-xl">
          Atribuciones exclusivas del personal de marketing, alcaldía o producción de eventos autorizados.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Create Event Form Column */}
        <div className={`lg:col-span-6 p-6 rounded-2xl border ${
          darkMode ? 'bg-slate-900/40 border-slate-800' : 'bg-white border-slate-200'
        }`}>
          <h3 className="font-display font-bold text-sm sm:text-base text-slate-900 dark:text-slate-100 flex items-center mb-4 pb-2.5 border-b border-dashed dark:border-slate-850 border-slate-100 uppercase tracking-wider">
            <Plus className="h-4.5 w-4.5 text-sky-400 mr-2" />
            <span>{t('create_event')}</span>
          </h3>

          <form onSubmit={handleCreateEvent} className="space-y-4 text-xs sm:text-sm">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2">
                <label className="block text-[10px] font-bold text-slate-450 uppercase tracking-widest mb-1">Nombre Evento *</label>
                <input
                  type="text"
                  required
                  value={eventName}
                  onChange={(e) => setEventName(e.target.value)}
                  placeholder="ej: Gran Concierto Artístico"
                  className={`w-full px-4 py-2.5 rounded-xl border outline-none transition-all ${
                    darkMode ? 'bg-slate-950 border-slate-800 focus:border-sky-505 text-slate-100' : 'bg-slate-50 border-slate-200 focus:border-sky-505 text-slate-800'
                  }`}
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-455 uppercase tracking-widest mb-1">Lugar Físico *</label>
                <input
                  type="text"
                  required
                  value={eventLoc}
                  onChange={(e) => setEventLoc(e.target.value)}
                  placeholder="ej: Teatro Municipal"
                  className={`w-full px-4 py-2.5 rounded-xl border outline-none transition-all ${
                    darkMode ? 'bg-slate-950 border-slate-800 focus:border-sky-505 text-slate-100' : 'bg-slate-50 border-slate-205 focus:border-sky-505 text-slate-800'
                  }`}
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-455 uppercase tracking-widest mb-1">Fecha Programada *</label>
                <input
                  type="date"
                  required
                  value={eventDate}
                  onChange={(e) => setEventDate(e.target.value)}
                  className={`w-full px-4 py-2.5 rounded-xl border outline-none transition-all ${
                    darkMode ? 'bg-slate-950 border-slate-800 focus:border-sky-505 text-slate-100' : 'bg-slate-50 border-slate-205 focus:border-sky-505 text-slate-800'
                  }`}
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-455 uppercase tracking-widest mb-1">Cupos máximos *</label>
                <input
                  type="number"
                  required
                  value={eventSlots}
                  onChange={(e) => setEventSlots(e.target.value)}
                  className={`w-full px-4 py-2.5 rounded-xl border outline-none transition-all ${
                    darkMode ? 'bg-slate-955 border-slate-800 focus:border-sky-505 text-slate-100' : 'bg-slate-50 border-slate-210 focus:border-sky-505 text-slate-800'
                  }`}
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-455 uppercase tracking-widest mb-1">Categoría General *</label>
                <select
                  value={eventCat}
                  onChange={(e) => setEventCat(e.target.value as any)}
                  className={`w-full px-4 py-2.5 rounded-xl border outline-none cursor-pointer transition-all ${
                    darkMode ? 'bg-slate-950 border-slate-800 focus:border-sky-505 text-slate-100' : 'bg-slate-50 border-slate-210 focus:border-sky-505 text-slate-800'
                  }`}
                >
                  <option value="Cultural">Cultural</option>
                  <option value="Deportivo">Deportivo</option>
                  <option value="Educativo">Educativo</option>
                  <option value="Social">Social</option>
                  <option value="Musical">Musical</option>
                </select>
              </div>

              <div className="sm:col-span-2">
                <label className="block text-[10px] font-bold text-slate-455 uppercase tracking-widest mb-1">Imagen Alusiva (URL)</label>
                <input
                  type="url"
                  value={eventImg}
                  onChange={(e) => setEventImg(e.target.value)}
                  placeholder="https://images.unsplash.com/photo-..."
                  className={`w-full px-4 py-2.5 rounded-xl border outline-none transition-all ${
                    darkMode ? 'bg-slate-950 border-slate-805 focus:border-sky-505 text-slate-100' : 'bg-slate-50 border-slate-210 focus:border-sky-505 text-slate-800'
                  }`}
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-[10px] font-bold text-slate-455 uppercase tracking-widest mb-1">Descripción de la Actividad *</label>
                <textarea
                  required
                  value={eventDesc}
                  rows={2}
                  onChange={(e) => setEventDesc(e.target.value)}
                  placeholder="Detalles sobre cronogramas, requerimientos o insumos de apoyo..."
                  className={`w-full px-4 py-2.5 rounded-xl border outline-none transition-all resize-none ${
                    darkMode ? 'bg-slate-955 border-slate-800 focus:border-sky-505 text-slate-100' : 'bg-slate-50 border-slate-205 focus:border-sky-505 text-slate-800'
                  }`}
                />
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                type="submit"
                className="w-full inline-flex items-center justify-center px-4 py-2.5 border border-transparent rounded-xl text-xs font-semibold text-white bg-gradient-to-r from-sky-500 to-indigo-600 hover:opacity-95 transform hover:-translate-y-0.5 transition-all cursor-pointer shadow-md shadow-sky-500/10"
              >
                Publicar en Cartelera
              </button>
            </div>
          </form>
        </div>

        <div className="lg:col-span-6 space-y-6">
          
          {/* Create Sponsor Form */}
          <div className={`p-6 rounded-2xl border ${
            darkMode ? 'bg-slate-900/40 border-slate-800' : 'bg-white border-slate-200'
          }`}>
            <h3 className="font-display font-bold text-sm sm:text-base text-slate-900 dark:text-slate-100 flex items-center mb-4 pb-2.5 border-b border-dashed dark:border-slate-850 border-slate-100 uppercase tracking-wider">
              <Plus className="h-4.5 w-4.5 text-indigo-400 mr-2" />
              <span>{t('add_sponsor')}</span>
            </h3>

            <form onSubmit={handleCreateSponsor} className="space-y-4 text-xs sm:text-sm">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-bold text-slate-455 uppercase tracking-widest mb-1">Sponsor de Evento *</label>
                  <select
                    required
                    value={spoEventId}
                    onChange={(e) => setSpoEventId(e.target.value)}
                    className={`w-full px-4 py-2.5 rounded-xl border outline-none cursor-pointer transition-all ${
                      darkMode ? 'bg-slate-950 border-slate-800 focus:border-sky-505 text-slate-100' : 'bg-slate-50 border-slate-205 focus:border-sky-505 text-slate-800'
                    }`}
                  >
                    <option value="">Seleccione Evento destinatario</option>
                    {events.map(ev => (
                      <option key={ev.id} value={ev.id}>{ev.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-slate-455 uppercase tracking-widest mb-1">Nombre Comercial Empresa *</label>
                  <input
                    type="text"
                    required
                    value={spoName}
                    onChange={(e) => setSpoName(e.target.value)}
                    placeholder="ej: Coca-Cola Chile"
                    className={`w-full px-4 py-2.5 rounded-xl border outline-none transition-all ${
                      darkMode ? 'bg-slate-950 border-slate-800 focus:border-sky-505 text-slate-100' : 'bg-slate-50 border-slate-210 focus:border-sky-505 text-slate-800'
                    }`}
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-slate-455 uppercase tracking-widest mb-1">Logo URL</label>
                  <input
                    type="url"
                    value={spoLogo}
                    onChange={(e) => setSpoLogo(e.target.value)}
                    placeholder="ej: https://logo.png"
                    className={`w-full px-4 py-2.5 rounded-xl border outline-none transition-all ${
                      darkMode ? 'bg-slate-955 border-slate-800 focus:border-sky-505 text-slate-100' : 'bg-slate-50 border-slate-210 focus:border-sky-505 text-slate-800'
                    }`}
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-slate-455 uppercase tracking-widest mb-1">Sitio Web Comercial</label>
                  <input
                    type="url"
                    value={spoWeb}
                    onChange={(e) => setSpoWeb(e.target.value)}
                    placeholder="ej:https://coca-cola.cl"
                    className={`w-full px-4 py-2.5 rounded-xl border outline-none transition-all ${
                      darkMode ? 'bg-slate-955 border-slate-800 focus:border-sky-505 text-slate-100' : 'bg-slate-50 border-slate-210 focus:border-sky-505 text-slate-800'
                    }`}
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-[10px] font-bold text-slate-455 uppercase tracking-widest mb-1">Glosa de apoyo / Descripción *</label>
                  <input
                    type="text"
                    required
                    value={spoDesc}
                    onChange={(e) => setSpoDesc(e.target.value)}
                    placeholder="ej: Provee bebidas hidratantes gratis para todos los asistentes."
                    className={`w-full px-4 py-2.5 rounded-xl border outline-none transition-all ${
                      darkMode ? 'bg-slate-955 border-slate-800 focus:border-sky-505 text-slate-100' : 'bg-slate-50 border-slate-210 focus:border-sky-505 text-slate-800'
                    }`}
                  />
                </div>
              </div>

              <div className="flex justify-end pt-2">
                <button
                  type="submit"
                  className="w-full inline-flex items-center justify-center px-4 py-2.5 border border-transparent rounded-xl text-xs font-semibold text-white bg-gradient-to-r from-indigo-500 to-pink-650 hover:opacity-95 transform hover:-translate-y-0.5 transition-all cursor-pointer"
                >
                  Asignar Sponsor
                </button>
              </div>
            </form>
          </div>

          {/* Citizen managing directory lists */}
          <div className={`p-6 rounded-2xl border ${
            darkMode ? 'bg-slate-900/40 border-slate-800' : 'bg-white border-slate-205'
          }`}>
            <h3 className="font-display font-medium text-sm text-slate-950 dark:text-slate-100 uppercase tracking-wider mb-4 pb-2 bg-gradient-to-r from-indigo-501 to-pink-400 bg-clip-text text-transparent">
              {t('user_management')}
            </h3>

            <div className="space-y-3">
              {simulatedCitizens.map((c, i) => (
                <div 
                  key={i}
                  className={`flex justify-between items-center p-3 rounded-xl border text-xs ${
                    darkMode ? 'bg-slate-950/80 border-slate-805' : 'bg-slate-50 border-slate-200'
                  }`}
                >
                  <div>
                    <strong className="block font-semibold text-slate-900 dark:text-slate-200">{c.name}</strong>
                    <span className="text-[10px] text-slate-450">{c.email}</span>
                  </div>
                  <div className="text-right">
                    <span className="text-[9px] font-mono font-bold px-1.5 py-0.5 rounded bg-sky-500/10 text-sky-400 uppercase border border-sky-450/15">
                      {c.role}
                    </span>
                    <p className="text-[9px] text-slate-400 font-medium mt-1">{c.registered}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>

    </section>
  );
}
