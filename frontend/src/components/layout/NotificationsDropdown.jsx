import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import {
  BellIcon,
  ExclamationTriangleIcon,
  InformationCircleIcon,
  CheckIcon,
  ArrowTopRightOnSquareIcon,
} from "@heroicons/react/24/outline";
import { useNotifications } from "../../hooks/useNotifications.js";

const formatRelativeTime = (isoDate) => {
  if (!isoDate) return "";
  const date = new Date(isoDate);
  const diffSeconds = Math.floor((Date.now() - date.getTime()) / 1000);

  if (diffSeconds < 60) return "Hace un momento";
  const diffMinutes = Math.floor(diffSeconds / 60);
  if (diffMinutes < 60) return `Hace ${diffMinutes} min`;
  const diffHours = Math.floor(diffMinutes / 60);
  if (diffHours < 24) return `Hace ${diffHours} h`;
  const diffDays = Math.floor(diffHours / 24);
  if (diffDays === 1) return "Ayer";
  if (diffDays < 7) return `Hace ${diffDays} días`;

  return date.toLocaleDateString("es-AR", {
    day: "2-digit",
    month: "short",
  });
};

const getTypeConfig = (tipo) => {
  switch (tipo) {
    case "STOCK_BAJO":
      return {
        Icon: ExclamationTriangleIcon,
        badgeClass:
          "bg-amber-500/15 text-amber-600 dark:text-amber-400 border-amber-500/25",
      };
    default:
      return {
        Icon: InformationCircleIcon,
        badgeClass: "bg-primary/10 text-primary border-primary/20",
      };
  }
};

