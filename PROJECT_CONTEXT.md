# Project Context: ApplyWise AI Resume Analyzer & Builder

Use this document as the factual background when asking an AI to write an article, project post, portfolio description, or presentation about this repository. Treat implementation details here as the source of truth. Do not claim planned features are implemented, and do not invent users, metrics, deployment details, or business results.

## Project at a glance

**ApplyWise** is a full-stack web app for tailoring a resume to a specific job description. A user uploads a PDF or DOCX resume, pastes a job description, reviews an AI-assisted match analysis, generates an editable resume draft, previews it, and downloads a PDF. The supplied ApplyWise logo is used in the app header and favicon.

The product is presented as a career workshop: a calm, editorial interface that helps people make their existing experience more relevant to a role. Its key content rule is to preserve the candidate's facts. The AI is instructed to rephrase and prioritize verified experience without inventing qualifications, employers, dates, skills, or achievements.

**Project type:** portfolio/MVP application. Authentication, user accounts, and production deployment are not implemented.

## User journey and features

1. **Upload:** The user selects or drops a PDF or DOCX. The backend checks the file type and configured size limit, extracts text, normalizes whitespace, and rejects files with fewer than 100 readable characters. Scanned PDFs are not OCR-processed.
2. **Describe a role:** The user pastes the job description. Analysis requires at least 80 characters.
3. **Analyze fit:** The backend computes a simple keyword coverage estimate and asks Google Gemini to return structured analysis. The dashboard shows an estimated score, matched and missing skills, relevant experience, gaps, strengths, weaknesses, and recommendations. The UI states that the match score is directional and is not an official ATS score.
4. **Generate a draft:** The user asks Gemini to tailor the resume. The result is validated and shown in the builder.
5. **Edit and preview:** The user can edit contact details, headline, summary, skills, experience, projects, and education; add or remove entries; and preview an A4-style resume. Three PDF templates are available: Classic, Modern, and Compact.
6. **Download:** The backend renders the validated resume data to HTML and uses Puppeteer with Chrome/Chromium to create a selectable-text PDF.

The upload flow has a book animation. Analysis and resume generation have separate loading overlays. The builder shows a PDF preparation state. Errors are displayed inline.

## Architecture

```text
React + Vite browser app
        │ Axios requests through /api
        ▼
Express API (default port 5000)
  ├─ Multer upload validation and temporary files
  ├─ PDF/DOCX text extraction
  ├─ Keyword matching estimate
  ├─ Gemini analysis and resume generation
  ├─ Zod request and AI response validation
  ├─ Optional MongoDB persistence through Mongoose
  └─ Puppeteer HTML-to-PDF rendering
        │                         │
        ▼                         ▼
 Google Gemini API          MongoDB (optional)
```

The frontend dev server runs on port 5173 and proxies `/api` to `http://127.0.0.1:5000`. The frontend does not call Gemini directly; the Gemini key stays in the backend environment.

### Frontend

- React 18 with JSX and Vite.
- Tailwind CSS for utility styling, with custom CSS in `frontend/src/styles.css` for the product's visual identity and loader animations.
- Axios for API requests; Lucide React for interface icons.
- `frontend/src/App.jsx` holds the three-step workflow state in React state: Upload, Analysis, and Builder. There is no frontend router or account session.
- Main screens: `HomePage.jsx`, `AnalysisPage.jsx`, and `BuilderPage.jsx`.
- The generated resume remains in browser memory as editable structured data during the current workflow.

### Backend

- Node.js with CommonJS modules and Express 4.
- Zod validates incoming requests and Gemini response structures.
- Multer handles PDF/DOCX upload validation and temporary file storage.
- `pdf-parse` extracts PDF text; Mammoth extracts DOCX raw text.
- `@google/genai` calls Gemini using the configured model and requests JSON responses.
- Puppeteer renders sanitized HTML into an A4 PDF. The service locates a configured, bundled, or common system Chrome/Chromium executable. It converts Puppeteer's `Uint8Array` output to a Node `Buffer` before Express sends it as `application/pdf`.
- Helmet, CORS configuration, and `express-rate-limit` are installed in the API middleware stack.

### Data and persistence

MongoDB/Mongoose persistence is opportunistic. If a database connection succeeds, models can store resume metadata, an extracted text hash and short preview, analysis results and job-description hash, and generated resume JSON. If MongoDB is unavailable, the guest workflow is designed to continue without persistence.

The implemented persistence service does not save the full extracted resume text. The actual resume text and job description are still sent to Gemini to perform analysis and generation. The project does not currently provide user accounts, access control, or user-facing deletion controls.

## AI behavior

The analysis service asks Gemini for JSON containing a match score, matched technical skills, missing skills and requirements, relevant work experience, strengths, weaknesses, ATS recommendations, improvement suggestions, and a rationale.

