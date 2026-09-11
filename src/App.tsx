/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { AmbientBackground } from './components/AmbientBackground';
import { HeroBanner } from './components/HeroBanner';
import { MonthlyPricing } from './components/MonthlyPricing';
import { BenefitsGrid } from './components/BenefitsGrid';
import { NeedHelpCard } from './components/NeedHelpCard';
import { Footer } from './components/Footer';

export default function App() {
  return (
    <div className="min-h-screen text-slate-100 font-['Outfit',sans-serif] selection:bg-amber-500/30 selection:text-amber-200 antialiased relative overflow-x-hidden bg-[#05040a]">
      {/* Dynamic Golden Canvas Sparks & Rotating Sacred Mandala Background */}
      <AmbientBackground />

      <main className="space-y-2 relative z-10">
        {/* Banner with Sacred Artwork */}
        <HeroBanner />

        {/* Exclusively Monthly Subscription Plan */}
        <MonthlyPricing customMonthlyUrl="https://learn.monkhoodclub.com/web/checkout/6a690eba258d6e22aee85fcf" />

        {/* 8-Badge Key Transformation Features */}
        <BenefitsGrid />

        {/* Direct Contact & Support */}
        <NeedHelpCard />
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}

