<template>
  <div>
    <div v-if="isYesNoType" class="buttons" :class="neededAnswer ? '' : 'disabled' ">
      <span class="btn yes" @click="givenAnswer(true)" @keyup.left="givenAnswer(true)"><b>&#8617;</b> Верно</span>
      <span class="btn no" @click="givenAnswer(false)"
            @keyup.right="givenAnswer(false)">Не верно <b>&#8618;</b></span>
    </div>
    <div v-else class="full-answer" :class="neededAnswer ? '' : 'disabled' ">
        <span>? =</span>
        <input id="fullAnswerId" v-model="typedAnswer" type="number" min="0" step="1" :disabled="!neededAnswer">
        <span class="btn" @click="givenAnswer(typedAnswer)">	&#8629;</span>
        <span class="btn" @click="givenAnswer('')"> Следующий </span>
    </div>
  </div>
</template>

<script>
export default {
  name: "Answer",
  props: ['neededAnswer', 'type'],
  data() {
    return {
      arrowKeys: {
        left: 'ArrowLeft',
        right: 'ArrowRight'
      },
      typedAnswer: ''
    }
  },
  computed: {
    yesNoKeys() {
      return [this.arrowKeys.left, this.arrowKeys.right];
    },
    isYesNoType() {
      return this.type === 1;
    },
  },
  methods:{
    givenAnswer(givenAnswer) {
      if(!this.neededAnswer)
        return;

      this.$emit('answer-to-check', givenAnswer);
      this.typedAnswer = '';
    },
    keyupHandler(event) {
      if(!this.neededAnswer)
        return;

      if(this.isYesNoType){
        if (!this.yesNoKeys.includes(event.key))
          return;

        this.givenAnswer(this.arrowKeys.left === event.key);
        return;
      }
      if(!isNaN(1 * event.key)) {
        if(event.target.id !== 'fullAnswerId')
          this.typedAnswer += event.key;
        return;
      }
      if(event.key === 'Backspace' ) {
        this.typedAnswer = this.typedAnswer.substr(0, this.typedAnswer.length-1)
        return;
      }

      if(event.key === 'Enter' || event.key === 'Escape'){
        this.givenAnswer(event.key === 'Enter' ? this.typedAnswer : '');
      }

    }
  },
  mounted() {
    window.removeEventListener('keyup', this.keyupHandler);
    window.addEventListener('keyup', this.keyupHandler);
  }

}
</script>
