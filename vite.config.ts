import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// GitHub Pages では https://jphacks.github.io/os_2608/ で公開されるため base を合わせる
export default defineConfig({
  base: '/os_2608/',
  plugins: [react()],
})
