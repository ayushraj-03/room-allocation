# St. Xavier's College Room Allocation System

[![Spring Boot](https://img.shields.io/badge/Spring%20Boot-4.1.0-6DB33F?style=for-the-badge&logo=spring-boot&logoColor=white)](https://spring.io/projects/spring-boot)
[![Java](https://img.shields.io/badge/Java-17%20%7C%2021%20%7C%2025-ED8B00?style=for-the-badge&logo=openjdk&logoColor=white)](https://openjdk.org)
[![PostgreSQL](https://img.shields.io/badge/Supabase%20PostgreSQL-336791?style=for-the-badge&logo=postgresql&logoColor=white)](https://supabase.com)
[![Thymeleaf](https://img.shields.io/badge/Thymeleaf-005F0F?style=for-the-badge&logo=thymeleaf&logoColor=white)](https://www.thymeleaf.org/)
[![Spring Security](https://img.shields.io/badge/Spring%20Security-6DB33F?style=for-the-badge&logo=springsecurity&logoColor=white)](https://spring.io/projects/spring-security)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge)](https://opensource.org/licenses/MIT)

An enterprise-grade institutional room requisition and venue allocation platform built for **St. Xavier's College (Autonomous), Mumbai** (Estd. 1869). Designed with a collegiate Jesuit heritage aesthetic, a dual-tier authorization engine, and real-time conflict-free timeslot scheduling.

---

## 🏛️ System Architecture & Workflow

```
[Student / Club] ─── Submit Request ───► [PENDING]
                                              │
                                     HOD Endorsement
                                              ▼
                                       [HOD_APPROVED]
                                              │
                                       Admin Sanction
                                              ▼
                                         [APPROVED] ───► Published to Campus Timetable
```

---

## ✨ Key Engineering Highlights

* **Dual-Tier Hierarchical Approval State Machine**:
  * **Student Portal**: Venue search across 90+ campus rooms, booking requisition submission, and real-time status tracking.
  * **HOD Portal**: Academic faculty review and departmental endorsement queue.
  * **Admin Console**: Central facilities management, room inventory CRUD, and final allotment authority.
* **Strict Mathematical Conflict Detection**:
  * Evaluates interval overlap $(S_{\text{req}} < E_{\text{existing}} \land E_{\text{req}} > S_{\text{existing}})$ in real time.
  * Seamlessly permits back-to-back/adjacent bookings while preventing double reservations.
* **Institutional Jesuit Heritage Design System**:
  * Tailored palette: St. Xavier's Maroon (`#741114`), Academic Gold (`#b38728`), and Warm Cream (`#faf7f2`).
  * Pure CSS token architecture (`xavier-theme.css`) with zero heavy client JavaScript framework bloat.
* **Cloud Database Resilience**:
  * Powered by Supabase PostgreSQL with HikariCP connection keepalives (`max-lifetime=90s`, `idle-timeout=30s`) to survive cloud TCP pooler timeouts.
  * Automated fallback to embedded in-memory database for immediate offline local development.
* **Fast-Switch Development Controller**:
  * One-click session role switching (`/switch-role?role={ROLE}`) for friction-free demos and evaluations.

---

## 🚀 Quick Start

### Prerequisites
* Java 17, 21, or 25 installed
* Git

### 1. Clone & Configure
```bash
git clone https://github.com/ayushraj-03/room-allocation.git
cd room-allocation
```

### 2. Configure Database (Optional)
```bash
cp .env.example .env
```
*(If `.env` is omitted, the application automatically boots into an in-memory database pre-seeded with all campus rooms and demo accounts).*

### 3. Launch Application
```bash
./run.sh
```
Or directly with Maven:
```bash
./mvnw spring-boot:run
```
The application will start on **[http://localhost:8081](http://localhost:8081)**.

---

## 🎭 Default Accounts & Fast-Switch Links

| Role | Email | Password | Direct Portal Link |
|---|---|---|---|
| **Student** | `student@test.com` | `password123` | [Student Dashboard](http://localhost:8081/switch-role?role=STUDENT) |
| **Faculty / HOD** | `hod@test.com` | `password123` | [HOD Dashboard](http://localhost:8081/switch-role?role=HOD) |
| **Administrator** | `admin@test.com` | `password123` | [Admin Console](http://localhost:8081/switch-role?role=ADMIN) |
| **Public Schedule** | *Public* | *N/A* | [Campus Schedule View](http://localhost:8081/schedule) |

---

## 🧪 Testing & Verification

Run the automated test suite covering JPA persistence, security filters, and 8 conflict boundary edge cases:
```bash
./mvnw test
```

```text
[INFO] Running com.collegeroom.allocationsystem.service.BookingConflictServiceTest
[INFO] Tests run: 8, Failures: 0, Errors: 0, Skipped: 0
[INFO] Running com.collegeroom.allocationsystem.AllocationsystemApplicationTests
[INFO] Tests run: 1, Failures: 0, Errors: 0, Skipped: 0
[INFO] BUILD SUCCESS (9 tests passed)
```

---

## 📚 Complete Documentation Framework

The repository is structured with an agentic documentation architecture in `docs/`:

| Document | Purpose |
|---|---|
| [AGENTS.md](AGENTS.md) | Operational guidelines and binding invariants for AI agents |
| [docs/PRD.md](docs/PRD.md) | Product Requirements Document (features, personas, room catalog) |
| [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) | Layered architecture, Spring Boot, Security, and conflict engine |
| [docs/DATABASE.md](docs/DATABASE.md) | ERD, data dictionary, Supabase pooling, and migration guide |
| [docs/DESIGN.md](docs/DESIGN.md) | St. Xavier's Jesuit design tokens, typography, and component specifications |
| [docs/RULES.md](docs/RULES.md) | AI modification governance rules and invariants |
| [docs/TASKS.md](docs/TASKS.md) | Task tracker, milestone progress, and feature backlog |
| [docs/TESTING.md](docs/TESTING.md) | Testing protocols, conflict edge cases, and acceptance checklists |
| [docs/MEMORY.md](docs/MEMORY.md) | Architectural Decision Records (ADRs) |

---

## 📄 License
This project is open-source under the [MIT License](LICENSE).
