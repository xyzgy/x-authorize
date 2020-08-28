// 校验是否是手机端
export function isMobile() {
	const userAgent = navigator.userAgent;
	return userAgent.match(
		/(phone|pad|pod|iPhone|iPod|ios|iPad|Android|Mobile|BlackBerry|IEMobile|MQQBrowser|JUC|Fennec|wOSBrowser|BrowserNG|WebOS|Symbian|Windows Phone)/i
	);
}
// 校验微信环境
export function isWeixin() {
	const userAgent = navigator.userAgent;
	return userAgent.toLowerCase().indexOf("micromessenger") !== -1;
}

// 手机号码校验
export function RegPhone(val) {
	let reg = /^1[3|4|5|7|8][0-9]\d{8}$/;
	return reg.test(val);
}