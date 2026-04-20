export type ReorderStatus = "ok" | "low" | "critical" | "zero";

export interface MockInventoryItem {
  id: string; product_name: string; category: string;
  current_quantity: number; reorder_point: number; unit: string;
  nafdac_number: string; temperature_profile: string;
  expiry_date: string; reorder_status: ReorderStatus; location: string;
}

export interface MockProduct {
  id: string; name: string; category: string; nafdac_number: string;
  temperature_profile: string; unit_price_ngn: number; stock_quantity: number;
  supplier_id: string; supplier_name: string; description: string;
  storage_instructions: string;
}

export interface MockSupplier {
  id: string; name: string; state: string; type: "local" | "international";
  nafdac_licence: string; iso_certification?: string; performance_score: number;
  trust_level: "verified" | "pending" | "flagged" | "unverified" | "premium";
  stellar_tx_hash: string | null;
  country: string;
  payment_method: string;
  publicKey: string | null;
}

export interface MockOrderItem {
  product_name: string; quantity: number; unit_price_ngn: number;
  temperature_profile: string; nafdac_number: string;
}

export interface MockOrder {
  id: string; supplier_name: string; status: string;
  payment_rail: "paystack" | "stellar"; total_amount_ngn: number;
  created_at: string; items: MockOrderItem[];
}

export interface MockBalanceTx {
  id: string; type: "credit" | "debit"; description: string;
  amount_ngn: number; date: string;
  stellar_tx_hash?: string; rail: "paystack" | "stellar";
}

export interface MockShipment {
  id: string; order_id: string; waybill: string;
  courier: string; status: "in_transit"|"delivered"|"delayed";
  dispatch_time: string; eta: string;
  temp_readings: number[]; // array of celsius readings over time
  cold_chain: boolean;
}

export interface MonthlySpend {
  month:  string;
  amount: number;
}

export interface StockoutRisk {
  product_name:         string;
  days_until_stockout:  number;
  risk:                 'critical' | 'warning' | 'ok';
  current_stock:        number;
}

