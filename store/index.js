import Vue from 'vue'
import Vuex from 'vuex'
import storage from '@/utils/storage.js'
Vue.use(Vuex)

const store = new Vuex.Store({
	state: {
		token: null,
		userInfo: null,
		expires_time: null,
		isGOAuth: false, //是否已跳转至登录界面,防止路由重复注入
		authPopupShow: false, //x-authorize 弹窗是否显示
	},
	mutations: {
		LOGOUT(state) {
			state.token = null;
			state.expires_time = null;
			state.userInfo = {};
			state.authPopupShow = false;
				// #ifdef H5
			state.isGOAuth = false;
			// #endif
			storage.remove('token')
			storage.remove('expires_time')
		},
		LOGIN(state, {
			token,
			expires_time
		}) {
			state.token = token;
			state.expires_time = expires_time;
			storage.set('token', token)
			storage.set('expires_time', expires_time)
		},
		// #ifdef H5
				SET_GO_AUTH(state, self) {
					state.isGOAuth = self;
				},
				// #endif

		UPDATE_USERINFO(state, userInfo) {
			state.userInfo = userInfo;
			storage.set('userInfo', userInfo)
		},

		SHOW_AUTH_POPUP_SHOW(state) {
			state.authPopupShow = true;
		},
		HIDE_AUTH_POPUP_SHOW(state) {
			state.authPopupShow = false;
		},
	},
	actions: {

	},
	getters: {
		token: state => state.token,
		isLogin: state => !!state.token,
		userInfo: state => state.userInfo || {},
		expires_time: state => state.expires_time,
		authPopupShow: state => state.authPopupShow
	}
})

export default store
