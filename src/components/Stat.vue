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
            <input class="form-check-input" type="radio" v-model="infoTime" value="day" id="rDay"
                   @change="changeChartParams">
            <label class="form-check-label" for="rDay">По дням</label>
          </div>
          <div class="form-check form-check-inline">
            <input class="form-check-input" type="radio" v-model="infoTime" value="week" id="rWeek"
                   @change="changeChartParams">
            <label class="form-check-label" for="rWeek">По неделям</label>
          </div>
          <div class="form-check form-check-inline">
            <input class="form-check-input" type="radio" v-model="infoTime" value="month" id="rMon"
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

import {ref} from 'vue'
import Vue3ChartJs from '@j-t-mcc/vue3-chartjs'
import zoomPlugin from 'chartjs-plugin-zoom'

Vue3ChartJs.registerGlobalPlugins([zoomPlugin])

export default {
  name: "Stat",
  components: {Vue3ChartJs},
  data() {
    return {
      infoType: 0,
      infoTime: 'day'
    }
  },
  methods: {
    changeChartParams() {
      this.updateChart(this.$getStatData(this.infoTime, this.infoType == 1), this.infoType == 1);
    }
  },
  mounted() {
    this.changeChartParams();
  },

  setup() {
    const chartRef = ref(null)
    const chart = {
      type: 'bar',
      id: 'statistic',
      data: {
        labels: [],
        datasets: []
      },

      options: {
        plugins: {
          legend: {
            labels: {
              font: {
                size: 15
              }
            }
          },
          title: {
            display: true,
            text: '',
            font: {
              size: 23
            }
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

      chartRef.value.update(250)
    }

    return {
      chart,
      updateChart,
      chartRef
    }
  }
}
</script>
