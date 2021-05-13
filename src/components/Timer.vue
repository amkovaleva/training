<template>
  <span class="count-down btn" :class="design">
          {{ counter }}
  </span>
</template>

<script>
export default {
  name: "Timer",
  props: ['design', 'startValue'],
  data: function () {
    return {
      counter: 0,
      timeout: 1000
    }
  },
  methods:{
    startTimer() {
      this.counter = this.startValue;
      setTimeout(this.countDown, this.timeout);
    },
    countDown() {
      this.counter--;
      setTimeout((this.counter > 0) ? this.countDown : this.triggerEnd, this.timeout);
    },

    triggerEnd() {
      this.$emit('timer-ended');
    },
  },
  watch: {
    startValue: function(newVal, oldVal) {
      if(newVal === -1  || newVal === oldVal)
        return;
      this.startTimer();
    }
  }
}
</script>
