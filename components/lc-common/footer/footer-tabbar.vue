<template>
	<view class="cu-bar tabbar bg-white lc-footer-fixed">
		<view class="cu-bar tabbar bg-white lc-footer-fixed">
			<view class="action" :class="tabID == 0?'text-red':'text-black'" @tap="tabTap(0)">
				<view :class="tabID == 0?'cuIcon-homefill':'cuIcon-home'"></view>
				<text>首页</text>
			</view>
			<view class="action" :class="tabID == 1?'text-red':'text-black'" @tap="tabTap(1)">
				<view :class="tabID == 1?'cuIcon-discoverfill':'cuIcon-discover'"></view>
				<text>发现</text>
			</view>
			<view class="action add-action" @tap="tabTap(2)">
				<button class="cu-btn cuIcon-add bg-red shadow"></button>
				<text>发布闲置</text>
			</view>
			<view class="action" :class="tabID == 3?'text-red':'text-black'" @tap="tabTap(3)">
				<view :class="tabID == 3?'cuIcon-messagefill':'cuIcon-message'">
					<!-- 通过msgDot来显示红色的点 -->
					<view class="cu-tag badge" v-if="msgDot"></view>
				</view>
				<text>消息</text>
			</view>
			<view class="action" :class="tabID == 4?'text-red':'text-black'" @tap="tabTap(4)">
				<view :class="tabID == 4?'cuIcon-peoplefill':'cuIcon-people'"></view>
				<text>我的</text>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		name: 'footer-tabbar',
		// data() {
		// 	return {
		// 		TabID: 0, MsgDot: false,
		// 	};
		// },
		props: {
			tabID: {
				type: [String,Number],
				default: 0
			},
			msgDot: {
				type: Boolean,
				default: false
			},
		},
		// created() {
		// 	// 传入的props值要发生改变，所以得存入组件的data对象里，变为自身的组件状态
		// 	this.TabID = this.tabID;
		// 	this.MsgDot = this.msgDot;
		// },
		// watch: {
		// 	tabID() {
		// 		if(this.tabID != 2) {
		// 			this.TabID = this.tabID;
		// 		}
		// 	},
		// 	msgDot() {
		// 		this.MsgDot = this.msgDot;
		// 	}
		// },
		methods: {
			tabTap(index) {
				// if(index != this.TabID) {
				// 	// 子组件触发父组件的函数
				// 	this.$emit('tabTap', index);
				// }
				if(index != this.tabID) {
					// 子组件触发父组件的函数
					this.$emit('tabTap', index);
				}
			}
		}
	}
</script>

<style>
	
</style>
