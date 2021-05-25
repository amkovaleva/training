<template>
    <nav>
      <div class="container">
        <h1>
          <Stat v-show="!trainingSelected"></Stat>
          <Info  v-show="!trainingSelected"></Info>
          <Settings  v-show="!trainingSelected"></Settings> Научись быстро считать!</h1>
      </div>
    </nav>

    <div class="container">
      <div class="main" v-if="!trainingSelected">
        <a href="#" @click="selectTraining(trainings.YesNo)"><span>&#x2714; Верно / Неверно</span></a>
        <a href="#" @click="selectTraining(trainings.GiveAnswer)"><span>&#x270F; Дай ответ</span></a>
      </div>
      <Training v-else @change-training="changeTraining" :type="activeTraining" ></Training>
    </div>
</template>

<script>
import Training from "./components/Training.vue";
import './assets/styles/stylesheet.css';
import Settings from "./components/Settings.vue";
import Info from "./components/Info.vue";
import Stat from "./components/Stat.vue";
import TrainingCollector from "./assets/js/TrainingCollector.js";

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
  inject: {
    trCollector: {
      from: 'trainingCollector'
    }
  },
  mounted() {
    this.trCollector = new TrainingCollector();
  },
  components: {
    Stat,
    Info,
    Settings,
    Training,
    TrainingCollector
  }
}
</script>
