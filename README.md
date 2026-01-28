# TypeScript Clean Architecture Boilerplate

Un boilerplate de TypeScript que implementa Clean Architecture y principios SOLID. Pensado para proyectos backend que van a crecer y necesitan mantenerse ordenados.

[![CI](https://github.com/sebavidal10/typescript-clean-architecture-boilerplate/actions/workflows/ci.yml/badge.svg)](https://github.com/sebavidal10/typescript-clean-architecture-boilerplate/actions/workflows/ci.yml)

## La idea

Una base sólida para desarrollo backend con TypeScript. Usa Clean Architecture para separar responsabilidades y evitar que el código se vuelva un desastre cuando el proyecto crece.

Útil para proyectos que van a mantenerse en el tiempo, no para MVPs descartables o scripts rápidos.

## Qué incluye

- TypeScript con configuración estricta (para detectar bugs antes)
- Separación clara por capas: Domain, Application, Infrastructure
- Tests con Jest (porque code sin tests da miedo cambiar)
- ESLint + Prettier (para no discutir de formato en los PRs)
- Husky hooks (para no comitear código roto)
- GitHub Actions (CI básico)
- Swagger/OpenAPI (documentación interactiva de la API)
- Ejemplo funcional de User (create + get)

## Estructura

La arquitectura sigue Clean Architecture, básicamente:

```
src/
├── domain/              # Las reglas de negocio puras
│   ├── entities/        # Clases con la lógica de negocio
│   ├── repositories/    # Interfaces (el "qué", no el "cómo")
│   └── exceptions/      # Errores del dominio
│
├── application/         # Casos de uso
│   ├── use-cases/       # La lógica de tu app
│   └── dtos/            # Objetos para transferir data
│
├── infrastructure/      # Todo lo externo
│   ├── database/        # TypeORM config y schemas
│   ├── repositories/    # Implementaciones reales (in-memory, DB)
│   ├── http/            # Express, controllers, routes
│   └── di/              # Dependency injection
│
└── shared/              # Utilidades comunes
```

**La regla importante:** Las dependencias siempre apuntan hacia adentro. Domain no conoce nada de Express o bases de datos.

### Por qué está así

- **Domain:** Lógica de negocio pura. Se puede testear sin levantar un servidor ni DB
- **Application:** Orquesta el dominio. Los use cases son tu app real
- **Infrastructure:** Toda la mugre de frameworks y servicios externos
- **Shared:** Logger, utils, etc. que todos usan

## Cómo empezar

```bash
git clone https://github.com/tuuser/typescript-clean-architecture-boilerplate.git mi-proyecto
cd mi-proyecto
npm install
cp .env.example .env
npm run dev
```

El server arranca en `http://localhost:3000`

**Ver la documentación de la API:**
Abre `http://localhost:3000/api-docs` (Swagger UI)

## Testing

```bash
npm test              # Corre todos los tests
npm run test:watch    # Modo watch para desarrollo
npm run test:coverage # Con reporte de cobertura
```

Hay un threshold de 80% configurado. Si no llegas, el build falla.

## Comandos disponibles

### Desarrollo
```bash
npm install          # Instala todas las dependencias del proyecto
npm run dev          # Inicia el servidor en modo desarrollo con hot-reload
                     # Los cambios se reflejan automáticamente sin reiniciar
```

### Build y Producción
```bash
npm run build        # Compila TypeScript a JavaScript en /dist
                     # Valida tipos y genera código optimizado
npm start            # Ejecuta el servidor compilado desde /dist
                     # Solo funciona después de hacer build
```

### Testing
```bash
npm test                  # Ejecuta todos los tests con Jest
npm run test:watch        # Tests en modo watch (útil durante desarrollo)
npm run test:coverage     # Tests + reporte de cobertura de código
```

### Calidad de Código
```bash
npm run lint         # Revisa el código con ESLint
                     # Reporta errores de estilo y posibles bugs
npm run lint:fix     # Intenta arreglar automáticamente problemas de lint
                     # Formatea con Prettier también
```

### Git Hooks (automáticos)
Estos se ejecutan solos al hacer commits y push:
- **Pre-commit**: Corre `lint:fix` y `test` antes de cada commit
- **Pre-push**: Corre `lint` y `build` antes de push a remote

## Ejemplo de uso

El boilerplate viene con un ejemplo funcional de User. Revisa estos archivos para entender el flujo:

1. `src/domain/entities/User.entity.ts` - La entidad con sus reglas
2. `src/application/use-cases/CreateUserUseCase.ts` - Lógica de crear usuario
3. `src/infrastructure/repositories/InMemoryUserRepository.ts` - Implementación en memoria
4. `src/infrastructure/http/controllers/UserController.ts` - El controller HTTP

**Crear un usuario:**
```bash
curl -X POST http://localhost:3000/api/users \
  -H "Content-Type: application/json" \
  -d '{"email": "test@example.com", "name": "Test User"}'
```

**Obtener un usuario:**
```bash
curl http://localhost:3000/api/users/{id}
```

## Cambiar a base de datos real

Por defecto usa un repositorio in-memory (útil para desarrollo). Para usar PostgreSQL:

1. Descomenta la implementación de TypeORM en `src/infrastructure/di/container.ts`
2. Configura el `.env` con tus credenciales
3. Listo

## Cosas a tener en cuenta

- Los tests están en `__tests__` al lado del código que testean
- Usamos dependency injection con `tsyringe`
- Los Git hooks van a correr lint + tests antes de cada commit
- El CI en GitHub Actions chequea todo en cada push

## Swagger/Documentación

La API se documenta automáticamente con Swagger. Puedes:
- Ver todos los endpoints
- Probarlos directo desde el navegador
- Ver schemas y ejemplos

Todo está en `/api-docs` cuando el server está corriendo.

---

**Puedes usar este proyecto como base o referencia para lo que necesites.** El ejemplo de User está ahí para mostrar cómo funciona todo, pero si lo clonas para un proyecto real, siéntete libre de adaptarlo, extenderlo o modificarlo como prefieras.
