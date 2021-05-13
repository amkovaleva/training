<template>
<div class="settings">
  <span @click="toggleVisibility">&#9881;</span>
  <form v-if="visible" id="settingsForm" action="#" @submit="checkForm">
    <div class="container">
      <h3>Настройки <span class="close" @click="toggleVisibility">&#x2715;</span></h3>
      <div class="row center">
        <label for="name"> Имя:</label>
        <input type="text" id="name" v-model="settings.name">
      </div>

      <fieldset>
        <legend>Обратный отсчет <span>(секунды)</span></legend>
        <div class="row">
          <label for="prepareTime">Перед тренировкой:</label>
          <input required type="number" id="prepareTime" v-model="settings.time.prepare">
        </div>
        <div class="row">
          <label for="trainingTime">Продолжительность тренировки:</label>
          <input required type="number" id="trainingTime" v-model="settings.time.training">
        </div>
      </fieldset>

      <fieldset>
        <legend>Задержка после ответа <span>(милисекунды)</span></legend>
        <div class="row">
          <label for="afterRightAnswerTime">После правильного ответа:</label>
          <input required type="number" id="afterRightAnswerTime"  v-model="settings.time.afterAnswer.right">
        </div>
        <div class="row">
          <label for="afterWrongAnswerTime">После неправильного ответа:</label>
          <input required type="number" id="afterWrongAnswerTime"  v-model="settings.time.afterAnswer.wrong">
        </div>
      </fieldset>


      <fieldset>
        <legend>Звук</legend>
        <div class="row center">
          <input type="checkbox" id="soundsEnabled" v-model="settings.sound.enabled">
          <label for="soundsEnabled">Включен</label>
        </div>
        <div class="row center">
          <label for="soundVolume">Громкость:</label>
          <input type="range" id="soundVolume" v-model="settings.sound.volume" min="0" max="100">
        </div>
      </fieldset>

      <input class="btn" type="submit" value="Сохранить">
    </div>
  </form>
</div>
</template>

<script>

export default {
  name: "Settings",
  data() {
    return {
      visible: false,
      settings: {
        name: null,
        time: {
          prepare: 3,
          training: 90,
          afterAnswer: {
            right: 500,
            wrong: 1000,
          }
        },
        sound: {
          enabled: true,
          volume: 70,
        }
      },
    }
  },
  methods: {
    checkForm(e) {
      e.preventDefault();
      window.settings = this.settings;
      localStorage.setItem("settings", JSON.stringify(this.settings));
      this.toggleVisibility();
    },
    toggleVisibility() {
      this.visible = !this.visible;
    }
  },
  mounted() {
    let data = JSON.parse(localStorage.getItem("settings"));
    if (data)
      this.settings = data;
    window.settings = this.settings;
  }
}
</script>
