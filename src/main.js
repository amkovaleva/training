import { createApp } from 'vue'
import App from './App.vue'
import router from './router'


const trainingApp = createApp(App);
trainingApp.provide('trainingCollector',  null)
trainingApp.use(router);
trainingApp.mount('#app')
