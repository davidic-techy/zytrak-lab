"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { clsx } from "clsx";
import { Home, ClipboardList } from "lucide-react";

const NAV = [
  { href:"/supplier/dashboard", label:"Dashboard", icon: Home },
  { href:"/supplier/orders",    label:"Orders",    icon: ClipboardList },
];

export default function SupplierLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  return (
    <div className="flex h-screen bg-gray-50">
      <aside className="w-64 bg-white border-r border-gray-100 flex flex-col shadow-sm">
        <div className="p-5 border-b border-gray-100">
          <span className="text-xl font-bold text-brand-teal">Zytrak</span>
          <p className="text-xs text-gray-400 mt-0.5">Supplier Portal</p>
        </div>
        <nav className="flex-1 p-3 space-y-0.5">
          {NAV.map(n => {
            const Icon = n.icon;
            const isActive = pathname.startsWith(n.href);
            return (
              <Link key={n.href} href={n.href}
                className={clsx("flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
                  isActive ? "bg-brand-teal-light text-brand-teal" : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                )}>
                <Icon size={18} className={isActive ? "text-brand-teal" : "text-gray-400"} /> 
                <span>{n.label}</span>
              </Link>
            );
          })}
        </nav>
        <div className="p-4 border-t border-gray-100">
          <p className="text-xs text-gray-400">MedTech Solutions Ltd</p>
          <p className="text-xs text-gray-300">supplier@medtech.ng</p>
        </div>
      </aside>
      <main className="flex-1 overflow-auto p-6">{children}</main>
    </div>
  );
}