// ─── 20 SUPPLIERS (10 Local, 10 International) ─────────────────────────────────
export const MOCK_SUPPLIERS: MockSupplier[] = [
  { id: "sup-001", name: "MedTech Solutions Ltd", state: "Lagos", type: "local", nafdac_licence: "NAFDAC/DL/23/00847", iso_certification: "ISO 13485:2016", performance_score: 97, trust_level: "premium", stellar_tx_hash: "db4892c90f_tx_hash", country: "🇳🇬 Nigeria", payment_method: "Paystack (NGN)", publicKey: null },
  { id: "sup-002", name: "DiagnoPath Nigeria", state: "Abuja", type: "local", nafdac_licence: "NAFDAC/DL/22/01203", performance_score: 94, trust_level: "verified", stellar_tx_hash: "c83j92c90f_tx_hash", country: "🇳🇬 Nigeria", payment_method: "Paystack (NGN)", publicKey: null },
  { id: "sup-003", name: "PrimeHealth Diagnostics", state: "Kano", type: "local", nafdac_licence: "NAFDAC/DL/21/04412", performance_score: 88, trust_level: "verified", stellar_tx_hash: "a12k34c90f_tx_hash", country: "🇳🇬 Nigeria", payment_method: "Paystack (NGN)", publicKey: null },
  { id: "sup-004", name: "Eko Medical Supplies", state: "Lagos", type: "local", nafdac_licence: "NAFDAC/DL/24/09981", performance_score: 99, trust_level: "premium", stellar_tx_hash: "b99z82c90f_tx_hash", country: "🇳🇬 Nigeria", payment_method: "Paystack (NGN)", publicKey: null },
  { id: "sup-005", name: "Savannah BioLabs", state: "Kaduna", type: "local", nafdac_licence: "NAFDAC/DL/20/01123", performance_score: 72, trust_level: "flagged", stellar_tx_hash: "d44j92c90f_tx_hash", country: "🇳🇬 Nigeria", payment_method: "Paystack (NGN)", publicKey: null },
  { id: "sup-006", name: "Nexus Healthcare", state: "Port Harcourt", type: "local", nafdac_licence: "NAFDAC/DL/23/05541", performance_score: 91, trust_level: "verified", stellar_tx_hash: "e55j92c90f_tx_hash", country: "🇳🇬 Nigeria", payment_method: "Paystack (NGN)", publicKey: null },
  { id: "sup-007", name: "Delta Scientific", state: "Asaba", type: "local", nafdac_licence: "NAFDAC/DL/22/07765", performance_score: 85, trust_level: "verified", stellar_tx_hash: "f66j92c90f_tx_hash", country: "🇳🇬 Nigeria", payment_method: "Paystack (NGN)", publicKey: null },
  { id: "sup-008", name: "Apex Medicals", state: "Ibadan", type: "local", nafdac_licence: "Pending NAFDAC Renewal", performance_score: 65, trust_level: "pending", stellar_tx_hash: null, country: "🇳🇬 Nigeria", payment_method: "Paystack (NGN)", publicKey: null },
  { id: "sup-009", name: "Zenith Lab Equip", state: "Enugu", type: "local", nafdac_licence: "NAFDAC/DL/23/02234", performance_score: 95, trust_level: "premium", stellar_tx_hash: "h88j92c90f_tx_hash", country: "🇳🇬 Nigeria", payment_method: "Paystack (NGN)", publicKey: null },
  { id: "sup-010", name: "CoreMed Consumables", state: "Owerri", type: "local", nafdac_licence: "NAFDAC/DL/21/08876", performance_score: 89, trust_level: "verified", stellar_tx_hash: "i99j92c90f_tx_hash", country: "🇳🇬 Nigeria", payment_method: "Paystack (NGN)", publicKey: null },
  { id: "sup-011", name: "BioReagents International", state: "Shanghai, China", type: "international", nafdac_licence: "Import Reg. Pending", iso_certification: "ISO 13485:2016", performance_score: 99, trust_level: "pending", stellar_tx_hash: null, country: "🇨🇳 China", payment_method: "Freighter (USDC)", publicKey: "GA423PHWE7VIQ6QU5K7TBLTJQJMFHMQFEK5VRA4VDAHA22H37KFAU3RB" },
  { id: "sup-012", name: "GlobalMed Pharma", state: "Mumbai, India", type: "international", nafdac_licence: "NAFDAC/FR/19/0034", iso_certification: "ISO 9001:2015", performance_score: 92, trust_level: "verified", stellar_tx_hash: "k11j92c90f_tx_hash", country: "🇮🇳 India", payment_method: "Freighter (USDC)", publicKey: "GA423PHWE7VIQ6QU5K7TBLTJQJMFHMQFEK5VRA4VDAHA22H37KFAU3RB" },
  { id: "sup-013", name: "EuroDiag Systems", state: "Berlin, Germany", type: "international", nafdac_licence: "NAFDAC/FR/21/0881", iso_certification: "CE Marked, ISO 13485", performance_score: 98, trust_level: "premium", stellar_tx_hash: "l22j92c90f_tx_hash", country: "🇩🇪 Germany", payment_method: "Freighter (USDC)", publicKey: "GA423PHWE7VIQ6QU5K7TBLTJQJMFHMQFEK5VRA4VDAHA22H37KFAU3RB" },
  { id: "sup-014", name: "SinoScience Instruments", state: "Shenzhen, China", type: "international", nafdac_licence: "NAFDAC/FR/23/0112", performance_score: 86, trust_level: "verified", stellar_tx_hash: "m33j92c90f_tx_hash", country: "🇨🇳 China", payment_method: "Freighter (USDC)", publicKey: "GA423PHWE7VIQ6QU5K7TBLTJQJMFHMQFEK5VRA4VDAHA22H37KFAU3RB" },
  { id: "sup-015", name: "AfroAsia Healthcare", state: "Dubai, UAE", type: "international", nafdac_licence: "NAFDAC/FR/20/0993", performance_score: 78, trust_level: "flagged", stellar_tx_hash: "n44j92c90f_tx_hash", country: "🇦🇪 UAE", payment_method: "Freighter (USDC)", publicKey: "GA423PHWE7VIQ6QU5K7TBLTJQJMFHMQFEK5VRA4VDAHA22H37KFAU3RB" },
  { id: "sup-016", name: "Precision Diagnostics", state: "California, USA", type: "international", nafdac_licence: "NAFDAC/FR/22/0445", iso_certification: "FDA Approved, ISO 13485", performance_score: 100, trust_level: "premium", stellar_tx_hash: "o55j92c90f_tx_hash", country: "🇺🇸 USA", payment_method: "Freighter (USDC)", publicKey: "GA423PHWE7VIQ6QU5K7TBLTJQJMFHMQFEK5VRA4VDAHA22H37KFAU3RB" },
  { id: "sup-017", name: "London Bio", state: "London, UK", type: "international", nafdac_licence: "NAFDAC/FR/18/0772", performance_score: 93, trust_level: "verified", stellar_tx_hash: "p66j92c90f_tx_hash", country: "🇬🇧 United Kingdom", payment_method: "Freighter (USDC)", publicKey: "GBUK2N6J..." },
  { id: "sup-018", name: "Seoul Medical Tech", state: "Seoul, South Korea", type: "international", nafdac_licence: "NAFDAC/FR/24/0228", iso_certification: "ISO 9001:2015", performance_score: 96, trust_level: "verified", stellar_tx_hash: "q77j92c90f_tx_hash", country: "🇰🇷 South Korea", payment_method: "Freighter (USDC)", publicKey: "GA423PHWE7VIQ6QU5K7TBLTJQJMFHMQFEK5VRA4VDAHA22H37KFAU3RB" },
  { id: "sup-019", name: "SwissLab Reagents", state: "Geneva, Switzerland", type: "international", nafdac_licence: "NAFDAC/FR/21/0556", performance_score: 97, trust_level: "premium", stellar_tx_hash: "r88j92c90f_tx_hash", country: "🇨🇭 Switzerland", payment_method: "Freighter (USDC)", publicKey: "GA423PHWE7VIQ6QU5K7TBLTJQJMFHMQFEK5VRA4VDAHA22H37KFAU3RB" },
  { id: "sup-020", name: "Tokyo Scientific", state: "Tokyo, Japan", type: "international", nafdac_licence: "Unverified Import", performance_score: 55, trust_level: "unverified", stellar_tx_hash: null, country: "🇯🇵 Japan", payment_method: "Freighter (USDC)", publicKey: "GA423PHWE7VIQ6QU5K7TBLTJQJMFHMQFEK5VRA4VDAHA22H37KFAU3RB." },
];

