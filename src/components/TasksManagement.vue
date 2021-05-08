<template>
  <div>
    <div class="timer">
      <div class="info" v-show="isInactive || isFinished">
        <p v-if="isInactive">Вам будут предложены уравнения. <br>
          Нужно определить, явряются ли они верными. <br>
          Для управления можно использовать кнопки или стрелки клавиатуры. <br>
          У вас {{taskTime}} секунд. Удачи!</p>
        <p v-if="isFinished">Вы дали ответ на {{ totalAnswers }} вопросов.<br>
          Из них {{correctAnswers}} были верными. <br>
          Это {{percent}} %.</p>
        <span class="btn" @click="stateChanging()">Начать{{(isFinished) ? ' заново' : ''}}</span>
      </div>
      <span class="count-down" :class="{prepare: isPrepare, started: isStarted}" v-show="isPrepare || isStarted">
        {{ timer }}
        <span v-if="isStarted"> | {{correctAnswers}} / {{totalAnswers}}</span></span>
    </div>
    <Training v-show="isStarted" @collect-answer="collectAnswer"></Training>

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
      correctAnswers: 0,
      state: 0,
      timer: 0,
      prepareTime: 3,
      taskTime: 20,
      states: {inactive: 0, prepare: 1, started:2, finished:3}
    }
  },
  methods: {
    stateChanging() {
      this.state = (this.state + 1 ) % 4;

      if(!this.state) {
        this.stateChanging();
        return;
      }

      if (this.isPrepare || this.isStarted)
        this.startTimer();

      if(this.isFinished)
        this.collectTraining();
    },
    startTimer() {
      this.timer = (this.isPrepare) ? this.prepareTime : this.taskTime;

      if(this.isStarted)
        this.prepareForTraining();

      setTimeout(this.countDown, 1000);
    },
    countDown() {
      this.timer--;
      setTimeout((this.timer > 0) ? this.countDown : this.stateChanging, 1000);
    },
    collectAnswer(isCorrectAnswer){
      this.totalAnswers++;
      if(isCorrectAnswer)
        this.correctAnswers++;
    },
    prepareForTraining(){
      this.totalAnswers = 0;
      this.correctAnswers = 0;
    },
    collectTraining(){
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
    },
    percent(){
      if(!this.totalAnswers)
        return 0;
      return Math.round( this.correctAnswers / this.totalAnswers * 100);
    }
  }
}
</script>
