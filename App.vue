<script>
	import { checkLogin} from '@/utils/common.js';
export default {
	onLaunch: function() {
		console.log('App Launch');
		// #ifdef APP-PLUS
		this.checkVersion();
		// #endif
		// #ifdef MP
		this.checkUpdate();
		// #endif
		this.initData()
	},
	onShow: function() {
		console.log('App Show');
	},
	onHide: function() {
		console.log('App Hide');
	},
	methods: {
		// #ifdef MP
		checkUpdate() {
			const updateManager = uni.getUpdateManager();
			updateManager.onCheckForUpdate(function(res) {
				// 请求完新版本信息的回调
			});
			updateManager.onUpdateReady(function() {
				uni.showModal({
					title: '更新提示',
					content: '新版本已经准备好，是否重启应用？',
					success: function(res) {
						if (res.confirm) {
							// 新的版本已经下载好，调用 applyUpdate 应用新版本并重启
							updateManager.applyUpdate();
						}
					}
				});
			});
			updateManager.onUpdateFailed(function() {
				uni.showModal({
					title: '更新提示',
					content: '新版本下载失败',
					success: function(res) {}
				});
			});
		},
		// #endif
		// #ifdef APP-PLUS
		// app更新检测
		checkVersion() {
			// 获取应用版本号
			let version = plus.runtime.version;
			//检测当前平台，如果是安卓则启动安卓更新
			uni.getSystemInfo({
				success: res => {
					let data = {
						platform: res.platform,
						version: version
					};
					// plus.runtime.openURL('最新版本更新地址')
				}
			});
		},
		// 更新操作
	
		// #endif
		initData() {
			let storage = this.$storage;
			let token = storage.get('token') || null,
				expires_time = storage.get('expires_time') || null,
				userInfo = storage.get('userInfo') || null;
				if(checkLogin()){
					this.$store.commit('LOGIN', { token, expires_time });
				}
			this.$store.commit('UPDATE_USERINFO', userInfo);
		}
	}
};
</script>

<style lang="scss">
@import 'uview-ui/index.scss';
@import './static/css/base.scss';
/* #ifdef H5 */
$minWidth: 750px;
@mixin borderLR($w: 1rpx, $color: red) {
	border-left: $w solid $color;
	border-right: $w solid $color;
}
uni-page-head {
	display: none;
}
body::-webkit-scrollbar,
html::-webkit-scrollbar {
	display: none;
}
@media (min-width: $minWidth) {
	uni-app {
		width: $minWidth;
		margin: 0 auto;
		@include borderLR;
	}
	.uni-tabbar {
		width: $minWidth;
		margin: auto;
		@include borderLR;
	}
}
/* #endif */
</style>
