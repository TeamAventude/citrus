/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/layouts/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/templates/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: ["class"],

  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },

    extend: {
      colors: {
        theme: "#4C1D95", //Purple-900
        theme50: "#FAF5FF ",
        theme100: "#F3E8FF",
        theme200: "#E9D5FF",
        theme300: "#D8B4FE",
        theme400: "#C084FC",
        theme500: "#A855F7",
        theme600: "#9333EA",
        theme700: "#7E22CE",
        theme800: "#6B21A8",
        theme900: "#4C1D95",
        theme950: "#2E1065",
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        active: {
          DEFAULT: "hsl(var(--active))",
          foreground: "hsl(var(--active-foreground))",
        },
      },

      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        typing: {
          from: { width: "0%" },
          to: { width: "100%" },
        },
        blink: {
          "50%": { opacity: "0" },
        },
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
      },
      animation: {
        typing: "typing 3s steps(40) forwards",
        blink: "blink 1s infinite",
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },

      fontFamily: {
        poppins: ["PoppinsRegular", "serif"],
        poppinsMedium: ["PoppinsMedium", "serif"],
        poppinsSemiBold: ["PoppinsSemiBold", "serif"],
      },

      fontSize: {
        h1: "48px",
        h2: "32px",
        h3: "24px",
        h4: "20px",
        h5: "18px",
        p1: "15px",
        p2: "13px",
        p3: "11px",
        p4: "10px",
      },
    },
  },
  plugins: [
    function ({ addUtilities }) {
      addUtilities({
        ".scrollbar-hide": {
          "-ms-overflow-style": "none",
          "scrollbar-width": "none",
        },
        ".scrollbar-hide::-webkit-scrollbar": {
          display: "none",
        },
      });
    },
  ],
};
