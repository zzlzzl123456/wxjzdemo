<template>
  <view>
    <uni-segmented-control :current="current" :values="items" @clickItem="onClickItem" styleType="button"
      activeColor="#4cd964"></uni-segmented-control>
    <view class="content">
      <view v-if="current === 0">
        <pay-book-item :bookTypeLsit="bookTypeLsit" :mark="mark" :book="book"></pay-book-item>
      </view>
      <view v-if="current === 1">
        <income-book-item :bookTypeLsit="bookTypeLsit" :mark="mark" :book="book"></income-book-item>
      </view>
    </view>
  </view>

</template>


<script>
  const db = uniCloud.database()
  export default {
    data() {
      return {
        msgType: "",
        bookType: "0",
        bookTypeLsit: "",
        mun2: 8,
        items: ['支付', '收入'],
        current: 0,
        styleType: 'button',
        activeColor: '#007aff',
        mark: "10",
        book:{
          bookId:'',
          _id:'',
          money:'',
          type:'',
          date:'',
          remarks:'',
        }
      }
    },
    methods: {
      onClickItem(e) {
        this.mu1 = this.mun2
        if (this.current != e.currentIndex) {
          console.log(e.currentIndex)
          this.current = e.currentIndex;
        }
        if (this.current === 0) {

          this.bookType = "0"
          this.getbooklist()
        } else if (this.current === 1) {
          this.bookType = "1"
          this.getbooklist()
        }
      },
      getbooklist() {
        db.collection("user-bookTypeList").where(`type=="${this.bookType}" && userId==$cloudEnv_uid`).get().then(
          res => {
            console.log(res)
            this.bookTypeLsit = res.result.data
          }).catch(res => {
          uni.showToast({
            title: "获取失败",
            icon: 'error'
          })
        })
      }
    },
    // onShow: function(option) {
    //   this.getbooklist()
    // },
    onLoad: function(option) {
       this.getbooklist()
       console.log(option.remarks)
      if(option.mark !=null){
        let type = option.bookType
        console.log(123)
        this.book.type=type
        this.book._id=option.bookTypeId
        this.book.bookId=option.bookId
        this.book.date=option.date
        this.book.money=option.money
        this.book.remarks=option.remarks
        type = parseInt(type)
        this.current = type
        this.mark=option.mark
        
      }
    },
    onShow() {
       this.getbooklist()
    }
  }
</script>

<style lang="scss">
</style>

<style>

</style>