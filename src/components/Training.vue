<template>
  <div class="row justify-content-center">
    <div v-show="isInactive || isFinished" class="col">
      <div class="card text-center mb-5">
        <h2 class="card-header">
          Внимание!
        </h2>
        <div class="card-body">
          <h5 class="card-title">{{ infoTitle }}</h5>
          <p class="card-text mb-5">{{ infoText }}</p>
          <router-link id="homeLink" :to="{ name: 'Home' }" class="btn btn-light">&#129120; Вернуться</router-link>&nbsp;
          <a class="btn btn-success" href="#" @click="stateChanging(1)">Начать{{ (isFinished) ? ' заново' : '' }}</a>
        </div>
      </div>
    </div>

    <div class="btn-toolbar justify-content-center mb-5">
      <div class="btn-group" role="group">
        <button v-show="isStarted" class="btn btn-outline-success" type="button" @click="back">&#129120;</button>
        <button v-show="isStarted" class="btn btn-outline-success" type="button" @click="stateChanging(3)">&#11118;
        </button>
        <button v-show="isStarted" class="btn btn-outline-success" type="button" @click="pauseToggle">
          {{ isOnPause ? '⏵︎︎' : '⏸' }}
        </button>
        <Timer :enebled="isPrepare || isStarted"
               :is-on-pause="isOnPause"
               :mode="isPrepare ? 'round' : '' "
               :show="isPrepare || isStarted"
               :start-value="(isPrepare) ? prepareTime : ((isStarted) ? taskTime : -1)"
               @timer-ended="stateChanging(1)"
               @pause-toggle="pauseToggle"></Timer>
      </div>
    </div>

    <div class="col-lg-8 mb-5">
      <Task v-show="isStarted" :isOnPause="isOnPause" :type="Number(type)" @answer-checked="collectAnswer"></Task>
    </div>

  </div>
</template>

<script>

import Timer from "./inner/Timer.vue";
import Task from "./inner/Task.vue";

export default {
  name: "Training",
  components: {Task, Timer},
  props: {type: Number},
  data() {
    return {
      totalAnswers: 0,
      correctAnswers: 0,
      state: 0,
      isOnPause: false,
      states: {inactive: 0, prepare: 1, started: 2, finished: 3},
    }
  },
  computed: {
    isYesNoType() {
      return Number(this.type) === 1;
    },
    infoText() {
      if (this.isInactive) {
        let text = this.isYesNoType ? `Нужно определить, явряются ли они верными.` : `Нужно найти неизвестное.`;

        text += ` У вас ${this.taskTime} секунд. Удачи!`;
        return text;
      }
      let percent = (!this.totalAnswers) ? 0 : Math.round(this.correctAnswers / this.totalAnswers * 100);
      return `Вы дали ответ на ${this.totalAnswers} вопросов. Из них ${this.correctAnswers} были верными. Это ${percent}%.`;
    },
    infoTitle() {
      return this.isInactive ? 'Вам будут предложены уравнения.' : 'Ваш результат:';
    },
    prepareTime() {
      return this.$getSetting('time.prepare');
    },
    taskTime() {
      return this.$getSetting('time.training');
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
    }
  },
  methods: {
    stateChanging(skipSteps) {
      this.state = (this.state + skipSteps) % 4;

      if (!this.state)
        this.stateChanging(1);

      if (this.isStarted) {
        this.totalAnswers = 0;
        this.correctAnswers = 0;
      }
      if (this.isFinished && this.totalAnswers)
        this.$collectTraining({
          isYesNo: this.isYesNoType,
          total: this.totalAnswers,
          correct: this.correctAnswers
        });
    },
    pauseToggle() {
      this.isOnPause = !this.isOnPause;
    },
    back() {
      this.state = 0;
      document.getElementById('homeLink').click();
    },
    collectAnswer(isCorrect) {
      this.totalAnswers++;
      if (isCorrect)
        this.correctAnswers++;
    },
  },
  unmounted() {
    this.$updateStatData();
  }
}
</script>