The deterministic score is a basic keyword coverage estimate: it tokenizes the job description, removes a small stop-word list, selects frequent keywords, and calculates which are present in the resume text. This is not a commercial ATS algorithm or a semantic evaluation. The AI analysis is separately generated and includes the estimate as calibration context.

Resume generation asks Gemini to produce a structured resume object with contact information, headline, summary, skills, experience, projects, education, certifications, and optional additional sections. The prompt treats resume and job-description text as untrusted input, tells the model to ignore embedded instructions, prohibits unsupported facts, and asks it to leave unknown fields blank. Zod checks the resulting structure, but there is no independent evidence checker. A person should review the draft before using it.

The Gemini model and key are configured through backend environment variables. The code's default model is `gemini-3.8-flash`; a deployment may override it. AI calls require a valid Gemini API key, available quota, and provider availability. Provider failures are mapped to actionable API errors, but external service failures cannot be eliminated by application code.

## Design direction

The product name shown in the UI is **ApplyWise**, with the descriptor **AI Resume Workshop**. The interface uses a restrained editorial direction rather than a generic analytics dashboard. The supplied logo uses a blue-to-cyan gradient mark with a resume/profile motif and a green checkmark:

- Warm paper backgrounds and off-white panels.
- Dark forest/ink text and muted gray-green secondary text.
- Terracotta/rust accent, with muted sage and warm neutral details.
- Georgia/serif display headings paired with a clean system sans-serif for controls and body copy.
- Thin borders, low-contrast shadows, square or lightly rounded corners, generous whitespace, and small uppercase section labels.
- Responsive layouts and a three-stage step navigation.
- A4 resume preview and simple ATS-friendly PDF templates.

The design aims to feel composed, readable, and focused on a candidate's story. Do not describe it as a finished commercial product or claim formal accessibility certification. The project includes semantic status labels and reduced-motion CSS for custom animations, but has no documented accessibility audit.

## API surface

- `GET /api/health` — basic health route.
- `POST /api/resumes/upload` — multipart PDF/DOCX upload and text extraction.
- `POST /api/resumes/analyze` — resume text plus job description to analysis.
- `POST /api/resumes/generate` — resume text, job description, and optional analysis to tailored resume JSON.
- `POST /api/resumes/pdf` — structured resume and template to a PDF download.

The backend defaults to port 5000; Vite defaults to port 5173. Configuration is read from backend environment variables (including `GEMINI_API_KEY`, `GEMINI_MODEL`, `MONGODB_URI`, `CLIENT_ORIGIN`, and `PUPPETEER_EXECUTABLE_PATH`). Never put API secrets in frontend source or an article.

## Limitations and honest framing

- It is an MVP/portfolio project, not a deployed or production-ready SaaS product.
- No authentication, accounts, per-user authorization, or resume history UI.
- No OCR for image-only/scanned PDFs.
- No independent verification that AI-generated wording is supported by a particular source sentence.
- Keyword matching is a transparent heuristic, not an official ATS score.
- MongoDB persistence is optional and guest mode is supported; no data deletion interface is implemented.
- The AI workflow depends on Google Gemini credentials, quota, network, and model availability.
- PDF export depends on a compatible Chrome/Chromium browser being available to Puppeteer.
- No claims about user adoption, accuracy percentages, time saved, revenue, or deployment should be made unless separately substantiated.

## Article-writing guidance for another AI

When writing about this project:

- Explain the user problem and walk through the upload → analysis → tailored draft → edit/preview → PDF journey.
- Describe the real stack and distinguish implemented features from roadmap items.
- Explain how the Gemini prompt constraints and Zod validation support factual output, while acknowledging they do not guarantee correctness.
- Call the match score an estimate or keyword coverage signal, never an official ATS score.
- Mention meaningful engineering decisions such as keeping Gemini credentials server-side, using optional persistence, and generating selectable-text PDFs.
- Use a clear, human tone suitable for a technical project post. Avoid fabricated origin stories, impact statistics, customer quotes, or claims of production readiness.
- If the author wants a personal narrative, ask for their actual motivation, challenges, and lessons rather than inventing them.

## Repository pointers

- `frontend/src/App.jsx` — app shell and workflow state.
- `frontend/src/pages/` — upload, analysis, and builder screens.
- `frontend/src/styles.css` — custom design system and loader styling.
- `frontend/src/services/api.js` — frontend API client and PDF download handling.
- `backend/src/routes/resumeRoutes.js` — resume API routes.
- `backend/src/controllers/resumeController.js` — request coordination.
- `backend/src/ai/` — Gemini client, prompts, and JSON parsing.
- `backend/src/validation/resumeSchemas.js` — request/response schemas.
- `backend/src/services/` — parsing, keyword matching, persistence, HTML/PDF generation.
- `backend/src/models/` — Mongoose models.
- `README.md` — setup notes, API documentation, implementation details, and roadmap; check it against current code where model defaults or recent implementation changes may differ.
