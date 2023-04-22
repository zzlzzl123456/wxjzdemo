<template>
  <view>
    <view class="tabs_wrapper">
      <text :class="bookType == 0 ? 'active' : ''" @click="changeTab" data-type="0">支出</text>
      <text :class="bookType == 1 ? 'active' : ''" @click="changeTab" data-type="1">收入</text>
    </view>
    <view class="book_list" v-for="(item,index) in bookTypeLsit">
      <bookList-item :bookTypeitem="item"></bookList-item>
    </view>
    <view class="add-btn">
      <button type="primary" @click="addbookType">新增</button>
    </view>
  </view>
</template>

<script>
  const db = uniCloud.database()
  export default {
    data() {
      return {
        activeTab: '0',
        activeType: '-1',
        bookType: "",
        bookTypeLsit:"",
      }
    },
    methods: {
      changeTab(e) {
        //切换tab
        let type = e.currentTarget.dataset.type;
        console.log(type)
        this.bookType = type
        if (type != this.activeTab) {
          this.activeTab = type,
            this.activeType = -1
        }
        this.getbooklist()
      },
      addbookType() {
        uni.navigateTo({
          url: `/pages/addBook/addBookType/addBookType?bookType=${this.bookType}`,

        })
      },
      getbooklist() {
        db.collection("user-bookTypeList").where(`type=="${this.bookType}" && userId==$cloudEnv_uid`).get().then(res => {
          console.log(res)
          this.bookTypeLsit=res.result.data
        }).catch(res=>{
          uni.showToast({
            title:"获取失败",
            icon:'error'
          })
        })
      },
    },
    onLoad: function(option) {
      this.bookType = option.bookType
      console.log(this.bookType)
    },
    onShow() {
       this.getbooklist()
    }
  }
</script>

<style lang="scss" scoped>
  .tabs_wrapper {
    position: fixed;
    z-index: 9999;
    left: 0;
    display: flex;
    justify-content: center;
    width: 100%;
    height: 80rpx;
    background: #ffd700;
  }

  .tabs_wrapper text {
    width: 100rpx;
    height: 80rpx;
    line-height: 80rpx;
    font-size: 30rpx;
    text-align: center;
  }

  .tabs_wrapper text.active {
    border-bottom: 4rpx solid #666;
  }

  .book_list {
    margin: 5rpx;
    position: relative;
    top: 100rpx;
  }

  .add-btn {
    position: fixed;
    z-index: 9999;
    top: 80%;
    left: 10%;
    width: 80%;
  }
</style>