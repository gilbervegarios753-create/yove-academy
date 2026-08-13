# 🏎️ YOVE ACADEMY 3.0 — MANUAL TÉCNICO Y GUÍA DE PRODUCCIÓN

Plataforma de Educación y Diagnóstico Mecatrónico Automotriz de Alto Rendimiento.

---

## 📐 1. ARQUITECTURA GENERAL DEL SISTEMA

YOVE Academy 3.0 está construida sobre una arquitectura **Full-Stack desacoplada y reactiva** orientada al rendimiento, resiliencia offline y seguridad:

- **Frontend**: React 19 + TypeScript + Tailwind CSS 4 + Lucide Icons + Motion Animation.
- **PWA & Offline Service**: Service Worker personalizado con caché selectiva de activos estáticos e IndexedDB/LocalStorage para cola de sincronización offline (`OfflineSyncService`).
- **Backend Service**: Node.js + Express Server CJS empacado dinámicamente con `esbuild`.
- **Base de Datos**: SQLite nativo (`node:sqlite`) con persistencia en disco, índices compuestos de alta velocidad, migraciones automáticas idempotentes y disparadores de auditoría.
- **IA Generativa**: Server-Side Google Gemini API (`@google/genai` con modelo `gemini-2.5-flash`) encapsulado en endpoint seguro `/api/v1/ai/chat` con prompt mecatrónico de 6 pasos.
- **Autenticación & RBAC**: Tokens de sesión Bearer con firmas de seguridad, salting PBKDF2/bcrypt y matriz de permisos de 5 niveles (Student, Instructor, Moderator, Admin, Super Admin).

---

## 🔐 2. VARIABLES DE ENTORNO (`.env.example`)

Copiar `.env.example` a `.env` en el servidor de producción y configurar los valores reales de forma segura:

```env
# Servidor
NODE_ENV=production
PORT=3000

# Base de Datos
DATABASE_PATH=./data/yove_academy.db
DATABASE_URL=file:./data/yove_academy.db

# Seguridad y Claves de Sesión
SESSION_SECRET=openssl_rand_hex_64_bytes_secret

# IA Generativa (Server-side únicamente)
GEMINI_API_KEY=AIzaSy_your_production_gemini_api_key

# Pagos y Monetización
VITE_STRIPE_PUBLIC_KEY=pk_live_xxxx
STRIPE_SECRET_KEY=sk_live_xxxx
STRIPE_WEBHOOK_SECRET=whsec_xxxx

# Correo Transaccional
SMTP_HOST=smtp.sendgrid.net
SMTP_PORT=587
SMTP_USER=apikey
SMTP_PASS=SG.xxxxx
EMAIL_FROM="YOVE Academy <no-reply@yoveacademy.com>"

# Storage de Archivos
STORAGE_DRIVER=local
STORAGE_BUCKET_NAME=yove-academy-media-prod

# CORS
CORS_ORIGIN=https://yoveacademy.com
```

---

## 🛠️ 3. INSTALACIÓN Y COMPILACIÓN (BUILD PROCESS)

### Requisitos Previos:
- Node.js v20.x o superior
- NPM v10.x o superior

### Comandos de Compilación:
```bash
# 1. Instalar dependencias
npm install

# 2. Análisis estático de tipos (TypeScript)
npm run lint

# 3. Compilación de Producción (Vite Frontend + Esbuild Server)
npm run build

# 4. Iniciar Servidor en Producción
npm start
```

---

## 🗄️ 4. BASE DE DATOS: MIGRACIONES, ÍNDICES Y BACKUPS

### Estructura de Tablas:
- `users`: Usuarios, roles, passwords hasheados, XP, racha y nivel.
- `sessions`: Tokens activos con fecha de expiración e IP.
- `courses`: Catálogo LMS con categorías, nivel y lecciones JSON.
- `enrollments`: Inscripciones de alumnos (Índice Único: `user_id, course_id`).
- `progress`: Avance por lección con tiempo de estudio y quizzes.
- `garage_vehicles`: Flota de vehículos registrados por usuario.
- `exams` & `certificates`: Evaluaciones cronometradas y diplomas con código de verificación.
- `forum_topics` & `forum_comments`: Módulo de Comunidad Mecatrónica.
- `notifications`: Alertas del sistema con metadatos JSON.

### Estrategia de Copias de Seguridad (Backups):
1. **Frecuencia**: Copia diaria automatizada a las 02:00 UTC.
2. **Procedimiento de Backup**:
   ```bash
   sqlite3 ./data/yove_academy.db ".backup './backups/yove_academy_$(date +%Y%m%d_%H%M%S).sqlite'"
   ```
3. **Retención**: Mantener las últimas 30 copias de seguridad en storage remoto cifrado.
4. **Procedimiento de Restauración (Rollback DB)**:
   ```bash
   cp ./backups/yove_academy_20260812_000000.sqlite ./data/yove_academy.db
   npm start
   ```

---

## 🛡️ 5. MATRIZ DE SEGURIDAD Y ROLES (RBAC)

1. **STUDENT**:
   - Acceso a Cursos, Laboratorios, Garage, IA, Exámenes, Comunidad y Certificados.
2. **INSTRUCTOR**:
   - Mismos permisos de Student + Creación/Edición de Cursos y Casos Diagnósticos.
3. **MODERATOR**:
   - Mismos permisos de Student + Moderación de publicaciones e hilos en Comunidad.
4. **ADMIN**:
   - Gestión completa de Usuarios, Cursos, Transacciones y Métricas globales.
5. **SUPER_ADMIN**:
   - Control total de la infraestructura, auditoría de logs y asignación de roles.

---

## 🤖 6. INTELIGENCIA ARTIFICIAL & DISCLAIMER TÉCNICO

El servicio **YOVE AI** utiliza la API oficial de Google Gemini (`@google/genai`) con la siguiente política de respuesta mecatrónica:
- **Formato**: Árboles de decisión en 6 pasos (Definición DTC, Datos necesarios, Causas probables, Mediciones con osciloscopio/multímetro, Orden de comprobación y Cursos sugeridos).
- **Exención de Responsabilidad**:
  > *"Verificar especificaciones y procedimientos en la documentación técnica correspondiente al vehículo."*

---

## 🚀 7. PROCEDIMIENTO DE DEPLOY Y ROLLBACK

### Despliegue en Servidor / Cloud Container (Cloud Run / VPS):
```bash
# 1. Traer cambios
git pull origin main

# 2. Compilar binarios de producción
npm run build

# 3. Reiniciar proceso del servidor
pm2 restart yove-academy || npm start
```

### Plan de Contingencia / Rollback:
1. Revertir commit de código: `git reset --hard HEAD~1`
2. Restaurar copia de seguridad de base de datos previa al despliegue.
3. Recompilar con `npm run build` y reiniciar el proceso `node dist/server.cjs`.

---

## 📊 8. MONITOREO Y SALUD DEL SISTEMA

- **Endpoint de Salud**: `GET /api/v1/health`
- **Métricas a Monitorear**:
  - Latencia HTTP < 150ms.
  - Tasa de Error 5xx < 0.1%.
  - Espacio en Disco para SQLite.
  - Tiempo de respuesta de Gemini API.
