/**
 * Extrae el array de ítems ya sea de una respuesta paginada de Spring Boot ({ content: [] })
 * o de un array plano ([]).
 */
export const extractList = (response) => {
  if (Array.isArray(response)) return response;
  if (response && Array.isArray(response.content)) return response.content;
  return [];
};

/**
 * Extrae los metadatos de paginación de Spring Data Page<T>.
 */
export const extractPageMeta = (response) => {
  const items = extractList(response);

  if (response && typeof response === "object" && Array.isArray(response.content)) {
    return {
      items,
      page: Number(response.pageable?.pageNumber ?? response.number ?? 0),
      size: Number(response.pageable?.pageSize ?? response.size ?? 20),
      totalElements: Number(response.totalElements ?? items.length),
      totalPages: Math.max(Number(response.totalPages ?? 1), 1),
      first: Boolean(response.first),
      last: Boolean(response.last),
    };
  }

  return {
    items,
    page: 0,
    size: items.length || 20,
    totalElements: items.length,
    totalPages: 1,
    first: true,
    last: true,
  };
};