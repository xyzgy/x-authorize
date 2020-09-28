<template>
	<view>
		<view >{{des}}</view>
		<view v-if="isLogin">
			<image src="@/static/image/1.jpg" mode="aspectFit" @click="previewImage"></image>
		</view>
		<x-authorize @login="login" :isHidden="false"></x-authorize></view>
</template>

<script>
	import { checkLogin,autoAuth } from '@/utils/common.js';
export default {
	data() {
		return {
			des:'未登录',
			isLogin:false
		};
	},
	methods: {
		login(res) {
			this.$showToast('登录成功');
			this.updateData()
			console.log(res);
		},
		updateData(){
			this.des = '已登录';
			this.isLogin = true
		},
		previewImage(path) {
			uni.previewImage({
				urls:[ require('@/static/image/1.jpg')]
			});
		},
	},
		onShow() {
			if (checkLogin()) {
				this.updateData();
			}else{
				autoAuth()
			}
		}
};
</script>

<style></style>
