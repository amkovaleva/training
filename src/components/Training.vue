<template>
  <div class="training-container" >

    <div class="info" v-show="isInactive || isFinished">
      <p v-if="isInactive">Вам будут предложены уравнения. <br>
        Нужно определить, явряются ли они верными. <br>
        Для управления можно использовать кнопки или стрелки клавиатуры. <br>
        У вас {{ taskTime }} секунд. Удачи!</p>
      <p v-show="isFinished">Вы дали ответ на {{ totalAnswers }} вопросов.<br>
        Из них {{ correctAnswers }} были верными. <br>
        Это {{ percent }} %.</p>
      <span class="btn" @click="stateChanging()">Начать{{ (isFinished) ? ' заново' : '' }}</span>
    </div>

    <Timer  ref="Timer" v-show="isPrepare || isStarted"
            :startValue="(isPrepare) ? prepareTime : ((isStarted) ? taskTime : -1)"
            :design="(isPrepare) ? 'big' : 'small'"
            @timer-ended="stateChanging()"></Timer>

    <div class="question" v-show="isStarted">
      <Task @answer-checked="collectAnswer"></Task>
    </div>
  </div>
</template>

<script>
import Task from "./Task";
import Timer from "./Timer";

export default {
  name: "Training",
  components: {Task, Timer},
  data() {
    return {
      totalAnswers: 0,
      correctAnswers: 0,
      state: 0,
      states: {inactive: 0, prepare: 1, started: 2, finished: 3}
    }
  },
  computed: {
    prepareTime(){
        return (window.settings) ? window.settings.time.prepare: 3;
      },
    taskTime(){
        return (window.settings) ? window.settings.time.training: 90;
      },
    isInactive() {
      return this.state === this.states.inactive
    },
    isPrepare() {
      return this.state === this.states.prepare
    },
    isStarted() {
      return this.state === this.states.started
    },
    isFinished() {
      return this.state === this.states.finished
    },
    percent() {
      if (!this.totalAnswers)
        return 0;
      return Math.round(this.correctAnswers / this.totalAnswers * 100);
    }
  },
  methods: {
    stateChanging() {
      this.state = (this.state + 1) % 4;

      if (!this.state) {
        this.stateChanging();
        return;
      }

      if (this.isStarted)
        this.prepareForTraining();

    },
    collectAnswer(isCorrectAnswer) {
      this.totalAnswers++;
      if (isCorrectAnswer)
        this.correctAnswers++;
    },
    prepareForTraining() {
      this.totalAnswers = 0;
      this.correctAnswers = 0;
    }
  }
}
</script>

