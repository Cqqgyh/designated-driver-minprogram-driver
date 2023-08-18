import { defineConfig, loadEnv } from 'vite'
import uni from '@dcloudio/vite-plugin-uni'
import vueJsx from '@vitejs/plugin-vue-jsx'
import AutoImport from 'unplugin-auto-import/vite'
import { resolve } from 'path'
// https://vitejs.dev/config/
export default defineConfig((config) => {
  const { command, mode } = config
  const env = loadEnv(mode, process.cwd())
  return {
    build: {
      target: 'es6'
    },
    resolve: {
      alias: [
        {
          find: '@',
          replacement: resolve(__dirname, 'src')
        }
      ]
    },
    plugins: [
      uni(),
      vueJsx(),
      AutoImport({
        imports: [
          'vue',
          'uni-app',
          'pinia',
          {
            from: 'uni-mini-router',
            imports: ['createRouter', 'useRouter', 'useRoute']
          }
        ],
        dts: 'src/auto-imports.d.ts',
        dirs: ['src/store'],
        eslintrc: {
          enabled: true,
          globalsPropValue: true
        }
      })
    ],
    server: {
      host: 'localhost',
      port: Number(env.VITE_APP_PORT),
      proxy: {
        [env.VITE_APP_BASE_API]: {
          target: env.VITE_APP_BASE_URL,
          changeOrigin: true,
          rewrite: (path: string) => path.replace(new RegExp(`^${env.VITE_APP_BASE_API}`), '')
        }
      }
    }
  }
})
