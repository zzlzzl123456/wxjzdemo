<template>
  <view class="uni-content">
    <match-media :min-width="690">
      <view class="login-logo">
        <image :src="logo"></image>
      </view>
      <!-- 顶部文字 -->
      <text class="title title-box">通过邮箱验证码找回密码</text>
    </match-media>
    <uni-forms ref="form" :value="formData" err-show-type="toast" style="margin-top: 20rpx;">
      <!-- 邮箱 -->
      <uni-forms-item name="email">
        <uni-easyinput :focus="focusEmail" @blur="focusEmail = false" class="input-box" :disabled="lock"
          :inputBorder="false" v-model="formData.email" placeholder="请输入邮箱">
        </uni-easyinput>
      </uni-forms-item>
      <!-- 验证码 -->
      <uni-forms-item name="code">
        <uni-captcha scene="send-email-code" v-model="captcha" />
        <view class="code-box">
          <input v-model="formData.code" class="input" placeholder="验证码" />
          <button @click="verifyCaptcha">{{send?'发送验证码':second+'s重新发送'}}</button>
        </view>
      </uni-forms-item>
      <!-- 密码 -->
      <uni-forms-item name="password">
        <uni-easyinput :focus="focusPassword" @blur="focusPassword = false" class="input-box" type="password"
          :inputBorder="false" v-model="formData.password" placeholder="请输入新密码"></uni-easyinput>
      </uni-forms-item>
      <button class="uni-btn send-btn-box" type="primary" @click="submit">提交</button>
    </uni-forms>
  </view>
</template>

<script>
  const uniIdCo = uniCloud.importObject("uni-id-co",{
  	errorOptions:{
  		type:'toast'
  	}
  })
  export default {
    data() {
      return {
        logo: "/static/logo.png",
        s: 60, //默认倒计时
        second: 0,
        send: true, //按钮可以点击K
        captcha: "",
        lock: false,
        focusEmail: true,
        focusPassword: false,
        focusPassword2: false,
        formData: {
          "email": "",
          "code": "",
          'password': '',
        },
        codeId: '',
        effectiveTime: 300,
        statusJson: {
          '-5': '验证失败',
          '-4': '验证码已使用',
          '-3': '验证码已失效',
          '-2': '当前邮箱未发送验证码',
          '-1': '还未发送验证码',
          '0': '验证码不正确',
          '1': '验证成功'
        },
        rules: {
          email: {
            rules: [{
                required: true,
                errorMessage: '请输入邮箱',
              },
              {
                format: 'email',
                errorMessage: '邮箱格式不正确',
              }
            ]
          },
          code: {
            rules: [{
                required: true,
                errorMessage: '请输入邮箱验证码',
              },
              {
                pattern: /^.{6}$/,
                errorMessage: '请输入6位验证码',
              }
            ]
          },
          password: {
            rules: [{
              required: true,
              errorMessage: '请输入密码',
            }, {
              pattern: /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{6,16}$/,
              errorMessage: '密码需包含字母和数字的，6-16位',
            }]
          },
        },

      }
    },
    onReady() {
      //加载规则
      this.$refs.form.setRules(this.rules)
    },
    methods: {
      verifyCaptcha() {
        let that = this;
        // 防止多次重复点击
        if (!that.send) {
          return false;
        }
        // 发送验证码
        that.send = false;
        this.testSend()
      },
      testSend() {
        if (!this.formData.email) {
          uni.showToast({
            duration: 1500,
            title: '请输入邮箱',
            mask: true,
            icon: 'none'
          })
          this.send = true
          return;
        }
        uni.showLoading({
          mask: true
        })
        uniCloud.callFunction({
          name: "emailCode",
          data: {
            serviceType: 'qq',
            method: 'sendCode',
            html: '您注册的验证码是#code#',
            email: this.formData.email,
            subject: '注册验证码'
          }
        }).then((res) => {
          uni.hideLoading();
          if (res.result.status) {
            this.codeId = res.result.id;
            uni.showToast({
              duration: 1500,
              icon: 'none',
              title: '发送成功',
              mask: true,
            })
            this.time();
          } else {
            uni.showToast({
              duration: 1500,
              title: '发送失败',
              mask: true,
              icon: 'none'
            })
            this.send = true
          }
        });
      },
      time() {
        let that = this;
        that.second = that.s;
        let interval = setInterval(function() {
          if (that.second == 1) {
            that.send = true;
            that.second = that.s;
            clearInterval(interval);
          } else {
            that.second--;
          }
        }, 1000)
      },
      //11111
      submit() {
        this.$refs.form.validate().then(res => {
          uniCloud.callFunction({
            name: "emailCode",
            data: {
              code: this.formData.code,
              method: 'validateCode',
              email: this.formData.email,
              codeId: this.codeId,
              effectiveTime: 300
            }
          }).then(res => {
            uniIdCo.sendEmailCode({
              email: this.formData.email,
              scene: 'reset-pwd-by-email',
              captcha: this.captcha,
              code: this.formData.code
            }).then(res => {
              let {
                email,
                password: password,
                code
              } = this.formData
              uniIdCo.resetPwdByEmail({
                email,
                code,
                password,
              }).then(res=>{
                uni.navigateTo({
                	url: '/pages/login/login',
                	complete: (e) => {
                		// console.log(e);
                	}
                })
              })
            })
          })
        })
      },
    },
  }
</script>

<style lang="scss">
  @import '../../common/login-page.scss';

  .uni-content ::v-deep .uni-forms-item__label {
    position: absolute;
    left: -15px;
  }

  button {
    margin-top: 15px;
  }

  .code-box {
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;
    height: 100rpx;

    button,
    input {
      width: 50%;
      font-size: 40rpx;
    }
  }
</style>