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
        // Duolingo-inspired palette, with finance twist (gold/green)
        duolingo: {
          green: "#58CC02",      // primary - success, progress
          "green-dark": "#58A700",
          "green-light": "#89E219",
          gold: "#FFC800",       // XP, achievements
          "gold-dark": "#E5B400",
          red: "#FF4B4B",        // errors, lost hearts
          "red-dark": "#E53935",
          blue: "#1CB0F6",       // secondary, water
          "blue-dark": "#1899D6",
          purple: "#CE82FF",     // leagues, special
          orange: "#FF9600",     // streak fire
          "orange-dark": "#E58600",
          snow: "#F7F7F7",       // page background
          "gray-1": "#E5E5E5",
          "gray-2": "#AFAFAF",
          "gray-3": "#777777",
          "gray-4": "#3C3C3C",
          "gray-5": "#1F1F1F",
        },
        // Hearts color
        heart: "#FF4B4B",
        // Coin/XP color
        coin: "#FFC800",
        // Streak color
        streak: "#FF9600",
        // Wisdom (correct answers) — emerald
        wisdom: "#1FAA59",
      },
      fontFamily: {
        sans: ['var(--font-nunito)', 'system-ui', 'sans-serif'],
        display: ['var(--font-nunito)', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        "duo-green": "0 4px 0 0 #58A700",
        "duo-green-sm": "0 2px 0 0 #58A700",
        "duo-gold": "0 4px 0 0 #E5B400",
        "duo-gold-sm": "0 2px 0 0 #E5B400",
        "duo-red": "0 4px 0 0 #E53935",
        "duo-red-sm": "0 2px 0 0 #E53935",
        "duo-blue": "0 4px 0 0 #1899D6",
        "duo-blue-sm": "0 2px 0 0 #1899D6",
        "duo-card": "0 2px 0 0 #E5E5E5",
      },
      borderRadius: {
        "duo": "16px",
        "duo-lg": "20px",
      },
      animation: {
        "bounce-slow": "bounce 2s infinite",
        "wiggle": "wiggle 0.5s ease-in-out",
        "pop": "pop 0.3s ease-out",
        "shake": "shake 0.4s ease-in-out",
        "slide-up": "slideUp 0.4s ease-out",
        "slide-down": "slideDown 0.4s ease-out",
        "fade-in": "fadeIn 0.4s ease-out",
      },
      keyframes: {
        wiggle: {
          "0%, 100%": { transform: "rotate(-3deg)" },
          "50%": { transform: "rotate(3deg)" },
        },
        pop: {
          "0%": { transform: "scale(0.8)", opacity: "0" },
          "50%": { transform: "scale(1.1)" },
          "100%": { transform: "scale(1)", opacity: "1" },
        },
        shake: {
          "0%, 100%": { transform: "translateX(0)" },
          "20%, 60%": { transform: "translateX(-8px)" },
          "40%, 80%": { transform: "translateX(8px)" },
        },
        slideUp: {
          "0%": { transform: "translateY(20px)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
        slideDown: {
          "0%": { transform: "translateY(-20px)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
      },
    },
  },
  plugins: [],
};
export default config;
