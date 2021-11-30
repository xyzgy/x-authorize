<template>
	<view class="container">
		<view class="item">npm install</view>
		<view class="item">需要授权的界面引入x-arthorize， 建议全局注册公共组件</view>
		<view class="item">小程序端用户未授权，引导用户手动授权，已授权将自动登录</view>
		<view class="item">h5中未登录直接跳转至登录界面</view>

		<view class="" style="margin-top: 20px;">
			<navigator url="/pages/share/share" open-type="switchTab" hover-class="other-navigator-hover">
				<button type="default">x-wxml-to-canvas示例</button>
			</navigator>
		</view>
		<view class="" v-if="isWeixinMode" style="margin-top: 20px;">
			体验公众号授权，请关注测试号 （会定期清理）
			<image
				src="https://vkceyugu.cdn.bspapp.com/VKCEYUGU-62724eb8-a548-43ff-88f4-2d909ac15c66/30a07743-8154-4cae-a59c-128b5987da84.jpg"
				mode="widthFix"></image>
		</view>
	</view>
</template>

<script>
	import {
		isWeixin
	} from '@/utils/wechat.js';
	import {
		WECHAT_LOGIN,
		PATH_INDEX_URL
	} from '@/config.js'
	export default {
		data() {
			return {};
		},
		computed: {
			isWeixinMode() {
				return isWeixin() && WECHAT_LOGIN
			}
		},
		methods: {},
		mounted() {},
		onPullDownRefresh() {
			console.log('刷新');
			this.$stopPullRefresh(1000);
		},
		onReachBottom() {
			console.log('到达底部');
		}
	};
</script>

<style lang="scss">
	.container {
		padding: 40rpx;
		font-size: 28rpx;
		line-height: 28rpx;
		counter-reset: section;

		>.item {
			padding: 5rpx 0;
			line-height: 40rpx;
			color: #666;
			counter-increment: section 1;

			&:before {
				content: counter(section)'、';
			}
		}
	}
</style>
