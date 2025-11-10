# Copilot Instructions for GeoAPI

## Project Overview
- **Purpose:** RESTful API for searching country and city information (names, populations, etc.) for developer integration (travel apps, autocomplete, etc.).
- **Data Source:** CSV file (`worldcities.csv`) imported into a database; API queries the DB for all endpoints.
- **No frontend**—API only, used via HTTP tools or integration.

## Architecture & Patterns
- **Backend:**
  - Follows modular structure: `controllers/`, `services/`, `entities/`, `dto/`, `migrations/` (see technical instructions for details).
  - Uses DTOs for all API input/output; validation via `class-validator`.
  - Entity classes always include timestamp columns (`createdAt`, `updatedAt`), use UTC (`timestamptz`).
  - All DB schema changes via migrations (never auto-sync in prod).
  - Consistent RESTful routes: `/api/resources`, `/api/resources/:id`, etc.
  - Controllers return DTOs directly; services handle business logic and logging.
  - Use proper HTTP status codes and exception handling (e.g., `NotFoundException`).
- **Authentication:**
  - API keys or OAuth; keys stored in DB, required in headers.
  - Use decorators for role-based access (see `@Roles` usage).
- **Testing:**
  - Unit tests in `test/unit/`, e2e in `test/e2e/`.
  - Use mocks for DB/external dependencies.

## Developer Workflow
- **Add new features:**
  1. Create entity, DTOs, service, controller, migration.
  2. Register in module.
  3. Add tests.
  4. Run/build/test using documented scripts (see `package.json` or README if present).
- **Migrations:**
  - Generate: `npm run migration:generate src/migrations/Name`
  - Run: `npm run migration:run`
  - Revert: `npm run migration:revert`
- **API conventions:**
  - Filtering, sorting, pagination supported for large datasets.
  - Extend endpoints for new search criteria as needed.

## Project-Specific Conventions
- **Naming:**
  - Entities: `country.entity.ts`, `city.entity.ts` (PascalCase class)
  - Services: plural, e.g., `countries.service.ts`
  - DTOs: `country.dto.ts` (multiple DTOs per file)
  - Enums/constants: in `const/` or `values/`
- **Validation:**
  - Use decorators (`@IsString()`, `@IsOptional()`, etc.) in DTOs.
- **Logging:**
  - Log all service operations with descriptive messages.
- **Error handling:**
  - Never expose sensitive info; use global exception filters.

## Key Files & Directories
- `.github/technical.instructions.md` — full technical conventions
- `.github/context.instructions.md` — project goals and context
- `worldcities.csv` — source data

## Examples
- See technical instructions for full code patterns (controller/service/entity/DTO, etc.).
- Example: To add a new resource, follow the step-by-step scenario in `.github/technical.instructions.md` ("Adding a New Entity").

## Integration Points
- API endpoints are the main integration surface; see controller patterns for extending.
- Authentication via API key/OAuth—ensure keys are checked in middleware/guards.

---

**For more details, always check `.github/technical.instructions.md` and `.github/context.instructions.md`.**
