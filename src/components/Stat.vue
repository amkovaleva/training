<template>
  <div class="settings">
    <span @click="toggleVisibility">∿</span>
    <div v-show="visible" class="fixed-full-page">
      <h3>Статистика <span class="close" @click="toggleVisibility">&#x2715;</span></h3>
      <form  class="container">
        <fieldset>
          <legend>Показатель</legend>
          <input type="radio" v-model="infoType" value="0" id="rPer" @change="changeChartParams"><label for="rPer">Процент правильных ответов</label>
          <input type="radio" v-model="infoType" value="1" id="rSpeed" @change="changeChartParams"><label for="rSpeed">Скорость</label>
        </fieldset>
        <fieldset>
          <legend>Период</legend>
          <input type="radio" v-model="infoTime" value="0" id="rDay" @change="changeChartParams"><label for="rDay">По дням</label>
          <input type="radio" v-model="infoTime" value="1" id="rWeek" @change="changeChartParams"><label for="rWeek">По неделям</label>
          <input type="radio" v-model="infoTime" value="2" id="rMon" @change="changeChartParams"><label for="rMon">По месяцам</label>
        </fieldset>
      </form>
      <vue3-chart-js
          :type="chart.type"
          :id="chart.id"
          :data="chart.data"
          :options="chart.options"
          ref="chartRef"
      ></vue3-chart-js>
    </div>
  </div>
</template>

<script>

import { inject, ref } from 'vue'
import TrainingStat from "../assets/js/TrainingStat.js";
import Vue3ChartJs from '@j-t-mcc/vue3-chartjs'
import zoomPlugin from 'chartjs-plugin-zoom'

Vue3ChartJs.registerGlobalPlugins([zoomPlugin])

export default {
  name: "Stat",
  components: {Vue3ChartJs},
  data(){
    return{
      visible: false,
      trainingStat: null,
      infoType: 0,
      infoTime: 0,
      chart: null
    }
  },
  methods:{
    toggleVisibility() {
      this.visible = !this.visible;
      if (this.visible)
          this.changeChartParams();
    },
    changeChartParams(){
      if (this.trCollector.collection.length !== this.trainingStat.infoCount)
        this.trainingStat = new TrainingStat(this.trCollector.collection, this.infoType, this.infoTime);

      let isSpeed = !!(this.infoType * 1),
          data = this.trainingStat.datasets(isSpeed, this.infoTime * 1)
      this.updateChart(data, isSpeed);
    }
  },
  mounted() {
    this.trainingStat = new TrainingStat(this.trCollector.collection, this.infoType, this.infoTime);
  },

  setup () {
    const chartRef = ref(null)
    const trCollector = inject('trCollector');
    const chart = {
      type: 'bar',
      id: 'statistic',
      data: {
        labels: [],
        datasets: []
      },

      options: {
        plugins: {
          title: {
            display: true,
            text: ''
          },
          zoom: {
            zoom: {
              wheel: {
                enabled: true,
              },
              pinch: {
                enabled: true,
              },
              drag: {
                enabled: true,
              },
              mode: "x",
            },
          },
        },
      }
    }

    const updateChart = (data, isSpeed) => {
      chart.data.labels = data.labels;
      chart.data.datasets = data.datasets;
      chart.options.plugins.title.text = isSpeed ? 'Скорость ответа на вопросы (вопрос/сек.)' : 'Процент правильных ответов';

      /*console.log(chart.data.labels);
      console.log(chart.data.datasets);*/
      chartRef.value.update(250)
    }

    return {
      chart,
      trCollector,
      updateChart,
      chartRef
    }
  }
}
</script>
