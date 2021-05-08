<template>
    <div class="question">
      <Task @answer-checked="answerChecked" ref="Task"></Task>
      <div class="buttons">
        <span class="btn yes" @click="givenAnswer(true)" @keyup.left="givenAnswer(true)"><b>&#8617;</b> Верно</span>
        <span class="btn no" @click="givenAnswer(false)" @keyup.right="givenAnswer(false)">Не верно <b>&#8618;</b></span>
      </div>
    </div>
</template>

<script>
import Task from "./Task";
export default {
  name: "Training",
  components: {Task},
  data(){
    return{
      arrowKeys: {
        left: 'ArrowLeft',
        right: 'ArrowRight'
      }
    }
  },
  computed:{
    yesNoKeys(){
      return  [this.arrowKeys.left, this.arrowKeys.right];
    }
  },
  methods: {
    givenAnswer(isTrueAnswer) {
      if(this.$refs.Task)
        this.$refs.Task.givenAnswer(isTrueAnswer);
    },

    answerChecked(isCorrectAnswer){
      this.$refs.Task.generateTask();
      this.$emit('collect-answer', isCorrectAnswer);
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

