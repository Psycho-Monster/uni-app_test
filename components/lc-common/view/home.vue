<template>
	<view class="lc-home-box" :class="show?'show':''">
		<!--欢迎,props传值和子组件传递数据给父组件emit和事件的监听-->
		<welcome-tip content="中午好,小飞机" :show="true" :c_s="3000" @closeFinish="welcomeClose" />

		<!--轮播背景-->
		<swiper-background :list_data="swiperInfo.list" :indexs="swiperInfo.index" :show="swiperInfo.show" :welcome="swiperInfo.welcome" />

		<view class="lc-head-search-box" :class="headInfo.Class" :style="[{backgroundColor:'rgba(229, 77, 66,'+ headInfo.opacity +')'}]">

			<!--小程序端的标题-->
			<!-- #ifdef MP -->
			<view class="text-center text-white lc-small-routine-title">首页</view>
			<!-- #endif -->

			<!--搜索框-->
			<view class="cu-bar search lc-search-box">
				<view class="search-form round" @tap="searchTap">
					<text class="cuIcon-search" />
					<text>口罩</text>
				</view>
				<view class="action text-white">领现金</view>
			</view>

			<!--选项卡-->
			<view class="lc-flex-tab show">
				<view class="flex text-white">
					<view class="basis-xxl">
						<!-- scroll-left 设置横向滚动条位置
							scroll-with-animation 在设置滚动条位置时使用动画过渡
						-->
						<scroll-view 
						scroll-x 
						class="nav z" 
						scroll-with-animation 
						:scroll-left="headTab.scrollLeft"
						>
							<block v-for="(item,index) in headTab.list" :key="index">
								<view 
								class="cu-item" 
								:class="index==headTab.TabCur?'select':''" 
								@tap="tabSelect" 
								:data-id="index"
								>
									<view>{{item}}</view>
									<view class="tab-dot bg-white" />
								</view>
							</block>
						</scroll-view>
					</view>
					<view class="basis-xxs">
						<view class="sort-icon" @tap="sortVueTap">
							<text class="cuIcon-sort" />
						</view>
					</view>
				</view>
			</view>
		</view>

		<!--中间内容区域-->
		<view class="lc-view-content" :class="[viewContent.welcome?'welcome':'',headTab.TabCur==0?'show':'']">
			<!--轮播图-->
			<view class="lc-swiper-box">
				<swiper 
				class="screen-swiper square-dot c" 
				autoplay 
				circular 
				indicator-dots 
				:current="swiperInfo.index" 
				@change="swiperChange"
				>
					<swiper-item v-for="(item,index) in swiperInfo.list" :key="index">
						<view class="swiper-padding">
							<image :src="item.swiper" mode="widthFix" />
						</view>
					</swiper-item>
				</swiper>
			</view>

			<!--滑动菜单-->
			<grid-menu-list :list_data='gridMenuData' @listTap='gridMenuTap' />

			<!--红包块-->
			<view class="bg-red margin radius padding-sm">
				<image class="red-envelopes" src="/static/images/home/sundry/2.png" mode="widthFix" />
			</view>

			<!--免费鉴别-->
			<identify-list :list_data='identifyData' @listTap='identifyTap' />

			<!--省心快卖-->
			<sell-quickly-list :list_data='quickly' @listTap='quicklyTap' />

			<!--活动区域-->
			<activity-list :list_data='activity' @listTap='activityTap' />

			<!--商品tab-->
			<view class="lc-goods-tab-box">
				<scroll-view scroll-x class="nav z margin-tb-sm">
					<view class="flex text-center">
						<block v-for="(item,index) in goodsTabData.list" :key="index">
							<view class="cu-item flex-sub nf" :class="index==goodsTabData.TabCur?'select':''" @tap="goodsTab" :data-id="index">
								<view class="cu-tag badge z bg-gradual-pink" v-if="item.tag">{{item.tag}}</view>
								<view :class="index == goodsTabData.TabCur?'text-red':''">{{item.title}}</view>
								<view class="tab-dot bg-red" />
							</view>
						</block>
					</view>
				</scroll-view>
			</view>

			<view class="lc-tab-list">
				<!--商品列表-->
				<goods-list :list_data="goodsData" @listTap="goodsListTap" :show="goodsTabData.TabCur!=2 && goodsTabData.TabCur!=4?true:false" />

				<!--直播列表-->
				<live-list :list_data="liveData" @listTap="liveListTap" :show="goodsTabData.TabCur==2?true:false" />

				<!--视频列表-->
				<video-list :list_data="videoData" @listTap="videoListTap" :show="goodsTabData.TabCur==4?true:false" />
			</view>

			<!--占位底部距离-->
			<view class="cu-tabbar-height" />
		</view>

		<!--中间内容区域-分类-->
		<view class="lc-view-content" :class="headTab.TabCur!=0?'show':''">

			<!--宫格分类-->
			<grid-sort-list :list_data="gridSortData" @listTap="gridSortTap" />

			<!--广告-->

			<view class="margin">
				<image class="lc-ad-img" src="/static/images/home/swiper/swiper-1.png" mode="widthFix" />
			</view>

			<!--标题-->
			<view class="margin-bottom-sm lc-tab-list-title">
				<view class="flex flex-wrap">
					<view class="basis-sm text-right">
						<image class="img-aau" src="/static/lcui/img/aau.png" lazy-load mode="widthFix" />
					</view>
					<view class="basis-xs text-center">
						<text class="text-black text-xl text-bold">为您推荐</text>
					</view>
					<view class="basis-sm text-left">
						<image class="img-aau" src="/static/lcui/img/aau.png" lazy-load mode="widthFix" />
					</view>
				</view>
			</view>

			<!--商品列表-->
			<goods-list :list_data="goodsData" @listTap="goodsListTap" />

			<!--占位底部距离-->
			<view class="cu-tabbar-height" />
		</view>

		<!--弹出框-->
		<modal-img :show="modalShow" src="/static/images/home/sundry/tankuang.png" @imgTap="imgTap" @closeTap="closeTap" />



	</view>
