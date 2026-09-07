// Habla con netlify/functions/data.js, que guarda un JSON por usuario
// en Netlify Blobs. Cada llamada manda el token de Netlify Identity
// para que la función sepa quién eres.

async function authHeader() {
  const user = window.netlifyIdentity && window.netlifyIdentity.currentUser();
  if (!user) throw new Error("No hay sesión activa");
  const token = await user.jwt(); // refresca el token si ya expiró
  return { Authorization: `Bearer ${token}` };
}

export async function loadData() {
  const headers = await authHeader();
  const res = await fetch("/.netlify/functions/data", { headers });
  if (res.status === 401) throw new Error("401");
  if (!res.ok) throw new Error(`Error al cargar datos (${res.status})`);
  const body = await res.json();
  return body.data; // null si el usuario todavía no tiene nada guardado
}

export async function saveData(data) {
  const headers = await authHeader();
  const res = await fetch("/.netlify/functions/data", {
    method: "POST",
    headers: { ...headers, "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error(`Error al guardar datos (${res.status})`);
  return true;
}
