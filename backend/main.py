from fastapi import FastAPI, UploadFile, File, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse, Response
from pydantic import BaseModel
from typing import Optional, List
from groq import Groq
import json
import os
import re
import fitz
from dotenv import load_dotenv

load_dotenv()

app = FastAPI(title="MoneyMind AI Backend")

# ─────────────────────────────────────────
# BULLETPROOF CORS — handles Render deployment
# ─────────────────────────────────────────

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.middleware("http")
async def add_cors_headers(request: Request, call_next):
    if request.method == "OPTIONS":
        response = Response()
        response.headers["Access-Control-Allow-Origin"] = "*"
        response.headers["Access-Control-Allow-Methods"] = "GET, POST, PUT, DELETE, OPTIONS"
        response.headers["Access-Control-Allow-Headers"] = "*"
        response.headers["Access-Control-Max-Age"] = "86400"
        return response
    response = await call_next(request)
    response.headers["Access-Control-Allow-Origin"] = "*"
    response.headers["Access-Control-Allow-Methods"] = "GET, POST, PUT, DELETE, OPTIONS"
    response.headers["Access-Control-Allow-Headers"] = "*"
    return response

groq_client = Groq(api_key=os.getenv("GROQ_API_KEY"))


def call_ai(prompt: str) -> str:
    response = groq_client.chat.completions.create(
        model="llama-3.3-70b-versatile",
        messages=[{"role": "user", "content": prompt}],
        temperature=0.3
    )
    return response.choices[0].message.content


def extract_json(text: str) -> dict:
    text = text.strip()
    text = re.sub(r'```json\s*', '', text)
    text = re.sub(r'```\s*', '', text)
    text = text.strip()
    return json.loads(text)


# ─────────────────────────────────────────
# INPUT MODELS
# ─────────────────────────────────────────

class HealthScoreInput(BaseModel):
    monthly_income: float
    monthly_expenses: float
    age: int
    dependents: int
    emergency_fund: float
    has_health_insurance: bool
    health_insurance_cover: Optional[float] = 0
    has_term_insurance: bool
    term_insurance_cover: Optional[float] = 0
    monthly_sip: float
    total_investments: float
    total_loans: float
    monthly_emi: float
    has_retirement_plan: bool


class TaxWizardInput(BaseModel):
    basic_salary: float
    hra_received: float
    rent_paid: float
    special_allowances: float
    investments_80c: float
    health_insurance_80d: float
    nps_80ccd: float
    home_loan_interest: float
    other_deductions: float


class FundEntry(BaseModel):
    fund_name: str
    invested_amount: float
    current_value: float
    start_date: str


class PortfolioInput(BaseModel):
    funds: List[FundEntry]


class ChatMessage(BaseModel):
    role: str
    content: str


class ChatInput(BaseModel):
    message: str
    history: List[ChatMessage] = []
    user_context: Optional[dict] = None


# ─────────────────────────────────────────
# ENDPOINT 1 — HEALTH SCORE
# ─────────────────────────────────────────

