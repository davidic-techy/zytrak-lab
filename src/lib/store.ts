"use client";
import { create } from "zustand";
import { persist } from "zustand/middleware";

// ── DEMO USER — app starts pre-logged in ─────────────────────────
export const DEMO_USER = {
  id: "usr-001", email: "dr.adeyemi@lagosmedlab.ng",
  role: "org_admin" as const, orgId: "org-001",
  orgName: "Lagos Medical Laboratory", orgType: "lab" as const,
} as const;

// ── AUTH STORE — memory only, never localStorage ─────────────────
interface AuthState { user: typeof DEMO_USER; isAuthenticated: boolean; }
export const useAuthStore = create<AuthState>()(() => ({
  user: DEMO_USER,
  isAuthenticated: true,
}));

// ── CART STORE — persisted to localStorage ────────────────────────
export interface CartItem {
  productId: string; productName: string; supplierOrgId: string;
  supplierName: string; quantity: number; unitPriceNgn: number;
  temperatureProfile: string;
}
interface CartState {
  items: CartItem[];
  addItem: (item: CartItem) => void;
  updateQty: (productId: string, qty: number) => void;
  removeItem: (productId: string) => void;
  clearCart: () => void;
  total: () => number;
  count: () => number;
}
export const useCartStore = create<CartState>()(persist(
  (set, get) => ({
    items: [],
    addItem: item => set(s => {
      const exists = s.items.find(i => i.productId === item.productId);
      if (exists) return { items: s.items.map(i => i.productId===item.productId ? {...i,quantity:i.quantity+item.quantity} : i) };
      return { items: [...s.items, item] };
    }),
    updateQty: (id,qty) => set(s => ({ items: s.items.map(i => i.productId===id ? {...i,quantity:qty} : i) })),
    removeItem: id => set(s => ({ items: s.items.filter(i => i.productId!==id) })),
    clearCart: () => set({ items: [] }),
    total: () => get().items.reduce((sum,i) => sum + i.unitPriceNgn*i.quantity, 0),
    count: () => get().items.reduce((sum,i) => sum + i.quantity, 0),
  }),
  { name: "zytrak-cart", partialize: s => ({ items: s.items }) }
));

// ── ORDER STATE — tracks live status transitions during demo ──────
export type OrderStatus =
  | "pending_payment"|"paid"|"confirmed"|"packed"
  | "dispatched"|"in_transit"|"delivered"|"confirmed_good"|"disputed"|"cancelled";

export interface StellarRecord {
  txHash: string; explorerUrl: string; eventType: string;
  entityId: string; createdAt: string;
}

interface OrderState {
  statuses: Record<string, OrderStatus>;
  stellarRecords: Record<string, StellarRecord[]>;
  setStatus: (orderId: string, status: OrderStatus) => void;
  addStellarRecord: (entityId: string, rec: StellarRecord) => void;
}
export const useOrderStore = create<OrderState>()((set) => ({
  statuses: {
    "ord-001": "dispatched",    // ready to confirm delivery in demo
    "ord-002": "confirmed_good", // already complete — shows completed state
    "ord-003": "paid",           // just paid — shows early status
  },
  stellarRecords: {},
  setStatus: (id,status) => set(s => ({ statuses: {...s.statuses, [id]:status} })),
  addStellarRecord: (entityId,rec) => set(s => ({
    stellarRecords: {...s.stellarRecords, [entityId]: [...(s.stellarRecords[entityId]||[]), rec]}
  })),
}));

// ── SUPPLIER STATE — persisted to localStorage to survive reloads ─
interface ApprovedSupplier {
  explorerUrl: string;
  approvedAt:  string; // ISO timestamp — so dashboard can show "verified X ago"
}

interface SupplierState {
  approved:        Record<string, ApprovedSupplier>;
  approveSupplier: (id: string, explorerUrl: string) => void;
}

export const useSupplierStore = create<SupplierState>()(
  persist(
    (set) => ({
      approved: {
        'sup-001': { explorerUrl: '', approvedAt: '' }, // pre-approved in demo
        'sup-002': { explorerUrl: '', approvedAt: '' }, // pre-approved in demo
      },
      approveSupplier: (id, explorerUrl) =>
        set(s => ({
          approved: {
            ...s.approved,
            [id]: { explorerUrl, approvedAt: new Date().toISOString() },
          },
        })),
    }),
    {
      name: 'zytrak-supplier-storage',
    }
  )
);