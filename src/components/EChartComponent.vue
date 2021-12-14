<template>
  <div :id="`chart-${uniqueId}`" :style="{zIndex: editMode ? -1 : 1}" style="height:calc(100% - 24px);">
  </div>
</template>

<script>
import EleResize from '../../resize'

export default {
  name: "EChart-Component",
  props:{
    editMode:{
      type:Boolean,
      required: false,
      default: false
    },
    uniqueId:{
      type: String,
      required: true
    },
    echartOption:{
      type: Object,
      required: true,
      default: function(){
        return {}
      }
    },
    hasDataZoom:{
      type: Boolean,
      required: false,
      default: false
    }
  },
  data(){
    return {
      chart: null
    }
  },
  mounted(){
    setTimeout(()=>{
        const targetResizeDiv = document.querySelector(`#chart-${this.$props.uniqueId}`)
        this.chart = this.$echarts.init(targetResizeDiv)
        this.chart.setOption(this.$props.echartOption)
        EleResize.on(targetResizeDiv, () => {
          this.chart.resize()
        })
        if(this.$props.hasDataZoom){
          this.chart.on('datazoom', this.getChartDateRange(this.chart))
        }
    }, 0)
  },
  destroyed(){
    const targetResizeDiv = document.querySelector(`#chart-${this.$props.uniqueId}`)
    EleResize.off(targetResizeDiv)
    if(this.chart){
      this.chart.dispose()
    }
  },
  methods:{
    getChartDateRange: function(eChartInstance){
      const option = eChartInstance.getOption().dataZoom[0]
      const m = (option.endValue - option.startValue) / (option.end - option.start)
      const fullStartTimestamp = m * (0 - option.start) + option.startValue
      const fullEndTimestamp = m * (100 - option.start) + option.startValue
      const result = {
        fullStart: 0,
        fullEnd: 100,
        fullStartTimestamp,
        fullEndTimestamp,
        fullStartTime: new Date(fullStartTimestamp).toISOString().slice(),
        fullEndTime: new Date(fullEndTimestamp).toISOString().slice(),
        zoomStart: option.start,
        zoomEnd: option.end,
        zoomStartTimestamp: option.startValue,
        zoomStartTime: new Date(option.startValue).toISOString().slice(),
        zoomEndTimestamp: option.endValue,
        zoomEndTime: new Date(option.endValue).toISOString().slice(),
      }
      return result
    }
  }
};
</script>
