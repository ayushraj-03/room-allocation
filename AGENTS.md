# AGENTS.md - Agent Operations Manual

Welcome to the **St. Xavier's College Room Allocation System** codebase. This document serves as the operational guide for autonomous AI agents, coding assistants, and human engineers collaborating on this system.

---

## 1. System Mission & Summary

The **St. Xavier's College Room Allocation System** is an enterprise institutional scheduling and venue allocation platform tailored for St. Xavier's College (Autonomous), Mumbai. It streamlines classroom, lecture hall, and laboratory booking workflows across students, faculty heads (HODs), and campus administrators while preserving the historic Jesuit academic visual identity.

### Core Value Proposition
- **Dual-Tier Approval Engine**: Student requests $\rightarrow$ Department HOD endorsement $\rightarrow$ Central Campus Administration approval.
- **Strict Conflict Prevention**: Prevents double-booking overlaps in real-time across rooms and timeslots.
- **Autonomous Heritage UI**: Server-side rendered Thymeleaf views styled with St. Xavier's institutional maroon, cream, and gold palette (`xavier-theme.css`).
- **Cloud Database Ownership**: Backed by the user's personal Supabase PostgreSQL database with HikariCP connection resilience.

---

## 2. Directory Architecture

```text
room-allocation/
│
├── AGENTS.md                                # This operations manual
│
├── docs/                                    # System Documentation Framework
│   ├── PRD.md                              # Product Requirements & Capabilities
│   ├── ARCHITECTURE.md                     # Technical Architecture & Patterns
│   ├── DATABASE.md                         # Supabase DB Schema, DDL & Pooling
│   ├── DESIGN.md                           # Xavier Heritage Design Tokens & Layouts
│   ├── RULES.md                            # AI Modification Constraints & Invariants
│   ├── TASKS.md                            # Active Task Tracker & Milestones
│   ├── TESTING.md                          # Testing Strategy & Validation Protocols
│   └── MEMORY.md                           # Architectural Decision Records (ADRs)
│
├── supabase/                                # Supabase Migration & Seed Scripts
│   ├── schema.sql                          # Complete DDL table definitions
│   └── seed.sql                            # Initial room catalog & user accounts
│
├── src/
│   ├── main/
│   │   ├── java/com/collegeroom/allocationsystem/
│   │   │   ├── AllocationsystemApplication.java
│   │   │   ├── AdminController.java
│   │   │   ├── StudentController.java
│   │   │   ├── ScheduleController.java
│   │   │   ├── RoomDataSeeder.java
│   │   │   ├── HodTestDataSeeder.java
│   │   │   ├── controller/                 # HOD, Login, SwitchRole
│   │   │   ├── model/                      # JPA Entities (Booking, Room, User, Enums)
│   │   │   ├── repository/                 # Spring Data JPA interfaces
│   │   │   ├── security/                   # Spring Security & Role handlers
│   │   │   └── service/                    # Business logic (BookingConflictService)
│   │   └── resources/
│   │       ├── application.properties      # Spring & DataSource configuration
│   │       ├── static/
│   │       │   ├── css/xavier-theme.css    # Official Xavier's UI stylesheet
│   │       │   └── images/xavier-logo.png  # Official institutional crest
│   │       └── templates/                  # Thymeleaf view templates
│   └── test/                               # JUnit test suites
│
├── .env.example                             # Supabase credentials template
├── pom.xml                                  # Maven dependencies & build plugins
├── mvnw / mvnw.cmd                          # Maven wrapper executables
└── run.sh                                   # One-click execution script
```

---

## 3. Quickstart & Command Reference

| Action | Command | Notes |
|---|---|---|
| **Compile & Build** | `./mvnw clean compile` | Validates Java syntax & dependencies |
| **Run Application** | `./run.sh` or `./mvnw spring-boot:run` | Runs on port 8081 |
| **Run Unit Tests** | `./mvnw test` | Executes test suite |
| **Check Port Status** | `lsof -i :8081` | Verify running server process |
| **Database Setup** | See `docs/DATABASE.md` | Configure `.env` with Supabase JDBC URL |

