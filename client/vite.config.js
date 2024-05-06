import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  return {
    define: {
      'API_URI': JSON.stringify(env.API_URI),
      'login_uri': JSON.stringify(env.login_uri)
    },
    plugins: [react()],
};
});