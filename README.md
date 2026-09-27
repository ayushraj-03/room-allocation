# St. Xavier's College Room Allocation System

An institutional room requisition and venue allocation platform designed for **St. Xavier's College (Autonomous), Mumbai**, featuring the heritage Jesuit academic visual design language and powered by Spring Boot and Supabase PostgreSQL.

---

## Quick Start

### 1. Configure Database (Supabase or Local)
Copy `.env.example` to `.env` and fill in your personal Supabase credentials:
```bash
cp .env.example .env
```
*(If `.env` is omitted, the app automatically falls back to an embedded in-memory H2 database for local testing).*

### 2. Start Application
```bash
./run.sh
```
Or with Maven directly:
```bash
./mvnw spring-boot:run
```
Access the application at [http://localhost:8081](http://localhost:8081).

---

## Instant Role Switching (Development & Demos)

Quick-switch between personas without logging in:
* **Student Portal**: [http://localhost:8081/switch-role?role=STUDENT](http://localhost:8081/switch-role?role=STUDENT)
* **HOD Portal**: [http://localhost:8081/switch-role?role=HOD](http://localhost:8081/switch-role?role=HOD)
* **Admin Portal**: [http://localhost:8081/switch-role?role=ADMIN](http://localhost:8081/switch-role?role=ADMIN)

---

## Documentation Framework

The system includes a complete documentation architecture in `docs/`:

* [AGENTS.md](AGENTS.md) — Operational guidelines and invariants for AI agents.
* [docs/PRD.md](docs/PRD.md) — Product Requirements Document (features, personas, room inventory).
* [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) — System architecture, Spring Boot, Security, and conflict engine.
* [docs/DATABASE.md](docs/DATABASE.md) — ERD, data dictionary, Supabase pooling, and setup guide.
* [docs/DESIGN.md](docs/DESIGN.md) — St. Xavier's Jesuit heritage tokens, colors, typography, and UI specs.
* [docs/RULES.md](docs/RULES.md) — AI modification governance rules and invariants.
* [docs/TASKS.md](docs/TASKS.md) — Task board, milestone checklist, and feature backlog.
* [docs/TESTING.md](docs/TESTING.md) — Testing protocols, conflict edge cases, and acceptance checklist.
* [docs/MEMORY.md](docs/MEMORY.md) — Architectural Decision Records (ADRs).