// ─── MASSIVE PRODUCT CATALOG (20 Products mapped to suppliers) ──────────────────
export const MOCK_PRODUCTS: MockProduct[] = [
  { id:"prd-001", name:"Giemsa Stain 500mL", category:"reagents_stains", nafdac_number:"A7-0234", temperature_profile:"ambient", unit_price_ngn:8500, stock_quantity:45, supplier_id:"sup-001", supplier_name:"MedTech Solutions Ltd", description:"Standard Giemsa stain for blood film examination.", storage_instructions:"Store at 15–25°C." },
  { id:"prd-002", name:"HIV 1+2 Rapid Test Kit (25T)", category:"diagnostic_kits", nafdac_number:"B3-1892", temperature_profile:"refrigerated", unit_price_ngn:12000, stock_quantity:150, supplier_id:"sup-004", supplier_name:"Eko Medical Supplies", description:"Rapid assay for HIV-1 and HIV-2 antibodies.", storage_instructions:"Store at 2–8°C." },
  { id:"prd-003", name:"Widal Test Antigen Set", category:"diagnostic_kits", nafdac_number:"A7-0891", temperature_profile:"refrigerated", unit_price_ngn:9800, stock_quantity:12, supplier_id:"sup-002", supplier_name:"DiagnoPath Nigeria", description:"Slide agglutination test for typhoid fever.", storage_instructions:"Store at 2–8°C." },
  { id:"prd-004", name:"PCR 96-Well Plate Pack of 10", category:"molecular_biology", nafdac_number:"Exempt", temperature_profile:"ambient", unit_price_ngn:45000, stock_quantity:8, supplier_id:"sup-011", supplier_name:"BioReagents International", description:"Low-profile 96-well PCR plates.", storage_instructions:"Store at ambient temperature." },
  { id:"prd-005", name:"Malaria RDT Pf/PAN (25T)", category:"diagnostic_kits", nafdac_number:"B3-0774", temperature_profile:"ambient", unit_price_ngn:8900, stock_quantity:200, supplier_id:"sup-006", supplier_name:"Nexus Healthcare", description:"WHO prequalified rapid test for malaria.", storage_instructions:"Store at 2–30°C." },
  { id:"prd-006", name:"Blood Agar Base 500g", category:"culture_media", nafdac_number:"A5-3301", temperature_profile:"ambient", unit_price_ngn:15500, stock_quantity:20, supplier_id:"sup-013", supplier_name:"EuroDiag Systems", description:"Dehydrated base for blood agar plates.", storage_instructions:"Store tightly sealed." },
  { id:"prd-007", name:"HbA1c Reagent Kit (50T)", category:"clinical_chemistry", nafdac_number:"B3-4421", temperature_profile:"refrigerated", unit_price_ngn:28000, stock_quantity:0, supplier_id:"sup-019", supplier_name:"SwissLab Reagents", description:"Immunoturbidimetric assay for HbA1c.", storage_instructions:"Store at 2–8°C." },
  { id:"prd-008", name:"Ziehl-Neelsen Carbol Fuchsin", category:"reagents_stains", nafdac_number:"A7-0512", temperature_profile:"ambient", unit_price_ngn:6800, stock_quantity:50, supplier_id:"sup-009", supplier_name:"Zenith Lab Equip", description:"Ready-to-use staining solution for TB.", storage_instructions:"Flammable — keep away from heat." },
  { id:"prd-009", name:"Haematocrit Capillary Tubes", category:"consumables", nafdac_number:"C1-0892", temperature_profile:"ambient", unit_price_ngn:4500, stock_quantity:500, supplier_id:"sup-014", supplier_name:"SinoScience Instruments", description:"Heparinised capillary tubes for PCV.", storage_instructions:"Store at ambient temperature." },
  { id:"prd-010", name:"Urine Strips 10-Parameter", category:"diagnostic_kits", nafdac_number:"B3-9988", temperature_profile:"ambient", unit_price_ngn:5500, stock_quantity:120, supplier_id:"sup-003", supplier_name:"PrimeHealth Diagnostics", description:"Urinalysis reagent strips.", storage_instructions:"Keep tightly capped." },
  { id:"prd-011", name:"Taq Polymerase 500U", category:"molecular_biology", nafdac_number:"Exempt", temperature_profile:"frozen", unit_price_ngn:65000, stock_quantity:5, supplier_id:"sup-016", supplier_name:"Precision Diagnostics", description:"High-fidelity DNA polymerase.", storage_instructions:"Store at -20°C." },
  { id:"prd-012", name:"MacConkey Agar 500g", category:"culture_media", nafdac_number:"A5-1122", temperature_profile:"ambient", unit_price_ngn:14000, stock_quantity:35, supplier_id:"sup-012", supplier_name:"GlobalMed Pharma", description:"Selective media for gram-negative bacteria.", storage_instructions:"Store tightly sealed." },
  { id:"prd-013", name:"Lipid Profile Kit", category:"clinical_chemistry", nafdac_number:"B3-5566", temperature_profile:"refrigerated", unit_price_ngn:32000, stock_quantity:18, supplier_id:"sup-018", supplier_name:"Seoul Medical Tech", description:"Total Chol, HDL, LDL, Triglycerides.", storage_instructions:"Store at 2–8°C." },
  { id:"prd-014", name:"Nitrile Gloves (Medium) 100pk", category:"consumables", nafdac_number:"Exempt", temperature_profile:"ambient", unit_price_ngn:4000, stock_quantity:1000, supplier_id:"sup-010", supplier_name:"CoreMed Consumables", description:"Powder-free examination gloves.", storage_instructions:"Avoid direct sunlight." },
  { id:"prd-015", name:"Microscope Slides 72pk", category:"consumables", nafdac_number:"Exempt", temperature_profile:"ambient", unit_price_ngn:2500, stock_quantity:300, supplier_id:"sup-007", supplier_name:"Delta Scientific", description:"Frosted edge glass slides.", storage_instructions:"Handle with care." },
  { id:"prd-016", name:"Hepatitis B Surface Ag (30T)", category:"diagnostic_kits", nafdac_number:"B3-3344", temperature_profile:"refrigerated", unit_price_ngn:15000, stock_quantity:40, supplier_id:"sup-017", supplier_name:"London Bio", description:"Rapid HBsAg test strips.", storage_instructions:"Store at 2–8°C." },
  { id:"prd-017", name:"Centrifuge Tubes 15mL (500pk)", category:"consumables", nafdac_number:"Exempt", temperature_profile:"ambient", unit_price_ngn:22000, stock_quantity:15, supplier_id:"sup-015", supplier_name:"AfroAsia Healthcare", description:"Sterile conical tubes.", storage_instructions:"Store at ambient temp." },
  { id:"prd-018", name:"Gram Stain Kit", category:"reagents_stains", nafdac_number:"A7-1102", temperature_profile:"ambient", unit_price_ngn:7200, stock_quantity:60, supplier_id:"sup-001", supplier_name:"MedTech Solutions Ltd", description:"Complete 4-bottle staining kit.", storage_instructions:"Store at 15–25°C." },
  { id:"prd-019", name:"Syphilis VDRL Test (50T)", category:"diagnostic_kits", nafdac_number:"B3-7788", temperature_profile:"refrigerated", unit_price_ngn:11000, stock_quantity:25, supplier_id:"sup-002", supplier_name:"DiagnoPath Nigeria", description:"Flocculation test for syphilis.", storage_instructions:"Store at 2–8°C." },
  { id:"prd-020", name:"EDTA Blood Tubes (100pk)", category:"consumables", nafdac_number:"C1-2341", temperature_profile:"ambient", unit_price_ngn:8000, stock_quantity:120, supplier_id:"sup-005", supplier_name:"Savannah BioLabs", description:"Purple top vacutainer tubes.", storage_instructions:"Store at ambient temp." }
];

