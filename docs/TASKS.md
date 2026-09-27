# Task Board & Project Roadmap (TASKS.md)

## Active Milestone: Rebuild & Complete User Ownership

This milestone focuses on migrating the project to complete user ownership (personal Supabase PostgreSQL cloud database, personal GitHub repository under `ayushraj-03`), and standardizing the architecture around the documentation system.

---

### Task Checklist

- [x] **Phase 1: Codebase Setup & Organization**
  - [x] Create clean `room-allocation/` workspace.
  - [x] Extract models, controllers, services, repositories, templates, and static assets.
  - [x] Setup `AGENTS.md` operational manual for AI pairing.

- [x] **Phase 2: Comprehensive Documentation Architecture**
  - [x] `docs/PRD.md` (Product requirements, user personas, room catalog).
  - [x] `docs/ARCHITECTURE.md` (Layered design, Spring Boot, Spring Security, request flow).
  - [x] `docs/DATABASE.md` (ERD, data dictionary, HikariCP pooling, Supabase step-by-step).
  - [x] `docs/DESIGN.md` (St. Xavier's Jesuit heritage tokens, typography, component specs).
  - [x] `docs/RULES.md` (AI governance invariants, conflict rules, coding standards).
  - [x] `docs/TASKS.md` (Task tracker and milestone roadmap).
  - [ ] `docs/TESTING.md` (Automated & manual testing protocols).
  - [ ] `docs/MEMORY.md` (Architectural Decision Records).

- [ ] **Phase 3: Supabase Cloud & Persistence Configuration**
  - [ ] Update `application.properties` to support environment-variable-driven Supabase credentials with local fallback.
  - [ ] Create `.env.example` with exact connection string format.
  - [ ] Author `supabase/schema.sql` (one-click DDL script for Supabase SQL Editor).
  - [ ] Author `supabase/seed.sql` (initial room inventory and test users).

- [ ] **Phase 4: Compilation & Automated Verification**
  - [ ] Verify Maven compilation with `./mvnw clean compile`.
  - [ ] Run test suite with `./mvnw test`.

- [ ] **Phase 5: GitHub Repository Creation & Push**
  - [ ] Initialize git in `room-allocation/`.
  - [ ] Add `.gitignore` (ignoring `.env`, `target/`, IDE files).
  - [ ] Create initial commit.
  - [ ] Create remote GitHub repository under authenticated account `ayushraj-03` via `gh repo create` and push.

- [ ] **Phase 6: Runtime Verification**
  - [ ] Boot application with `./run.sh` on port 8081.
  - [ ] Verify login page, student portal, HOD portal, and admin portal.

---

## Future Roadmap (Backlog)

1. **Email / SMS Notifications**: Send automated SMTP notifications when an HOD endorses or rejects a student's booking.
2. **Requisition Slip PDF Export**: Allow students to download a signed institutional PDF voucher once their booking status hits `APPROVED`.
3. **Recurring Room Allocations**: Support weekly repeating reservations for whole-semester timetable scheduling.
4. **Maintenance Blackouts**: Allow campus administration to mark rooms as unavailable due to renovation or examinations.
