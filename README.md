# St. Xavier's College Room Allocation System

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fayushraj-03%2Froom-allocation)
[![Spring Boot](https://img.shields.io/badge/Spring%20Boot-4.1.0-6DB33F?style=for-the-badge&logo=spring-boot&logoColor=white)](https://spring.io/projects/spring-boot)
[![Java](https://img.shields.io/badge/Java-17%20%7C%2021%20%7C%2025-ED8B00?style=for-the-badge&logo=openjdk&logoColor=white)](https://openjdk.org)
[![PostgreSQL](https://img.shields.io/badge/Supabase%20PostgreSQL-336791?style=for-the-badge&logo=postgresql&logoColor=white)](https://supabase.com)
[![Vercel](https://img.shields.io/badge/Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white)](https://vercel.com)
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
* **Zero Cold-Start Instant Deployment (Vercel & Static CDN Ready)**:
  * 0 seconds cold-start delay — opens instantly worldwide even 1, 2, or 5 years later.
  * Built with pure CSS tokens (`xavier-theme.css`), zero heavy build dependencies.
* **Cloud Database Resilience & Dual-Mode Persistence**:
  * Backed by client-side persistence and personal Supabase PostgreSQL cloud database.
  * HikariCP connection keepalives (`max-lifetime=90s`, `idle-timeout=30s`) prevent cloud pooler dropouts.
* **Fast-Switch Development Controller**:
  * One-click session role switching between Student, HOD, and Admin for friction-free showcase presentations.

---

## 🌐 Instant Online Deployment (Vercel)

Deploy to Vercel in 30 seconds with **zero cold starts** and **permanent 24/7 uptime**:

1. Click the **[Deploy with Vercel](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fayushraj-03%2Froom-allocation)** button above (or go to [vercel.com](https://vercel.com), click **Add New > Project**, and select `ayushraj-03/room-allocation`).
2. Click **Deploy**.
3. You get a permanent, blazingly fast public URL: `https://room-allocation-xxxx.vercel.app`.

---

## 🚀 Local Development

### Option A: Instant Web Mode (0s Setup)
```bash
# Serve locally using any static web server
npx serve . -l 3000
# Or simply open index.html in any browser!
```

### Option B: Java Spring Boot Backend Mode
```bash
git clone https://github.com/ayushraj-03/room-allocation.git
cd room-allocation

# Optional: configure Supabase in .env
cp .env.example .env

# Run Spring Boot (defaults to in-memory fallback if .env is omitted)
./run.sh
```
Access the application at **[http://localhost:8081](http://localhost:8081)**.

---

## 🎭 Default Showcase Accounts

| Role | Email | Password | Access Portal |
|---|---|---|---|
| **Student** | `student@test.com` | `password123` | [Student Portal](student.html) |
| **Faculty / HOD** | `hod@test.com` | `password123` | [HOD Portal](hod.html) |
| **Administrator** | `admin@test.com` | `password123` | [Admin Console](admin.html) |
| **Public Schedule** | *Public* | *N/A* | [Campus Timetable](schedule.html) |

---

## 🧪 Testing & Verification

Run the automated Java test suite covering JPA persistence, security filters, and 8 conflict boundary edge cases:
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
