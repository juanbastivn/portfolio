# Portfolio de Juan-Bastián

Portfolio personal construido con React, TypeScript y Vite. Se publica en [jbastian.cl](https://jbastian.cl) mediante GitHub Pages.

## Desarrollo local

```bash
npm install
npm run dev
```

Antes de enviar cambios de código:

```bash
npm run lint
npm run build
```

## Editor local de contenido

El portfolio incluye un editor visual local basado en Decap CMS. No necesita OAuth, Netlify, tokens ni otra cuenta, y sólo escucha conexiones desde el propio computador.

Inícialo desde la raíz del repositorio:

```bash
npm run content
```

Después abre [http://127.0.0.1:4174/admin/](http://127.0.0.1:4174/admin/). Desde allí puedes editar las secciones y subir imágenes. Termina el proceso con `Ctrl+C`.

Los textos se guardan en `public/content/*.md` y las imágenes en `public/uploads/`. El editor sólo modifica archivos locales; revisa los cambios con `git diff` antes de publicarlos.

Para validar, crear el commit y hacer push usando un único comando:

```bash
npm run content:publish -- "describe aquí la actualización"
```

Este comando sólo publica `public/content` y `public/uploads`. Por seguridad se detiene si detecta cambios de código pendientes.

Cada sección tiene una URL compartible (`#software`, `#printing3d`, `#media` y `#games`) y respeta los botones atrás/adelante del navegador.

## Publicación

Cada `push` a `main` dispara `.github/workflows/deploy.yml`. En la configuración del repositorio, `Settings → Pages → Build and deployment → Source` debe estar en **GitHub Actions**.

El editor no forma parte de `dist`, por lo que `/admin` no se publica en `jbastian.cl`.
