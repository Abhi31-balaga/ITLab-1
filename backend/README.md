# Backend API Guide

This document describes the backend service contract for ITLab-2. The backend currently contains only its package metadata, so the commands and API contract below should be treated as the implementation target for backend, database, and frontend teammates.

## Project setup

1. Install Node.js 20 LTS or newer.
2. From the repository root, move into the backend workspace:

   ```bash
   cd backend
   ```

3. Create an environment file from the variables listed below:

   ```bash
   cp .env.example .env
   ```

   If `.env.example` has not been committed yet, create `.env` manually with the variables in the next section.

4. Install dependencies.

## Install command

```bash
npm install
```

## Environment variables

| Variable | Required | Example | Purpose |
| --- | --- | --- | --- |
| `NODE_ENV` | Yes | `development` | Runtime mode: `development`, `test`, or `production`. |
| `PORT` | Yes | `4000` | HTTP port used by the backend server. |
| `DATABASE_URL` | Yes | `postgresql://user:password@localhost:5432/itlab` | Database connection string supplied by the database teammate. |
| `JWT_SECRET` | Yes | `replace-with-a-long-random-secret` | Secret used to sign and verify access tokens. |
| `JWT_EXPIRES_IN` | Yes | `1h` | Access-token lifetime. |
| `BCRYPT_ROUNDS` | Yes | `12` | Password hashing cost factor. |
| `CORS_ORIGIN` | Yes | `http://localhost:5173` | Allowed frontend origin. |
| `SEED_ADMIN_EMAIL` | No | `admin@example.com` | Optional initial admin account email for local seed data. |
| `SEED_ADMIN_PASSWORD` | No | `ChangeMe123!` | Optional initial admin account password for local seed data. |

Never commit `.env` files or real secrets.

## How to start backend

Use the package script below once the backend server entry point exists:

```bash
npm run dev
```

Expected local URL:

```text
http://localhost:4000
```

Recommended production start command after implementation:

```bash
npm start
```

## Authentication format

Use JSON Web Tokens for authenticated requests.

```http
Authorization: Bearer <accessToken>
Content-Type: application/json
```

Login responses should include a token and a minimal user profile:

```json
{
  "accessToken": "eyJhbGciOi...",
  "user": {
    "id": "usr_123",
    "name": "Amina Student",
    "email": "amina@example.com",
    "role": "student"
  }
}
```

Requests without a valid token must return `401 Unauthorized`. Requests from an authenticated user without the required role must return `403 Forbidden`.

## Role permissions

| Role | Permissions |
| --- | --- |
| `admin` | Manage users, courses, exams, questions, registrations, and view all results. |
| `teacher` | Create and update owned exams, create questions for owned exams, publish or close owned exams, and view submissions/results for owned exams. |
| `student` | View available exams, start assigned exams, submit answers, and view own results only after release. |

Security rules:

- Students must never be able to create, edit, delete, or inspect exam answer keys.
- Active exam question responses must never include `correctAnswer`, answer keys, marks, or scoring metadata.
- Result endpoints may expose scores only after the exam is submitted and the result is released or otherwise allowed by policy.

## API endpoint table

| Method | Endpoint | Auth | Roles | Description |
| --- | --- | --- | --- | --- |
| `GET` | `/health` | No | Public | Health check for uptime monitoring. |
| `POST` | `/auth/register` | No | Public | Create a student account, unless disabled by admin policy. |
| `POST` | `/auth/login` | No | Public | Authenticate and return an access token. |
| `GET` | `/auth/me` | Yes | Any | Return the current authenticated user. |
| `GET` | `/users` | Yes | `admin` | List users. |
| `POST` | `/users` | Yes | `admin` | Create a user with a specific role. |
| `PATCH` | `/users/:id` | Yes | `admin` | Update user profile, status, or role. |
| `GET` | `/exams` | Yes | Any | List exams visible to the current user. |
| `POST` | `/exams` | Yes | `admin`, `teacher` | Create an exam. |
| `GET` | `/exams/:id` | Yes | `admin`, `teacher`, assigned `student` | Return exam details. Student-safe responses must omit answer and scoring metadata. |
| `PATCH` | `/exams/:id` | Yes | `admin`, owner `teacher` | Update exam settings. |
| `DELETE` | `/exams/:id` | Yes | `admin`, owner `teacher` | Delete a draft exam. |
| `POST` | `/exams/:id/publish` | Yes | `admin`, owner `teacher` | Publish an exam for eligible students. |
| `POST` | `/exams/:id/start` | Yes | Assigned `student` | Start an exam attempt and return active questions. |
| `POST` | `/exams/:id/submit` | Yes | Assigned `student` | Submit completed answers for grading. |
| `GET` | `/exams/:id/questions` | Yes | `admin`, owner `teacher` | List full question records, including answer keys and marks. |
| `POST` | `/exams/:id/questions` | Yes | `admin`, owner `teacher` | Add a question to an exam. |
| `PATCH` | `/questions/:id` | Yes | `admin`, owner `teacher` | Update a question. |
| `DELETE` | `/questions/:id` | Yes | `admin`, owner `teacher` | Delete a question. |
| `GET` | `/results` | Yes | `admin`, `teacher` | List results visible to staff. |
| `GET` | `/results/me` | Yes | `student` | List the current student's released results. |
| `GET` | `/results/:id` | Yes | `admin`, owner `teacher`, owning `student` | Return one result if access policy allows it. |

## Request/response examples

### Login

Request:

```http
POST /auth/login
Content-Type: application/json
```

```json
{
  "email": "amina@example.com",
  "password": "CorrectHorseBatteryStaple"
}
```

Response:

