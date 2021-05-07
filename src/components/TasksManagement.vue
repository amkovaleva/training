<template>
  <div>
    <div class="timer">
      <div class="info" v-show="isInactive">
        <p>Вам будут предложены уравнения. <br>
          Нужно определить, явряются ли они верными. <br>
          Для управления можно использовать кнопки или стрелки клавиатуры. <br>
          У вас 90 секунд. Удачи!</p>
        <span class="btn" @click="stateChanging(states.prepare)">Начать</span>
      </div>
      <span class="count-down" :class="{prepare: isPrepare, started: isStarted}" v-show="isPrepare || isStarted">{{ timer }}</span>
    </div>

    <Training v-if="isStarted"></Training>
  </div>
</template>

<script>
import Training from "./Training";

export default {
  name: "TasksManagement",
  components: {Training},
  data(){
    return {
      totalAnswers: 0,
      rightAnswers: 0,
      state: 0,
      timer: 90,
      prepareTime: 3,
      taskTime: 90,
      states: {inactive: 0, prepare: 1, started:2, finished:3}
    }
  },
  methods: {
    stateChanging(to) {
      if (to == null)
        to = this.state + 1;
      else if (this.state + 1 !== to) {
        console.error(`Can't change state ${this.state} to ${to}`);
        return;
      }
      this.state = to;

      if (this.isPrepare || this.isStarted)
        this.startTimer();
    },
    startTimer() {
      this.timer = (this.isPrepare) ? this.prepareTime : this.taskTime;
      setTimeout(this.countDown, 1000);
    },
    countDown() {
      this.timer--;
      setTimeout((this.timer > 0) ? this.countDown : this.stateChanging, 1000);
    }

  },
  computed:{
    isInactive(){
      return this.state === this.states.inactive
    },
    isPrepare(){
      return this.state === this.states.prepare
    },
    isStarted(){
      return this.state === this.states.started
    },
    isFinished(){
      return this.state === this.states.finished
    }
  }
}
</script>
