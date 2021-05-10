<template>
    <h2>
      <span  :class="`state${state}`">{{ equation }} ?</span>
      <span v-show="isErrorState">{{ correctEquation }}</span>
    </h2>
</template>

<script>
import TaskGenerator from '@/assets/js/TaskGenerator'
let taskGenerator = new TaskGenerator(1, 10);

export default {
  name: "Task",
  data() {
    return {
      taskGenerator: taskGenerator,
      correctTime: 500,
      errorTime: 2000,
    }
  },
  computed: {
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
  },

  methods: {
    generateTask() {
      this.taskGenerator.generate();
    },
    givenAnswer(isTrueAnswer) {
      let isCorrect = this.taskGenerator.checkAnswer(isTrueAnswer);
      setTimeout(()=> this.$emit('answer-checked', isCorrect), isCorrect ? this.correctTime:  this.errorTime);
    }
  }
}
</script>
