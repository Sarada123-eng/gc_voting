import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  base: "/",          // 👈 THIS FIXES 404 ASSETS
  plugins: [react()],
});
