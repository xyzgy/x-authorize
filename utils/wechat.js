/**
OAuth JS接口安全域名 (63002,invalid signature)
redirect_uri 开发 - 接口权限 - 网页服务 - 网页帐号 - 网页授权获取用户基本信息”的配置选项中，修改授权回调域名 (redirect_uri 参数不合法)
 **/

import WechatJSSDK from "wechat-jssdk/dist/client.umd"; //WechatJSSDK(result)
import {
	getWechatConfig
} from '@/api/auth';
import {
	REDIRECT_URI
} from '@/config.js'


// 校验微信环境
export function isWeixin() {
	const userAgent = navigator.userAgent;
	return userAgent.toLowerCase().indexOf("micromessenger") !== -1;
}

const getOAuth = async () => {
	return new Promise((resolve, reject) => {
		getWechatConfig({
			url:location.href,
			debug:true
		}).then(res => {
			if(res.data.appId || res.appId){
				resolve(res.data || res)
			}else{
				 throw('参数格式错误，前往getOAuth方法修改返回参数')
			}
		}).catch(err=>{
			reject(err)
		})
	})
}
export const wechatEvent = async (name, info = {}) => {
	return new Promise((resolve, reject) => {
		getOAuth().then(res => {
			let wechatObj = WechatJSSDK(res);
			wechatObj.initialize()
				.then(w => {
					console.log('instance', w)
					let instance = w.wx;
					instance.ready(() => {
						const config = Object.assign({
								fail(err) {
									reject(err)
								},
								success(res) {
									resolve(res);
								},
								cancel(err) {
									reject(err);
								},
								complete(err) {
									reject(err);
								}
							}, info),
							isArray = Object.prototype.toString.call(name).slice(8,
								-1) === 'Array';
						if (isArray) {
							name.forEach(item => {
								instance[item] && instance[item](config)
							})
						} else {
							instance[name] && instance[name](config)
						}

					});
				})
				.catch(err => {
					console.error(err);
				});
		})

	});
}

// 微信分享
export const wechatShare = (config = {}) => {
	wechatEvent(['updateAppMessageShareData', 'updateTimelineShareData'], config)
}

// 微信地址
export const wechatAddress = () => {
	wechatEvent('openAddress')
}
//微信支付
export const wechatPay = () => {
	wechatEvent('chooseWXPay')
}

// 微信授权
export const wechatAuth = (url='http://192.168.3.10:8080/login') => {
	if (!url && !REDIRECT_URI) {
		 uni.showToast({
			title: 'redirect_uri未传递或配置',
			icon: 'error'
		})
		 throw new Error('config配置REDIRECT_URI或传递地址');
		 return
	}
	getOAuth().then(res => {
		const {
			appId
		} = res;
		const redirect_uri = encodeURIComponent(REDIRECT_URI);
		const state = encodeURIComponent(
			("" + Math.random()).split(".")[1] + "authorizestate"
		);
		const href =
			`https://open.weixin.qq.com/connect/oauth2/authorize?appid=${appId}&redirect_uri=${redirect_uri}&response_type=code&scope=snsapi_userinfo&state=${state}#wechat_redirect`;
		location.href = href;
	})
}
