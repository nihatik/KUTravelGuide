import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
// @ts-ignore
import path from 'path'
// @ts-ignore
import { fileURLToPath } from 'url'

// @ts-ignore
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

export default defineConfig(({ mode }) => {

  // @ts-ignore
  const env = loadEnv(mode, process.cwd(), "");
  return {
    server: {
      proxy: {
        '/api': {
          target: env.VITE_API_URL,
          changeOrigin: true,
          secure: false,
        },
      },
    },
    plugins: [react()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
        '@assets': path.resolve(__dirname, './src/assets'),
        '@components': path.resolve(__dirname, './src/components'),
        '@pages': path.resolve(__dirname, './src/pages'),
        '@services': path.resolve(__dirname, './src/services'),
        '@models': path.resolve(__dirname, './src/model'),
        '@styles': path.resolve(__dirname, './src/assets/styles'),
      },
    },
  }
})
