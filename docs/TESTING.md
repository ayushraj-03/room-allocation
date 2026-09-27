# Testing & Quality Assurance Guide (TESTING.md)

This document outlines the testing strategy, automated test commands, validation edge cases, and manual acceptance checklists for the **St. Xavier's College Room Allocation System**.

---

## 1. Automated Testing Quickstart

Run all unit and integration tests via the Maven wrapper:
```bash
./mvnw test
```

To run a specific test class:
```bash
./mvnw test -Dtest=BookingConflictServiceTest
```

---

## 2. Critical Test Scenarios: Conflict Engine

The conflict engine in [`BookingConflictService`](file:///Users/ayush/Projects/college%20room%20allocation%20system/room-allocation/src/main/java/com/collegeroom/allocationsystem/service/BookingConflictService.java) must pass all boundary conditions below:

| Test ID | Existing Booking Window | Requested Booking Window | Expected Result | Reason |
|---|---|---|---|---|
| **TC-01** | 10:00 – 12:00 | 14:00 – 16:00 | **ALLOWED** | Completely distinct timeslots |
| **TC-02** | 10:00 – 12:00 | 10:00 – 12:00 | **CONFLICT** | Identical timeslot overlap |
| **TC-03** | 10:00 – 12:00 | 09:00 – 10:30 | **CONFLICT** | Requested end time intrudes into existing booking |
| **TC-04** | 10:00 – 12:00 | 11:30 – 13:00 | **CONFLICT** | Requested start time intrudes into existing booking |
| **TC-05** | 10:00 – 12:00 | 09:00 – 13:00 | **CONFLICT** | Requested slot completely encloses existing booking |
| **TC-06** | 09:00 – 13:00 | 10:00 – 12:00 | **CONFLICT** | Requested slot is inside existing booking |
| **TC-07** | 10:00 – 12:00 | 12:00 – 14:00 | **ALLOWED** | Adjacent / back-to-back: end time equals start time |
| **TC-08** | 10:00 – 12:00 (Today) | 10:00 – 12:00 (Tomorrow) | **ALLOWED** | Different calendar dates |
| **TC-09** | 10:00 – 12:00 (REJECTED) | 10:00 – 12:00 | **ALLOWED** | Rejected bookings do not block rooms |
| **TC-10** | 10:00 – 12:00 (ID: 42) | 10:00 – 12:00 (excludeId=42) | **ALLOWED** | Booking updating itself must not conflict with itself |

---

## 3. Security & Route Protection Test Cases

| Route | Role | Expected HTTP Status / Action |
|---|---|---|
| `/student/dashboard` | Unauthenticated | Redirect to `/login` |
| `/student/dashboard` | `ROLE_STUDENT` | `200 OK` |
| `/student/dashboard` | `ROLE_ADMIN` | `200 OK` (Admin has oversight) |
| `/hod/dashboard` | `ROLE_STUDENT` | `403 Forbidden` $\rightarrow$ Redirect to `/login?error=access_denied` |
| `/hod/dashboard` | `ROLE_HOD` | `200 OK` |
| `/admin/dashboard` | `ROLE_STUDENT` | `403 Forbidden` $\rightarrow$ Redirect to `/login?error=access_denied` |
| `/admin/dashboard` | `ROLE_HOD` | `403 Forbidden` $\rightarrow$ Redirect to `/login?error=access_denied` |
| `/admin/dashboard` | `ROLE_ADMIN` | `200 OK` |

---

## 4. Manual End-to-End Acceptance Walkthrough

### Test Run: Complete Booking Lifecycle
1. **Launch App**: Execute `./run.sh` and open `http://localhost:8081`.
2. **Student Submits Request**:
   * Visit `http://localhost:8081/switch-role?role=STUDENT`.
   * Search for room `Lrs 1`.
   * Submit booking for tomorrow, `10:00` to `12:00`, Purpose: "Debate Society Orientation".
   * Verify status badge shows **PENDING** (Amber).
3. **HOD Endorsement**:
   * Switch role via `http://localhost:8081/switch-role?role=HOD`.
   * Locate the pending request under departmental requisitions.
   * Click **Endorse / Approve**.
   * Verify status updates to **HOD_APPROVED** (Blue).
4. **Admin Final Sanction**:
   * Switch role via `http://localhost:8081/switch-role?role=ADMIN`.
   * Locate the HOD-endorsed request under "Pending Central Approvals".
   * Click **Grant Approval**.
   * Verify status updates to **APPROVED** (Emerald).
5. **Conflict Validation**:
   * Switch back to Student (`/switch-role?role=STUDENT`).
   * Attempt to book `Lrs 1` for the same date and overlapping window `11:00` to `13:00`.
   * Verify red conflict alert triggers: "Selected room is already occupied during this timeslot."
6. **Schedule Verification**:
   * Navigate to `/schedule`.
   * Verify `Lrs 1` displays the booked block in the visual timetable.
