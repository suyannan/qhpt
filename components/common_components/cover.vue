<template>
  <div class="common-cover" v-show="showStatus">
    <div class="common-zhao" v-if="!closeByZhao"></div>
    <div class="common-zhao" @click="close" v-else></div>
    <div class="common-cover-content-container">
      <slot></slot>
    </div>
  </div>
</template>S

<script>
  export default {
    data() {
      return {
        minHeight: '',
        showStatus: false
      }
    },
    props: {
      isShowSize: false,
      closeByZhao: false
    },
    mounted() {
      //窗口高度
      this.$dialog.loading.close();
      this.minHeight = localStorage.getItem('minHeight');
      this.showStatus = this.isShowSize;
    },
    watch: {
      isShowSize(n, o) {
        this.showStatus = n;
      }
    },
    methods: {
      close() {
        this.$emit('coverClose', false);
        this.showStatus = false;
      }
    }
  }
</script>
<style scoped="true">
.common-cover-content-container{
  padding-bottom:0.9rem;
}
</style>
