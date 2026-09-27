# AI Modification Rules & Governance (RULES.md)

This document establishes the binding rules, invariants, and architectural constraints that any autonomous agent, AI assistant, or developer must follow when editing or expanding this codebase.

---

## 1. Absolute Invariants (Never Break These)

### Rule 1: The Conflict Guard Invariant
* **Directive**: Under no circumstances may a room booking be saved, updated, or accepted without prior validation through `BookingConflictService.hasConflict(...)`.
* **Penalty for Breach**: Results in catastrophic double-allocation on campus facilities during physical events.
* **Testing Mandate**: Any modification to `BookingConflictService` requires adding or updating unit tests in `src/test/java/...` covering:
  1. Exact overlap ($S_1 = S_2, E_1 = E_2$).
  2. Partial start overlap ($S_1 < S_2 < E_1$).
  3. Partial end overlap ($S_1 < E_2 < E_1$).
  4. Enclosing timeslot ($S_1 < S_2 \text{ and } E_1 > E_2$).
  5. Adjacent slots (booking ends at 11:00, next booking starts at 11:00 $\rightarrow$ MUST BE ALLOWED).

### Rule 2: The Two-Tier Approval Integrity Invariant
* **Directive**: Student requests must originate in state `PENDING`, progress through `HOD_APPROVED`, and finalize at `APPROVED` (or transition to `REJECTED`).
* Direct transitions from `PENDING` directly to `APPROVED` are forbidden from student or HOD controller routes.
* Only central administrators (`ROLE_ADMIN`) may directly sanction or override bookings.

### Rule 3: Zero-Asset-Pipeline Frontend Invariant
* **Directive**: Do not introduce Webpack, Vite, npm, React, Vue, or Tailwind.
* All visual styling must use pure CSS variables declared in [`xavier-theme.css`](file:///Users/ayush/Projects/college%20room%20allocation%20system/room-allocation/src/main/resources/static/css/xavier-theme.css).
* Keep page load times instant with zero client build steps.

### Rule 4: Credential and Secret Sanitization
* **Directive**: Never write database passwords, API keys, or personal tokens into `application.properties`, templates, or markdown files.
* Always read credentials from environment variables (`DB_URL`, `DB_USERNAME`, `DB_PASSWORD`).
* `.env` files must always be ignored in `.gitignore`.

---

## 2. Code Modification Guidelines

### 2.1. Backend Java Standards
* **Java Version**: Compatible with Java 17 through Java 25.
* **Architecture Pattern**: Strict Layered Separation:
  * Controllers receive requests and map to models/views.
  * Services contain validation and domain rules.
  * Repositories only perform data persistence.
* **Security Context**: Do not bypass Spring Security role checks. Use `@PreAuthorize` or `SecurityConfig.java` matchers.

### 2.2. Frontend & Template Standards
* Use Thymeleaf standard dialects (`th:text`, `th:each`, `th:if`, `th:href`, `th:action`).
* Always preserve institutional elements: Top strip, crest logo, and consistent header typography.
* Ensure all form inputs have accessible labels, placeholders, and error display alert containers.

---

## 3. Git & Documentation Discipline

1. **Commit Messages**: Follow Conventional Commits:
   * `feat: add recurring room booking support`
   * `fix: correct adjacent timeslot conflict validation`
   * `docs: update DATABASE.md with new index`
   * `refactor: optimize HikariCP idle connection eviction`
2. **Docs Synchronization**: Any schema change must update both `docs/DATABASE.md` and `supabase/schema.sql`. Any user-facing feature addition must update `docs/PRD.md`. Any structural design decision must be recorded in `docs/MEMORY.md`.
