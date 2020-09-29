<script>
		import { checkLogin } from '@/utils/common.js';
export default {
	onLaunch: function() {
		console.log('App Launch');
		// #ifdef APP-PLUS
		this.checkVersion();
		// #endif
			this.initData();
			
			checkLogin()

	},
	onShow: function() {
		console.log('App Show');
	},
	onHide: function() {
		console.log('App Hide');
	},
	methods: {
		initData() {
			let storage = this.$storage;
			let token = storage.get('token') || null,
				expires_time = storage.get('expires_time') || null,
				userInfo = storage.get('userInfo') || null;
			this.$store.commit('LOGIN', { token, expires_time });
			this.$store.commit('UPDATE_USERINFO', userInfo);
		},
		// #ifdef APP-PLUS
		// app更新检测
		checkVersion() {
			// 获取应用版本号
			let version = plus.runtime.version;
			//检测当前平台，如果是安卓则启动安卓更新
			uni.getSystemInfo({
				success: res => {
					this.updateHandler(res.platform, version);
				}
			});
		},
		// 更新操作
		updateHandler(platform, version) {
			let data = {
				platform: platform,
				version: version
			};
			let _this = this;
			// plus.runtime.openURL('最新版本更新地址')
		}
		// #endif
	}
};
</script>

<style>
/* 解决头条小程序组件内引入字体不生效的问题 */
/* #ifdef MP-TOUTIAO */
@font-face {
	font-family: uniicons;
	src: url('/static/uni.ttf');
}
/* #endif */
/* #ifdef H5 */
  uni-page-head {
        display: none;
    }
/* #endif */
</style>