@app.post("/health-score")
async def health_score(data: HealthScoreInput):
    prompt = f"""
You are a certified Indian financial planner. Analyze this person's financial data.

USER DATA:
- Monthly Income: Rs {data.monthly_income}
- Monthly Expenses: Rs {data.monthly_expenses}
- Age: {data.age} years
- Dependents: {data.dependents}
- Emergency Fund: Rs {data.emergency_fund}
- Health Insurance: {"Yes, cover Rs " + str(data.health_insurance_cover) if data.has_health_insurance else "No"}
- Term Insurance: {"Yes, cover Rs " + str(data.term_insurance_cover) if data.has_term_insurance else "No"}
- Monthly SIP: Rs {data.monthly_sip}
- Total Investments: Rs {data.total_investments}
- Total Loans: Rs {data.total_loans}
- Monthly EMI: Rs {data.monthly_emi}
- Has Retirement Plan: {data.has_retirement_plan}

SCORING RULES:
1. Emergency Fund: Ideal = Rs {data.monthly_expenses * 6}. Score = min(actual/ideal*100, 100)
2. Insurance: 0 if no health insurance. 50 for health insurance. +50 if term >= 10x annual income
3. Investments: savings_rate = sip/income. Score = min(savings_rate/0.20*100, 100)
4. Debt Management: emi_ratio = emi/income. Score = max(0, 100 - emi_ratio*200)
5. Tax Efficiency: Low if high income with no 80C investments. High if maxing 80C
6. Retirement: 100 if plan+age<35. 70 if plan+age 35-50. 40 if no plan+age<35. 10 if no plan+age>50

Overall = emergency_fund*0.25 + insurance*0.20 + investments*0.20 + debt*0.15 + tax*0.10 + retirement*0.10

Status: score>=80 = "Good", score>=60 = "Needs attention", score<60 = "Critical"
Grade: A for 85+, B+ for 75-84, B for 70-74, C for 55-69, D for 40-54, F for below 40

IMPORTANT: Return ONLY valid JSON. No markdown. No explanation. No text before or after the JSON:
{{
  "overall_score": 0,
  "grade": "B+",
  "dimensions": [
    {{"name": "Emergency Fund", "score": 0, "icon": "Shield", "status": "Needs attention"}},
    {{"name": "Insurance", "score": 0, "icon": "Heart", "status": "Critical"}},
    {{"name": "Investments", "score": 0, "icon": "TrendingUp", "status": "Good"}},
    {{"name": "Debt Management", "score": 0, "icon": "CreditCard", "status": "Good"}},
    {{"name": "Tax Efficiency", "score": 0, "icon": "Receipt", "status": "Needs attention"}},
    {{"name": "Retirement", "score": 0, "icon": "Target", "status": "Critical"}}
  ],
  "actions": [
    {{"title": "specific action with rupee amount", "impact": "specific rupee impact"}},
    {{"title": "specific action with rupee amount", "impact": "specific rupee impact"}},
    {{"title": "specific action with rupee amount", "impact": "specific rupee impact"}}
  ]
}}

Replace every 0 with real calculated values. Actions must target the 3 weakest dimensions.
"""
    try:
        raw = call_ai(prompt)
        return extract_json(raw)
    except json.JSONDecodeError:
        raise HTTPException(status_code=500, detail="AI returned invalid JSON. Please try again.")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Analysis failed: {str(e)}")


# ─────────────────────────────────────────
# ENDPOINT 2 — TAX WIZARD
# ─────────────────────────────────────────

@app.post("/tax-wizard")
async def tax_wizard(data: TaxWizardInput):
    gross_income = data.basic_salary + data.hra_received + data.special_allowances

    prompt = f"""
You are an expert Indian tax consultant for FY 2024-25.

USER SALARY:
- Basic Salary: Rs {data.basic_salary}/year
- HRA Received: Rs {data.hra_received}/year
- Rent Paid: Rs {data.rent_paid}/year
- Special Allowances: Rs {data.special_allowances}/year
- Gross Income: Rs {gross_income}/year

CURRENT DEDUCTIONS:
- 80C investments: Rs {data.investments_80c} (max Rs 150000)
- 80D health insurance: Rs {data.health_insurance_80d} (max Rs 25000)
- 80CCD NPS: Rs {data.nps_80ccd} (max Rs 50000)
- Home loan interest 24b: Rs {data.home_loan_interest} (max Rs 200000)
- Other: Rs {data.other_deductions}

OLD REGIME (standard deduction Rs 50000 + HRA exemption + all deductions above):
Slabs: 0 up to 250000, 5% 250001-500000, 20% 500001-1000000, 30% above 1000000
HRA exemption = min(HRA received, 50% of basic, rent paid minus 10% of basic)
Add 4% cess on final tax

NEW REGIME (only standard deduction Rs 75000, no other deductions):
Slabs: 0 up to 300000, 5% 300001-600000, 10% 600001-900000, 15% 900001-1200000, 20% 1200001-1500000, 30% above 1500000
87A rebate: if taxable income <= 700000 then tax = 0
Add 4% cess on final tax

IMPORTANT: Return ONLY valid JSON. No markdown. No explanation. No text before or after:
{{
  "old_regime": {{
    "tax": 0,
    "effective_rate": 0.0,
    "deductions": 0
  }},
  "new_regime": {{
    "tax": 0,
    "effective_rate": 0.0,
    "deductions": 75000
  }},
  "recommended": "old",
  "savings": 0,
  "missed_deductions": [
    {{
      "section": "80C",
      "description": "You can invest Rs X more in ELSS/PPF",
      "amount": 0,
      "how": "Invest in ELSS mutual funds for tax saving and market returns"
    }},
    {{
      "section": "80D",
      "description": "Parents health insurance premium deduction available",
      "amount": 0,
      "how": "Get health cover for parents, premiums deductible up to Rs 50000"
    }},
    {{
      "section": "80CCD",
      "description": "NPS additional contribution deduction available",
      "amount": 0,
      "how": "Open NPS account and invest Rs 50000/year for extra deduction"
    }}
  ],
  "suggestions": [
    {{"name": "Axis ELSS Tax Saver Fund", "returns": "14.8% (3Y)", "lockin": "3 years", "section": "80C"}},
    {{"name": "HDFC Retirement Savings Fund", "returns": "12.4% (5Y)", "lockin": "Till 60", "section": "80CCD"}},
    {{"name": "Star Health Insurance", "returns": "N/A", "lockin": "Annual", "section": "80D"}}
  ],
  "breakdown": [
    {{"category": "Gross Income", "old": {gross_income}, "new": {gross_income}}},
    {{"category": "Deductions", "old": 0, "new": 75000}},
    {{"category": "Taxable Income", "old": 0, "new": 0}},
    {{"category": "Tax Payable", "old": 0, "new": 0}}
  ]
}}

Replace all 0 values with real calculated numbers.
recommended: regime with lower tax.
savings: absolute difference between old and new tax.
missed_deductions amount: potential tax saving in rupees. 0 if already maxed.
"""
    try:
        raw = call_ai(prompt)
        return extract_json(raw)
    except json.JSONDecodeError:
        raise HTTPException(status_code=500, detail="AI returned invalid JSON. Please try again.")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Analysis failed: {str(e)}")


