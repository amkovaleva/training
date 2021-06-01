<template>
  <audio :id="id" preload>
    <source :src="src" type="audio/mpeg"/>
  </audio>
</template>

<script>
export default {
  name: "Sound",
  props: ['id', 'src'],
  data(){
    return {
      audioControl: null,
    }
  },
  methods: {
    play(){
      if(this.audioControl){
        this.audioControl.currentTime = 0;
        this.checkVolume();
        this.audioControl.play();
      }
    },
    checkVolume(){
      let vol = (window.settings) ? window.settings.sound.volume: 50,
          enabled = (window.settings) ? window.settings.sound.enabled: true;
      this.audioControl.volume = vol/100;
      this.audioControl.muted = !enabled;
    }
  },
  mounted() {
    this.audioControl = document.getElementById(this.id);
  }
}
</script>
