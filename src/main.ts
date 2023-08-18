import { createSSRApp } from 'vue'
import pinia from './store/index'
import tmui from './tmui'
import App from './App.vue'
import { tmConfig } from './config/tmConfig'
import './style/global.scss'
export function createApp() {
  const app = createSSRApp(App)
  app.use(pinia)
  app.use(tmui, tmConfig)
  return {
    app,
    pinia
  }
}
