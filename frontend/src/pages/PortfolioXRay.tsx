import { useState } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import { PieChart as PieChartIcon, TrendingUp, Upload, Trash2, Plus, AlertTriangle } from 'lucide-react';
import { useApi } from '@/hooks/useApi';
import { useCountUp } from '@/hooks/useCountUp';
import { portfolioMockData } from '@/data/mockData';
import { formatINRCompact, formatPercent } from '@/config';
import { SkeletonCard } from '@/components/Skeletons';
import {
  PieChart, Pie, Cell, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
} from 'recharts';

interface Fund {
  name: string;
  invested: string;
  current: string;
  startDate: string;
}

export default function PortfolioXRay() {
  const [tab, setTab] = useState<'manual' | 'upload'>('manual');
  const [funds, setFunds] = useState<Fund[]>([
    { name: '', invested: '', current: '', startDate: '' },
    { name: '', invested: '', current: '', startDate: '' },
  ]);

  const { data, loading, execute } = useApi('/portfolio-xray', portfolioMockData);

  const addFund = () => setFunds(prev => [...prev, { name: '', invested: '', current: '', startDate: '' }]);
  const removeFund = (i: number) => setFunds(prev => prev.filter((_, idx) => idx !== i));
  const updateFund = (i: number, key: keyof Fund, value: string) => {
    setFunds(prev => prev.map((f, idx) => idx === i ? { ...f, [key]: value } : f));
  };

  const xirr = useCountUp(data ? Math.round(data.xirr * 10) : 0, 1200, !!data);
  const overlap = useCountUp(data ? data.overlap_score : 0, 1200, !!data);

  const getFundReturn = (fund: Fund) => {
    const inv = Number(fund.invested);
    const cur = Number(fund.current);
    if (!inv || !cur) return null;
    const returnPct = ((cur - inv) / inv * 100);
    const returnAmt = cur - inv;
    return { pct: returnPct, amt: returnAmt };
  };

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (!active || !payload) return null;
    return (
      <div className="bg-surface-3 border border-[rgba(255,255,255,0.1)] rounded-lg p-3 text-sm">
        <p className="text-foreground font-semibold mb-1">{label}</p>
        {payload.map((p: any, i: number) => (
          <p key={i} style={{ color: p.color }} className="text-xs">{p.name}: {p.value}</p>
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
            <div className="w-10 h-10 rounded-xl bg-[rgba(245,158,11,0.1)] flex items-center justify-center">
              <PieChartIcon size={20} className="text-warning" />
            </div>
            <h2 className="text-[22px] font-bold text-foreground">Portfolio X-Ray</h2>
          </div>

          {/* Tabs */}
          <div className="flex border-b border-[rgba(255,255,255,0.06)] mb-6">
            {(['manual', 'upload'] as const).map(t => (
              <button key={t} onClick={() => setTab(t)}
                className={`pb-3 px-4 text-sm font-semibold transition-colors ${
                  tab === t ? 'text-foreground border-b-2 border-primary' : 'text-muted-foreground'
                }`}>
                {t === 'manual' ? 'Enter Manually' : 'Upload CAMS Statement'}
              </button>
            ))}
          </div>

          {tab === 'manual' ? (
            <div className="space-y-3">
              {funds.map((fund, i) => {
                const ret = getFundReturn(fund);
                return (
                  <div key={i} className="bg-surface-2 rounded-xl p-5 space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-muted-foreground">Fund {i + 1}</span>
                      {funds.length > 1 && (
                        <button onClick={() => removeFund(i)} className="text-muted-foreground hover:text-destructive transition-colors">
                          <Trash2 size={14} />
                        </button>
                      )}
                    </div>
                    <input type="text" value={fund.name} onChange={e => updateFund(i, 'name', e.target.value)}
                      placeholder="Fund name (e.g., Mirae Asset Large Cap)"
                      className="w-full bg-surface-3 border border-[rgba(255,255,255,0.08)] rounded-lg py-2.5 px-3 text-foreground text-sm outline-none focus:border-primary transition-colors placeholder:text-[#525252]" />
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="text-xs text-muted-foreground block mb-1">Invested (₹)</label>
                        <div className="flex items-center bg-surface-3 border border-[rgba(255,255,255,0.08)] rounded-lg focus-within:border-primary transition-colors">
                          <span className="text-primary font-semibold pl-3 pr-1 text-sm">₹</span>
                          <input type="number" value={fund.invested} onChange={e => updateFund(i, 'invested', e.target.value)}
                            className="flex-1 bg-transparent py-2 pr-3 text-foreground outline-none text-sm placeholder:text-[#525252] [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                            placeholder="0" />
                        </div>
                      </div>
                      <div>
                        <label className="text-xs text-muted-foreground block mb-1">Current Value (₹)</label>
                        <div className="flex items-center bg-surface-3 border border-[rgba(255,255,255,0.08)] rounded-lg focus-within:border-primary transition-colors">
                          <span className="text-primary font-semibold pl-3 pr-1 text-sm">₹</span>
                          <input type="number" value={fund.current} onChange={e => updateFund(i, 'current', e.target.value)}
                            className="flex-1 bg-transparent py-2 pr-3 text-foreground outline-none text-sm placeholder:text-[#525252] [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                            placeholder="0" />
                        </div>
                      </div>
                    </div>
                    <div>
                      <label className="text-xs text-muted-foreground block mb-1">Start Date</label>
                      <input type="date" value={fund.startDate} onChange={e => updateFund(i, 'startDate', e.target.value)}
                        className="w-full bg-surface-3 border border-[rgba(255,255,255,0.08)] rounded-lg py-2.5 px-3 text-foreground text-sm outline-none focus:border-primary transition-colors" />
                    </div>
                    {ret && (
                      <p className={`text-xs font-semibold ${ret.pct >= 0 ? 'text-primary' : 'text-destructive'}`}>
                        Return: {ret.pct >= 0 ? '+' : ''}{ret.pct.toFixed(1)}% ({ret.amt >= 0 ? '+' : ''}₹{Math.abs(ret.amt).toLocaleString('en-IN')})
                      </p>
                    )}
                  </div>
                );
              })}

              <button onClick={addFund}
                className="w-full border border-dashed border-[rgba(255,255,255,0.1)] rounded-xl py-3.5 text-muted-foreground text-sm hover:border-primary hover:text-primary hover:bg-[rgba(0,255,135,0.04)] transition-all flex items-center justify-center gap-2">
                <Plus size={16} /> Add another fund
              </button>

              <button onClick={() => {
                // Transform funds data from frontend naming to backend naming
                const transformedFunds = funds
                  .filter(f => f.name && f.invested && f.current && f.startDate) // Only include filled funds
                  .map(fund => ({
                    fund_name: fund.name,
                    invested_amount: parseFloat(fund.invested) || 0,
                    current_value: parseFloat(fund.current) || 0,
                    start_date: fund.startDate,
                  }));
                execute({ funds: transformedFunds });
              }} disabled={loading}
                className="w-full bg-primary text-primary-foreground font-bold py-3.5 rounded-lg hover:bg-[#00E07A] hover:scale-[1.01] transition-all text-base disabled:opacity-60 flex items-center justify-center gap-2">
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <span className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                    Analyzing...
                  </span>
                ) : <><TrendingUp size={18} /> Analyze Portfolio</>}
              </button>
            </div>
          ) : (
            <div className="border-2 border-dashed border-[rgba(255,255,255,0.1)] rounded-2xl p-12 text-center">
              <Upload size={48} className="text-muted-foreground mx-auto mb-4" />
              <p className="text-foreground text-base mb-1">Drop your CAMS Statement here</p>
              <p className="text-muted-foreground text-sm underline cursor-pointer">or click to browse</p>
            </div>
          )}
        </div>

        {/* Right — Results */}
        <div className="animate-fade-slide-up" style={{ animationDelay: '100ms' }}>
          {loading && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4"><SkeletonCard /><SkeletonCard /><SkeletonCard /><SkeletonCard /></div>
              <SkeletonCard />
            </div>
          )}

          {data && !loading && (
            <div className="space-y-5">
              {/* Top metrics */}
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-card border border-[rgba(255,255,255,0.06)] rounded-2xl p-4">
                  <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground mb-1">True XIRR</p>
                  <p className={`text-3xl font-bold ${data.xirr >= 12 ? 'text-primary' : data.xirr >= 8 ? 'text-warning' : 'text-destructive'}`}>
                    {(xirr / 10).toFixed(1)}%
                  </p>
                  <p className="text-[11px] text-[#525252]">Annualized return</p>
                </div>
                <div className="bg-card border border-[rgba(255,255,255,0.06)] rounded-2xl p-4">
                  <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground mb-1">vs Nifty 50</p>
                  <p className="text-3xl font-bold text-primary">+{data.nifty_comparison}%</p>
                  <p className="text-[11px] text-[#525252]">Benchmark comparison</p>
                </div>
                <div className="bg-card border border-[rgba(255,255,255,0.06)] rounded-2xl p-4">
                  <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground mb-1">Expense Drag</p>
                  <p className="text-3xl font-bold text-warning">₹{data.expense_drag.toLocaleString('en-IN')}/yr</p>
                  <p className="text-[11px] text-[#525252]">Annual fee leakage</p>
                </div>
                <div className="bg-card border border-[rgba(255,255,255,0.06)] rounded-2xl p-4">
                  <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground mb-1">Overlap Score</p>
                  <p className="text-3xl font-bold text-destructive">{overlap}%</p>
                  <p className="text-[11px] text-[#525252]">Portfolio overlap</p>
                </div>
              </div>

              {/* Donut */}
              <div className="bg-card border border-[rgba(255,255,255,0.06)] rounded-2xl p-5">
                <h3 className="text-sm font-bold text-foreground mb-3">Portfolio Allocation</h3>
                <div className="flex items-center gap-6">
                  <div className="relative">
                    <ResponsiveContainer width={180} height={180}>
                      <PieChart>
                        <Pie data={data.allocation} dataKey="value" cx="50%" cy="50%" innerRadius={55} outerRadius={80}
                          animationBegin={0} animationDuration={800}>
                          {data.allocation.map((entry, i) => (
                            <Cell key={i} fill={entry.color} />
                          ))}
                        </Pie>
                      </PieChart>
                    </ResponsiveContainer>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-foreground font-bold text-sm">{formatINRCompact(data.total_invested)}</span>
                    </div>
                  </div>
                  <div className="space-y-2 flex-1">
                    {data.allocation.map((a, i) => (
                      <div key={i} className="flex items-center gap-2 text-xs">
                        <span className="w-3 h-3 rounded-sm" style={{ backgroundColor: a.color }} />
                        <span className="text-muted-foreground flex-1">{a.name}</span>
                        <span className="text-foreground font-semibold">{a.value}%</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Overlap warning */}
              {data.overlap_score > 50 && (
                <div className="bg-[rgba(245,158,11,0.06)] border border-[rgba(245,158,11,0.3)] rounded-xl p-4 flex items-start gap-3">
                  <AlertTriangle size={18} className="text-warning shrink-0 mt-0.5" />
                  <div>
                    <p className="text-warning font-bold text-sm">High Overlap Detected</p>
                    <p className="text-foreground text-sm mt-1">Your funds hold many of the same stocks. You're paying double fees for similar exposure.</p>
                  </div>
                </div>
              )}

              {/* AI Rebalancing */}
              <div className="bg-card border border-[rgba(255,255,255,0.06)] rounded-2xl p-5">
                <h3 className="text-base font-bold text-foreground mb-4">🤖 AI Rebalancing Plan</h3>
                <div className="space-y-3">
                  {data.rebalancing.map((r, i) => {
                    const actionStyles: Record<string, string> = {
                      SELL: 'bg-[rgba(239,68,68,0.15)] border-[rgba(239,68,68,0.3)] text-destructive',
                      BUY: 'bg-[rgba(0,255,135,0.1)] border-[rgba(0,255,135,0.3)] text-primary',
                      SWITCH: 'bg-[rgba(124,58,237,0.15)] border-[rgba(124,58,237,0.3)] text-[#A78BFA]',
                    };
                    return (
                      <div key={i} className="bg-surface-2 rounded-lg p-3.5">
                        <div className="flex items-start gap-3">
                          <span className={`text-[10px] font-bold uppercase px-2.5 py-1 rounded-md border ${actionStyles[r.action]}`}>
                            {r.action}
                          </span>
                          <div className="flex-1">
                            <p className="text-sm font-bold text-foreground">{r.fund}</p>
                            <p className="text-muted-foreground text-[13px] mt-0.5">{r.reason}</p>
                            <p className="text-primary text-xs mt-1">{r.benefit}</p>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Performance chart */}
              <div className="bg-card border border-[rgba(255,255,255,0.06)] rounded-2xl p-5">
                <h3 className="text-sm font-bold text-foreground mb-3">Portfolio vs Nifty 50</h3>
                <div className="h-[200px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={data.performance}>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
                      <XAxis dataKey="month" tick={{ fill: '#A3A3A3', fontSize: 12 }} axisLine={false} tickLine={false} />
                      <YAxis tick={{ fill: '#A3A3A3', fontSize: 12 }} axisLine={false} tickLine={false} />
                      <Tooltip content={<CustomTooltip />} />
                      <Legend wrapperStyle={{ fontSize: 12, color: '#A3A3A3' }} />
                      <Line type="monotone" dataKey="portfolio" name="Portfolio" stroke="#00FF87" strokeWidth={2.5} dot={false}
                        animationBegin={0} animationDuration={800} />
                      <Line type="monotone" dataKey="nifty" name="Nifty 50" stroke="#525252" strokeWidth={1.5} strokeDasharray="5 5" dot={false}
                        animationBegin={0} animationDuration={800} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          )}

          {!data && !loading && (
            <div className="flex flex-col items-center justify-center h-full min-h-[400px] text-center">
              <div className="w-16 h-16 rounded-2xl bg-[rgba(245,158,11,0.1)] flex items-center justify-center mb-4">
                <PieChartIcon size={28} className="text-warning" />
              </div>
              <h3 className="text-lg font-bold text-foreground mb-2">No analysis yet</h3>
              <p className="text-muted-foreground text-sm max-w-[240px]">Enter your mutual fund details to get a complete portfolio analysis</p>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
