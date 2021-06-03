<template>
  <div>
    <nav class="navbar navbar-expand-md  fixed-top navbar-light bg-light">
      <div class="container-lg">
        <router-link :to="{ name: 'Home' }" class="navbar-brand">Научись быстро считать!</router-link>
        <button aria-controls="navbarText" aria-expanded="false" aria-label="Toggle navigation" class="navbar-toggler"
                data-bs-target="#navbarText" data-bs-toggle="collapse" type="button">
          <span class="navbar-toggler-icon"></span>
        </button>
        <div id="navbarText" class="collapse navbar-collapse">
          <ul class="navbar-nav me-auto mb-2 mb-lg-0">
            <li class="nav-item">
              <router-link :to="{ name: 'Home' }" class="nav-link">Главная</router-link>
            </li>
            <li class="nav-item">
              <router-link :to="{ name: 'Info' }" class="nav-link">Информация</router-link>
            </li>
            <li class="nav-item">
              <router-link :to="{ name: 'Stat' }" class="nav-link">Статистика</router-link>
            </li>
            <li class="nav-item">
              <router-link :to="{ name: 'Settings' }" class="nav-link">Настройки</router-link>
            </li>
          </ul>
        </div>
      </div>
    </nav>

    <div :class="isFullPage ? '' : 'container'" class="main">
      <router-view></router-view>
    </div>
  </div>
</template>

<script>
import 'bootstrap/js/src/collapse.js'
import 'bootstrap/js/src/button.js'
import './assets/scss/custom.scss';

import {useRoute} from 'vue-router'
import {computed} from "vue";


export default {
  name: 'App',

  setup() {
    const route = useRoute();
    const routeName = computed(() => route.name)
    return {routeName}
  },
  computed: {
    /**
     * Определяет, должен ли router-view отображен на всю ширину или обернут в  container
     * @returns {boolean}
     */
    isFullPage() {
      return this.routeName === 'Stat';
    }
  }
}
</script>
