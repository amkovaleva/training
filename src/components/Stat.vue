<template>
  <div class="settings">
    <span @click="toggleVisibility">∿</span>
    <div v-if="visible" class="fixed-full-page">
      <h3>Статистика <span class="close" @click="toggleVisibility">&#x2715;</span></h3>
    </div>
  </div>
</template>

<script>
import TrainingStat from "../assets/js/TrainingStat.js";



export default {
  name: "Stat",
  data(){
    return{
      visible: false,
      trainingStat: null
    }
  },
  inject: {
    trCollector: {
      from: 'trainingCollector'
    }
  },
  methods:{
    toggleVisibility() {
      this.visible = !this.visible;
      if(this.visible)
        this.trainingStat = new TrainingStat(this.trCollector.collection);
    },
  },
}
</script>
