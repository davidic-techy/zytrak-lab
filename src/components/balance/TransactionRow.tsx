'use client';

import { ArrowDownLeft, ArrowUpRight } from 'lucide-react';
import { StellarBadge } from '@/components/shared/StellarBadge';
import { formatCurrency, formatDateRelative } from '@/lib/utils';
import type { MockBalanceTx } from '@/lib/mock-data';

export function TransactionRow({ tx }: { tx: MockBalanceTx }) {
  const isCredit = tx.type === 'credit';

  return (
    <div className="flex items-center gap-4 px-5 py-3.5 hover:bg-gray-50/50 transition-colors">
      
      {/* Icon Container */}
      <div className={`
        w-10 h-10 rounded-full flex items-center justify-center shrink-0 shadow-sm border
        ${isCredit 
          ? 'bg-green-50 text-green-600 border-green-100' 
          : 'bg-gray-50 text-gray-600 border-gray-200'}
      `}>
        {isCredit ? <ArrowDownLeft size={18} /> : <ArrowUpRight size={18} />}
      </div>

      {/* Transaction Details */}
      <div className="flex-1 min-w-0">
        <p className="text-sm font-bold text-gray-900 truncate">
          {tx.description}
        </p>
        <p className="text-xs text-gray-500 mt-1 font-medium">
          {formatDateRelative(tx.date)} <span className="mx-1 opacity-50">·</span>{' '}
          <span className={`font-bold ${
            tx.rail === 'stellar' ? 'text-blue-600' : 'text-gray-500'
          }`}>
            {tx.rail === 'stellar' ? 'Stellar USDC' : 'Paystack NGN'}
          </span>
        </p>
      </div>

      {/* Amount & Badges */}
      <div className="text-right shrink-0 flex flex-col items-end gap-1.5">
        <p className={`text-sm font-black tracking-tight ${isCredit ? 'text-green-600' : 'text-gray-900'}`}>
          {isCredit ? '+' : '−'}{formatCurrency(tx.amount_ngn)}
        </p>
        
        {tx.stellar_tx_hash && (
          <StellarBadge
            explorerUrl={`${process.env.NEXT_PUBLIC_STELLAR_EXPLORER}/${tx.stellar_tx_hash}`}
            label="On-chain ↗"
          />
        )}
      </div>
    </div>
  );
}