// ─── VERIFY SCORES FOR ALL 20 SUPPLIERS ──────────────────────────────────────────
export const MOCK_VERIFY_SCORES: Record<string, { overall: number; on_time: number; fill_rate: number; cold_chain: number; dispute_rate: number; orders_completed: number; }> = {
  'sup-001': { overall:97, on_time:99, fill_rate:98, cold_chain:96, dispute_rate:1, orders_completed:847 },
  'sup-002': { overall:94, on_time:95, fill_rate:96, cold_chain:93, dispute_rate:2, orders_completed:412 },
  'sup-003': { overall:88, on_time:85, fill_rate:90, cold_chain:88, dispute_rate:4, orders_completed:156 },
  'sup-004': { overall:99, on_time:100,fill_rate:99, cold_chain:98, dispute_rate:0, orders_completed:1204 },
  'sup-005': { overall:72, on_time:60, fill_rate:80, cold_chain:65, dispute_rate:12,orders_completed:89 },
  'sup-006': { overall:91, on_time:90, fill_rate:92, cold_chain:89, dispute_rate:3, orders_completed:320 },
  'sup-007': { overall:85, on_time:82, fill_rate:88, cold_chain:85, dispute_rate:5, orders_completed:210 },
  'sup-008': { overall:65, on_time:55, fill_rate:70, cold_chain:50, dispute_rate:15,orders_completed:45 },
  'sup-009': { overall:95, on_time:96, fill_rate:94, cold_chain:97, dispute_rate:2, orders_completed:670 },
  'sup-010': { overall:89, on_time:88, fill_rate:91, cold_chain:87, dispute_rate:4, orders_completed:290 },
  'sup-011': { overall:99, on_time:100,fill_rate:99, cold_chain:99, dispute_rate:0, orders_completed:283 },
  'sup-012': { overall:92, on_time:91, fill_rate:93, cold_chain:90, dispute_rate:3, orders_completed:540 },
  'sup-013': { overall:98, on_time:99, fill_rate:97, cold_chain:99, dispute_rate:1, orders_completed:910 },
  'sup-014': { overall:86, on_time:84, fill_rate:89, cold_chain:82, dispute_rate:6, orders_completed:175 },
  'sup-015': { overall:78, on_time:70, fill_rate:85, cold_chain:75, dispute_rate:9, orders_completed:130 },
  'sup-016': { overall:100,on_time:100,fill_rate:100,cold_chain:100,dispute_rate:0, orders_completed:1500 },
  'sup-017': { overall:93, on_time:92, fill_rate:94, cold_chain:95, dispute_rate:2, orders_completed:480 },
  'sup-018': { overall:96, on_time:97, fill_rate:95, cold_chain:98, dispute_rate:1, orders_completed:720 },
  'sup-019': { overall:97, on_time:98, fill_rate:96, cold_chain:99, dispute_rate:1, orders_completed:850 },
  'sup-020': { overall:55, on_time:40, fill_rate:60, cold_chain:45, dispute_rate:20,orders_completed:12 },
};

