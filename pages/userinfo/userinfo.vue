<template>
  <view class="uni-content">
    <view class="avatar">
      <uni-id-pages-avatar width="150rpx" height="150rpx"></uni-id-pages-avatar>
    </view>
    <uni-list>
      <uni-list-item class="item" @click="setNickname('')" title="昵称" :rightText="userInfo.nickname||'未设置'" link>
      </uni-list-item>
      <uni-list-item v-if="userInfo.email" class="item" title="电子邮箱" :rightText="userInfo.email">
      </uni-list-item>
      <uni-list-item v-if="hasPwd" class="item" @click="changePassword" title="修改密码" link>
      </uni-list-item>
    </uni-list>
    <uni-popup ref="dialog" type="dialog">
      <uni-popup-dialog mode="input" :value="userInfo.nickname" @confirm="setNickname"
        :inputType="setNicknameIng?'nickname':'text'" title="设置昵称" placeholder="请输入要设置的昵称">
      </uni-popup-dialog>
    </uni-popup>
    <template v-if="showLoginManage">
      <button v-if="userInfo._id" @click="logout">退出登录</button>
      <button v-else @click="login">去登录</button>
    </template>
  </view>
</template>

<script>
  const uniIdCo = uniCloud.importObject("uni-id-co")
  import {
    store,
    mutations
  } from '@/uni_modules/uni-id-pages/common/store.js'
  export default {
    data() {
      return {
        hasPwd: false,
        showLoginManage: false, //通过页面传参隐藏登录&退出登录按钮
        setNicknameIng: false
      }
    },
    methods: {
      setNickname(nickname) {
        if (nickname) {
          mutations.updateUserInfo({
            nickname
          })
          this.setNicknameIng = false
          this.$refs.dialog.close()
        } else {
          this.$refs.dialog.open()
        }
      },
      login() {
      	uni.navigateTo({
      		url: '/pages/login/login',
      		complete: (e) => {
      			// console.log(e);
      		}
      	})
      },
      changePassword() {
        uni.navigateTo({
          url: 'change-pwd/change-pwd',
          complete: (e) => {
            // console.log(e);
          }
        })
      },
      logout() {
      	mutations.logout()
      },
    },
    computed: {
      userInfo() {
        return store.userInfo
      },
      realNameStatus() {
        if (!this.userInfo.realNameAuth) {
          return 0
        }

        return this.userInfo.realNameAuth.authStatus
      }
    },
    async onLoad(e) {
    	if (e.showLoginManage) {
    		this.showLoginManage = true //通过页面传参隐藏登录&退出登录按钮
    	}
    	//判断当前用户是否有密码，否则就不显示密码修改功能
    	let res = await uniIdCo.getAccountInfo()
    	this.hasPwd = res.isPasswordSet
    },
  }
</script>

<style lang="scss" scoped>
  @import '../../common/login-page.scss';

  .uni-content {
    padding: 0;
  }

  /* #ifndef APP-NVUE */
  view {
    display: flex;
    box-sizing: border-box;
    flex-direction: column;
  }

  @media screen and (min-width: 690px) {
    .uni-content {
      padding: 0;
      max-width: 690px;
      margin-left: calc(50% - 345px);
      border: none;
      max-height: none;
      border-radius: 0;
      box-shadow: none;
    }
  }

  /* #endif */
  .avatar {
    align-items: center;
    justify-content: center;
    margin: 22px 0;
    width: 100%;
  }

  .item {
    flex: 1;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
  }

  button {
    margin: 10%;
    margin-top: 40px;
    border-radius: 0;
    background-color: #FFFFFF;
    width: 80%;
  }

  .mt10 {
    margin-top: 10px;
  }
</style>