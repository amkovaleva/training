<template>
  <div class="card text-center">
    <div class="card-body" :class="`state${state}`">
      <h2 class="card-title">{{ isErrorState ? correctEquation :equation }}</h2>
      <Answer @answer-to-check="checkAnswer" :needed-answer="isNewState && !isOnPause" :isYesNoType="isYesNoType"></Answer>
    </div>
    <Sound id="wrongAudio" src="/sounds/error.mp3" ref="wrongAudio"></Sound>
    <Sound id="rightAudio" src="/sounds/ok.mp3" ref="rightAudio"></Sound>
  </div>
</template>

<script>
import TaskGenerator from '../../assets/js/TaskGenerator';
import Answer from "./Answer.vue";
import Sound from "./Soound.vue";
import {ref} from "vue";

export default {
  name: "Task",
  components: {Sound, Answer},
  props: {isOnPause: Boolean, type: Number},
  data() {
    return {
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
      if(!this.taskGenerator)
        return '';
      return this.taskGenerator.equation;
    },
    correctEquation() {
      if(!this.taskGenerator)
        return '';
      return this.taskGenerator.correctEquation;
    },
    state() {
      if(!this.taskGenerator)
        return 0;
      return this.taskGenerator.state;
    },
    isErrorState() {
      if(!this.taskGenerator)
        return false;
      return this.taskGenerator.isErrorState;
    },
    isNewState() {
      if(!this.taskGenerator)
        return true;
      return this.taskGenerator.isNewState;
    },
    isYesNoType() {
      return this.type === 1;
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
        this.rightAudio.play();
      else
        this.wrongAudio.play();

      setTimeout(()=> {this.$emit('answer-checked', isCorrect); this.generateTask();},
          isCorrect ? this.correctTime:  this.errorTime);
    }
  },
  mounted() {
    this.taskGenerator = new TaskGenerator(1, 10, this.isYesNoType);
  },

  setup(){
    const wrongAudio = ref(null);
    const rightAudio = ref(null);
    const taskGenerator = ref(null);
    return {wrongAudio, rightAudio, taskGenerator};
  }
}
</script>
