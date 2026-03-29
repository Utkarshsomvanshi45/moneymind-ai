import { useState, useRef, useEffect } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import { Sparkles, Paperclip, ArrowUp } from 'lucide-react';

interface Message {
  role: 'ai' | 'user';
  content: string;
}

const quickPrompts = [
  'How can I save more tax?',
  'Should I increase my SIP?',
  'Am I ready for retirement?',
  'Explain my overlap issue',
];

const aiResponses: Record<string, string> = {
  'How can I save more tax?': "Based on your profile, you're missing out on ₹54,600 in tax savings. Here's what I recommend:\n\n1. **Invest ₹38,000 more in ELSS** under Section 80C — this gives you tax savings of ~₹11,780 AND potential 14% returns.\n\n2. **Get health insurance for your parents** — the premium is deductible under 80D, saving you ₹15,600/year.\n\n3. **Start NPS with ₹50,000/year** — extra deduction under 80CCD(1B) saves ₹15,600 more.\n\nWant me to create a month-by-month investment plan?",
  'Should I increase my SIP?': "Your current SIP of ₹15,000/month is building a solid corpus, but here's the math:\n\n📊 **Current projection**: ₹1.2 Cr by age 50\n📊 **With ₹25,000 SIP**: ₹2.1 Cr by age 50\n\nThe extra ₹10,000/month costs you ₹1.2L/year but adds ₹90L to your retirement corpus. That's a 75x multiplier over 22 years!\n\nI'd suggest increasing by ₹5,000 now and another ₹5,000 after your next increment. This way it won't strain your monthly budget.",
  'Am I ready for retirement?': "Let me be honest — your retirement score is 42/100, which needs attention. Here's why:\n\n❌ **Current corpus**: ₹8.5L (you need ~₹3 Cr for a comfortable retirement)\n❌ **No NPS or EPF top-up** — you're relying only on mutual funds\n⚠️ **No pension plan** — 100% market-linked is risky post-retirement\n\n✅ **What to do**:\n1. Start NPS immediately (₹5,000/mo)\n2. Increase equity SIP by ₹10,000\n3. Consider a PPF account for debt allocation\n\nWith these changes, you'll be on track to hit ₹3 Cr by age 58.",
  'Explain my overlap issue': "Your portfolio has a 68% overlap, which means your funds are holding many of the same stocks. Here's the breakdown:\n\n🔴 **ICICI Pru Bluechip** and **Mirae Asset Large Cap** share 82% of the same holdings — you're essentially paying double expense ratio for the same stocks!\n\n**Impact**: You're losing ~₹4,200/year in unnecessary fees.\n\n**My recommendation**:\n1. Sell ICICI Pru Bluechip (higher expense ratio)\n2. Keep Mirae Asset Large Cap (better returns)\n3. Use the proceeds to buy Parag Parikh Flexi Cap for international diversification\n\nThis single change reduces overlap to 31% and saves ₹1,200/year in fees.",
};

