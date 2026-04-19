export function StepsConnector() {
  return (
    <svg
      className="steps-connector"
      viewBox="0 0 100 300"
      width="100%"
      height="100%"
      style={{
        position: 'absolute',
        left: '-50px',
        top: 0,
        pointerEvents: 'none',
        zIndex: 0,
      }}
      aria-hidden="true"
    >
      {/* Vertical flowing path connecting the steps */}
      <defs>
        <linearGradient id="pathGradient" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#a8b8a0" stopOpacity="0.3" />
          <stop offset="50%" stopColor="#a8b8a0" stopOpacity="0.2" />
          <stop offset="100%" stopColor="#a8b8a0" stopOpacity="0.1" />
        </linearGradient>
      </defs>

      {/* Main flowing path */}
      <path
        d="M 50 0 Q 30 40, 50 80 Q 70 120, 50 160 Q 30 200, 50 240 Q 70 280, 50 300"
        stroke="url(#pathGradient)"
        strokeWidth="2"
        fill="none"
        strokeLinecap="round"
      />

      {/* Connection nodes at each step */}
      <circle cx="50" cy="80" r="4" fill="#a8b8a0" opacity="0.4" />
      <circle cx="50" cy="160" r="4" fill="#a8b8a0" opacity="0.3" />
      <circle cx="50" cy="240" r="4" fill="#a8b8a0" opacity="0.2" />

      {/* Decorative accent dots */}
      <circle cx="20" cy="60" r="2" fill="#a8b8a0" opacity="0.2" />
      <circle cx="80" cy="140" r="2" fill="#a8b8a0" opacity="0.2" />
      <circle cx="15" cy="220" r="2" fill="#a8b8a0" opacity="0.15" />
    </svg>
  );
}
