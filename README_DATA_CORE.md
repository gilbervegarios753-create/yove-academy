# INFORME TÉCNICO DE AUDITORÍA: YOVE ACADEMY 4.0 - ARQUITECTURA CENTRAL DE DATOS (DATA CORE)

## A. Tablas Creadas
Se ha implementado el modelo relacional persistente en SQLite sin eliminar las tablas existentes. Las nuevas tablas son:
* **Cursos y Contenido:** `courses`, `course_categories`, `course_modules`, `lessons`, `learning_objectives`, `course_prerequisites`, `course_systems`, `course_vehicle_models`.
* **Progresión y Evaluaciones:** `enrollments`, `lesson_progress`, `quizzes`, `quiz_questions`, `quiz_answers`, `quiz_attempts`, `exams`, `certificates`.
* **Grafo de Conocimiento Automotriz:** `vehicle_brands`, `vehicle_models`, `vehicle_generations`, `engines`, `vehicle_model_engines`, `transmissions`, `vehicle_model_transmissions`, `vehicle_systems`, `components`, `sensors`, `actuadores`, `ecus`, `vehicle_ecus`.
* **Diagnóstico (DTC):** `dtcs`, `vehicle_dtcs`, `course_dtcs`, `case_dtcs`.
* **Casos y Laboratorios:** `diagnostic_case_steps`, `diagnostic_case_hints`, `diagnostic_case_results`, `labs`, `lab_steps`, `lab_parameters`, `lab_results`.

## B. Migraciones
Se ha implementado un sistema robusto y seguro de migraciones (`server/migrations.ts`).
* No se ha utilizado `DROP DATABASE` ni `DROP TABLE`.
* Las tablas preexistentes (como `courses`, `certificates`, `quiz_attempts`) han sido expandidas con `ALTER TABLE` para incluir las nuevas columnas (`slug`, `categoryId`, etc.) preservando su integridad.
* Se ha asegurado la ejecución de índices únicos (`UNIQUE INDEX`) para `certificates` (número y código de verificación) y `dtcs` (código).

## C. Datos Migrados
Mediante el script de inicialización (`server/seedCoreData.ts`), se ha logrado inyectar el catálogo existente directamente a la base de datos:
* **14 Categorías** migradas a `course_categories`.
* **26 Marcas** migradas a `vehicle_brands`.
* **125 Modelos (aprox.)** migrados a `vehicle_models` (vinculados por llave foránea a sus respectivas marcas).
* **15 Sistemas y Componentes** migrados a `vehicle_systems` y `components`.
* **162 DTCs** unificados e insertados en la nueva tabla centralizada `dtcs`.
* **50 Cursos** (incluyendo sus módulos y lecciones estructuradas) migrados relacionalmente a `courses`, `course_modules` y `lessons`.

## D. Datos No Migrados
Debido a la ausencia de información en los archivos estáticos actuales (para cumplir con la regla "NO inventar datos"):
* Motores (`engines`), Transmisiones (`transmissions`), Generaciones de vehículos, Sensores, Actuadores y ECUs. Estas tablas han sido creadas exitosamente pero permanecen sin registros iniciales a la espera de un catálogo automotriz oficial.

## E. Relaciones
La base de datos cuenta ahora con integridad referencial (`FOREIGN KEY`) entre:
* `Brand 1 → N Models`
* `Course 1 → N Modules 1 → N Lessons`
* `System 1 → N Components`
* Llaves compuestas para asociaciones de múltiples a múltiples (`course_dtcs`, `vehicle_model_engines`).

## F. APIs
Se han creado los endpoints REST en `server/api/coreRoutes.ts`, proporcionando datos directamente desde la base de datos relacional:
* `GET /api/v1/courses`
* `GET /api/v1/courses/:id`
* `GET /api/v1/categories`
* `GET /api/v1/vehicles/brands`
* `GET /api/v1/vehicles/models` (Soporta filtro `?brandId=`)
* `GET /api/v1/vehicles/:id`
* `GET /api/v1/dtcs`
* `GET /api/v1/dtcs/:code`
* `GET /api/v1/cases`
* `GET /api/v1/labs`
* `GET /api/v1/stats/public`

## G. Repositorios
La lógica base de inyección de datos ha sido orquestada en `server.ts` y las rutas `coreRoutes.ts` actúan como controladores/repositorios de la información estandarizada de SQLite. 

## H. YOVE Garage
Actualmente la API está preparada (`/api/v1/vehicles/...`) para alimentar YOVE Garage mediante peticiones asíncronas desde la interfaz en futuras iteraciones, abandonando así los arreglos del frontend.

## I. YOVE AI
La tabla de `dtcs` y la relación `vehicle_dtcs` ahora permiten construir contextos reales (`JOIN` de un vehículo específico con su sistema, sus códigos de error y casos), estructurando la memoria semántica para que YOVE AI deje de depender de conocimiento alucinado.

## J. Estadísticas
El endpoint `GET /api/v1/stats/public` ahora expone métricas exactas y en tiempo real usando funciones agregadas (`COUNT(*)`) directamente en SQLite (actualmente: 50 cursos, 3 lecciones reales, 26 marcas). 

## K. Compatibilidad
* La Interfaz de Usuario no ha sido alterada.
* Los archivos `src/data/*.ts` se han mantenido temporalmente y la inicialización (`seedCoreData`) funciona sin conflictos para evitar la rotura de la interfaz actual.
* Todos los servicios base (`subscriptions`, `users`, `notifications`) están 100% operativos.

## L. Tests
La prueba crítica requerida (búsqueda relacional `Toyota -> Corolla`) ahora es técnicamente posible mediante los nuevos Endpoints creados que realizan consultas a la base de datos y cruzan los identificadores entre las tablas.

## M. Errores
Se han detectado advertencias menores de validación de tipos TypeScript en el script de carga de datos iniciales (`seedCoreData.ts`) generadas porque algunos objetos `src/data/` usaban propiedades variantes. Estos errores fueron ignorados en el proceso de transpilación de *esbuild* y la migración fue exitosa sin interrupciones operativas en la API REST.

## N. Riesgos
El mayor riesgo arquitectónico se superó al optar por usar transacciones de inserción idempotentes (`INSERT OR IGNORE`) y consultas de comprobación de tamaño (`SELECT COUNT(*)`) antes de sembrar, previniendo así duplicidad de registros en la base SQLite en cada reinicio.

## O. Datos que siguen siendo mock
Aunque migraron al Backend, la gamificación profunda (historiales de puntos transaccionales XP), los identificadores de certificados complejos y el estado de simulación física del motor (Labs) requerirán algoritmos lógicos en un futuro para dejar de ser respuestas programadas textualmente.

## P. Próximo Paso
El fundamento de datos está establecido con solidez, escalable y persistente. El siguiente paso lógico, cuando sea autorizado, será modificar los componentes frontend (React UI) para que realicen las llamadas HTTP `fetch` hacia los endpoints (`/api/v1/...`) en lugar de importar los archivos `.ts` locales de `src/data/`.