# ─────────────────────────────────────────
# ENDPOINT 3 — PORTFOLIO X-RAY
# ─────────────────────────────────────────

@app.post("/portfolio-xray")
async def portfolio_xray(data: PortfolioInput):
    funds_text = "\n".join([
        f"- {f.fund_name}: Invested Rs {f.invested_amount}, "
        f"Current Rs {f.current_value}, Started {f.start_date}"
        for f in data.funds
    ])
    total_invested = sum(f.invested_amount for f in data.funds)
    total_current = sum(f.current_value for f in data.funds)
    abs_return = total_current - total_invested
    abs_pct = round((abs_return / total_invested * 100), 1) if total_invested > 0 else 0

    prompt = f"""
You are an expert Indian mutual fund analyst.

PORTFOLIO:
{funds_text}

Total Invested: Rs {total_invested}
Total Current: Rs {total_current}
Return: {abs_pct}%
Funds: {len(data.funds)}

IMPORTANT: Return ONLY valid JSON. No markdown. No explanation. No text before or after:
{{
  "xirr": 0.0,
  "nifty_comparison": 0.0,
  "expense_drag": 0,
  "overlap_score": 0,
  "total_invested": {total_invested},
  "allocation": [
    {{"name": "Large Cap", "value": 0, "amount": 0, "color": "#00FF87"}},
    {{"name": "Flexi Cap", "value": 0, "amount": 0, "color": "#7C3AED"}},
    {{"name": "Mid Cap", "value": 0, "amount": 0, "color": "#F59E0B"}},
    {{"name": "Small Cap", "value": 0, "amount": 0, "color": "#EF4444"}},
    {{"name": "Debt", "value": 0, "amount": 0, "color": "#3B82F6"}}
  ],
  "rebalancing": [
    {{"action": "SELL", "fund": "fund from portfolio", "reason": "specific reason", "benefit": "specific benefit"}},
    {{"action": "BUY", "fund": "recommended fund", "reason": "specific reason", "benefit": "specific benefit"}},
    {{"action": "SWITCH", "fund": "fund from portfolio", "reason": "specific reason", "benefit": "specific benefit"}}
  ],
  "performance": [
    {{"month": "Jan", "portfolio": 100, "nifty": 100}},
    {{"month": "Feb", "portfolio": 0, "nifty": 0}},
    {{"month": "Mar", "portfolio": 0, "nifty": 0}},
    {{"month": "Apr", "portfolio": 0, "nifty": 0}},
    {{"month": "May", "portfolio": 0, "nifty": 0}},
    {{"month": "Jun", "portfolio": 0, "nifty": 0}},
    {{"month": "Jul", "portfolio": 0, "nifty": 0}},
    {{"month": "Aug", "portfolio": 0, "nifty": 0}},
    {{"month": "Sep", "portfolio": 0, "nifty": 0}},
    {{"month": "Oct", "portfolio": 0, "nifty": 0}},
    {{"month": "Nov", "portfolio": 0, "nifty": 0}},
    {{"month": "Dec", "portfolio": 0, "nifty": 0}}
  ]
}}

Rules:
- xirr: realistic 8-25% based on dates and returns
- nifty_comparison: xirr minus 13.0
- allocation values sum to exactly 100
- allocation amounts sum to approximately {total_invested}
- performance both start at 100, realistic monthly growth
- Replace all 0 with real values
"""
    try:
        raw = call_ai(prompt)
        return extract_json(raw)
    except json.JSONDecodeError:
        raise HTTPException(status_code=500, detail="AI returned invalid JSON. Please try again.")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Analysis failed: {str(e)}")


