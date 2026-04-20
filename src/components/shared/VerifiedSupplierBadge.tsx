'use client';

import { useSupplierStore } from '@/lib/store';
import { StellarBadge }    from '@/components/shared/StellarBadge';
import { formatDistanceToNow, parseISO } from 'date-fns';

interface Props {
  supplierId: string;
  /** compact — small inline pill. full — shows explorer link too */
  variant?:   'compact' | 'full';
}

export function VerifiedSupplierBadge({ supplierId, variant = 'compact' }: Props) {
  const { approved } = useSupplierStore();
  const state        = approved[supplierId];

  // Not yet approved — show pending state
  if (!state) {
    return (
      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-500">
        <span className="w-1.5 h-1.5 rounded-full bg-gray-400 inline-block" />
        Pending verification
      </span>
    );
  }

  const hasOnChain  = !!state.explorerUrl;
  const verifiedAgo = state.approvedAt
    ? formatDistanceToNow(parseISO(state.approvedAt), { addSuffix: true })
    : null;

  if (variant === 'compact') {
    return (
      <span className={`
        inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full
        text-xs font-semibold
        ${hasOnChain
          ? 'bg-mp-green text-white'
          : 'bg-mp-green-lt text-mp-green border border-mp-green/20'}
      `}>
        <span>{hasOnChain ? '✓' : '·'}</span>
        {hasOnChain ? 'Blockchain verified' : 'Approved'}
      </span>
    );
  }

  // variant === 'full'
  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2 flex-wrap">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-semibold bg-mp-green text-white">
          <span>✓</span>
          NAFDAC verified on Stellar
        </span>
        {verifiedAgo && (
          <span className="text-xs text-mp-muted">
            Approved {verifiedAgo}
          </span>
        )}
      </div>
      {hasOnChain && (
        <StellarBadge
          explorerUrl={state.explorerUrl}
          label="View on-chain credential ↗"
        />
      )}
    </div>
  );
}