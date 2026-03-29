from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
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

app.add_middleware(
    CORSMiddleware,
    allow_origins=["https://moneymind-frontend.onrender.com"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

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
You are a certified Indian financial planner (CFP). Analyze this person's
financial data and return a comprehensive Money Health Score.

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
1. emergency_fund: Ideal = 6x monthly expenses = Rs {data.monthly_expenses * 6}. Score = (actual / ideal) * 100, max 100.
2. insurance: 0 if no health insurance. +50 for health insurance with adequate cover. +50 for term insurance with cover >= 10x annual income.
3. investments: savings_rate = monthly_sip / monthly_income. Score = min(savings_rate / 0.20 * 100, 100). 20% savings rate = perfect score.
4. debt: emi_ratio = monthly_emi / monthly_income. Score = max(0, 100 - (emi_ratio * 200)). 0 EMI = 100. 50% income in EMI = 0.
5. tax_efficiency: Estimate based on income. Above Rs 10L with no 80C investments = low score. Good investments = high score.
6. retirement: 100 if has plan AND age < 35. 70 if has plan AND age 35-50. 40 if no plan AND age < 35. 10 if no plan AND age > 50.

Overall = weighted average: emergency_fund*0.25 + insurance*0.20 + investments*0.20 + debt*0.15 + tax_efficiency*0.10 + retirement*0.10

IMPORTANT: Return ONLY a valid JSON object. No explanation, no markdown, no text before or after. Just the raw JSON.

{{
  "scores": {{
    "emergency_fund": 0,
    "insurance": 0,
    "investments": 0,
    "debt": 0,
    "tax_efficiency": 0,
    "retirement": 0
  }},
  "overall": 0,
  "grade": "B",
  "summary": "2 sentence plain English summary of their financial health",
  "top_actions": [
    {{
      "priority": 1,
      "action": "specific action with rupee amounts",
      "impact": "specific rupee or percent impact per year",
      "category": "emergency_fund"
    }},
    {{
      "priority": 2,
      "action": "specific action with rupee amounts",
      "impact": "specific rupee or percent impact per year",
      "category": "insurance"
    }},
    {{
      "priority": 3,
      "action": "specific action with rupee amounts",
      "impact": "specific rupee or percent impact per year",
      "category": "investments"
    }}
  ]
}}

Replace every 0 and placeholder with real calculated values.
Grade rules: A for 85+, B for 70-84, C for 55-69, D for 40-54, F for below 40.
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
- Basic Salary: Rs {data.basic_salary} per year
- HRA Received: Rs {data.hra_received} per year
- Rent Paid: Rs {data.rent_paid} per year
- Special Allowances: Rs {data.special_allowances} per year
- Gross Income: Rs {gross_income} per year

DEDUCTIONS CLAIMED:
- 80C: Rs {data.investments_80c} (max Rs 150000)
- 80D health insurance: Rs {data.health_insurance_80d} (max Rs 25000)
- 80CCD NPS: Rs {data.nps_80ccd} (max Rs 50000)
- Home loan interest 24b: Rs {data.home_loan_interest} (max Rs 200000)
- Other: Rs {data.other_deductions}

TAX CALCULATION RULES FY2024-25:

OLD REGIME SLABS:
- Up to Rs 250000: 0%
- Rs 250001 to Rs 500000: 5%
- Rs 500001 to Rs 1000000: 20%
- Above Rs 1000000: 30%
- Standard deduction: Rs 50000
- HRA exemption: minimum of (actual HRA received, 50% of basic salary for metro city, rent paid minus 10% of basic salary)
- Add 4% health and education cess on final tax

NEW REGIME SLABS:
- Up to Rs 300000: 0%
- Rs 300001 to Rs 600000: 5%
- Rs 600001 to Rs 900000: 10%
- Rs 900001 to Rs 1200000: 15%
- Rs 1200001 to Rs 1500000: 20%
- Above Rs 1500000: 30%
- Standard deduction: Rs 75000 only
- No other deductions allowed in new regime
- Section 87A rebate: if taxable income is less than or equal to Rs 700000 then total tax becomes 0
- Add 4% health and education cess on final tax

IMPORTANT: Return ONLY a valid JSON object. No explanation, no markdown, no text before or after. Just the raw JSON.

{{
  "gross_income": {gross_income},
  "old_regime": {{
    "hra_exemption": 0,
    "total_deductions": 0,
    "taxable_income": 0,
    "tax_before_cess": 0,
    "cess": 0,
    "total_tax": 0,
    "effective_rate": 0.0
  }},
  "new_regime": {{
    "standard_deduction": 75000,
    "taxable_income": 0,
    "tax_before_cess": 0,
    "cess": 0,
    "total_tax": 0,
    "effective_rate": 0.0
  }},
  "recommended_regime": "old",
  "savings_by_switching": 0,
  "missed_deductions": [
    {{
      "section": "80C",
      "current_amount": {data.investments_80c},
      "max_allowed": 150000,
      "gap": 0,
      "potential_tax_saving": 0,
      "description": "Invest in ELSS mutual funds, PPF, or NSC to claim full Rs 1.5L deduction",
      "instruments": ["ELSS Mutual Funds", "PPF", "NSC", "5-year FD"]
    }},
    {{
      "section": "80D",
      "current_amount": {data.health_insurance_80d},
      "max_allowed": 25000,
      "gap": 0,
      "potential_tax_saving": 0,
      "description": "Health insurance premium for self and family",
      "instruments": ["Health Insurance Policy"]
    }},
    {{
      "section": "80CCD(1B)",
      "current_amount": {data.nps_80ccd},
      "max_allowed": 50000,
      "gap": 0,
      "potential_tax_saving": 0,
      "description": "Additional NPS contribution gives extra deduction over 80C limit",
      "instruments": ["National Pension Scheme (NPS)"]
    }}
  ],
  "total_additional_savings_possible": 0,
  "investment_suggestions": [
    {{
      "name": "ELSS Mutual Fund",
      "section": "80C",
      "expected_returns": "12-15% p.a.",
      "lock_in": "3 years",
      "risk": "Moderate-High",
      "tax_benefit": "Up to Rs 46800 saved"
    }},
    {{
      "name": "Public Provident Fund",
      "section": "80C",
      "expected_returns": "7.1% p.a.",
      "lock_in": "15 years",
      "risk": "Zero risk",
      "tax_benefit": "Up to Rs 46800 saved"
    }},
    {{
      "name": "National Pension Scheme",
      "section": "80CCD(1B)",
      "expected_returns": "10-12% p.a.",
      "lock_in": "Till retirement",
      "risk": "Low-Moderate",
      "tax_benefit": "Up to Rs 15600 extra saved"
    }}
  ]
}}

Replace all 0 values with real calculated numbers.
recommended_regime: whichever has lower total_tax.
savings_by_switching: absolute difference between the two total_tax values.
gap in missed_deductions: max_allowed minus current_amount, never negative.
potential_tax_saving: gap multiplied by the user marginal tax rate.
total_additional_savings_possible: sum of all potential_tax_saving values.
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
        f"Current Value Rs {f.current_value}, Started {f.start_date}"
        for f in data.funds
    ])
    total_invested = sum(f.invested_amount for f in data.funds)
    total_current = sum(f.current_value for f in data.funds)
    abs_return = total_current - total_invested
    abs_return_pct = round((abs_return / total_invested * 100), 1) if total_invested > 0 else 0

    prompt = f"""
You are an expert Indian mutual fund analyst. Analyze this portfolio.

PORTFOLIO:
{funds_text}

Total Invested: Rs {total_invested}
Total Current Value: Rs {total_current}
Absolute Return: Rs {abs_return} which is {abs_return_pct} percent
Number of funds: {len(data.funds)}

Use your knowledge of Indian mutual funds to determine each fund category,
typical holdings, expense ratio, and overlap with other funds in the portfolio.

IMPORTANT: Return ONLY a valid JSON object. No explanation, no markdown, no text before or after. Just the raw JSON.

{{
  "total_invested": {total_invested},
  "total_current_value": {total_current},
  "absolute_return": {abs_return},
  "absolute_return_percent": {abs_return_pct},
  "xirr": 0.0,
  "vs_nifty50": "+0.0",
  "expense_drag_yearly": 0,
  "overlap_score": 0,
  "category_allocation": [
    {{"category": "Large Cap", "percentage": 0, "amount": 0}},
    {{"category": "Mid Cap", "percentage": 0, "amount": 0}},
    {{"category": "Small Cap", "percentage": 0, "amount": 0}},
    {{"category": "Flexi Cap", "percentage": 0, "amount": 0}},
    {{"category": "Debt", "percentage": 0, "amount": 0}}
  ],
  "fund_analysis": [
    {{
      "fund_name": "replace with actual fund name",
      "category": "replace with category",
      "invested": 0,
      "current_value": 0,
      "returns_percent": 0.0,
      "expense_ratio": 0.0,
      "rating": 4,
      "comment": "one line honest assessment"
    }}
  ],
  "overlap_pairs": [
    {{
      "fund1": "fund name",
      "fund2": "fund name",
      "overlap_percent": 0,
      "risk_level": "low"
    }}
  ],
  "rebalancing_suggestions": [
    {{
      "action": "SELL",
      "fund": "fund name",
      "reason": "specific reason",
      "benefit": "expected benefit with numbers",
      "urgency": "high"
    }}
  ],
  "portfolio_health": "Healthy",
  "diversification_score": 0,
  "summary": "3 to 4 sentence honest portfolio assessment"
}}

Rules:
- xirr: estimate realistically between 8 and 25 based on dates and returns
- vs_nifty50: xirr minus 13.0, format as string like +2.3 or -1.5
- overlap_score: 60 to 80 for two large cap funds, 10 to 20 for large cap plus small cap
- category_allocation percentages must sum to exactly 100
- fund_analysis must have one entry per fund in the portfolio
- overlap_pairs must cover every unique pair of funds
- action must be one of SELL, BUY, SWITCH, or INCREASE_SIP
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
        context_text = f"\nUSER FINANCIAL CONTEXT (use this to personalize your answers):\n{json.dumps(data.user_context, indent=2)}\n"

    history_text = ""
    for msg in data.history[-6:]:
        role = "User" if msg.role == "user" else "MoneyMind AI"
        history_text += f"{role}: {msg.content}\n"

    prompt = f"""
