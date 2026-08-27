export function SessionLoadingGate() {
  return (
    <div className="session-gate" role="status" aria-live="polite" aria-label="Opening your Telapsy account">
      <div className="session-gate-glow" />
      <svg viewBox="0 0 620 150" className="session-gate-wordmark" aria-hidden="true">
        <defs>
          <clipPath id="telapsy-wordmark-clip">
            <text x="310" y="104" textAnchor="middle" className="session-gate-text">TELAPSY</text>
          </clipPath>
          <linearGradient id="telapsy-liquid" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#fff3cb" />
            <stop offset=".48" stopColor="#e8b96a" />
            <stop offset="1" stopColor="#8b5b1f" />
          </linearGradient>
        </defs>
        <text x="310" y="104" textAnchor="middle" className="session-gate-text session-gate-outline">TELAPSY</text>
        <g clipPath="url(#telapsy-wordmark-clip)">
          <rect width="620" height="150" fill="url(#telapsy-liquid)" />
          <path className="session-wave session-wave-one" d="M-60 56 C30 16 86 98 175 57 S319 16 410 58 S560 99 680 48 V170 H-60Z" fill="#f8dfaa" opacity=".72" />
          <path className="session-wave session-wave-two" d="M-80 78 C18 34 110 116 206 69 S378 33 467 77 S590 108 700 59 V170 H-80Z" fill="#b57831" opacity=".68" />
        </g>
      </svg>
      <div className="session-gate-status"><span />Securing your Telapsy session</div>
      <span className="sr-only">Opening your Telapsy account</span>
    </div>
  );
}