export default function AIChat() {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'ai',
      content: "Namaste! I'm your personal AI financial advisor. I have context from your health score (72/100) and portfolio analysis. Ask me anything about your finances — from tax planning to investment strategy.",
    },
  ]);
  const [input, setInput] = useState('');
  const [typing, setTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages, typing]);

  const sendMessage = async (text: string) => {
    if (!text.trim()) return;
    const userMsg = text.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMsg }]);
    setTyping(true);

    await new Promise(r => setTimeout(r, 1200 + Math.random() * 800));

    const response = aiResponses[userMsg] ||
      `That's a great question! Based on your financial profile (Health Score: 72, XIRR: 14.2%), here's my analysis:\n\nYour overall financial health is good, but there are areas for improvement. I'd recommend focusing on building your emergency fund to 6 months of expenses and getting adequate term insurance coverage.\n\nWould you like me to dive deeper into any specific area?`;

    setTyping(false);
    setMessages(prev => [...prev, { role: 'ai', content: response }]);
  };

  return (
    <DashboardLayout>
      <div className="flex flex-col h-[calc(100vh-48px)] md:h-[calc(100vh-24px)] -m-6">
        {/* Top bar */}
        <div className="px-6 py-4 border-b border-[rgba(255,255,255,0.06)] flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-gradient-brand flex items-center justify-center">
                <Sparkles size={16} className="text-foreground" />
              </div>
              <span className="text-lg font-bold text-foreground">MoneyMind AI Assistant</span>
            </div>
            <div className="flex items-center gap-1.5 mt-1 ml-10">
              <span className="w-1.5 h-1.5 rounded-full bg-primary pulse-dot" />
              <span className="text-muted-foreground text-xs">Powered by Gemini</span>
            </div>
          </div>
          <span className="hidden md:inline-block text-[11px] text-muted-foreground bg-surface-2 border border-[rgba(255,255,255,0.06)] rounded-full px-3 py-1">
            Context: Health Score 72 · Portfolio analyzed
          </span>
        </div>

        {/* Messages */}
        <div ref={scrollRef} className="flex-1 overflow-y-auto px-6 py-6">
          <div className="max-w-[800px] mx-auto space-y-4">
            {messages.map((msg, i) => (
              <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-fade-slide-up`}>
                {msg.role === 'ai' && (
                  <div className="w-9 h-9 rounded-full bg-gradient-brand flex items-center justify-center shrink-0 mr-3 mt-1">
                    <Sparkles size={14} className="text-foreground" />
                  </div>
                )}
                <div className={`max-w-[75%] rounded-2xl px-5 py-3.5 text-sm leading-relaxed ${
                  msg.role === 'user'
                    ? 'bg-[rgba(0,255,135,0.08)] border border-[rgba(0,255,135,0.15)] rounded-br-sm text-foreground'
                    : 'bg-card border border-[rgba(255,255,255,0.06)] rounded-bl-sm text-foreground'
                }`}>
                  <div className="whitespace-pre-wrap" dangerouslySetInnerHTML={{
                    __html: msg.content
                      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                      .replace(/\n/g, '<br/>')
                  }} />
                </div>
              </div>
            ))}

            {/* Quick prompts after first AI message */}
            {messages.length === 1 && (
              <div className="flex flex-wrap gap-2 ml-12">
                {quickPrompts.map((prompt) => (
                  <button key={prompt} onClick={() => sendMessage(prompt)}
                    className="bg-surface-3 border border-[rgba(255,255,255,0.08)] rounded-full px-4 py-2 text-[13px] text-muted-foreground hover:border-[rgba(0,255,135,0.3)] hover:text-primary transition-all">
                    {prompt}
                  </button>
                ))}
              </div>
            )}

            {/* Typing indicator */}
            {typing && (
              <div className="flex items-start">
                <div className="w-9 h-9 rounded-full bg-gradient-brand flex items-center justify-center shrink-0 mr-3">
                  <Sparkles size={14} className="text-foreground" />
                </div>
                <div className="bg-card border border-[rgba(255,255,255,0.06)] rounded-2xl rounded-bl-sm px-5 py-4">
                  <div className="flex gap-1.5">
                    {[0, 1, 2].map(j => (
                      <span key={j} className="w-2 h-2 rounded-full bg-primary typing-dot" style={{ animationDelay: `${j * 200}ms` }} />
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Input */}
        <div className="border-t border-[rgba(255,255,255,0.06)] px-6 py-4">
          <div className="max-w-[800px] mx-auto flex items-center gap-3 bg-card border border-[rgba(255,255,255,0.08)] rounded-[14px] px-4 py-3">
            <Paperclip size={18} className="text-[#525252] hover:text-muted-foreground cursor-pointer transition-colors shrink-0" />
            <input
              type="text"
              value={input}
              onChange={e => setInput(e.target.value.slice(0, 500))}
              onKeyDown={e => e.key === 'Enter' && sendMessage(input)}
              placeholder="Ask anything about your finances..."
              className="flex-1 bg-transparent text-foreground outline-none text-sm placeholder:text-[#525252]"
            />
            <span className="text-[11px] text-[#525252] shrink-0">{input.length}/500</span>
            <button
              onClick={() => sendMessage(input)}
              disabled={!input.trim()}
              className={`w-8 h-8 rounded-full flex items-center justify-center transition-all shrink-0 ${
                input.trim()
                  ? 'bg-primary text-primary-foreground hover:scale-110'
                  : 'bg-surface-3 text-[#525252]'
              }`}
            >
              <ArrowUp size={16} />
            </button>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
