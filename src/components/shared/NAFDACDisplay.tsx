export function NAFDACDisplay({ number }: { number: string }) {
  const isNA = number?.startsWith("N/A");
  return (
    <div className="flex items-center gap-3 bg-gray-50 border border-gray-200 rounded-lg px-3 py-2">
      <span className="text-xs font-medium text-gray-500 uppercase tracking-wide whitespace-nowrap">NAFDAC Reg.</span>
      <span className="font-mono text-sm font-semibold text-gray-900">{number}</span>
      {!isNA && (
        <a href="https://www.nafdac.gov.ng" target="_blank" rel="noopener"
           className="ml-auto text-xs text-blue-600 hover:underline whitespace-nowrap">
          Verify ↗
        </a>
      )}
    </div>
  );
}
