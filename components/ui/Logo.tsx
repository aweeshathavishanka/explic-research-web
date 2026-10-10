/** Explic mark: four bars for the four research components, on the brand purple. */
export function LogoMark({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden className={className}>
      <rect width="24" height="24" rx="6" fill="var(--color-purple-heart-600)" />
      <rect x="5" y="9" width="2" height="6" rx="1" fill="var(--color-purple-heart-50)" />
      <rect x="9" y="6" width="2" height="12" rx="1" fill="var(--color-purple-heart-50)" />
      <rect x="13" y="8" width="2" height="8" rx="1" fill="var(--color-purple-heart-50)" />
      <rect x="17" y="4.5" width="2" height="15" rx="1" fill="var(--color-purple-heart-200)" />
    </svg>
  );
}

export function Wordmark({ className = "" }: { className?: string }) {
  return (
    <span className={`inline-flex items-center gap-2.5 ${className}`}>
      <LogoMark className="size-7" />
      <span className="text-lg font-semibold text-fg">Explic</span>
    </span>
  );
}
