<template>
  <div class="row text-center">
    <div class="col-12 mb-5">
      <h2>Выберите тренировку</h2>
    </div>
    <div class="col-lg-6 mb-5">
      <div class="card">
        <div class="card-body">
          <h5 class="card-title">Верно/Неверно</h5>
          <p class="card-text">Определи, верно ли указанное выражение?</p>
          <router-link :to="{ name: 'Training',  params: {type: 1 }}" class="btn btn-success">Начать</router-link>
        </div>
      </div>
    </div>
    <div class="col-lg-6 mb-5">
      <div class="card">
        <div class="card-body">
          <h5 class="card-title">Дай ответ</h5>
          <p class="card-text">Введи число, скрывающееся за знаком вопроса.</p>
          <router-link :to="{ name: 'Training',  params: {type: 2 }}" class="btn btn-success">Начать</router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script>

export default {
  name: "Home"
}
</script>
