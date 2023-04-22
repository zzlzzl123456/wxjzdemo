<template>
  <view class="box">
    <view class="header_wrapper">
      <view class="header_item header_date">
        <text>{{selectYear}}年</text>
        <picker mode="date" :value="date" fields="month" @change="selectDate">
          <text class="header_date_month">{{selectMonth}}月</text>
        </picker>
      </view>
      <view class="header_item">
        <text>收入</text>
        <text class="last">{{incomeAmt}}</text>
      </view>
      <view class="header_item">
        <text>支出</text>
        <text class="last">{{payAmt}}</text>
      </view>
    </view>
    <view class="padding_120"></view>
    <!-- 列表 -->
    <view class="book_list_wrapper clearfix" v-for="(item,index1) in  bookList" :key="item">
      <view class="book_list_header">
        <text class="book_list_left">{{selectMonth}}月{{item.date}}日 </text>
        <text class="book_list_right"><span
            style="margin-right:30rpx;">{{item.incomeAmt!=0.00?'收入：'+item.incomeAmt:''}}</span>
          {{item.payAmt!=0.00?'支出：'+item.payAmt:''}}</text>
      </view>
      <view class="book_list_item" v-for="(list,index2) in item.subList" :key="list" @click="goBookDetail(list,index2)">
        <view class="icon_wrapper">
          <image :src="list.bookTypeId[0].icon"></image>
        </view>
        <text>{{list.remarks?list.remarks:list.bookTypeId[0].name}}</text>
        <text
          class="book_list_item_amt">{{list.type==0?-(list.money/100).toFixed(2):(list.money/100).toFixed(2)}}</text>
      </view>
    </view>
  </view>
</template>

<script>
  export default {
    data() {
      const currentYear = this.getYear()
      const currentMonth = this.getMonth()
      return {
        footerIndex: 0,
        selectYear: currentYear,
        selectMonth: currentMonth,
        bookList: [],
        incomeAmt: 0,
        payAmt: 0,
        date: '',
        test: "icon_01",
        refresh: '',
      }
    },
    methods: {
      selectDate(e) {
        let value = e.detail.value;
        console.log(value)
        value = value.split('-');
        this.selectYear = value[0]
        this.selectMonth = value[1]
        this.getBookList()
      },
      getYear() {
        const date = new Date();
        let year = date.getFullYear();
        return `${year}`;
      },
      getMonth() {
        const date = new Date();
        let month = date.getMonth() + 1;
        month = month > 9 ? month : '0' + month
        return `${month}`;
      },
      goBookDetail(list,index2) {
        console.log(list)
        console.log(index2)
    
        // if(list.remarks==null){
          
        // }
        uni.navigateTo({
          url: `/pages/index/bookDetail/bookDetail?bookTypeIcon=${list.bookTypeId[0].icon}&bookType=${list.bookTypeId[0].type}&money=${(list.money/100).toFixed(2)}&date=${list.recordDate}&remarks=${list.remarks}&name=${list.bookTypeId[0].name}&bookTypeId=${list.bookTypeId[0]._id}&bookId=${list._id}`
        })
      },
      getBookList() {
        //this.selectMonth = this.selectMonth > 9 ? month : '0' + this.selectMonth;
        let date = this.selectYear + '-' + this.selectMonth
        console.log(date)
        uniCloud.callFunction({
          name: "TestData",
          data: {
            keyword: date
          }
        }).then(res => {
          this.bookList = res.result
          console.log(this.bookList)
          let incomeAmt1 = 0
          let payAmt1 = 0
          for (let i in this.bookList) {
            incomeAmt1 += this.bookList[i].incomeAmt * 1
            payAmt1 += this.bookList[i].payAmt * 1
          }
          this.payAmt = payAmt1.toFixed(2)
          this.incomeAmt = incomeAmt1.toFixed(2)
        })
      }
    },
    onLoad: function(option) {},
    onHide() {

    },
    onShow() {
      this.getBookList()
    }
  }
</script>

<style lang="scss">
  .padding_120 {
    width: 100%;
    height: 120rpx;
  }

  .header_wrapper {
    position: fixed;
    left: 0;
    width: 100%;
    height: 120rpx;
    background: #ffd700;
    z-index: 9999;
  }

  .header_item {
    padding-top: 10rpx;
    box-sizing: border-box;
    float: left;
    width: 40%;
    height: 100rpx;
    text-align: left;
  }

  .header_item.header_date {
    width: 20%;
    text-align: center;
  }

  .header_item text {
    display: block;
    width: 100%;
    height: 50rpx;
    line-height: 50rpx;
    font-size: 24rpx;
  }

  .header_item text.header_date_month {
    position: relative;
    font-size: 30rpx;
  }

  .header_item text.header_date_month::after {
    position: absolute;
    top: 20rpx;
    right: 18rpx;
    content: '';
    border: 10rpx solid transparent;
    border-top-color: #000;
  }

  /* 列表 */
  .book_list_wrapper {
    width: 100%;
  }

  .book_list_header {
    width: 100%;
    height: 80rpx;
    border-bottom: 1rpx solid #eee;
    color: #ccc;
  }

  .book_list_header text {
    padding: 0 20rpx;
    box-sizing: border-box;
    float: left;
    height: 80rpx;
    line-height: 80rpx;
    font-size: 30rpx;
    text-align: left;
  }

  .book_list_right {
    width: 60%;
  }

  .book_list_left {
    width: 40%;
  }

  .book_list_header .book_list_right {
    text-align: right;
  }

  .book_list_item {
    width: 100%;
    height: 100rpx;
    line-height: 100rpx;
  }

  .book_list_item .icon_wrapper {
    padding: 15rpx;
    box-sizing: border-box;
    float: left;
    margin: 15rpx;
    width: 70rpx;
    height: 70rpx;
    border-radius: 50%;
    background: #eee;
  }

  .book_list_item .icon_wrapper image {
    display: block;
    width: 40rpx;
    height: 40rpx;
  }

  .book_list_item text {
    float: left;
    width: 400rpx;
    height: 100rpx;
    line-height: 100rpx;
    font-size: 30rpx;
    color: #333;
    border-bottom: 1rpx solid #eee;
    box-sizing: border-box;
  }

  .book_list_item .book_list_item_amt {
    padding-right: 20rpx;
    width: 250rpx;
    color: #000;
    text-align: right;
  }

  .book_list_right {
    display: inherit
  }
</style>