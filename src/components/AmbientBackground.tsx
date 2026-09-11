import { useEffect, useRef } from 'react';

function SacredMandala({ className = 'w-[600px] h-[600px] opacity-20' }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 400 400"
      className={`pointer-events-none transition-transform duration-1000 ${className}`}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <radialGradient id="lotusGlow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#f5d77f" stopOpacity="0.4" />
          <stop offset="60%" stopColor="#d4af37" stopOpacity="0.15" />
          <stop offset="100%" stopColor="#aa7c11" stopOpacity="0" />
        </radialGradient>
      </defs>
      <circle cx="200" cy="200" r="180" fill="url(#lotusGlow)" opacity="0.15" />
      <circle cx="200" cy="200" r="190" stroke="#f5d77f" strokeWidth="0.75" strokeDasharray="6 6" opacity="0.6" />
      <circle cx="200" cy="200" r="160" stroke="#d4af37" strokeWidth="0.75" opacity="0.6" />
      <circle cx="200" cy="200" r="120" stroke="#f5d77f" strokeWidth="0.5" strokeDasharray="3 3" opacity="0.5" />
      <circle cx="200" cy="200" r="80" stroke="#d4af37" strokeWidth="0.75" opacity="0.6" />
      <circle cx="200" cy="200" r="40" stroke="#f5d77f" strokeWidth="0.75" opacity="0.6" />

      {Array.from({ length: 12 }).map((_, i) => (
        <g key={`outer-${i}`} transform={`rotate(${i * 30} 200 200)`}>
          <path
            d="M200 40 C235 90 235 140 200 180 C165 140 165 90 200 40 Z"
            stroke="#f5d77f"
            strokeWidth="0.8"
            fill="rgba(245, 215, 127, 0.02)"
            opacity="0.6"
          />
          <circle cx="200" cy="30" r="2.5" fill="#f5d77f" opacity="0.7" />
        </g>
      ))}

      {Array.from({ length: 12 }).map((_, i) => (
        <g key={`inner-${i}`} transform={`rotate(${i * 30 + 15} 200 200)`}>
          <path
            d="M200 80 C220 115 220 145 200 170 C180 145 180 115 200 80 Z"
            stroke="#d4af37"
            strokeWidth="0.7"
            fill="rgba(212, 175, 55, 0.03)"
            opacity="0.5"
          />
        </g>
      ))}

      <circle cx="200" cy="200" r="8" fill="#f5d77f" opacity="0.8" />
      <circle cx="200" cy="200" r="4" fill="#ffffff" opacity="0.9" />
    </svg>
  );
}

export function AmbientBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', handleResize);

    const isMobile = width < 640;
    const particleCount = isMobile ? 22 : 55;

    const particles = Array.from({ length: particleCount }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      radius: Math.random() * 1.8 + 0.5,
      alpha: Math.random() * 0.4 + 0.1,
      speedY: -(Math.random() * 0.3 + 0.1),
      speedX: (Math.random() - 0.5) * 0.2,
      pulse: Math.random() * 0.02 + 0.008,
      color: Math.random() > 0.3 ? '#ffd740' : '#f5d77f',
    }));

    let frame = 0;
    const render = () => {
      ctx.clearRect(0, 0, width, height);

      particles.forEach((p) => {
        p.y += p.speedY;
        p.x += p.speedX;
        p.alpha += Math.sin(frame * 0.04) * p.pulse;

        if (p.y < -10) p.y = height + 10;
        if (p.x < -10) p.x = width + 10;
        if (p.x > width + 10) p.x = -10;

        ctx.save();
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.globalAlpha = Math.max(0.1, Math.min(0.5, p.alpha));
        if (!isMobile) {
          ctx.shadowColor = '#ffd740';
          ctx.shadowBlur = 8;
        }
        ctx.fill();
        ctx.restore();
      });

      frame++;
      animId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animId);
    };
  }, []);

  return (
    <div id="ambient-background" className="fixed inset-0 pointer-events-none z-0 overflow-hidden flex items-center justify-center">
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full opacity-60" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-15 sm:opacity-20">
        <SacredMandala className="w-[500px] h-[500px] sm:w-[700px] sm:h-[700px] lg:w-[850px] lg:h-[850px] animate-spin-slow" />
      </div>
    </div>
  );
}