### Default Development Accounts & Fast-Switch
For rapid testing and debugging without manual credential entry, use the `/switch-role` endpoint:
* **Admin**: `admin@test.com` / `password123` $\rightarrow$ [`/switch-role?role=ADMIN`](http://localhost:8081/switch-role?role=ADMIN)
* **HOD**: `hod@test.com` / `password123` $\rightarrow$ [`/switch-role?role=HOD`](http://localhost:8081/switch-role?role=HOD)
* **Student**: `student@test.com` / `password123` $\rightarrow$ [`/switch-role?role=STUDENT`](http://localhost:8081/switch-role?role=STUDENT)

---

## 4. Invariants for AI Agents (Rules of the Road)

When modifying this repository, AI agents must abide by the following invariants (detailed in `docs/RULES.md`):

1. **Conflict Check Invariant**: Never bypass [`BookingConflictService`](file:///Users/ayush/Projects/college%20room%20allocation%20system/room-allocation/src/main/java/com/collegeroom/allocationsystem/service/BookingConflictService.java) when booking or rescheduling a room. Overlapping bookings for `PENDING`, `HOD_APPROVED`, or `APPROVED` statuses must fail fast with an informative error message.
2. **Design Language Invariant**: Do not introduce external CSS frameworks (Bootstrap, Tailwind, Material) or heavy JS frameworks (React, Angular). The user interface is strictly bound to the institutional Jesuit heritage stylesheet [`xavier-theme.css`](file:///Users/ayush/Projects/college%20room%20allocation%20system/room-allocation/src/main/resources/static/css/xavier-theme.css).
3. **Dual-Tier State Invariant**: Booking status must advance through the defined enum state machine:
   $$\text{PENDING} \longrightarrow \text{HOD\_APPROVED} \longrightarrow \text{APPROVED}$$
   (or direct rejection to $\text{REJECTED}$). Direct jumping from `PENDING` to `APPROVED` without HOD approval violates institutional policy unless an Admin explicitly overrides.
4. **Credential Security**: Never hardcode credentials into `application.properties` or source code. Always consume environment variables (`DB_URL`, `DB_USERNAME`, `DB_PASSWORD`) and keep personal secrets in `.env` (which is gitignored).
5. **Documentation Synchronization**: If adding new models, controllers, or workflows, update `docs/PRD.md`, `docs/ARCHITECTURE.md`, `docs/DATABASE.md`, and record major decisions in `docs/MEMORY.md`.

---

## 5. Documentation Directory Map

| Document | Purpose | Primary Readership |
|---|---|---|
| [docs/PRD.md](file:///Users/ayush/Projects/college%20room%20allocation%20system/room-allocation/docs/PRD.md) | **WHAT** the system does: user roles, booking lifecycle, requirements | Product Managers, Stakeholders, Agents |
| [docs/ARCHITECTURE.md](file:///Users/ayush/Projects/college%20room%20allocation%20system/room-allocation/docs/ARCHITECTURE.md) | **HOW** the code works: Spring Boot, MVC routes, security context | Backend & Full-Stack Developers |
| [docs/DATABASE.md](file:///Users/ayush/Projects/college%20room%20allocation%20system/room-allocation/docs/DATABASE.md) | **HOW** data is structured: tables, ERD, HikariCP, Supabase pooling | DBA, Backend Engineers |
| [docs/DESIGN.md](file:///Users/ayush/Projects/college%20room%20allocation%20system/room-allocation/docs/DESIGN.md) | **HOW** the UI looks: typography, CSS variables, components, layout | UI/UX Designers, Frontend Engineers |
| [docs/RULES.md](file:///Users/ayush/Projects/college%20room%20allocation%20system/room-allocation/docs/RULES.md) | **HOW** AI must modify code: strict constraints, testing requirements | Autonomous Agents & AI Assistants |
| [docs/TASKS.md](file:///Users/ayush/Projects/college%20room%20allocation%20system/room-allocation/docs/TASKS.md) | **WHAT** we're doing: task board, active sprints, backlog | Engineers, Agents, Project Leads |
| [docs/TESTING.md](file:///Users/ayush/Projects/college%20room%20allocation%20system/room-allocation/docs/TESTING.md) | **HOW** we verify it: unit test scenarios, conflict edge cases, E2E | QA Engineers, Automated CI/CD |
| [docs/MEMORY.md](file:///Users/ayush/Projects/college%20room%20allocation%20system/room-allocation/docs/MEMORY.md) | **IMPORTANT** decisions: ADRs, lessons learned, legacy context | All Collaborators |
