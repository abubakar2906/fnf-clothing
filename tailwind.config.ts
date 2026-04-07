import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        'ink-black': '#0A0A0A',
        'brand-gold': '#D4AF37',
        'deep-gold': '#B8860B',
        'off-white': '#F5F5F5',
        'charcoal': '#1A1A1A',
        'mid-grey': '#666666',
        'light-grey': '#CCCCCC',
        'pale-grey': '#E8E8E8',
        'alert-red': '#D32F2F',
      },
      fontFamily: {
        sans: ['var(--font-dm-sans)', 'sans-serif'],
        serif: ['var(--font-cormorant)', 'serif'],
        mono: ['var(--font-jetbrains)', 'monospace'],
      },
      borderRadius: {
        'none': '0px',
        'sm': '0px',
        DEFAULT: '0px',
        'md': '0px',
        'lg': '0px',
        'xl': '0px',
        '2xl': '0px',
        '3xl': '0px',
        'full': '0px',
      }
    },
  },
  plugins: [],
};

export default config;