### 2.0.1
* 授权相关代码重写，使逻辑更加简洁明了，对应文件可单独提取使用
* 更新使用文档
* 移除updateToken与checkLogin方法
* 移除isLogin

### 1.0.9
* 调整updateToken与checkLogin解决公众号授权时偶发死循环问题

### 1.0.8
* 修复代码调整带来的公众号授权死循环
* 去除base.scss'文件的引入

### 1.0.7
* checkLogin增加参数，未登录时根据需要是(true)否(false)跳转登录

### 1.0.6
* 优化鉴权及授权逻辑

### 1.0.5
* 小程序getUserProfile接口更新

### 1.0.4
* 去除 isHidden，scopeUserInfo 字段，简化代码；
* store增加isLogin字段
* 其它平台登录后无法触发授权回调，借助store.getters.isLogin监听

### 1.0.3
* 修复初始化时token清除时机错误，导致重复授权

### 1.0.2
* 小程序初始化时，增加鉴权，token过期时，直接移除授权相关信息
* 补充头条小程序字体文件

### V1.0.1

* 可直接当做项目模板使用
* common部分方法说明及流程说明
* 需要授权的界面引入x-arthorize组件，建议在main.js中全局声明，要使用的界面直接引入即可
* 调整isAuto与isHidden涉及逻辑
* 补充简述
* 补充怎么使用自己api测试
* 补充字段说明
* 补充流程图



