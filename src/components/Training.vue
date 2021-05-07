<template>
    <div class="question">
      <Task></Task>
      <div class="buttons">
        <span class="yes">Верно</span>
        <span class="no">Не верно</span>
      </div>
    </div>
</template>

<script>
import Task from "./Task";
export default {
  name: "Training",
  components: {Task},
  methods: {
    givenAnswer() {

    },
  }
}
</script>

