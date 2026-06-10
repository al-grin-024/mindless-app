# Guía de colaboración — Mindless

Cómo trabajamos juntos en este repo sin pisarnos y sin romper producción.
Si es tu primer día, lee también el **[README.md](./README.md)** para arrancar la app en local.

---

## 🌳 El flujo en una frase

> `main` está protegida. Nadie sube directo. Todo cambio vive en su **rama**, se abre un **Pull Request (PR)**, se **revisa** y se **fusiona**. Al fusionar, Vercel despliega solo.

```
main  ──●────────────●───────────●──►   (siempre estable = lo que está en producción)
         \          /
          ●──●──●──●        rama feat/… (tu trabajo)
```

---

## 1. Antes de empezar algo nuevo

Parte siempre de una `main` actualizada:

```bash
git checkout main
git pull origin main
git checkout -b feat/nombre-corto
```

## 2. Nombres de rama

`tipo/descripcion-corta-con-guiones`. Tipos que usamos:

| Tipo     | Cuándo                                  | Ejemplo                          |
|----------|-----------------------------------------|----------------------------------|
| `feat/`  | Funcionalidad nueva                     | `feat/recordatorios-vacunas`     |
| `fix/`   | Arreglar un bug                         | `fix/login-cache-vieja`          |
| `docs/`  | Solo documentación                      | `docs/actualizar-readme`         |
| `style/` | Estilos/CSS sin cambiar lógica          | `style/tarjetas-gastos`          |
| `refactor/` | Reorganizar código sin cambiar lo que hace | `refactor/separar-store`    |

## 3. Commits

Mensajes cortos, en presente, con prefijo de tipo. Mejor varios commits pequeños que uno gigante.

```bash
git add -A
git commit -m "feat: pantalla de confirmación del plan de acción"
```

Formato: `tipo: qué hace` — p. ej. `fix: el micro no se reiniciaba tras hablar`.

## 4. Subir y abrir el Pull Request

```bash
git push -u origin feat/nombre-corto
```

GitHub te dará un enlace para abrir el PR. En el PR:

- **Título** claro (igual que un buen commit).
- **Descripción**: qué cambia, por qué, y cómo probarlo. Si toca UI, añade captura.
- Asigna a **@al-grin-024** como revisora.
- Si aún no está listo, ábrelo como **Draft**.

## 5. Revisión y fusión

- Un PR necesita **al menos 1 aprobación** antes de fusionar.
- Responde a los comentarios; sube más commits a la misma rama si hace falta (el PR se actualiza solo).
- Fusiona con **"Squash and merge"** (deja `main` con un historial limpio).
- Borra la rama después de fusionar (GitHub te ofrece el botón).

## 6. Reglas de oro 🚫

- **Nunca** subas secretos (tokens, claves API, contraseñas) al repo. Van en un archivo local ignorado por git, **nunca** en el chat ni en commits.
- **No** edites directamente en `main`.
- Una rama / un PR = **un cambio con sentido**. No mezcles 5 cosas distintas.
- Si algo te da miedo o no lo entiendes, **pregunta antes** de fusionar. Mejor una pregunta tonta que romper producción.
- Es vanilla JS sin build: prueba en el navegador antes de abrir el PR (recarga con la consola abierta para ver errores).

---

## 🔧 Para la mantenedora (Alejandra)

### Activar la protección de `main` (una sola vez)

Desde GitHub (web o móvil): **Settings → Branches → Add branch ruleset** (o *Add rule*) para `main`:

1. ✅ **Require a pull request before merging** (exige PR para fusionar).
2. ✅ **Require approvals** → 1.
3. ✅ **Do not allow bypassing the above settings** (que aplique también a admins, opcional pero recomendable).
4. Guardar.

A partir de ahí, ni tú ni el junior podéis empujar directo a `main`: todo pasa por PR.

### Revisar y fusionar un PR desde el móvil

1. Abre la pestaña **Pull requests** del repo en la app de GitHub o en el navegador.
2. Entra en el PR → pestaña **Files changed** para ver el código.
3. Si te gusta: **Review changes → Approve**. Si no: **Request changes** con comentarios.
4. Botón **Squash and merge** → confirma. Vercel desplegará solo en ~1 min.

> Consejo: pídele siempre al junior una **descripción de cómo probarlo** en el PR. Así puedes validar el cambio en producción/preview sin leer todo el código.
