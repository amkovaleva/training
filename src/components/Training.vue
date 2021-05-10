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
            :design="(isPrepare) ? 'round' : 'square'"
            @timer-ended="stateChanging()"></Timer>

    <span v-if="isStarted"> | {{ correctAnswers }} / {{ totalAnswers }}</span>

    <div class="question" v-show="isStarted">
      <Task @answer-checked="answerChecked" ref="Task"></Task>
      <div class="buttons">
        <span class="btn yes" @click="givenAnswer(true)" @keyup.left="givenAnswer(true)"><b>&#8617;</b> Верно</span>
        <span class="btn no" @click="givenAnswer(false)"
              @keyup.right="givenAnswer(false)">Не верно <b>&#8618;</b></span>
      </div>
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
      arrowKeys: {
        left: 'ArrowLeft',
        right: 'ArrowRight'
      },
      totalAnswers: 0,
      correctAnswers: 0,
      state: 0,
      prepareTime: 3,
      taskTime: 90,
      states: {inactive: 0, prepare: 1, started: 2, finished: 3}
    }
  },
  computed: {
    yesNoKeys() {
      return [this.arrowKeys.left, this.arrowKeys.right];
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

    givenAnswer(isTrueAnswer) {
      if (this.$refs.Task)
        this.$refs.Task.givenAnswer(isTrueAnswer);
    },

    answerChecked(isCorrectAnswer) {
      this.collectAnswer(isCorrectAnswer);
      this.$refs.Task.generateTask();
    },

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
  },
  mounted() {
    window.addEventListener('keyup', event => {
      if (!this.yesNoKeys.includes(event.key))
        return;

      this.givenAnswer(this.arrowKeys.left === event.key);
    })
  }
}
</script>

