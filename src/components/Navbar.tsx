import { useState } from 'react';
import { Globe, Moon, Sun, User, LogOut, Award, Star, Shield, Users, Menu, X } from 'lucide-react';
import { transKeys, LangType } from '../translations';
import { User as UserType } from '../types';

interface NavbarProps {
  currentLang: LangType;
  setLang: (lang: LangType) => void;
  darkMode: boolean;
  setDarkMode: (dark: boolean) => void;
  currentUser: UserType | null;
  setCurrentUser: (user: UserType | null) => void;
  onOpenLogin: () => void;
  onOpenMyReviews: () => void;
  onOpenProfile: () => void;
  onOpenSearch: () => void;
  activeSection: string;
  setActiveSection: (sec: string) => void;
}

export default function Navbar({
  currentLang,
  setLang,
  darkMode,
  setDarkMode,
  currentUser,
  setCurrentUser,
  onOpenLogin,
  onOpenMyReviews,
  onOpenProfile,
  onOpenSearch,
  activeSection,
  setActiveSection
}: NavbarProps) {
  const [langOpen, setLangOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const t = (key: keyof typeof transKeys['es']) => {
    return transKeys[currentLang]?.[key] || transKeys['es'][key] || key;
  };

  const menuItems = [
    { id: 'inicio', label: t('nav_home') },
    { id: 'eventos', label: t('nav_events') },
    { id: 'social', label: t('nav_social') },
    { id: 'dashboard', label: t('nav_dashboard') },
    { id: 'proveedores', label: t('nav_providers') }
  ];

  const handleScrollTo = (id: string) => {
    setActiveSection(id);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <nav className={`sticky top-0 z-50 backdrop-blur-md border-b transition-colors duration-300 ${
      darkMode 
        ? 'bg-slate-900/90 border-slate-800 text-slate-100' 
        : 'bg-white/90 border-slate-200 text-slate-800'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex-shrink-0 flex items-center cursor-pointer" onClick={() => handleScrollTo('inicio')}>
            <Award className="h-6 w-6 text-sky-400 mr-2 animate-pulse" />
            <span className="font-display font-bold text-xl bg-gradient-to-r from-sky-400 via-indigo-400 to-pink-500 bg-clip-text text-transparent hover:opacity-90 transition-opacity">
              SmartEvents
            </span>
            <span className="ml-1.5 text-[9px] font-mono px-1.5 py-0.5 rounded bg-sky-500/10 text-sky-400 border border-sky-500/20 uppercase tracking-widest hidden sm:inline-block">
              MUNICIPAL v2.0
            </span>
          </div>

          {/* Links for desktop */}
          <div className="hidden md:flex items-center space-x-1">
            {menuItems.map((item) => (
              <button
                key={item.id}
                onClick={() => handleScrollTo(item.id)}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  activeSection === item.id 
                    ? 'bg-sky-500/10 text-sky-400 font-semibold' 
                    : 'hover:bg-slate-500/5 hover:text-sky-400'
                }`}
              >
                {item.label}
              </button>
            ))}
            
            {currentUser && (currentUser.role === 'admin' || currentUser.role === 'organizer') && (
              <button
                onClick={() => handleScrollTo('admin')}
                className={`px-3 py-2 rounded-lg text-sm font-medium flex items-center transition-all duration-200 ${
                  activeSection === 'admin' 
                    ? 'bg-indigo-500/10 text-indigo-400 font-semibold border border-indigo-500/25' 
                    : 'text-indigo-400 hover:bg-indigo-500/5'
                }`}
              >
                <Shield className="h-4 w-4 mr-1" />
                Admin
              </button>
            )}
          </div>

          {/* Mobile hamburger */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden p-2 rounded-lg transition-colors"
            aria-label="Menú de navegación"
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>

          {/* Right Action buttons */}
          <div className="flex items-center space-x-3">
            {/* Find People Shortcut */}
            <button
              onClick={onOpenSearch}
              aria-label={t('search_people')}
              className={`p-2 rounded-lg transition-colors ${
                darkMode ? 'hover:bg-slate-800 text-slate-400 hover:text-slate-200' : 'hover:bg-slate-100 text-slate-600 hover:text-slate-800'
              }`}
            >
              <Users className="h-5 w-5" />
            </button>

            {/* Language Selector */}
            <div className="relative">
              <button
                onClick={() => setLangOpen(!langOpen)}
                className={`p-2 rounded-lg flex items-center transition-colors ${
                  darkMode ? 'hover:bg-slate-800 text-slate-400 hover:text-slate-200' : 'hover:bg-slate-100 text-slate-600'
                }`}
                aria-label="Cambiar idioma"
              >
                <Globe className="h-5 w-5 mr-1" />
                <span className="text-xs uppercase font-mono">{currentLang}</span>
              </button>
              {langOpen && (
                <div className={`absolute right-0 mt-2 w-32 rounded-lg shadow-lg border py-1 z-50 ${
                  darkMode ? 'bg-slate-800 border-slate-700 text-slate-200' : 'bg-white border-slate-200 text-slate-800'
                }`}>
                  <button
                    onClick={() => { setLang('es'); setLangOpen(false); }}
                    className="w-full text-left px-3 py-1.5 text-xs hover:bg-sky-500 hover:text-white flex items-center"
                  >
                    <span className="mr-1.5">🇨🇱</span> Español
                  </button>
                  <button
                    onClick={() => { setLang('en'); setLangOpen(false); }}
                    className="w-full text-left px-3 py-1.5 text-xs hover:bg-sky-500 hover:text-white flex items-center"
                  >
                    <span className="mr-1.5">🇺🇸</span> English
                  </button>
                  <button
                    onClick={() => { setLang('pt'); setLangOpen(false); }}
                    className="w-full text-left px-3 py-1.5 text-xs hover:bg-sky-500 hover:text-white flex items-center"
                  >
                    <span className="mr-1.5">🇧🇷</span> Português
                  </button>
                  <button
                    onClick={() => { setLang('fr'); setLangOpen(false); }}
                    className="w-full text-left px-3 py-1.5 text-xs hover:bg-sky-500 hover:text-white flex items-center"
                  >
                    <span className="mr-1.5">🇫🇷</span> Français
                  </button>
                  <button
                    onClick={() => { setLang('de'); setLangOpen(false); }}
                    className="w-full text-left px-3 py-1.5 text-xs hover:bg-sky-500 hover:text-white flex items-center"
                  >
                    <span className="mr-1.5">🇩🇪</span> Deutsch
                  </button>
                </div>
              )}
            </div>

            {/* Dark Mode toggle */}
            <button
              onClick={() => setDarkMode(!darkMode)}
              aria-label={darkMode ? 'Activar modo claro' : 'Activar modo oscuro'}
              className={`p-2 rounded-lg transition-colors ${
                darkMode ? 'hover:bg-slate-800 text-yellow-400' : 'hover:bg-slate-100 text-slate-500'
              }`}
            >
              {darkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </button>

            {/* Auth section */}
            {currentUser ? (
              <div className="flex items-center space-x-2">
                {/* Profile Button */}
                <button
                  onClick={onOpenProfile}
                  className={`hidden sm:flex items-center px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
                    darkMode 
                      ? 'bg-slate-800/80 border-slate-700 hover:bg-slate-850 text-slate-200' 
                      : 'bg-slate-50 border-slate-200 hover:bg-slate-105 text-slate-700'
                  }`}
                >
                  <img
                    src={currentUser.avatar_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200'}
                    alt={currentUser.name}
                    className="h-5 w-5 rounded-full object-cover mr-1.5 border border-sky-400"
                  />
                  <span className="max-w-[70px] truncate">{currentUser.name}</span>
                </button>

                {/* My Reviews Button */}
                <button
                  onClick={onOpenMyReviews}
                  title="Mis Reseñas"
                  className={`p-2 rounded-lg transition-colors ${
                    darkMode ? 'hover:bg-slate-800 text-yellow-400' : 'hover:bg-slate-105 text-yellow-500'
                  }`}
                >
                  <Star className="h-5 w-5 fill-current" />
                </button>

                {/* Quit */}
                <button
                  onClick={() => setCurrentUser(null)}
                  title={t('nav_logout')}
                  className={`p-2 rounded-lg transition-colors ${
                    darkMode ? 'hover:bg-red-500/10 text-red-400' : 'hover:bg-red-50 text-red-500'
                  }`}
                >
                  <LogOut className="h-5 w-5" />
                </button>
              </div>
            ) : (
              <button
                onClick={onOpenLogin}
                className="inline-flex items-center justify-center px-4 py-2 border border-transparent rounded-lg text-sm font-semibold text-white bg-gradient-to-r from-sky-500 to-indigo-600 hover:from-sky-450 hover:to-indigo-550 shadow-md shadow-sky-500/20 transform hover:-translate-y-0.5 transition-all cursor-pointer"
              >
                <User className="h-4 w-4 mr-1.5" />
                {t('nav_login')}
              </button>
            )}
          </div>
        </div>
      </div>

        {/* Mobile menu */}
        {mobileOpen && (
          <div className={`md:hidden border-t transition-all duration-200 ${
            darkMode ? 'border-slate-800 bg-slate-900/95' : 'border-slate-200 bg-white/95'
          }`}>
            <div className="px-4 py-3 space-y-1">
              {menuItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => { handleScrollTo(item.id); setMobileOpen(false); }}
                  className={`block w-full text-left px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                    activeSection === item.id
                      ? 'bg-sky-500/10 text-sky-400 font-semibold'
                      : 'hover:bg-slate-500/5 hover:text-sky-400'
                  }`}
                >
                  {item.label}
                </button>
              ))}
              {currentUser && (currentUser.role === 'admin' || currentUser.role === 'organizer') && (
                <button
                  onClick={() => { handleScrollTo('admin'); setMobileOpen(false); }}
                  className="block w-full text-left px-3 py-2.5 rounded-lg text-sm font-medium text-indigo-400 hover:bg-indigo-500/5"
                >
                  <Shield className="h-4 w-4 inline mr-1.5" />
                  Admin
                </button>
              )}
              <hr className={`my-2 ${darkMode ? 'border-slate-800' : 'border-slate-200'}`} />
              <button
                onClick={() => { onOpenSearch(); setMobileOpen(false); }}
                className="block w-full text-left px-3 py-2.5 rounded-lg text-sm font-medium hover:bg-slate-500/5"
              >
                <Users className="h-4 w-4 inline mr-1.5" />
                {t('search_people')}
              </button>
            </div>
          </div>
        )}
    </nav>
  );
}
