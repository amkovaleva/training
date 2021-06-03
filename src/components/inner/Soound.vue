<template>
  <audio :id="id" preload>
    <source :src="src" type="audio/mpeg"/>
  </audio>
</template>

<script>
export default {
  name: "Sound",
  props: ['id', 'src'],
  data() {
    return {
      audioControl: null,
    }
  },
  methods: {
    play() {
      if (this.audioControl) {
        this.audioControl.currentTime = 0;
        this.audioControl.play();
      }
    }
  },
  mounted() {
    let vol = this.$getSetting('sound.volume'),
        enabled = this.$getSetting('sound.enabled');

    this.audioControl = document.getElementById(this.id);
    this.audioControl.volume = vol / 100;
    this.audioControl.muted = !enabled;
  }
}
</script>
