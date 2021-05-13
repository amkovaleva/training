<template>
  <div>
    <h2>
      <span  :class="`state${state}`">{{ equation }} ?</span>
      <span v-show="isErrorState">{{ correctEquation }}</span>
    </h2>
    <Answer @answer-to-check="checkAnswer" :needed-answer="isNewState"></Answer>
  </div>
</template>

<script>
import TaskGenerator from '@/assets/js/TaskGenerator';
import Answer from "./Answer";
let taskGenerator = new TaskGenerator(1, 10);

export default {
  name: "Task",
  components: {Answer},
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
      this.taskGenerator.generate();
    },

    checkAnswer(givenAnswer) {
      let isCorrect = this.taskGenerator.checkAnswer(givenAnswer);
      setTimeout(()=> {this.$emit('answer-checked', isCorrect); this.generateTask();},
          isCorrect ? this.correctTime:  this.errorTime);
    }
  }
}
</script>
