<template>
  <view>
    <uni-section title="请选择支付类型" type="line" padding>
      <uni-grid :column="4" :highlight="true" @change="change">
        <uni-grid-item v-for="(item, index) in  bookTypeLsit" :index="index" :key="index">
          <view :class="['grid-item-box',activeType==index?'active':'']" @click="toggle('bottom',item,index)">
            <image :class="['item-image']" :src=" item.icon" mode="aspectFit">
              <text class="text">{{item.name}}</text>
          </view>
        </uni-grid-item>
        <uni-grid-item>
          <view :class="['grid-item-box']" @click="addBookType">
            <image :class="['item-image']" src="/static/icons/icon_165.png">
              <text class="text">新增</text>
          </view>
        </uni-grid-item>
      </uni-grid>
    </uni-section>
    <view>
      <!-- 普通弹窗 -->
      <uni-popup ref="popup" background-color="#fff" @change="change">
        <view class="popup-content">
          <view class="xs_Box">
            <view class="xs_Box1">
              <view>
                <picker mode="date" :value="date" :start="startDate" :end="endDate" @change="bindDateChange">
                  <button class="mini-btn" type="default" size="mini">{{date}}</button>
                </picker>
              </view>
              <view>
                <!-- 金额 -->
                <text>{{money}}</text>
              </view>
            </view>
            <view class="xs_Box2">
              <view>
                <input :placeholder="remarks==''? '备注':remarks" @input="onKeyInput" />
              </view>
              <view>
                <button class="mini-btn" size="mini" @click="submit" type="primary">确定</button>
              </view>
            </view>
          </view>
          <view class="keyboard">
            <button v-for="(item, index) in 9" :key="index" @click="key(index + 1)" :disabled="testNum==0">
              <text>{{ index + 1 }}</text>
            </button>
            <button class="hide" @click="key('.')" :disabled="test">
              <text>.</text>
            </button>
            <button @click="key(0)" :disabled="testNum==0">
              <text>0</text>
            </button>
            <button @click="del()">
              <image src="/static/icons/icon_176.png" mode="aspectFill"></image>
            </button>
          </view>
        </view>
      </uni-popup>
    </view>
  </view>
</template>

<script>
  const db = uniCloud.database()
  export default {
    name: "income-book-item",
    props: ['bookTypeLsit', 'mark', 'book'],
    data() {
      const currentDate = this.getDate({
        format: true
      })
      return {
        test: false,
        testNum: 10,
        type: 'center',
        activeType: '-1',
        money: 0,
        keyList: [],
        date: currentDate,
        moneyType: "",
        remarks: "",
        bookTypeId: "",
        bookType: "",
      }
    },
    computed: {
      startDate() {
        return this.getDate('start');
      },
      endDate() {
        return this.getDate('end');
      }
    },
    methods: {
      change(e) {
        console.log('当前模式：' + e.type + ',状态：' + e.show);
      },
      toggle(type, item, index) {
        this.type = type
        // open 方法传入参数 等同在 uni-popup 组件上绑定 type属性
        this.$refs.popup.open(type)
        this.activeType = index
        if (item != null) {
          this.bookTypeId = item._id
          this.bookType = item.type
        }
        console.log(this.mark)
        // console.log(this.activeType)
        // console.log(item._id)
      },
      key(key) {
        if (key == '.') {
          this.test = true
          this.testNum = 3
          if (this.keyList[0] == null) {
            console.log(this.keyList)
            this.keyList.push(0)
          }
        }
        if (this.keyList.length < 9 && this.testNum > 0) {
          if (this.keyList[0] == 0 && key != '.' && this.keyList.length < 2) {
            this.keyList[0] = key
          } else {
            this.keyList.push(key)
            this.testNum--
          }
        }
        this.money = this.keyList.join('')
        console.log(this.keyList[0])
        console.log(this.money)
      },
      del() {
        let key = this.keyList.pop()
        if (key == '.') {
          this.test = false
          this.testNum = 10
        } else {
          this.testNum++
        }
        this.money = this.keyList.join('')
        console.log(this.money)
      },
      getDate(type) {
        const date = new Date();
        let year = date.getFullYear();
        let month = date.getMonth() + 1;
        let day = date.getDate();

        if (type === 'start') {
          year = year - 60;
        } else if (type === 'end') {
          year = year + 2;
        }
        month = month > 9 ? month : '0' + month;
        day = day > 9 ? day : '0' + day;
        return `${year}-${month}-${day}`;
      },
      bindDateChange: function(e) {
        this.date = e.detail.value
      },
      addBookType() {
        uni.navigateTo({
          url: `/pages/addBook/bookTypeList/bookTypeList?bookType=0`
        })
      },
      onKeyInput: function(event) {
        this.remarks = event.target.value
        console.log(this.remarks)
      },
      submit() {
        if (this.money == 0) {
          uni.showToast({
            title: "请输入金额",
            icon: 'error'
          })
        } else {
          this.money = this.money * 100
          let money = parseInt(this.money)
          console.log(money)
          if (this.mark == 0) {
            db.collection("user-bookList").where(`_id=="${this.book.bookId}" && userId==$cloudEnv_uid`).update({
              bookTypeId: this.bookTypeId,
              money: money,
              recordDate: this.date,
              remarks: this.remarks
            }).then(res => {
              uni.redirectTo({
                url: '/pages/index/index'
              })
            }).catch(err => {
              uni.showToast({
                title: "修改失败",
                icon: 'error'
              })
            })
          } else {
            db.collection("user-bookList").add({
              bookTypeId: this.bookTypeId,
              money: money,
              type: this.bookType,
              recordDate: this.date,
              remarks: this.remarks
            }).then(res => {
              uni.redirectTo({
                url: '/pages/index/index'
              })
            }).catch(err => {
              uni.showToast({
                title: "添加失败",
                icon: 'error'
              })
            })
          }
        }
        console.log(123)
      }
    },
    onLoad() {
      this.keyList[0] == 0
    },
    mounted() {
      if (this.mark == 1) {
        this.toggle('bottom', this.book)
        this.money = this.book.money
        this.date = this.book.date
        this.remarks = this.book.remarks
        console.log(this.book)
      }
    }

  }
