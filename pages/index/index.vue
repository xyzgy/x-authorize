<template>
	<view class="container">
		<view class="item">需要授权的界面引入x-arthorize</view>
		<view class="item">小程序端用户未授权，引导用户手动授权，已授权将自动登录</view>
		<view class="item">h5中未登录直接跳转至登录界面</view>
		<view class="item">微信公众号中未授权将直接公众号授权 （需要执行 npm install 安装 wechat-jssdk）</view>
		<view class="item">/pages/user/user 页面演示具体用法</view>
	</view>
</template>

<script>
export default {
	data() {
		return {};
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
	 counter-reset:section;
	> .item {
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
