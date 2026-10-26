type LogoProps = {
  size?: "sm" | "md" | "lg";
  showText?: boolean;
};

const sizes = { sm: 36, md: 48, lg: 64 };

/** Круглый знак: смесь букв «Связь ID» в кольце (как на референсе) */
export function SvyazMark({ size = 48, className = "" }: { size?: number; className?: string }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden
    >
      <circle cx="50" cy="50" r="48" fill="var(--brand, #1f8a55)" />
      <circle cx="50" cy="50" r="42" stroke="white" strokeWidth="2.2" fill="none" opacity="0.9" />
      {/* Переплетённые буквы по кругу */}
      <g fill="white" fontFamily="Georgia, 'Times New Roman', serif" fontWeight="700">
        <text x="50" y="28" textAnchor="middle" fontSize="16">
          С
        </text>
        <text x="72" y="40" textAnchor="middle" fontSize="15">
          в
        </text>
        <text x="78" y="58" textAnchor="middle" fontSize="14">
          я
        </text>
        <text x="68" y="74" textAnchor="middle" fontSize="15">
          з
        </text>
        <text x="50" y="82" textAnchor="middle" fontSize="14">
          ь
        </text>
        <text x="32" y="74" textAnchor="middle" fontSize="15">
          I
        </text>
        <text x="22" y="58" textAnchor="middle" fontSize="16">
          D
        </text>
        <text x="28" y="40" textAnchor="middle" fontSize="14">
          ·
        </text>
      </g>
      <text
        x="50"
        y="54"
        textAnchor="middle"
        fill="white"
        fontFamily="system-ui, sans-serif"
        fontWeight="700"
        fontSize="11"
        letterSpacing="1"
      >
        ID
      </text>
    </svg>
  );
}

export function Logo({ size = "md", showText = true }: LogoProps) {
  const dim = sizes[size];
  return (
    <div className="flex items-center gap-3">
      <SvyazMark size={dim} />
      {showText ? (
        <div className="leading-tight">
          <div className="font-display text-[var(--brand)] font-semibold tracking-tight">
            Связь ID
          </div>
          <div className="text-xs text-[var(--muted)]">Integrator Platform</div>
        </div>
      ) : null}
    </div>
  );
}
