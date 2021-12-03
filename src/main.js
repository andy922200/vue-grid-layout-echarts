import Vue from "vue";
import App from "./App.vue";
import VueGridLayout from "vue-grid-layout";
import * as echarts from 'echarts'

Vue.prototype.$echarts = echarts
Vue.config.productionTip = false;
Vue.use(VueGridLayout);

new Vue({
  render: (h) => h(App)
}).$mount("#app");
