<<<<<<< HEAD
### common部分方法说明
* autoAuth() 自动授权
* toLogin() 授权后去执行的登录相关
* updateToken() 更新 store中登录相关字段信息
* checkLogin() 判断当前是否登录状态


=======
>>>>>>> f02cac59526d7345400bae97af5baba65b203db6
### 功能说明
* 小程序端用户未授权，引导用户手动授权，已授权将自动登录
* h5中未登录直接跳转至登录界面
* 微信公众号中未授权将直接公众号授权 （需要执行 npm install 安装 wechat-jssdk）