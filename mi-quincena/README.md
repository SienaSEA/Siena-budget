# Mi Quincena — control de gastos

App de control de gastos quincenal (corte el 15 y el último día de cada
mes), con login (usuario y contraseña) y datos guardados en la nube para
entrar desde cualquier dispositivo. La usan 3 personas, cada quien con
su propia cuenta y sus datos completamente aislados entre sí.

- **Frontend**: React + Vite, CSS plano (sin framework), Recharts para gráficas.
- **Login**: Netlify Identity (correo + contraseña, con verificación por email).
- **Guardado de datos**: Netlify Blobs — una función serverless guarda tu
  información ligada a tu cuenta; nadie más puede ver ni editar tus datos.
- **Instalable como app (PWA)**: ícono propio, funciona sin internet con
  lo último que cargaste.

No necesitas contratar ni pagar una base de datos aparte: todo corre
dentro de Netlify.

---

## 1. Sube el proyecto a GitHub

1. Crea un repositorio nuevo en [github.com](https://github.com) (puede ser privado).
2. Sube esta carpeta completa (sin `node_modules` ni `dist`, no hacen falta).
   Si tienes Git instalado:
   ```bash
   cd mi-quincena
   git init
   git add .
   git commit -m "Primera versión"
   git branch -M main
   git remote add origin https://github.com/TU-USUARIO/TU-REPO.git
   git push -u origin main
   ```

## 2. Conecta el repo a Netlify

1. Entra a [app.netlify.com](https://app.netlify.com) y crea una cuenta gratis si no tienes.
2. **Add new site → Import an existing project → Deploy with GitHub**.
3. Elige el repositorio que acabas de subir.
4. **Importante si el proyecto quedó dentro de una subcarpeta del repo**
   (por ejemplo `mi-quincena/`): antes de desplegar, en las opciones de
   build pon **Base directory** = `mi-quincena` (o el nombre de tu
   subcarpeta). Si no, Netlify intenta construir desde la raíz vacía del
   repo y el build falla o publica algo en blanco.
5. Netlify va a detectar el resto solo desde `netlify.toml`: build
   command `npm run build`, carpeta publicada `dist`, funciones en
   `netlify/functions`. Da clic en **Deploy**.
6. Espera a que termine — te dará una URL tipo
   `https://algun-nombre-al-azar.netlify.app`. Puedes cambiarla luego en
   **Site settings → Domain management**.

## 3. Variables de entorno (para que Netlify Blobs funcione)

En **Site configuration → Environment variables**, agrega:

- `BLOBS_TOKEN`: un Personal Access Token de tu cuenta de Netlify
  (User settings → Applications → Personal access tokens → New access token).
- `SITE_ID_MANUAL`: el Site ID de tu sitio (Site configuration → General → Site details).

Esto es un workaround para un bug de Netlify donde el entorno de Blobs no
siempre se inyecta automáticamente en la función — con estas dos
variables, `netlify/functions/data.cjs` las usa explícitamente en vez de
depender de la inyección automática.

## 4. Activa el login (Netlify Identity)

1. En tu sitio dentro de Netlify: **Site configuration → Identity → Enable Identity**.
2. En **Identity → Registration**, cambia la opción a **Invite only**
   (así nadie más puede crear una cuenta sin que tú lo invites).
3. Regresa a la pestaña **Identity** y da clic en **Invite users**.
   Escribe tu correo y envíalo.
4. Revisa tu bandeja de entrada: te llegará un correo de Netlify con un
   enlace para **crear tu contraseña**.
5. Al abrir el enlace, te pedirá elegir una contraseña — con eso ya
   tienes tu usuario y contraseña listos.

## 5. Entra a tu app

1. Abre la URL de tu sitio.
2. Da clic en **Iniciar sesión / Crear cuenta** y entra con tu correo y contraseña.
3. La primera vez, arrancas con la lista de categorías vacía — agrega las
   tuyas desde la pestaña Categorías. A partir de ahí, todo lo que
   captures se guarda en la nube bajo tu cuenta.
4. Puedes repetir el proceso desde tu celular, otra computadora, etc. —
   con el mismo correo y contraseña vas a ver siempre la misma información.
5. En el navegador (celular o compu), busca la opción "Agregar a
   pantalla de inicio" / "Instalar app" para tenerla como una app de
   verdad, con su propio ícono.

## Cambiar quién puede entrar

Si más adelante quieres dar acceso a alguien más, repite el paso 4.3
(**Invite users**) con su correo — cada quien tendrá su propio usuario,
contraseña, y sus propios datos guardados por separado (no se mezclan
entre cuentas).

---

## Desarrollo y prueba local (sin gastar créditos de Netlify)

### Vista previa rápida (recomendado para revisar cambios visuales)

```bash
npm install
npm run dev
```

Abre `http://localhost:5173`. Este modo **salta el login automáticamente**
y usa **datos de ejemplo en memoria** (nada se guarda de verdad) — es solo
para ver cómo se ve y se siente la app sin gastar créditos de Netlify ni
necesitar el CLI. Funciona así porque `App.jsx` revisa
`import.meta.env.DEV` (una bandera que Vite activa solo con `npm run dev`
y que nunca existe en el build de producción — no afecta el sitio real).

### Vista completa con login y guardado real (requiere Netlify CLI)

```bash
npm install -g netlify-cli   # o "npm install netlify-cli" sin -g si no tienes permisos de administrador
netlify login                # o "npx netlify login" si lo instalaste sin -g
netlify link                 # conecta esta carpeta con tu sitio ya desplegado
netlify dev                  # levanta todo en http://localhost:8888
```

Nota: en computadoras de trabajo con seguridad corporativa estricta
(ej. Santa/allowlisting en Mac), `netlify dev` puede bloquearse porque usa
Deno por dentro. Si eso pasa, usa la vista previa rápida de arriba.

---

## Estructura del proyecto

```
mi-quincena/
├─ src/
│  ├─ App.jsx          → toda la app: Resumen, Tabla, Categorías, Metas
│  ├─ dataClient.js     → llama a la función serverless para leer/guardar
│  ├─ index.css         → estilos (tema claro)
│  └─ main.jsx          → punto de entrada, registra el service worker
├─ netlify/functions/
│  ├─ data.cjs           → guarda/lee tu JSON en Netlify Blobs, por usuario
│  └─ ping.cjs            → función de diagnóstico
├─ public/
│  ├─ manifest.webmanifest, sw.js → PWA (instalable, funciona offline)
│  └─ icon-192.png, icon-512.png, apple-touch-icon.png, favicon.svg → ícono "MQ"
├─ netlify.toml          → build, base directory, headers
└─ index.html            → incluye el widget de Netlify Identity
```

---

## Modelo de datos

Todo se guarda como un solo JSON por usuario en Netlify Blobs:

```js
{
  categorias: [ { id, nombre, tipo, presupuesto, cuentaIngreso, esNomina } ],
  movimientos: [ { id, fecha, categoria, monto, notas, createdAt } ],
  metas: [ { id, nombre, montoObjetivo, categoria, montoManual, plazoQuincenas, creadaQuincena } ],
  padding: 4
}
```

- **Categorías** — `tipo`: `Ingreso | Vale | Gasto | Ahorro`. `cuentaIngreso`
  (solo Ingreso) excluye esa categoría del "Ingreso total" si es `false`.
  `esNomina` marca cuál Ingreso es tu sueldo principal (se asigna con ⭐ en
  Categorías) — de ahí sale "Libre", sin depender del nombre de la categoría.
- **Movimientos** — un monto en una categoría en una quincena. `notas` se
  edita manteniendo presionado el monto en la Tabla. `createdAt` alimenta
  el bloque "Recién agregado" del Resumen.
- **Metas** — se puede vincular a una categoría de Ahorro (avance
  automático) o llevar manual. Con `plazoQuincenas` + `creadaQuincena`,
  la app recomienda cuánto ahorrar por quincena para llegar a tiempo.

### Fórmulas clave

| Término | Cálculo |
|---|---|
| Gasto Seguro | TODOS los movimientos de tipo Gasto + tipo Ahorro de la quincena (sin excepciones) |
| Libre | Nómina (categoría marcada ⭐) − Gasto Seguro |
| Balance | Ingreso (que cuenta) − Gasto − Ahorro |
| Racha | Quincenas seguidas con al menos un movimiento, contando hacia atrás desde hoy |

---

## Sistema visual

Tema claro con paleta restringida — el color solo se usa donde hay una
señal financiera real:

- Fondo `#FBFAF8` · tarjetas `#FFFFFF` · bordes `#E8E6E0`
- Texto principal `#1A1D21` · secundario `#6B6B64` · tenue `#9C9C96`
- **Verde `#16A34A`** = positivo/bien · **Rojo `#DC2626`** = negativo/excedido · **Ámbar `#D97706`** = advertencia
- Todo lo demás (tipos de categoría, iconos decorativos) es gris neutro a propósito.

---

## Pendientes conocidos (decisiones tomadas, no descuidos)

- **Notificaciones push reales**: necesitan función programada + VAPID +
  guardar suscripciones (consume créditos incluso sin uso). Por ahora hay
  un recordatorio dentro de la app en su lugar.
- **Cola offline**: si editas sin internet, ves el aviso pero el cambio
  no se reintenta solo — hay que repetirlo cuando vuelva la señal.
- **Rollover de presupuesto** entre quincenas: no implementado.
- **Estilo del popup de login de Netlify**: vive en un iframe aislado, no
  se puede tocar con CSS propio sin forkear el widget completo — se
  decidió que no vale la pena para 3 usuarios.

## Errores ya resueltos (por si se repiten)

- **502 al guardar** → tres causas apiladas: `.js` interpretado como ESM
  (renombrar a `.cjs`), `@netlify/blobs` v11 pide Node muy nuevo (fijar en
  `^10.7.13`), y falta `connectLambda(event)` al inicio del handler.
- **"No changes detected in base directory"** → casi siempre el commit se
  subió a la ruta equivocada del repo.
- **Página no responde a clics tras iniciar sesión** → el widget de
  Identity deja un iframe invisible encima; se oculta con un
  `MutationObserver` en `App.jsx`.
