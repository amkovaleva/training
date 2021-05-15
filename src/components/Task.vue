<template>
  <div>
    <h2>
      <span  :class="`state${state}`">{{ equation }} ?</span>
      <span v-show="isErrorState">{{ correctEquation }}</span>
    </h2>
    <Answer @answer-to-check="checkAnswer" :needed-answer="isNewState && !isOnPause"></Answer>
    <Sound id="wrongAudio" src="/sounds/error.mp3" ref="WrongAudio"></Sound>
    <Sound id="rightAudio" src="/sounds/ok.mp3" ref="RightAudio"></Sound>
  </div>
</template>

<script>
import TaskGenerator from '@/assets/js/TaskGenerator';
import Answer from "./Answer";
import Sound from "@/components/Soound";
let taskGenerator = new TaskGenerator(1, 10);

export default {
  name: "Task",
  components: {Sound, Answer},
  props: ['isOnPause'],
  data() {
    return {
      taskGenerator: taskGenerator,
    }
  },
  computed: {
    correctTime(){
      return (window.settings) ? window.settings.time.afterAnswer.right: 500;
    },
    errorTime(){
      return (window.settings) ? window.settings.time.afterAnswer.wrong: 1000;
    },
    equation() {
      return this.taskGenerator.equation;
    },
    correctEquation() {
      return this.taskGenerator.correctEquation;
    },
    state() {
      return this.taskGenerator.state;
    },
    isErrorState() {
      return this.taskGenerator.isErrorState;
    },
    isNewState() {
      return this.taskGenerator.isNewState;
    },
  },

  methods: {
    generateTask() {
      if(this.isOnPause)
        return;
      this.taskGenerator.generate();
    },

    checkAnswer(givenAnswer) {
      if(this.isOnPause)
        return;

      let isCorrect = this.taskGenerator.checkAnswer(givenAnswer);
      if(isCorrect)
        this.$refs.RightAudio.play();
      else
        this.$refs.WrongAudio.play();

      setTimeout(()=> {this.$emit('answer-checked', isCorrect); this.generateTask();},
          isCorrect ? this.correctTime:  this.errorTime);
    }
  }
}
</script>
