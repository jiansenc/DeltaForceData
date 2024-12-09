import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vite.dev/config/
export default defineConfig({
	base: './',
	build: {
		outDir: 'docs' // 输出到项目根目录下的 dist 目录
	},
	plugins: [vue()]
})
