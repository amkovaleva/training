<template>
  <div id="app">
    <div class="main" v-if="!trainingSelected">
      <h1>Научись быстро считать!</h1>
      <a href="#" @click="selectTraining(trainings.YesNo)"><span>&#x2714; Проверь себя: </span><span>Верно / Неверно</span></a>
      <a href="#" @click="selectTraining(trainings.GiveAnswer)"><span>&#x270F; Опять проверь себя: </span><span>Дай ответ</span></a>
      <a href="#" @click="selectTraining(trainings.Extra)"><span>&#x265B; Тренируй себя: </span><span>Что скрывается под ?</span></a>
    </div>
    <div class="training-container" v-else>
      <TasksManagement></TasksManagement>
    </div>
  </div>
</template>

<script>
import TasksManagement from "./components/TasksManagement";

export default {
  name: 'App',
  data(){
    return {
      activeTraining: 0,
      trainings: {None: 0, YesNo: 1, GiveAnswer: 2, Extra: 3}
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
    }
  },
  components: {
    TasksManagement
  }
}
</script>
