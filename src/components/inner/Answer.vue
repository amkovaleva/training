<template>
  <div class="col">
    <div v-if="isYesNoType" :class="neededAnswer ? '' : 'disabled' " class="row justify-content-center">
      <div class="col-md-6 col-lg-4 mb-3">
        <span class="btn btn-success full-width" @click="givenAnswer(true)"
              @keyup.left="givenAnswer(true)"><b>&#8617;</b> Верно</span>
      </div>
      <div class="col-md-6 col-lg-4">
        <span class="btn btn-danger full-width" @click="givenAnswer(false)"
              @keyup.right="givenAnswer(false)">Не верно <b>&#8618;</b></span>
      </div>
    </div>
    <div v-else class="input-group">
      <span class="input-group-text">? =</span>
      <input id="fullAnswerId" v-model="typedAnswer" :disabled="!neededAnswer"
             aria-label="First name" class="form-control" min="0" step="1" type="number">
      <span class="input-group-text" @click="givenAnswer(typedAnswer)">&#8629; Следующий</span>
    </div>
  </div>
</template>

<script>
export default {
  name: "Answer",
  props: {neededAnswer: Boolean, isYesNoType: Boolean},
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
  },
  methods: {
    givenAnswer(givenAnswer) {
      if (!this.neededAnswer)
        return;

      this.$emit('answer-to-check', givenAnswer);
      this.typedAnswer = '';
    },
    keyupHandler(event) {
      if (!this.neededAnswer)
        return;

      if (this.isYesNoType) {
        if (!this.yesNoKeys.includes(event.key))
          return;

        this.givenAnswer(this.arrowKeys.left === event.key);
        return;
      }
      if (!isNaN(1 * event.key)) {
        if (event.target.id !== 'fullAnswerId')
          this.typedAnswer += event.key;
        return;
      }
      if (event.key === 'Backspace') {
        this.typedAnswer = this.typedAnswer.substr(0, this.typedAnswer.length - 1)
        return;
      }

      if (event.key === 'Enter' || event.key === 'Escape') {
        this.givenAnswer(event.key === 'Enter' ? this.typedAnswer : '');
      }

    }
  },
  mounted() {
    window.addEventListener('keyup', this.keyupHandler);
  },
  beforeUnmount() {
    window.removeEventListener('keyup', this.keyupHandler);
  }

}
</script>
