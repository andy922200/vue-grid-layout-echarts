<template>
  <!-- Core Demo Start-->
  <div class="vue-grid-outside-wrapper">
    <div class="vue-grid-inside-wrapper">
      <template v-if="Array.isArray(layout) && layout.length > 0">
        <grid-layout
          :layout.sync="layout"
          :col-num="2"
          :row-height="100"
          :margin="[10, 10]"
          :is-draggable="draggable"
          :is-resizable="resizable"
          :responsive="responsive"
          :vertical-compact="true"
          :use-css-transforms="true"
          @breakpoint-changed="breakpointChangedEvent"
        >
          <grid-item
            v-for="item in layout"
            :key="`Box${item.i}`"
            :static="item.static"
            :x="item.x"
            :y="item.y"
            :w="item.w"
            :h="item.h"
            :i="item.i"
            :minW="4"
            :minH="2"
            @move="movedEvent"
            @resize="resizedEvent"
            drag-allow-from=".vue-draggable-handle"
            drag-ignore-from=".no-drag"
            :class="item.editMode ? 'activate-resizable-handle' : 'deactivate-resizable-handle'"
          >
            <div class="vue-draggable-handle" v-show="item.editMode"></div>
            <div class="no-drag">
              <span class="no-drag__title">{{ item.i }}</span>
              <input type="checkbox" :name="`edit${item.i}`" :id="`edit${item.i}`" v-model="item.editMode" hidden>
              <label class="edit-icon" :for="`edit${item.i}`">
                <img v-if="!item.editMode" class="edit-icon-image" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAAABmJLR0QA/wD/AP+gvaeTAAAAhElEQVRIie2TwQnAIAxF35Klh3YBdxDqPh3HQdq7gj00ooi3xkvxQ0BzeD8JfJh6ZYEbWEfAHZCkIrCPgAfgrN4qm9STG+llk0sTngAvJkH+VgMeBOobM6cFz3c22vAIbNJbKGc5JnzCfwCHEpgcorWCfwpRawDKk7cGdanBewaq8KmuHlYrZbGe+TNUAAAAAElFTkSuQmCC"/>
                <img v-else class="edit-icon-image" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAAABmJLR0QA/wD/AP+gvaeTAAAAbElEQVRIie2SQQ6AIAwE5xMSfSI8Vw4+Rw9q0oBIFGo8dK7AFJYFw3iIA7ymPAIrEHrLB2A+5Aswmvzfcs/eiBKyLbGyNyNUDjbJIX/6dLP2OvOrId0/NI2iKZYS8tYqVZRDVOQnjo6xGN+zAavMMBC6bhegAAAAAElFTkSuQmCC"/>
              </label>
              <component 
                :is="'EChartComponent'" 
                :uniqueId="item.i"
                :echartOption="item.option"
                :hasDataZoom="item.hasDataZoom" 
                :editMode="item.editMode"
                @dataZoomTimeRange="getDataZoomTimeRange"
              ></component>
            </div>
          </grid-item>
        </grid-layout>
      </template>
    </div>
  </div>
  <!-- Core Demo End-->
</template>

<script>
import { GridLayout, GridItem } from "vue-grid-layout";
import { debounce } from 'lodash-es'
import EChartComponent from "./EChartComponent.vue"

