<template>
	<view>
		<!-- #ifdef MP -->
		<uni-popup ref="popup" type="center" :maskClick="false">
			<view class="flex flex_align_center authorize">
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
import { toLogin, autoAuth } from '@/utils/common.js';
import { mapGetters } from 'vuex';
export default {
	components: {
		uniPopup
	},
	data() {
		return {
		};
	},
	computed: mapGetters(['isLogin', 'authPopupShow', 'userInfo']),
	props: {
		isAuto: {
			type: Boolean,
			default: true
		}
	},
	watch: {
		authPopupShow: function(newVal, oldVal) {
			if (newVal) {
				this.open();
			}
		},
		isLogin: function(newVal, oldVal) {
			if (newVal) {
				this.close()
				this.$emit('login', this.userInfo);
			}
		}
	},
	methods: {
		getUserInfo() {
			let _this = this;
			uni.showLoading({ title: '正在登录中' });
			uni.login({
				success(res) {
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
				fail(res) {
					uni.hideLoading();
				}
			});
		},
		//检测登录状态
		checkAuthStatus() {
			let _this = this;
			if (this.isLogin) {
				console.log('已登录');
			} else {
				// #ifdef H5
				autoAuth();
				// #endif
				// #ifdef MP
				wx.getSetting({
					success(res) {
						console.log(res);
						if (res.authSetting['scope.userInfo']) {
							// 已授权获取用户信息
							_this.getUserInfo();
						} else {
							// 引导用户手动授权
							if (_this.isAuto) {
								_this.getUserInfo();
							}
						}
					}
				});
				// #endif
			}
		},
		getLoginInfo(userInfo) {
			toLogin(userInfo, function(res) {
				uni.hideLoading();
			});
		},
		close() {
			// #ifdef MP
			this.$refs.popup.close();
			// #endif
			this.$store.commit('HIDE_AUTH_POPUP_SHOW');
		},
		open() {
			this.$hideToast();
			// #ifdef MP
			this.$refs.popup.open();
			// #endif
		}
	},
	mounted() {
		this.checkAuthStatus();
	}
};
</script>

<style lang="scss" scoped>
	.flex {
		display: flex;
	}
	.flex_align_center {
		align-items: center;
	}
	.text_center {
		text-align: center;
	}
.authorize {
	width: 600rpx;
	// border-radius: 15rpx;
	background-color: #fff;
	.text_center {
		width: 100%;
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
