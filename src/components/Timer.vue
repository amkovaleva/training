<template>
  <span class="count-down btn" :class="design">
          {{ counter }}
    <audio id="timerAudio" preload>
      <source src="/sounds/clock.mp3" type="audio/mpeg"/>
    </audio>
  </span>
</template>

<script>
export default {
  name: "Timer",
  props: ['design', 'startValue'],
  data: function () {
    return {
      counter: 0,
      timeout: 1000,
      audioControl: null
    }
  },
  methods:{
    startTimer() {
      this.counter = this.startValue;
      setTimeout(this.countDown, this.timeout);
    },
    countDown() {
      if(this.startValue < 0)
        return;
      this.counter--;
      if(this.counter <= 3)
        this.audioControl.play();
      setTimeout((this.counter > 1) ? this.countDown : this.triggerEnd, this.timeout);
    },
    triggerEnd() {
      this.$emit('timer-ended');
    },
  },
  mounted() {
    this.audioControl = document.getElementById('timerAudio');
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
