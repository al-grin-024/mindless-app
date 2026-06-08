# Mindless — Lógica de contenido (el "cerebro")

> Documento de trabajo. La idea: que cuando hablas con Mindless, **entienda** lo que dices
> y genere **acciones condicionales** (tareas, eventos, recordatorios por capas), en vez de
> guardar el texto tal cual. Y que sea **proactivo** con lo que ya sabe de tu familia.
>
> Principio rector (del diseño original): **"Nunca hago nada sin preguntarte primero."**
> Por eso el cerebro **propone un plan** y tú lo **confirmas** antes de que se guarde nada.

---

## 1. La diferencia clave

**Hoy (mal):** dices algo → se guarda como una tarea con ese texto.

**Objetivo (bien):** dices algo → Mindless lo interpreta → propone un *plan* con varias
acciones, fechas deducidas y avisos en capas → tú confirmas/editas → se ejecuta.

---

## 2. Arquitectura por capas

```
  [1] CAPTURA            Voz (Web Speech) o texto desde "Cuéntame"
        │                + contexto: fecha de hoy, hijos y edades, pareja, preferencias
        ▼
  [2] CEREBRO            Interpreta la frase → devuelve un PLAN estructurado (JSON):
      (entender)         acciones + preguntas aclaratorias.  ← aquí brilla Claude
        │
        ▼
  [3] CONFIRMACIÓN       Mindless te enseña el plan: "He entendido esto: 2 tareas + 1
      (preguntar)        evento + 2 avisos. ¿Lo guardo?"  Editable. Aquí se responden
        │                las preguntas ("¿te ayudo a planificar el viaje?").
        ▼
  [4] EJECUCIÓN          Guarda en IndexedDB (tareas/eventos), crea el evento en Google
      (hacer)            Calendar y programa las notificaciones (recordatorios por capas).
        ▲
        │
  [5] REGLAS PROACTIVAS  Independiente de la voz. A partir del perfil + datos de referencia
      (adelantarse)      (calendario de vacunas de Madrid) crea avisos solo. Ej: niño de 5
                         años → recordatorio de su próxima vacuna un mes antes.
```

Las capas 1, 3, 4 y 5 son **código determinista** (las hacemos nosotras). La capa 2 (entender
lenguaje libre) es la que conviene resolver con **Claude**.

---

## 3. El "contrato": esquema del PLAN DE ACCIÓN

Esto es lo más importante: el formato que el cerebro **siempre** devuelve. Una vez fijado,
da igual si el cerebro es Claude o reglas locales: la capa de ejecución solo entiende esto.

```json
{
  "summary": "Resumen corto y humano de lo que entendí",
  "questions": [
    { "id": "plan_trip", "text": "¿Quieres que te ayude a planificar el viaje?", "type": "yes_no" }
  ],
  "actions": [
    {
      "type": "event | task | reminder",
      "title": "Texto de la acción",
      "date": "2026-06-14",            // fecha deducida (ISO). null si no aplica
      "time": "17:00",                 // opcional
      "category": "food|health|school|finance|social|calendar|family|spark",
      "calendarSync": true,            // solo para 'event': crear en Google Calendar
      "reason": "1 semana antes",      // por qué existe esta acción
      "relatesTo": "Cumpleaños",       // enlaza recordatorios con su evento
      "dependsOn": "plan_trip"         // solo se crea si la pregunta se responde "sí"
    }
  ]
}
```

---

## 4. Tus ejemplos, resueltos (ejemplos "dorados")

Estos casos son a la vez **especificación**, **instrucciones para Claude** y **tests**.

### 4.1 "Mis hijos tienen un cumpleaños el 14 de junio"
```json
{
  "summary": "Cumpleaños el 14 de junio",
  "questions": [],
  "actions": [
    { "type": "event",    "title": "Cumpleaños", "date": "2026-06-14", "category": "social", "calendarSync": true },
    { "type": "reminder", "title": "Comprar regalo de cumpleaños", "date": "2026-06-07", "reason": "1 semana antes", "relatesTo": "Cumpleaños" },
    { "type": "reminder", "title": "Cumpleaños en 2 días", "date": "2026-06-12", "reason": "2 días antes", "relatesTo": "Cumpleaños" }
  ]
}
```

### 4.2 "Me falta reservar campamento la 3ª semana de julio y además habría que irse la siguiente de vacaciones y no sé a dónde"
```json
{
  "summary": "Campamento (3ª semana de julio) + vacaciones (4ª semana)",
  "questions": [
    { "id": "plan_trip", "text": "¿Quieres que te ayude a planificar el viaje de vacaciones?", "type": "yes_no" }
  ],
  "actions": [
    { "type": "task", "title": "Reservar campamento", "date": "2026-07-15", "category": "school", "reason": "tercera semana de julio" },
    { "type": "task", "title": "Organizar vacaciones en familia", "date": "2026-07-22", "category": "social", "reason": "cuarta semana de julio" }
  ]
}
```
> Aquí se ven las 3 cosas que pediste: **detecta 2 intenciones**, **deduce fechas** a partir
> de "3ª/4ª semana de julio", y **hace una pregunta** en vez de decidir por ti.

### 4.3 Proactivo: "Tengo niños de 5 y 6 años"
No genera tareas en el momento; alimenta las **reglas proactivas** (sección 6): a partir de la
edad y del calendario de vacunas de Madrid, crea recordatorios un mes antes de cada vacuna.

---

## 5. Catálogo de intenciones (amplíalo tú)

La forma de "desarrollar la lógica" es ir llenando esta tabla con frases reales. Cada fila
nueva mejora el cerebro. Empiezo con semillas; añade las tuyas.

