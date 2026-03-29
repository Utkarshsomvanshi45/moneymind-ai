import { Link, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Heart,
  Receipt,
  PieChart,
  MessageCircle,
} from 'lucide-react';

const navItems = [
  { title: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
  { title: 'Health Score', path: '/health-score', icon: Heart },
  { title: 'Tax Wizard', path: '/tax-wizard', icon: Receipt },
  { title: 'Portfolio X-Ray', path: '/portfolio-xray', icon: PieChart },
  { title: 'AI Chat', path: '/ai-chat', icon: MessageCircle, badge: 'NEW' },
];

export default function AppSidebar() {
  const location = useLocation();

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden md:flex flex-col fixed left-0 top-0 bottom-0 w-[220px] border-r border-[rgba(255,255,255,0.06)] bg-background z-40">
        <div className="p-5">
          <Link to="/" className="text-xl font-bold">
            <span className="text-foreground">MoneyMind</span>
            <span className="text-primary"> AI</span>
          </Link>
        </div>

        <nav className="flex-1 px-3 space-y-1">
          {navItems.map((item) => {
            const active = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 px-4 py-[10px] rounded-lg text-sm transition-all duration-150 ${
                  active
                    ? 'bg-[rgba(0,255,135,0.08)] text-primary border-l-2 border-primary'
                    : 'text-muted-foreground hover:bg-surface-2 hover:text-foreground'
                }`}
              >
                <item.icon size={18} />
                <span>{item.title}</span>
                {item.badge && (
                  <span className="ml-auto text-[9px] font-semibold uppercase bg-primary text-primary-foreground px-1.5 py-0.5 rounded">
                    {item.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-[rgba(255,255,255,0.06)]">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-gradient-brand flex items-center justify-center text-xs font-bold text-primary-foreground">
              GU
            </div>
            <div>
              <div className="text-[13px] text-foreground">Guest User</div>
              <div className="text-[11px] text-[#525252]">Free Plan</div>
            </div>
          </div>
        </div>
      </aside>

      {/* Mobile bottom tab bar */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-background border-t border-[rgba(255,255,255,0.06)] z-50 flex justify-around py-2 px-1">
        {navItems.map((item) => {
          const active = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex flex-col items-center p-2 transition-colors ${
                active ? 'text-primary' : 'text-[#525252]'
              }`}
            >
              <item.icon size={20} />
            </Link>
          );
        })}
      </nav>
    </>
  );
}
