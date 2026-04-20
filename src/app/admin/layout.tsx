"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { clsx } from "clsx";
import { ShieldCheck, Database } from "lucide-react";

const NAV = [
  { href: "/admin/dashboard", label: "Verification Hub", icon: ShieldCheck },
  { href: "#",                label: "Audit Logs",       icon: Database },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  
  return (
    <div className="flex h-screen bg-slate-50">
      <aside className="w-64 bg-slate-900 text-slate-300 flex flex-col shrink-0 shadow-xl z-10">
        <div className="p-5 border-b border-slate-800">
          <span className="text-xl font-bold text-white tracking-wide">Zytrak<span className="text-brand-teal">Admin</span></span>
          <p className="text-xs text-slate-500 mt-1">Superuser Portal</p>
        </div>
        <nav className="flex-1 p-3 space-y-1">
          {NAV.map(n => {
            const Icon = n.icon;
            const isActive = pathname.startsWith(n.href);
            return (
              <Link key={n.label} href={n.href}
                className={clsx(
                  "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
                  isActive
                    ? "bg-brand-teal text-white"
                    : "hover:bg-slate-800 hover:text-white"
                )}>
                <Icon size={18} className={isActive ? "text-white" : "text-slate-400"} />
                <span>{n.label}</span>
              </Link>
            );
          })}
        </nav>
        <div className="p-4 border-t border-slate-800 bg-slate-950">
          <p className="text-xs text-slate-400">admin@zytrak.ng</p>
          <div className="flex items-center gap-2 mt-2">
            <span className="w-2 h-2 rounded-full bg-green-500"></span>
            <span className="text-[10px] uppercase tracking-wider font-bold text-green-500">Stellar Testnet Live</span>
          </div>
        </div>
      </aside>
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="bg-white border-b border-gray-200 px-6 py-3 flex items-center justify-between shadow-sm">
          <h2 className="text-sm font-semibold text-gray-900">Global Supplier Registry</h2>
        </header>
        <main className="flex-1 overflow-auto p-8">{children}</main>
      </div>
    </div>
  );
}