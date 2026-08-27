const API_URL = "http://localhost:8080";

export const useFetch = async (endpoint, method, body) => {
  const token = localStorage.getItem("token");

  const response = await fetch(API_URL + endpoint, {
    method,
    headers: {
      "Content-Type": "application/json",
      ...(token && {
        Authorization: `Bearer ${token}`
      })
    },
    ...(body && {
      body: JSON.stringify(body)
    })
  });

  const data = await response.json();
  return data;
};
