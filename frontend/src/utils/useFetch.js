const API_URL = "https://talento-tech-gestion-comercial.onrender.com/api/";

export const useFetch = async (endpoint, method, body) => {

  const response = await fetch(API_URL + endpoint, {
    method,
    headers: { "Content-Type": "application/json" },
    ...(body && {
      body: JSON.stringify(body)
    })
  });

  const data = await response.json();
  return data;
};
