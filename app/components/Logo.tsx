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
      {/* Background Circle */}
      <circle cx="20" cy="20" r="18" fill="white" />
      
      {/* Letter S */}
      <path
        d="M 14 12 Q 10 12 10 16 Q 10 19 14 19 L 26 19 Q 30 19 30 23 Q 30 27 26 27 L 14 27"
        stroke="#1e3a8a"
        strokeWidth="3"
        strokeLinecap="round"
        fill="none"
      />
      
      {/* Checkmark accent */}
      <path
        d="M 28 10 L 32 14 L 38 8"
        stroke="#10b981"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
    </svg>
  );
}
