<template>
	<view>
		<!-- #ifdef MP -->
		<uni-popup ref="popup" type="center" :maskClick="false">
			<view class=" authorize">
				<view class="text_center relative">
					<view class="top">
						<view class="title">授权登录</view>
						<view class="tip">请授权头像等信息，以便为您提供更好的服务</view>
					</view>
					<view class="bottom flex">
						<button class="btn" @click="close">取消</button>
						<!-- #ifdef MP-WEIXIN -->
						<button class="btn" type="primary" open-type="getUserInfo" @getuserinfo="getUserInfo">授权</button>
						<!-- #endif -->
						<!-- #ifdef MP-TOUTIAO -->
						<button class="btn" type="primary" @click="getUserInfo">授权</button>
						<!-- #endif -->
					</view>
				</view>
			</view>
		</uni-popup>
		<!-- #endif -->
	</view>
</template>

<script>
import uniPopup from '@/components/uni-popup/uni-popup.vue';
import { isWeixin } from '@/utils/validate.js';
import { toLogin, autoAuth, checkLogin } from '@/utils/common.js';
export default {
	components: {
		uniPopup
	},
	data() {
		return {
			scopeUserInfo: true
		};
	},
	props: {
		isAuto: {
			type: Boolean,
			default: true
		},
		isHidden: {
			type: Boolean,
			default: false
		}
	},
	watch: {
		'$store.getters.authPopupShow': function(newVal, oldVal) {
			if (newVal && !this.scopeUserInfo) {
				this.open();
			} else {
				this.close();
			}
		}
	},
	methods: {
		getUserInfo(userInfo, isLogin) {
			let _this = this;
			if (isLogin) {
				_this.getLoginInfo(userInfo);
			} else {
				
				uni.login({
					success(res) {
						uni.showLoading({ title: '正在登录中' });
						uni.getUserInfo({
							// #ifdef MP-WEIXIN
							lang: 'zh_CN', //头条不支持该字段
							// #endif
							// #ifdef MP-TOUTIAO
							withCredentials: true,
							// #endif
							success(userInfo) {
								_this.close();
								userInfo.code = res.code;
								_this.getLoginInfo(userInfo);
							},
							fail(err) {
								// 用户未曾授权
								uni.hideLoading();
								_this.open();
							}
						});
					},
					fail(err) {
						uni.hideLoading();
						uni.showToast({
							title:err.errMsg,
							icon:'none'
						})
					}
				});
			}
		},
		//检测登录状态
		checkAuthStatus() {
			let _this = this;
			if (checkLogin()) {
				console.log('已登录');
			} else {
				// #ifdef MP
				uni.getSetting({
					success(res) {
						console.log(res);
						if (res.authSetting['scope.userInfo']) {
							// 已授权获取用户信息
							_this.scopeUserInfo = true;
							_this.getUserInfo();
						} else {
							_this.scopeUserInfo = false;
							if(_this.isHidden){
															 // 自动授权
															 	// _this.getUserInfo()
							}else{
															 // 引导用户手动授权
															 if(_this.isAuto){
																 _this.getUserInfo()
															 }else{
																 _this.open();
															 }
							}
						}
					}
				});
				// #endif
				// #ifdef H5
				autoAuth();
				// #endif
			}
		},
		getLoginInfo(userInfo) {
			let that = this;
			toLogin(userInfo, function(res) {
				console.log(res);
				that.$emit('login', userInfo);
				uni.hideLoading();
			});
		},
		close() {
			this.$refs.popup.close();
			this.$store.commit('HIDE_AUTH_POPUP_SHOW');
		},
		open() {
			this.$hideToast();
			this.$refs.popup.open();
		}
	},
	mounted() {
		// this.open()
		// #ifdef H5
		console.log('isWeixin', isWeixin());
		// #endif
		// #ifndef H5
		// #endif

		this.checkAuthStatus();
	}
};
</script>

<style lang="scss" scoped>
.authorize {
	width: 600rpx;
	display: flex;
	align-items: center;
	// border-radius: 15rpx;
	background-color: #fff;
	.text_center {
		width: 100%;
		text-align: center;
		.top {
			padding: 20rpx 40rpx;
			.title {
				padding: 20rpx 0;
				font-size: 32rpx;
				font-weight: bold;
			}
			.tip {
				padding: 30rpx 0;
				font-size: 30rpx;
				height: 150rpx;
			}
		}

		.bottom {
			bottom: 0;
			width: 100%;
			display: flex;
			// border-bottom-left-radius: 15rpx;
			// border-bottom-right-radius: 15rpx;
			.btn {
				width: 50%;
				border-radius: 0;
				height: 80rpx;
				line-height: 80rpx;
				&:after {
					border: none;
				}
				/* #ifdef MP-TOUTIAO */
				&:last-child {
					background-color: rgba(248, 89, 89, 1);
				}
				/* #endif */
			}
		}
	}
}
</style>
