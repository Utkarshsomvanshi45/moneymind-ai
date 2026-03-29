import DashboardLayout from '@/components/DashboardLayout';
import { useCountUp } from '@/hooks/useCountUp';
import { Heart, Receipt, TrendingUp, AlertCircle, Bell, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

function MetricCard({ label, value, suffix, color, icon: Icon, iconColor, subtitle }: {
  label: string; value: number; suffix?: string; color: string;
  icon: React.ElementType; iconColor: string; subtitle: string;
}) {
  const animated = useCountUp(value);
  const display = suffix === '/100' ? animated : 
    value >= 1000 ? `₹${animated.toLocaleString('en-IN')}` : 
    suffix === '%' ? `${(animated / 10).toFixed(1)}%` : String(animated);

  return (
    <div className="bg-card border border-[rgba(255,255,255,0.06)] rounded-2xl p-6 hover:border-[rgba(0,255,135,0.2)] hover:-translate-y-0.5 transition-all duration-200">
      <div className="flex justify-between items-start">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.08em] text-muted-foreground mb-2">{label}</p>
          <div className="flex items-baseline gap-1">
            <span className="text-4xl font-bold" style={{ color }}>{display}</span>
            {suffix === '/100' && <span className="text-xl text-[#525252] font-bold">/100</span>}
          </div>
          <p className="text-[11px] text-[#525252] mt-1">{subtitle}</p>
        </div>
        <Icon size={20} style={{ color: iconColor }} />
      </div>
    </div>
  );
}

export default function Dashboard() {
  const today = new Date().toLocaleDateString('en-IN', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
  });

  return (
    <DashboardLayout>
      {/* Greeting */}
      <div className="flex items-center justify-between mb-8 animate-fade-slide-up">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Good morning, Investor</h1>
          <p className="text-muted-foreground text-[13px] mt-1">{today}</p>
        </div>
        <Bell size={20} className="text-muted-foreground" />
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <MetricCard label="Overall Health" value={72} suffix="/100" color="#00FF87" icon={Heart} iconColor="#00FF87" subtitle="Last analyzed today" />
        <MetricCard label="Tax Savings Found" value={54600} color="#F59E0B" icon={Receipt} iconColor="#F59E0B" subtitle="Potential annual savings" />
        <MetricCard label="Portfolio XIRR" value={142} suffix="%" color="#00FF87" icon={TrendingUp} iconColor="#00FF87" subtitle="+2.3% vs Nifty 50" />
        <MetricCard label="Action Items" value={5} color="#FFFFFF" icon={AlertCircle} iconColor="#F59E0B" subtitle="Priority actions pending" />
      </div>

      {/* Quick Actions */}
      <div className="grid md:grid-cols-2 gap-4 animate-fade-slide-up" style={{ animationDelay: '120ms' }}>
        <div className="bg-card border border-[rgba(255,255,255,0.06)] rounded-2xl p-6 flex items-center justify-between">
          <div>
            <p className="text-foreground font-semibold mb-1">Haven't checked your health score yet?</p>
            <p className="text-muted-foreground text-sm">Get your complete financial wellness analysis</p>
          </div>
          <Link to="/health-score" className="bg-primary text-primary-foreground font-bold text-sm px-4 py-2 rounded-lg hover:bg-[#00E07A] transition-all shrink-0 inline-flex items-center gap-1">
            Start <ArrowRight size={14} />
          </Link>
        </div>
        <div className="bg-card border border-[rgba(255,255,255,0.06)] rounded-2xl p-6 flex items-center justify-between">
          <div>
            <p className="text-foreground font-semibold mb-1">Upload your CAMS statement</p>
            <p className="text-muted-foreground text-sm">Get portfolio analysis with overlap detection</p>
          </div>
          <Link to="/portfolio-xray" className="bg-primary text-primary-foreground font-bold text-sm px-4 py-2 rounded-lg hover:bg-[#00E07A] transition-all shrink-0 inline-flex items-center gap-1">
            Upload <ArrowRight size={14} />
          </Link>
        </div>
      </div>
    </DashboardLayout>
  );
}
