"use client";

export function HaxonLogo({ size = 22 }: { size?: number }) {
  return (
    <div className="inline-flex items-center gap-2">
      <svg width={size} height={size} viewBox="0 0 32 32">
        <defs>
          <linearGradient id="hg" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#FB923C" />
            <stop offset="100%" stopColor="#C2410C" />
          </linearGradient>
        </defs>
        <rect x="2" y="2" width="28" height="28" rx="8" fill="url(#hg)" />
        <path d="M10 10v12M22 10v12M10 16h12" stroke="white" strokeWidth="2.6" strokeLinecap="round" />
      </svg>
      <span style={{ fontSize: size * 0.85, fontWeight: 700, letterSpacing: "-0.02em" }}>Haxon</span>
    </div>
  );
}
