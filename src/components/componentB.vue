<template>
  <div id="demoChart2" style="height:calc(100% - 20px);">
  </div>
</template>

<script>
import EleResize from '../../resize'
export default {
  name: "ComponentB",
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
            data: [820, 932, 901, 934, 1290, 1330, 1320],
            type: 'line',
            smooth: true
          }
        ]
      }
    }
  },
  mounted(){
    setTimeout(()=>{
        const targetResizeDiv = document.querySelector('#demoChart2')
        const chart = this.$echarts.init(targetResizeDiv)
        chart.setOption(this.option)
        EleResize.on(targetResizeDiv, () => {
          chart.resize()
        })

        chart.getZr().on('mousemove',(params)=>{
          let pointInPixel= [params.offsetX, params.offsetY];
          if (chart.containPixel('grid',pointInPixel)) {//若鼠标滑过区域位置在当前图表范围内 鼠标设置为move
            chart.getZr().setCursorStyle('move')
          }else{
            chart.getZr().setCursorStyle('default')
          }
        })
        chart.getZr().on('mouseup',()=>{
          chart.getZr().setCursorStyle('default')
        })
    }, 0)
  }
};
</script>