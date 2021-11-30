<template>
	<view>
		当前界面演示分享相关
		<button type="default" @click="status=!status">点击</button>

		<view class="wxml_to_canvas">
			<view class="container">
				<view class="img">
					<image  :src="imgSrc" :mode="imgMode"></image>
				</view>
				<view class="wrap">
					<view style="flex:1"><text class="wraptext">窗前明月光，疑是地上霜。举头望明月，低头思故乡</text></view>
					<view class="wrapimg">
						<image  :src="imgSrc" mode="widthFix"></image>
					</view>
				</view>
			</view>
			<image :src="src" mode="widthFix" style="width: 350px;"></image>
			<view style="display: flex;;">
				<button @click="renderToCanvas" style="width: 30%;font-size: 28rpx">1、渲染图片</button>
				<button @click="canvasToTempFilePath" style="width: 30%;font-size: 30rpx">2、导出图片</button>
			</view>
			<view class="" style="width:80%;margin: 20px auto;">
				<button @click="getCanvasImage">直接获取图片</button>
				<view style="color: red;padding:10px 0;">* 执行该该方法直接合并上述两个步骤</view>
			</view>
			<view class="" style="width:80%;margin: 20px auto;">
				<button @click="saveImageToPhotosAlbum">保存至本地</button>
			</view>

			<xWxmlToCanvas ref="xWxmlToCanvas" :hide="false" :width="350" :height="500" :xStyle="style" :xWxml="wxml">
			</xWxmlToCanvas>
		</view>
	</view>
</template>

<script>
	import xWxmlToCanvas from 'x-wxml-to-canvas/x-wxml-to-canvas'
	// const imgSrc = 'https://t7.baidu.com/it/u=2397542458,3133539061&fm=193&f=GIF';
	const mode = 'aspectFill';
	// const imgSrc = 'https://vkceyugu.cdn.bspapp.com/VKCEYUGU-xyzgy/7d75b690-6087-11eb-918d-3d24828c498c.jpeg';
	const imgSrc ='https://img.redocn.com/sheying/20180508/guangzhoutayejing_9396053.jpg'
	const wxml = `
			<view class="container">
				<view><image class="img" src="${imgSrc}" mode="${mode}" isMode="true"></image></view>
				<view class="wrap">
					<view>
						<text class="wraptext">窗前明月光，疑是地上霜。举头望明月，低头思故乡</text>
					</view>
				<view><image class="wrapimg" src="${imgSrc}" mode="widthFix" isMode="true"></image></view>
				</view>
			</view>
	`;
	const style = {
		container: {
			width: 350,
			height: 500,
			backgroundColor: '#fff',
			borderRadius: 20,
			padding: 20,
		},
		img: {
			width: 310,
			height: 150
		},
		wrap: {
			flexDirection: 'row',
			justifyContent: 'space-between',
			marginTop: 10
		},
		wraptext: {
			width: 210,
			height: 60,
			fontSize: 13,
			paddingRight: 10
		},
		wrapimg: {
			width: 60,
			height: 60
		}
	};
	export default {
		props: {
			value: {
				type: '',
				default: ''
			}
		},
		components: {
			xWxmlToCanvas
		},
		data() {
			return {
				status: false,
				share: {
					desc: '分享页面',
					title: '分享',
					image: 'https://www.xyzgy.xyz/h5/img/8.bf4bfc77.jpg',
					href: '/pages/share/share?id=xyz'
				},
				imgSrc,
				src: '',
				wxml: wxml,
				style: style,
				imgMode: mode
			}
		},
		methods: {
			renderToCanvas() {
				this.$refs.xWxmlToCanvas.renderToCanvas();
			},
			canvasToTempFilePath() {
				this.$refs.xWxmlToCanvas.canvasToTempFilePath().then(res => {
					this.src = res;
				});
			},
			getCanvasImage() {
				this.$refs.xWxmlToCanvas.getCanvasImage().then(res => {
					this.src = res;
				});
			},
			saveImageToPhotosAlbum() {
				if (!this.src) return uni.showToast({
					title: '未获取路径',
					icon: 'none'
				})
				this.$refs.xWxmlToCanvas.saveImageToPhotosAlbum(this.src)
			},
			getImageInfo(path) {
				return new Promise((resolve, reject) => {
					uni.getImageInfo({
						src: path,
						success: function(image) {
							resolve({
								w: Number(image.width),
								h: Number(image.height)
							});
						},
						fail(err1) {
							console.log('err', err1)
							reject(err1);
						}
					});
				})
			}
		},
		mounted() {

		},
		onLoad(option) {
			const {
				id
			} = option;
			if (id && id === 'xyz') {
				this.$showToast('我是通过分享进入')
			}
		},
		// #ifdef MP
		onShareAppMessage() {
			const {
				title,
				image,
				href
			} = this.share
			return {
				title,
				imageUrl: image,
				path: href
			}
		}
		// #endif
	}
</script>

<style scoped lang="scss">
	uni-view,view{
		box-sizing: border-box;
	}
	.wxml_to_canvas {
		background: rgba(0, 0, 0, 0.4);
	}

	.container {
		width: 350px;
		margin: 0 auto;
		height: 500px;
		background: #fff;
		border-radius: 20px;
		padding: 20px;
	}

	.img {
		width: 310px;
		height: 150px;
		overflow: hidden;
		image{
			width: 100%;
			height: 100%;
		}
	}

	.wrap {
		display: flex;
		justify-content: space-between;
		margin-top: 10px;
	}

	.wraptext {
		display: inline-block;
		font-size: 13px;
		padding-right: 10px;
	}

	.wrapimg {
		
		width: 60px;
		height: 60px;
		overflow: hidden;
		image{
			width: 100%;
			height: 100%;
		}
	}
</style>
