# MailCraft AI 📧✨

> **AI-powered professional email generator** — built for the Internship Innovation Challenge.

MailCraft AI uses NVIDIA's LLaMA 3.1 model (via the NIM API) to generate perfectly-crafted, context-aware professional emails in seconds. Users log in, fill in their email purpose/recipient/tone, and receive a complete, ready-to-send email.

website is live🌐https://mailcraft-ai-omega.vercel.app/

---

## 🚀 Features

| Feature | Description |
|---------|-------------|
| ✉ AI Email Generation | Calls NVIDIA NIM (LLaMA 3.1 8B) server-side to produce complete emails |
| 🎯 10+ Email Purposes | Job Application, Follow-up, Resignation, Complaint, Meeting Request, and more |
| 🎨 6 Tone Modes | Formal, Friendly, Persuasive, Apologetic, Urgent, Casual |
| 📋 Copy to Clipboard | One-click copy with animated confirmation |
| 📄 PDF Export | Download a branded PDF of any generated email (client-side, jsPDF) |
| 📚 Email History | All generated emails saved per user; browse, expand, and delete |
| 🔒 Auth (JWT + bcrypt) | Signup / Login / Protected routes / Auto logout on expiry |
| 🌙 Dark / Light Mode | Toggle with persistent localStorage preference |
| 📱 Fully Responsive | Mobile, tablet, and desktop layouts |
| ⚡ Input Validation | Client-side + server-side validation with inline error messages |
| 🛡️ Error Handling | Graceful API failures, rate limit messages, never a blank screen |

---

## 📸 Screenshots

| Landing Page | Generator | History |
|---|---|---|
| *<img width="1917" height="969" alt="Image" src="https://github.com/user-attachments/assets/828fde79-6f42-4161-a8a6-96fb6ce167ee" />* | *<img width="1920" height="1080" alt="Image" src="https://github.com/user-attachments/assets/73e28f6c-918a-440d-a1ca-2835cea5f31a" />
* | *<img width="1917" height="969" alt="Image" src="https://github.com/user-attachments/assets/90043160-c13b-4f37-920d-eb686c4a1a7f" />* |
---

## 🛠 Technologies Used

### Frontend
- **React 18** + **Vite** — fast dev server and build tooling
- **Tailwind CSS** — utility-first CSS with custom design tokens
- **Framer Motion** — page transitions, button animations, loading states
- **React Router v6** — client-side routing and protected routes
- **Axios** — HTTP client with JWT interceptor
- **react-hot-toast** — toast notifications
- **jsPDF** — client-side PDF generation

### Backend
- **Node.js** + **Express** — REST API server
- **better-sqlite3** — synchronous, file-based SQLite (zero setup)
- **bcryptjs** — password hashing (10 salt rounds)
- **jsonwebtoken** — JWT signing and verification
- **OpenAI SDK** (pointed at NVIDIA NIM) — AI model calls
- **helmet** — secure HTTP headers
- **express-rate-limit** — brute-force protection

### AI
- **NVIDIA NIM API** — OpenAI-compatible endpoint
- **Model**: `meta/llama-3.1-8b-instruct`
- **Base URL**: `https://integrate.api.nvidia.com/v1`

---

## 📁 Folder Structure

```
internship/
├── client/                          # React + Vite frontend
│   ├── public/
│   │   └── favicon.svg
│   └── src/
│       ├── api/
│       │   └── index.js             # Axios instance + JWT interceptor
│       ├── components/
│       │   ├── EmailForm.jsx        # Generation form with tone picker
│       │   ├── EmailResult.jsx      # Result display + copy + PDF export
│       │   ├── HistoryCard.jsx      # Past email card (expand/delete)
│       │   ├── LoadingAnimation.jsx # Animated loading state
│       │   ├── Navbar.jsx           # Responsive nav with auth state
│       │   ├── ProtectedRoute.jsx   # Route guard
│       │   └── ThemeToggle.jsx      # Dark/light mode button
│       ├── context/
│       │   ├── AuthContext.jsx      # Global auth state (JWT, user)
│       │   └── ThemeContext.jsx     # Dark/light mode state
│       ├── pages/
│       │   ├── LandingPage.jsx      # Hero + features + CTA
│       │   ├── LoginPage.jsx        # Login form
│       │   ├── SignupPage.jsx       # Registration form
│       │   ├── GeneratorPage.jsx    # Main AI generator
│       │   └── HistoryPage.jsx      # Email history browser
│       ├── utils/
│       │   └── pdfExport.js        # jsPDF export utility
│       ├── App.jsx                  # Router + providers
│       ├── main.jsx                 # React entry point
│       └── index.css                # Design system + Tailwind layers
│
└── server/                          # Express backend
    ├── controllers/
    │   ├── authController.js        # signup / login logic
    │   ├── emailController.js       # AI generation + DB save
    │   └── historyController.js     # GET / DELETE history
    ├── middleware/
    │   ├── auth.js                  # JWT verification middleware
    │   └── validate.js              # Input validation middleware
    ├── models/
    │   └── db.js                    # SQLite init + singleton accessor
    ├── routes/
    │   ├── auth.js                  # POST /api/auth/signup|login
    │   ├── email.js                 # POST /api/email/generate
    │   └── history.js               # GET|DELETE /api/history
    ├── services/
    │   └── nvidiaService.js         # NVIDIA NIM API calls + prompt
    ├── data/
    │   └── mailcraft.db             # Auto-created SQLite file
    └── server.js                    # Express app entry point
```

