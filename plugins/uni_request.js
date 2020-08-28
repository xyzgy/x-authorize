import {CancelToken,Cancel,isCancel} from './cancel.js'
class Request {
	constructor(args) {
		this.defaults = {headers:{'Accept': 'application/json',
			'Content-Type': 'application/x-www-form-urlencoded'},debug:false,...args} || {};
		this.timer = null;
		this.requestTask = null;
		this.aborted = false;
		this.timeoutCancel = false;
		this.Cancel = Cancel;
		this.CancelToken = CancelToken;
		this.isCancel = isCancel;
	}
	interceptors = { // 拦截器
		request: {
			interceptors: [],
			use(fn) {
				this.interceptors.push(fn)		
			},
			async intercept(config) {
				for (let i = 0; i < this.interceptors.length; i++) {
					config = await this.interceptors[i](config)
				}		
				return config
			}
		},
		response: {
			interceptors: [],
			use(fn) {
				this.interceptors.push(fn)
			},
			async intercept(resolve, response) {
				for (let i = 0; i < this.interceptors.length; i++) {
					response = await this.interceptors[i](response)
				}
				return resolve(response)

			}
		}
	}
	abort = () => {
		this.aborted = true;
		this.requestTask ? this.requestTask.abort() : ''
	}

	onerror = async (options={...args}) => {
		let obj = {
			url: options.url,
			method: options.method,
			mes: options.str
		};
		if(options.cancel){
			obj.mes=options.cancel.message || '取消请求'
		}
		if(this.defaults.debug){
			console.log(obj.mes, options)
		}
		return obj;
	}
	request(options) {
		const _this = this;
		let {method, url, data,cancelToken} = options;
		let config = {
			url: this.defaults.baseURL + url,
			method: method.toUpperCase() || 'GET',
			header: this.defaults.headers || {},
			data: data || {},
		}
		return new Proxy(new Promise((resolve, reject) => {
			_this.interceptors.request.intercept(config).then(async (res) => {
				if (_this.aborted) { // 如果请求已被取消,停止执行,返回 reject
					const str = '主动中断请求';
					await _this.onerror({config,str})
					return reject(str)
				}
				if (config.cancelToken) {
				  // Handle cancellation
				  config.cancelToken.promise.then(async function onCanceled(cancel) {
						clearTimeout(_this.timer)
						_this.requestTask = null;
						await _this.onerror({config, cancel})
				    return reject(cancel);
				  });
				}
				_this.requestTask = uni.request({
					...config,
					success: async (res) => {
						clearTimeout(_this.timer) // 清除检测超时定时器
						_this.interceptors.response.intercept(resolve, res) // 执行响应拦截器
					},
					fail: async (error) => {
						clearTimeout(_this.timer) // 清除检测超时定时器
						let failTimer = setTimeout(async () => {
							// 区分失败原因为超时或其它原因
							const str = '网络异常或URL无效'
							if (!_this.timeoutCancel) {
								await _this.onerror({config, str})
								clearTimeout(failTimer)
								reject(str)
							}
						}, 300)

					}
				});
				_this.timer = setTimeout(async () => { // 请求超时执行方法
				if (config.cancelToken) {return}
					_this.requestTask.abort(); // 执行取消请求方法
					_this.timeoutCancel = true;
					const str = `网络请求时间超时,当前设置响应时间为${_this.defaults.timeout}`
					await _this.onerror({config, str})
					reject(str)
				}, _this.defaults.timeout || 12345) // 设定检测超时定时器
			})


		}), {
			get: function(target, key, receiver) {
				// console.log(`getting ${key}!`);
				return key === 'abort' ? _this.abort : Reflect.get(target, key, receiver).bind(target); //传入target 为异步函数需要 .bind(target)
			},
			set: function(target, key, value, receiver) {
				// console.log(`setting ${key}!`);
				return Reflect.set(target, key, value, receiver);
			}
		})
	}
}

// class CreateInstance extends Request {
// 	constructor(args) {
// 		super();
// 		super.defaults = args;
// 	}
// }
let unirequest = new Request();
unirequest.create = function(args) {
	return new Request(args)
}

export default unirequest;
