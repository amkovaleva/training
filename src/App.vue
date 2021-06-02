<template>
  <div>
    <nav class="navbar navbar-expand-md  fixed-top navbar-light bg-light">
      <div class="container-lg">
        <router-link class="navbar-brand" :to="{ name: 'Home' }">Научись быстро считать!</router-link>
        <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarText" aria-controls="navbarText" aria-expanded="false" aria-label="Toggle navigation">
          <span class="navbar-toggler-icon"></span>
        </button>
        <div class="collapse navbar-collapse" id="navbarText">
          <ul class="navbar-nav me-auto mb-2 mb-lg-0">
            <li class="nav-item">
              <router-link class="nav-link" :to="{ name: 'Home' }">Главная</router-link>
            </li>
            <li class="nav-item">
              <router-link class="nav-link" :to="{ name: 'Info' }">Информация</router-link>
            </li>
            <li class="nav-item">
              <router-link class="nav-link" :to="{ name: 'Stat' }">Статистика</router-link>
            </li>
            <li class="nav-item">
              <router-link class="nav-link" :to="{ name: 'Settings' }">Настройки</router-link>
            </li>
          </ul>
        </div>
      </div>
    </nav>

    <div class="main" :class="isFullPage ? '' : 'container'">
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

  setup(){
    const route = useRoute();
    const routeName = computed(() =>route.name)
    return {routeName}
  },
  computed:{
    isFullPage(){
      return this.routeName === 'Stat';
    }
  }
}
</script>
