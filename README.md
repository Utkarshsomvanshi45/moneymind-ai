<div align="center">

# 💰 MoneyMind AI

### Your Personal CA-Level Financial Advisor — Powered by AI, Completely Free.

[![Live Demo](https://img.shields.io/badge/🌐_Live_Demo-moneymind--frontend.onrender.com-00FF87?style=for-the-badge)](https://moneymind-frontend.onrender.com)
[![Backend API](https://img.shields.io/badge/⚡_API-moneymind--ai.onrender.com-7C3AED?style=for-the-badge)](https://moneymind-ai.onrender.com/docs)
[![Built with FastAPI](https://img.shields.io/badge/FastAPI-009688?style=for-the-badge&logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com)
[![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://react.dev)
[![Groq](https://img.shields.io/badge/Groq_LLaMA_3.3-F55036?style=for-the-badge)](https://groq.com)

<br/>

> 95% of Indians have no financial plan. MoneyMind gives every Indian a CA-level advisor — powered by AI, completely free.


</div>

---

## ✨ Features

### 🏥 Money Health Score
Answer 8 quick questions and get a comprehensive financial wellness score across 6 dimensions — Emergency Fund, Insurance, Investments, Debt, Tax Efficiency, and Retirement — with a personalized action plan and specific rupee-impact recommendations.

### 🧾 Tax Wizard
Compare Old vs New tax regime instantly. Enter your salary details and get exact tax calculations for FY 2024-25, discover every deduction you're missing (80C, 80D, NPS, HRA), and see how much you can save — with fund recommendations to maximize savings.

### 📊 Portfolio X-Ray
Enter your mutual funds and get your true XIRR, overlap analysis between funds, expense drag calculation, and a specific AI rebalancing plan — all benchmarked against Nifty 50.

### 🤖 AI Chat
A conversational Indian personal finance advisor powered by Groq's LLaMA 3.3 70B. Ask anything about your finances and get specific, actionable advice with rupee amounts.

### 📄 PDF Parser
Upload Form 16 or CAMS/KFintech statements and auto-extract all relevant financial data — no manual entry needed.

---

## 🚀 Live Demo

| Service | URL |
|---|---|
| 🌐 Frontend | [moneymind-frontend.onrender.com](https://moneymind-frontend.onrender.com) |
| ⚡ Backend API | [moneymind-ai.onrender.com](https://moneymind-ai.onrender.com) |
| 📖 API Docs | [moneymind-ai.onrender.com/docs](https://moneymind-ai.onrender.com/docs) |

---

## 🛠️ Tech Stack

### Frontend
- **React 18** + **TypeScript** — UI framework
- **Vite** — Build tool
- **Tailwind CSS** — Styling
- **Recharts** — Data visualizations (radar charts, bar charts, line charts)
- **React Router** — Client-side routing
- **Shadcn/UI** — Component library

### Backend
- **FastAPI** — Python web framework
- **Groq** (LLaMA 3.3 70B Versatile) — AI engine for all financial analysis
- **PyMuPDF (fitz)** — PDF text extraction
- **Pydantic** — Data validation
- **Uvicorn** — ASGI server

### Infrastructure
- **Render** — Backend (Web Service) + Frontend (Static Site) hosting
- **GitHub** — Version control & CI/CD (auto-deploy on push)

---

## 📁 Project Structure

```
moneymind-ai/
├── backend/
│   ├── main.py              # FastAPI app — all 5 endpoints
│   ├── requirements.txt     # Python dependencies
│   └── .env                 # GROQ_API_KEY (not committed)
├── frontend/
│   ├── src/
│   │   ├── pages/
│   │   │   ├── Landing.tsx       # Marketing landing page
│   │   │   ├── Dashboard.tsx     # Overview dashboard
│   │   │   ├── HealthScore.tsx   # Money Health Score tool
│   │   │   ├── TaxWizard.tsx     # Tax comparison tool
│   │   │   ├── PortfolioXRay.tsx # Portfolio analysis tool
│   │   │   └── AIChat.tsx        # AI chat interface
│   │   ├── hooks/
│   │   │   ├── useApi.ts         # API call hook
│   │   │   └── useCountUp.ts     # Animated number hook
│   │   ├── components/
│   │   │   ├── AppSidebar.tsx    # Navigation sidebar
│   │   │   ├── DashboardLayout.tsx
│   │   │   └── Skeletons.tsx     # Loading states
│   │   ├── data/
│   │   │   └── mockData.ts       # Fallback mock data
│   │   └── config.ts             # API base URL + helpers
│   ├── package.json
│   └── vite.config.ts
└── README.md
```

---

## ⚙️ Local Development

### Prerequisites
- Python 3.9+
- Node.js 18+
- A [Groq API key](https://console.groq.com) (free)

### 1. Clone the repo
```bash
git clone https://github.com/Utkarshsomvanshi45/moneymind-ai.git
cd moneymind-ai
```

### 2. Run the Backend
```bash
cd backend
pip install -r requirements.txt

# Create .env file
echo "GROQ_API_KEY=your_groq_api_key_here" > .env

# Start the server
uvicorn main:app --reload --port 8000
```

Backend will be live at `http://localhost:8000`
API docs at `http://localhost:8000/docs`

### 3. Run the Frontend
```bash
cd frontend
npm install

# Update API URL for local dev
# In src/config.ts, set:
# export const API_BASE = "http://localhost:8000";

npm run dev
```

Frontend will be live at `http://localhost:5173`

---

## 🔌 API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/` | Health check |
| `POST` | `/health-score` | Calculate financial health score |
| `POST` | `/tax-wizard` | Compare old vs new tax regime |
| `POST` | `/portfolio-xray` | Analyze mutual fund portfolio |
| `POST` | `/ai-chat` | Chat with AI financial advisor |
| `POST` | `/parse-pdf` | Extract data from Form 16 or CAMS statement |

Full interactive API docs: [moneymind-ai.onrender.com/docs](https://moneymind-ai.onrender.com/docs)

---

## 🚢 Deployment

The project is deployed on **Render** with auto-deploy on every push to `main`.

### Backend (Web Service)
| Setting | Value |
|---|---|
| Root Directory | `backend` |
| Build Command | `pip install -r requirements.txt` |
| Start Command | `uvicorn main:app --host 0.0.0.0 --port $PORT` |
| Environment Variable | `GROQ_API_KEY=your_key` |

### Frontend (Static Site)
| Setting | Value |
|---|---|
| Root Directory | `frontend` |
| Build Command | `npm install && npm run build` |
| Publish Directory | `dist` |

---

## 🔒 Environment Variables

| Variable | Where | Description |
|---|---|---|
| `GROQ_API_KEY` | Backend (Render) | Your Groq API key for LLaMA 3.3 |

> ⚠️ Never commit `.env` to GitHub. The `.gitignore` already excludes it.

---

## 🤝 Contributing

Contributions, issues and feature requests are welcome!

1. Fork the repo
2. Create your feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

---

## 📄 License

MIT License — feel free to use this project for learning, demos, or building on top of it.

---

<div align="center">

Built with ❤️ for the **ET AI Hackathon 2026**

**[🌐 Try MoneyMind AI Live](https://moneymind-frontend.onrender.com)**

</div>