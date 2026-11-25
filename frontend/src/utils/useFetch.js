const API_URL = "http://localhost:8080/api/";

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