---

## ⚙️ Environment Variables

Create `server/.env` (use `server/.env.example` as template):

| Variable | Description | Example |
|----------|-------------|---------|
| `NVIDIA_API_KEY` | Your NVIDIA NIM API key | `nvapi-xxxxx` |
| `JWT_SECRET` | Secret for signing JWTs (make it long and random) | `64-char hex string` |
| `PORT` | Backend server port | `3001` |
| `CLIENT_ORIGIN` | Frontend URL (for CORS) | `http://localhost:5173` |
| `NODE_ENV` | Environment | `development` |

---

## 🔑 Getting an NVIDIA API Key

1. Visit [https://build.nvidia.com](https://build.nvidia.com)
2. Create a free account (or sign in)
3. Search for **"llama-3.1-8b-instruct"** in the model catalog
4. Click the model → click **"Get API Key"**
5. Copy the key (starts with `nvapi-`)
6. Paste it as `NVIDIA_API_KEY=nvapi-your-key-here` in `server/.env`

> **Free tier**: NVIDIA NIM provides free API credits for testing — no credit card needed.

---

## 🧰 Installation & Setup

### Prerequisites
- Node.js v18+
- npm v9+

### 1. Clone / Navigate to the project
```bash
cd /path/to/internship
```

### 2. Set up the backend
```bash
cd server
cp .env.example .env        # Copy env template
nano .env                   # Add your NVIDIA_API_KEY and JWT_SECRET
npm install                 # Install dependencies
```

### 3. Set up the frontend
```bash
cd ../client
npm install                 # Install dependencies
```

---

## ▶️ How to Run

### Start the Backend (Terminal 1)
```bash
cd server
npm run dev     # Uses nodemon for auto-reload
# Server starts at http://localhost:3001
```

### Start the Frontend (Terminal 2)
```bash
cd client
npm run dev     # Vite dev server
# Frontend starts at http://localhost:5173
```

Open **http://localhost:5173** in your browser.

---

## 🤖 AI Prompt Engineering Approach

> **Interview-ready explanation**

The AI integration uses a **two-layer prompt strategy** implemented in `server/services/nvidiaService.js`:

### System Prompt (Role + Format)
```
You are an expert professional email writer.
Respond with ONLY a valid JSON object: {"subject": "...", "body": "..."}
No markdown fences, no explanation, no preamble.
Match the specified tone exactly.
The email must be immediately usable — no placeholder brackets.
```

**Why this works:**
- **JSON-only output** suppresses chain-of-thought prose, making parsing 100% reliable without regex
- **Tone is enforced in the system role** so the model commits to it from the first token
- **"No placeholder brackets"** prevents lazy `[Your Name]` outputs — forces natural, complete prose

### User Message (Structured Metadata)
```
Email Purpose: Job Application
Recipient Name: Sarah Johnson
Recipient Role/Relationship: Hiring Manager at Google
Tone: Formal
Additional Context: I'm applying for the SWE internship role
```

**Why structured key-value?**
- LLMs attend better to clearly labeled fields than free-form descriptions
- Easy to extend without changing the prompt architecture

### Reliability Guard
If the model still wraps output in markdown fences (` ```json ``` `), the service strips them before `JSON.parse`. If parsing fails entirely, a user-friendly error is shown — never a crash.

### Temperature: 0.7
- Low enough to be reliable and consistent
- High enough to produce natural, non-robotic language

---

## 🧪 API Endpoints

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/auth/signup` | ❌ | Register new user |
| POST | `/api/auth/login` | ❌ | Login, receive JWT |
| POST | `/api/email/generate` | ✅ JWT | Generate email via AI |
| GET | `/api/history` | ✅ JWT | Get user's email history |
| DELETE | `/api/history/:id` | ✅ JWT | Delete a specific email |
| GET | `/api/health` | ❌ | Server health check |

---

## 👨‍💻 Author

Built for the Internship Innovation Challenge.

---

*MailCraft AI — Write smarter. Communicate better.*
