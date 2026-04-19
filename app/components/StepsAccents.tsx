export function StepsAccents() {
  return (
    <svg
      className="steps-accents"
      viewBox="0 0 1200 600"
      width="100%"
      height="100%"
      style={{
        position: 'absolute',
        inset: 0,
        pointerEvents: 'none',
        zIndex: 0,
      }}
      aria-hidden="true"
    >
      {/* Top-left accent dots */}
      <g opacity="0.4">
        <circle cx="80" cy="80" r="4" fill="#a8b8a0" />
        <circle cx="140" cy="120" r="3" fill="#a8b8a0" />
        <circle cx="100" cy="160" r="2.5" fill="#a8b8a0" />
      </g>

      {/* Top-right floating circle */}
      <circle cx="1100" cy="60" r="45" fill="none" stroke="#a8b8a0" strokeWidth="1.5" opacity="0.2" />

      {/* Center-right accent dots */}
      <g opacity="0.35">
        <circle cx="1050" cy="280" r="5" fill="#a8b8a0" />
        <circle cx="1120" cy="320" r="3.5" fill="#a8b8a0" />
        <circle cx="1080" cy="360" r="3" fill="#a8b8a0" />
      </g>

      {/* Bottom-left curved line */}
      <path
        d="M 50 500 Q 150 480, 200 520"
        stroke="#a8b8a0"
        strokeWidth="1.5"
        fill="none"
        opacity="0.25"
      />

      {/* Bottom-center decorative circle */}
      <circle cx="600" cy="550" r="50" fill="none" stroke="#a8b8a0" strokeWidth="1" opacity="0.15" />

      {/* Bottom-right accent dots */}
      <g opacity="0.3">
        <circle cx="950" cy="520" r="4" fill="#a8b8a0" />
        <circle cx="1020" cy="560" r="3" fill="#a8b8a0" />
        <circle cx="990" cy="580" r="2.5" fill="#a8b8a0" />
      </g>

      {/* Center accent: floating small circles */}
      <g opacity="0.25">
        <circle cx="400" cy="250" r="6" fill="none" stroke="#a8b8a0" strokeWidth="1" />
        <circle cx="450" cy="280" r="4" fill="none" stroke="#a8b8a0" strokeWidth="1" />
        <circle cx="420" cy="320" r="3" fill="none" stroke="#a8b8a0" strokeWidth="1" />
      </g>

      {/* Left side vertical accent line */}
      <line x1="200" y1="100" x2="200" y2="400" stroke="#a8b8a0" strokeWidth="1" opacity="0.1" />

      {/* Right side diagonal accent */}
      <line x1="1050" y1="150" x2="1150" y2="250" stroke="#a8b8a0" strokeWidth="1" opacity="0.12" />
    </svg>
  );
}
