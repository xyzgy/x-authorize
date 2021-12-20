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
						<button v-if="canUseGetUserProfile" class="btn" type="primary"
							@click="getUserProfile">授权</button>
						<button v-else class="btn" type="primary" open-type="getUserInfo"
							@getuserinfo="getUserInfo">授权</button>
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
	import {
		toLogin,
		autoAuth,
		checkTokenStatus
	} from '@/utils/login.js';
	import {
		mapGetters
	} from 'vuex';
	export default {
		components: {},
		data() {
			return {
				canUseGetUserProfile: false //判断api是否存在
			};
		},
		computed: mapGetters(['authPopupShow', 'userInfo']),
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
				} else {
					this.close();
				}
			}
		},
		methods: {
			getUserInfo() {
				let _this = this;
				uni.showLoading({
					title: '正在登录中'
				});
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
				if (checkTokenStatus()) {
					console.log('已登录');
					_this.close();
					this.$emit('login', this.userInfo);
				} else {
					// #ifdef H5 || APP-PLUS
					_this.isAuto && autoAuth();
					// #endif
					// #ifdef MP
					_this.isAuto && _this.open();
					// #endif
				}
			},
			getLoginCode() {
				return new Promise((resolve, reject) => {
					uni.login({
						success(res) {
							console.log('auth', res);
							resolve(res);
						},
						fail(err) {
							reject(err);
							uni.hideLoading();
						}
					});
				});
			},
			getUserProfile() {
				let _this = this;
				uni.getUserProfile({
					desc: '用于完善会员信息', // 声明获取用户个人信息后的用途，后续会展示在弹窗中，请谨慎填写
					success: async userInfo => {
						let res = await _this.getLoginCode();
						_this.close();
						userInfo.code = res.code;
						userInfo.version = true;
						_this.getLoginInfo(userInfo);
					},
					fail(err) {
						console.log('auth', err);
						// 用户未曾授权
						uni.hideLoading();
						_this.open();
					}
				});
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

				this.$storage.set('IS_AUTO_AUTH', false);
			},
			open() {
				this.$hideToast();
				// #ifdef MP
				this.$refs.popup.open();
				// #endif
			}
		},
		mounted() {
			// #ifdef MP
			if (uni.getUserProfile) {
				this.canUseGetUserProfile = true;
			}
			// #endif
			this.checkAuthStatus();
		}
	};
</script>

<style lang="scss" scoped>
	.authorize {
		width: 600rpx;
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
