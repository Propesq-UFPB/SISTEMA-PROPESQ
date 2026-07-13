/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        //  Identidade principal PROPESQ / UFPB
        primary: {
          DEFAULT: "#022859",   // azul escuro (principal)
          light: "#03588C",     // azul médio
          lighter: "#0597F2",   // azul claro
        },

        // Acentos institucionais
        accent: {
          DEFAULT: "#F2E205",   // amarelo principal
          medium: "#F2B705", // amarelo médio
          dark: "#D9A404", // amarelo escuro
        },

        //  Estados de atenção
        warning: {
          DEFAULT: "#D97D0D", // laranja
          strong: "#F27405", // laranja forte
        },

        //  Erro / crítico
        danger: {
          DEFAULT: "#F20505", // vermelho forte
        },

        //  Neutros
        neutral: {
          DEFAULT: "#0D0D0D", // quase preto
          light: "#F5F5F5", // cinza  claro
        },
      },

      boxShadow: {
        card: "0 6px 18px rgba(0,0,0,0.08)", // sombra para cartões
      },

      borderRadius: {
        xl: "1rem",
        "2xl": "1.25rem",
      },

      // Fontes
      fontFamily: {
        sans: [
          "Tahoma",
          "Verdana",
          "Segoe UI",
          "ui-sans-serif",
          "system-ui",
          "sans-serif",
        ],
      },
    },
  },
  plugins: [],
}