export default {
  components: {
    GridLayout,
    GridItem,
    EChartComponent
  },
  data() {
    return {
      layout: [],
      draggable: true,
      resizable: true,
      responsive: true,
      index: 0,
    };
  },
  mounted(){
    this.layout = [
      { 
        x: 0, 
        y: 0, 
        w: 4, 
        h: 3, 
        i: "A",
        editMode: false,
        hasDataZoom: false,
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
      },
      { 
        x: 4, 
        y: 0, 
        w: 4, 
        h: 3, 
        i: "B",
        editMode: false,
        hasDataZoom: true, 
        option:{
          tooltip: {
            trigger: 'axis',
            position: function (pt) {
              return [pt[0], '10%'];
            }
          },
          title: {
            left: 'center',
            text: 'Large Ara Chart'
          },
          toolbox: {
            feature: {
              dataZoom: {
                title:{
                  zoom: '縮放',
                  back: '還原'
                },
                yAxisIndex: 'none'
              },
              saveAsImage: {
                title: '下載'
              },
              myTest:{
                show: true,
                title: 'myTest',
                icon: 'image://http://echarts.baidu.com/images/favicon.png',
                onclick: function(){
                  let funcString = "("
                  funcString += `
                    function(param){
                      const instance = param.scheduler.ecInstance;
                      console.log(instance)
                      const oriOption = instance.getOption();
                      oriOption.series[0].data = function(){
                        let base = +new Date(1991, 0, 1);
                        let oneDay = 24 * 3600 * 1000;
                        let data = [
                          [base, Math.random() * 300]
                        ]
                        for (let i = 1; i < 1000; i++) {
                          let now = new Date((base += oneDay));
                          data.push([+now, Math.round((Math.random() - 0.5) * 20 + data[i - 1][1])]);
                        }
                        return data
                      }();
                      instance.setOption(oriOption);
                    }
                  `
                  funcString += ")"
                  return funcString
                }()
              }
            },
            right:"3%"
          },
          xAxis: {
            type: 'time',
            boundaryGap: false
          },
          yAxis: {
            type: 'value',
            boundaryGap: [0, '100%']
          },
          dataZoom: [
            {
              type: 'slider',
              start: 25,
              end: 50,
              showDetail: false
            }
          ],
          series: [
            {
              name: 'Fake Data',
              type: 'line',
              smooth: true,
              symbol: 'none',
              areaStyle: {},
              data: function(){
                let base = +new Date(2021, 0, 1);
                let oneDay = 24 * 3600 * 1000;
                let data = [
                  [base, Math.random() * 300]
                ]
                for (let i = 1; i < 1000; i++) {
                  let now = new Date((base += oneDay));
                  data.push([+now, Math.round((Math.random() - 0.5) * 20 + data[i - 1][1])]);
                }
                return data
              }()
            }
          ]
        }
      },
      { 
        x: 8, 
        y: 0, 
        w: 4, 
        h: 3, 
        i: "C",
        editMode: false,
        option:{}
      }
    ]
  },
  methods:{
    movedEvent: debounce(function(i, newX, newY){
        console.log("MOVED i=" + i + ", X=" + newX + ", Y=" + newY);
    }, 1000),
    resizedEvent: debounce(function(i, newH, newW, newHPx, newWPx){
        console.log("RESIZED i=" + i + ", H=" + newH + ", W=" + newW + ", H(px)=" + newHPx + ", W(px)=" + newWPx);
    }, 1000),
    breakpointChangedEvent: function (newBreakpoint, newLayout) {
        /* disable editMode while 'vue-grid-layout' breakpoint changes */
        newLayout.forEach(item => {
            if (this.layout.findIndex(oriItem => oriItem.i === item.i) > -1) {
                item.editMode = false
            }
        })
    },
    getDataZoomTimeRange(data){
      console.log('data', data)
    }
  }
};
</script>

<style>
.vue-grid-outside-wrapper{
  width: calc(100% - 2rem); 
  height: 100%;
  margin: 0 1rem;
}

.vue-grid-inside-wrapper{
  width: 100%; 
  height: 100%; 
  touch-action:none;
}

.vue-grid-layout {
  background: #FFF;
}

.vue-grid-item{
  box-sizing: border-box;
}

.vue-grid-item:not(.vue-grid-placeholder) {
  border: 1px solid black;
}

.vue-grid-inside-wrapper .vue-grid-placeholder {
  background: green !important;
}

.vue-draggable-handle {
    position: absolute;
    width: 16px;
    height: 16px;
    top: 0;
    right: 0;
    margin: 4px;
    padding: 0 8px 8px 0;
    background-origin: content-box;
    background-color: black;
    box-sizing: border-box;
    border-radius: 10px;
    cursor: move;
    z-index: 3;
}

.vue-grid-item .no-drag {
    height: 100%;
    width: 100%;
}

.vue-grid-item .no-drag .no-drag__title{
  display: inline-block;
  height:24px;
  line-height: 24px;
}

.vue-grid-item.deactivate-resizable-handle span[class="vue-resizable-handle"]{
  display:none;
}

.vue-grid-item.activate-resizable-handle span[class="vue-resizable-handle"]{
  z-index:2;
}

.edit-icon{
  position: absolute;
  display: inline-block;
  padding: 0px;
  height: 16px;
  margin: 4px;
  top: 0;
  right: 24px;
}

.edit-icon .edit-icon-image{
  width: 1rem;
  height: 1rem;
  cursor: pointer;
}
</style>
