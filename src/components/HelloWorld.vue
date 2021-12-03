<template>
  <div style="width: 100%; height: 500px">
    <hr />
    <div style="width: 100%; margin-top: 10px; height: 100%">
      <grid-layout
        :layout.sync="layout"
        :col-num="2"
        :row-height="20"
        :is-draggable="draggable"
        :is-resizable="resizable"
        :responsive="responsive"
        :vertical-compact="true"
        :use-css-transforms="true"
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
        >
          <span class="text">{{ item.i }}</span>
          <component :is="`component${item.i}`"></component>
        </grid-item>
      </grid-layout>
    </div>
  </div>
</template>

<script>
import { GridLayout, GridItem } from "vue-grid-layout";
import componentA from "./componentA.vue"
import componentB from "./componentB.vue"
import componentC from "./componentC.vue"

export default {
  components: {
    GridLayout,
    GridItem,
    componentA,
    componentB,
    componentC
  },
  data() {
    return {
      layout: [
        { x: 0, y: 0, w: 1, h: 3, i: "A" },
        { x: 1, y: 0, w: 1, h: 3, i: "B" },
        { x: 0, y: 1, w: 2, h: 3, i: "C" },
      ],
      draggable: true,
      resizable: true,
      responsive: true,
      index: 0,
    };
  }
};
</script>

<style scoped>
.vue-grid-layout {
  background: #eee;
}
.vue-grid-item{
  box-sizing: border-box;
}
.vue-grid-item:not(.vue-grid-placeholder) {
  background: #ccc;
  border: 1px solid black;
}
.vue-grid-item .static {
  background: #cce;
}
</style>
