import Vue from 'vue'
import App from './App.vue'
import TrainingCollector from "@/assets/js/TrainingCollector";


Vue.config.productionTip = false;
Vue.prototype.$trainingCollector = new TrainingCollector();

new Vue({
  render: h => h(App),
}).$mount('#app')

