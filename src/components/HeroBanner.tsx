import heroBannerImg from '../assets/mondkhud.webp';

export function HeroBanner() {
  return (
    <section id="hero-banner" className="relative pt-4 sm:pt-8 pb-1 sm:pb-3 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto">
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-5xl h-[350px] bg-gradient-to-r from-amber-500/20 via-yellow-400/15 to-purple-600/10 blur-[100px] pointer-events-none -z-10 rounded-full" />
      <div className="relative group rounded-3xl p-1 bg-gradient-to-b from-amber-400/40 via-amber-600/25 to-purple-900/35 shadow-[0_0_50px_rgba(245,215,127,0.2)] border border-amber-500/40 overflow-hidden">
        <div className="absolute -inset-1 bg-gradient-to-r from-amber-400/30 via-yellow-300/40 to-amber-600/30 blur-lg opacity-70 group-hover:opacity-100 transition duration-1000 -z-10" />
        <div className="relative rounded-[22px] overflow-hidden bg-[#06040c] min-h-[190px] sm:min-h-[320px]">
          <picture className="w-full h-auto">
            <source srcSet={heroBannerImg} type="image/webp" />
            <img
              id="hero-banner-image"
              src={heroBannerImg}
              alt="Monkhood Club Digital Sangha Banner"
              width={1672}
              height={941}
              loading="eager"
              fetchPriority="high"
              decoding="async"
              className="w-full h-auto object-cover object-center max-h-[640px] rounded-[22px] transition-transform duration-700 hover:scale-[1.006]"
            />
          </picture>
          <div className="absolute inset-0 bg-gradient-to-t from-[#040308] via-transparent to-transparent pointer-events-none opacity-30" />
        </div>
      </div>
    </section>
  );
}
