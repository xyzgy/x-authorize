import store from "../store";
import {
	uniNavigator
} from './uni_api'

import {
	login,
	getUserInfo,
	wechatAuth
} from '@/api/public.js';

import storage from '@/utils/storage.js'
// #ifdef H5
import {
	isWeixin
} from "./validate.js";
let _isWeixin = isWeixin();
import {
	toAuth
} from './wechat/auth.js';
import {
	WECHAT_LOGIN,
	WECHAT_AUTH_BACK_URL
} from '@/config.js'
// #endif
// 自动去执行授权登录
export function autoAuth() {
	store.commit("LOGOUT");
	// #ifdef H5
	if (_isWeixin && WECHAT_LOGIN) {
		// 微信公众号授权
		if (checkLogin()) {
			console.log('微信公众号已授权')
			return false;
		}
		storage.set(WECHAT_AUTH_BACK_URL, location.href)
		// 公众号授权测试
		// let expires_time = 1598223013000,
		// token = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJzaG9wLmFydGhvcml6ZS5jb20iLCJhdWQiOiJzaG9wLmFydGhvcml6ZS5jb20iLCJpYXQiOjE1OTgyMzk2MjksIm5iZiI6MTU5ODIzOTYyOSwiZXhwIjoxNTk4MjUwNDI5LCJqdGkiOnsiaWQiOjIsInR5cGUiOiJ3ZWNoYXQifX0.lPJ0Ocn6SO3RplMkpk1Z3QQ4z_Z6oWMEwl1ACCg1exQ';	
		// updateToken(token, expires_time);
		// return;

		toAuth();
		console.log('当前为公众号环境', location.href)
	} else {
		console.log('当前为H5环境')
		if (!store.state.isGOAuth) {
			store.commit("SET_GO_AUTH", true);
			uniNavigator('/pages/login/login')
		} else {
			console.log('路由已存在，不再重复跳转')
		}

	}
	// #endif
	// #ifdef  MP
	// 微信授权信息
	store.commit("SHOW_AUTH_POPUP_SHOW");
	console.log('当前为小程序环境')
	// #endif
}

// 登录 授权之后执行
export function toLogin(data, callback) {
	const {
		type
	} = data;
	let request = '';
	if (type === 'wechat') {
		let url = storage.get(WECHAT_AUTH_BACK_URL) || 'pages/index/index',
			spid = store.state.spid;
		request = wechatAuth(data.code, spid, 'wechat')
	} else {		
		request = login(data);
	}
	request.then(res => {
		let data = res.data;
		let token = data.token,
			expires_time = 1593591798; // store.state.expires_time || 1593522851;
		// #ifdef H5
		expires_time = data.expires_time.substring(0, 19);
		expires_time = expires_time.replace(/-/g, "/");
		expires_time = new Date(expires_time).getTime() - 28800000;

		updateToken(token, expires_time, data)
		if (_isWeixin && WECHAT_LOGIN) {
			// 微信公众号授权
			console.log('公众号自动授权并登录获取信息成功，之后返回首页')
			getuserInfo().then(res=>{
				location.href = data.url || '/'
			});
		} else {
			console.log('H5登录获取信息成功，返回上一级', expires_time)
			uniNavigator(1, "navigateBack")
		}
		// #endif
		// #ifdef  MP
		// 小程序授权信息
		expires_time = data.expires_time;
		if (data.cache_key) {
			storage.set('cache_key', data.cache_key)
		}
		updateToken(token, expires_time, data)
		setTimeout(() => {
			callback(data)
		}, 500)
		console.log('当前为小程序环境')
		// #endif

	}).catch(err => {
		console.log('login', err)
	})
}
// 跳转前需要授权验证的
export function authNavigator(url, type = 'navigateTo', args = {}) {
	console.log('是否登录', checkLogin())
	if (checkLogin()) {
		uniNavigator(url, type, args = {})
	} else {
		autoAuth()
	}
}


export function updateToken(token, expires_time, data) {
	console.log('updateToken', token)
	console.log('updateTokenexpires_time', expires_time)
	store.commit("LOGIN", {
		token,
		expires_time
	});
	getuserInfo()
}

export async function getuserInfo() {
	let res = await getUserInfo();
	console.log('updateUPDATE_USERINFO', res.data)
	store.commit("UPDATE_USERINFO", res.data);
	return res
}



export function checkLogin() {
	let token = store.state.token;
	let expires_time = store.state.expires_time;
	if (token) {
		let newTime = Math.round(new Date() / 1000);
		console.log('xxxxxxx', expires_time, newTime, )
		let login = !(expires_time < newTime);
		if(!login){
			console.log('xxxxxxxxxxxxxx已过期')
			updateToken(null, null, {}) 
		}
		return login;
	} else {
		return false;
	}
}

export function updateTitle(title) {
	uni.setNavigationBarTitle({
		title: title
	});
}
