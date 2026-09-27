# Architectural Decision Records (MEMORY.md)

This log preserves key architectural decisions, rationale, design trade-offs, and historical context for the **St. Xavier's College Room Allocation System**.

---

## ADR-001: Server-Side Rendering (Thymeleaf) vs. Single-Page Application (React/Next.js)

* **Status**: ACCEPTED
* **Date**: September 2026
* **Context**:
  The system needed to be developed, maintained, and deployed with zero complicated frontend toolchains (Node/npm, webpack, babel, bundling pipelines). The portal is primarily form-driven and tabular.
* **Decision**:
  Adopt Spring Boot standard Thymeleaf template engine with a single vanilla CSS stylesheet ([`xavier-theme.css`](file:///Users/ayush/Projects/college%20room%20allocation%20system/room-allocation/src/main/resources/static/css/xavier-theme.css)).
* **Consequences**:
  * **Positive**: Instant first-paint render times, no frontend build step, reduced attack surface, zero npm vulnerabilities.
  * **Negative**: Full page reloads on state changes (mitigated by fast local render $< 50\text{ ms}$).

---

## ADR-002: Dual-Tier Approval Workflow (HOD $\rightarrow$ Admin)

* **Status**: ACCEPTED
* **Date**: September 2026
* **Context**:
  In collegiate environments, students cannot directly book campus infrastructure without their department chairperson's consent. Similarly, HODs cannot unilaterally allocate common spaces (like MMR or Scavi) without central administration's facilities check.
* **Decision**:
  Implement a sequential two-tier approval state machine:
  $$\text{PENDING} \longrightarrow \text{HOD\_APPROVED} \longrightarrow \text{APPROVED}$$
* **Consequences**:
  * Reflects actual institutional governance accurately.
  * Clear accountability logs for who approved each stage.

---

## ADR-003: Supabase Cloud PostgreSQL with Tuned HikariCP Pool

* **Status**: ACCEPTED
* **Date**: September 2026
* **Context**:
  The user required a cloud-hosted, scalable PostgreSQL database owned directly by them. Serverless cloud databases (like Supabase over AWS) employ aggressive TCP connection dropping for idle connections.
* **Decision**:
  Utilize Supabase PostgreSQL with HikariCP configured specifically for cloud poolers:
  ```properties
  spring.datasource.hikari.maximum-pool-size=5
  spring.datasource.hikari.minimum-idle=2
  spring.datasource.hikari.idle-timeout=30000
  spring.datasource.hikari.max-lifetime=90000
  spring.datasource.hikari.connection-timeout=10000
  spring.datasource.hikari.keepalive-time=30000
  spring.datasource.hikari.connection-test-query=SELECT 1
  ```
* **Consequences**:
  * Eliminates broken pipe / socket timeout exceptions when waking up from inactivity.
  * Fits well within Supabase free-tier connection limits.

---

## ADR-004: Fast-Switch Role Controller for Development & Evaluation

* **Status**: ACCEPTED
* **Date**: September 2026
* **Context**:
  During presentations, faculty review, and testing, logging out and re-entering credentials for three different accounts (Student, HOD, Admin) creates unnecessary friction.
* **Decision**:
  Provide a dedicated [`SwitchRoleController`](file:///Users/ayush/Projects/college%20room%20allocation%20system/room-allocation/src/main/java/com/collegeroom/allocationsystem/controller/SwitchRoleController.java) at `/switch-role?role={ROLE}` that sets up the `SecurityContext` programmatically in session.
* **Consequences**:
  * One-click navigation between all 3 personas directly from the UI header and login screen.
  * Can be disabled or restricted in production via environment toggle.

---

## ADR-005: 100% Personal User Ownership Architecture

* **Status**: ACCEPTED
* **Date**: September 2026
* **Context**:
  The previous iteration utilized an external Supabase instance not owned by the user. The project must be independently owned, with personal GitHub repository control and personal Supabase cloud hosting.
* **Decision**:
  * Abstract all database connection coordinates into environment variables (`.env`).
  * Provide standalone DDL (`supabase/schema.sql`) and seed data (`supabase/seed.sql`) so the user can initialize any Supabase project with 1 click.
  * Maintain local H2 in-memory fallback so the repository remains functional even before cloud credentials are provided.
