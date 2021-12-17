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
    },
    myFunctionKeys:{
      type: Array,
      required: false
    },
    myTestFunctions:{
      type: Function,
      required: false
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
        const finalOption = {
          ...this.$props.echartOption
        }

        if(finalOption?.toolbox?.feature){
          const selectedMyFunctions = {}

          for(const [key, values] of Object.entries(this.$props.myTestFunctions())){
            this.$props.myFunctionKeys.forEach(item=>{
              if(item.param === key){
                selectedMyFunctions[key] = {
                  ...item,
                  onclick: values
                }
              }
            })
          }

          finalOption.toolbox.feature = {
            ...finalOption.toolbox.feature,
            ...selectedMyFunctions
          }
        }

        this.chart.setOption(finalOption)

        /* default open toolbox Zoom function*/
        const toolboxDataZoomComponent = this.chart._componentsViews.find(c=>c._features && c._features.dataZoom) 
        if(toolboxDataZoomComponent){
          toolboxDataZoomComponent._features.dataZoom.model.iconPaths.zoom.trigger('click')
        }

        EleResize.on(targetResizeDiv, () => {
          this.chart.resize()
        })
        if(this.$props.hasDataZoom){
          this.chart.on('dataZoom', () => {
            this.getChartDateRange(this.chart)
          })
        }
    }, 0)
  },
  destroyed(){
    const targetResizeDiv = document.querySelector(`#chart-${this.$props.uniqueId}`)
    if(targetResizeDiv){
      EleResize.off(targetResizeDiv)
    }
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
      this.$emit('dataZoomTimeRange',{
          uniqueId: this.$props.uniqueId,
          instance: eChartInstance,
          ...result
      })
    }
  }
};
</script>
