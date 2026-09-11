import {
  Compass,
  Users,
  BookOpen,
  Clock,
  TrendingUp,
  Heart,
  Video,
  MessageSquare,
} from 'lucide-react';

const benefits = [
  { icon: Compass, label: 'Daily Guided Mindfulness' },
  { icon: Users, label: 'Supportive Community' },
  { icon: BookOpen, label: 'Premium Learning Library' },
  { icon: Clock, label: 'Learn at Your Own Pace' },
  { icon: TrendingUp, label: 'Continuous Personal Growth' },
  { icon: Heart, label: 'Trusted by the Monkhood Community' },
  { icon: Video, label: 'Weekly Sunday Live Sessions' },
  { icon: MessageSquare, label: 'Interactive Community Feed Access' },
];

export function BenefitsGrid() {
  return (
    <section id="benefits-section" className="py-6 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto z-10 relative">
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
