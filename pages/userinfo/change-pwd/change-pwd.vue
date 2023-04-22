<template>
  <view class="uni-content">
    <match-media :min-width="690">
      <view class="login-logo">
        <image :src="logo"></image>
      </view>
      <!-- 顶部文字 -->
      <text class="title title-box">修改密码</text>
    </match-media>
    <uni-forms ref="form" :value="formData" err-show-type="toast">
      <uni-forms-item name="oldPassword">
        <uni-easyinput :focus="focusOldPassword" @blur="focusOldPassword = false" class="input-box" type="password"
          :inputBorder="false" v-model="formData.oldPassword" placeholder="请输入旧密码">
        </uni-easyinput>
      </uni-forms-item>
      <uni-forms-item name="newPassword">
        <uni-easyinput :focus="focusNewPassword" @blur="focusNewPassword = false" class="input-box" type="password"
          :inputBorder="false" v-model="formData.newPassword" placeholder="请输入新密码">
        </uni-easyinput>
      </uni-forms-item>
      <button class="uni-btn send-btn-box" type="primary" @click="submit">提交</button>
    </uni-forms>
  </view>
</template>

<script>
  const uniIdCo = uniCloud.importObject("uni-id-co", {
    customUI: true
  })
  export default {
    data() {
      return {
        logo: "/static/logo.png",
        focusOldPassword: false,
        focusNewPassword: false,
        formData: {
          'oldPassword': '',
          'newPassword': '',
        },
        rules: {
          newPassword: {
            rules: [{
                required: true,
                errorMessage: '请输入新密码',
              },
              {
                pattern: /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{6,16}$/,
                errorMessage: '新密码需包含字母和数字的，6-16位',
              }
            ]
          }
        },
        
      }
    },
    onReady() {
    	this.$refs.form.setRules(this.rules)
    },
    methods: {
          submit() {
          	this.$refs.form.validate()
          		.then(res => {
          			let {
          				oldPassword,
          				newPassword
          			} = this.formData
          			uniIdCo.updatePwd({
          					oldPassword,
          					newPassword
          				}).then(e => {
          					uni.removeStorageSync('uni_id_token');
          					uni.setStorageSync('uni_id_token_expired', 0)
          					uni.redirectTo({
          						url:'/pages/login/login'
          					})
          				}).catch(e => {
          					uni.showModal({
          						content: e.message,
          						showCancel: false
          					});
          				})
          		}).catch(errors => {
          			let key = errors[0].key
          			key = key.replace(key[0], key[0].toUpperCase())
          			this['focus' + key] = true
          		})
          }
    }
  }
</script>

<style>

</style>