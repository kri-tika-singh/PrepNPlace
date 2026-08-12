import React, { useEffect, useRef, useState } from 'react'

function HeroBackground() {
  const containerRef = useRef(null)
  const [parallax, setParallax] = useState({ x: 0, y: 0 })

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (!containerRef.current) return
      const rect = containerRef.current.getBoundingClientRect()
      const relX = (e.clientX - rect.left) / rect.width - 0.5
      const relY = (e.clientY - rect.top) / rect.height - 0.5
      setParallax({ x: relX * 6, y: relY * 4 })
    }
    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [])

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 overflow-hidden pointer-events-none select-none"
    >
      <style>{`
        @keyframes heroGridPulse {
          0%, 100% { opacity: 0.10; }
          50% { opacity: 0.16; }
        }
        @keyframes heroFloatA {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-3px); }
        }
        @keyframes heroFloatB {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(3px); }
        }
        @keyframes heroWaveform {
          0%, 100% { transform: scaleY(1); opacity: 0.28; }
          50% { transform: scaleY(1.15); opacity: 0.4; }
        }
        @keyframes heroTimerSpin {
          0% { stroke-dashoffset: 0; }
          100% { stroke-dashoffset: -126; }
        }
        .hero-bg-grid { animation: heroGridPulse 26s ease-in-out infinite; }
        .hero-bg-card-a { animation: heroFloatA 17s ease-in-out infinite; transform-origin: center; }
        .hero-bg-card-b { animation: heroFloatB 20s ease-in-out infinite; transform-origin: center; }
        .hero-bg-card-c { animation: heroFloatA 14s ease-in-out infinite; transform-origin: center; }
        .hero-bg-wave { animation: heroWaveform 6.5s ease-in-out infinite; transform-origin: center; }
        .hero-bg-timer { animation: heroTimerSpin 22s linear infinite; }
      `}</style>

      <svg
        width="100%"
        height="100%"
        viewBox="0 0 1440 640"
        preserveAspectRatio="xMidYMid slice"
        style={{
          transform: `translate(${parallax.x}px, ${parallax.y}px)`,
          transition: 'transform 0.6s ease-out',
        }}
      >
        {/* notebook / whiteboard grid — spans the full width now */}
        <g className="hero-bg-grid" opacity="0.12" stroke="#22283F" strokeWidth="1">
          <line x1="0" y1="100" x2="1440" y2="100" />
          <line x1="0" y1="240" x2="1440" y2="240" />
          <line x1="0" y1="380" x2="1440" y2="380" />
          <line x1="0" y1="520" x2="1440" y2="520" />
          <line x1="120" y1="0" x2="120" y2="640" />
          <line x1="360" y1="0" x2="360" y2="640" />
          <line x1="600" y1="0" x2="600" y2="640" />
          <line x1="840" y1="0" x2="840" y2="640" />
          <line x1="1080" y1="0" x2="1080" y2="640" />
          <line x1="1320" y1="0" x2="1320" y2="640" />
        </g>

        {/* candidate <-> AI exchange line, dot drifting = "conversation in progress" */}
        <g opacity="0.28" stroke="#4A5A8C" strokeWidth="1.4" fill="none">
          <path id="heroConvLine" d="M100 500 C 320 420, 460 560, 700 490" />
        </g>
        <circle r="4" fill="#4A5A8C" opacity="0.55">
          <animateMotion
            dur="11s"
            repeatCount="indefinite"
            path="M100 500 C 320 420, 460 560, 700 490"
          />
        </circle>

        {/* second exchange line, upper-left, offset timing for depth */}
        <g opacity="0.18" stroke="#4A5A8C" strokeWidth="1.2" fill="none">
          <path id="heroConvLine2" d="M60 140 C 220 80, 300 200, 460 130" />
        </g>
        <circle r="3.5" fill="#4A5A8C" opacity="0.4">
          <animateMotion
            dur="14s"
            repeatCount="indefinite"
            path="M60 140 C 220 80, 300 200, 460 130"
          />
        </circle>

        {/* voice-interview waveform */}
        <g className="hero-bg-wave" stroke="#8A9A5B" strokeWidth="1.4" fill="none">
          <polyline points="1120,150 1138,120 1154,168 1172,96 1190,160 1208,126 1226,150 1244,136" />
        </g>

        {/* question card fragment, top-right — pure line art */}
        <g className="hero-bg-card-a" opacity="0.13" fill="none" stroke="#22283F" strokeWidth="1.3">
          <rect x="1200" y="70" width="170" height="96" rx="12" />
          <line x1="1224" y1="98" x2="1318" y2="98" />
          <line x1="1224" y1="118" x2="1288" y2="118" />
          <rect x="1224" y="134" width="86" height="10" rx="5" />
        </g>

        {/* score / feedback card fragment, bottom-left */}
        <g className="hero-bg-card-b" opacity="0.13" fill="none" stroke="#22283F" strokeWidth="1.3">
          <rect x="50" y="460" width="160" height="126" rx="12" />
          <circle cx="92" cy="502" r="18" />
          <line x1="124" y1="496" x2="182" y2="496" />
          <line x1="124" y1="512" x2="166" y2="512" />
          <line x1="68" y1="546" x2="188" y2="546" />
          <line x1="68" y1="562" x2="148" y2="562" />
        </g>

        {/* interview-stage progress bar, top-left */}
        <g className="hero-bg-card-c" opacity="0.13" fill="none" stroke="#22283F" strokeWidth="1.3">
          <rect x="70" y="60" width="150" height="9" rx="4.5" />
          <rect x="70" y="60" width="80" height="9" rx="4.5" fill="#8A9A5B" stroke="none" />
          <circle cx="78" cy="86" r="3.5" fill="#22283F" stroke="none" />
          <circle cx="100" cy="86" r="3.5" fill="#22283F" stroke="none" />
          <circle cx="122" cy="86" r="3.5" fill="none" />
        </g>

        {/* timer ring, bottom-right — quietly ticking */}
        <g opacity="0.14" stroke="#22283F" strokeWidth="1.6" fill="none">
          <circle cx="1360" cy="560" r="22" strokeDasharray="4 4" className="hero-bg-timer" />
          <line x1="1360" y1="560" x2="1360" y2="546" />
          <line x1="1360" y1="560" x2="1370" y2="560" />
        </g>

        {/* corner labels, far edges only, never near the headline */}
        <g opacity="0.10" fill="#22283F" fontFamily="monospace" fontSize="13">
          <text x="1210" y="600">score: 8.2/10</text>
          <text x="50" y="36">Q1 // role: frontend</text>
        </g>
      </svg>
    </div>
  )
}

export default HeroBackground