</template>

<script>
	//加载组件  
	import welcomeTip from '@/components/lc-common/basics/welcome-tip';
	import swiperBackground from '@/components/lc-common/basics/swiper-background';
	import gridMenuList from '@/components/lc-common/list/grid-menu-list';
	import identifyList from '@/components/lc-common/list/identify-list';
	import sellQuicklyList from '@/components/lc-common/list/sell-quickly-list';
	import activityList from '@/components/lc-common/list/activity-list';
	import goodsList from '@/components/lc-common/list/goods-list';
	import liveList from '@/components/lc-common/list/live-list';
	import videoList from '@/components/lc-common/list/video-list';
	import footerTabbar from '@/components/lc-common/footer/footer-tabbar';
	import gridSortList from '@/components/lc-common/list/grid-sort-list';
	import modalImg from '@/components/lc-common/basics/modal-img';
	//======================================================================
	import _home_data from '@/static/lcui/data/home.js'; //虚拟数据
	import _tool from '@/static/lcui/util/tools.js';
	export default {
		name: 'home',
		components: {
			welcomeTip,
			swiperBackground,
			gridMenuList,
			identifyList,
			sellQuicklyList,
			activityList,
			goodsList,
			liveList,
			videoList,
			footerTabbar,
			gridSortList,
			modalImg
		},
		data() {
			return {
				swiperInfo: {
					index: 0,
					show: true,
					welcome: true,
					list: []
				},
				headInfo: {
					Class: "",
					opacity: 0,
				},
				goodsShow: true,
				headTab: {
					TabCur: 0,
					scrollLeft: 0,
					list: []
				},
				viewContent: {
					welcome: true,
				},
				gridMenuData: [],
				identifyData: [],
				quickly: {},
				activity: [],
				goodsTabData: {
					TabCur: 0,
					list: []
				},
				goodsData: [],
				liveData: [],
				videoData: [],
				gridSortData: [],
				modalShow: true,
			}
		},
		props: {
			show: {
				type: Boolean,
				default: true
			},
			scrollY: {
				type: Number,
				default: 0
			},
			scrollBottom: {
				type: Number,
				default: 0
			}
		},
		watch: {
			scrollY() {
				//通知他妈的滚动了。
				this.setPageScroll(this.scrollY);
			},
			scrollBottom() {
				if (this.scrollBottom != 0) {
					//通知他妈的触底了
					this.setReachBottom();
				}
			},
		},
		created() {
			//加载虚拟数据
			this.headTab.list = _home_data.tab();
			this.swiperInfo.list = _home_data.swiper();
			this.gridMenuData = _home_data.nav();
			this.identifyData = _home_data.live();
			this.quickly.swiper = _home_data.earn();
			this.quickly.list = _home_data.sellQuickly();
			this.activity = _home_data.activity();
			this.goodsTabData.list = _home_data.goodsTab();
			//商品列表数据
			let GoodsData = _home_data.goodsList();
			//推荐感兴趣数据
			let recommendData = _home_data.recommend();
			//把推荐感兴趣的数据，添加到商品数据里，可扩展为随机位置显示。
			GoodsData.splice(1, 0, recommendData);
			this.goodsData = GoodsData;
			this.headInfo.Class = 'welcome';
		},
		mounted() {
			uni.pageScrollTo({
				scrollTop: 0,
				duration: 0
			});
			//次级虚拟数据加载
			this.liveData = _home_data.liveData();
			this.videoData = _home_data.videoData();
			this.gridSortData = _home_data.gridSortData();
		},
		methods: {
			//页面被滚动
			setPageScroll(scrollTop) {
				//console.log(scrollTop);
				if (this.headTab.TabCur == 0) {
					if (scrollTop <= 100) {
						let num = scrollTop / 100;
						this.headInfo.opacity = num;
					} else if (scrollTop > 100) {
						this.headInfo.opacity = 1;
					}
				}
			},
			//触底了
			setReachBottom() {
				// console.log('触底了');
			},
			//欢迎提示关闭事件
			welcomeClose(bol) {
				this.swiperInfo.welcome = bol;
				this.headTab.welcome = bol;
				let Class = this.headInfo.Class;
				this.headInfo.Class = Class.replace(/welcome/g, '');
				this.viewContent.welcome = bol;
				//设置颜色
				_tool.setBarColor(false);
				// console.log(bol);
			},
			//搜索框下的tab菜单被点击
			tabSelect(e) {
				let index = e.currentTarget.dataset.id;
				this.headTab.TabCur = index;
				this.headTab.scrollLeft = (index - 1) * 60;
				if (index == 0) {
					this.swiperInfo.show = true;
					this.headInfo.opacity = 0;
				} else {
					this.swiperInfo.show = false;
					this.headInfo.opacity = 1;
				}
				uni.pageScrollTo({
					scrollTop: 0,
					duration: 0
				});
			},
			swiperChange(e) {
				this.swiperInfo.index = e.detail.current;
			},
			gridMenuTap(e) {
				// console.log(e);
				uni.navigateTo({
					url: "/pages/home/sort_list"
				});
			},
			identifyTap(e) {
				// console.log(e);
			},
			quicklyTap(e) {
				// console.log(e);
			},
			activityTap(e) {
				// console.log(e);
			},
			//商品列表上的分类tab被点击
			goodsTab(e) {
				this.goodsTabData.TabCur = e.currentTarget.dataset.id;
				// #ifdef H5
				uni.pageScrollTo({
					scrollTop: 1060,
					duration: 200
				});
				// #endif

				// #ifdef APP-PLUS
				uni.pageScrollTo({
					scrollTop: 1010,
					duration: 200
				});
				// #endif
			},
			goodsListTap(e) {
				// console.log(e);
				if (e.index == 0) {
					uni.navigateTo({
						url: '/pages/goods/goods'
					});
				} else if (e.index == 2) {
					uni.navigateTo({
						url: '/pages/goods/second_hand'
					});
				} else if (e.index == 3) {
					uni.navigateTo({
						url: '/pages/goods/second_terrace'
					});
				} else {

				}
			},
			liveListTap(e) {
				// console.log(e);
			},
			videoListTap(e) {
				// console.log(e);
			},
			gridSortTap(e) {
				// console.log(e);
			},
			rewardTap() {
				uni.navigateTo({
					url: "/pages/goods/reward"
				});
			},
			imgTap() {
				this.modalShow = false;
				uni.navigateTo({
					url: "/pages/goods/reward"
				});
				// console.log('图片被点击');
			},
			closeTap() {
				this.modalShow = false;
				// console.log('点击了关闭');
			},
			sortVueTap() {
				uni.navigateTo({
					url: "/pages/home/sort"
				});
			},
			searchTap() {
				uni.navigateTo({
					url: "/pages/home/search"
				});
			}
		}
	}
