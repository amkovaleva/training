

<template>

  <h2>{{ equation }} ?</h2>
</template>


<script>
import TaskGenerator from '@/assets/js/TaskGenerator'

let taskGenerator = new TaskGenerator(1, 10);

export default {
  name: "Task",
  data() {
    return {
      taskGenerator: taskGenerator
    }
  },
  computed: {
    equation() {
      return this.taskGenerator.equation;
    }
  },

  methods: {
    generateTask() {
      this.taskGenerator.generate();
    },
  }
}
</script>
