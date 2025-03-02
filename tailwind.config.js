/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,ts}"],
  theme: {
    extend: {
      colors: {
        "whatsapp-green": "#128C7E",
        "whatsapp-teal": "#075E54",
        "whatsapp-light": "#25D366",
        "whatsapp-chat-bg": "#E5DDD5",
        "whatsapp-panel-bg": "#EDEDED",
        "whatsapp-drawer-bg": "#F6F6F6",
        "whatsapp-message-out": "#DCF8C6",
        "whatsapp-message-in": "#FFFFFF",
      },
    },
  },
  plugins: [],
};
