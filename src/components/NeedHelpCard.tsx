import { Phone, Mail } from 'lucide-react';

export function NeedHelpCard() {
  return (
    <section id="help-section" className="py-8 px-4 sm:px-6 lg:px-8 max-w-2xl mx-auto z-10 relative">
      <div
        id="help-card"
        className="rounded-3xl p-6 sm:p-7 bg-[#0a0714]/70 border border-amber-500/35 backdrop-blur-md text-center shadow-[0_0_30px_rgba(212,175,55,0.2)] hover:shadow-[0_0_40px_rgba(212,175,55,0.3)] transition-all"
      >
        <h4 className="text-[11px] font-extrabold tracking-[0.25em] text-slate-400 uppercase mb-3">
          NEED HELP?
        </h4>
        <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-3 text-xs sm:text-sm font-medium text-slate-200">
          <div className="inline-flex items-center space-x-2">
            <Phone className="w-3.5 h-3.5 text-amber-400" />
            <span className="text-slate-400 font-normal">Call: </span>
            <a
              id="help-call-link"
              href="tel:+919503129479"
              className="font-bold text-slate-100 hover:text-amber-300 transition-colors"
            >
              <span className="mr-1.5">+91</span>
              <span>95031 29479</span>
            </a>
          </div>
          <div className="inline-flex items-center space-x-2">
            <Mail className="w-3.5 h-3.5 text-amber-400" />
            <span className="text-slate-400 font-normal">Email: </span>
            <a
              id="help-email-link"
              href="mailto:support@monkhoodclub.com"
              className="font-bold text-slate-100 hover:text-amber-300 transition-colors"
            >
              support@monkhoodclub.com
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
