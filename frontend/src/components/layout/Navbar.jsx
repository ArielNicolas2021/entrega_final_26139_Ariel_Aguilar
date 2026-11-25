import { useState, useEffect, useRef } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { NotificationsDropdown } from "./NotificationsDropdown.jsx";
import {
  Bars3Icon,
  MagnifyingGlassIcon,
  SunIcon,
  MoonIcon,
  ChevronDownIcon,
  UserIcon,
  Cog6ToothIcon,
  ArrowRightOnRectangleIcon,
} from "@heroicons/react/24/outline";

export const Navbar = ({ onOpenSidebar }) => {
  const [darkMode, setDarkMode] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [hasNotifications] = useState(true);

  const searchInputRef = useRef(null);
  const profileRef = useRef(null);
  const prefersReducedMotion = useReducedMotion();

  // Sincronizar tema inicial
  useEffect(() => {
    const isDarkStored = localStorage.getItem("theme") === "dark";
    const prefersDark = window.matchMedia(
      "(prefers-color-scheme: dark)"
    ).matches;

    if (isDarkStored || (!("theme" in localStorage) && prefersDark)) {
      setDarkMode(true);
      document.documentElement.classList.add("dark");
    } else {
      setDarkMode(false);
      document.documentElement.classList.remove("dark");
    }
  }, []);

  // Atajo de teclado Ctrl/Cmd + K para enfocar buscador y Escape para cerrar menús
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        searchInputRef.current?.focus();
      }
      if (e.key === "Escape") {
        setIsProfileOpen(false);
      }
    };

    const handleClickOutside = (e) => {
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setIsProfileOpen(false);
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const toggleDarkMode = () => {
    if (darkMode) {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
      setDarkMode(false);
    } else {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
      setDarkMode(true);
    }
  };

  return (
    <header className="h-16 w-full font-sans bg-bg-card border-b border-secondary px-4 sm:px-6 flex items-center justify-between gap-3 sticky top-0 z-30 transition-colors">
      {/* Izquierda: Botón Hamburguesa (Móvil) + Buscador global */}
      <div className="flex items-center gap-3 flex-1 max-w-md">
        <button
          type="button"
          onClick={onOpenSidebar}
          className="p-2 rounded-lg text-text-muted hover:bg-secondary hover:text-text-main lg:hidden transition-colors"
          aria-label="Abrir menú de navegación"
        >
          <Bars3Icon className="h-6 w-6" />
        </button>

        <div className="relative w-full max-w-xs sm:max-w-sm">
          <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-text-muted">
            <MagnifyingGlassIcon className="h-4 w-4" />
          </span>
          <input
            ref={searchInputRef}
            type="text"
            aria-label="Buscar productos"
            placeholder="Buscar productos..."
            className="w-full rounded-lg border border-secondary bg-bg-main pl-9 pr-14 py-1.5 text-xs sm:text-sm text-text-main placeholder-text-muted focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary transition-all"
          />
          <kbd className="hidden sm:inline-flex absolute right-2.5 top-1/2 -translate-y-1/2 items-center gap-0.5 rounded border border-secondary bg-bg-card px-1.5 py-0.5 text-[10px] font-mono text-text-muted pointer-events-none">
            Ctrl K
          </kbd>
        </div>
      </div>

      {/* Derecha: Acciones */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Switch Dark / Light Mode animado */}
        <motion.button
          type="button"
          whileTap={prefersReducedMotion ? {} : { scale: 0.9 }}
          onClick={toggleDarkMode}
          className="relative p-2 rounded-lg text-text-muted hover:bg-secondary hover:text-text-main transition-colors focus:outline-none overflow-hidden"
          title={darkMode ? "Cambiar a modo claro" : "Cambiar a modo oscuro"}
          aria-label={darkMode ? "Cambiar a modo claro" : "Cambiar a modo oscuro"}
        >
          <AnimatePresence mode="wait" initial={false}>
            {darkMode ? (
              <motion.span
                key="sun"
                initial={
                  prefersReducedMotion
                    ? { opacity: 1 }
                    : { rotate: -90, opacity: 0, scale: 0.6 }
                }
                animate={{ rotate: 0, opacity: 1, scale: 1 }}
                exit={
                  prefersReducedMotion
                    ? { opacity: 0 }
                    : { rotate: 90, opacity: 0, scale: 0.6 }
                }
                transition={{ duration: 0.18, ease: "easeOut" }}
                className="block"
              >
                <SunIcon className="h-5 w-5 text-amber-500" />
              </motion.span>
            ) : (
              <motion.span
                key="moon"
                initial={
                  prefersReducedMotion
                    ? { opacity: 1 }
                    : { rotate: 90, opacity: 0, scale: 0.6 }
                }
                animate={{ rotate: 0, opacity: 1, scale: 1 }}
                exit={
                  prefersReducedMotion
                    ? { opacity: 0 }
                    : { rotate: -90, opacity: 0, scale: 0.6 }
                }
                transition={{ duration: 0.18, ease: "easeOut" }}
                className="block"
              >
                <MoonIcon className="h-5 w-5 text-text-muted" />
              </motion.span>
            )}
          </AnimatePresence>
        </motion.button>

        {/* Notificaciones */}
        <NotificationsDropdown />

        {/* Separador vertical */}
        <div className="h-6 w-px bg-secondary mx-1 hidden sm:block" />

        {/* Perfil de Usuario con Dropdown */}
        <div ref={profileRef} className="relative">
          <button
            type="button"
            aria-expanded={isProfileOpen}
            aria-haspopup="menu"
            onClick={() => setIsProfileOpen((prev) => !prev)}
            className="flex items-center gap-2.5 p-1 rounded-lg hover:bg-secondary transition-colors"
          >
            <img
              src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80"
              alt="Ariel Aguilar"
              className="h-8 w-8 sm:h-9 sm:w-9 rounded-full object-cover border border-secondary"
            />
            <div className="hidden md:flex flex-col text-left">
              <span className="text-xs font-semibold text-text-main leading-tight">
                Ariel Aguilar
              </span>
              <span className="text-[11px] text-text-muted leading-tight">
                Administrador
              </span>
            </div>
            <ChevronDownIcon
              className={`h-4 w-4 text-text-muted transition-transform duration-200 hidden sm:block ${isProfileOpen ? "rotate-180 text-primary" : ""
                }`}
            />
          </button>

          {/* Menú Desplegable Animado */}
          <AnimatePresence>
            {isProfileOpen && (
              <motion.div
                role="menu"
                initial={
                  prefersReducedMotion
                    ? { opacity: 1 }
                    : { opacity: 0, y: 6, scale: 0.96 }
                }
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={
                  prefersReducedMotion
                    ? { opacity: 0 }
                    : { opacity: 0, y: 4, scale: 0.96 }
                }
                transition={{ duration: 0.15, ease: "easeOut" }}
                className="absolute right-0 mt-2 w-48 z-50 origin-top-right rounded-xl border border-secondary bg-bg-card p-1 shadow-lg"
              >
                <div className="px-3 py-2 border-b border-secondary md:hidden">
                  <p className="text-xs font-semibold text-text-main">
                    Ariel Aguilar
                  </p>
                  <p className="text-[11px] text-text-muted">Administrador</p>
                </div>

                <button
                  type="button"
                  role="menuitem"
                  onClick={() => setIsProfileOpen(false)}
                  className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium text-text-muted hover:bg-secondary hover:text-text-main transition-colors"
                >
                  <UserIcon className="h-4 w-4" />
                  <span>Mi Perfil</span>
                </button>

                <button
                  type="button"
                  role="menuitem"
                  onClick={() => setIsProfileOpen(false)}
                  className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium text-text-muted hover:bg-secondary hover:text-text-main transition-colors"
                >
                  <Cog6ToothIcon className="h-4 w-4" />
                  <span>Configuración</span>
                </button>

                <div className="my-1 border-t border-secondary" />

                <button
                  type="button"
                  role="menuitem"
                  onClick={() => setIsProfileOpen(false)}
                  className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium text-red-600 hover:bg-red-500/10 transition-colors"
                >
                  <ArrowRightOnRectangleIcon className="h-4 w-4" />
                  <span>Cerrar Sesión</span>
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </header>
  );
};