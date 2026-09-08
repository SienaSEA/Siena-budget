// Función mínima de diagnóstico: no usa @netlify/blobs para nada.
// Si esta función también da 502, el problema NO es Blobs sino algo
// más general con cómo se están desplegando/corriendo las funciones.
// Si esta función SÍ responde bien, confirmamos que el problema es
// específicamente @netlify/blobs.

exports.handler = async (event, context) => {
  const user = context.clientContext && context.clientContext.user;
  return {
    statusCode: 200,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      ok: true,
      mensaje: "La función básica sí responde.",
      usuarioLogueado: user ? user.email : null,
      nodeVersion: process.version,
    }),
  };
};
