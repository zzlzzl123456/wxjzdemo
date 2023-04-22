<template>
  <view>
    <uni-captcha scene="send-email-code" v-model="captcha" />
    <button @click="tesst2">1232131</button>
    <button @click="test">1232131</button>
    <button @click="test2">111111232131</button>
    <button @click="test3">111111232131111</button>
    <button @click="test4">111111232131111</button>
  </view>
</template>

<script>
  const uniIdCo = uniCloud.importObject("uni-id-co")
  const db = uniCloud.database()
  export default {
    data() {
      return {
        captcha: ""
      }
    },
    methods: {
      tesst2() {
        uniIdCo.sendEmailCode({
          email: '15053589912345@qq.com',
          scene: 'register',
          captcha: "213",
          code: '213245'
        }).then(e => {})
      },
      test() {
        uniIdCo.registerUserByEmail({
          email: '15053589912345@qq.com',
          password: 'zzl123456',
          code: '213245',
        }).then(e => {})
      },
      test2() {
        uniCloud.callFunction({
          name: "Testdb"
        })
      },
      test3() {
        uniCloud.callFunction({
          name: "Testdb2"
        })
      },
      test4(){
        db.collection("sys-icon").add([
          {icon:"https://mp-97572f2c-a74e-40a9-86d0-d33963e17947.cdn.bspapp.com/cloudstorage/6db9bb33-682b-40dc-b255-0127c0abf729.png"},
          {icon:"https://mp-97572f2c-a74e-40a9-86d0-d33963e17947.cdn.bspapp.com/cloudstorage/50068470-62c3-40e2-8412-a2439de09792.png"},
          {icon:"https://mp-97572f2c-a74e-40a9-86d0-d33963e17947.cdn.bspapp.com/cloudstorage/2712e2bb-a94a-4436-b43f-c4ebeddc5d6a.png"},
          {icon:"https://mp-97572f2c-a74e-40a9-86d0-d33963e17947.cdn.bspapp.com/cloudstorage/d1fd74f9-d74a-48c3-8f2a-60519c158b2e.png"},
          {icon:"https://mp-97572f2c-a74e-40a9-86d0-d33963e17947.cdn.bspapp.com/cloudstorage/3cf9cfa7-daf7-42ac-9ad0-178e97aa0103.png"},
        ])
      }
    }
  }
</script>

<style>

</style>