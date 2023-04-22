<template>
  <view class="singleBox">
    <view class="pic">
      <image src='../../static/logo.png' mode="aspectFill"></image>
    </view>
    <view class="progress-box">
      <text>微博</text>
      <progress :percent="pgList[0]" show-info stroke-width="3" />
    </view>
  </view>
</template>

<script>
  export default {
    name: "charts-listBox",
    data() {
      return {
          pgList:[30],
      };
    }
  }
</script>

<style lang="scss" >
  .singleBox{
    display: flex;
    .pic{
      width: 100rpx;
      height: 100rpx;
      image{
        width: 100%;
        height: 100%;
      }
    }
    .progress-box{
      padding: 10rpx;
      width: 550rpx;
      height: 100rpx;
    }
  }

</style>