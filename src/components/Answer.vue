<template>
  <div class="buttons" :class="neededAnswer ? '' : 'disabled' ">
    <span class="btn yes" @click="givenAnswer(true)" @keyup.left="givenAnswer(true)"><b>&#8617;</b> Верно</span>
    <span class="btn no" @click="givenAnswer(false)"
          @keyup.right="givenAnswer(false)">Не верно <b>&#8618;</b></span>
  </div>
</template>

<script>
export default {
  name: "Answer",
  props: ['neededAnswer'],
  data() {
    return {
      arrowKeys: {
        left: 'ArrowLeft',
        right: 'ArrowRight'
      }
    }
  },
  computed: {
    yesNoKeys() {
      return [this.arrowKeys.left, this.arrowKeys.right];
    },
  },
  methods:{
    givenAnswer(givenAnswer) {
      if(!this.neededAnswer)
        return;

      this.$emit('answer-to-check', givenAnswer);
    },
    keyupHandler(event) {
      if (!this.yesNoKeys.includes(event.key))
        return;

      this.givenAnswer(this.arrowKeys.left === event.key);
    }
  },
  mounted() {
    window.removeEventListener('keyup', this.keyupHandler);
    window.addEventListener('keyup', this.keyupHandler);
  }

}
</script>
