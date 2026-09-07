# Mi Quincena — control de gastos

App de control de gastos quincenal, con login (usuario y contraseña) y
tus datos guardados en la nube para poder entrar desde cualquier
dispositivo.

- **Frontend**: React + Vite.
- **Login**: Netlify Identity (correo + contraseña, con verificación por email).
- **Guardado de datos**: Netlify Blobs (una función serverless guarda tu
  información ligada a tu cuenta — nadie más puede ver ni editar tus datos).

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
4. Netlify va a detectar automáticamente la configuración (ya está en
   `netlify.toml`): build command `npm run build`, carpeta publicada `dist`,
   funciones en `netlify/functions`. Solo da clic en **Deploy**.
5. Espera a que termine el primer despliegue — te dará una URL tipo
   `https://algun-nombre-al-azar.netlify.app`. Puedes cambiarla luego en
   **Site settings → Domain management**.

## 3. Activa el login (Netlify Identity)

1. En tu sitio dentro de Netlify: **Site configuration → Identity → Enable Identity**.
2. En **Identity → Registration**, cambia la opción a **Invite only**
   (así nadie más puede crear una cuenta sin que tú lo invites — esta es
   tu "contraseña de entrada" al sistema).
3. Regresa a la pestaña **Identity** y da clic en **Invite users**.
   Escribe tu correo y envíalo.
4. Revisa tu bandeja de entrada: te llegará un correo de Netlify con un
   enlace para **crear tu contraseña**.
5. Al abrir el enlace, te pedirá elegir una contraseña — con eso ya
   tienes tu usuario y contraseña listos.

## 4. Entra a tu app

1. Abre la URL de tu sitio.
2. Verás la pantalla de login — da clic en **Iniciar sesión / Crear cuenta**
   y entra con el correo y la contraseña que configuraste.
3. La primera vez, la app carga tus categorías y movimientos de ejemplo
   automáticamente. A partir de ahí, todo lo que captures se guarda en la
   nube bajo tu cuenta.
4. Puedes repetir el proceso desde tu celular, otra computadora, etc. —
   con el mismo correo y contraseña vas a ver siempre la misma información.

---

## Desarrollo local (opcional)

Si quieres probar cambios en tu computadora antes de subirlos:

```bash
npm install
npm install -g netlify-cli   # solo la primera vez
netlify login
netlify dev
```

`netlify dev` levanta el frontend y las funciones juntos (incluyendo
Identity), en `http://localhost:8888`.

Si solo quieres ver el diseño sin login/funciones:

```bash
npm run dev
```

(en este modo el login y el guardado no van a funcionar, porque
necesitan Netlify).

---

## Estructura del proyecto

```
├─ src/
│  ├─ App.jsx          → toda la app (Resumen, Tabla, Categorías)
│  ├─ dataClient.js     → llama a la función serverless para leer/guardar
│  ├─ index.css         → estilos (tema oscuro)
│  └─ main.jsx
├─ netlify/
│  └─ functions/
│     └─ data.js        → guarda/lee tu JSON en Netlify Blobs, por usuario
├─ netlify.toml          → configuración de build y funciones
└─ index.html            → incluye el widget de Netlify Identity
```

## Cambiar quién puede entrar

Si más adelante quieres dar acceso a alguien más (por ejemplo tu pareja),
repite el paso 3.3 (**Invite users**) con su correo — cada quien tendrá su
propio usuario, contraseña, y sus propios datos guardados por separado.
