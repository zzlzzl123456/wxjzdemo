<template>
  <view>
    <view class="top-box">
      <view class="image-box">
        <image :src="bookTypeIcon"></image>
      </view>
      <view><text>{{name}}</text></view>
    </view>
    <view class="edit-box">
      <view><text>类型</text>{{bookType==0?'支出':'收入'}}</view>
      <view><text>金额</text>{{bookType==0?-money:money}}</view>
      <view><text>日期</text>{{date}}</view>
      <view><text>备注</text>{{remarks}}</view>
    </view>
    <view class="bottom-box">
      <button @click="editClick"><text>编辑</text></button>
      <button @click="deleteClick('warn')"><text>删除</text></button>
    </view>
    <view>
      <!-- 提示窗示例 -->
      <uni-popup ref="alertDialog" type="dialog">
        <uni-popup-dialog :type="msgType" cancelText="取消" confirmText="确认" title="提示" content="确认删除这条记录"
          @confirm="dialogConfirm" @close="dialogClose"></uni-popup-dialog>
      </uni-popup>
    </view>
  </view>
</template>

<script>
  const db = uniCloud.database()
  export default {
    data() {
      return {
        msgType: "",
        date: "",
        bookTypeIcon: "",
        bookType: '',
        money: '',
        remarks: '',
        bookTypeId: '',
        bookId: '',
      }
    },
    methods: {
      editClick() {
        uni.navigateTo({
          url: `/pages/addBook/addBook?money=${this.money}&remarks=${this.remarks}&date=${this.date}&bookType=${this.bookType}&mark=${this.bookType}&bookTypeId=${this.bookTypeId}&bookId=${this.bookId}`
        })
      },
      deleteClick(type) {
        this.msgType = type
        this.$refs.alertDialog.open()
      },
      dialogConfirm() {
        console.log('点击确认')
        db.collection('user-bookList').where(`_id=="${this.bookId}" && userId==$cloudEnv_uid`).remove().then(res => {
          uni.navigateBack()
        }).catch(err=>{
          uni.showToast({
            title:"删除失败",
            icon:'error'
          })
        })
      },
      dialogClose() {
        console.log('点击关闭')
      },
    },
    onLoad: function(option) {
      this.money = option.money
      this.name = option.name
      this.bookType = option.bookType
      this.bookTypeIcon = option.bookTypeIcon
      this.remarks = option.remarks
      this.date = option.date
      this.bookTypeId = option.bookTypeId
      this.bookId = option.bookId
      console.log(this.remarks)
      // console.log(this.bookId)
    }
  }
</script>

<style lang="scss" scoped>
  .top-box {
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    width: 100%;
    height: 200rpx;
    background-color: gold;
  }

  .image-box {
    width: 140rpx;
    height: 140rpx;
    padding: 20rpx;
    box-sizing: border-box;
    border-radius: 70rpx;
    border: 1rpx red solid;
    background-color: ghostwhite;

    image {
      width: 100rpx;
      height: 100rpx;
    }
  }

  .edit-box {
    view {
      display: flex;
      justify-content: left;
      align-items: center;
      width: 100%;
      height: 100rpx;
      border-bottom: 1rpx dotted gainsboro;
      padding: 20rpx;

      text {
        margin-right: 40rpx;
        color: grey;
      }
    }
  }

  .bottom-box {
    position: fixed;
    bottom: calc(var(--window-bottom) + 20px);
    width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
    bottom: 0rpx;

    button {
      width: 50%;
    }

    ;
  }

  .affirm-box {
    margin-top: 80rpx;
  }
</style>