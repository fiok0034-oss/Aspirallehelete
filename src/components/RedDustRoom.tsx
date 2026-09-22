import React, { useEffect, useRef } from 'react';
import { Eye, Sparkles } from 'lucide-react';

export const RedDustRoom: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let width = (canvas.width = canvas.parentElement?.clientWidth || 800);
    let height = (canvas.height = 420);

    const handleResize = () => {
      if (!canvas || !canvas.parentElement) return;
      width = canvas.width = canvas.parentElement.clientWidth;
      height = canvas.height = 420;
    };

    window.addEventListener('resize', handleResize);

    // Crimson and dust particles
    const particles = Array.from({ length: 90 }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      r: Math.random() * 2 + 0.8,
      speedX: (Math.random() - 0.5) * 0.3,
      speedY: -Math.random() * 0.4 - 0.1, // gently floating upwards
      alpha: Math.random() * 0.6 + 0.2,
    }));

    let time = 0;

    const render = () => {
      time += 0.01;
      ctx.fillStyle = '#0a0305';
      ctx.fillRect(0, 0, width, height);

      // Deep dark red radial ambiance
      const grad = ctx.createRadialGradient(
        width * 0.5,
        height * 0.5,
        20,
        width * 0.5,
        height * 0.5,
        width * 0.6
      );
      grad.addColorStop(0, 'rgba(159, 18, 57, 0.25)');
      grad.addColorStop(0.5, 'rgba(136, 19, 55, 0.1)');
      grad.addColorStop(1, 'transparent');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, width, height);

      // Floating memory fragments/faces outline faintly
      const facePulse = Math.sin(time * 1.5) * 0.5 + 0.5;
      ctx.strokeStyle = `rgba(244, 63, 94, ${0.05 + facePulse * 0.05})`;
      ctx.lineWidth = 1;
      ctx.beginPath();
      // Abstract oval face contour
      ctx.ellipse(width * 0.5, height * 0.45, 60, 85, 0, 0, Math.PI * 2);
      ctx.stroke();

      // Floating red dust particles
      for (const p of particles) {
        p.x += p.speedX;
        p.y += p.speedY;

        if (p.y < 0) p.y = height;
        if (p.x < 0) p.x = width;
        if (p.x > width) p.x = 0;

        ctx.fillStyle = `rgba(244, 63, 94, ${p.alpha})`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fill();
      }

      animId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <section className="relative py-20 px-4 sm:px-6 lg:px-8 bg-[#070204] border-t border-rose-950/60 overflow-hidden">
      <div className="max-w-5xl mx-auto rounded border border-rose-950/80 bg-[#090205] overflow-hidden shadow-[0_0_50px_rgba(159,18,57,0.15)] relative">
        {/* Canvas Background for floating red dust */}
        <canvas ref={canvasRef} className="w-full h-[420px] block" />

        {/* Floating Centered Text Content */}
        <div className="absolute inset-0 flex flex-col justify-center items-center text-center p-6 space-y-6 pointer-events-none">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded border border-rose-900/60 bg-rose-950/40 text-rose-300 font-mono text-xs tracking-widest uppercase">
            <Sparkles className="w-3.5 h-3.5 text-rose-400" />
            <span>KAMRA V-82 // A VÖRÖS PORSZOBA</span>
          </div>

          <div className="space-y-2">
            <h3 className="text-3xl sm:text-5xl font-cinzel font-bold text-rose-100 tracking-wide">
              „Ez nem hely.”
            </h3>
            <p className="text-xl sm:text-2xl font-cinzel text-rose-400 italic">
              «„Ez egy őrzött esemény.”»
            </p>
          </div>

          <p className="text-xs sm:text-sm text-slate-400 max-w-lg mx-auto font-light leading-relaxed">
            A mikroszkopikus vörös szemcsék nem ásványi porok: egy olyan civilizáció utolsó kimerevített
            másodperce, amely túl korán kísérelte meg a valóság tudati átírását.
          </p>
        </div>
      </div>
    </section>
  );
};
