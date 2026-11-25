/**
 * Devuelve una fecha en formato LocalDateTime ("YYYY-MM-DDTHH:mm:ss")
 * usando la zona horaria local del navegador (sin Z ni milisegundos).
 *
 * Acepta:
 * - Nada / new Date(): usa la fecha y hora actual
 * - String de <input type="datetime-local"> ("2026-10-15T18:30") -> "2026-10-15T18:30:00"
 * - String de <input type="date"> ("2026-10-15") -> combina con la hora actual
 */
export const toLocalDateTimeString = (input = new Date()) => {
  if (typeof input === "string") {
    const trimmed = input.trim();
    // Si viene de <input type="datetime-local"> ("YYYY-MM-DDTHH:mm")
    if (/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/.test(trimmed)) {
      return `${trimmed}:00`;
    }
    // Si ya tiene segundos ("YYYY-MM-DDTHH:mm:ss")
    if (/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}$/.test(trimmed)) {
      return trimmed;
    }
    // Si viene solo fecha ("YYYY-MM-DD"), le adjuntamos la hora actual
    if (/^\d{4}-\d{2}-\d{2}$/.test(trimmed)) {
      const now = new Date();
      const hh = String(now.getHours()).padStart(2, "0");
      const mm = String(now.getMinutes()).padStart(2, "0");
      const ss = String(now.getSeconds()).padStart(2, "0");
      return `${trimmed}T${hh}:${mm}:${ss}`;
    }
  }

  const date = input instanceof Date ? input : new Date(input);
  if (Number.isNaN(date.getTime())) return null;

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  const seconds = String(date.getSeconds()).padStart(2, "0");

  return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}`;
};