</script>

<style lang="scss" scoped>
	.lc-head-search-box {
		position: fixed;
		width: 100%;
		top: 0;
		z-index: 9999;
		background-color: rgba(229, 77, 66, 0);
		padding-top: var(--status-bar-height);
		transition: top .25s;
		padding-bottom: 10rpx;

		.lc-search-box {
			position: relative;
		}

		.lc-flex-tab {
			position: relative;
			transition: opacity .25s;

			.flex {
				.basis-xxl {
					flex-basis: 90%;
					width: 90%;
					z-index: 1;
				}

				.basis-xxs {
					flex-basis: 10%;
					z-index: 1;
					width: 10%;
				}

				.sort-icon {
					font-size: 55rpx;
					height: 64rpx;
					line-height: 64rpx;
					text-align: center;
				}
			}
		}
	}

	.lc-head-search-box.welcome {
		top: calc(var(--status-bar-height) + 101rpx);
		transition: top .25s;
	}

	.lc-view-content {
		display: none;
		width: 100%;

		/* #ifdef APP-PLUS */
		margin-top: calc(var(--status-bar-height) + 30rpx);
		/* #endif */

		/* #ifdef H5 */
		margin-top: calc(var(--status-bar-height) + 70rpx);
		/* #endif */

		/* #ifdef MP */
		margin-top: calc(var(--status-bar-height) + 85rpx);
		/* #endif */

		.lc-tab-list {
			position: relative;
			width: 100%;
		}
	}

	.lc-view-content.welcome {
		/* #ifdef APP-PLUS */
		margin-top: calc(var(--status-bar-height) + 180rpx);
		/* #endif */

		/* #ifdef H5 */
		margin-top: calc(var(--status-bar-height) + 220rpx);
		/* #endif */

		/* #ifdef MP */
		margin-top: calc(var(--status-bar-height) + 220rpx);
		/* #endif */

		transition: all .25s;
	}

	.lc-view-content.show {
		display: block;
	}

	.lc-swiper-box {
		width: 100%;

		.screen-swiper {
			height: 230rpx;
			min-height: 230rpx;

			.swiper-padding {
				padding: 0 25rpx;
			}
		}
	}

	.red-envelopes {
		width: 100%;
	}

	.lc-goods-tab-box {
		position: sticky;
		padding: 2rpx 0;
		transition: all .25s;
		z-index: 9999;
		background: #fff;

		/* #ifndef MP */
		top: calc(var(--status-bar-height) + 101rpx);
		/* #endif */

		/* #ifdef MP */
		top: calc(var(--status-bar-height) + 161rpx);
		/* #endif */

		.cu-tag.z {
			top: 0px;
			right: -32.72rpx;
			font-size: 20rpx;
			padding: 19rpx 6rpx;
			transform: scale(0.8);
		}
	}

	.lc-ad-img {
		width: 100%;
	}

	.lc-tab-list-title {
		.img-aau {
			width: 101.81rpx;
			margin-top: 12.72rpx;
		}

		.text-right {
			.img-aau {
				margin-right: 14.54rpx;
			}
		}

		.text-left {
			.img-aau {
				margin-left: 14.54rpx;
			}
		}
	}

	.lc-add-btn-view-box {
		position: fixed;
		z-index: 999999;
		bottom: 181.81rpx;
		right: 27.27rpx;

		.cu-btn {
			margin: auto;
			width: 81.81rpx;
			height: 81.81rpx;
			font-weight: 800;
			border-radius: 50%;
			font-size: 36.36rpx;
			border: 9.09rpx solid #fff;
			box-shadow: 0 0 14.54rpx 7.27rpx #d0d0d0;
		}
	}

	.lc-home-box {
		display: none;
	}

	.lc-home-box.show {
		display: block;
	}
</style>
