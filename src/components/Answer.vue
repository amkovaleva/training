<template>
  <div class="buttons">
    <span class="btn yes" @click="givenAnswer(true)" @keyup.left="givenAnswer(true)"><b>&#8617;</b> Верно</span>
    <span class="btn no" @click="givenAnswer(false)"
          @keyup.right="givenAnswer(false)">Не верно <b>&#8618;</b></span>
  </div>
</template>

<script>
export default {
  name: "Answer",
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
      this.$emit('answer-to-check', givenAnswer);
    },
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
