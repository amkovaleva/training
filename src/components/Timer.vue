<template>
  <span class="count-down btn" :class="design">
          {{ counter }}
    <Sound id="timerAudio" src="/sounds/clock.mp3" ref="TimerAudio" ></Sound>
  </span>
</template>

<script>
import Sound from "@/components/Soound";
export default {
  name: "Timer",
  components: {Sound},
  props: ['design', 'startValue'],
  data: function () {
    return {
      counter: 0,
      timeout: 1000,
    }
  },
  methods:{
    startTimer() {
      this.counter = this.startValue;
      this.makeSound();
      setTimeout(this.countDown, this.timeout);
    },
    countDown() {
      if(this.startValue < 0)
        return;
      this.counter--;
      this.makeSound();
      setTimeout((this.counter > 1) ? this.countDown : this.triggerEnd, this.timeout);
    },
    triggerEnd() {
      this.makeSound();
      this.$emit('timer-ended');
    },
    makeSound(){
      if(this.counter <= 3)
        this.$refs.TimerAudio.play();
    }
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
