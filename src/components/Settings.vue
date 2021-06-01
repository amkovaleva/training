<template>
  <div class="row">
    <div class="col-12 text-center">
      <h2 class="mb-5">Настройки</h2>
    </div>
    <div class="col-12">
      <form id="settingsForm" class="row" action="#" @submit="submitForm">
          <div v-show="!valid || saved" class="alert"
               :class="!valid ? 'alert-danger' : 'alert-success'" role="alert">
            <svg xmlns="http://www.w3.org/2000/svg" style="display: none;">
              <symbol id="exclamation-triangle-fill" fill="currentColor" viewBox="0 0 16 16">
                <path
                    d="M8.982 1.566a1.13 1.13 0 0 0-1.96 0L.165 13.233c-.457.778.091 1.767.98 1.767h13.713c.889 0 1.438-.99.98-1.767L8.982 1.566zM8 5c.535 0 .954.462.9.995l-.35 3.507a.552.552 0 0 1-1.1 0L7.1 5.995A.905.905 0 0 1 8 5zm.002 6a1 1 0 1 1 0 2 1 1 0 0 1 0-2z"/>
              </symbol>
            </svg>
            <svg class="bi flex-shrink-0 me-2" width="24" height="24" role="img" aria-label="Info:">
              <use xlink:href="#exclamation-triangle-fill"/>
            </svg>
            <span>
            {{ !valid ? 'Заполните, пожалуйста, поля ввода.' : 'Изменения успешно сохранены' }}
          </span>
          </div>
          <div class="col-lg-6">
            <h4 class="mb-5">Обратный отсчет (секунды)</h4>
            <div class="mb-3 row">
              <label for="prepareTime" class="col-6 col-form-label">Перед тренировкой:</label>
              <div class="col-6">
                <input type="number" required class="form-control" id="prepareTime"
                       v-model="settings.time.prepare"
                       min="1" @change="validateForm">
              </div>
            </div>
            <div class="mb-3 row">
              <label for="trainingTime" class="col-6 col-form-label">Продолжительность тренировки:</label>
              <div class="col-6">
                <input type="number" required class="form-control" id="trainingTime"
                       v-model="settings.time.training"
                       min="1" @change="validateForm">
              </div>
            </div>
          </div>
          <div class="col-lg-6 mb-5">
            <h4 class="mb-5">Задержка после ответа (милисекунды)</h4>
            <div class="mb-3 row">
              <label for="afterRightAnswerTime" class="col-6 col-form-label">После правильного ответа:</label>
              <div class="col-6">
                <input type="number" required class="form-control" id="afterRightAnswerTime"
                       v-model="settings.time.afterAnswer.right"
                       min="1" @change="validateForm">
              </div>
            </div>
            <div class="mb-3 row">
              <label for="afterWrongAnswerTime" class="col-6 col-form-label">После неправильного ответа:</label>
              <div class="col-6">
                <input type="number" required class="form-control" id="afterWrongAnswerTime"
                       v-model="settings.time.afterAnswer.wrong"
                       min="1" @change="validateForm">
              </div>
            </div>
          </div>
          <hr class="mb-5">

        <div class="col-12">
            <h4 class="mb-5">Звук</h4>
        </div>
        <div class="col-lg-6 mb-5">
            <div class="form-check form-switch">
              <input class="form-check-input" type="checkbox" id="soundsEnabled" v-model="settings.sound.enabled">
              <label class="form-check-label" for="soundsEnabled">Включен</label>
            </div>
          </div>
          <div class="col-lg-6 mb-5">
            <div class="mb-3 row">
              <label for="soundVolume" class="form-label">Громкость</label>
              <input type="range" class="form-range" min="0" max="100" step="0.5" id="soundVolume"
                     v-model="settings.sound.volume">
            </div>
          </div>
          <div class="col">
            <div class="mb-3 row justify-content-center">
              <input class="btn btn-success col-md-6 col-lg-3 mb-3" type="submit" value="Сохранить">
            </div>
          </div>
      </form>
    </div>
  </div>
</template>

<script>


export default {
  name: "Settings",
  data() {
    return {
      valid: true,
      saved: false,
    }
  },
  inject: ['settings'],
  methods: {
    submitForm(e) {
      e.preventDefault();

      if (!this.valid)
        return;
      this.$saveSettings(this.settings);
      this.saved = true;
    },
    validateForm() {
      this.valid = (document.getElementById('settingsForm')).checkValidity();
      this.saved = false;
    },
  }
}
</script>
