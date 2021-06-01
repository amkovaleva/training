<template>
  <div>
    <div class="container">
      <div class="row">
        <div class="col-12 text-center">
          <h2>Статистика</h2>
        </div>
        <div class="col-lg-6 mb-4 text-center">
          <h4 class="mb-4">Показатель</h4>
          <div class="form-check form-check-inline">
            <input class="form-check-input" type="radio" v-model="infoType" value="0" id="rPer"
                   @change="changeChartParams">
            <label class="form-check-label" for="rPer">Процент правильных ответов</label>
          </div>
          <div class="form-check form-check-inline">
            <input class="form-check-input" type="radio" v-model="infoType" value="1" id="rSpeed"
                   @change="changeChartParams">
            <label class="form-check-label" for="rSpeed">Скорость</label>
          </div>
        </div>

        <div class="col-lg-6  mb-4 text-center">
          <h4 class="mb-4">Период</h4>
          <div class="form-check form-check-inline">
            <input class="form-check-input" type="radio" v-model="infoTime" value="0" id="rDay"
                   @change="changeChartParams">
            <label class="form-check-label" for="rDay">По дням</label>
          </div>
          <div class="form-check form-check-inline">
            <input class="form-check-input" type="radio" v-model="infoTime" value="1" id="rWeek"
                   @change="changeChartParams">
            <label class="form-check-label" for="rWeek">По неделям</label>
          </div>
          <div class="form-check form-check-inline">
            <input class="form-check-input" type="radio" v-model="infoTime" value="2" id="rMon"
                   @change="changeChartParams">
            <label class="form-check-label" for="rMon">По месяцам</label>
          </div>
        </div>
      </div>
    </div>

    <vue3-chart-js
        :type="chart.type"
        :id="chart.id"
        :data="chart.data"
        :options="chart.options"
        ref="chartRef"
    ></vue3-chart-js>
  </div>
</template>

<script>

import {inject, ref} from 'vue'
import TrainingStat from "../assets/js/TrainingStat.js";
import Vue3ChartJs from '@j-t-mcc/vue3-chartjs'
import zoomPlugin from 'chartjs-plugin-zoom'

Vue3ChartJs.registerGlobalPlugins([zoomPlugin])

export default {
  name: "Stat",
  components: {Vue3ChartJs},
  data() {
    return {
      trainingStat: null,
      infoType: 0,
      infoTime: 0,
      chart: null
    }
  },
  methods: {
    changeChartParams() {
      if (!this.trCollector)
        return;
      if (this.trCollector.collection.length !== this.trainingStat.infoCount)
        this.trainingStat = new TrainingStat(this.trCollector.collection, this.infoType, this.infoTime);

      let isSpeed = !!(this.infoType * 1),
          data = this.trainingStat.datasets(isSpeed, this.infoTime * 1)
      this.updateChart(data, isSpeed);
    }
  },
  mounted() {
    if (!this.trCollector)
      return;
    this.trainingStat = new TrainingStat(this.trCollector.collection, this.infoType, this.infoTime);
  },

  setup() {
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
