<template>
  <view class="uni-content">
    <!-- 表单 -->
    <uni-forms ref="form" :value="formData" :rules="rules" validate-trigger="submit" err-show-type="toast">
      <!-- 邮箱 -->
      <uni-forms-item name="email" required>
        <uni-easyinput :inputBorder="false" class="input-box" placeholder="请输入邮箱" v-model="formData.email"
          trim="both" />
      </uni-forms-item>
      <!-- 昵称 -->
      <uni-forms-item name="nickname">
        <uni-easyinput :inputBorder="false" class="input-box" placeholder="请输入用户昵称" v-model="formData.nickname"
          trim="both" />
      </uni-forms-item>
      <!-- 密码 -->
      <uni-forms-item name="password" v-model="formData.password" required>
        <uni-easyinput :inputBorder="false" class="input-box" maxlength="20" :placeholder="'密码需包含字母和数字的，6-16位'"
          type="password" v-model="formData.password" trim="both" />
      </uni-forms-item>
      <!-- 验证码 -->
      <uni-forms-item name="code">
        <uni-captcha scene="send-email-code" v-model="captcha" />
        <view class="code-box">
          <input v-model="formData.code" class="input" placeholder="验证码" />
          <button @click="verifyCaptcha">{{send?'发送验证码':second+'s重新发送'}}</button>
        </view>
      </uni-forms-item>
      <!-- 按钮 -->
      <button class="uni-btn" type="primary" @click="submit">注册</button>
      <button @click="navigateBack" class="register-back">返回</button>
    </uni-forms>
  </view>
</template>

<script>
  const uniIdCo = uniCloud.importObject("uni-id-co")
  export default {
    data() {
      return {
        formData: {
          email: "",
          nickname: "",
          password: "",
          code: "",
        },
        captcha: "",
        s: 60, //默认倒计时
        second: 0,
        send: true, //按钮可以点击K
        //规则
        rules: {
          email: {
            rules: [{
              required: true,
              errorMessage: '请输入邮箱',
            }, {
              format: 'email',
              errorMessage: '邮箱格式不正确',
            }]
          },
          nickname: {
            rules: [{
                minLength: 3,
                maxLength: 32,
                errorMessage: '昵称长度在 {minLength} 到 {maxLength} 个字符',
              },
              {
                validateFunction: function(rule, value, data, callback) {
                  // console.log(value);
                  if (/^1\d{10}$/.test(value) || /^(\w-*\.*)+@(\w-?)+(\.\w{2,})+$/.test(value)) {
                    callback('昵称不能是：手机号或邮箱')
                  };
                  if (/^\d+$/.test(value)) {
                    callback('昵称不能为纯数字')
                  };
                  if (/[\u4E00-\u9FA5\uF900-\uFA2D]{1,}/.test(value)) {
                    callback('昵称不能包含中文')
                  }
                  return true
                }
              }
            ],
            label: "昵称"
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
          code: {
            rules: [{
                required: true,
                errorMessage: '请输入邮箱验证码',
              },
              {
                pattern: /^.{6}$/,
                errorMessage: '邮箱验证码不正确',
              }
            ]
          }
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
        }

      }
    },
    onReady() {
      //加载规则
      this.$refs.form.setRules(this.rules)
      console.log(this.rules)
    },
    methods: {
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
          }).then((res) => {
            uniIdCo.sendEmailCode({
              email: this.formData.email,
              scene: 'register',
              captcha: this.captcha,
              code: this.formData.code
            }).then(e => {
              uniIdCo.registerUserByEmail(this.formData).then(e => {
                uni.showToast({
                  duration: 1500,
                  title: '注册成功',
                  mask: true,
                  icon: 'none'
                })
                uni.navigateTo({
                  url:'/pages/login/login'
                })
              })
            })

          });
        }).catch(err => {
          console.log('表单错误信息：', err);
        })
        // uniIdCo.registerUserByEmail(this.formData).then(e => {
        //   })
      },
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

    }
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