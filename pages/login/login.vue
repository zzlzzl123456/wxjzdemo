<template>
  <view class="uni-content">
    <view class="login-logo">
      <image :src="logo"></image>
    </view>
    <!-- 顶部文字 -->
    <text class="title title-box">账号密码登录</text>
    <uni-forms>
      <uni-forms-item name="username">
        <uni-easyinput class="input-box" :focus="focusUsername" @blur="focusUsername = false" :inputBorder="false"
          v-model="username" placeholder="请输入邮箱" />
      </uni-forms-item>
      <uni-forms-item name="password">
        <uni-easyinput class="input-box" :focus="focusPassword" @blur="focusPassword = false" clearable type="password"
          :inputBorder="false" v-model="password" placeholder="请输入密码" />
      </uni-forms-item>
    </uni-forms>
    <uni-captcha v-if="needCaptcha" focus ref="captcha" scene="login-by-pwd" v-model="captcha" />
    <button class="uni-btn" type="primary" @click="pwdLogin">登录</button>
  </view>
</template>

<script>
  //import mixin from '../../common/login-page.mixin.js';
  //import {mutations} from "@/uni_modules/uni-id-pages/common/store.js"
  const uniIdCo = uniCloud.importObject("uni-id-co", {
    errorOptions: {
      type: 'toast'
    }
  })
  const db = uniCloud.database();
  const usersTable = db.collection('uni-id-users')
  export default {
 //   mixins: [mixin],
    data() {
      return {
        "password": "",
        "username": "",
        "captcha": "",
        "logo": "/static/logo.png",
        "focusUsername": false,
        "focusPassword": false,
        "needCaptcha": false,
      }
    },
    methods: {
      pwdLogin() {
        if (!this.password.length) {
          this.focusPassword = true
          return uni.showToast({
            title: '请输入密码',
            icon: 'none',
            duration: 3000
          });
        }
        if (!this.username.length) {
          this.focusUsername = true
          return uni.showToast({
            title: '请输入邮箱',
            icon: 'none',
            duration: 3000
          });
        }
        if (this.needCaptcha && this.captcha.length != 4) {
          this.$refs.captcha.getImageCaptcha()
          return uni.showToast({
            title: '请输入验证码',
            icon: 'none',
            duration: 3000
          });
        }
        let data = {
          "email": this.username,
          "password": this.password,
          "captcha": this.captcha
        }
        uniIdCo.login(data).then(e => {
          this.loginSuccess2(e.uid)
         uni.redirectTo({
           url:'/pages/index/index'
         })
        }).catch(e => {
          if (e.errCode == 'uni-id-captcha-required') {
            console.log(123)
            this.needCaptcha = true
          } else if (this.needCaptcha) {
            //登录失败，自动重新获取验证码
            console.log(123355)
            this.$refs.captcha.getImageCaptcha()
          }
        })
      },
      loginSuccess2(uid) {
        let res =  usersTable.where("'_id' == $cloudEnv_uid")
        	.field('mobile,nickname,username,email,avatar_file')
        	.get().then(res=>{
            console.log(res.result.data[0])
            uni.setStorageSync('uni-id-pages-userInfo', res.result.data[0])
          })
      }
      //213
    }
  }
</script>

<style lang="scss" scoped>
  @import '../../common/login-page.scss';
</style>