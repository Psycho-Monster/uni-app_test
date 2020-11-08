<template>
	<view>
		<!-- tabId 来决定哪个组件显示 v-if 动态加载组件-->
		<!--首页-->
		<home :scrollY="scrollY" :scrollBottom="scrollBottom" :show="tabID==0?true:false" v-if="loadOn.home" />

		<!--发现-->
		<find :scrollY="scrollY" :scrollBottom="scrollBottom" :show="tabID==1?true:false" v-if="loadOn.find" />

		<!--发布闲置-->
		<sell :scrollY="scrollY" :scrollBottom="scrollBottom" :show="tabID==2?true:false" v-if="loadOn.sell" @closeTap="sellCloseTap" />

		<!--消息-->
		<news :scrollY="scrollY" :scrollBottom="scrollBottom" :show="tabID==3?true:false" v-if="loadOn.news" />

		<!--我的-->
		<my :scrollY="scrollY" :scrollBottom="scrollBottom" :show="tabID==4?true:false" v-if="loadOn.my" />

		<!--底部导航-->
		<footer-tabbar :tabID='tabID' :msgDot='msgDot' @tabTap='tabTap' />
	</view>
</template>

<script>
	//加载组件
	import home from '@/components/lc-common/view/home';
	import find from '@/components/lc-common/view/find';
	import sell from '@/components/lc-common/view/sell';
	import news from '@/components/lc-common/view/news';
	import my from '@/components/lc-common/view/my';

	//固定组件
	import footerTabbar from '@/components/lc-common/footer/footer-tabbar';

	//工具函数
	import _tool from '@/static/lcui/util/tools.js';
	export default {
		components: {
			home,
			find,
			sell,
			news,
			my,
			footerTabbar,
		},
		data() {
			return {
				loadOn: {
					home: true,
					find: false,
					sell: false,
					news: false,
					my: false
				},
				scrollY: 0,
				scrollBottom: 0,
				tabID: 0,
				tabIndex: 0,
				msgDot:true
			}
		},
		onReady() {
			_tool.setBarColor(true);
		},
		methods: {
			tabTap(index) {
				// 这里有个bug，到最后loadOn里所有属性都会设为true，达不到动态加载的效果
				
				// 将原来的tabId值存入tabIndex中
				this.tabIndex = this.tabID;
				// 判断加载渲染
				if (index == 1 && !this.loadOn.find) {
					this.loadOn.find = true;
				}
				if (index == 2 && !this.loadOn.sell) {
					this.loadOn.sell = true;
				}
				if (index == 3 && !this.loadOn.news) {
					this.loadOn.news = true;
				}
				if (index == 4 && !this.loadOn.my) {
					this.loadOn.my = true;
				}
				// 切换显示
				this.tabID = index;
				//设置颜色
				if (index == 0) {
					_tool.setBarColor(false);
				}
				if (index == 1 || index == 2 || index == 3) {
					_tool.setBarColor(true);
				}
				if (index == 4) {
					_tool.setBarColor(false);
				}
				// 切换设置滚动位置
				uni.pageScrollTo({
					scrollTop: 0,
					duration: 0
				});
			},
			sellCloseTap() {
				this.tabTap(this.tabIndex);
			},
		},
		onPageScroll(e) {
			// console.log(e.scrollTop,'e.scrollTop')
			this.scrollY = e.scrollTop;
		},
		onReachBottom(e) {
			let timestamp = new Date().getTime();
			this.scrollBottom = timestamp;
		},
	}
</script>

<style lang="scss">

</style>
