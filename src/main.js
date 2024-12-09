import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import VueLazyLoad from 'vue3-lazyload'
const app = createApp(App)

app.use(VueLazyLoad, {
	// options...
})
app.mount('#app')