// ─── ORIGINAL DASHBOARD, ORDERS, BALANCE, SHIPMENTS & INSIGHTS (Untouched) ─────
export const MOCK_INVENTORY: MockInventoryItem[] = [
  { id:"inv-001", product_name:"Giemsa Stain", category:"Reagents & Stains", current_quantity:3, reorder_point:10, unit:"bottles", nafdac_number:"A7-0234", temperature_profile:"ambient", expiry_date:"2026-09-15", reorder_status:"critical", location:"Main Lab" },
  { id:"inv-002", product_name:"HIV 1+2 Rapid Test Kits", category:"Diagnostic Kits", current_quantity:0, reorder_point:5, unit:"packs", nafdac_number:"B3-1892", temperature_profile:"refrigerated", expiry_date:"2026-11-20", reorder_status:"zero", location:"Testing Room" },
  { id:"inv-003", product_name:"Widal Test Antigen Set", category:"Diagnostic Kits", current_quantity:2, reorder_point:8, unit:"kits", nafdac_number:"A7-0891", temperature_profile:"refrigerated", expiry_date:"2025-11-10", reorder_status:"critical", location:"Main Lab" },
  { id:"inv-004", product_name:"EDTA Blood Collection Tubes 100pk", category:"Consumables", current_quantity:45, reorder_point:20, unit:"packs", nafdac_number:"C1-2341", temperature_profile:"ambient", expiry_date:"2027-08-30", reorder_status:"ok", location:"Phlebotomy" },
  { id:"inv-005", product_name:"Gram Stain Reagent Set", category:"Reagents & Stains", current_quantity:6, reorder_point:10, unit:"sets", nafdac_number:"A7-1102", temperature_profile:"ambient", expiry_date:"2026-05-15", reorder_status:"low", location:"Micro Lab" },
  { id:"inv-006", product_name:"Malaria RDT Pf/PAN 25 tests", category:"Diagnostic Kits", current_quantity:0, reorder_point:10, unit:"boxes", nafdac_number:"B3-0774", temperature_profile:"ambient", expiry_date:"2026-10-01", reorder_status:"zero", location:"Testing Room" },
];

