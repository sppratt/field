export function HeroIllustration() {
  return (
    <svg
      className="hero-illustration"
      viewBox="0 0 700 800"
      width="100%"
      height="100%"
      style={{
        position: 'absolute',
        inset: 0,
        pointerEvents: 'none',
        zIndex: 1,
      }}
      aria-hidden="true"
    >
      {/* Primary pathway/journey line - bold, animated */}
      <path
        className="hero-illustration-stroke"
        d="M 80 150 Q 200 120, 280 280 T 350 500"
        stroke="#a8b8a0"
        strokeWidth="3"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
        style={{
          strokeDasharray: 600,
          strokeDashoffset: 600,
          animation: 'strokeDraw 1.2s ease-out 0.3s forwards',
        }}
      />

      {/* Workspace/desk scene - larger, bolder */}
      <g
        className="hero-illustration-element"
        transform="translate(380, 80)"
        style={{
          opacity: 0,
          animation: 'fadeInHero 0.8s ease-out 0.6s forwards',
        }}
      >
        {/* Desk/notebook - bold outline */}
        <rect
          x="0"
          y="0"
          width="180"
          height="130"
          rx="6"
          fill="none"
          stroke="#a8b8a0"
          strokeWidth="3"
          opacity="0.85"
        />

        {/* Pen strokes inside - more prominent */}
        <path d="M 30 40 L 150 40" stroke="#a8b8a0" strokeWidth="2.5" opacity="0.7" strokeLinecap="round" />
        <path d="M 30 65 L 130 65" stroke="#a8b8a0" strokeWidth="2.5" opacity="0.7" strokeLinecap="round" />
        <path d="M 30 90 L 145 90" stroke="#a8b8a0" strokeWidth="2.5" opacity="0.7" strokeLinecap="round" />

        {/* Circle accent (growth indicator) */}
        <circle cx="160" cy="25" r="18" fill="none" stroke="#8ba996" strokeWidth="2.5" opacity="0.8" />
      </g>

      {/* Growth/seed element - repositioned, bolder */}
      <g
        className="hero-illustration-element"
        transform="translate(100, 320)"
        style={{
          opacity: 0,
          animation: 'fadeInHero 0.8s ease-out 0.75s forwards',
        }}
      >
        {/* Seed - solid fill */}
        <ellipse cx="0" cy="0" rx="12" ry="15" fill="#a8b8a0" opacity="0.7" />

        {/* Sprout lines - bold */}
        <path d="M -5 -12 L -5 -32" stroke="#a8b8a0" strokeWidth="2.5" opacity="0.8" strokeLinecap="round" />
        <path d="M 5 -12 L 5 -32" stroke="#a8b8a0" strokeWidth="2.5" opacity="0.8" strokeLinecap="round" />

        {/* Leaves - more prominent */}
        <path d="M -5 -22 L -14 -28" stroke="#a8b8a0" strokeWidth="2" opacity="0.75" strokeLinecap="round" />
        <path d="M 5 -22 L 14 -28" stroke="#a8b8a0" strokeWidth="2" opacity="0.75" strokeLinecap="round" />
      </g>

      {/* Overlapping circles - layers/paths (bolder) */}
      <g
        className="hero-illustration-element"
        transform="translate(480, 550)"
        style={{
          opacity: 0,
          animation: 'fadeInHero 0.8s ease-out 0.9s forwards',
        }}
      >
        {/* Circle 1 */}
        <circle cx="0" cy="0" r="45" fill="none" stroke="#a8b8a0" strokeWidth="2.5" opacity="0.75" />

        {/* Circle 2 */}
        <circle cx="35" cy="28" r="36" fill="none" stroke="#8ba996" strokeWidth="2.5" opacity="0.6" />

        {/* Circle 3 */}
        <circle cx="20" cy="-35" r="28" fill="none" stroke="#a8b8a0" strokeWidth="2" opacity="0.7" />
      </g>

      {/* Figure reaching/growing - central, prominent */}
      <g
        className="hero-illustration-element"
        transform="translate(200, 480)"
        style={{
          opacity: 0,
          animation: 'fadeInHero 0.8s ease-out 0.8s forwards',
        }}
      >
        {/* Head */}
        <circle cx="0" cy="0" r="9" fill="#a8b8a0" opacity="0.75" />

        {/* Body */}
        <line x1="0" y1="9" x2="0" y2="28" stroke="#a8b8a0" strokeWidth="2.5" opacity="0.75" strokeLinecap="round" />

        {/* Arms reaching upward */}
        <line x1="-12" y1="15" x2="-22" y2="-5" stroke="#a8b8a0" strokeWidth="2.5" opacity="0.7" strokeLinecap="round" />
        <line x1="12" y1="15" x2="22" y2="-5" stroke="#a8b8a0" strokeWidth="2.5" opacity="0.7" strokeLinecap="round" />
      </g>

      {/* Decorative accent dots - subtle scatter */}
      <g
        className="hero-illustration-element"
        style={{
          opacity: 0,
          animation: 'fadeInHero 0.6s ease-out 1s forwards',
        }}
      >
        <circle cx="120" cy="200" r="4" fill="#8ba996" opacity="0.6" />
        <circle cx="450" cy="250" r="3.5" fill="#a8b8a0" opacity="0.5" />
        <circle cx="320" cy="700" r="3" fill="#8ba996" opacity="0.5" />
      </g>

      <style>{`
        @keyframes strokeDraw {
          to {
            stroke-dashoffset: 0;
          }
        }
      `}</style>
    </svg>
  );
}
