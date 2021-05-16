<template>
  <div class="alert">
    <h3>{{question}}</h3>
    <div class="buttons">
      <span class="btn yes" @click="givenAnswer(true)" >Да</span>
      <span class="btn no" @click="givenAnswer(false)">Нет</span>
    </div>
  </div>
</template>

<script>
export default {
  name: "Alert",
  props: ['question'],
  methods:{
    givenAnswer(isYes){
      this.$emit('alert-result', isYes);
    }
  }
}
</script>
