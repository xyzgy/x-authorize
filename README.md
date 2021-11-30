### 使用
* 执行npm instal 安装对应npm包，否则项目无法运行（文件查找失败）
#### 1.安装
``` 
npm install 
```
#### 2、引入 (main.js已全局引入x-authorize直接下一步)
```
import xWxmlToCanvas from '@/components/x-authorize/x-authorize';
components: {
		xAuthorize
	} 
```
#### 3、使用 ()
``` 
<x-authorize @login="login"></x-authorize>
```

### 使用需注意
* [体验地址](https://uni.xyzgy.xyz)
* 公众号授权逻辑最近有更新，由页面跳转改为弹窗，因此开发者工具与真机是两种情况，若授权之后回调逻辑不理想，自己视情况调整 （login.js 75-78，）,

### 项目简述
* 2.0.1版本是重写后的版本，代码可读性更高，也更加便于调试，本人也承认之前版本的代码可读性太差，近段时间抽时间重新调整；
* 授权相关返回信息，在本项目中返回固定值(在api/auth.js)，
* 公众号授权本地测试建议申请测试号
* 本组件仅小程序、h5、微信公众号、头条小程序中有测试
* 
* 授权，鉴权涉及到全局，单一就一个组件，无法发挥多大作用，因此将整体逻辑代码完全展示
* 项目中的整体授权，涉及环节较多，项目目录结构按照本人平常的代码习惯，觉得合适的可以在此基础上进行开发
* plugins目录中存放的是本人封装的request请求，在utils中的requset中初始化并使用该文件，你也可以单独引用该文件封装自己的request
* request方法对api请求前做一次鉴权判断，但这需要在请求传入参数时传入相关字段辅助（本人声明login为true时代表该api需要鉴权，未授权时，调用autoAuth（））

### 核心文件说明
* api/auth.js  公众号配置信息的获取，登录及用户信息获取 getWechatConfig(微信公众号配置)  / getUserInfo(用户信息) / login(多端登录授权)
* components/x-authorize  小程序中会弹窗形式，h5跳转登录页，公众号调起公众号授权
* store/index.js  保存登录相关信息
* utils/login.js  授权及鉴权相关逻辑
* utils/wechat.js 公众号授权，包含用户信息授权及分享等功能的方法的封装 （可单独使用）
* config.js 全局变量的配置信息

### 字段说明
|  字段   | 类型  |默认值  |描述  |
|  ----  | ----  |----  |----  |
| isAuto  | Boolean |true| 自动授权 true 用户已授权直接请求，未授权，弹窗引导用户

### 作者有话说
* 插件是佛系更新，因此不会随时关注，有留言，看到就会回复
* 不好用,欢迎差评，但注意一下言辞，不要理直气壮的
* 使用前，看文档，已多次强调，已无力吐槽
* 2.0.1版本应该会作为一个稳定版本，不会再做大逻辑调整,后期有时间可能会增加其它功能

### 其它插件（主要维护的）
* 不在列表中的的插件，已经放弃维护，属于uniapp刚推出时随手写的，没有太大维护意义
* [uni版本的 html-to-canvas](https://ext.dcloud.net.cn/plugin?id=3998) 基于微信官方的wxml-to-canvas封装
* [h5、公众号、小程序授权登录](https://ext.dcloud.net.cn/plugin?id=2647) 将h5登录，公众号授权登录、小程序授权登录统一封装

