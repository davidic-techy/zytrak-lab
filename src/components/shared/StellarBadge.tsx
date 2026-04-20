interface Props { explorerUrl: string; label?: string; }
export function StellarBadge({ explorerUrl, label = "Verified on Stellar" }: Props) {
  return (
    <a href={explorerUrl} target="_blank" rel="noopener noreferrer"
       className="inline-flex items-center gap-2 bg-stellar-light text-stellar-dark border border-stellar/20
                  rounded-lg px-3 py-2 text-sm font-medium hover:bg-stellar/20 transition-colors">
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" className="shrink-0">
        <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"
              stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
      <span>{label}</span>
      <span className="opacity-50 text-xs">↗</span>
    </a>
  );
}
