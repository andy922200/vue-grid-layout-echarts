<template>
  <div id="demoChart" style="height:calc(100% - 20px);">
  </div>
</template>

<script>
import EleResize from '../../resize'
export default {
  name: "ComponentA",
  data(){
    return {
      option:{
        xAxis: {
          type: 'category',
          data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
        },
        yAxis: {
          type: 'value'
        },
        series: [
          {
            data: [150, 230, 224, 218, 135, 147, 260],
            type: 'line'
          }
        ]
      }
    }
  },
  mounted(){
    setTimeout(()=>{
        const targetResizeDiv = document.querySelector('#demoChart')
        const chart = this.$echarts.init(targetResizeDiv)
        chart.setOption(this.option)
        EleResize.on(targetResizeDiv, () => {
          chart.resize()
        })
    }, 0)
  }
};
</script>
