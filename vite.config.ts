import path from 'node:path'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vitest/config'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(import.meta.dirname, './src'),
    },
  },
  build: {
    rollupOptions: {
      output: {
        // 라이브러리별 청크를 고정해두면, 앱 코드만 바뀐 배포에서도
        // 사용자가 이미 캐시해둔 벤더 청크를 그대로 재사용할 수 있다.
        manualChunks(id) {
          if (!id.includes('node_modules')) return
          if (
            id.includes('react-router') ||
            id.includes('/react-dom/') ||
            id.includes('/react/')
          ) {
            return 'vendor-react'
          }
          if (id.includes('@mui') || id.includes('@emotion')) {
            return 'vendor-mui'
          }
          if (
            id.includes('@tanstack') ||
            id.includes('axios') ||
            id.includes('zustand')
          ) {
            return 'vendor-data'
          }
          return 'vendor'
        },
      },
    },
  },
  test: {
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.ts'],
    css: true,
  },
})
