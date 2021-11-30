// api请求地址
export const VUE_APP_API_URL = 'https://cloud.xyzgy.xyz';

// 公众号中是否使用公众号授权登录 true公众号授权->auth界面下一步操作  false直接跳转login登录界面
export const WECHAT_LOGIN = true;
//授权回调地址 没有传递回调地址时，使用该参数
export const REDIRECT_URI = 'https://uni.xyzgy.xyz/#/pages/login/login';

//首页地址 返回上一页找不到路径重定向首页
export const PATH_INDEX_URL = '/pages/index/index'
export const PATH_LOGIN_URL = '/pages/login/login'