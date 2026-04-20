import { clsx } from "clsx";
export function Skeleton({ className }: { className?: string }) {
  return <div className={clsx("animate-pulse bg-gray-200 rounded-lg", className)} />;
}
export function SkeletonCard() {
  return (
    <div className="border rounded-xl p-4 space-y-3">
      <Skeleton className="h-4 w-3/4" />
      <Skeleton className="h-3 w-1/2" />
      <Skeleton className="h-8 w-full mt-2" />
    </div>
  );
}
export function SkeletonRow() {
  return (
    <div className="flex gap-4 py-3 border-b">
      <Skeleton className="h-4 w-1/4" /><Skeleton className="h-4 w-1/3" /><Skeleton className="h-4 w-1/4" />
    </div>
  );
}
