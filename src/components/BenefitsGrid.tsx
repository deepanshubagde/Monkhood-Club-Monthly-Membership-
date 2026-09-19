import { MouseEvent } from 'react';
import {
  Compass,
  Users,
  BookOpen,
  Clock,
  TrendingUp,
  Heart,
  Video,
  MessageSquare,
  Sparkles,
  ArrowRight,
} from 'lucide-react';

const benefits = [
  { icon: Compass, label: 'Daily Guided Meditation' },
  { icon: Users, label: 'Supportive Community' },
  { icon: BookOpen, label: 'Premium Learning Library' },
  { icon: Clock, label: 'Learn at Your Own Pace' },
  { icon: TrendingUp, label: 'Continuous Personal Growth' },
  { icon: Heart, label: 'Trusted by the Monkhood Community' },
  { icon: Video, label: 'Weekly Sunday Live Sessions' },
  { icon: MessageSquare, label: 'Interactive Community Feed Access' },
];

export function BenefitsGrid() {
  const handleScrollToMonthly = (e: MouseEvent) => {
    e.preventDefault();
    const target =
      document.getElementById('monthly-membership-card') ||
      document.getElementById('pricing-section');
    if (target) {
      target.scrollIntoView({ behavior: 'smooth', block: 'center' });
      target.classList.add('ring-4', 'ring-amber-400/90', 'scale-[1.02]');
      setTimeout(() => {
        target.classList.remove('ring-4', 'ring-amber-400/90', 'scale-[1.02]');
      }, 1400);
    }
  };

  return (
    <section id="benefits-section" className="pt-1 sm:pt-2 pb-8 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto z-10 relative">
      {/* Shiny Join Monthly Redirect Button */}
      <div className="flex flex-col items-center justify-center mb-8 text-center">
        <a
          id="benefits-join-monthly-btn"
          href="#pricing-section"
          onClick={handleScrollToMonthly}
          className="group relative inline-flex items-center justify-center space-x-3 px-8 sm:px-10 py-4 rounded-full font-black text-xs sm:text-sm tracking-widest uppercase bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-500 text-slate-950 shadow-[0_0_35px_rgba(245,215,127,0.7)] hover:shadow-[0_0_60px_rgba(245,215,127,1)] hover:scale-105 active:scale-[0.96] transition-transform duration-100 ease-out cursor-pointer overflow-hidden border border-yellow-100/90 select-none"
        >
          {/* Continuous Gleaming Metallic Shimmer */}
          <span className="absolute inset-0 w-1/2 h-full bg-gradient-to-r from-transparent via-white/70 to-transparent -skew-x-12 animate-shimmer pointer-events-none" />

          <Sparkles className="w-4 h-4 text-slate-950 animate-pulse flex-shrink-0" />
          <span className="font-extrabold tracking-widest">Join Monthly</span>
          <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-slate-950/15 border border-slate-950/20 text-slate-950">
            ₹51/mo
          </span>
          <ArrowRight className="w-4 h-4 text-slate-950 group-hover:translate-x-1 transition-transform flex-shrink-0" />
        </a>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-3">
        {benefits.map((item, idx) => {
          const Icon = item.icon;
          return (
            <div
              key={idx}
              id={`benefit-pill-${idx}`}
              className="flex items-center space-x-3 px-4 py-3 rounded-full bg-[#0d0a18]/60 border border-amber-500/30 hover:border-amber-400/70 backdrop-blur-md transition-all shadow-[0_0_15px_rgba(0,0,0,0.3)] hover:shadow-[0_0_20px_rgba(212,175,55,0.25)] group"
            >
              <div className="flex-shrink-0 text-amber-400 group-hover:scale-110 transition-transform">
                <Icon className="w-4 h-4 text-amber-400" />
              </div>
              <span className="text-xs font-semibold text-slate-200 group-hover:text-amber-200 transition-colors truncate">
                {item.label}
              </span>
            </div>
          );
        })}
      </div>
    </section>
  );
}
