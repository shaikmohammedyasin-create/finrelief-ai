/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        base: {
          DEFAULT: "#0B0F1A",
          panel: "#121826",
          elevated: "#1A2235",
        },
        accent: {
          mint: "#34D399",
          "mint-dark": "#10B981",
          indigo: "#6366F1",
          "indigo-dark": "#4F46E5",
          amber: "#F59E0B",
          rose: "#F43F5E",
        },
        ink: {
          primary: "#E7ECF3",
          secondary: "#8B93A7",
          muted: "#5B6478",
        },
      },
      fontFamily: {
        display: ["Sora", "system-ui", "sans-serif"],
        body: ["Inter", "system-ui", "sans-serif"],
        mono: ["IBM Plex Mono", "ui-monospace", "monospace"],
      },
      backgroundImage: {
        "brand-gradient": "linear-gradient(135deg, #34D399 0%, #6366F1 100%)",
        "brand-gradient-soft": "linear-gradient(135deg, rgba(52,211,153,0.15) 0%, rgba(99,102,241,0.15) 100%)",
      },
      boxShadow: {
        glass: "0 8px 32px rgba(0, 0, 0, 0.35)",
        glow: "0 0 24px rgba(52, 211, 153, 0.25)",
      },
      borderRadius: {
        xl2: "1.25rem",
      },
      keyframes: {
        "fade-in": {
          "0%": { opacity: "0", transform: "translateY(6px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-400px 0" },
          "100%": { backgroundPosition: "400px 0" },
        },
      },
      animation: {
        "fade-in": "fade-in 0.35s ease-out",
        shimmer: "shimmer 1.6s linear infinite",
      },
    },
  },
  plugins: [],
};
