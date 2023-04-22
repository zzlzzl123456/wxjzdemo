<template>
  <view>
    <input class="uni-input" type="digit" v-model="valiFormData.money" placeholder="请输入金额" @input="testMoney" />
  </view>
</template>

<script>
  export default {
    data() {
      return {
        valiFormData: {
          money: ""
        },
      }
    },
    methods: {
      testMoney(e) {
        var that = this

        //允许输入一个小数点

        e.detail.value = e.detail.value.replace(".", "$#$").replace(/\./g, "").replace("$#$", ".");

        //允许输入两位小数

        e.detail.value = e.detail.value.replace(/^(\-)*(\d+)\.(\d\d).*$/, '$1$2.$3');

        //如果金额没有小数点，并且值不等于空，则返回浮点数

        if (e.detail.value.indexOf(".") < 0 && e.detail.value != "") {

          e.detail.value = parseFloat(e.detail.value);

          //如果第一位为小数点，则转换为0. 只保留一个小数点

        } else if (e.detail.value.indexOf(".") == 0) {

          e.detail.value = e.detail.value.replace(/[^$#$]/g, "0.");

          e.detail.value = e.detail.value.replace(/\.{2,}/g, ".");

        }

        //这里计时器必须使用，不然input框中不会显示校验过的值，只显示你输入的值

        setTimeout(() => {
          that.valiFormData.money = e.detail.value
        }, 1)
      },
      
    },
    onLoad() {
      uniCloud.callFunction({
        name:"TestData",
        data:{
          keyword:"2023-04"
        }
      }).then(res=>{
        console.log(res)
      })
    }
  }
</script>

<style>

</style>