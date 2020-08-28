import request from "@/utils/request";

/**
 * 获取微信sdk配置
 * @returns {*}
 */
export function getWechatConfig() {
  return request.get(
    "/wechat/config",
    { url: document.location.href },
    { login: false }
  );
}
// 返回数据 格式
// {
//  status: 200
// 	data:{
		// debug: false
		// beta: false
		// appId: ""
		// nonceStr: "Mg2vR5w5hx"
		// timestamp: 1598516195
		// url: "https://shop.arthorize.com/h5/index"
		// signature: "137ad534d6858e66b60dd6dfde6807263c9f2bab"
		// jsApiList: ["editAddress", "openAddress", "updateTimelineShareData", "updateAppMessageShareData",…]
// 	}
// }




/**
 * 获取微信sdk配置
 * @returns {*}
 */
export function wechatAuth(code, spread, login_type) {
  return request.get(
    "/wechat/auth",
    { code, spread, login_type },
    { login: false }
  );
}

/**
 * 用户登录
 * @param data object 用户账号密码
 */
export function login(data) {
	// #ifdef H5
	return request.post("/login", data, {
		login: false
	});
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
// 返回数据格式 需包含expires_time 、 token
// {
//  status: 200
// 	data:{
// 		expires_time: 1598516195
// 		token: "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9"
// 	}
// }







/*
 * 用户信息
 * */
export function getUserInfo(data) {
	return request.get("/user", data, {
		login: true
	});
	// return request.get("/userinfo");
}