```json
{
  "accessToken": "eyJhbGciOi...",
  "user": {
    "id": "usr_123",
    "name": "Amina Student",
    "email": "amina@example.com",
    "role": "student"
  }
}
```

### Create exam

Request:

```http
POST /exams
Authorization: Bearer <teacher-token>
Content-Type: application/json
```

```json
{
  "title": "JavaScript Basics Midterm",
  "description": "Covers variables, functions, arrays, and objects.",
  "durationMinutes": 60,
  "startsAt": "2026-09-01T09:00:00.000Z",
  "endsAt": "2026-09-01T11:00:00.000Z"
}
```

Response:

```json
{
  "id": "exam_123",
  "title": "JavaScript Basics Midterm",
  "description": "Covers variables, functions, arrays, and objects.",
  "durationMinutes": 60,
  "status": "draft",
  "startsAt": "2026-09-01T09:00:00.000Z",
  "endsAt": "2026-09-01T11:00:00.000Z",
  "createdBy": "usr_teacher_1"
}
```

### Add question

Request:

```http
POST /exams/exam_123/questions
Authorization: Bearer <teacher-token>
Content-Type: application/json
```

```json
{
  "type": "multiple_choice",
  "prompt": "Which keyword declares a block-scoped variable in JavaScript?",
  "options": ["var", "let", "function", "return"],
  "correctAnswer": "let",
  "marks": 2
}
```

Response:

```json
{
  "id": "q_123",
  "examId": "exam_123",
  "type": "multiple_choice",
  "prompt": "Which keyword declares a block-scoped variable in JavaScript?",
  "options": ["var", "let", "function", "return"],
  "correctAnswer": "let",
  "marks": 2
}
```

### Start active exam

Request:

```http
POST /exams/exam_123/start
Authorization: Bearer <student-token>
Content-Type: application/json
```

Response:

```json
{
  "attemptId": "attempt_123",
  "exam": {
    "id": "exam_123",
    "title": "JavaScript Basics Midterm",
    "durationMinutes": 60,
    "startedAt": "2026-09-01T09:05:00.000Z",
    "endsAt": "2026-09-01T10:05:00.000Z"
  },
  "questions": [
    {
      "id": "q_123",
      "type": "multiple_choice",
      "prompt": "Which keyword declares a block-scoped variable in JavaScript?",
      "options": ["var", "let", "function", "return"]
    }
  ]
}
```

The active exam response above intentionally excludes `correctAnswer`, answer keys, marks, and scoring metadata. This rule applies to every endpoint used by a student during an active attempt.

### Submit exam

Request:

```http
POST /exams/exam_123/submit
Authorization: Bearer <student-token>
Content-Type: application/json
```

```json
{
  "attemptId": "attempt_123",
  "answers": [
    {
      "questionId": "q_123",
      "answer": "let"
    }
  ]
}
```

Response:

```json
{
  "attemptId": "attempt_123",
  "examId": "exam_123",
  "status": "submitted",
  "submittedAt": "2026-09-01T09:45:00.000Z",
  "message": "Submission received. Results will be available after release."
}
```

## Exam flow

1. Admin or teacher creates an exam in `draft` status.
2. Admin or teacher adds questions and answer keys.
3. Admin or teacher publishes the exam.
4. Student lists available exams and starts an assigned exam during its availability window.
5. Backend creates one active attempt for the student and returns only student-safe question data.
6. Student submits answers before the attempt deadline.
7. Backend grades the attempt using server-side answer keys that were never sent to the student.
8. Teacher or admin reviews results and releases them if required.
9. Student views released results through `/results/me`.

## Testing checklist

- [ ] `npm install` completes successfully in `backend/`.
- [ ] Backend starts with `npm run dev` using documented environment variables.
- [ ] `GET /health` returns a successful status.
- [ ] Registration and login return the documented authentication shape.
- [ ] Protected endpoints reject missing or invalid bearer tokens with `401`.
- [ ] Role-restricted endpoints reject unauthorized roles with `403`.
- [ ] Teacher can create an exam and add questions.
- [ ] Student can start an assigned published exam.
- [ ] Active exam student responses do not include `correctAnswer`, answer keys, marks, or scoring metadata.
- [ ] Student can submit answers once per attempt.
- [ ] Student cannot see unreleased results.
- [ ] Admin can list users and results.
- [ ] Database constraints prevent orphaned questions, attempts, answers, and results.

## WHAT THE DATABASE TEAMMATE MUST COMPLETE

- Define the final schema for users, roles, exams, questions, exam assignments, attempts, answers, and results.
- Add migrations and seed data for local development.
- Enforce relationships with foreign keys and suitable cascade or restrict rules.
- Store password hashes only; never store plaintext passwords.
- Store question answer keys and marks in tables that are never exposed by active student exam endpoints.
- Add indexes for login lookup, exam visibility, attempts by student, and results by exam.
- Define status enums or equivalent constraints for exam and attempt lifecycle values.
- Confirm how released versus unreleased results are represented.
- Provide sample data for at least one admin, teacher, student, exam, and question set.

## WHAT THE FRONTEND TEAMMATE NEEDS

- Backend base URL, expected locally as `http://localhost:4000`.
- Login flow using `POST /auth/login` and `Authorization: Bearer <accessToken>` for protected requests.
- Role-aware navigation for `admin`, `teacher`, and `student`.
- Admin screens for user management.
- Teacher screens for exam creation, question management, publishing, and results review.
- Student screens for available exams, active exam attempts, answer submission, and released results.
- Active exam UI must rely only on the safe question fields returned by the backend: `id`, `type`, `prompt`, and allowed answer options.
- Frontend must not expect `correctAnswer`, answer keys, marks, or scoring metadata in active exam responses.
- Clear handling for `401`, `403`, validation errors, expired exams, already-submitted attempts, and network failures.
