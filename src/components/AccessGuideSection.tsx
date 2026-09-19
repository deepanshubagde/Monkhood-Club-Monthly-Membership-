import { MousePointerClick, Mail, MessageCircle, ArrowRight } from 'lucide-react';

interface Step {
  number: string;
  title: string;
  description: string;
  actionText: string;
  icon: typeof MousePointerClick;
  badge: string;
}

const steps: Step[] = [
  {
    number: '01',
    title: 'Activate your Subscription',
    description: 'Click on "Join Monthly" to complete your secure registration.\n\n(UPI, Cards, Net Banking Etc.)',
    actionText: 'Click "Join Monthly"',
    icon: MousePointerClick,
    badge: 'Instant Setup',
  },
  {
    number: '02',
    title: 'Check WhatsApp & Mail',
    description: 'you will receive a confirmation message on your registered WhatsApp and Email with App Download link',
    actionText: 'Get App Download Link',
    icon: Mail,
    badge: 'Email & WhatsApp',
  },
  {
    number: '03',
    title: 'Join Private Community',
    description: 'Join the private WhatsApp community where you will get the private WhatsApp messages and live sangha updates there.',
    actionText: 'Access Sangha Circle',
    icon: MessageCircle,
    badge: 'Direct Access',
  },
];

export function AccessGuideSection() {
  return (
    <section
      id="access-guide-section"
      className="py-10 sm:py-14 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto z-10 relative"
      aria-label="How to Access Monkhood Club"
    >
      {/* Section Header */}
      <div className="text-center max-w-2xl mx-auto mb-10 sm:mb-12">
        <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-amber-500/10 border border-amber-400/30 text-amber-300 text-xs font-semibold tracking-wider uppercase mb-4 backdrop-blur-md">
          <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
          <span>Simple Onboarding</span>
        </div>
        <h2 className="font-cinzel text-2xl sm:text-4xl font-bold tracking-wide text-slate-100 mb-3 gold-text-gradient">
          How to Access Monkhood Club
        </h2>
        <p className="text-xs sm:text-base text-slate-300 font-light leading-relaxed">
          Follow these 3 simple steps right after activating your membership to step into your daily digital sangha.
        </p>
      </div>

      {/* 3-Step Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 sm:gap-6 relative">
        {steps.map((step, idx) => {
          const Icon = step.icon;
          return (
            <div
              key={idx}
              id={`access-step-card-${idx + 1}`}
              className="relative group rounded-3xl p-6 sm:p-7 bg-[#0d091e]/85 border border-amber-500/30 hover:border-amber-400/70 backdrop-blur-xl shadow-[0_0_30px_rgba(0,0,0,0.4)] hover:shadow-[0_0_40px_rgba(245,215,127,0.25)] transition-all duration-300 flex flex-col justify-between"
            >
              {/* Top Row: Icon & Step Number */}
              <div>
                <div className="flex items-center justify-between mb-5">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-400/20 to-amber-600/10 border border-amber-400/40 flex items-center justify-center text-amber-300 shadow-[0_0_15px_rgba(245,215,127,0.2)] group-hover:scale-105 group-hover:border-amber-300 transition-all duration-300">
                    <Icon className="w-6 h-6 text-amber-300" />
                  </div>
                  <span className="font-cinzel text-3xl font-bold text-amber-400/30 group-hover:text-amber-300/50 transition-colors">
                    {step.number}
                  </span>
                </div>

                <div className="mb-2">
                  <span className="inline-block text-[10px] uppercase font-bold tracking-widest text-amber-400/90 bg-amber-400/10 px-2.5 py-0.5 rounded-full border border-amber-400/20 mb-2">
                    Step {idx + 1}
                  </span>
                  <h3 className="text-lg sm:text-xl font-bold text-slate-100 mb-2 tracking-wide font-cinzel">
                    {step.title}
                  </h3>
                </div>

                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-light mb-6 whitespace-pre-line">
                  {step.description}
                </p>
              </div>

              {/* Bottom Subtle Action indicator */}
              <div className="pt-4 border-t border-amber-500/15 flex items-center justify-between text-xs text-amber-300/90 font-medium">
                <span>{step.actionText}</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
