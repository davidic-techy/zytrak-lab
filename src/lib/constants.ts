export const ORDER_STATUS_LABELS: Record<string, string> = {
  pending_payment: "Awaiting Payment",
  paid:            "Payment Confirmed",
  confirmed:       "Confirmed by Supplier",
  packed:          "Packed & Ready",
  dispatched:      "Dispatched",
  in_transit:      "In Transit",
  delivered:       "Delivered",
  confirmed_good:  "Delivery Confirmed",
  disputed:        "Disputed",
  cancelled:       "Cancelled",
};

export const TEMP_LABELS: Record<string,{label:string;storage:string;color:string}> = {
  ambient:      { label:"Ambient",      storage:"Store at 15–25°C",  color:"bg-green-50   text-green-800  border border-green-200"   },
  refrigerated: { label:"Refrigerated", storage:"Store at 2–8°C",    color:"bg-blue-50    text-blue-800   border border-blue-200"    },
  frozen:       { label:"Frozen",       storage:"Store at −20°C",    color:"bg-indigo-50  text-indigo-800 border border-indigo-200"  },
  ultra_cold:   { label:"Ultra-Cold",   storage:"Store at −80°C",    color:"bg-purple-50  text-purple-800 border border-purple-200"  },
};

export const STOCK_STYLES: Record<string,string> = {
  ok:       "bg-green-50  text-green-700",
  low:      "bg-amber-50  text-amber-700",
  critical: "bg-orange-50 text-orange-700",
  zero:     "bg-red-50    text-red-700",
};

// Must match backend PRODUCT_CATEGORIES exactly
export const PRODUCT_CATEGORIES = [
  {value:"reagents_stains",      label:"Reagents & Stains"},
  {value:"diagnostic_kits",      label:"Diagnostic Kits"},
  {value:"culture_media",        label:"Culture Media"},
  {value:"molecular_biology",    label:"Molecular Biology"},
  {value:"haematology",          label:"Haematology"},
  {value:"clinical_chemistry",   label:"Clinical Chemistry"},
  {value:"microbiology",         label:"Microbiology"},
  {value:"immunology",           label:"Immunology"},
  {value:"consumables_disposables", label:"Consumables & Disposables"},
  {value:"glassware_plasticware",label:"Glassware & Plasticware"},
  {value:"equipment_instruments",label:"Equipment & Instruments"},
  {value:"ppe_safety",           label:"PPE & Safety"},
  {value:"cold_chain_equipment", label:"Cold Chain Equipment"},
  {value:"calibration_standards",label:"Calibration Standards"},
  {value:"veterinary",           label:"Veterinary"},
  {value:"general_supplies",     label:"General Supplies"},
] as const;
