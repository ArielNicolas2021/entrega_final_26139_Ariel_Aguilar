import { useState, useEffect } from "react";
import { useLocation, Link } from "react-router-dom";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import {
  Squares2X2Icon,
  CircleStackIcon,
  ShoppingCartIcon,
  ChevronDownIcon,
  TagIcon,
  BuildingStorefrontIcon,
  ShoppingBagIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";

const GESTION_ITEMS = [
  { to: "/productos", label: "Productos", Icon: ShoppingBagIcon },
  { to: "/categorias", label: "Categorías", Icon: TagIcon },
  { to: "/marcas", label: "Marcas", Icon: BuildingStorefrontIcon },
];

export const Sidebar = ({ isOpen, onClose }) => {
  const location = useLocation();
  const prefersReducedMotion = useReducedMotion();

  const isActive = (path) => {
    if (path === "/" || path === "/dashboard") {
      return location.pathname === "/" || location.pathname === "/dashboard";
    }
    return location.pathname.startsWith(path);
  };

  const isGestionActive = GESTION_ITEMS.some((item) =>
    location.pathname.startsWith(item.to)
  );

  const [isGestionOpen, setIsGestionOpen] = useState(isGestionActive);

  useEffect(() => {
    if (isGestionActive) {
      setIsGestionOpen(true);
    }
  }, [location.pathname, isGestionActive]);

  // Cerrar drawer móvil con Escape
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e) => {
      if (e.key === "Escape" && onClose) onClose();
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  const handleLinkClick = () => {
    if (onClose) onClose();
  };

  return (
    <>
      {/* Overlay oscuro animado para móviles */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
            aria-hidden="true"
            className="fixed inset-0 z-40 bg-gray-900/50 backdrop-blur-sm lg:hidden"
          />
        )}
      </AnimatePresence>

      {/* Sidebar Drawer / Fixed */}
      <aside
        aria-label="Menú lateral principal"
        className={`fixed top-0 bottom-0 left-0 z-50 w-64 font-sans bg-bg-card border-r border-secondary flex flex-col p-4 select-none transition-transform duration-300 ease-in-out ${isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
          }`}
      >
        {/* Brand / Logo + Botón de cerrar móvil */}
        <div className="flex items-center justify-between px-3 py-4 mb-4 border-b border-secondary">
          <Link
            to="/"
            onClick={handleLinkClick}
            className="flex items-center gap-3 group"
          >
            <div className="h-9 w-9 rounded-xl bg-primary flex items-center justify-center text-white font-bold text-xl shadow-sm transition-transform group-hover:scale-105">
              GC
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-base text-text-main leading-tight">
                Gestión Comercial
              </span>
              <span className="text-xs text-text-muted">Talento Tech</span>
            </div>
          </Link>

          <button
            type="button"
            onClick={onClose}
            aria-label="Cerrar menú lateral"
            className="p-1 rounded-lg text-text-muted hover:bg-secondary hover:text-text-main lg:hidden transition-colors"
          >
            <XMarkIcon className="h-6 w-6" />
          </button>
        </div>

        {/* Navigation Menu */}
        <nav className="flex-1 space-y-1 overflow-y-auto">
          {/* Dashboard */}
          <Link
            to="/"
            onClick={handleLinkClick}
            aria-current={isActive("/dashboard") ? "page" : undefined}
            className={`relative w-full flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-sm font-medium transition-colors ${isActive("/dashboard")
                ? "text-white"
                : "text-text-muted hover:bg-secondary hover:text-text-main"
              }`}
          >
            {isActive("/dashboard") && (
              <motion.span
                layoutId="sidebar-primary-active"
                transition={
                  prefersReducedMotion
                    ? { duration: 0 }
                    : { type: "spring", stiffness: 380, damping: 32 }
                }
                className="absolute inset-0 rounded-lg bg-primary -z-10"
              />
            )}
            <Squares2X2Icon className="h-5 w-5 shrink-0" />
            <span>Dashboard</span>
          </Link>

          {/* Sección Gestión */}
          <div>
            <button
              type="button"
              aria-expanded={isGestionOpen}
              onClick={() => setIsGestionOpen((prev) => !prev)}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-lg text-sm font-medium transition-colors ${isGestionActive
                  ? "text-primary font-semibold"
                  : "text-text-muted hover:bg-secondary hover:text-text-main"
                }`}
            >
              <div className="flex items-center gap-3">
                <CircleStackIcon className="h-5 w-5 shrink-0" />
                <span>Gestión</span>
              </div>
              <motion.span
                animate={{ rotate: isGestionOpen ? 180 : 0 }}
                transition={{ duration: 0.2 }}
              >
                <ChevronDownIcon
                  className={`h-4 w-4 ${isGestionOpen ? "text-primary" : ""}`}
                />
              </motion.span>
            </button>

            <AnimatePresence initial={false}>
              {isGestionOpen && (
                <motion.div
                  initial={
                    prefersReducedMotion
                      ? { opacity: 1 }
                      : { height: 0, opacity: 0 }
                  }
                  animate={{ height: "auto", opacity: 1 }}
                  exit={
                    prefersReducedMotion
                      ? { opacity: 0 }
                      : { height: 0, opacity: 0 }
                  }
                  transition={{ duration: 0.2, ease: "easeInOut" }}
                  className="overflow-hidden"
                >
                  <div className="mt-1 ml-4 pl-3 border-l border-secondary space-y-1">
                    {GESTION_ITEMS.map(({ to, label, Icon }) => {
                      const active = isActive(to);
                      return (
                        <Link
                          key={to}
                          to={to}
                          onClick={handleLinkClick}
                          aria-current={active ? "page" : undefined}
                          className={`relative w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${active
                              ? "text-primary font-semibold"
                              : "text-text-muted hover:bg-secondary hover:text-text-main"
                            }`}
                        >
                          {active && (
                            <motion.span
                              layoutId="sidebar-subitem-active"
                              transition={
                                prefersReducedMotion
                                  ? { duration: 0 }
                                  : {
                                    type: "spring",
                                    stiffness: 400,
                                    damping: 34,
                                  }
                              }
                              className="absolute inset-0 rounded-lg bg-secondary -z-10"
                            />
                          )}
                          <Icon className="h-4 w-4 shrink-0" />
                          <span>{label}</span>
                        </Link>
                      );
                    })}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Ventas */}
          <Link
            to="/ventas"
            onClick={handleLinkClick}
            aria-current={isActive("/ventas") ? "page" : undefined}
            className={`relative w-full flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-sm font-medium transition-colors ${isActive("/ventas")
                ? "text-white"
                : "text-text-muted hover:bg-secondary hover:text-text-main"
              }`}
          >
            {isActive("/ventas") && (
              <motion.span
                layoutId="sidebar-primary-active"
                transition={
                  prefersReducedMotion
                    ? { duration: 0 }
                    : { type: "spring", stiffness: 380, damping: 32 }
                }
                className="absolute inset-0 rounded-lg bg-primary -z-10"
              />
            )}
            <ShoppingCartIcon className="h-5 w-5 shrink-0" />
            <span>Ventas</span>
          </Link>
        </nav>
      </aside>
    </>
  );
};