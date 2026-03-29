import { useState } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import { Receipt, Upload, ChevronDown, ChevronUp } from 'lucide-react';
import { useApi } from '@/hooks/useApi';
import { useCountUp } from '@/hooks/useCountUp';
import { taxWizardMockData } from '@/data/mockData';
import { formatINR } from '@/config';
import { SkeletonCard } from '@/components/Skeletons';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
} from 'recharts';

function InputField({ label, prefix, value, onChange, helper }: {
  label: string; prefix?: string; value: string; onChange: (v: string) => void; helper?: string;
}) {
  return (
    <div>
      <label className="text-sm text-muted-foreground block mb-1.5">{label}</label>
      <div className="flex items-center bg-surface-3 border border-[rgba(255,255,255,0.08)] rounded-lg focus-within:border-primary transition-colors">
        {prefix && <span className="text-primary font-semibold pl-3 pr-1">{prefix}</span>}
        <input type="number" value={value} onChange={e => onChange(e.target.value)}
          className="flex-1 bg-transparent py-2.5 pr-3 text-foreground outline-none text-sm placeholder:text-[#525252] [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
          placeholder="0" />
      </div>
      {helper && <p className="text-[#525252] text-xs mt-1">{helper}</p>}
    </div>
  );
}

export default function TaxWizard() {
  const [tab, setTab] = useState<'manual' | 'upload'>('manual');
  const [form, setForm] = useState({
    salary: '', hra: '', rent: '', allowances: '',
    sec80c: '', sec80d: '', nps: '', homeLoan: '', other: '',
  });
  const [expandedDeduction, setExpandedDeduction] = useState<number | null>(null);

  const { data, loading, execute } = useApi('/tax-wizard', taxWizardMockData);

  const updateField = (key: string, value: string) => setForm(prev => ({ ...prev, [key]: value }));

  const handleCalculate = () => {
    // Transform form data from frontend naming to backend naming
    const payload = {
      basic_salary: parseFloat(form.salary) || 0,
      hra_received: parseFloat(form.hra) || 0,
      rent_paid: parseFloat(form.rent) || 0,
      special_allowances: parseFloat(form.allowances) || 0,
      investments_80c: parseFloat(form.sec80c) || 0,
      health_insurance_80d: parseFloat(form.sec80d) || 0,
      nps_80ccd: parseFloat(form.nps) || 0,
      home_loan_interest: parseFloat(form.homeLoan) || 0,
      other_deductions: parseFloat(form.other) || 0,
    };
    execute(payload);
  };

  const oldTax = useCountUp(data ? data.old_regime.tax : 0, 1200, !!data);
  const newTax = useCountUp(data ? data.new_regime.tax : 0, 1200, !!data);
  const savings = useCountUp(data ? data.savings : 0, 1200, !!data);

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (!active || !payload) return null;
    return (
      <div className="bg-surface-3 border border-[rgba(255,255,255,0.1)] rounded-lg p-3 text-sm">
        <p className="text-foreground font-semibold mb-1">{label}</p>
        {payload.map((p: any, i: number) => (
          <p key={i} style={{ color: p.color }} className="text-xs">{p.name}: {formatINR(p.value)}</p>
        ))}
      </div>
    );
  };

  return (
    <DashboardLayout>
      <div className="grid lg:grid-cols-[55%_45%] gap-6">
        {/* Left — Input */}
        <div className="bg-card border border-[rgba(255,255,255,0.06)] rounded-2xl p-7 animate-fade-slide-up">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-[rgba(124,58,237,0.1)] flex items-center justify-center">
              <Receipt size={20} className="text-secondary" />
            </div>
            <h2 className="text-[22px] font-bold text-foreground">Tax Wizard</h2>
          </div>

          {/* Tabs */}
          <div className="flex border-b border-[rgba(255,255,255,0.06)] mb-6">
            {(['manual', 'upload'] as const).map(t => (
              <button key={t} onClick={() => setTab(t)}
                className={`pb-3 px-4 text-sm font-semibold transition-colors ${
                  tab === t ? 'text-foreground border-b-2 border-primary' : 'text-muted-foreground'
                }`}>
                {t === 'manual' ? 'Enter Manually' : 'Upload Form 16'}
              </button>
            ))}
          </div>

          {tab === 'manual' ? (
            <div className="space-y-5">
              <InputField label="Basic Salary (₹/year)" prefix="₹" value={form.salary} onChange={v => updateField('salary', v)} />
              <InputField label="HRA Received (₹/year)" prefix="₹" value={form.hra} onChange={v => updateField('hra', v)} />
              <InputField label="Rent Paid (₹/year)" prefix="₹" value={form.rent} onChange={v => updateField('rent', v)} helper="Used to calculate HRA exemption" />
              <InputField label="Special Allowances (₹/year)" prefix="₹" value={form.allowances} onChange={v => updateField('allowances', v)} />

              <div className="border-t border-[rgba(255,255,255,0.06)] pt-5">
                <h3 className="text-foreground font-semibold mb-4">Deductions</h3>
                <div className="space-y-5">
                  <div>
                    <InputField label="80C Investments (₹)" prefix="₹" value={form.sec80c} onChange={v => updateField('sec80c', v)}
                      helper="ELSS, PPF, LIC, home loan principal" />
                    <div className="mt-1.5 h-1 rounded-full bg-surface-3 overflow-hidden">
                      <div className="h-full bg-primary rounded-full transition-all" style={{ width: `${Math.min(100, (Number(form.sec80c) / 150000) * 100)}%` }} />
                    </div>
                    <p className="text-[10px] text-[#525252] mt-0.5">{formatINR(Number(form.sec80c) || 0)} / ₹1,50,000 limit</p>
                  </div>
                  <InputField label="Health Insurance 80D (₹)" prefix="₹" value={form.sec80d} onChange={v => updateField('sec80d', v)}
                    helper="Max ₹25,000 for self + family" />
                  <InputField label="NPS Contribution 80CCD (₹)" prefix="₹" value={form.nps} onChange={v => updateField('nps', v)}
                    helper="Additional ₹50,000 over 80C" />
                  <InputField label="Home Loan Interest (₹)" prefix="₹" value={form.homeLoan} onChange={v => updateField('homeLoan', v)}
                    helper="Max ₹2,00,000 under Section 24(b)" />
                  <InputField label="Other Deductions (₹)" prefix="₹" value={form.other} onChange={v => updateField('other', v)} />
                </div>
              </div>

              <button onClick={handleCalculate} disabled={loading}
                className="w-full bg-primary text-primary-foreground font-bold py-3.5 rounded-lg hover:bg-[#00E07A] hover:scale-[1.01] transition-all text-base disabled:opacity-60">
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <span className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                    Calculating...
                  </span>
                ) : 'Calculate Tax'}
              </button>
            </div>
          ) : (
            <div className="border-2 border-dashed border-[rgba(255,255,255,0.1)] rounded-2xl p-12 text-center">
              <Upload size={48} className="text-muted-foreground mx-auto mb-4" />
              <p className="text-foreground text-base mb-1">Drop your Form 16 PDF here</p>
              <p className="text-muted-foreground text-sm underline cursor-pointer">or click to browse</p>
            </div>
          )}
        </div>

        {/* Right — Results */}
        <div className="animate-fade-slide-up" style={{ animationDelay: '100ms' }}>
          {loading && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4"><SkeletonCard /><SkeletonCard /></div>
              <SkeletonCard />
              <SkeletonCard />
            </div>
          )}

          {data && !loading && (
            <div className="space-y-5">
              {/* Regime comparison */}
              <div className="grid grid-cols-2 gap-4">
                {(['old', 'new'] as const).map(regime => {
                  const d = regime === 'old' ? data.old_regime : data.new_regime;
                  const recommended = data.recommended === regime;
                  const taxVal = regime === 'old' ? oldTax : newTax;
                  return (
                    <div key={regime} className={`bg-surface-2 rounded-2xl p-5 relative ${
                      recommended ? 'border-[1.5px] border-primary' : 'border border-[rgba(255,255,255,0.06)]'
                    }`}>
                      {recommended && (
                        <span className="absolute -top-3 right-3 bg-gradient-brand text-foreground text-[10px] font-bold uppercase px-2 py-0.5 rounded">
                          RECOMMENDED
                        </span>
                      )}
                      <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground mb-2">
                        {regime === 'old' ? 'Old Regime' : 'New Regime'}
                      </p>
                      <p className="text-3xl font-bold text-foreground">₹{taxVal.toLocaleString('en-IN')}</p>
                      <p className="text-muted-foreground text-sm mt-1">Effective rate: {d.effective_rate}%</p>
                    </div>
                  );
                })}
              </div>

              {/* Savings callout */}
              <div className="bg-[rgba(0,255,135,0.05)] border border-[rgba(0,255,135,0.2)] rounded-xl p-4 flex items-center gap-3">
                <span className="text-foreground text-sm">You save</span>
                <span className="text-[32px] font-bold text-primary">₹{savings.toLocaleString('en-IN')}</span>
                <span className="text-foreground text-sm">by choosing {data.recommended} regime</span>
              </div>

              {/* Chart */}
              <div className="h-[220px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={data.breakdown} barGap={4}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
                    <XAxis dataKey="category" tick={{ fill: '#A3A3A3', fontSize: 12 }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fill: '#A3A3A3', fontSize: 12 }} axisLine={false} tickLine={false}
                      tickFormatter={(v: number) => `₹${(v / 100000).toFixed(0)}L`} />
                    <Tooltip content={<CustomTooltip />} />
                    <Legend wrapperStyle={{ fontSize: 12, color: '#A3A3A3' }} />
                    <Bar dataKey="old" name="Old Regime" fill="#7C3AED" radius={[4, 4, 0, 0]} animationBegin={0} animationDuration={800} />
                    <Bar dataKey="new" name="New Regime" fill="#00FF87" radius={[4, 4, 0, 0]} animationBegin={0} animationDuration={800} />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              {/* Missed deductions */}
              <div className="bg-card border border-[rgba(255,255,255,0.06)] rounded-2xl p-5">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-base font-bold text-foreground">💡 Deductions You're Missing</h3>
                  <span className="text-xs font-semibold bg-[rgba(0,255,135,0.15)] text-primary px-2 py-0.5 rounded-full">
                    Save ₹{data.missed_deductions.reduce((s, d) => s + d.amount, 0).toLocaleString('en-IN')}
                  </span>
                </div>
                <div className="space-y-2">
                  {data.missed_deductions.map((ded, i) => (
                    <div key={i} className="bg-surface-2 rounded-xl overflow-hidden">
                      <button onClick={() => setExpandedDeduction(expandedDeduction === i ? null : i)}
                        className="w-full flex items-center gap-3 p-3 text-left hover:bg-surface-3 transition-colors">
                        <span className="text-[11px] font-bold bg-secondary/20 text-secondary px-2 py-0.5 rounded">{ded.section}</span>
                        <span className="text-sm text-foreground flex-1">{ded.description}</span>
                        <span className="text-primary text-sm font-bold">Save ₹{ded.amount.toLocaleString('en-IN')}</span>
                        {expandedDeduction === i ? <ChevronUp size={14} className="text-muted-foreground" /> : <ChevronDown size={14} className="text-muted-foreground" />}
                      </button>
                      {expandedDeduction === i && (
                        <div className="px-3 pb-3 text-muted-foreground text-sm animate-fade-slide-up">
                          <p className="pl-12"><strong className="text-foreground">How to claim:</strong> {ded.how}</p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Investment suggestions */}
              <div className="grid grid-cols-3 gap-3">
                {data.suggestions.map((s, i) => (
                  <div key={i} className="bg-surface-2 rounded-xl p-4">
                    <p className="text-foreground font-semibold text-sm mb-2">{s.name}</p>
                    <p className="text-primary text-xs">{s.returns}</p>
                    <p className="text-warning text-xs">{s.lockin}</p>
                    <span className="text-[10px] font-bold bg-secondary/20 text-secondary px-1.5 py-0.5 rounded mt-2 inline-block">{s.section}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {!data && !loading && (
            <div className="flex flex-col items-center justify-center h-full min-h-[400px] text-center">
              <div className="w-16 h-16 rounded-2xl bg-[rgba(124,58,237,0.1)] flex items-center justify-center mb-4">
                <Receipt size={28} className="text-secondary" />
              </div>
              <h3 className="text-lg font-bold text-foreground mb-2">No calculation yet</h3>
              <p className="text-muted-foreground text-sm max-w-[240px]">Enter your salary details to compare tax regimes</p>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
