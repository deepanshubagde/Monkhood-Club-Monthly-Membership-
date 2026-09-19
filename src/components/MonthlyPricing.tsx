import { Sparkles, ShieldCheck } from 'lucide-react';

interface MonthlyPricingProps {
  customMonthlyUrl?: string;
}

const monthlyBenefits = [
  'Daily Monk Morning Sangha Sessions',
  'Sunday Weekly Live Community Sessions',
  'Premium Recorded Courses',
  'Live Guest Expert Sessions',
  'Session Recordings',
  'Community Access',
  'Mindfulness & Meditation Library',
  "Buddha's Wisdom for Modern Life",
  'New Course Every Month',
];

export function MonthlyPricing({
  customMonthlyUrl = 'https://learn.monkhoodclub.com/web/checkout/6a690eba258d6e22aee85fcf',
}: MonthlyPricingProps) {
  return (
    <section id="pricing-section" className="py-6 sm:py-8 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto z-10 relative">
      <div className="max-w-lg mx-auto">
        <div
          id="monthly-membership-card"
          className="relative group rounded-3xl p-7 sm:p-9 pt-9 sm:pt-10 bg-[#0d091e]/90 border-2 border-amber-400/80 hover:border-amber-300 backdrop-blur-xl shadow-[0_0_50px_rgba(245,215,127,0.3)] hover:shadow-[0_0_70px_rgba(245,215,127,0.45)] transition-all duration-500 flex flex-col justify-between overflow-visible"
        >
          {/* Top Floating Badge */}
          <div className="absolute -top-4 left-1/2 -translate-x-1/2 z-20">
            <span
              id="monthly-badge"
              className="bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-500 text-slate-950 px-5 py-1.5 rounded-full text-[11px] font-black tracking-widest uppercase shadow-[0_0_25px_rgba(245,215,127,0.9)] flex items-center space-x-1.5 border border-yellow-200 whitespace-nowrap"
            >
              <Sparkles className="w-3.5 h-3.5 text-slate-950" />
              <span>DIGITAL SANGHA ACCESS</span>
            </span>
          </div>

          <div>
            {/* Title & Description */}
            <div className="text-center sm:text-left">
              <h3 className="font-cinzel text-2xl sm:text-3xl font-bold text-slate-100 tracking-wide mb-1 pt-1 gold-text-gradient">
                Monthly Membership
              </h3>
              <p className="text-xs sm:text-sm text-slate-300 font-light mb-6">
                Perfect to begin and sustain your mindfulness journey.
              </p>
            </div>

            {/* Price display */}
            <div className="mb-6 flex items-baseline justify-center sm:justify-start space-x-2 border-b border-amber-500/20 pb-6">
              <span className="font-price text-5xl sm:text-6xl font-semibold gold-text-gradient tracking-tight">
                ₹51
              </span>
              <span className="text-sm sm:text-base text-slate-400 font-normal">
                /month
              </span>
            </div>

            {/* Included label */}
            <div className="mb-4">
              <span className="text-[11px] font-bold tracking-[0.2em] text-slate-400 uppercase">
                INCLUDES
              </span>
            </div>

            {/* Checklist */}
            <ul className="space-y-3 mb-8">
              {monthlyBenefits.map((item, idx) => (
                <li key={idx} className="flex items-center space-x-3 text-xs sm:text-sm text-slate-200">
                  <span className="w-4 h-4 rounded-full bg-[#181308] border border-amber-600/40 flex items-center justify-center text-amber-400 text-[10px] flex-shrink-0">
                    ✓
                  </span>
                  <span className="font-medium text-slate-200">{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Action CTA & reassurance */}
          <div>
            <a
              id="join-monthly-btn"
              href={customMonthlyUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="relative group overflow-hidden w-full block text-center py-4 px-6 rounded-full font-extrabold text-xs sm:text-sm tracking-widest uppercase bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-500 hover:brightness-110 text-slate-950 shadow-[0_0_35px_rgba(245,215,127,0.6)] active:scale-[0.97] active:brightness-95 transition-transform duration-100 ease-out cursor-pointer select-none border border-yellow-200"
            >
              <span className="absolute inset-0 w-1/2 h-full bg-gradient-to-r from-transparent via-white/50 to-transparent -skew-x-12 animate-shimmer pointer-events-none" />
              <span className="relative z-10 flex items-center justify-center space-x-2">
                <Sparkles className="w-4 h-4 text-slate-950 animate-pulse" />
                <span>Join Monthly • ₹51</span>
              </span>
            </a>

            <div className="flex items-center justify-center space-x-1.5 text-[11px] text-slate-400 mt-3">
              <ShieldCheck className="w-3.5 h-3.5 text-amber-400/80" />
              <span>Renews automatically every month • Cancel anytime.</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
