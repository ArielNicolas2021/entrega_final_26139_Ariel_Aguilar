import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/outline";

export const PaginationControls = ({
  meta,
  onPageChange,
  onSizeChange,
  disabled = false,
}) => {
  const { page, size, totalElements, totalPages, first, last } = meta;

  const from = totalElements === 0 ? 0 : page * size + 1;
  const to = Math.min((page + 1) * size, totalElements);

  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 px-6 py-4 border-t border-secondary bg-bg-card text-xs text-text-muted">
      <div className="flex items-center gap-3">
        <span>
          Mostrando <strong className="text-text-main">{from}</strong>–
          <strong className="text-text-main">{to}</strong> de{" "}
          <strong className="text-text-main">{totalElements}</strong>{" "}
          registros
        </span>

        {onSizeChange && (
          <select
            aria-label="Registros por página"
            value={size}
            disabled={disabled}
            onChange={(e) => onSizeChange(Number(e.target.value))}
            className="rounded-lg border border-secondary bg-bg-card px-2 py-1 text-xs font-medium text-text-main focus:border-primary focus:outline-none"
          >
            {[10, 20, 50, 100].map((opt) => (
              <option key={opt} value={opt} className="bg-bg-card text-text-main">
                {opt} / pág.
              </option>
            ))}
          </select>
        )}
      </div>

      <div className="flex items-center gap-2 self-end sm:self-auto">
        <button
          type="button"
          onClick={() => onPageChange(page - 1)}
          disabled={disabled || first || page <= 0}
          aria-label="Página anterior"
          className="inline-flex items-center gap-1 rounded-lg border border-secondary bg-bg-card px-3 py-1.5 font-medium text-text-main hover:bg-secondary disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
        >
          <ChevronLeftIcon className="h-3.5 w-3.5" />
          Anterior
        </button>

        <span className="px-2 font-medium text-text-main tabular-nums">
          Página {page + 1} de {totalPages}
        </span>

        <button
          type="button"
          onClick={() => onPageChange(page + 1)}
          disabled={disabled || last || page + 1 >= totalPages}
          aria-label="Página siguiente"
          className="inline-flex items-center gap-1 rounded-lg border border-secondary bg-bg-card px-3 py-1.5 font-medium text-text-main hover:bg-secondary disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
        >
          Siguiente
          <ChevronRightIcon className="h-3.5 w-3.5" />
        </button>
      </div>
    </div>
  );
};