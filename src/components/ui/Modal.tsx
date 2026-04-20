"use client";
import { useEffect } from "react";
import { X } from "lucide-react";

interface Props { title: string; onClose: ()=>void; children: React.ReactNode; }
export function Modal({ title, onClose, children }: Props) {
  useEffect(() => {
    const h = (e: KeyboardEvent) => { if (e.key==="Escape") onClose(); };
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, [onClose]);
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="relative bg-white rounded-xl shadow-2xl w-full max-w-md mx-4 p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">{title}</h2>
          <button onClick={onClose} className="min-h-11 min-w-11 flex items-center justify-center text-gray-400 hover:text-gray-700 rounded-lg hover:bg-gray-100">
            <X size={18} /></button>
        </div>
        {children}
      </div>
    </div>
  );
}
