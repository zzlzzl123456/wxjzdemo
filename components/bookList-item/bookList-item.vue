<template>
  <view class="">
    <view>
      <uni-list>
        <uni-list-item :title='bookTypeitem.name' :thumb='bookTypeitem.icon' thumb-size="base">
          <template v-slot:footer>
            <text @click="edit" class="text-box">编辑</text>
            <text @click="dele('warn')" class="text-box">删除</text>
          </template>
        </uni-list-item>
      </uni-list>
    </view>
    <view>
      <!-- 提示窗示例 -->
      <uni-popup ref="alertDialog" type="dialog">
        <uni-popup-dialog :type="msgType" cancelText="取消" confirmText="确认" title="提示" content="确认删除这条记录"
          @confirm="dialogConfirm" @close=""></uni-popup-dialog>
      </uni-popup>
    </view>
  </view>
</template>

<script>
  const db = uniCloud.database()
  export default {
    props: ['bookTypeitem'],
    data() {
      return {
        msgType: "",
      };
    },
    methods: {
      edit() {
        uni.navigateTo({
          url: `/pages/addBook/addBookType/addBookType?bookType=${this.bookTypeitem.type}&name=${this.bookTypeitem.name}&iocn=${this.bookTypeitem.icon}&mark=1&id=${this.bookTypeitem._id}`,
        })
      },
      dele(type) {
        this.msgType = type
        this.$refs.alertDialog.open()
      },
      dialogConfirm() {
        //_id:this.bookTypeitem._id
        db.collection('user-bookTypeList').where(`_id=="${this.bookTypeitem._id}" && userId==$cloudEnv_uid`)
          .remove().then(res => {
            uni.showToast({
              title: "删除成功",
              icon: 'success'
            })
            uni.redirectTo({
              url: `/pages/addBook/bookTypeList/bookTypeList?bookType=${this.bookTypeitem.type}`
            })
          }).catch(err => {
            uni.showToast({
              title: "删除失败",
              icon: 'error'
            })
          })
      }
    },
  }
</script>

<style lang="scss" scoped>
  .item-box {
    width: 100%;
    height: 100rpx;
    display: flex;
    align-items: center;
    justify-content: space-between;

    image {
      width: 60rpx;
      height: 60rpx;
    }
  }

  .text-box {
    margin: 10rpx;
  }
</style>