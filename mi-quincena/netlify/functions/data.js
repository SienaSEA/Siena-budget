// Función serverless: guarda y devuelve el JSON de un usuario logueado.
// Requiere que Netlify Identity esté habilitado en el sitio — Netlify
// rellena automáticamente `context.clientContext.user` cuando la petición
// trae un token válido de Identity en el header Authorization.

const { getStore } = require("@netlify/blobs");

exports.handler = async (event, context) => {
  const user = context.clientContext && context.clientContext.user;

  if (!user) {
    return {
      statusCode: 401,
      body: JSON.stringify({ error: "No autorizado. Inicia sesión primero." }),
    };
  }

  const store = getStore("mi-quincena-data");
  const key = `usuario-${user.sub}.json`;

  try {
    if (event.httpMethod === "GET") {
      const data = await store.get(key, { type: "json" });
      return {
        statusCode: 200,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ data: data || null }),
      };
    }

    if (event.httpMethod === "POST") {
      const payload = JSON.parse(event.body || "{}");
      await store.setJSON(key, payload);
      return {
        statusCode: 200,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ok: true }),
      };
    }

    return { statusCode: 405, body: "Método no permitido" };
  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Error del servidor", detail: String(err) }),
    };
  }
};