# ─────────────────────────────────────────
# ENDPOINT 4 — AI CHAT
# ─────────────────────────────────────────

@app.post("/ai-chat")
async def ai_chat(data: ChatInput):
    context_text = ""
    if data.user_context:
        context_text = f"\nUSER CONTEXT:\n{json.dumps(data.user_context, indent=2)}\n"

    history_text = ""
    for msg in data.history[-6:]:
        role = "User" if msg.role == "user" else "MoneyMind AI"
        history_text += f"{role}: {msg.content}\n"

    prompt = f"""
You are MoneyMind AI, a friendly Indian personal finance advisor.
Give specific actionable advice using Indian products: ELSS, PPF, NPS, SIP.
Use rupee amounts. Keep it concise — max 4 short paragraphs or a brief list.
{context_text}
CONVERSATION:
{history_text}

User: {data.message}

Respond directly without prefixing your name:
"""
    try:
        raw = call_ai(prompt)
        return {"message": raw.strip(), "role": "assistant"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Chat failed: {str(e)}")


# ─────────────────────────────────────────
# ENDPOINT 5 — PDF PARSER
# ─────────────────────────────────────────

@app.post("/parse-pdf")
async def parse_pdf(
    file: UploadFile = File(...),
    pdf_type: str = "form16"
):
    contents = await file.read()

    try:
        doc = fitz.open(stream=contents, filetype="pdf")
        text = ""
        for page in doc:
            text += page.get_text()
        doc.close()
    except Exception:
        raise HTTPException(status_code=400, detail="Could not read PDF. Use a text-based PDF.")

    if not text.strip():
        raise HTTPException(status_code=400, detail="PDF is image-based. Please enter data manually.")

    if pdf_type == "form16":
        prompt = f"""
Extract salary and tax data from this Form 16.
Return ONLY valid JSON, no markdown, no explanation:
{{
  "basic_salary": 0,
  "hra_received": 0,
  "special_allowances": 0,
  "investments_80c": 0,
  "health_insurance_80d": 0,
  "nps_80ccd": 0,
  "home_loan_interest": 0,
  "other_deductions": 0
}}
Use 0 for missing fields. All amounts annual in rupees.

DOCUMENT:
{text[:3000]}
"""
    else:
        prompt = f"""
Extract mutual fund data from this CAMS or KFintech statement.
Return ONLY valid JSON, no markdown, no explanation:
{{
  "funds": [
    {{
      "fund_name": "exact fund name",
      "invested_amount": 0,
      "current_value": 0,
      "start_date": "YYYY-MM-DD"
    }}
  ]
}}
One entry per fund. Earliest transaction date as start_date.

DOCUMENT:
{text[:4000]}
"""

    try:
        raw = call_ai(prompt)
        return extract_json(raw)
    except json.JSONDecodeError:
        raise HTTPException(status_code=500, detail="Could not extract PDF data. Please enter manually.")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"PDF parsing failed: {str(e)}")


# ─────────────────────────────────────────
# HEALTH CHECK
# ─────────────────────────────────────────

@app.get("/")
async def root():
    return {
        "status": "MoneyMind AI Backend is running",
        "version": "1.0.0",
        "llm": "Groq llama-3.3-70b-versatile",
        "endpoints": [
            "POST /health-score",
            "POST /tax-wizard",
            "POST /portfolio-xray",
            "POST /ai-chat",
            "POST /parse-pdf"
        ]
    }