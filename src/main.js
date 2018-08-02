// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import axios from 'axios'
import YDUI from 'vue-ydui'
/* 相当于import YDUI from 'vue-ydui/ydui.rem.js' */
import 'vue-ydui/dist/ydui.rem.css'
import District from 'ydui-district/dist/gov_province_city_area_id';

import 'mint-ui/lib/style.css'
import {Loadmore, IndexList, IndexSection,Cell } from 'mint-ui';


Vue.component('mt-index-list', IndexList);
Vue.component('mt-index-section', IndexSection);
Vue.component('mt-cell', Cell);


Vue.component('v-loadmore', Loadmore);

import {utils,wxutils} from '../static/js/utils'


Vue.use(YDUI, axios, District);
/*Vue.use(require('vue-wechat-title'));*/

Vue.config.productionTip = false;
Vue.config.devtools = true;
Vue.prototype.utils=utils;
Vue.prototype.wxutils=wxutils;

Vue.directive('focus', {
  // 当被绑定的元素插入到 DOM 中时……
  inserted: function (el) {
    // 聚焦元素
    el.focus()
  }
})

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: {App},
  template: '<App/>',
  render: h => h(App)
}).$mount('#app');







