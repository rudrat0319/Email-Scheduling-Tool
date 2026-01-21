# Email-Scheduling-Tool

## Overview

This repository contains a **backend-first implementation** of an email scheduling system inspired by real-world email infrastructure. The system is designed to reliably schedule and send emails at scale using **BullMQ delayed jobs (no cron)**, **Redis**, and **PostgreSQL**, with strong guarantees around **persistence, idempotency, concurrency, and rate limiting**.

Due to time constraints close to the deadline, the primary focus of this submission is the **backend architecture and core scheduling logic**. The backend is fully structured to support the required frontend, deployment, and demo with minimal additional work.

---

## Tech Stack

### Backend

* **TypeScript**
* **Express.js**
* **TypeORM**
* **PostgreSQL**
* **BullMQ**
* **Redis**
* **Nodemailer + Ethereal Email (SMTP)**

### Frontend (planned / partially wired)

* **Next.js**
* **NextAuth**
* **React**
* **Tailwind CSS**

---

## What Is Fully Implemented

### 1. Authentication Architecture

* Manual authentication (email + password hashing)
* OAuth-ready design (Google via NextAuth planned)
* JWT/session-based protection for backend APIs
* Clean separation of auth logic (controller → service → repository)

### 2. Email Scheduling System (Core Requirement)

* Accepts email scheduling requests via API
* Supports:

  * Subject & body
  * Multiple recipients
  * Start time
  * Delay between emails
  * Hourly rate limits
  * Multiple sender identities
* Stores all scheduling intent in PostgreSQL (source of truth)

### 3. Deterministic Scheduling Engine

* Computes `scheduledAt` timestamps per recipient
* Enforces:

  * Minimum delay between emails
  * Hourly send caps
* Preserves order as much as possible
* Prevents overload scenarios (e.g. 1000+ emails scheduled at same time)

### 4. BullMQ-Based Job Scheduling (No Cron)

* One BullMQ delayed job per recipient
* Redis-backed persistence
* Jobs survive server and worker restarts
* No OS-level or Node cron usage

### 5. Worker & Email Dispatch

* Separate worker process
* Configurable concurrency via environment variables
* SMTP sending via Ethereal Email
* Clean provider abstraction (SMTP provider interface)

### 6. Idempotency & Safety Guarantees

* Atomic DB state transitions:

  * `scheduled → processing → sent / failed`
* Prevents duplicate sends across:

  * Retries
  * Worker restarts
  * Parallel workers

### 7. Rate Limiting Strategy

* Hourly limits enforced at scheduling time
* Redis/DB-safe design (no in-memory counters)
* Easily extendable to runtime enforcement if needed

### 8. Production-Style Architecture

* Clear layering:

  * Controllers
  * Services
  * Repositories
  * Queue abstraction
  * Worker
* Centralized config management
* Structured error handling
* DTO-based request/response contracts

---

## What Is Not Fully Implemented (Due to Time Constraints)

The following items are **not completed** due to time limitations near the deadline:

* Frontend UI (React / Next.js dashboard)
* Deployment to Render
* Demo video recording

The backend APIs, data models, and flows are **fully prepared** to support these components with minimal additional work.

---

## Backend Architecture Overview

### High-Level Flow

```
Frontend
   ↓
Express API (Controllers)
   ↓
Services (Business Logic)
   ↓
Repositories (PostgreSQL via TypeORM)
   ↓
Scheduling Engine (compute send times)
   ↓
BullMQ Queue (Redis, delayed jobs)
   ↓
Worker Process
   ↓
SMTP Provider (Ethereal)
```

### Restart Survivability

* Scheduled jobs persist in Redis
* Email state persists in PostgreSQL
* Worker restarts do not re-send completed emails
* Future emails continue sending correctly after restarts

---

## API → Worker Lifecycle (Simplified)

