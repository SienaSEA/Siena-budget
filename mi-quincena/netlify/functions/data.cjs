// Función serverless: guarda y devuelve el JSON de un usuario logueado.
// Requiere que Netlify Identity esté habilitado en el sitio — Netlify
// rellena automáticamente `context.clientContext.user` cuando la petición
// trae un token válido de Identity en el header Authorization.

const { getStore, connectLambda } = require("@netlify/blobs");

exports.handler = async (event, context) => {
  try {
    // Necesario en este formato de función ("Lambda compatibility mode")
    // para que @netlify/blobs sepa en qué sitio y contexto está corriendo.
    connectLambda(event);

    const user = context.clientContext && context.clientContext.user;
    if (!user) {
      return {
        statusCode: 401,
        body: JSON.stringify({ error: "No autorizado. Inicia sesión primero." }),
      };
    }

    // Workaround para un bug conocido de Netlify donde el entorno de Blobs
    // no siempre se inyecta automáticamente en la función. Si configuraste
    // las variables de entorno SITE_ID_MANUAL y BLOBS_TOKEN, las usamos
    // explícitamente; si no, dependemos de la configuración automática.
    const siteID = process.env.SITE_ID_MANUAL || process.env.SITE_ID;
    const token = process.env.BLOBS_TOKEN;
    const store = siteID && token
      ? getStore({ name: "mi-quincena-data", siteID, token })
      : getStore("mi-quincena-data");

    const key = `usuario-${user.sub}.json`;

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
      body: JSON.stringify({ error: "Error del servidor", detail: String(err && err.message || err) }),
    };
  }
};