You are MoneyMind AI, a friendly Indian personal finance advisor.
Speak in a warm helpful tone. Give specific actionable advice.
Always mention Indian financial products where relevant: ELSS, PPF, NPS, SIP, NSE, BSE.
Reference Indian tax laws and rupee amounts.
Keep responses concise — maximum 4 short paragraphs or a brief bullet list.
Never be generic. Always be specific to the user's situation.
{context_text}
CONVERSATION SO FAR:
{history_text}

User just said: {data.message}

Respond as MoneyMind AI. Do not prefix your reply with your name.
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
        raise HTTPException(
            status_code=400,
            detail="Could not read PDF. Make sure it is a valid text-based PDF."
        )

    if not text.strip():
        raise HTTPException(
            status_code=400,
            detail="PDF appears to be scanned or image-based. Please enter data manually."
        )

    if pdf_type == "form16":
        prompt = f"""
Extract salary and tax data from this Form 16 document.
IMPORTANT: Return ONLY a valid JSON object. No explanation, no markdown, no text before or after.

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

Replace 0 with actual annual rupee amounts found in the document.
Use 0 for any field not found in the document.

DOCUMENT TEXT:
{text[:3000]}
"""
    else:
        prompt = f"""
Extract mutual fund portfolio data from this CAMS or KFintech statement.
IMPORTANT: Return ONLY a valid JSON object. No explanation, no markdown, no text before or after.

{{
  "funds": [
    {{
      "fund_name": "exact fund name from document",
      "invested_amount": 0,
      "current_value": 0,
      "start_date": "YYYY-MM-DD"
    }}
  ]
}}

Create one entry per fund found in the document.
Use the earliest transaction date as start_date in YYYY-MM-DD format.
All amounts in rupees as plain numbers.

DOCUMENT TEXT:
{text[:4000]}
"""

    try:
        raw = call_ai(prompt)
        return extract_json(raw)
    except json.JSONDecodeError:
        raise HTTPException(
            status_code=500,
            detail="Could not extract data from PDF. Please enter manually."
        )
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