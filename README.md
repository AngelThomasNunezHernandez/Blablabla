diff --git a/README.md b/README.md
index e04de3f530b8a2ec304b4914f7522abd0438fce5..2789eccd1ea1ec1b46a3d63ae2572cadd70763ba 100644
--- a/README.md
+++ b/README.md
@@ -1,2 +1,30 @@
-# Blablabla
-blablabla
+# SonaReplica - Web App ejecutable
+
+Entendido: te referías a que no fuera solo diseño, sino que **se ejecute y funcione en la web**.
+
+Ahora este proyecto incluye una app web ejecutable con backend y frontend en el mismo servidor:
+
+- Frontend real en `web/`.
+- API real en `app/server.py`.
+- Endpoints para proyectos, issues, quality gate y ejecución de análisis.
+
+## Ejecutar
+
+```bash
+python3 app/server.py
+```
+
+Abrir en navegador:
+
+- `http://localhost:3000`
+
+## API disponible
+
+- `GET /api/projects`
+- `GET /api/issues?project=<key>&severity=<level>`
+- `GET /api/quality-gate`
+- `POST /api/analyze`
+
+## Nota
+
+Esto ya corre como aplicación web completa (frontend + backend), lista para seguir ampliando módulos de autenticación, persistencia DB y análisis real de repositorios.
