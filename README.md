# SonaReplica Web

Sí, ahora está implementado en una **página web funcional** (estática) con un dashboard estilo SonarQube.

## Qué incluye

- Sidebar de navegación.
- KPIs principales (bugs, vulnerabilidades, code smells, cobertura).
- Tabla de issues recientes.
- Estado de Quality Gate con badges (PASS/WARNING/FAIL).
- Botón para actualizar métricas simuladas.

## Ejecutar localmente

```bash
python3 -m http.server 3000 --directory web
```

Luego abre:

- `http://localhost:3000`

## Estructura

- `web/index.html`: layout y estructura del dashboard.
- `web/styles.css`: estilos visuales.
- `web/app.js`: datos simulados y render dinámico.
