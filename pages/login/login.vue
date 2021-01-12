<template>
	<view class="btn">
		<button type="primary" size="" @click="login">登录</button>
	</view>
</template>

<script>
import { toLogin } from '@/utils/common.js';
export default {
	data() {
		return {};
	},
	methods: {
		login() {
			toLogin({account:'18511043664',password:'123456789'});
		}
	},
	mounted() {
	},
	onHide() {
		
		console.log('onHide')
	},
	onUnload() {
		console.log('onHide')
	},
};
</script>

<style>
	.btn{
		width: 200rpx;
		margin:300rpx auto;
		button{
			width: 100% !important;
		}
	}
</style>
