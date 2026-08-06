# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

Internal web portal for the Municipality of San Miguel de Tucumán (SMT, Argentina) — branded "Ciudad Digital". A single React SPA that fronts multiple municipal back-office systems: estadísticas (RRHH / reclamos), licitaciones, patrimonio municipal, tribunal de faltas, combustibles, gas domiciliario, vía pública, user/permission administration, etc. The codebase, routes, UI strings, and domain vocabulary are all in **Spanish** — match that convention when adding code.

## Commands

```bash
npm run dev       # Vite dev server (HMR)
npm run build     # production build
npm run preview   # serve the production build
npm run lint      # ESLint — fails on ANY warning (--max-warnings 0)
```

There is **no test suite** and no test runner configured. "Verifying" a change means running `npm run dev`/`build` and exercising the UI.

`npm run lint` is strict: `--max-warnings 0` means a single ESLint warning fails the command. The code leans heavily on inline `// eslint-disable-next-line react/prop-types` and `react-hooks/exhaustive-deps` disables — this is the established pattern, not something to "fix" wholesale.
## Working Preferences

### Language
- Responder siempre en español.

### Token Efficiency
- Ser conciso.
- Evitar explicaciones largas salvo que se soliciten.
- Mostrar únicamente los cambios necesarios.
- No repetir código existente.
- No mostrar archivos completos salvo que se soliciten explícitamente.
- Resumir análisis en menos de 10 líneas.

### Development Workflow
- Antes de modificar código, explicar brevemente el plan.
- Revisar archivos relacionados antes de proponer cambios.
- Respetar la arquitectura existente.
- No introducir librerías nuevas sin justificarlo.

### Code Style
- Evitar `any` salvo que sea estrictamente necesario.
- Mantener el estilo existente del proyecto.
- Seguir los patrones ya utilizados en el código.
- No refactorizar código no relacionado con la tarea solicitada.

### Verification
- Para cambios pequeños, indicar qué verificar manualmente.
- No sugerir crear tests porque el proyecto no tiene infraestructura de testing.

## Architecture

### Backend topology — multiple services, one axios instance each
There is no single API. Each backend microservice has its own preconfigured axios instance in [src/config/](src/config/), with `baseURL` read from a `VITE_*` env var (see [.env](.env)):

| Instance | File | Env var | Purpose |
|---|---|---|---|
| `axios` | [axios.js](src/config/axios.js) | `VITE_APP_RUTA_BACK` | main / usuarios / admin |
| `axiosMuni` | [axiosMuni.js](src/config/axiosMuni.js) | `VITE_APP_RUTA_BACK_MUNI` | auth status, municipal data |
| `axiosLici` | [axiosLicitaciones.js](src/config/axiosLicitaciones.js) | `VITE_APP_RUTA_BACK_LICITACIONES` | contrataciones / licitaciones |
| `axiosPatri` | [axiosPatrimonio.js](src/config/axiosPatrimonio.js) | `VITE_APP_RUTA_BACK_PATRIMONIO` | patrimonio municipal |

When making an authenticated request, pick the instance that matches the target service. The JWT must be set as the `Authorization` header on **every** instance that will be used — see how `login`/`getAuth` in the Zustand store sets it on `axios`, `axiosLici`, and `axiosMuni` together.

### Authentication & SSO
- Auth is a JWT stored in `localStorage` under `"token"`.
- SSO entry: the token can arrive as a `?auth=<token>` URL query param (from `ciudaddigital.smt.gob.ar` / `perfil.smt.gob.ar`). [App.jsx](src/App.jsx) and `getAuth` in the store read and strip it from the URL, then persist to localStorage.
- Logout redirects the browser to `https://ciudaddigital.smt.gob.ar/?logout=true` and clears the token — it does not just navigate internally.
- `getAuth` validates the token via `GET /usuarios/authStatus` and loads the `user` object.

### State: two parallel systems (be careful)
There are **two** overlapping state/auth layers — know which one a component uses:
1. **[src/Zustand/Zustand.js](src/Zustand/Zustand.js)** (`useStore`) — the primary, current store. Holds `user`, `authenticated`, `permisos`, `login`, `getAuth`, `logout`, and the licitaciones data fetchers. New code should use this.
2. **[src/context/DerivadorContext.jsx](src/context/DerivadorContext.jsx)** (`ProviderDerivador`, wraps all routes) — an older React Context with its own `getAuth`/`logout` and most of the Patrimonio/admin CRUD fetchers (`obtenerCategoria`, `obtenerReparticiones`, etc.). Still in active use by admin/patrimonio panels.

Both define `getAuth`/`logout`/`user`; they are **not** synchronized. The Context's `logout` still points at a `localhost` dev URL — prefer the store's `logout`.

### Authorization model (two tiers)
1. **User type** — `user.id_tusuario` (numeric role; `1` = admin general). Route guards in [src/routes/](src/routes/) gate whole pages by hardcoded `id_tusuario` checks (e.g. `PrivateRouteAdmin` requires `== 1`, `PrivateRouteUsuarios` allows `1`/`40` or a specific permiso). Comparisons use `==` against magic numbers — keep that style consistent if editing guards.
2. **Granular permisos** — `obtenerPermisos(id_tusuario, id_persona)` loads a `permisos` array; each entry has `id_proceso`, `ver`, `nombre_opcion`, `nombre_proceso`, `descripcion`, `sistema_externo`. The sidebar ([src/common/SideBar.jsx](src/common/SideBar.jsx)) and home cards ([src/components/Home/Home.jsx](src/components/Home/Home.jsx)) **build the menu dynamically** by filtering `permiso.ver === 1` and grouping by `nombre_opcion` (CONSULTAS / TRÁMITES / TURNOS / APLICACIONES / etc.). A permiso with a non-null `sistema_externo` opens an external URL (passing `?auth=<token>`) instead of an internal route.

### Routing
- Uses `HashRouter` ([App.jsx](src/App.jsx)) — URLs are `/#/path`. All app routes are registered there, each wrapped in a `PrivateRoute*` guard.
- Layout: [src/common/Layout.jsx](src/common/Layout.jsx) renders the persistent `NavBar` + `SideBar` around routed content.

### Conventions
- `src/components/` = feature components grouped by domain (Admin, Combustibles, Graficos, Tablas, TribunalDeFaltas…); `src/pages/` = top-level routed pages; `src/helpers/` & `src/utils/` = pure helpers and constants ([src/helpers/constantes.js](src/helpers/constantes.js) holds chart color maps and login defaults).
- Data fetching for simple lists: the `useGet(url, axiosInstance)` hook ([src/hooks/useGet.js](src/hooks/useGet.js)) — pass the right axios instance as the second arg.
- UI stack is mixed: MUI (`@mui/material`, `@mui/x-data-grid`) + React-Bootstrap + Bootstrap CSS + styled-components/Emotion, with `sweetalert2` for dialogs and `chart.js`/`react-chartjs-2` for the statistics dashboards.
- The dev server proxies `/admin` to `http://localhost:3000` ([vite.config.js](vite.config.js)).
