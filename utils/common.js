import store from "../store";
import {
	uniNavigator
} from './uni_api'
import { autoAuth,checkTokenStatus } from '@/utils/login.js';

// 跳转前需要授权验证的
export function authNavigator(url, type = 'navigateTo', args = {}) {
	console.log('是否登录',checkTokenStatus())
	if (checkTokenStatus()) {
		uniNavigator(url, type, args = {})
	} else {
		autoAuth()
	}
}

export function updateTitle(title) {
	uni.setNavigationBarTitle({
		title: title
	});
}

export function throttle(fn, time, obj = {
	leading: true,
	trailing: false
}) {
	let prevTime = 0,
		_this = this,
		timId;
	// 第三个参数生效
	return function() {
		let nowTime = new Date().getTime();
		if (obj.leading === false && !prevTime) {
			// 禁用第一次执行
			prevTime = nowTime;
		}
		if (nowTime - prevTime > time) {
			if (timId) {
				clearTimeout(timId);
				timId = null;
			}
			fn.apply(this, arguments);
			prevTime = nowTime;
		} else if (!timId && obj.trailing) {
			timId = setTimeout(() => {
				prevTime = new Date().getTime();
				timId = null;
				fn.apply(_this, arguments);
			}, time);
		}
	};
}
// 函数防抖 延迟函数执行，并且不管触发多少次都只执行最后一次
export function debounce(fn, time = 500,immediate) {
	let timId, result;
	let debFun = function() {
		let _this = this;
		timId && clearTimeout(timId);
		if (immediate) {
			// 立即执行
			let isImmediate = !timId;
			timId = setTimeout(() => {
				timId = null;
			}, time);
			if (isImmediate) {
				result = fn.apply(_this, arguments);
			}
		} else {
			timId = setTimeout(() => {
				fn.apply(_this, arguments);
			}, time);
		}
	
		return result;
	};
	// 取消防抖函数执行
	debFun.cancel = function() {
		clearTimeout(timId);
		timId = null;
	};
	return debFun;
}

// 保存图片至本地
export function saveImageToPhotosAlbum(path, filename, callback) {
	// #ifdef H5
	var xhr = window.XMLHttpRequest ?
		new XMLHttpRequest() :
		new ActiveXObject("Microsoft.XMLHTTP");
	xhr.open("get", path, true);
	//监听进度事件
	xhr.addEventListener(
		"progress",
		function(evt) {
			console.log(evt)
			if (evt.lengthComputable) {
				var percentComplete = evt.loaded / evt.total;
				if (percentComplete === 1) {
					callback && callback(true)
				}
			}
		},
		true
	);
	xhr.responseType = "blob";
	xhr.onreadystatechange = function() {
		if (xhr.readyState === 4 && xhr.status === 200) {
			// loading.close();
			const linkHtml = document.createElement("a");
			// linkHtml.href = response.path;
			linkHtml.href = window.URL.createObjectURL(xhr.response);
			linkHtml.download = filename;
			linkHtml.click();
			// notify.close()
			// _this.$showElSuccessMessage("下载完成");
		}
	};
	xhr.onerror = function() {
		callback && callback(false)
	};
	xhr.send();

	// #endif

	// #ifdef MP
	uni.saveImageToPhotosAlbum({
		filePath: path,
		success: function() {
			callback && callback(true)
		},
		fail() {
			callback && callback(false)
		}
	});
	// #endif
}

// 设置剪切板内容 复制
export function setClipboardData(val) {
	return new Promise((resolve, reject) => {
		// #ifdef MP
		uni.setClipboardData({
			data: val,
			success: function(res) {
				uni.showToast({
					title: '复制成功'
				})
				resolve(true)
			},
			fail() {
				uni.showToast({
					title: '复制失败'
				})
				reject(false)
			}
		});
		// #endif
		// #ifdef H5
		if (!document.queryCommandSupported('copy')) { //为了兼容有些浏览器 queryCommandSupported 的判断
			// 不支持
			uni.showToast({
				title: '浏览器不支持'
			})
		}
		let textarea = document.createElement("textarea")
		textarea.value = val
		textarea.readOnly = "readOnly"
		document.body.appendChild(textarea)
		textarea.select() // 选择对象
		textarea.setSelectionRange(0, val.length) //核心
		let result = document.execCommand("copy") // 执行浏览器复制命令
		if (result) {
			uni.showToast({
				title: '复制成功'
			})
			resolve(true)
		} else {
			uni.showToast({
				title: '复制失败'
			})
			reject(false)
		}

		textarea.remove()
		// #endif
	})
}
// 获取剪切板内容 粘贴
export function getClipboardData() {
	return new Promise((resolve, reject) => {
		uni.getClipboardData({
			success: function(res) {
				resolve(res.data)
			}
		});
	})
}

