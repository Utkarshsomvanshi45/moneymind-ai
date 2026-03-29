export const healthScoreMockData = {
  overall_score: 72,
  grade: 'B+',
  dimensions: [
    { name: 'Emergency Fund', score: 65, icon: 'Shield', status: 'Needs attention' },
    { name: 'Insurance', score: 45, icon: 'Heart', status: 'Critical' },
    { name: 'Investments', score: 82, icon: 'TrendingUp', status: 'Good' },
    { name: 'Debt Management', score: 78, icon: 'CreditCard', status: 'Good' },
    { name: 'Tax Efficiency', score: 60, icon: 'Receipt', status: 'Needs attention' },
    { name: 'Retirement', score: 42, icon: 'Target', status: 'Critical' },
  ],
  actions: [
    {
      title: 'Get Term Insurance Cover of ₹1 Crore',
      impact: 'Protect family for ₹800/mo',
    },
    {
      title: 'Increase Emergency Fund to 6 Months',
      impact: 'Save ₹15,600/year in stress',
    },
    {
      title: 'Start ₹5,000 NPS SIP for Retirement',
      impact: 'Build ₹1.2 Cr corpus by 60',
    },
  ],
};

export const taxWizardMockData = {
  old_regime: {
    tax: 154700,
    effective_rate: 8.2,
    deductions: 312000,
  },
  new_regime: {
    tax: 209300,
    effective_rate: 11.1,
    deductions: 75000,
  },
  recommended: 'old' as const,
  savings: 54600,
  missed_deductions: [
    { section: '80C', description: 'You can invest ₹38,000 more in ELSS/PPF', amount: 11780, how: 'Invest in ELSS mutual funds for tax saving + market returns' },
    { section: '80D', description: 'Parents health insurance premium', amount: 15600, how: 'Get a ₹5L health cover for parents – premiums are deductible up to ₹50,000' },
    { section: '80CCD', description: 'NPS additional contribution', amount: 15600, how: 'Open NPS account and invest ₹50,000/year for extra deduction' },
    { section: '24(b)', description: 'Home loan interest deduction', amount: 11620, how: 'Claim full interest paid on home loan up to ₹2,00,000' },
  ],
  suggestions: [
    { name: 'Axis ELSS Tax Saver Fund', returns: '14.8% (3Y)', lockin: '3 years', section: '80C' },
    { name: 'HDFC Retirement Savings Fund', returns: '12.4% (5Y)', lockin: '5 years (60 age)', section: '80CCD' },
    { name: 'Star Health Insurance (Parents)', returns: 'N/A', lockin: 'Annual', section: '80D' },
  ],
  breakdown: [
    { category: 'Gross Income', old: 1890000, new: 1890000 },
    { category: 'Deductions', old: 312000, new: 75000 },
    { category: 'Taxable Income', old: 1578000, new: 1815000 },
    { category: 'Tax Payable', old: 154700, new: 209300 },
  ],
};

export const portfolioMockData = {
  xirr: 14.2,
  nifty_comparison: 2.3,
  expense_drag: 4200,
  overlap_score: 68,
  total_invested: 1250000,
  allocation: [
    { name: 'Large Cap', value: 45, amount: 562500, color: '#00FF87' },
    { name: 'Flexi Cap', value: 25, amount: 312500, color: '#7C3AED' },
    { name: 'Mid Cap', value: 15, amount: 187500, color: '#F59E0B' },
    { name: 'Small Cap', value: 10, amount: 125000, color: '#EF4444' },
    { name: 'Debt', value: 5, amount: 62500, color: '#3B82F6' },
  ],
  rebalancing: [
    { action: 'SELL', fund: 'ICICI Pru Bluechip Fund', reason: 'High overlap (82%) with Mirae Asset Large Cap', benefit: 'Reduce overlap by 34%' },
    { action: 'BUY', fund: 'Parag Parikh Flexi Cap Fund', reason: 'Adds international diversification', benefit: 'Improve risk-adjusted returns' },
    { action: 'SWITCH', fund: 'HDFC Mid-Cap Opportunities', reason: 'High expense ratio (1.8%)', benefit: 'Save ₹1,200/yr in expense ratio' },
  ],
  performance: [
    { month: 'Jan', portfolio: 100, nifty: 100 },
    { month: 'Feb', portfolio: 103, nifty: 101 },
    { month: 'Mar', portfolio: 98, nifty: 97 },
    { month: 'Apr', portfolio: 107, nifty: 104 },
    { month: 'May', portfolio: 112, nifty: 108 },
    { month: 'Jun', portfolio: 109, nifty: 106 },
    { month: 'Jul', portfolio: 115, nifty: 110 },
    { month: 'Aug', portfolio: 121, nifty: 113 },
    { month: 'Sep', portfolio: 118, nifty: 111 },
    { month: 'Oct', portfolio: 125, nifty: 116 },
    { month: 'Nov', portfolio: 130, nifty: 119 },
    { month: 'Dec', portfolio: 128, nifty: 117 },
  ],
};
