<template>
	<view>
		<view>{{ isLogin ? '已登录':'未登录' }}</view>
		<view v-if="isLogin">
			token有效期为60s,便于调试
			<!-- <image src="@/static/image/1.jpg" mode="aspectFit" @click="previewImage"></image> -->
		</view>
		<button class="unbtn" @click="init('auth')" v-else>手动</button>
		<x-authorize @login="login"></x-authorize>
	</view>
</template>

<script>
	import {
		autoAuth,
		checkTokenStatus
	} from '@/utils/login.js';
	import {
		mapGetters
	} from 'vuex';
	export default {
		computed: mapGetters([ 'userInfo']),
		data() {
			return {
				des: '未登录',
				isLogin:true
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
					type === 'auth' && autoAuth();
				}
			}
		},
		onShow() {
			this.isLogin=checkTokenStatus();
			this.init();
		}
	};
</script>

<style></style>
