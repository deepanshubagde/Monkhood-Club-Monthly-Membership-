# Monkhood Club — Official Landing Page

A high-performance, mobile-optimized landing page for **Monkhood Club: Digital Sangha**, designed with gold aesthetics, ambient animations, interactive app previews, and checkout integration.

## ✨ Features

- **Hero Banner**: Sacred Buddhist-inspired artwork with responsive high-resolution WebP rendering and zero layout shift (CLS).
- **Direct Monthly Plan (₹51/mo)**: Integrated checkout redirection to the official Monkhood Club checkout portal (`learn.monkhoodclub.com`).
- **Interactive App Showcase**: 5-screen interactive carousel featuring the official Monkhood Club mobile app interfaces with swipe gestures on mobile and keyboard navigation.
- **Onboarding Guide**: 3-step structured walkthrough for new members on how to access the app and private WhatsApp Sangha.
- **Benefits Grid**: 8 transformation feature pills with a shiny, shimmering "Join Monthly" shortcut button.
- **Mobile Touch Optimization**: Zero tap delay (`touch-action: manipulation`), native momentum scrolling, and fast tactile feedback.
- **High Performance**: DNS prefetching, optimized vector graphics, canvas visibility throttles, and under 300KB uncompressed bundle.

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ or Bun
- npm / pnpm / yarn

### Installation

```bash
# Install dependencies
npm install
```

### Development

```bash
# Start local development server on port 3000
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000) in your browser.

### Production Build

```bash
# Type-check and compile optimized production bundle into dist/
npm run build

# Preview production build locally
npm run preview
```

### Type Checking & Linting

```bash
npm run lint
```

## 📁 Project Structure

```
├── public/                 # Static assets (favicons, banners, screenshots)
│   ├── mondkhud.webp       # Main hero banner artwork
│   ├── logo-sm.webp        # Optimized lightweight Monkhood logo
│   └── screenshots/        # App showcase screen captures (1.jpeg - 5.jpeg)
├── src/
│   ├── components/         # Modular UI components
│   │   ├── AccessGuideSection.tsx    # 3-step onboarding guide
│   │   ├── AmbientBackground.tsx     # Canvas particle and rotating mandala
│   │   ├── AppShowcaseSection.tsx    # Mobile phone frame and carousel
│   │   ├── BenefitsGrid.tsx          # Key transformation features & shiny CTA
│   │   ├── Footer.tsx                # Page footer
│   │   ├── HeroBanner.tsx            # Header artwork banner
│   │   ├── MonthlyPricing.tsx        # ₹51 Monthly subscription card
│   │   └── NeedHelpCard.tsx          # Call & Email support channels
│   ├── utils/              # Utility functions & screenshot storage
│   ├── App.tsx             # Root application orchestrator
│   ├── main.tsx            # React 19 entry point
│   └── index.css           # Tailwind CSS v4 styling & animations
├── index.html              # HTML shell, fonts & meta tags
├── package.json            # Project scripts & dependencies
└── vite.config.ts          # Vite build configuration
```

## 🛠️ Tech Stack

- **Framework**: React 19 + TypeScript
- **Styling**: Tailwind CSS v4 + Lucide Icons
- **Build Tool**: Vite 6
- **Typography**: Outfit, Cinzel, Cormorant Garamond, Plus Jakarta Sans

## 📄 License

Apache-2.0
