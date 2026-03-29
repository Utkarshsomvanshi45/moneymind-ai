import { Link } from 'react-router-dom';
import { Heart, Receipt, TrendingUp, ArrowRight } from 'lucide-react';
import { useCountUp } from '@/hooks/useCountUp';
import { useEffect, useRef, useState } from 'react';

function CountUpOnView({ end, suffix = '' }: { end: number; suffix?: string }) {
  const [visible, setVisible] = useState(false);
  const ref = useRef<HTMLSpanElement>(null);
  const val = useCountUp(visible ? end : 0, 1200, visible);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setVisible(true); }, { threshold: 0.5 });
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return <span ref={ref}>{val.toLocaleString('en-IN')}{suffix}</span>;
}

export default function Landing() {
  return (
    <div className="min-h-screen bg-background page-enter">
      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-[rgba(0,0,0,0.8)] backdrop-blur-xl border-b border-[rgba(255,255,255,0.06)]">
        <div className="max-w-[1200px] mx-auto flex items-center justify-between px-6 py-3">
          <Link to="/" className="text-xl font-bold">
            <span className="text-foreground">MoneyMind</span>
            <span className="text-primary"> AI</span>
          </Link>
          <div className="hidden md:flex items-center gap-8">
            <a href="#features" className="text-muted-foreground hover:text-foreground transition-colors text-sm">Features</a>
            <a href="#how-it-works" className="text-muted-foreground hover:text-foreground transition-colors text-sm">How it works</a>
            <a href="#about" className="text-muted-foreground hover:text-foreground transition-colors text-sm">About</a>
          </div>
          <Link
            to="/dashboard"
            className="bg-primary text-primary-foreground font-bold text-sm px-5 py-2 rounded-lg hover:bg-[#00E07A] hover:scale-[1.02] transition-all duration-150"
          >
            Get Started
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="min-h-screen flex items-center pt-16 relative overflow-hidden">
        {/* Subtle grid */}
        <div className="absolute inset-0 opacity-[0.03]" style={{
          backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.8) 1px, transparent 1px)',
          backgroundSize: '32px 32px',
        }} />

        <div className="max-w-[1200px] mx-auto px-6 grid md:grid-cols-[55%_45%] gap-12 items-center relative z-10">
          {/* Left */}
          <div className="animate-fade-slide-up">
            <div className="inline-flex items-center gap-2 bg-[rgba(0,255,135,0.08)] border border-[rgba(0,255,135,0.2)] text-primary rounded-full px-3 py-1 text-xs font-semibold mb-6">
              <span className="w-2 h-2 rounded-full bg-primary pulse-dot" />
              Powered by Gemini AI
            </div>

            <h1 className="text-4xl md:text-[56px] font-extrabold leading-[1.1] mb-6">
              Your Personal<br />
              Finance Advisor<br />
              <span className="text-gradient">Is Finally Free.</span>
            </h1>

            <p className="text-muted-foreground text-[17px] leading-[1.7] max-w-[480px] mb-8">
              95% of Indians have no financial plan. MoneyMind gives every Indian a CA-level advisor — powered by AI, completely free.
            </p>

            <div className="flex flex-wrap gap-3">
              <Link
                to="/health-score"
                className="bg-primary text-primary-foreground font-bold text-base px-7 py-3.5 rounded-lg hover:bg-[#00E07A] hover:scale-[1.02] transition-all duration-150 inline-flex items-center gap-2"
              >
                Analyze My Finances <ArrowRight size={18} />
              </Link>
              <button className="border border-[rgba(255,255,255,0.15)] text-foreground font-bold text-base px-7 py-3.5 rounded-lg hover:border-[rgba(0,255,135,0.4)] hover:text-primary transition-all duration-150">
                Watch Demo
              </button>
            </div>
          </div>

          {/* Right — Preview card */}
          <div className="animate-fade-slide-up" style={{ animationDelay: '200ms' }}>
            <div className="bg-card border border-[rgba(255,255,255,0.08)] rounded-[20px] p-7 glow-green">
              <div className="flex items-center gap-2 mb-6">
                <span className="text-foreground text-base font-bold">Financial Health Score</span>
                <span className="w-2 h-2 rounded-full bg-primary pulse-dot ml-auto" />
              </div>
              <div className="text-center mb-6">
                <span className="text-[72px] font-extrabold text-primary leading-none">72</span>
                <span className="text-[#525252] text-[32px] font-extrabold">/100</span>
              </div>
              {/* Mini radar decorative */}
              <div className="flex justify-center mb-6">
                <svg width="120" height="100" viewBox="0 0 120 100" className="opacity-40">
                  <polygon points="60,10 100,35 90,80 30,80 20,35" fill="rgba(0,255,135,0.1)" stroke="#00FF87" strokeWidth="1.5" />
                  <polygon points="60,30 80,42 75,65 45,65 40,42" fill="rgba(0,255,135,0.05)" stroke="#00FF87" strokeWidth="0.5" />
                </svg>
              </div>
              <div className="space-y-3">
                {[
                  { label: 'Emergency Fund', status: 'Good', color: '#00FF87' },
                  { label: 'Retirement', status: 'Needs Work', color: '#F59E0B' },
                  { label: 'Insurance', status: 'Critical', color: '#EF4444' },
                ].map((item) => (
                  <div key={item.label} className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }} />
                      <span className="text-muted-foreground">{item.label}</span>
                    </div>
                    <span className="text-[11px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full"
                      style={{ color: item.color, backgroundColor: `${item.color}20` }}>
                      {item.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats bar */}
      <section className="bg-card border-y border-[rgba(255,255,255,0.06)]">
        <div className="max-w-[1200px] mx-auto px-6 py-10 grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-[rgba(255,255,255,0.06)]">
          {[
            { number: 14, suffix: ' Cr+', label: 'demat accounts in India' },
            { number: 25000, prefix: '₹', label: 'average advisor cost per year' },
            { number: 95, suffix: '%', label: 'Indians without a financial plan' },
          ].map((stat, i) => (
            <div key={i} className="text-center py-4 md:py-0">
              <div className="text-3xl md:text-4xl font-bold text-foreground">
                {stat.prefix || ''}<CountUpOnView end={stat.number} suffix={stat.suffix || ''} />
              </div>
              <div className="text-muted-foreground text-[13px] mt-1">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-24">
        <div className="max-w-[1200px] mx-auto px-6">
          <div className="text-center mb-16">
            <p className="text-[11px] font-semibold uppercase tracking-[0.1em] text-primary mb-3">FEATURES</p>
            <h2 className="text-3xl md:text-[40px] font-bold text-foreground mb-3">Everything you need to take control</h2>
            <p className="text-muted-foreground">Three powerful AI tools. Zero cost.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                icon: Heart,
                iconColor: '#00FF87',
                iconBg: 'rgba(0,255,135,0.1)',
                title: 'Money Health Score',
                desc: 'Answer 8 questions and get your complete financial wellness score across 6 dimensions — with a personalized action plan.',
                cta: 'Try it free →',
                ctaColor: '#00FF87',
                link: '/health-score',
              },
              {
                icon: Receipt,
                iconColor: '#7C3AED',
                iconBg: 'rgba(124,58,237,0.1)',
                title: 'Tax Wizard',
                desc: "See exactly how much tax you owe under old vs new regime. Find every deduction you're missing — ranked by how much you save.",
                cta: 'Calculate now →',
                ctaColor: '#7C3AED',
                link: '/tax-wizard',
              },
              {
                icon: TrendingUp,
                iconColor: '#F59E0B',
                iconBg: 'rgba(245,158,11,0.1)',
                title: 'Portfolio X-Ray',
                desc: 'Enter your mutual funds and get your true XIRR, overlap analysis, and a specific AI rebalancing plan in seconds.',
                cta: 'Analyze portfolio →',
                ctaColor: '#F59E0B',
                link: '/portfolio-xray',
              },
            ].map((feat, i) => (
              <div
                key={i}
                className="bg-card border border-[rgba(255,255,255,0.06)] rounded-2xl p-6 hover:border-[rgba(0,255,135,0.2)] hover:-translate-y-0.5 transition-all duration-200 animate-fade-slide-up"
                style={{ animationDelay: `${i * 60}ms` }}
              >
                <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-4" style={{ backgroundColor: feat.iconBg }}>
                  <feat.icon size={24} style={{ color: feat.iconColor }} />
                </div>
                <h3 className="text-lg font-bold text-foreground mb-2">{feat.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed mb-4">{feat.desc}</p>
                <Link to={feat.link} className="text-[13px] font-semibold hover:underline" style={{ color: feat.ctaColor }}>
                  {feat.cta}
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section id="how-it-works" className="py-24">
        <div className="max-w-[1200px] mx-auto px-6 text-center">
          <h2 className="text-3xl md:text-[40px] font-bold text-foreground mb-16">How it works</h2>

          <div className="grid md:grid-cols-3 gap-8 relative">
            {/* Connecting line */}
            <div className="hidden md:block absolute top-[48px] left-[20%] right-[20%] border-t-2 border-dashed border-[rgba(255,255,255,0.08)]" />

            {[
              { num: '01', title: 'Enter your details', desc: 'Answer a few simple questions about your income, investments, and goals' },
              { num: '02', title: 'AI analyzes instantly', desc: 'Our Gemini-powered engine runs the numbers in under 10 seconds' },
              { num: '03', title: 'Get your plan', desc: 'Receive specific, actionable steps with real rupee impact estimates' },
            ].map((step, i) => (
              <div key={i} className="relative z-10 animate-fade-slide-up" style={{ animationDelay: `${i * 100}ms` }}>
                <div className="text-[80px] font-extrabold text-gradient leading-none mb-4">{step.num}</div>
                <h3 className="text-lg font-bold text-foreground mb-2">{step.title}</h3>
                <p className="text-muted-foreground text-sm max-w-[240px] mx-auto">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer id="about" className="border-t border-[rgba(255,255,255,0.06)] py-10">
        <div className="max-w-[1200px] mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <div>
            <span className="text-foreground font-bold">MoneyMind</span>
            <span className="text-primary font-bold"> AI</span>
            <span className="text-muted-foreground text-sm ml-3">Built for ET AI Hackathon 2026</span>
          </div>
          <div className="inline-flex items-center gap-2 bg-[rgba(0,255,135,0.08)] border border-[rgba(0,255,135,0.2)] text-primary rounded-full px-3 py-1 text-xs font-semibold">
            Powered by Gemini AI
          </div>
        </div>
      </footer>
    </div>
  );
}
