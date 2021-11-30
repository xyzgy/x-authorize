import store from "../store";
import {
	uniNavigator
} from './uni_api'
import {
	login,
	wechatLogin,
	getUserInfo
} from '@/api/auth.js';
import storage from '@/utils/storage.js'
// #ifdef H5
import {
	wechatAuth,
	isWeixin
} from './wechat.js';
let _isWeixin = isWeixin();
import {
	WECHAT_LOGIN,
	PATH_LOGIN_URL
} from '@/config.js'
// #endif

// 自动去执行授权相关 获取对应信息
export function autoAuth() {
	store.commit("LOGOUT");
	const isAutoAuth = storage.get('IS_AUTO_AUTH') || false;
	if (isAutoAuth) {
		console.warn('逻辑中可能存在死循环,未成功调起授权，若已调起，请忽略');
		return
	} else {
		storage.set('IS_AUTO_AUTH', true);
	}
	// #ifdef H5
	if (_isWeixin && WECHAT_LOGIN) {
		// 微信公众号授权
		if (checkTokenStatus()) {
			console.log('微信公众号已授权')
			return false;
		}
		wechatAuth(location.href);
		console.log('当前为公众号环境', location.href)
	} else {

		console.log(PATH_LOGIN_URL)
		uniNavigator(PATH_LOGIN_URL)
	}
	// #endif
	// #ifdef  MP
	// 微信授权信息
	store.commit("SHOW_AUTH_POPUP_SHOW");
	console.log('当前为小程序环境')
	// #endif
}

// 登录 授权之后根据用户信息去登录
export function toLogin(data, callback) {
	storage.set('IS_AUTO_AUTH', false);
	const {
		type = ''
	} = data;
	login(data, type).then(res => {
		let data = res.data;
		const {
			token,
			expires_time
		} = data;
		store.commit("LOGIN", {
			token,
			expires_time
		});
		// #ifdef H5
		if (_isWeixin && WECHAT_LOGIN) {
			// 微信公众号授权
			console.log('公众号自动授权并登录获取信息成功')
			updateUserInfo().then(res => { //location会打断函数运行，导致UPDATE_USERINFO失败
				if (history.length > 2) {
					history.go(-2)
				} else {
					history.back()
				}
			});
		} else {
			console.log('H5登录获取信息成功，返回上一级')
			history.back()
		}
		// #endif
		// #ifdef  MP
		// 小程序授权信息
		if (data.cache_key) {
			storage.set('cache_key', data.cache_key)
		}
		setTimeout(() => {
			callback(data)
		}, 500)
		console.log('当前为小程序环境')
		// #endif

	}).catch(err => {
		console.log('login', err)
	})
}
export async function updateUserInfo() {
	let res = await getUserInfo();
	store.commit("UPDATE_USERINFO", res.data);
	return res
}

/**
 * 校验本地token等信息是否过期 
 **/
export function checkTokenStatus() {
	const {
		token,
		expires_time
	} = store.state;

	if (!!token && !!expires_time) {
		const nowTime = Date.parse(new Date()) / (String(expires_time).length === 13 ? 1 : 1000)
		if (nowTime < expires_time) {
			console.info('剩余有效期' + (expires_time - nowTime) + 'ms')
			return true
		} else {
			console.info('token已过期')
			return false
		}
	} else {
		console.info('未登录')
		return false;
	}
}
/**
 * 初始化
 **/
export function initLoginInfo(isAuto = false) {
	const storageToken = storage.get('token') || null,
		storageExpiresTime = storage.get('expires_time') || null;
	const nowTime = Date.parse(new Date()) / (String(storageExpiresTime).length === 13 ? 1 : 1000)
	const login = nowTime < storageExpiresTime && !!storageToken;
	if (login) {
		store.commit("LOGIN", {
			token: storageToken,
			expires_time: storageExpiresTime
		});
		updateUserInfo()
	} else {
		isAuto && autoAuth()
	}
	console.log(login)
	return login;
}
