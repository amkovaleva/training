import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import settingsPlugin from './plugins/Settings'


const trainingApp = createApp(App);
trainingApp.provide('trainingCollector',  null)
trainingApp.use(router);
trainingApp.use(settingsPlugin, {
    time: {
        prepare: 3,
        training: 90,
        afterAnswer: {
            right: 500,
            wrong: 1000,
        }
    },
    sound: {
        enabled: true,
        volume: 70,
    }
});
trainingApp.mount('#app')
