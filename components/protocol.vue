<template>
  <div class="container" :style="'min-height:'+minHeight">
    <div class="box" v-html="xieyi">{{xieyi}}</div>
  </div>
</template>

<script>
  import {get_system_agreement} from '../api/index'

  export default {
    data() {
      return {
        minHeight: '',
        xieyi: '',
        type2: ''
      }
    },
    created() {
      this.$dialog.loading.close();
      this.minHeight = localStorage.getItem('minHeight');
    },
    mounted() {
      if (this.$route.query.type == 'register') {
        document.title = '注册协议';
        this.type2 = 'register'
      }

      if (this.$route.query.type == 'score') {
        document.title = '积分规则';
        this.type2 = 'score'
      }
      this.getAgreement(this.type2);
    },
    methods: {
      getAgreement(type2) {

        var _this = this;
        this.$dialog.loading.open('');
        get_system_agreement({type:type2}).then(function (res) {
          //console.log('res', res.data.data.data);
          _this.xieyi = res.data.data
          _this.$dialog.loading.close();
        }).catch(function (err) {
          console.log(err);
        })
      },

    }
  }
</script>
<style scoped="true">
  .box{
    padding:0.3rem;
  }
</style>
