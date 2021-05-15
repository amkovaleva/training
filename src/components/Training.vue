<template>
  <div class="training-container" >

    <div class="info" v-show="isInactive || isFinished">
      <Intro v-if="isInactive" :task-time="taskTime"></Intro>
      <Summary v-show="isFinished" :correct-answers="correctAnswers" :total-answers="totalAnswers"></Summary>
      <span class="btn" @click="stateChanging()">Начать{{ (isFinished) ? ' заново' : '' }}</span>
    </div>


    <aside :class="asideMode">
      <span class="btn" v-show="isStarted" @click="back">&#129120;</span>
      <span class="btn" v-show="isStarted" @click="reload">&#11118;</span>
      <span class="btn last" v-show="isStarted" @click="pauseToggle">{{isOnPause ? '⏵︎︎' : '⏸' }}︎</span>
      <Timer  ref="Timer" v-show="isPrepare || isStarted"
              :start-value="(isPrepare) ? prepareTime : ((isStarted) ? taskTime : -1)"
              :enebled="isPrepare || isStarted"
              :is-on-pause="isOnPause"
              @timer-ended="stateChanging()"
              @pause-toggle="pauseToggle" ></Timer>
    </aside>

    <div class="question" v-show="isStarted">
      <Task @answer-checked="collectAnswer"
            :is-on-pause="isOnPause"></Task>
    </div>
  </div>
</template>

<script>
import Task from "./Task";
import Timer from "./Timer";
import Summary from "@/components/Summary";
import Intro from "@/components/Intro";

export default {
  name: "Training",
  components: {Intro, Summary, Task, Timer},
  data() {
    return {
      totalAnswers: 0,
      correctAnswers: 0,
      state: 0,
      isOnPause: false,
      states: {inactive: 0, prepare: 1, started: 2, finished: 3}
    }
  },
  computed: {
    asideMode(){
      return this.isPrepare ? 'big' : 'small'
    },
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
    }
  },
  methods: {
    stateChanging(skipSteps = 1) {
      this.state = (this.state + skipSteps) % 4;

      if (!this.state) {
        this.stateChanging();
        return;
      }

      if (this.isPrepare)
        this.prepareForTraining();

    },
    pauseToggle(){
      this.isOnPause = !this.isOnPause;
    },
    reload(){
      this.stateChanging(3);
    },
    back(){
      this.state = 0;
      this.$emit('change-training');
    },
    collectAnswer(isCorrectAnswer) {
      this.totalAnswers++;
      if (isCorrectAnswer)
        this.correctAnswers++;
    },
    prepareForTraining() {
      this.totalAnswers = 0;
      this.correctAnswers = 0;
      this.isOnPause = false;
    }
  }
}
</script>

