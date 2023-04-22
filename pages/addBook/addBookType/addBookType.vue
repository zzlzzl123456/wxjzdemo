<template>
  <view>
    <view class="box">
      <view>
        <view><text>分类名称:</text></view>
        <view><input class="uni-input" focus :placeholder="bookTypeName==null ?'请输入':bookTypeName" style="text-align:right" @input="onKeyInput"></view>
      </view>
      <view>
        <view><text>收支类型:</text></view>
        <view><text>{{bookType==0 ? "支出":"收入"}}</text></view>
      </view>
      <view>
        <view><text>分类图标:</text></view>
        <view><text v-show="activeType==-1">点击下方图标选择</text>
          <view class="icon_item" style="background-color: aqua;" v-show="activeType!=-1">
            <image class="icon_image" mode="aspectFit" :src="selectIocm"></image>
          </view>
        </view>
      </view>
    </view>
    <view class="icon_box">
      <view v-for="(item,index) in bookIconList" :class="['icon_item',activeType==index?'active':'']"
        @click="clickItem(index,item)">
        <image class="icon_image" :src="item.icon" mode="aspectFit"></image>
      </view>
    </view>
    <view>
      <button type="primary" @click="submit">确定</button>
    </view>
  </view>
</template>

<script>
      const db = uniCloud.database()
  export default {
    data() {
      return {
        activeType: '-1',
        bookType: "",
        selectIocm: "",
        bookTypeName: "",
        bookIconList: "",
        mark:"",
        bookTypeId:""
      }
    },
    methods: {
      onKeyInput: function(event) {
        this.bookTypeName = event.target.value
        console.log(this.bookTypeName)
      },
      clickItem(index, item) {
        this.activeType = index
        this.selectIocm = item.icon
        console.log(this.activeType)
        console.log(this.selectIocm)
      },
      submit() {
        console.log(this.bookType+"1111111111111111")
        if(this.mark==1){
          db.collection('user-bookTypeList').where(`_id=="${this.bookTypeId}" && userId==$cloudEnv_uid`).update({
            type:this.bookType,
            name:this.bookTypeName,
            icon:this.selectIocm,
          }).then(res=>{
            uni.showToast({
            	title: '修改成功',
            	duration: 2000,
            });
          }).catch(err=>{
            uni.showToast({
            	title: '修改失败',
            	duration: 2000,
             icon:"error"
            });
          })
        }else{
           db.collection('user-bookTypeList').add({
             type:this.bookType,
             name:this.bookTypeName,
             icon:this.selectIocm,
           }).then(res=>{
             uni.showToast({
             	title: '添加成功',
             	duration: 2000,
             });
           }).catch(err=>{
           uni.showToast({
           	title: '添加失败',
           	duration: 2000,
            icon:"error"
           });
           })}
      },
      getIcon(){
        db.collection("sys-icon").get().then(res=>{
          this.bookIconList=res.result.data
          console.log(this.bookIconList)
        })
      }
    },
    onLoad: function(option) {
      this.bookType = option.bookType
      this.bookTypeName=option.name
      this.mark=option.mark
      this.bookTypeId=option.id
      console.log(this.mark)
     this.getIcon()
      
    },
    
  }
</script>

<style lang="scss" scoped>
  .box {
    margin: 0rpx 10rpx;
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex-direction: column;

    text,
    input {
      font-size: 40rpx;
    }
  }

  .box>view {
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;
    height: 100rpx;
    border-bottom: 1rpx gainsboro solid;
  }

  .icon_box {
    margin: 50rpx auto;
    display: flex;
    align-items: center;
    flex-flow: row wrap;
    width: 95%;
    left: 5%;
  }

  .icon_item {
    margin: 20rpx;
    padding: 10rpx;
    box-sizing: border-box;
    height: 70rpx;
    width: 70rpx;
    border-radius: 35rpx;
    border: 1rpx red solid;
    background-color: gainsboro;

    image {
      height: 50rpx;
      width: 50rpx;
    }
  }

  .active {
    background: #ffd700;
  }
</style>