export const MOCK_ORDERS: MockOrder[] = [
  { id: "ord-001", supplier_name: "MedTech Solutions Ltd", status: "dispatched", payment_rail: "paystack", total_amount_ngn: 47500, created_at: new Date(Date.now() - 3*24*60*60*1000).toISOString(), items: [ { product_name:"Giemsa Stain 500mL", quantity:5, unit_price_ngn:8500, temperature_profile:"ambient", nafdac_number:"A7-0234" } ] },
  { id: "ord-002", supplier_name: "BioReagents International (China)", status: "confirmed_good", payment_rail: "stellar", total_amount_ngn: 180000, created_at: new Date(Date.now() - 10*24*60*60*1000).toISOString(), items: [ { product_name:"PCR 96-Well Plate Pack of 10", quantity:4, unit_price_ngn:45000, temperature_profile:"ambient", nafdac_number:"N/A - equipment consumable" } ] },
];

export const MOCK_BALANCE_TRANSACTIONS: MockBalanceTx[] = [
  { id:"tx-001", type:"debit",  description:"Payment for ord-001 — MedTech Solutions", amount_ngn:47500,  date: new Date(Date.now()-3*86400000).toISOString(),  rail:"paystack" },
  { id:"tx-002", type:"debit",  description:"USDC payment for ord-002 — BioReagents International", amount_ngn:180000, date: new Date(Date.now()-10*86400000).toISOString(), rail:"stellar", stellar_tx_hash: "abc123demo_ord002_stellar_tx_hash_example" },
  { id:"tx-003", type:"debit",  description:"Payment for ord-003 — DiagnoPath Nigeria", amount_ngn:27800,  date: new Date(Date.now()-1*86400000).toISOString(),  rail:"paystack" },
  { id:"tx-004", type:"credit", description:"Refund — cancelled duplicate order", amount_ngn:8500,   date: new Date(Date.now()-5*86400000).toISOString(),  rail:"paystack" },
];

