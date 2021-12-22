import request from '@/utils/request.js';

// 获取微信相关配置
export function getWechatConfig(params) {
	return request.get('/wechat', {
		params
	}, {
		cancel: false
	});
}

/**
 * 用户登录
 * @param data object 用户账号密码
 */
export function login(data, login_type) {
	// 便于调试，授权时间60s
	return new Promise((resolve) => {
		resolve({
			data: {
				token: 'xyzgy',
				expires_time: Date.parse(new Date()) + 1000*10
			}
		})
	})
	// #ifdef H5
	if (login_type === 'wechat') {
		return request.get(
			"/wechat/auth", {
				data: data.code,
				login_type
			}, {
				login: false
			}
		);
	} else {
		return request.post("/login", data, {
			login: false
		});
	}
	// #endif
	// #ifdef MP-WEIXIN
	return request.post("/wechat/mp_auth", data, {
		login: false
	});
	// #endif
	// #ifdef MP-TOUTIAO
	return request.post("/bytedance/mp_auth", data, {
		login: false
	});
	// #endif
}

/*
 * 用户信息
 * */
export function getUserInfo() {
	return new Promise((resolve, reject) => {
		resolve({
			"uid": 1,
			"nickname": "xyzgy",
			"avatar": "https://thirdwx.qlogo.cn/mmopen/vi_32/Q0j4TwGTfTLTy1o6UcWj5XQMQEUq3JibibKnicuOMuKrDCVX9GRMibOH6UOOpJh1HotKr88j3pmgq7bjHo68lfa3VQ/132"
		})
	})
}