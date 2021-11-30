import Vue from 'vue'
import App from './App'

// 路由

import uView from "uview-ui";
Vue.use(uView);

Vue.config.productionTip = false

import {
	uniShowToast,
	successToast,
	loadingToast,
	uniHideToast,
	uniShowModal,
	uniNavigator,
	uniStartPullDownRefresh,
	uniStopPullDownRefresh,
	uniSetNavigationBarColor
} from './utils/uni_api'
import storage from './utils/storage.js'
import store from './store'

import Authorize from '@/components/x-authorize/x-authorize.vue'
import {updateTitle,authNavigator} from './utils/common.js'

Vue.prototype.$showToast = uniShowToast;
Vue.prototype.$successToast = successToast;
Vue.prototype.$loadingToast = loadingToast;
Vue.prototype.$hideToast = uniHideToast;
Vue.prototype.$showModal = uniShowModal;
Vue.prototype.$navigator = uniNavigator;
Vue.prototype.$authNavigator = authNavigator;
Vue.prototype.$startPullRefresh = uniStartPullDownRefresh;
Vue.prototype.$stopPullRefresh = uniStopPullDownRefresh;
Vue.prototype.$updateTitle = updateTitle;
Vue.prototype.$setNavigationBarColor = uniSetNavigationBarColor;
Vue.prototype.$store = store;
Vue.prototype.$storage = storage;

Vue.component('x-authorize', Authorize)

App.mpType = 'app'

const app = new Vue({
	...App
})

app.$mount();
