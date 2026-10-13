<div align="center">

# MoneyMind AI

### An AI-powered personal finance advisor for Indian users

[![Live Demo](https://img.shields.io/badge/Live_Demo-moneymind--frontend.onrender.com-00FF87?style=for-the-badge)](https://moneymind-frontend.onrender.com)
[![Backend API](https://img.shields.io/badge/API_Docs-moneymind--ai.onrender.com-7C3AED?style=for-the-badge)](https://moneymind-ai.onrender.com/docs)

[![FastAPI](https://img.shields.io/badge/FastAPI-009688?style=flat-square&logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com)
[![React](https://img.shields.io/badge/React-20232A?style=flat-square&logo=react&logoColor=61DAFB)](https://react.dev)
[![Groq](https://img.shields.io/badge/Groq_LLaMA_3.3-F55036?style=flat-square)](https://groq.com)

> Most people never get a personalized financial plan. MoneyMind turns your numbers into a clear health score, a tax comparison, a portfolio review, and an AI advisor you can ask anything.

Built for the **ET AI Hackathon 2026**

</div>

---

## Live Demo

| Service | URL |
|---|---|
| Frontend | https://moneymind-frontend.onrender.com |
| Backend API | https://moneymind-ai.onrender.com |
| API docs (Swagger) | https://moneymind-ai.onrender.com/docs |

The backend runs on a free hosting tier that sleeps when idle. The first request after a quiet period can take 30 to 60 seconds while it wakes up.

> **Please use sample numbers and sample documents in the demo.** Do not enter or upload real personal financial documents.

---

## Features

**Money Health Score.** Answer 8 quick questions and get a financial wellness score across 6 dimensions (Emergency Fund, Insurance, Investments, Debt, Tax Efficiency, Retirement), with a personalized action plan and rupee-impact recommendations.

**Tax Wizard.** Compare the Old and New tax regimes, see which deductions you may be missing (80C, 80D, NPS, HRA), and see estimated savings.

**Portfolio X-Ray.** Enter your mutual funds to get XIRR, overlap between funds, expense drag, and an AI-generated rebalancing plan benchmarked against the Nifty 50.

**AI Chat.** A conversational advisor for Indian personal finance, powered by Groq's LLaMA 3.3 70B, that gives specific answers with rupee amounts.

**PDF Parser.** Upload a Form 16 or a CAMS/KFintech statement and the relevant figures are extracted automatically, so you do not have to type them in.

---

## How It Works

```
React frontend (Render static site)
        |  REST (JSON)
FastAPI backend (Render web service)
   |-- Health score, tax, and portfolio logic
   |-- PyMuPDF  -> extracts text from uploaded PDFs
   |-- Groq API -> LLaMA 3.3 70B for analysis and chat
```

---

## Tech Stack

**Frontend:** React 18, TypeScript, Vite, Tailwind CSS, Recharts (radar, bar, and line charts), React Router, shadcn/ui

**Backend:** FastAPI, Groq (LLaMA 3.3 70B Versatile), PyMuPDF, Pydantic, Uvicorn

**Infrastructure:** Render (web service and static site), GitHub with auto-deploy on push

---

## Project Structure

```
moneymind-ai/
├── backend/
│   ├── main.py               # FastAPI app, all endpoints
│   └── requirements.txt
├── frontend/
│   ├── src/
│   │   ├── pages/            # Landing, Dashboard, HealthScore, TaxWizard,
│   │   │                     #   PortfolioXRay, AIChat
│   │   ├── hooks/            # useApi, useCountUp
│   │   ├── components/       # AppSidebar, DashboardLayout, Skeletons
│   │   ├── data/mockData.ts  # Fallback mock data
│   │   └── config.ts         # API base URL and helpers
│   ├── package.json
│   └── vite.config.ts
└── README.md
```

---

## API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| GET | `/` | Health check |
| POST | `/health-score` | Calculate the financial health score |
| POST | `/tax-wizard` | Compare Old vs New tax regime |
| POST | `/portfolio-xray` | Analyze a mutual fund portfolio |
| POST | `/ai-chat` | Chat with the AI advisor |
| POST | `/parse-pdf` | Extract data from Form 16 or a CAMS statement |

---

## Disclaimer and Limitations

- **Not financial advice.** MoneyMind is an educational project. It is not a SEBI-registered investment adviser or a chartered accountant, and its output should not replace professional advice.
- **AI can be wrong.** Chat and analysis responses come from a language model and may contain errors. Verify important numbers before acting on them.
- **Tax rules change every year.** The tax calculations follow the slabs and deductions the project was built with (FY 2024-25 rules). They must be updated for the current financial year before being relied on.
- **Demo only.** Use sample data. Uploaded documents are processed by the backend and sent to an AI service for analysis, so do not upload real Form 16 or account statements to the public demo.
- The free hosting tier is slow on the first request after idle time.

---

## License

MIT License.

---

<div align="center">

Built by **Utkarsh Somvanshi** for the ET AI Hackathon 2026

[Portfolio](https://utkarshsomvanshi.vercel.app) · [LinkedIn](https://www.linkedin.com/in/utkarsh-somvanshi-b4837132b) · [GitHub](https://github.com/Utkarshsomvanshi45)

**[Try MoneyMind AI live](https://moneymind-frontend.onrender.com)**

</div>
