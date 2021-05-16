<template>
  <div id="app">
    <nav>
      <div class="container">
        <h1><Info></Info><Settings></Settings> Научись быстро считать!</h1>
      </div>
    </nav>

    <div class="container">
      <div class="main" v-if="!trainingSelected">
        <a href="#" @click="selectTraining(trainings.YesNo)"><span>&#x2714; Верно / Неверно</span></a>
        <a href="#" @click="selectTraining(trainings.GiveAnswer)"><span>&#x270F; Дай ответ</span></a>
      </div>
      <Training v-else @change-training="changeTraining" :type="activeTraining"></Training>
    </div>
  </div>
</template>

<script>
import Training from "./components/Training";
import './assets/styles/stylesheet.css';
import Settings from "@/components/Settings";
import Info from "@/components/Info";

export default {
  name: 'App',
  data(){
    return {
      activeTraining: 0,
      trainings: {None: 0, YesNo: 1, GiveAnswer: 2}
    }
  },
  computed:{
    trainingSelected(){
      return this.activeTraining !== this.trainings.None;
    }
  },
  methods:{
    selectTraining(index){
      this.activeTraining = index;
    },
    changeTraining(){
      this.activeTraining = 0;
    }
  },
  components: {
    Info,
    Settings,
    Training
  }
}
</script>
