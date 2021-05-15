<template>
  <p v-show="isFinished">Вы дали ответ на {{ totalAnswers }} вопросов.<br>
    Из них {{ correctAnswers }} были верными. <br>
    Это {{ percent }} %.</p>
</template>

<script>
export default {
  name: "Summary",
  props: ['correctAnswers', 'totalAnswers'],
  computed:{
    percent() {
      if (!this.totalAnswers)
        return 0;
      return Math.round(this.correctAnswers / this.totalAnswers * 100);
    }
  }
}
</script>
