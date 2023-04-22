<template>
  <view>
    <view class="top-box">
      <view class="chartSelect">
        <view class="chartSelect1">
          <uni-data-checkbox mode="tag" v-model="radio3" :localdata="status"
            @change="RenovateChart"></uni-data-checkbox>
        </view class="chartSelect2">
        <view>
          <uni-data-checkbox mode="tag" v-model="radio2" :localdata="date" @change="RenovateChart"></uni-data-checkbox>
        </view>
      </view>
      <view class="dateBox">
        <view>本周</view>
      </view>
      <view class="resultBox">
        <view>总结</view>
        <view>总结</view>
      </view>
      <view class="chartsBox">
        <view class="chartsBox-wrap">
          <echarts ref="echarts" :option="option" canvasId="echarts"></echarts>
        </view>
      </view>
      <view class="textBox">
        <view>支出排行榜</view>
      </view>
    </view>
    <view class="listBox">
      <view class="listItem" v-for="item in 10 ">
        <charts-listBox></charts-listBox>
      </view>
    </view>
  </view>
</template>

<script>
  export default {
    data() {
      return {
        radio3: 0,
        radio2: 0,
        datalist: [],
        status: [{
          "value": 0,
          "text": "收入"
        }, {
          "value": 1,
          "text": "支出"
        }],
        date: [{
          "value": 0,
          "text": "周"
        }, {
          "value": 1,
          "text": "月"
        }, {
          "value": 2,
          "text": "年"
        }],
        option: {},
        demo: {
          demo2: {
            a: 1
          }
        },
        mon: "",
        sun: ""
      }
    },
    onReady() {
      this.RenovateChart()
    },
    methods: {
      RenovateChart() {
        let dealStatus = this.radio3
        let dateStatus = this.radio2
        // console.log(dealStatus)
        console.log(dateStatus)
        if (dateStatus === 0) {
          if (dealStatus === 0) {
            this.datalist = [21, 12, 12, 23, 24, 34, 35, 45, 65]
          } else {
            this.datalist = [35, 35, 35, 35, 24, 34, 35, 45, 65]
          }
          this.option = {
            title: {
              text: '收入，周',
              left: 'center'
            },
            grid: {
              containLabel: true
            },
            tooltip: {
              show: true,
              trigger: 'axis'
            },
            xAxis: {
              type: 'category',
              boundaryGap: false,
              data: ['21', '22', '23', '24', '25', '26', '27'],
              // show: false
            },
            yAxis: {
              x: 'center',
              type: 'value',
              splitLine: {
                lineStyle: {
                  type: 'dashed'
                }
              }
              // show: false
            },
            series: [{
              name: 'A',
              type: 'line',
              smooth: true,
              data: this.datalist
            }]
          }
          console.log(1234)
        }
        if (dateStatus === 1) {
          if (dealStatus === 0) {
            this.datalist = [21, 12, 12, 23, 24, 34, 35, 45, 65]
          } else {
            this.datalist = [35, 35, 35, 35, 24, 34, 35, 45, 65]
          }
          this.option = {
            title: {
              text: '收入，月',
              left: 'center'
            },
            grid: {
              containLabel: true
            },
            tooltip: {
              show: true,
              trigger: 'axis'
            },
            xAxis: {
              type: 'category',
              boundaryGap: false,
              data: ['周一2', '周二2', '周三2', '周四2', '周五2', '周六2', '周日2', '周日2', '周日2', '周日2', '周日2'],
              // show: false
            },
            yAxis: {
              x: 'center',
              type: 'value',
              splitLine: {
                lineStyle: {
                  type: 'dashed'
                }
              }
              // show: false
            },
            series: [{
              name: 'A',
              type: 'line',
              smooth: true,
              data: this.datalist
            }]
          }
          console.log(1234)
        }
        if (dateStatus === 2) {
          if (dealStatus === 0) {
            this.datalist = [21, 12, 12, 23, 24, 34, 35, 45, 65]
          } else {
            this.datalist = [35, 35, 35, 35, 24, 34, 35, 45, 65, 200]
          }
          this.option = {
            title: {
              text: '收入，周',
              left: 'center'
            },
            grid: {
              containLabel: true
            },
            tooltip: {
              show: true,
              trigger: 'axis'
            },
            xAxis: {
              type: 'category',
              boundaryGap: false,
              data: ['周一2', '周二2', '周三2', '周四2', '周五2', '周六2', '周日2', '周日2', '周日2', '周日2', '周日2'],
              // show: false
            },
            yAxis: {
              x: 'center',
              type: 'value',
              splitLine: {
                lineStyle: {
                  type: 'dashed'
                }
              }
              // show: false
            },
            series: [{
              name: 'A',
              type: 'line',
              smooth: true,
              data: this.datalist
            }]
          }
          console.log(1234)
        }

      },
      getweek() {
        let now = new Date();
        let nowTime = now.getTime();
        let day = now.getDay();
        let oneDayTime = 24 * 60 * 60 * 1000;
        //显示周一
        let MondayTime = nowTime - (day - 1) * oneDayTime;
        //显示周日
        let SundayTime = nowTime + (7 - day) * oneDayTime;
        //初始化日期时间
        let monday = new Date(MondayTime);
        let sunday = new Date(SundayTime);
        this.mon = monday
        this.sun = sunday
      },
      add0(m) {
        return m < 10 ? '0' + m : m
      },
      format(t) {
        let time = new Date(t);
        let y = time.getFullYear();
        let m = time.getMonth() + 1;
        let d = time.getDate();
         m= m < 10 ? '0' + m : m
        return `${y}-${m}-${d}`;
      },
    },
    onShow() {
      this.getweek()
      console.log(this.format(this.mon))
      console.log(this.format(this.sun))
    }
  }
</script>
<style lang="scss">
  /*每个页面公共css */
  .top-box {
    position: fixed;
    width: 100%;
    height: 650rpx;
    border: 1rpx salmon solid;
    z-index: 99999;
  }

  .chartsBox {
    height: 400rpx;
    width: 100%;
    position: fixed;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: space-between;
    box-sizing: border-box;
    background-color: yellow
  }

  .chartsBox-wrap {
    width: 100%;
    height: 100%;
  }

  .chartSelect {
    display: flex;
    justify-content: space-evenly;
    width: 100%;
    height: 80rpx;
    background-color: pink;
    box-sizing: border-box;
  }

  .resultBox {
    display: flex;
    flex-direction: column;
    height: 80rpx;
    background-color: #eee;
    box-sizing: border-box;
  }

  .dateBox {
    display: flex;
    height: 40rpx;
    background-color: #eee;
    box-sizing: border-box;
  }

  .textBox {
    position: fixed;
    height: 30rpx;
    box-sizing: border-box;
    top: 600rpx;
    background-color: brown
  }

  .listBox {
    width: 100%;
    padding: 30rpx;
    margin-top: 650rpx;
    display: flex;
    flex-direction: column;
    background-color: #eee;
    position: absolute;
    box-sizing: border-box;

    .listItem {
      margin-top: 0rpx;
      width: 100%;
      height: 110rpx;
      border-bottom: 1rpx dotted red;
      padding: 15rpx 0;
    }
  }
</style>