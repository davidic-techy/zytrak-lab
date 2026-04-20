"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuthStore, useCartStore } from "@/lib/store";
import { clsx } from "clsx";
import { 
  Home, 
  Package, 
  ShoppingCart, 
  ClipboardList,
  ShieldCheck,
  Wallet,
  CreditCard,
  Landmark,
  Truck,
  BarChart3
} from "lucide-react";
import { useState, useEffect } from "react";

// The expanded navigation structure supporting dividers
const NAV = [
  { href: "/dashboard",  label: "Dashboard",   icon: Home },
  { href: "/inventory",  label: "Inventory",   icon: Package },
  { href: "/marketplace",   label: "Marketplace", icon: ShoppingCart },
  { href: "/orders",     label: "Orders",      icon: ClipboardList },
  { divider: true,       label: "Trust & Finance" },
  { href: "/verify",     label: "Verify",      icon: ShieldCheck },
  { href: "/balance",    label: "Balance",     icon: Wallet },
  { href: "/pay",        label: "Pay",         icon: CreditCard },
  { href: "/finance",    label: "Finance",     icon: Landmark },
  { divider: true,       label: "Operations" },
  { href: "/logistics",  label: "Logistics",   icon: Truck },
  { href: "/insights",   label: "Insights",    icon: BarChart3 },
];

export default function LabLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { user } = useAuthStore();
  const [mounted, setMounted] = useState(false);
  const cartCount = useCartStore(state => state.items.length);

  useEffect(() => {
    setMounted(true);
  }, []);
  
  return (
    <div className="flex h-screen bg-gray-50">
      <aside className="w-64 bg-white border-r border-gray-100 flex flex-col shrink-0 shadow-sm overflow-y-auto">
        <div className="p-5 border-b border-gray-100 sticky top-0 bg-white z-10">
          {/* Changed to Moniepoint-style deep blue */}
          <span className="text-xl font-black text-blue-700 tracking-tight">Zytrak</span>
          <p className="text-xs text-gray-400 mt-0.5">{user.orgName}</p>
        </div>
        
        <nav className="flex-1 p-3 space-y-0.5">
          {NAV.map((n, index) => {
            // Render category dividers
            if (n.divider) {
              return (
                <div key={`div-${index}`} className="px-3 pt-4 pb-1">
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">{n.label}</p>
                </div>
              );
            }

            // Render standard navigation links
            const Icon = n.icon!;
            const isActive = pathname.startsWith(n.href!);
            
            return (
              <Link key={n.href} href={n.href!}
                className={clsx(
                  "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
                  isActive
                    // Active state now uses the rich blue highlight
                    ? "bg-blue-50 text-blue-700"
                    : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                )}>
                <Icon size={18} className={isActive ? "text-blue-700" : "text-gray-400"} />
                <span>{n.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-gray-100 sticky bottom-0 bg-white">
          <p className="text-xs text-gray-400">{user.email}</p>
        </div>
      </aside>
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="bg-white border-b border-gray-100 px-6 py-3 flex items-center justify-between shadow-sm">
          <p className="text-sm font-semibold text-gray-900">Lagos Medical Laboratory · Surulere, Lagos</p>
          <Link href="/cart" className="relative p-2 text-gray-600 hover:text-gray-900 min-h-11 min-w-11 flex items-center justify-center">
            <ShoppingCart size={20} />
            {mounted && cartCount > 0 && (
              // Cart badge updated to matching blue
              <span className="absolute top-0 right-0 bg-blue-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold shadow-sm">
                {cartCount}
              </span>
            )}
          </Link>
        </header>
        <main className="flex-1 overflow-auto p-6">{children}</main>
      </div>
    </div>
  );
}