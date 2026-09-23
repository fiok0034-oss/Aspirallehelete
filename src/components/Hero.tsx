import React, { useEffect, useRef } from 'react';
import { Compass, ChevronDown, Radio, Gamepad2, ExternalLink, BookOpen } from 'lucide-react';
import { audioEngine } from '../utils/audioEngine';

interface HeroProps {
  onEnterStory: () => void;
  onExploreMysteries: () => void;
  onNavigateToCoordinates: () => void;
  onOpenReader?: () => void;
}

export const Hero: React.FC<HeroProps> = ({
  onEnterStory,
  onExploreMysteries,
  onNavigateToCoordinates,
  onOpenReader,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', handleResize);

    // Snow and ice dust particles
    const particleCount = 110;
    const particles = Array.from({ length: particleCount }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      radius: Math.random() * 1.5 + 0.5,
      speedX: (Math.random() - 0.5) * 0.4 + 0.2,
      speedY: Math.random() * 0.6 + 0.3,
      alpha: Math.random() * 0.5 + 0.2,
    }));

    let time = 0;

    const render = () => {
      time += 0.015;
      ctx.clearRect(0, 0, width, height);

      // Deep night sky gradient with cold cyan aurora wash
      const skyGrad = ctx.createLinearGradient(0, 0, 0, height);
      skyGrad.addColorStop(0, '#020408');
      skyGrad.addColorStop(0.5, '#050a14');
      skyGrad.addColorStop(1, '#070f1e');
      ctx.fillStyle = skyGrad;
      ctx.fillRect(0, 0, width, height);

      // Faint distant polar aurora glow
      const auroraGrad = ctx.createRadialGradient(
        width * 0.5,
        height * 0.25,
        50,
        width * 0.5,
        height * 0.25,
        width * 0.6
      );
      auroraGrad.addColorStop(0, 'rgba(14, 116, 144, 0.12)');
      auroraGrad.addColorStop(0.5, 'rgba(2, 132, 199, 0.04)');
      auroraGrad.addColorStop(1, 'transparent');
      ctx.fillStyle = auroraGrad;
      ctx.fillRect(0, 0, width, height * 0.7);

      // Distant research beacon light
      const beaconX = width * 0.82;
      const beaconY = height * 0.58;
      const beaconPulse = Math.sin(time * 2) * 0.5 + 0.5;
      const beaconGrad = ctx.createRadialGradient(beaconX, beaconY, 1, beaconX, beaconY, 40);
      beaconGrad.addColorStop(0, `rgba(56, 189, 248, ${0.4 + beaconPulse * 0.4})`);
      beaconGrad.addColorStop(0.2, `rgba(14, 165, 233, ${0.2 + beaconPulse * 0.2})`);
      beaconGrad.addColorStop(1, 'transparent');
      ctx.fillStyle = beaconGrad;
      ctx.beginPath();
      ctx.arc(beaconX, beaconY, 40, 0, Math.PI * 2);
      ctx.fill();

      // Distant beacon antenna silhouette
      ctx.strokeStyle = 'rgba(100, 116, 139, 0.4)';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(beaconX, beaconY);
      ctx.lineTo(beaconX, beaconY + 30);
      ctx.stroke();

      // Ice plateau silhouette
      ctx.fillStyle = '#050912';
      ctx.beginPath();
      ctx.moveTo(0, height * 0.68);
      ctx.bezierCurveTo(
        width * 0.25,
        height * 0.65,
        width * 0.45,
        height * 0.72,
        width * 0.7,
        height * 0.66
      );
      ctx.bezierCurveTo(
        width * 0.85,
        height * 0.62,
        width * 0.95,
        height * 0.69,
        width,
        height * 0.67
      );
      ctx.lineTo(width, height);
      ctx.lineTo(0, height);
      ctx.closePath();
      ctx.fill();

      // Closer ice ridge with translucent blue edge
      ctx.fillStyle = '#03060c';
      ctx.strokeStyle = 'rgba(56, 189, 248, 0.12)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(0, height * 0.78);
      ctx.bezierCurveTo(
        width * 0.3,
        height * 0.76,
        width * 0.6,
        height * 0.82,
        width,
        height * 0.77
      );
      ctx.lineTo(width, height);
      ctx.lineTo(0, height);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();

      // SUB-ICE SPIRAL: Faintly glowing, slowly breathing under the permafrost
      const spiralCenterX = width * 0.5;
      const spiralCenterY = height * 0.82;
      const breath = Math.sin(time * 0.8); // gentle breathing rhythm
      const spiralAlpha = 0.08 + breath * 0.05; // 0.03 to 0.13

      ctx.save();
      ctx.translate(spiralCenterX, spiralCenterY);
      // Perspective tilt to look like it's flat under the ice
      ctx.scale(1.2, 0.45);

      ctx.beginPath();
      const turns = 5;
      const maxAngle = turns * Math.PI * 2;
      for (let theta = 0; theta < maxAngle; theta += 0.08) {
        const radius = 6 + (theta * 14) * (1 + breath * 0.06);
        const x = radius * Math.cos(theta + time * 0.05);
        const y = radius * Math.sin(theta + time * 0.05);
        if (theta === 0) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }
      }
      ctx.strokeStyle = `rgba(56, 189, 248, ${spiralAlpha})`;
      ctx.lineWidth = 2.2;
      ctx.stroke();

      // Center core glow
      const coreGrad = ctx.createRadialGradient(0, 0, 2, 0, 0, 70);
      coreGrad.addColorStop(0, `rgba(56, 189, 248, ${spiralAlpha * 1.5})`);
      coreGrad.addColorStop(1, 'transparent');
      ctx.fillStyle = coreGrad;
      ctx.beginPath();
      ctx.arc(0, 0, 70, 0, Math.PI * 2);
      ctx.fill();

      ctx.restore();

      // Snow/ice dust drifting
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        p.x += p.speedX;
        p.y += p.speedY;

        if (p.x > width) p.x = 0;
        if (p.x < 0) p.x = width;
        if (p.y > height) p.y = 0;

        ctx.fillStyle = `rgba(226, 232, 240, ${p.alpha})`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fill();
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const handleCoordinateClick = () => {
    audioEngine.playSonarPing();
    onNavigateToCoordinates();
  };

  return (
    <section
      id="hero"
      className="relative min-h-screen w-full flex flex-col justify-between items-center text-center px-4 pt-28 pb-10 overflow-hidden select-none"
    >
      {/* Background canvas for cold Antarctic night & breathing spiral */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full object-cover pointer-events-none z-0"
      />

      {/* Subtle vignette and scanline effect */}
      <div className="absolute inset-0 bg-radial-vignette pointer-events-none z-10 opacity-70" />

      {/* Top Tag */}
      <div className="z-20 mt-4 sm:mt-8 inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-cyan-500/30 bg-[#06101e]/70 backdrop-blur-sm text-cyan-300 font-mono text-xs tracking-widest uppercase animate-pulse-slow">
        <Radio className="w-3.5 h-3.5 text-cyan-400" />
        <span>ARCHÍV-82 / GEORADAR ANOMÁLIA</span>
      </div>

      {/* Main Title Block */}
      <div className="z-20 max-w-4xl mx-auto my-auto space-y-6">
        <div className="space-y-3">
          <h1 className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-extrabold tracking-tight font-cinzel text-transparent bg-clip-text bg-gradient-to-b from-white via-slate-200 to-slate-400 drop-shadow-[0_10px_35px_rgba(56,189,248,0.25)]">
            A SPIRÁL LEHELETE
          </h1>
          <h2 className="text-lg sm:text-2xl md:text-3xl font-mono tracking-widest text-cyan-300/90 uppercase font-semibold">
            A 82. SZÉLESSÉGI KÓD
          </h2>
        </div>

        <div className="flex items-center justify-center gap-4 text-sm sm:text-base text-slate-400 tracking-wider">
          <span className="h-[1px] w-12 bg-cyan-900/60" />
          <span className="font-cinzel text-slate-300 font-semibold tracking-widest uppercase">
            Csurik Konrád
          </span>
          <span className="h-[1px] w-12 bg-cyan-900/60" />
        </div>

        {/* Teaser */}
        <p className="text-base sm:text-xl md:text-2xl text-slate-300 italic max-w-2xl mx-auto font-light leading-relaxed drop-shadow">
          „A jég alatt nem csak a múlt rejtőzik.”
        </p>

        {/* Dual Primary Experiences: Book Reader & Interactive Companion Game */}
        <div className="pt-2 max-w-lg mx-auto space-y-4">
          {/* Primary Book Reader CTA */}
          {onOpenReader && (
            <div className="space-y-1.5">
              <button
                onClick={() => {
                  audioEngine.playSonarPing();
                  onOpenReader();
                }}
                className="w-full py-4 px-6 rounded bg-gradient-to-r from-cyan-500/25 via-cyan-400/35 to-sky-400/25 hover:from-cyan-500/40 hover:via-cyan-400/50 hover:to-sky-400/40 border-2 border-cyan-400 text-white font-mono text-base sm:text-lg tracking-widest uppercase font-bold transition-all duration-300 shadow-[0_0_35px_rgba(56,189,248,0.4)] hover:shadow-[0_0_55px_rgba(56,189,248,0.65)] hover:scale-[1.02] flex items-center justify-center gap-3 group"
              >
                <BookOpen className="w-5 h-5 text-cyan-300 group-hover:scale-125 transition-transform" />
                <span>OLVASD EL A KÖNYVET</span>
              </button>
              <p className="text-xs sm:text-sm font-mono text-cyan-300/85 tracking-wide">
                „Lépj be közvetlenül A Spirál Lehelete világába.”
              </p>
            </div>
          )}

          {/* Interactive Game Companion CTA */}
          <div className="space-y-1.5">
            <a
              href="https://aspiralleheleteinteractivebookgame.netlify.app/"
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => audioEngine.playSonarPing()}
              className="w-full py-3.5 px-6 rounded bg-gradient-to-r from-cyan-950/90 via-blue-950/80 to-slate-900/90 hover:from-cyan-900/95 hover:via-blue-900/90 hover:to-slate-800/95 border-2 border-cyan-400/80 hover:border-cyan-300 text-cyan-100 hover:text-white font-mono text-sm sm:text-base tracking-widest uppercase font-bold transition-all duration-300 shadow-[0_0_30px_rgba(56,189,248,0.3)] hover:shadow-[0_0_50px_rgba(56,189,248,0.6)] hover:scale-[1.02] flex items-center justify-center gap-2.5 group"
            >
              <Gamepad2 className="w-5 h-5 text-cyan-300 group-hover:scale-125 transition-transform" />
              <span>BELÉPÉS AZ INTERAKTÍV MÓDBA</span>
              <ExternalLink className="w-4 h-4 text-cyan-400/80 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </a>
            <p className="text-xs sm:text-sm font-mono text-cyan-200/90 tracking-wide">
              „Éld át a történetet interaktív döntéseken, történeti elágazásokon és az Archív-82 fájljain keresztül!”
            </p>
          </div>
        </div>

        {/* Secondary Exploration CTA Buttons */}
        <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-5">
          <button
            onClick={onEnterStory}
            className="w-full sm:w-auto px-6 py-3 rounded-sm bg-cyan-950/40 hover:bg-cyan-900/60 border border-cyan-700/60 hover:border-cyan-400 text-cyan-200 hover:text-white font-mono text-xs sm:text-sm tracking-widest uppercase font-semibold transition-all duration-200"
          >
            BELÉPEK A TÖRTÉNETBE
          </button>

          <button
            onClick={onExploreMysteries}
            className="w-full sm:w-auto px-6 py-3 rounded-sm bg-slate-900/60 hover:bg-slate-800/80 border border-slate-700 hover:border-slate-500 text-slate-300 hover:text-white font-mono text-xs sm:text-sm tracking-widest uppercase transition-all duration-200"
          >
            FELFEDEZEM A REJTÉLYT
          </button>
        </div>
      </div>

      {/* Interactive Coordinates Indicator */}
      <div className="z-20 flex flex-col items-center space-y-3">
        <button
          onClick={handleCoordinateClick}
          className="group inline-flex items-center gap-2 px-4 py-2 rounded border border-cyan-950/80 bg-[#040812]/80 hover:border-cyan-500/50 hover:bg-cyan-950/30 transition-all font-mono text-xs sm:text-sm text-cyan-400/90 tracking-widest"
          title="Kattints a koordináták beméréséhez a térképen"
        >
          <Compass className="w-4 h-4 text-cyan-400 group-hover:rotate-45 transition-transform duration-300" />
          <span>82°16’S — 36°01’E</span>
          <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping" />
        </button>

        <div className="text-[11px] font-mono text-slate-500 tracking-wider flex items-center gap-1">
          <span>GÖRGESS LEJJEBB A MERÜLÉSHEZ</span>
          <ChevronDown className="w-3.5 h-3.5 animate-bounce text-cyan-500/70" />
        </div>
      </div>
    </section>
  );
};
