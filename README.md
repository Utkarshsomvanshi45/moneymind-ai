# MoneyMind AI
### AI-Powered Personal Finance Advisor for Every Indian
> ET AI Hackathon 2026 | Problem Statement #9 — AI Money Mentor

## Live Demo
- 🌐 Frontend: [coming soon]
- ⚙️ Backend API: [coming soon]

## What it does
MoneyMind AI gives every Indian a CA-level financial advisor for free.

| Feature | Description |
|---------|-------------|
| Money Health Score | Financial wellness score across 6 dimensions |
| Tax Wizard | Old vs new regime comparison + missed deductions |
| Portfolio X-Ray | XIRR, overlap analysis, AI rebalancing plan |
| AI Chat | Conversational advisor powered by Gemini |

## Tech Stack
- Frontend: React + Tailwind (Lovable.dev)
- Backend: Python + FastAPI
- AI: Google Gemini 1.5 Flash
- Deployment: Render (backend) + Vercel (frontend)

## Setup

### Backend
```bash
cd backend
pip install -r requirements.txt
cp .env.example .env
# Add your GEMINI_API_KEY to .env
uvicorn main:app --reload --port 8000
```

### Frontend
```bash
cd frontend
npm install
npm run dev
```

## Team
| Member | Role |
|--------|------|
| [Name] | Frontend + Backend |
| [Name] | AI / Prompts |
| [Name] | Data / Documentation |
| [Name] | Frontend UI |