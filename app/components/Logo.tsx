export default function Logo() {
  return (
    <svg
      width="40"
      height="40"
      viewBox="0 0 40 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{ display: "inline-block", marginRight: "0.5rem", verticalAlign: "middle" }}
    >
      <defs>
        <linearGradient id="mainGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#818cf8" />
          <stop offset="50%" stopColor="#6366f1" />
          <stop offset="100%" stopColor="#4f46e5" />
        </linearGradient>
        <linearGradient id="checkGradient" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#22d3ee" />
          <stop offset="100%" stopColor="#06b6d4" />
        </linearGradient>
        <filter id="shadow">
          <feDropShadow dx="0" dy="2" stdDeviation="2" floodOpacity="0.3"/>
        </filter>
      </defs>
      
      {/* Hexagonal shape for modern tech look */}
      <path 
        d="M 20 3 L 33 11 L 33 29 L 20 37 L 7 29 L 7 11 Z" 
        fill="url(#mainGradient)" 
        filter="url(#shadow)"
      />
      
      {/* Stylized S in modern geometric style */}
      <path
        d="M 16 13 L 24 13 C 26 13 27 14 27 16 C 27 18 25 19 23 19 L 17 19 C 15 19 13 20 13 22 C 13 24 15 25 17 25 L 25 25"
        stroke="white"
        strokeWidth="2.8"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
      
      {/* Dynamic checkmark swoosh */}
      <path
        d="M 26 10 L 29 13 L 35 7"
        stroke="url(#checkGradient)"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
    </svg>
  );
}
