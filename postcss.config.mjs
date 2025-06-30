const config = {
  plugins: [
    ["@tailwindcss/postcss", {
      // Configurações específicas para Tailwind v4
      config: {
        // Força sempre light mode
        darkMode: false,
        // Configurações de tema
        theme: {
          colorScheme: 'light'
        }
      }
    }]
  ],
};

export default config;
