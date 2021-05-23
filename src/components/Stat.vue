<template>
  <div class="settings">
    <span @click="toggleVisibility">∿</span>
    <div v-if="visible" class="fixed-full-page">
      <h3>Статистика <span class="close" @click="toggleVisibility">&#x2715;</span></h3>
    </div>
  </div>
</template>

<script>
import Vue from "vue";
import trainingStat from "@/assets/js/TrainingStat";

export default {
  name: "Stat",
  data(){
    return{
      visible: false,
      trainingStat: null,
    }
  },
  methods:{
    toggleVisibility() {
      this.visible = !this.visible;
      if(this.visible)
        this.trainingStat = new trainingStat(Vue.prototype.$trainingCollector.collection);
    },
  }
}
</script>
