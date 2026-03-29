export const API_BASE = "https://moneymind-backend.onrender.com";

export const formatINR = (amount: number): string => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount);
};

export const formatINRCompact = (amount: number): string => {
  if (amount >= 10000000) return `₹${(amount / 10000000).toFixed(1)}Cr`;
  if (amount >= 100000) return `₹${(amount / 100000).toFixed(1)}L`;
  if (amount >= 1000) return `₹${(amount / 1000).toFixed(1)}K`;
  return `₹${amount}`;
};

export const formatPercent = (value: number): string => {
  return `${value.toFixed(1)}%`;
};

export const getScoreColor = (score: number): string => {
  if (score >= 70) return '#00FF87';
  if (score >= 40) return '#F59E0B';
  return '#EF4444';
};

export const getScoreLabel = (score: number): string => {
  if (score >= 90) return 'Excellent';
  if (score >= 70) return 'Good';
  if (score >= 40) return 'Needs attention';
  return 'Critical';
};

export const getScoreBadgeClasses = (score: number): string => {
  if (score >= 70) return 'bg-[rgba(0,255,135,0.15)] text-[#00FF87] border border-[rgba(0,255,135,0.3)]';
  if (score >= 40) return 'bg-[rgba(245,158,11,0.15)] text-[#F59E0B] border border-[rgba(245,158,11,0.3)]';
  return 'bg-[rgba(239,68,68,0.15)] text-[#EF4444] border border-[rgba(239,68,68,0.3)]';
};
