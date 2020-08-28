uni.request 进行封装，允许自定义拦截请求 用法与axios基本相同,引入axios 中 cancel文件，允许请求时取消请求
### 初始化请求
let instance = unirequest.create({
	baseURL: '',
	timeout: 10000
})
### 拦截器配置
// 请求拦截器
instance.interceptors.request.use(
	config => {
		config.header['Content-Type']= 'application/x-www-form-urlencoded';
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
### 请求主体  
* config={url,method,data}
instance.request(config).then(res => {
		if (res.statusCode) {
			if (res.statusCode === 200) {
				return Promise.resolve(res.data);
			} else {
				return Promise.reject(res.data);
			}
		} else {
			return Promise.reject(res.data);
		}
	}).catch(err => {
		return Promise.reject(err);
	})
	
***
new Proxy(target, handler)   //可以理解为目标对象之前做一层拦截，所有访问的对象必须先通过这层拦截
Proxy支持拦截的操作，一共有13种：
get(target, propKey, receiver)：拦截对象属性的读取，比如proxy.foo和proxy['foo']。
set(target, propKey, value, receiver)：拦截对象属性的设置，比如proxy.foo = v或proxy['foo'] = v，返回一个布尔值。
has(target, propKey)：拦截propKey in proxy的操作，返回一个布尔值。
deleteProperty(target, propKey)：拦截delete proxy[propKey]的操作，返回一个布尔值。
ownKeys(target)：拦截Object.getOwnPropertyNames(proxy)、Object.getOwnPropertySymbols(proxy)、Object.keys(proxy)、for...in循环，返回一个数组。该方法返回目标对象所有自身的属性的属性名，而Object.keys()的返回结果仅包括目标对象自身的可遍历属性。
getOwnPropertyDescriptor(target, propKey)：拦截Object.getOwnPropertyDescriptor(proxy, propKey)，返回属性的描述对象。
defineProperty(target, propKey, propDesc)：拦截Object.defineProperty(proxy, propKey, propDesc）、Object.defineProperties(proxy, propDescs)，返回一个布尔值。
preventExtensions(target)：拦截Object.preventExtensions(proxy)，返回一个布尔值。
getPrototypeOf(target)：拦截Object.getPrototypeOf(proxy)，返回一个对象。
isExtensible(target)：拦截Object.isExtensible(proxy)，返回一个布尔值。
setPrototypeOf(target, proto)：拦截Object.setPrototypeOf(proxy, proto)，返回一个布尔值。如果目标对象是函数，那么还有两种额外操作可以拦截。
apply(target, object, args)：拦截 Proxy 实例作为函数调用的操作，比如proxy(...args)、proxy.call(object, ...args)、proxy.apply(object,...)。
construct(target, args)：拦截 Proxy 实例作为构造函数调用的操作，比如new proxy(...args)。