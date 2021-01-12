<template>
	<view>
		<view>{{ des }}</view>
		<view v-if="isLogin"><image src="@/static/image/1.jpg" mode="aspectFit" @click="previewImage"></image></view>
		<button class="unbtn" @click="init('auth')" v-else>手动</button>
		<x-authorize @login="login"></x-authorize>
	</view>
</template>

<script>
import { autoAuth } from '@/utils/common.js';
import { mapGetters } from 'vuex';
export default {
	computed: mapGetters(['isLogin', 'userInfo']),
	data() {
		return {
			des: '未登录'
		};
	},
	methods: {
		login(res) {
			this.$showToast('登录成功');
			this.updateData();
			console.log(res);
		},
		updateData() {
			this.des = '已登录';
		},
		previewImage(path) {
			uni.previewImage({
				urls: [require('@/static/image/1.jpg')]
			});
		},
		init(type) {
			if (this.isLogin) {
				this.updateData();
			} else {
				if (type === 'auth') {
					autoAuth();
				}
			}
		}
	},
	onShow() {
		this.init();
	}
};
</script>

<style></style>
