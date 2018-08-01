<template>
  <div class="no-shop-box">
    <img src="../../../static/img/find/noshop.png" alt="" class="no-shop">
    <div class="first_page">
      <router-link to="/"><img src="../../../static/img/first_page.png" alt=""></router-link>
    </div>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        fromPath: ''
      }
    },
    created() {
      var _this = this;
      this.$dialog.loading.close();
/*      this.fromPath = window.localStorage.getItem('fromPath')
      setTimeout(function () {
        _this.$router.push({path: _this.fromPath})
      }, 1000)*/
    }
  }
</script>


<style scoped>
  .no-shop-box {
    background: #fff;
    padding-top: 50%;
  }

  .no-shop {
    width: 100%;
  }
  .first_page{
    position: fixed;
    right:0.25rem;
    bottom:1rem;
    width:1.5rem;
    height:1.5rem;
  }
  .first_page img{
    width:100%;
    height:100%;
  }
</style>
