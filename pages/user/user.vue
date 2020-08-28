<template>
	<view>
		<view>{{des}}</view>
		<x-authorize @login="login"></x-authorize></view>
</template>

<script>
	import { checkLogin } from '@/utils/common.js';

export default {
	data() {
		return {
			des:'未登录'
		};
	},
	methods: {
		login(res) {
			this.$showToast('登录成功');
			this.updateData()
			console.log(res);
		},
		updateData(){
			this.des = '已登录'
		}
	},
		onShow() {
			if (checkLogin()) {
				this.updateData();
			}else{
				
			}
		}
};
</script>

<style></style>
