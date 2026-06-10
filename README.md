# Mindless 🧠

> El segundo cerebro de la familia. Una PWA mobile-first que te quita carga mental: tareas, calendario, gastos y recordatorios inteligentes para toda la familia.

**En producción:** https://mindless-app.vercel.app

---

## 🚀 Empezar en 2 minutos (para el equipo)

No hay que instalar nada ni compilar nada. Es una web estática (HTML + CSS + JavaScript puro). Solo necesitas servir la carpeta con cualquier servidor estático y abrirla en el navegador.

### Opción A — Python (ya viene en cualquier Mac)

```bash
cd <carpeta-del-repo>
python3 -m http.server 8000
```

Abre 👉 http://localhost:8000

### Opción B — VS Code + Live Server

1. Instala la extensión **Live Server**.
2. Click derecho en `index.html` → **Open with Live Server**.

> **Importante:** sirve siempre desde la **raíz del repositorio**. La app detecta sola su ruta base, así que en local funciona en `/` y en producción (Vercel) también. No hace falta MAMP ni ninguna config especial.

---

## 🧱 Stack y filosofía

- **Vanilla JS (ES Modules)** — sin frameworks, sin paso de build, sin `node_modules`. Lo que escribes es lo que corre.
- **SPA propia** con History API (`js/router.js`).
- **Estado reactivo** con un `Proxy` (`js/store.js`).
- **Offline-first** con IndexedDB (`js/db.js`) + Service Worker (`sw.js`).
- **PWA** instalable (`manifest.json`).
- **Login** con Firebase Authentication (`js/auth.js`).
- **Iconos** Phosphor (CDN) · **Tipografía** Plus Jakarta Sans.

Diseño: fondo crema `#FCF3EA`, tarjetas de 20px, botones tipo "pill" oscuros, colores pastel por categoría, blobs con gradiente. Tono de la copy: cálido y con guiño, en español.

---

## 📁 Estructura del proyecto

```
index.html              # Punto de entrada. Carga estilos, fuentes y js/app.js
manifest.json           # Config PWA (instalable)
sw.js                   # Service Worker (offline + caché network-first)
vercel.json             # Rewrites SPA para que todas las rutas sirvan index.html

css/
  design-system.css     # Tokens, tipografía, botones, tarjetas, nav, layouts
  app.css               # Estilos de la app
  animations.css        # Keyframes (blobs, transiciones, pulso del micro, sheets)

js/
  app.js                # Bootstrap: arranca router, store, auth y registra el SW
  router.js             # Router SPA (rutas, guards de auth/onboarding, ruta base)
  store.js              # Estado global reactivo (Proxy) + acciones
  db.js                 # Capa IndexedDB (persistencia offline)
  auth.js               # Login con Firebase Auth (Google)
  firebase.js           # Inicialización de Firebase Auth
  firebase-config.js    # Config del proyecto Firebase Web
  voice.js              # Reconocimiento de voz (Web Speech API)
  notifications.js      # Notificaciones / recordatorios
  i18n.js               # Internacionalización

  components/           # Web Components reutilizables (nav-bar, tarjetas, micro…)
  views/                # Una vista por pantalla (dashboard, calendar, tasks…)
  data/                 # Datos estáticos (categorías, traducciones, vacunas Madrid)

docs/
  LOGICA-CONTENIDO.md   # 👈 Diseño del "cerebro" de contenido (el trabajo activo)

assets/ · icons/        # Imágenes e iconos de la PWA
```

### ¿Cómo se conecta todo?

1. `index.html` carga `js/app.js`.
2. `app.js` inicializa `store`, `auth` y el `router`, y registra el Service Worker.
3. El `router` mira la URL, comprueba los guards (¿está logueado? ¿hizo onboarding?) y renderiza la **vista** correspondiente de `js/views/`.
4. Las vistas leen/escriben en `store`, que persiste en IndexedDB vía `db.js`.

---

## 🌳 Cómo trabajamos (lee esto antes de tocar nada)

Usamos **ramas + Pull Requests**, y `main` está protegida (nadie sube directo).
El flujo completo está en 👉 **[CONTRIBUTING.md](./CONTRIBUTING.md)**. Resumen:

```
git checkout main && git pull
git checkout -b feat/lo-que-vas-a-hacer
# … cambios …
git add -A && git commit -m "feat: descripción corta"
git push -u origin feat/lo-que-vas-a-hacer
# Abre un Pull Request en GitHub → se revisa → se fusiona a main
```

Cada vez que se fusiona algo en `main`, **Vercel despliega solo** a producción.

---

## 💻 Desarrollo local

Desde la raíz del repo:

```bash
npm run dev
```

Esto levanta la app en `http://localhost:8000`, sirve `mindless-app/` con fallback SPA y recarga la página automáticamente cuando guardas cambios.

---

## 🔐 Login con Google en local (opcional)

La app funciona sin login para desarrollar la mayoría de pantallas. Si necesitas probar el **inicio de sesión con Google** en tu máquina, revisa esta configuración:

1. Rellena `js/firebase-config.js` con la configuración de la Web App en Firebase.
2. En **Firebase Console → Authentication → Sign-in method**, habilita el provider **Google**.
3. En **Firebase Console → Authentication → Settings → Authorized domains**, añade tu origen exacto si no aparece, p. ej. `localhost`.
4. Si usas este servidor local, el origen será `http://localhost:8000`.

> Si te da error de dominio no autorizado o popup bloqueado, casi siempre es configuración de Firebase Auth o una versión cacheada vieja. Recarga: el SW es network-first y se actualiza solo.

---

## ☁️ Despliegue

- **Automático:** cada push (fusión de PR) a `main` dispara un deploy en **Vercel**.
- No hay comandos de deploy ni CLI: todo va por GitHub.
- `vercel.json` reescribe todas las rutas a `index.html` (necesario para la SPA).

---

## 🧭 Dónde está el trabajo activo

El foco ahora es el **"cerebro" de contenido**: que la app *entienda* lo que dice el usuario y genere tareas/eventos condicionales con fechas inferidas y recordatorios por capas (en vez de guardar texto en crudo). El diseño completo está en **[docs/LOGICA-CONTENIDO.md](./docs/LOGICA-CONTENIDO.md)**.

---

## 🤝 Equipo

- **Alejandra** ([@al-grin-024](https://github.com/al-grin-024)) — producto y mantenedora del repo.