export const MOCK_SHIPMENTS: MockShipment[] = [
  { id: "shp-001", order_id: "ord-001", waybill: "GIG-2024-LOS-98432", courier: "GIG Logistics", status: "in_transit", dispatch_time: new Date(Date.now()-26*3600000).toISOString(), eta: new Date(Date.now()+4*3600000).toISOString(), temp_readings: [5.2, 4.8, 5.1, 4.9, 5.3, 4.7, 5.0], cold_chain: true },
  { id: "shp-002", order_id: "ord-003", waybill: "DHL-FCT-2024-12890", courier: "DHL Express Nigeria", status: "in_transit", dispatch_time: new Date(Date.now()-8*3600000).toISOString(), eta: new Date(Date.now()+18*3600000).toISOString(), temp_readings: [22.1, 22.4, 21.9, 22.2], cold_chain: false },
];

export const MOCK_MONTHLY_SPEND: MonthlySpend[] = [
  { month: 'Nov', amount:  87000 },
  { month: 'Dec', amount: 124000 },
  { month: 'Jan', amount:  98500 },
  { month: 'Feb', amount: 215000 },
  { month: 'Mar', amount: 163000 },
  { month: 'Apr', amount: 255300 },
];

export const MOCK_STOCKOUT_RISK: StockoutRisk[] = [
  { product_name: 'HIV 1+2 Rapid Test Kits',    days_until_stockout: 0,  risk: 'critical', current_stock: 0 },
  { product_name: 'Malaria RDT Pf/PAN',          days_until_stockout: 0,  risk: 'critical', current_stock: 0 },
  { product_name: 'Hepatitis B SAg Kit',          days_until_stockout: 3,  risk: 'critical', current_stock: 1 },
  { product_name: 'Widal Test Antigen Set',       days_until_stockout: 5,  risk: 'critical', current_stock: 2 },
  { product_name: 'Giemsa Stain',                days_until_stockout: 12, risk: 'warning',  current_stock: 3 },
  { product_name: 'Gram Stain Reagent Set',       days_until_stockout: 18, risk: 'warning',  current_stock: 6 },
  { product_name: 'Blood Agar Base 500g',         days_until_stockout: 22, risk: 'warning',  current_stock: 4 },
  { product_name: 'Ziehl-Neelsen Carbol Fuchsin', days_until_stockout: 45, risk: 'ok',       current_stock: 5 },
];