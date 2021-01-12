import unirequest from '../plugins/uni_request.js'
import store from "../store";
import {
	uniShowToast,
	successToast,
	loadingToast,
	uniHideToast,
	uniHideLoading,
	uniShowModal
} from './uni_api'
import {
	VUE_APP_URL
} from '../config.js'
import {
	autoAuth
} from '@/utils/common.js'
// 初始化自定义参数 login 是否需要登录权限  cancel 是否取消上次请求
const defaultOptions = {
	login: true,
	auth: false,
	cancel: false,
	loading: true, //是否显示 请求加载中
	warn: true //是否异常弹窗提示
};
// 初始化请求
let instance = unirequest.create({
	baseURL: VUE_APP_URL,
	timeout: 10000,
	debug: true
});
let setCancel;
// 请求拦截器
instance.interceptors.request.use(
	config => {
		const headers = config.header || {};
		headers["Authori-zation"] = "Bearer " + store.state.token;
		config.header = headers;
		config.cancelToken = new unirequest.CancelToken(function executor(c) {
			setCancel = c; //记录当前请求
		});
		return config
	})
// 响应拦截器
instance.interceptors.response.use(
	response => {
		// console.log('响应成功', response)
		return response
	})
// 请求主体
function baseRequest(config, options) {
	const {
		login,
		auth,
		cancel,
		loading = true,
		warn
	} = options;
	if (options.cancel) {
		cancelRequest()
	}
	loadingStatus(loading, true)
	if (login && !store.state.token) {
		autoAuth();
		return Promise.reject({
			msg: "未登录"
		});
	}
	return instance.request(config).then(res => {
		loadingStatus(loading, false)
		if (res.statusCode) {
			let data = res.data;
			if (res.statusCode === 200) {
				if (data.status == 200) {
					return Promise.resolve(data);
				} else {
					return Promise.reject(data.msg || '系统错误');
				}
				return Promise.resolve(res.data);
			} else {
				if (warn) {
					responseError({
						code: res.statusCode
					})
				}
				return Promise.reject(res.data);
			}
		} else {
			return Promise.reject(res.data);
		}
	}).catch(err => {
		loadingStatus(loading, false)
		uniShowToast(err)
		return Promise.reject(err);
	})
}

function cancelRequest() {
	if (typeof setCancel === 'function') {
		setCancel('取消请求')
	}
}
// 定义请求提示
const loadingStatus = (loading, type) => {
	if (loading) {
		if (type) {
			loadingToast('正在请求中');
		} else {
			uniHideLoading();
		}
	} else {
		return
	}
}
// 请求返回statusCode
const responseError = ({
	code
}) => {
	let content = '';
	switch (code) {
		case 400:
			content = '请求参数错误';
			break
		case 401:
			content = '未授权,请重新登录-401';
			break
		case 403:
			content = '没有访问权限-403';
			break
		case 404:
			content = '请求错误,未找到该资源-404';
			break
		case 405:
			content = '请求方式错误-405';
			break
		case 408:
			content = '请求超时';
			break
		case 500:
			content = '服务器异常-500';
			break
		case 501:
			content = '服务未实现';
			break
		case 502:
			content = '网关错误';
			break
		case 503:
			content = '服务不可用';
			break
		case 504:
			content = '网关超时';
			break
		case 505:
			content = 'HTTP版本不受支持';
			break
		default:
			content = '请求异常-' + code;
			break
	}
	uniShowModal('', content, {
		showCancel: false,
		success: (res) => {
			console.log(res)
		}
	})
}
const request = ['get', 'post', 'put', 'delete', 'connect', 'head', 'options', 'trace'].reduce((request, method) => {
	request[method] = (url, data, options = {}) => baseRequest({
		url,
		method,
		data
	}, { ...defaultOptions,
		...options
	});

	return request;
}, {});

export default request;
