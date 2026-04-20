import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        // ── Moniepoint Brand Colors (New Direction) ───────────────────
        'mp-navy': '#03204c',       // Deep brand blue for headings
        'mp-green': '#24b47e',      // Vibrant brand green for buttons/icons
        'mp-green-lt': '#e9f7f2',   // Soft green for active states
        'mp-surface': '#f8fafc',    // Very light gray/blue for card footers
        'mp-border': '#e2e8f0',     // Crisp border color
        'mp-muted': '#64748b',      // Professional muted gray for secondary text
        'mp-slate': '#334155',      // Dark slate for standard text
        'mp-gold': '#F5C842',       // Accent gold for the verify ring

        // ── Legacy Colors (Safely kept for unmigrated components) ─────
        brand: {
          teal:        "#0B6E4F",
          "teal-light": "#E1F5EE",
          navy:        "#1A2B5E",
          "navy-light": "#E6F1FB",
        },
        stellar: {
          DEFAULT: "#7B61FF",
          light:   "#EEF2FF",
          dark:    "#3B1FC2",
        },
        // ── Module accent colours ─────────────────────────────────────
        verify:  { DEFAULT: "#0369A1", light: "#EFF6FF", dark: "#1E3A5F" },
        pay:     { DEFAULT: "#065F46", light: "#ECFDF5", dark: "#022C22" },
        balance: { DEFAULT: "#6D28D9", light: "#F5F3FF", dark: "#2E1065" },
        logi:    { DEFAULT: "#C2410C", light: "#FFF7ED", dark: "#7C2D12" },
        insight: { DEFAULT: "#0E7490", light: "#ECFEFF", dark: "#164E63" },
        finance: { DEFAULT: "#9D174D", light: "#FFF1F2", dark: "#500724" },
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
        mono: ["Courier New", "monospace"],
      },
      // ── 3D shadow system ─────────────────────────────────────────
      boxShadow: {
        '3d-sm':  '0 2px 0 0 #CBD5E1, 0 4px 6px -1px rgba(0,0,0,0.08)',
        '3d-md':  '0 4px 0 0 #94A3B8, 0 8px 15px -3px rgba(0,0,0,0.12)',
        '3d-lg':  '0 6px 0 0 #64748B, 0 12px 25px -5px rgba(0,0,0,0.18)',
        '3d-teal':'0 4px 0 0 #065F46, 0 8px 15px -3px rgba(11,110,79,0.25)',
        '3d-navy':'0 4px 0 0 #0F2557, 0 8px 15px -3px rgba(26,43,94,0.25)',
        '3d-gold':'0 4px 0 0 #92400E, 0 8px 15px -3px rgba(176,125,10,0.25)',
        'card':   '0 1px 3px rgba(0,0,0,0.06), 0 4px 6px rgba(0,0,0,0.04)',
        'card-hover':'0 4px 12px rgba(0,0,0,0.10), 0 8px 20px rgba(0,0,0,0.06)',
        'glass':  '0 8px 32px 0 rgba(31,38,135,0.08)',
      },
      // ── Gradient backgrounds ──────────────────────────────────────
      backgroundImage: {
        'gradient-teal':   'linear-gradient(135deg, #0B6E4F 0%, #065F46 50%, #1A2B5E 100%)',
        'gradient-verify': 'linear-gradient(135deg, #EFF6FF 0%, #DBEAFE 100%)',
        'gradient-pay':    'linear-gradient(135deg, #ECFDF5 0%, #D1FAE5 100%)',
        'gradient-balance':'linear-gradient(135deg, #F5F3FF 0%, #EDE9FE 100%)',
        'gradient-logi':   'linear-gradient(135deg, #FFF7ED 0%, #FFEDD5 100%)',
        'gradient-insight':'linear-gradient(135deg, #ECFEFF 0%, #CFFAFE 100%)',
        'gradient-finance':'linear-gradient(135deg, #FFF1F2 0%, #FFE4E6 100%)',
        'shimmer':         'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.4) 50%, transparent 100%)',
      },
      // ── 3D border radius system ───────────────────────────────────
      borderRadius: {
        'card':  '16px',
        'chip':  '999px',
        'panel': '20px',
      },
      // ── Animation ─────────────────────────────────────────────────
      keyframes: {
        shimmer: { '0%': {backgroundPosition:'-200% 0'}, '100%': {backgroundPosition:'200% 0'} },
        float:   { '0%,100%': {transform:'translateY(0)'}, '50%': {transform:'translateY(-6px)'} },
        pulse3d: { '0%,100%': {boxShadow:'0 4px 0 0 #64748B'}, '50%': {boxShadow:'0 6px 0 0 #94A3B8'} },
      },
      animation: { 
        shimmer:'shimmer 2s infinite', 
        float:'float 3s ease-in-out infinite', 
        pulse3d:'pulse3d 1.5s ease-in-out infinite' 
      },
    },
  },
  plugins: [],
} satisfies Config;

export default config;