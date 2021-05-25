import { createApp } from 'vue'
import App from './App.vue'



const trainingApp = createApp(App);
trainingApp.provide('trainingCollector',  null)
trainingApp.mount('#app')
