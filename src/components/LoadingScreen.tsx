import React, { useState, useEffect } from "react";

export default function LoadingScreen({ onLoadingComplete }: { onLoadingComplete: () => void }) {
  const [phase, setPhase] = useState<'split' | 'merge' | 'breathe' | 'fadeout'>('split');
  const [status, setStatus] = useState('Initializing...');

  useEffect(() => {
    let phaseTimers: NodeJS.Timeout[] = [];

    // Sequential phase transitions with logic-based statuses
    phaseTimers.push(
      setTimeout(() => {
        setPhase('merge');
        setStatus('Loading assets...');
      }, 300)
    );

    phaseTimers.push(
      setTimeout(() => {
        setPhase('breathe');
        setStatus('Preparing interface...');
      }, 1600)
    );

    // Wait for confirmation that the app is really ready
    const waitUntilReady = async () => {
      // Artificial check — you can make this fetch data or preload assets
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setStatus('Finalizing...');
      await new Promise((resolve) => setTimeout(resolve, 600));

      setPhase('fadeout');
      setStatus('Ready!');
      setTimeout(() => onLoadingComplete(), 1000);
    };

    waitUntilReady();

    return () => phaseTimers.forEach(clearTimeout);
  }, [onLoadingComplete]);

  const letters = [
    { char: 'c', color: 'text-gray-900', side: 'left' },
    { char: 'l', color: 'text-gray-900', side: 'left' },
    { char: 'e', color: 'text-gray-900', side: 'left' },
    { char: 'a', color: 'text-gray-900', side: 'left' },
    { char: 'r', color: 'text-gray-900', side: 'right' },
    { char: 'i', color: 'text-cyan-400', side: 'right' },
    { char: 't', color: 'text-gray-900', side: 'right' },
    { char: 'y', color: 'text-cyan-400', side: 'right' },
  ];

  return (
    <div
      className={`min-h-screen bg-white flex items-center justify-center p-8 overflow-hidden relative transition-opacity duration-1000 ${
        phase === 'fadeout' ? 'opacity-0' : 'opacity-100'
      }`}
    >
      {/* Glowing orb */}
      <div 
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full opacity-20 blur-3xl transition-all duration-2000"
        style={{
          background: 'radial-gradient(circle, rgba(34,211,238,0.4) 0%, transparent 70%)',
          animation: phase === 'breathe' ? 'glow 4s ease-in-out infinite' : 'none',
        }}
      />

      <link
        href="https://fonts.googleapis.com/css2?family=Montserrat+Alternates:wght@600&display=swap"
        rel="stylesheet"
      />

      <div className="relative z-10">
        <div className="text-center">
          <h1
            className="text-6xl md:text-8xl font-semibold tracking-tight flex items-center justify-center select-none relative lowercase"
            style={{
              fontFamily: '"Montserrat Alternates", sans-serif',
              fontWeight: 600,
              letterSpacing: '-0.02em',
            }}
          >
            {letters.map((letter, i) => {
              const isLeft = letter.side === 'left';
              const splitOffset = isLeft ? -100 : 100;

              return (
                <span key={i} className="inline-block relative">
                  <span
                    className={`inline-block ${letter.color} transition-all duration-1000 ease-out`}
                    style={{
                      opacity: phase === 'split' ? 0 : 1,
                      transform:
                        phase === 'split'
                          ? `translateX(${splitOffset}px) rotate(${isLeft ? -20 : 20}deg) scale(0.8)`
                          : 'translateX(0) rotate(0deg) scale(1)',
                      filter: phase === 'split' ? 'blur(10px)' : 'blur(0px)',
                      transitionDelay: `${i * 60}ms`,
                      animation:
                        phase === 'breathe'
                          ? `letterFloat 4s ease-in-out ${i * 0.15}s infinite`
                          : 'none',
                    }}
                  >
                    {letter.char}
                  </span>

                  {phase === 'merge' && (
                    <span
                      className="absolute inset-0 flex items-center justify-center"
                      style={{
                        animation: `sparkle 0.8s ease-out ${i * 60}ms 1`,
                      }}
                    >
                      <span className="text-cyan-400 text-2xl opacity-0">✦</span>
                    </span>
                  )}
                </span>
              );
            })}
          </h1>

          {/* Progress bar */}
          <div className="mt-10 w-64 mx-auto">
            <div className="h-1 bg-gray-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-cyan-400 to-cyan-500 rounded-full transition-all duration-1000"
                style={{
                  width:
                    phase === 'split'
                      ? '0%'
                      : phase === 'merge'
                      ? '60%'
                      : '100%',
                  animation:
                    phase === 'breathe'
                      ? 'progressGlow 2s ease-in-out infinite'
                      : 'none',
                }}
              />
            </div>
          </div>

          {/* Status text */}
          <p
            className="mt-6 text-gray-400 text-xs font-medium tracking-widest uppercase transition-all duration-1000"
            style={{
              opacity: phase === 'split' ? 0 : 1,
              transform: phase === 'split' ? 'translateY(10px)' : 'translateY(0)',
              transitionDelay: '800ms',
            }}
          >
            {status}
          </p>
        </div>
      </div>

      <style jsx>{`
        @keyframes letterFloat {
          0%, 100% { transform: translateY(0) scale(1); }
          50% { transform: translateY(-8px) scale(1.02); }
        }

        @keyframes glow {
          0%, 100% { opacity: 0.2; transform: translate(-50%, -50%) scale(1); }
          50% { opacity: 0.4; transform: translate(-50%, -50%) scale(1.1); }
        }

        @keyframes sparkle {
          0% { opacity: 0; transform: scale(0) rotate(0deg); }
          50% { opacity: 1; }
          100% { opacity: 0; transform: scale(1.5) rotate(180deg); }
        }

        @keyframes progressGlow {
          0%, 100% { box-shadow: 0 0 10px rgba(34,211,238,0.5); }
          50% { box-shadow: 0 0 20px rgba(34,211,238,0.8); }
        }
      `}</style>
    </div>
  );
}