export const NotificationsDropdown = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [filter, setFilter] = useState("all"); // "all" | "unread"
  const dropdownRef = useRef(null);
  const navigate = useNavigate();
  const prefersReducedMotion = useReducedMotion();

  const {
    notifications,
    unreadCount,
    loading,
    markAsRead,
    markAllAsRead,
  } = useNotifications();

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    const handleKeyDown = (e) => {
      if (e.key === "Escape") setIsOpen(false);
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  const visibleNotifications =
    filter === "unread"
      ? notifications.filter((n) => !n.leida)
      : notifications;

  const handleNotificationClick = (notif) => {
    if (!notif.leida) {
      markAsRead(notif.id);
    }
    if (notif.productoId) {
      setIsOpen(false);
      navigate(`/productos/editar-producto/${notif.productoId}`);
    }
  };

  return (
    <div ref={dropdownRef} className="relative">
      {/* Botón Campana */}
      <motion.button
        type="button"
        whileTap={prefersReducedMotion ? {} : { scale: 0.92 }}
        onClick={() => setIsOpen((prev) => !prev)}
        aria-expanded={isOpen}
        aria-haspopup="dialog"
        aria-label={
          unreadCount > 0
            ? `Notificaciones, ${unreadCount} sin leer`
            : "Notificaciones"
        }
        title="Notificaciones"
        className="p-2 rounded-lg text-text-muted hover:bg-secondary hover:text-text-main transition-colors relative focus:outline-none"
      >
        <BellIcon className="h-5 w-5" />
        {unreadCount > 0 && (
          <span className="absolute -top-0.5 -right-0.5 min-w-4.5 h-4.5 px-1 rounded-full bg-red-500 text-white text-[10px] font-bold flex items-center justify-center ring-2 ring-bg-card">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </motion.button>

      {/* Popover de Notificaciones */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            role="dialog"
            aria-label="Panel de notificaciones"
            initial={
              prefersReducedMotion
                ? { opacity: 1 }
                : { opacity: 0, y: 8, scale: 0.96 }
            }
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={
              prefersReducedMotion
                ? { opacity: 0 }
                : { opacity: 0, y: 6, scale: 0.96 }
            }
            transition={{ duration: 0.16, ease: "easeOut" }}
            className="absolute right-0 mt-2 w-80 sm:w-96 z-50 origin-top-right rounded-2xl border border-secondary bg-bg-card shadow-xl overflow-hidden"
          >
            {/* Cabecera */}
            <div className="px-4 py-3 border-b border-secondary flex items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-bold text-text-main">
                  Notificaciones
                </h3>
                {unreadCount > 0 && (
                  <span className="rounded-full bg-primary/10 px-2 py-0.5 text-[11px] font-semibold text-primary">
                    {unreadCount} nuevas
                  </span>
                )}
              </div>

              {unreadCount > 0 && (
                <button
                  type="button"
                  onClick={markAllAsRead}
                  className="inline-flex items-center gap-1 text-[11px] font-semibold text-primary hover:underline"
                >
                  <CheckIcon className="h-3.5 w-3.5" />
                  Marcar todas
                </button>
              )}
            </div>

            {/* Filtro rápido */}
            <div className="px-4 py-2 border-b border-secondary bg-bg-main/40 flex items-center gap-2">
              <button
                type="button"
                onClick={() => setFilter("all")}
                className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-colors ${filter === "all"
                  ? "bg-primary text-white"
                  : "text-text-muted hover:bg-secondary hover:text-text-main"
                  }`}
              >
                Todas ({notifications.length})
              </button>
              <button
                type="button"
                onClick={() => setFilter("unread")}
                className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-colors ${filter === "unread"
                  ? "bg-primary text-white"
                  : "text-text-muted hover:bg-secondary hover:text-text-main"
                  }`}
              >
                No leídas ({unreadCount})
              </button>
            </div>

            {/* Lista scrolleable */}
            <div className="max-h-96 overflow-y-auto divide-y divide-secondary">
              {loading ? (
                <div className="p-4 space-y-3 animate-pulse">
                  {Array.from({ length: 3 }).map((_, i) => (
                    <div key={i} className="flex gap-3">
                      <div className="h-9 w-9 rounded-xl bg-secondary shrink-0" />
                      <div className="flex-1 space-y-2">
                        <div className="h-3.5 w-24 rounded bg-secondary" />
                        <div className="h-3 w-full rounded bg-secondary" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : visibleNotifications.length === 0 ? (
                <div className="py-10 px-4 text-center">
                  <p className="text-xs font-medium text-text-main">
                    {filter === "unread"
                      ? "No tienes notificaciones sin leer"
                      : "Sin notificaciones por el momento"}
                  </p>
                  <p className="text-[11px] text-text-muted mt-1">
                    Aquí aparecerán las alertas de stock y actividad del sistema.
                  </p>
                </div>
              ) : (
                visibleNotifications.map((notif) => {
                  const { Icon, badgeClass } = getTypeConfig(notif.tipo);

                  return (
                    <div
                      key={notif.id}
                      onClick={() => handleNotificationClick(notif)}
                      role="button"
                      tabIndex={0}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === " ") {
                          e.preventDefault();
                          handleNotificationClick(notif);
                        }
                      }}
                      className={`px-4 py-3.5 flex items-start gap-3 transition-colors cursor-pointer ${notif.leida
                        ? "bg-bg-card hover:bg-bg-main/50"
                        : "bg-primary/[0.04] hover:bg-primary/[0.08]"
                        }`}
                    >
                      {/* Ícono por tipo */}
                      <div
                        className={`mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border ${badgeClass}`}
                      >
                        <Icon className="h-5 w-5" />
                      </div>

                      {/* Contenido */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2">
                          <p className="text-xs font-bold text-text-main truncate">
                            {notif.titulo}
                          </p>
                          <span className="text-[10px] text-text-muted shrink-0">
                            {formatRelativeTime(notif.fechaCreacion)}
                          </span>
                        </div>

                        <p className="text-xs text-text-muted mt-0.5 leading-relaxed">
                          {notif.mensaje}
                        </p>

                        {notif.productoNombre && (
                          <div className="mt-2 inline-flex items-center gap-1 rounded-md border border-secondary bg-bg-main px-2 py-0.5 text-[11px] font-medium text-primary">
                            <span>Ver {notif.productoNombre}</span>
                            <ArrowTopRightOnSquareIcon className="h-3 w-3" />
                          </div>
                        )}
                      </div>

                      {/* Punto indicador de no leída */}
                      {!notif.leida && (
                        <span
                          aria-label="Sin leer"
                          className="mt-2 h-2 w-2 rounded-full bg-primary shrink-0"
                        />
                      )}
                    </div>
                  );
                })
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};