| Lo que dices | Intención | Acciones que genera | Pregunta | Datos que necesita |
|---|---|---|---|---|
| "X tiene un cumple el 14 de junio" | birthday | event + reminder(−7d compra regalo) + reminder(−2d) | — | fecha |
| "hay que reservar campamento la 3ª sem de julio" | booking | task con fecha deducida | — | fecha aprox |
| "nos vamos de vacaciones la última semana de julio" | trip | task "organizar viaje" | "¿te ayudo a planificarlo?" | fechas |
| "a Leo le toca revisión del pediatra" | medical_appt | task + (si hay fecha) event + reminder | "¿qué día?" si no hay fecha | quién, fecha |
| "tengo que pagar la matrícula del cole" | bill | task + reminder antes del vencimiento | "¿para cuándo?" | importe, fecha |
| "comprar regalo para la profe" | shopping | task | — | — |
| _(añade aquí)_ | | | | |

---

## 6. Reglas proactivas (sin voz)

Disparadas por el perfil + datos de referencia. Ya tenemos el fichero
`js/data/vaccination-madrid.js`.

- **Vacunas:** por cada hijo, según su edad/fecha de nacimiento → calcular próximas vacunas →
  crear recordatorio **1 mes antes** de la fecha estimada. (Pendiente: pedir fecha de nacimiento
  en el onboarding, hoy solo guardamos edades aproximadas.)
- **Cumpleaños recurrentes:** una vez guardado un cumple, repetir cada año + avisos.
- **Inicio de curso, campamentos de verano, etc.:** plantillas estacionales.

Cuándo se ejecutan: al abrir la app y/o periódicamente. Es código determinista, no necesita IA.

---

## 7. ¿Dónde corre el cerebro? (decisión)

La capa [2] (entender lenguaje libre) es la única que necesita "inteligencia".

| Opción | Pros | Contras |
|---|---|---|
| **A. Claude vía función serverless** (recomendada) | Entiende cualquier frase, multi-intención, deduce fechas, hace preguntas. La clave de API vive en el servidor (segura). **Ya estamos en Vercel → una Vercel Function `api/brain` encaja sin montar infra nueva.** | Coste por llamada (bajo con Haiku), requiere la function |
| **B. Reglas locales** | Offline, gratis, instantáneo, determinista | Frágil con frases libres, no improvisa, mantenimiento manual |
| **C. Híbrido** (lo ideal a medio plazo) | Reglas para lo proactivo/recurrente + Claude para "Cuéntame" | Dos caminos que mantener |

**Recomendación:** estructura todo contra el esquema de la sección 3 con un **cerebro simulado
por reglas** primero (para construir ya la UX de confirmar→ejecutar sin depender de nada), y
luego **enchufar Claude** en una Vercel Function. Modelos sugeridos: **Claude Haiku 4.5**
(`claude-haiku-4-5`) para parsear rápido y barato; **Sonnet 4.6** (`claude-sonnet-4-6`) si algún
caso necesita más razonamiento. Salida con *structured output / tool use* para que devuelva
exactamente el JSON del plan.

---

## 8. Cómo lo desarrollamos juntas (método)

Dirigido por ejemplos:

1. **Tú** añades frases reales a la tabla de la sección 5 (cuantas más, mejor).
2. **Yo** convierto cada frase en su "plan esperado" (como en la sección 4).
3. Ese conjunto de ejemplos se vuelve: (a) las instrucciones del cerebro (system prompt),
   (b) los tests que evitan que algo se rompa.
4. Iteramos: hablas → vemos qué plan sale → ajustamos → repetimos.

---

## 9. Roadmap por fases

- **Fase 0 — Diseño** (este documento). Cerrar el esquema y los primeros ejemplos.
- **Fase 1 — Tubería con cerebro simulado:** "Cuéntame" → plan (reglas) → **pantalla de
  confirmación** editable → crear tareas/eventos/recordatorios en IndexedDB. Cumple el
  principio "pregunto antes de hacer". *No necesita backend.*
- **Fase 2 — Claude de verdad:** Vercel Function `api/brain` que llama a Claude con el esquema.
  Sustituye al cerebro simulado para frases libres.
- **Fase 3 — Calendario + avisos:** sincronizar eventos con Google Calendar (añadir scopes y
  activar la API) y programar las notificaciones por capas.
- **Fase 4 — Proactivo:** reglas de vacunas (pide fecha de nacimiento en onboarding) y demás.

---

## 10. Preguntas abiertas para ti

1. **Confirmación:** ¿prefieres confirmar **siempre** el plan, o que las cosas "obvias" se
   guarden solas y solo pregunte en las dudosas?
2. **Avisos por defecto:** ¿qué capas quieres por defecto? (cumple: −7d compra regalo, −2d;
   citas médicas: −1 día; facturas: −3 días...). Dímelo y lo parametrizamos.
3. **Calendario:** ¿sincronizar con tu Google Calendar real, o un calendario propio de Mindless?
4. **Voz:** ¿quieres que Mindless te **responda hablando/escribiendo** ("vale, te lo apunto y te
   aviso una semana antes"), o solo muestre el plan?
5. **Idioma/fechas:** confirmamos español de España y zona horaria de Madrid para deducir fechas.

---

## 11. Cómo seguir trabajándolo desde el móvil con Claude

- Este archivo está en el repo: `docs/LOGICA-CONTENIDO.md`.
- En GitHub (móvil): **https://github.com/al-grin-024/mindless-app/blob/main/docs/LOGICA-CONTENIDO.md**
- Para trabajarlo con la **Claude app**: abre ese enlace, copia el contenido y pégalo en una
  conversación nueva con Claude; o pega solo la sección 5 (catálogo) y vais ampliando frases.
- Cuando tengas más ejemplos o respondas las preguntas de la sección 10, lo volcamos al código.
