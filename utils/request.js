import Request from 'luch-request'
import store from "../store";
import {
	autoAuth,
	checkTokenStatus
} from '@/utils/login.js'
import {
	VUE_APP_API_URL,
	REQUEST_REPEAT_CANCEL
} from '../config.js'
const pending = new Map();
const addPending = (url,task) => {
	pending.set(url, task)
}
const delPending = (url) => {
	pending.delete(url)
}
const clearPending = () => {
	pending.clear()
}
const getUrlParams = (config) => {
	const {
		baseURL = '', url = '', data = {}, params = {}
	} = config;
	const pages = getCurrentPages(),
		page = (pages[pages.length - 1]).route;
	const str = uni.$u.queryParams({
		...data,
		...params
	});
	return `${page}-${baseURL}${url}${str}`
}
const reqMethods = [
	['post', 'delete', 'head', 'put', 'connect', 'options', 'trace'],
	['get', 'upload']
];
const http = new Request({
	baseURL: VUE_APP_API_URL,
	timeout: 3000,
	custom: {
		repeatCancel: REQUEST_REPEAT_CANCEL //当前页面的重复请求取消
	}
});
http.interceptors.request.use(
	config => {
		const {
			header = {}, custom = {}
		} = config;
		header["Authori-zation"] = "Bearer " + store.state.token;
		config.header = header;
		if (custom.repeatCancel) {
			config.getTask = (task, config) => {
				const url = getUrlParams(config);
				if (!pending.has(url)) { // 如果 pending 中不存在当前请求，则添加进去
					addPending(url,task)
				} else {
					config.repeat = true;
					task.abort()
				}
			}
		}
		return config
	})
// 响应拦截器
http.interceptors.response.use(
	response => {
		// console.log('响应成功', response)
		return response
	})

function baseRequest(url, method, options, args) {
	const {
		login = false,
			warn = false,
			cancel = false
	} = args;
	if (login && !checkTokenStatus()) {
		autoAuth();
		return Promise.reject({
			msg: "未登录"
		});
	}
	return http[method](url, options).then(res => {
		http.config.custom.repeatCancel && delPending(getUrlParams(res.config))
		let data = res.data;
		if (res.statusCode === 200) {
			if (data.status) {
				return Promise.resolve(data);
			} else {
				return Promise.reject(data.msg || data || '系统错误');
			}
			return Promise.resolve(res.data);
		} else {
			if (warn) {
				uni.showToast({
					title: `请求异常-${res.statusCode}`,
					duration: 2000,
					icon: 'none'

				});
			}
			return Promise.reject(res.data);
		}
	}).catch(err => {
		const {
			config,
			errMsg
		} = err;
		if (!config.repeat) {
			return Promise.reject(err);
		} else {
			console.warn(`${config.fullPath}重复请求`, err)
		}
	});
}
const request = reqMethods[0].reduce((request, method) => {
	request[method] = (url, data = {}, config = {}) => {
		return baseRequest(url, method, data, config);
	};
	return request;
}, {});

reqMethods[1].forEach(method => {
	request[method] = (url, params = {}, config = {}) => {
		return baseRequest(url, method, {
			params
		}, config);
	};
});
export default request;
