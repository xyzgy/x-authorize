<template>
	<!--  #ifdef H5 || APP-PLUS-->
	<view v-if="isWeixinMode">
		<view>仅H5在公众号授权之后过渡显示</view>
	</view>
	<view class="login" v-else>
		<u-form :model="form" ref="uForm" label-position="top">
			<u-form-item label="昵称" prop="name">
				<u-input v-model="form.name" />
			</u-form-item>
			<u-form-item label="手机号" prop="mobile">
				<u-input v-model="form.mobile" />
			</u-form-item>
			<u-form-item label="密码" prop="pwd">
				<u-input type="password" v-model="form.pwd" />
			</u-form-item>
		</u-form>
		<view class="tips">新用户自动创建账户</view>
		<u-button @click="submit">提交</u-button>
	</view>
	<!--  #endif -->
</template>

<script>
	// #ifdef H5 || APP-PLUS
	import {
		toLogin,
		checkTokenStatus
	} from '@/utils/login.js';
	import {
		isWeixin
	} from '@/utils/wechat.js';
	import {
		WECHAT_LOGIN,
		PATH_INDEX_URL
	} from '@/config.js'
	export default {
		data() {
			return {
				form: {
					name: 'xyzgy',
					mobile: '18511111111',
					pwd: '18511111111'
				},
				rules: {
					name: [{
						required: true,
						message: '请输入姓名',
						// 可以单个或者同时写两个触发验证方式
						trigger: ['change', 'blur']
					}],
					// 字段名称
					mobile: [{
							required: true,
							message: '请输入手机号',
							trigger: ['change', 'blur'],
						},
						{
							// 自定义验证函数，见上说明
							validator: (rule, value, callback) => {
								// 上面有说，返回true表示校验通过，返回false表示不通过
								// this.$u.test.mobile()就是返回true或者false的
								return this.$u.test.mobile(value);
							},
							message: '手机号码不正确',
							// 触发器可以同时用blur和change
							trigger: ['change', 'blur'],
						}
					],
					pwd: [{
						required: true,
						min: 6,
						message: '不少于6位',
						trigger: 'change'
					}]
				}
			}
		},
		computed: {
			isWeixinMode() {
				return isWeixin() && WECHAT_LOGIN
			}
		},
		methods: {
			submit() {
				let _this = this;
				this.$refs.uForm.validate(valid => {
					if (valid) {
						this.$showModal('提示', '请牢记自己的账号密码', {
							success: function(res) {
								toLogin({
									phone: _this.form.phone,
									pwd: _this.form.phone
								});
							},
						})
						console.log('验证通过');
					} else {
						console.log('验证失败');
					}
				});
			}
		},
		mounted() {},
		// 必须要在onReady生命周期，因为onLoad生命周期组件可能尚未创建完毕
		onReady() {
			if (!this.isWeixinMode) {
				this.$refs.uForm.setRules(this.rules);
			}
		},
		onLoad(options) {
			console.log('login',options)
			if (this.isWeixinMode) {
				let {
					code,
					state
				} = options;
				toLogin({
					type: 'wechat',
					code
				});
			}
		},
		onShow() {

		},
		onUnload(){
			this.$storage.set('IS_AUTO_AUTH', false);
		},
	};
	// #endif
</script>

<style scoped lang="scss">
	.login {
		padding: 20rpx;

		.tips {
			padding: 30rpx 0;
			font-size: 16rpx;
			color: red;
		}
	}
</style>
