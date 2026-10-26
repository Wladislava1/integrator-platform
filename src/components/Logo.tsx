export function Logo({ size = "md" }: { size?: "sm" | "md" | "lg" }) {
  const dim = size === "lg" ? 48 : size === "sm" ? 28 : 36;
  return (
    <div className="flex items-center gap-3">
      <svg
        width={dim}
        height={dim}
        viewBox="0 0 48 48"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden
      >
        <rect width="48" height="48" rx="12" className="fill-[var(--brand)]" />
        <path
          d="M14 24c0-5.523 4.477-10 10-10h2v4h-2a6 6 0 100 12h2v4h-2c-5.523 0-10-4.477-10-10z"
          className="fill-white"
        />
        <path
          d="M22 22h12v4H22v-4z"
          className="fill-white"
        />
        <circle cx="34" cy="24" r="3" className="fill-white" />
      </svg>
      <div className="leading-tight">
        <div className="font-display text-[var(--brand)] font-semibold tracking-tight">
          СвязID
        </div>
        <div className="text-xs text-[var(--muted)]">Integrator Platform</div>
      </div>
    </div>
  );
}
