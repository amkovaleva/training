<template>
  <p >Вам будут предложены уравнения. <br>
    Нужно определить, явряются ли они верными. <br>
    Для управления можно использовать кнопки или стрелки клавиатуры. <br>
    У вас {{ taskTime }} секунд. Удачи!</p>
</template>

<script>
export default {
  name: "Intro",
  props: ['taskTime']
}
</script>
