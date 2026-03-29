import { useState } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import { Heart, ChevronRight, ChevronLeft, Download, Share2, Shield, TrendingUp, CreditCard, Receipt, Target } from 'lucide-react';
import { useApi } from '@/hooks/useApi';
import { useCountUp } from '@/hooks/useCountUp';
import { healthScoreMockData } from '@/data/mockData';
import { getScoreColor, getScoreBadgeClasses, getScoreLabel } from '@/config';
import { SkeletonGauge, SkeletonDimensionCards } from '@/components/Skeletons';
import {
  Radar, RadarChart, PolarGrid, PolarAngleAxis, ResponsiveContainer,
} from 'recharts';

const dimensionIcons: Record<string, React.ElementType> = {
  Shield, Heart, TrendingUp, CreditCard, Receipt, Target,
};

function ScoreGauge({ score }: { score: number }) {
  const animated = useCountUp(score);
  const color = getScoreColor(score);
  const circumference = 2 * Math.PI * 90;
  const offset = circumference - (animated / 100) * circumference;

  return (
    <div className="flex flex-col items-center">
      <svg width="220" height="220" viewBox="0 0 220 220">
        <circle cx="110" cy="110" r="90" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="12" />
        <circle
          cx="110" cy="110" r="90" fill="none"
          stroke={color} strokeWidth="12" strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          transform="rotate(-90 110 110)"
          style={{ transition: 'stroke-dashoffset 1.2s ease-out' }}
        />
        <text x="110" y="105" textAnchor="middle" fill={color} fontSize="64" fontWeight="700" fontFamily="Space Grotesk">{animated}</text>
        <text x="110" y="130" textAnchor="middle" fill="#525252" fontSize="14">out of 100</text>
      </svg>
      <span className={`mt-2 text-sm font-semibold px-3 py-1 rounded-full ${getScoreBadgeClasses(score)}`}>
        {healthScoreMockData.grade}
      </span>
    </div>
  );
}

