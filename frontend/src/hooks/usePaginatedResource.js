import { useState, useEffect, useCallback, useRef } from "react";
import { useFetch as fetchData } from "../utils/useFetch.js";
import { extractPageMeta } from "../utils/pagination.js";

const EMPTY_PARAMS = {};

export const usePaginatedResource = (resource, options = EMPTY_PARAMS) => {
  const initialPage = options.initialPage ?? 0;
  const initialSize = options.initialSize ?? 20;
  const extraParams = options.extraParams ?? EMPTY_PARAMS;

  const [page, setPage] = useState(initialPage);
  const [size, setSize] = useState(initialSize);
  const [data, setData] = useState([]);
  const [meta, setMeta] = useState({
    page: initialPage,
    size: initialSize,
    totalElements: 0,
    totalPages: 1,
    first: true,
    last: true,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refreshKey, setRefreshKey] = useState(0);

  // Guardamos los parámetros extra en una ref y solo actualizamos cuando su valor real cambia
  const extraParamsRef = useRef(extraParams);
  const serializedParams = JSON.stringify(extraParams);
  const prevSerializedRef = useRef(serializedParams);

  if (prevSerializedRef.current !== serializedParams) {
    prevSerializedRef.current = serializedParams;
    extraParamsRef.current = extraParams;
  }

  const refetch = useCallback(() => {
    setRefreshKey((k) => k + 1);
  }, []);

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      setLoading(true);
      setError(null);

      const searchParams = new URLSearchParams({
        page: String(page),
        size: String(size),
      });

      Object.entries(extraParamsRef.current).forEach(([key, val]) => {
        if (val !== undefined && val !== null && val !== "") {
          searchParams.set(key, String(val));
        }
      });

      const response = await fetchData(
        `${resource}?${searchParams.toString()}`,
        "GET"
      );

      if (cancelled) return;

      if (!response || response.error || response.status >= 400) {
        setError(response?.message || `Error al cargar ${resource}.`);
        setData([]);
        setLoading(false);
        return;
      }

      const parsed = extractPageMeta(response);
      setData(parsed.items);
      setMeta((prev) => {
        // Evita re-renders innecesarios si los metadatos son idénticos
        if (
          prev.page === parsed.page &&
          prev.size === parsed.size &&
          prev.totalElements === parsed.totalElements &&
          prev.totalPages === parsed.totalPages &&
          prev.first === parsed.first &&
          prev.last === parsed.last
        ) {
          return prev;
        }
        return {
          page: parsed.page,
          size: parsed.size,
          totalElements: parsed.totalElements,
          totalPages: parsed.totalPages,
          first: parsed.first,
          last: parsed.last,
        };
      });
      setLoading(false);
    };

    load();

    return () => {
      cancelled = true;
    };
  }, [resource, page, size, serializedParams, refreshKey]);

  const changePageSize = useCallback((newSize) => {
    setSize(newSize);
    setPage(0);
  }, []);

  return {
    data,
    meta,
    page,
    size,
    setPage,
    setSize: changePageSize,
    loading,
    error,
    refetch,
  };
};