</script>
<style lang="scss" scoped>
  .image {
    width: 25px;
    height: 25px;
  }

  .item-image {
    display: block;
    width: 80rpx;
    height: 80rpx;
    background-color: "#fff";
  }

  .text {
    font-size: 14px;
    margin-top: 5px;
  }

  .example-body {
    /* #ifndef APP-NVUE */
    // display: block;
    /* #endif */
  }

  .grid-dynamic-box {
    margin-bottom: 15px;
  }

  .grid-item-box {
    flex: 1;
    background-color: #fff;
    // position: relative;
    /* #ifndef APP-NVUE */
    display: flex;
    /* #endif */
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 15px 0;
  }

  .grid-item-box-row {
    flex: 1;
    // position: relative;
    /* #ifndef APP-NVUE */
    display: flex;
    /* #endif */
    flex-direction: row;
    align-items: center;
    justify-content: center;
    padding: 15px 0;
  }

  .grid-dot {
    position: absolute;
    top: 5px;
    right: 15px;
  }

  .swiper {
    height: 420px;
  }

  /* #ifdef H5 */
  @media screen and (min-width: 768px) and (max-width: 1425px) {
    .swiper {
      height: 630px;
    }
  }

  @media screen and (min-width: 1425px) {
    .swiper {
      height: 830px;
    }
  }

  /* #endif */

  .text {
    font-size: 12px;
    color: #333;
  }

  @mixin flex {
    /* #ifndef APP-NVUE */
    display: flex;
    /* #endif */
    flex-direction: row;
  }

  @mixin height {
    /* #ifndef APP-NVUE */
    height: 100%;
    /* #endif */
    /* #ifdef APP-NVUE */
    flex: 1;
    /* #endif */
  }

  .popup-content {
    @include flex;
    align-items: center;
    justify-content: center;
    padding: 15rpx;
    height: 600rpx;
    background-color: #fff;
  }

  .popup-height {
    @include height;
    width: 200px;
  }

  .keyboard {
    position: fixed;
    bottom: 0;
    width: 100%;
    background: #EEEEEE;
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;

    button {
      display: flex;
      align-items: center;
      justify-content: center;
      width: calc(100vw / 3 - 1rpx);
      background: #FFFFFF;
      border-radius: 0;
      margin-top: 1rpx;
      font-size: 50rpx;
      height: 120rpx;

      &.button-hover:not(.hide) {
        background: #EEEEEE;
      }

      image {
        width: 52rpx;
        height: 38rpx;
      }
    }
  }

  .xs_Box {
    width: 99%;
    height: 145rpx;
    position: absolute;
    top: 0rpx;
    display: flex;
    justify-content: space-evenly;
    flex-direction: column;
    border: #333 solid 1rpx;
  }

  .xs_Box1,
  .xs_Box2 {
    display: flex;
    justify-content: space-between;

    text {
      font-size: 50rpx
    }

    button {}
  }

  .active {
    background: #ffd700;
  }
</style>