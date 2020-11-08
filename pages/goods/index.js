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
