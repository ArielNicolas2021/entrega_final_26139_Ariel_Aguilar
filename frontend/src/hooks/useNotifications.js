import { useState, useEffect, useCallback, useMemo } from "react";
import { useFetch as fetchData } from "../utils/useFetch.js";
import { extractList } from "../utils/pagination.js";

export const useNotifications = ({ pollIntervalMs = 60000 } = {}) => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadNotifications = useCallback(async () => {
    const response = await fetchData("notificaciones?size=50", "GET");
    const items = extractList(response);

    const sorted = [...items].sort(
      (a, b) => new Date(b.fechaCreacion) - new Date(a.fechaCreacion)
    );
    setNotifications(sorted);
    setLoading(false);
  }, []);

  useEffect(() => {
    loadNotifications();

    if (!pollIntervalMs) return;
    const interval = setInterval(loadNotifications, pollIntervalMs);
    return () => clearInterval(interval);
  }, [loadNotifications, pollIntervalMs]);

  const unreadCount = useMemo(
    () => notifications.filter((n) => !n.leida).length,
    [notifications]
  );

  // Marca una notificación individual como leída con actualización optimista
  const markAsRead = useCallback(async (id) => {
    setNotifications((prev) =>
      prev.map((item) => (item.id === id ? { ...item, leida: true } : item))
    );

    await fetchData(`notificaciones/${id}/leer`, "PATCH");
  }, []);

  // Marca todas las no leídas
  const markAllAsRead = useCallback(async () => {
    const unreadIds = notifications.filter((n) => !n.leida).map((n) => n.id);
    if (unreadIds.length === 0) return;

    setNotifications((prev) => prev.map((item) => ({ ...item, leida: true })));

    await Promise.all(
      unreadIds.map((id) => fetchData(`notificaciones/${id}/leer`, "PATCH"))
    );
  }, [notifications]);

  return {
    notifications,
    unreadCount,
    loading,
    refetch: loadNotifications,
    markAsRead,
    markAllAsRead,
  };
};