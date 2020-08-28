<!-- 用来处理微信公众号授权之后地址等操作 -->
<template>
	<!--  #ifdef H5 -->
	<view>仅H5在公众号授权之后过渡显示</view>
	<!--  #endif -->
</template>
<script>
import { toLogin } from '@/utils/common.js';
import { isWeixin } from '@/utils/validate.js';
export default {
	data() {
		return {};
	},
	methods: {},
	onLoad(options) {
		// #ifdef H5
		if (isWeixin()) {
			let { code, state } = options;
			toLogin({ type: 'wechat', code });
		} else {
			this.$navigator('/pages/index/index', 'switchTab');
		}
		// #endif
	},
	mounted() {}
};
</script>

<style></style>