1. User submits schedule request
2. Backend validates input and sender ownership
3. Batch and email job records are created in DB
4. Send times are computed deterministically
5. BullMQ delayed jobs are enqueued
6. Worker processes jobs at scheduled times
7. Email is sent via SMTP
8. DB status is updated (`sent` / `failed`)
9. Dashboard APIs reflect updated state

---

## Backend Folder Structure (Final)

```
src/
  app.ts
  server.ts
  routes.ts

  config/
    index.ts
    env.schema.ts
    constants.ts

  errors/
    AppError.ts
    ValidationError.ts
    UnauthorizedError.ts
    ForbiddenError.ts
    NotFoundError.ts
    ConflictError.ts
    InternalServerError.ts

  middleware/
    auth.middleware.ts
    validation.middleware.ts
    errorHandler.middleware.ts
    requestId.middleware.ts

  controllers/
    auth.controller.ts
    sender.controller.ts
    emailBatch.controller.ts
    emailJobs.controller.ts

  services/
    auth.service.ts
    sender.service.ts
    emailScheduling.service.ts
    schedulingEngine.ts
    emailJobQuery.service.ts
    emailDispatch.service.ts

  repositories/
    user.repository.ts
    sender.repository.ts
    emailBatch.repository.ts
    emailJob.repository.ts

  db/
    data-source.ts
    migrations/

  entities/
    user.entity.ts
    sender.entity.ts
    emailBatch.entity.ts
    emailJob.entity.ts

  dtos/
    auth/
    sender/
    email/
    pagination/

  queue/
    queue.types.ts
    queue.service.ts
    bullmqEmailQueue.service.ts
    queue.connection.ts

  worker/
    index.ts
    processor.ts

  providers/
    smtpEmailProvider.ts
    nodemailerEthereal.provider.ts
```

(Each folder contains focused, single-responsibility modules following controller–service–repository layering.)

---

## How the Frontend Would Connect (Planned)

| Frontend Feature | Backend Endpoint               | Backend Layer        |
| ---------------- | ------------------------------ | -------------------- |
| Login / Signup   | `/auth/login`, `/auth/signup`  | AuthController       |
| Sender dropdown  | `/senders`                     | SenderController     |
| Schedule email   | `/email-batches`               | EmailBatchController |
| Scheduled table  | `/email-jobs?status=scheduled` | EmailJobsController  |
| Sent table       | `/email-jobs?status=sent`      | EmailJobsController  |

---

## Running the Backend Locally

### Prerequisites

* Node.js 18+
* PostgreSQL
* Redis

### Install

```bash
npm install
```

### Environment Variables

Create a `.env` file in the backend root:

```env
PORT=4000
DATABASE_URL=postgres://reachinbox:reachinbox@localhost:5432/reachinbox
REDIS_HOST=127.0.0.1
REDIS_PORT=6379
WORKER_CONCURRENCY=5
JWT_SECRET=example_secret
```

> **Important note on credentials**
> All database and redis-related values such as `db_name`, `db_username`, and `db_password` used in this repository are **placeholder / default values only**.
> They do **not** represent personal, production, or sensitive credentials and are intended solely for local development and evaluation purposes.

### Run API

```bash
npm run dev
```

### Run Worker (separate terminal)

```bash
npm run worker
```

---

## Notes on Trade-offs & Assumptions

* Hourly rate limits are enforced deterministically during scheduling to simplify concurrency safety
* Redis is used solely for queue persistence (no cron, no in-memory counters)
* Ethereal Email is used for safe SMTP testing
* Frontend and deployment were deprioritized to focus on backend correctness and architecture

---

## Closing Note

This submission intentionally prioritizes **backend system design, reliability, and correctness**, which are the most critical aspects of large-scale email scheduling systems. The remaining frontend, deployment, and demo steps are largely execution-oriented and can be completed with limited additional effort.

---

If you want, I can **shorten this README**, **tailor it to a backend-only role**, or help you add a **one-paragraph submission note** to include in the assignment portal.
