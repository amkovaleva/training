<template>

  <button v-show="show" type="button" class="btn btn-outline-success" :class="`timer-${mode}`" @click="popUpPause">{{ (this.isOnPause && this.mode === 'round') ? '⏵'  : counter }}</button>
  <Sound id="timerAudio" src="/sounds/clock.mp3" ref="timerAudio" ></Sound>
</template>

<script>
import Sound from "./Soound.vue";
import {ref} from "vue";

export default {
  name: "Timer",
  components: {Sound},
  props: {startValue: Number, isOnPause: Boolean, mode: String, show: Boolean},
  data: function () {
    return {
      counter: 0,
      timoutSent: false,
      timeout: 1000,
    }
  },
  methods:{
    sendTimeout(handler){
      setTimeout(handler, this.timeout);
      this.timoutSent = true;
    },
    startTimer() {
      this.counter = this.startValue;
      if(this.timoutSent)
        return;
      this.makeSound();
      this.sendTimeout(this.countDown)
    },
    countDown() {
      if(this.startValue < 0 || this.isOnPause || this.counter <=0)
        return;

      this.counter--;
      this.makeSound();
      this.sendTimeout((this.counter > 1) ? this.countDown : this.triggerEnd);
    },
    triggerEnd() {
      this.timoutSent = false;
      this.makeSound();
      this.$emit('timer-ended');
    },
    makeSound(){
      if(this.counter <= 3 && this.timerAudio)
        this.timerAudio.play();
    },
    popUpPause(){
      this.$emit('pause-toggle');
    },
    keyupHandler(event) {
      if (event.key !== " ")
        return;
      this.popUpPause();
    }
  },
  watch: {
    startValue: function(newVal, oldVal) {
      if(newVal === -1  || newVal === oldVal)
        return;
      this.startTimer();
    },
    isOnPause: function (newVal){
      if(!newVal)
        this.countDown();
    }
  },
  mounted() {
    window.addEventListener('keyup', this.keyupHandler);
  },
  beforeUnmount(){
    window.removeEventListener('keyup', this.keyupHandler);
  },
  setup(){
    const timerAudio = ref(null);
    return {timerAudio};
  }
}
</script>
