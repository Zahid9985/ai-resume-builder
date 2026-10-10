# AI Resume Analyzer & Resume Builder

A full-stack MERN MVP that uploads a PDF or DOCX resume, compares it to a job description with Google Gemini, generates a factual ATS-friendly tailored resume, lets users edit it, and downloads the final version as a selectable-text PDF.

## Stack

- Frontend: React, Vite, Tailwind CSS, Axios, Lucide React
- Backend: Node.js, Express, MongoDB/Mongoose, Multer, pdf-parse, Mammoth, `@google/genai`, Puppeteer, Zod
- Tests: Node test runner, Vitest

## Required Credentials

- `GEMINI_API_KEY`: Google Gemini API key
- `MONGODB_URI`: MongoDB connection string

The Gemini key is used only by the backend. Do not add it to frontend environment files.

## Setup

```bash
npm install
npm run install:all
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env
```

Edit `backend/.env` with your MongoDB URI and Gemini API key.

## Run Locally

```bash
npm run dev
```

- Frontend: http://localhost:5173
- Backend: http://localhost:5000
- Health check: http://localhost:5000/api/health

## Backend Environment

```env
PORT=5000
NODE_ENV=development
CLIENT_ORIGIN=http://localhost:5173
MONGODB_URI=mongodb://127.0.0.1:27017/ai_resume
GEMINI_API_KEY=your_google_gemini_api_key
GEMINI_MODEL=gemini-2.5-flash
PUPPETEER_EXECUTABLE_PATH=
UPLOAD_MAX_MB=5
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX=100
```

If you install dependencies with `PUPPETEER_SKIP_DOWNLOAD=true`, set `PUPPETEER_EXECUTABLE_PATH` to an installed Chrome or Chromium executable before using PDF export.

## Frontend Environment

```env
VITE_API_BASE_URL=http://localhost:5000/api
```

## API Routes

- `GET /api/health`
- `POST /api/resumes/upload`
- `POST /api/resumes/analyze`
- `POST /api/resumes/generate`
- `POST /api/resumes/pdf`

## Verification

```bash
npm test
npm run build
```

Gemini-dependent workflows require a valid `GEMINI_API_KEY`. MongoDB persistence is optional for guest processing; if MongoDB is unavailable, the API still supports temporary guest workflow processing without storing private resume data.
