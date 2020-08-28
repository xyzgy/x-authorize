// 对uni中的交互反馈相关api组件进行封装  showToast、showModal
export function uniShowToast(title = '提示语', icon = "none", args = {}) {
	const {
		image = '',
			mask = false,
			duration = 1500,
			position,
			success, fail, complete
	} = args;
	let toast = {
		title,
		icon,
		duration
	};
	// #ifdef APP-PLUS || H5 || MP-WEIXIN || MP-BAIDU
	if (image) {
		toast['image'] = image
	}
	// #endif
	// #ifdef H5 || MP-WEIXIN 
	if (mask) {
		toast['mask'] = mask
	}
	// #endif
	// #ifdef APP-PLUS
	if (position) {
		toast["position"] = position
	}
	// #endif
	uni.showToast({ ...toast,
		...callBack(toast, {
			success,
			fail,
			complete
		})
	})
}
export function uniHideToast() {
	uni.hideToast()
}
export function uniHideLoading() {
	uni.hideLoading()
}
export function successToast(title = '成功', args = {}) {
	uniShowToast(title, "success", args)
}
export function loadingToast(title = '加载中', args = {}) {
	const {
		mask = false,
			success, fail, complete
	} = args;
	let loading = {
		title
	};
	if (mask) {
		loading['mask'] = mask
	}
	uni.showLoading({
		...loading,
		...callBack(loading, {
			success,
			fail,
			complete
		})
	});
}


export function uniShowModal(title, content, args = {}) {
	const {
		showCancel = true, cancelText = "取消", cancelColor, confirmText = "确定", confirmColor, success, fail, complete
	} = args;
	let modal = {
		title,
		content,
		showCancel,
		cancelText,
		confirmText
	}
	// #ifdef H5 || MP-WEIXIN || MP-BAIDU
	if (cancelColor) {
		modal['cancelColor'] = cancelColor
	}
	if (confirmColor) {
		modal['confirmColor'] = confirmColor
	}
	// #endif
	uni.showModal({ ...modal,
		...callBack(modal, {
			success,
			fail,
			complete
		})
	})
}

export function uniNavigator(url, type = 'navigateTo', args = {}) {
	type = Number(url) ? 'navigateBack' : (type || 'navigateTo');
	const {
		endtime = Number(url) ? 600 : 200,
			animationType,
			animationDuration,
			success,
			fail,
			complete
	} = args;

	let obj = {
		url
	};
	// #ifdef APP-PLUS
	if (animationType) {
		obj['animationType'] = animationType
	}
	if (animationDuration) {
		obj['animationDuration'] = animationDuration
	}
	// #endif
	obj = callBack(obj, {
		success,
		fail,
		complete
	})
	console.log(obj)

	switch (type) {
		case 'navigateTo':
			setTimeout(function() {
				uni.navigateTo(obj)
			}, endtime);
			break;
		case 'redirectTo':
			setTimeout(function() {
				uni.redirectTo(obj)
			}, endtime);
			break;
		case 'reLaunch':
			setTimeout(function() {
				uni.reLaunch(obj)
			}, endtime);
			break;
		case 'switchTab':
			setTimeout(function() {
				uni.switchTab(obj)
			}, endtime);
			break;
		case 'navigateBack':
			setTimeout(function() {
				const history = getCurrentPages();
				if (history.length > 1) {
					uni.navigateBack({
						delta: Number(url)
					})
				} else {
					uni.switchTab({
						url: '/pages/index/index'
					})
				}
			}, endtime);
			break;

	}
}


export function uniStartPullDownRefresh(args = {}) {
	uni.startPullDownRefresh(args);
}

export function uniStopPullDownRefresh(endtime = 1000) {
	setTimeout(function() {
		uni.stopPullDownRefresh();
	}, endtime);


}

// 获取图片信息
export function uniGetImageInfo(path) {
	return new Promise((resolve, reject) => {
		uni.getImageInfo({
			src: path,
			success: function(res) {
				console.log(res)
				resolve(res)
			},
			fail: function(err) {
				console.log(err)
				reject(err)
			},
		})
	})

}

// 获取节点信息
export function uniSelectorQueryInfo(selector, _this) {
	return new Promise((resolve, reject) => {
		const query = uni.createSelectorQuery().in(_this);
		query.select(selector).boundingClientRect(res => {
			// 获取节点坐标
			resolve(res)
		}).exec();
	})

}

// 设置导航栏颜色
export function uniSetNavigationBarColor(backgroundColor = "#e93323", frontColor = "#ffffff") {
	uni.setNavigationBarColor({
		frontColor,
		backgroundColor,
		animation: {
			duration: 400,
			timingFunc: 'easeIn'
		}
	})
}


// 跳转小程序
export function uniNavigateToMiniProgram(appId, args = {}) {
	// #ifdef MP
	const {
		path,
		extraData = {
			from: '跳转小程序要携带的信息'
		},
		envVersion,
		success,
		fail,
		complete
	} = args;
	let obj = {
		path,
		extraData,
		envVersion
	}
	obj = callBack(obj, {
		success,
		fail,
		complete
	})
	uni.navigateToMiniProgram({
		appId: '',
		...obj
	})
	// #endif

}
// 返回上一个小程序
export function uniNavigateBackMiniProgram(args = {}) {
	// #ifdef MP
	const {
		extraData = {
				from: '返回上一个小程序要携带的信息'
			},
			success,
			fail,
			complete
	} = args;

	let obj = {
		extraData
	}
	obj = callBack(obj, {
		success,
		fail,
		complete
	})
	uni.navigateBackMiniProgram({
		...obj
	})
	// #endif
}

function callBack(name = {}, options = {}) {
	const {
		success,
		fail,
		complete
	} = options;
	if (success) {
		name['success'] = (res) => {
			success(res)
		}
	}
	if (fail) {
		name['fail'] = (err) => {
			fail(err)
		}
	}
	if (complete) {
		name['complete'] = (res) => {
			complete(res)
		}
	}
	return name
}