export default function HealthScore() {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({
    income: '', expenses: '', age: 28, dependents: 0,
    emergencyFund: '', hasHealth: null as boolean | null, healthCover: '',
    hasTerm: null as boolean | null, termCover: '',
    sip: '', investments: '', loans: '', emi: '', hasRetirement: null as boolean | null,
  });

  const { data, loading, execute } = useApi('/health-score', healthScoreMockData);

  const updateField = (key: string, value: unknown) => setForm(prev => ({ ...prev, [key]: value }));

  const handleAnalyze = () => {
    // Transform form data from frontend naming to backend naming
    const payload = {
      monthly_income: parseFloat(form.income) || 0,
      monthly_expenses: parseFloat(form.expenses) || 0,
      age: form.age,
      dependents: form.dependents,
      emergency_fund: parseFloat(form.emergencyFund) || 0,
      has_health_insurance: form.hasHealth || false,
      health_insurance_cover: form.hasHealth ? parseFloat(form.healthCover) || 0 : 0,
      has_term_insurance: form.hasTerm || false,
      term_insurance_cover: form.hasTerm ? parseFloat(form.termCover) || 0 : 0,
      monthly_sip: parseFloat(form.sip) || 0,
      total_investments: parseFloat(form.investments) || 0,
      total_loans: parseFloat(form.loans) || 0,
      monthly_emi: parseFloat(form.emi) || 0,
      has_retirement_plan: form.hasRetirement || false,
    };
    execute(payload);
  };

  const radarData = data ? data.dimensions.map(d => ({ subject: d.name, score: d.score, fullMark: 100 })) : [];

  return (
    <DashboardLayout>
      <div className="grid lg:grid-cols-[55%_45%] gap-6">
        {/* Left — Form */}
        <div className="bg-card border border-[rgba(255,255,255,0.06)] rounded-2xl p-7 animate-fade-slide-up">
          <div className="flex items-center gap-3 mb-1">
            <div className="w-10 h-10 rounded-xl bg-[rgba(0,255,135,0.1)] flex items-center justify-center">
              <Heart size={20} className="text-primary" />
            </div>
            <div>
              <h2 className="text-[22px] font-bold text-foreground">Money Health Score</h2>
              <p className="text-muted-foreground text-sm">Answer 8 quick questions</p>
            </div>
          </div>

          {/* Progress */}
          <div className="flex items-center gap-2 my-6">
            {[1, 2, 3].map(s => (
              <div key={s} className="flex-1 h-1 rounded-full overflow-hidden bg-surface-3">
                <div className={`h-full rounded-full transition-all duration-500 ${s <= step ? 'bg-primary' : ''}`}
                  style={{ width: s < step ? '100%' : s === step ? '50%' : '0%' }} />
              </div>
            ))}
            <span className="text-muted-foreground text-xs ml-2">Step {step} of 3</span>
          </div>

          {step === 1 && (
            <div className="space-y-5">
              <h3 className="text-foreground font-semibold">Basic Info</h3>
              <InputField label="Monthly Income" prefix="₹" value={form.income} onChange={v => updateField('income', v)} />
              <InputField label="Monthly Expenses" prefix="₹" value={form.expenses} onChange={v => updateField('expenses', v)} />
              <div>
                <label className="text-sm text-muted-foreground block mb-2">Age</label>
                <div className="flex items-center gap-4">
                  <input type="range" min={18} max={65} value={form.age}
                    onChange={e => updateField('age', +e.target.value)}
                    className="flex-1 accent-[#00FF87] h-1.5 bg-surface-3 rounded-full appearance-none [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-[18px] [&::-webkit-slider-thumb]:h-[18px] [&::-webkit-slider-thumb]:bg-primary [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:cursor-pointer" />
                  <span className="text-foreground text-sm font-medium w-16">{form.age} years</span>
                </div>
              </div>
              <div>
                <label className="text-sm text-muted-foreground block mb-2">Dependents</label>
                <div className="flex items-center gap-4">
                  <button onClick={() => updateField('dependents', Math.max(0, form.dependents - 1))}
                    className="w-10 h-10 rounded-full border border-[rgba(255,255,255,0.1)] text-foreground hover:border-primary transition-colors flex items-center justify-center text-lg">−</button>
                  <span className="text-2xl font-bold text-foreground w-8 text-center">{form.dependents}</span>
                  <button onClick={() => updateField('dependents', form.dependents + 1)}
                    className="w-10 h-10 rounded-full border border-[rgba(255,255,255,0.1)] text-foreground hover:border-primary transition-colors flex items-center justify-center text-lg">+</button>
                </div>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-5">
              <h3 className="text-foreground font-semibold">Protection</h3>
              <InputField label="Emergency Fund" prefix="₹" value={form.emergencyFund} onChange={v => updateField('emergencyFund', v)} />
              <PillSelect label="Do you have health insurance?" value={form.hasHealth} onChange={v => updateField('hasHealth', v)} />
              {form.hasHealth && (
                <div className="animate-fade-slide-up">
                  <InputField label="Health Insurance Cover" prefix="₹" value={form.healthCover} onChange={v => updateField('healthCover', v)} />
                </div>
              )}
              <PillSelect label="Do you have term insurance?" value={form.hasTerm} onChange={v => updateField('hasTerm', v)} />
              {form.hasTerm && (
                <div className="animate-fade-slide-up">
                  <InputField label="Term Cover" prefix="₹" value={form.termCover} onChange={v => updateField('termCover', v)} />
                </div>
              )}
            </div>
          )}

          {step === 3 && (
            <div className="space-y-5">
              <h3 className="text-foreground font-semibold">Investments & Debt</h3>
              <InputField label="Monthly SIP Amount" prefix="₹" value={form.sip} onChange={v => updateField('sip', v)} />
              <InputField label="Total Existing Investments" prefix="₹" value={form.investments} onChange={v => updateField('investments', v)} />
              <InputField label="Total Outstanding Loans" prefix="₹" value={form.loans} onChange={v => updateField('loans', v)} />
              <InputField label="Monthly EMI" prefix="₹" value={form.emi} onChange={v => updateField('emi', v)} />
              <PillSelect label="Do you have a retirement plan?" value={form.hasRetirement} onChange={v => updateField('hasRetirement', v)} />
            </div>
          )}

          {/* Navigation */}
          <div className="flex gap-3 mt-8">
            {step > 1 && (
              <button onClick={() => setStep(s => s - 1)}
                className="border border-[rgba(255,255,255,0.15)] text-foreground font-bold px-5 py-3 rounded-lg hover:border-[rgba(0,255,135,0.4)] hover:text-primary transition-all">
                <ChevronLeft size={16} className="inline mr-1" /> Back
              </button>
            )}
            {step < 3 ? (
              <button onClick={() => setStep(s => s + 1)}
                className="flex-1 bg-primary text-primary-foreground font-bold py-3.5 rounded-lg hover:bg-[#00E07A] hover:scale-[1.01] transition-all text-base">
                Next <ChevronRight size={16} className="inline ml-1" />
              </button>
            ) : (
              <button onClick={handleAnalyze} disabled={loading}
                className="flex-1 bg-primary text-primary-foreground font-bold py-3.5 rounded-lg hover:bg-[#00E07A] hover:scale-[1.01] transition-all text-base disabled:opacity-60">
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <span className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                    Analyzing...
                  </span>
                ) : 'Analyze Now →'}
              </button>
            )}
          </div>
        </div>

        {/* Right — Results */}
        <div className="animate-fade-slide-up" style={{ animationDelay: '100ms' }}>
          {loading && (
            <div className="space-y-6">
              <SkeletonGauge />
              <SkeletonDimensionCards />
            </div>
          )}

          {data && !loading && (
            <div className="space-y-6">
              <ScoreGauge score={data.overall_score} />

              {/* Radar */}
              <div className="h-[240px]">
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart data={radarData}>
                    <PolarGrid stroke="rgba(255,255,255,0.06)" />
                    <PolarAngleAxis dataKey="subject" tick={{ fill: '#A3A3A3', fontSize: 11 }} />
                    <Radar dataKey="score" stroke="#00FF87" fill="rgba(0,255,135,0.1)" strokeWidth={1.5} dot={{ r: 3, fill: '#00FF87' }}
                      animationBegin={0} animationDuration={800} />
                  </RadarChart>
                </ResponsiveContainer>
              </div>

              {/* Dimension cards */}
              <div className="grid grid-cols-2 gap-3">
                {data.dimensions.map((dim, i) => {
                  const IconComp = dimensionIcons[dim.icon] || Shield;
                  const color = getScoreColor(dim.score);
                  return (
                    <div key={i} className="bg-surface-2 rounded-xl p-4 animate-fade-slide-up" style={{ animationDelay: `${i * 60}ms` }}>
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-1.5">
                          <IconComp size={14} style={{ color }} />
                          <span className="text-[13px] font-bold text-foreground">{dim.name}</span>
                        </div>
                        <span className="text-xl font-bold" style={{ color }}>{dim.score}</span>
                      </div>
                      <div className="h-1.5 rounded-full bg-surface-3 overflow-hidden mb-2">
                        <div className="h-full rounded-full transition-all duration-1000" style={{ width: `${dim.score}%`, backgroundColor: color }} />
                      </div>
                      <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${getScoreBadgeClasses(dim.score)}`}>
                        {dim.status}
                      </span>
                    </div>
                  );
                })}
              </div>

              {/* Priority Actions */}
              <div className="bg-card border border-[rgba(255,255,255,0.06)] rounded-2xl p-5">
                <h3 className="text-base font-bold text-foreground mb-4">🎯 Top 3 Priority Actions</h3>
                <div className="space-y-3">
                  {data.actions.map((action, i) => (
                    <div key={i} className={`flex items-start gap-3 ${i < data.actions.length - 1 ? 'pb-3 border-b border-[rgba(255,255,255,0.04)]' : ''}`}>
                      <div className="w-7 h-7 rounded-full bg-gradient-brand flex items-center justify-center text-xs font-bold text-foreground shrink-0">
                        {i + 1}
                      </div>
                      <div>
                        <p className="text-sm font-bold text-foreground">{action.title}</p>
                        <p className="text-primary text-xs mt-0.5">{action.impact}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex gap-3">
                <button className="flex-1 border border-[rgba(255,255,255,0.15)] text-foreground font-semibold py-2.5 rounded-lg hover:border-[rgba(0,255,135,0.4)] hover:text-primary transition-all text-sm flex items-center justify-center gap-2">
                  <Download size={14} /> Download Report
                </button>
                <button className="flex-1 border border-[rgba(255,255,255,0.15)] text-foreground font-semibold py-2.5 rounded-lg hover:border-[rgba(0,255,135,0.4)] hover:text-primary transition-all text-sm flex items-center justify-center gap-2">
                  <Share2 size={14} /> Share Score
                </button>
              </div>
            </div>
          )}

          {!data && !loading && (
            <div className="flex flex-col items-center justify-center h-full min-h-[400px] text-center">
              <div className="w-16 h-16 rounded-2xl bg-gradient-brand flex items-center justify-center mb-4">
                <Heart size={28} className="text-foreground" />
              </div>
              <h3 className="text-lg font-bold text-foreground mb-2">No analysis yet</h3>
              <p className="text-muted-foreground text-sm max-w-[240px]">Fill in your details and click Analyze Now to see your financial health score</p>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}

function InputField({ label, prefix, value, onChange }: {
  label: string; prefix?: string; value: string; onChange: (v: string) => void;
}) {
  return (
    <div>
      <label className="text-sm text-muted-foreground block mb-1.5">{label}</label>
      <div className="flex items-center bg-surface-3 border border-[rgba(255,255,255,0.08)] rounded-lg focus-within:border-primary transition-colors">
        {prefix && <span className="text-primary font-semibold pl-3 pr-1">{prefix}</span>}
        <input
          type="number"
          value={value}
          onChange={e => onChange(e.target.value)}
          className="flex-1 bg-transparent py-2.5 pr-3 text-foreground outline-none text-sm placeholder:text-[#525252] [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
          placeholder="0"
        />
      </div>
    </div>
  );
}

function PillSelect({ label, value, onChange }: {
  label: string; value: boolean | null; onChange: (v: boolean) => void;
}) {
  return (
    <div>
      <label className="text-sm text-muted-foreground block mb-2">{label}</label>
      <div className="flex gap-2">
        {[true, false].map(v => (
          <button key={String(v)} onClick={() => onChange(v)}
            className={`flex-1 py-2 rounded-lg text-sm font-semibold transition-all ${
              value === v
                ? 'bg-primary text-primary-foreground'
                : 'bg-surface-3 text-muted-foreground border border-[rgba(255,255,255,0.08)] hover:border-[rgba(0,255,135,0.3)]'
            }`}>
            {v ? 'Yes' : 'No'}
          </button>
        ))}
      </div>
    </div>
  );
}
