<template>
	<view>
		<!--标题栏-->
		<bar-title bgColor='bg-white'>
			<block slot="content">立即支付</block>
		</bar-title>
		<!--商品信息-->
		<view class="bg-white lc-goods-details-box">
			<view class="cu-avatar radius" :style="[{backgroundImage:'url('+ goods_img +')'}]" />
			<view class="goods-info-view">
				<view class="text-cut text-black">商品名称 99新 苹果 iPhoneX 256G 银色</view>
				<view class="text-sm text-gray">测试内容1</view>
				<view class="text-sm text-gray">测试内容2</view>
				<text class="text-price text-red text-lg">2999.00</text>
			</view>
		</view>

		<view class="text-gray padding-sm">支付方式</view>

		<!--支付方式-->
		<view class="bg-white lc-pay-view">
			<radio-group class="block" @change="RadioChange">
				<view class="lc-pay-bar" @tap="payTap('wechat')">
					<view class="cu-avatar sm" style="background-image:url(/static/lcui/img/wechat.png)" />
					<view class="content">
						<view class="text-black">
							<text class="margin-right-sm">微信支付</text>
							<text class="cu-tag bg-red radius sm">推荐</text>
						</view>
						<view class="text-gray text-sm">亿万用户的选择，更快更安全</view>
					</view>
					<view class="action">
						<radio class="red lc-radio" :class="radio=='wechat'?'checked':''" :checked="radio=='wechat'?true:false" value="wechat" />
					</view>
				</view>

				<view class="lc-pay-bar" @tap="payTap('alipay')">
					<view class="cu-avatar sm" style="background-image:url(/static/lcui/img/alipay.png)" />
					<view class="content">
						<view class="text-black">
							<text class="margin-right-sm">支付宝支付</text>
							<text class="cu-tag line-red radius sm">HOT</text>
						</view>
						<view class="text-gray text-sm">数亿用户都在用，安全可托付</view>
					</view>
					<view class="action">
						<radio class="red lc-radio" :class="radio=='alipay'?'checked':''" :checked="radio=='alipay'?true:false" value="alipay" />
					</view>
				</view>
			</radio-group>
		</view>

		<!--提示信息-->
		<view class="text-gray padding-sm text-sm">
			除平台自营外，应由卖方就所销售物品向买家出具发票等相关凭证。平台不代卖家承担任何责任。
		</view>

		<!--底部操作-->
		<view class="bg-white lc-footer-fixed lc-foot-padding-bottom">
			<view class="padding-sm flex flex-direction">
				<button class="cu-btn radius bg-red" @tap="payBtnTap">￥1 立即支付</button>
			</view>
		</view>

	</view>
</template>

<script>
	import barTitle from '@/components/lc-common/basics/bar-title';
	import _tool from '@/static/lcui/util/tools.js'; //工具函数
	export default {
		mounted() {
			const support_channel = ['alipay', 'wxpay']
			// #ifndef H5
			plus.payment.getChannels(channels => {
				this.channels = channels
			})
			// #endif
		},
		components: {
			barTitle,
		},
		data() {
			return {
				goodsList: [],
				checkAll: true,
				goods_img: '/static/images/home/goods/1.png',
				radio: 'wechat',
				channels: {}
			}
		},
		onLoad() {

		},
		onReady() {
			_tool.setBarColor(true);
			uni.pageScrollTo({
				scrollTop: 0,
				duration: 0
			});
		},
		methods: {
			RadioChange(e) {
				this.radio = e.detail.value;
			},
			orderNumber() {
				// 生成订单编号
				var d = new Date();
				var vYear = d.getFullYear();
				var vMon = d.getMonth() + 1;
				var vDay = d.getDate();
				var h = d.getHours();
				var m = d.getMinutes();
				var se = d.getSeconds();
				var ms = d.getMilliseconds();
				//随机数
				var rnadom = Math.floor(Math.random() * 10000000 + 10000000).toString();
				var billno = vYear + (vMon < 10 ? "0" + vMon : vMon) + (vDay < 10 ? "0" + vDay : vDay) + (h < 10 ? "0" + h : h) + (
					m < 10 ? "0" + m : m) + (se < 10 ? "0" + se : se) + ms;
				return billno + rnadom;
			},
			getPayChannel(bc_channel) {
				// 获取支付通道
				var bc_channel_id = '';
				switch (bc_channel) {
					case 'ALI_APP':
						bc_channel_id = 'alipay';
						break;
					case 'WX_APP':
						bc_channel_id = 'wxpay';
						break;
				}
				for (var i in this.channels) {
					if (this.channels[i].id == bc_channel_id) {
						return this.channels[i];
					}
				}
				return null;
			},
			payBtnTap() {
				const app_id = '44f01a13-965f-4b27-ba9f-da678b47f3f5'
				// const channel_id='ALI_APP'
				const channel_id = 'WX_APP'
				const payData = {
					app_id,
					channel: channel_id,
					title: '老张',
					total_fee: 100,
					bill_no: this.orderNumber(),
				}
				uni.request({
					url: '/dpc',
					data: JSON.stringify(payData),
					method: 'POST',
					header: {
						'content-type': 'application/json',
					},
					success: (data) => {
						let paySrc = '';
						if (data.resultCode === 0) {
							const payChannel = getPayChannel(payData.channel);
							if (payChannel) {
								//支付宝支付
								if (payChannel.id === 'alipay') {
									paySrc = data.order_string;
								} else {
									//微信支付
									var statement = {};
									statement.appid = data.app_id;
									statement.noncestr = data.nonce_str;
									statement.package = data.package;
									statement.partnerid = data.partner_id;
									statement.prepayid = data.prepay_id;
									statement.timestamp = parseInt(data.timestamp);
									statement.sign = data.pay_sign;
									paySrc = JSON.stringify(statement);
								}
								//支付弹出的页面
								//参数一：支付通道==> 支付是微信还是支付宝???
								//参数二：支付订单信息 ：请求接口返回过来数据的订单信息
								//参数三：请求支付成功回调函数
								//参数四：请求支付失败回调函数
								plus.payment.request(payChannel, paySrc, () => {
									console.log('支付成功')
								}, () => {
									console.log('支付失败')
								});
							}
						}
					}
				})



				// uni.navigateTo({
				// 	url: "/pages/status/pay_status"
				// });
			},
			payTap(type) {
				this.radio = type;
			}
		}
	}
</script>

<style lang="scss">
	/* #ifdef APP-PLUS */
	@import "../../static/colorui/main.css";
	@import "../../static/colorui/icon.css";
	@import "../../static/lcui/style/app.scss";
	/* #endif */
	@import "../../static/lcui/style/pay.scss";
</style>
