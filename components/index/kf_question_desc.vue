<template>
  <div class="container" style="background: #eee;" :style="'min-height:'+minHeight">
    <h3 class="connect_kf_list_ul kf_question_desc_title"><img src="../../../static/img/connect/kf-q.png" alt=""><span>{{title}}</span></h3>
    <div class="content" v-html="content" style="background: #fff;">

    </div>
  </div>
</template>

<script>
  import {get_faq_detail} from '../../api/index'

  export default {
    data() {
      return {
        title: '',
        minHeight: '',
        content: ''
      }
    },
    mounted(){
      this.type = this.$route.query.type;
      this.$dialog.loading.close();

      if(this.type == 'shop'){
        document.title = '店长宝典'
      }

      if(this.type == 'sales_sv'){
        document.title = '售后问题'
      }

      if(this.type == 'order'){
        document.title = '订单科普'
      }

    },
    created() {
      this.title = this.$route.query.title;
      this.minHeight = localStorage.getItem('minHeight');
      this.getDetail();
    },
    methods: {
      getDetail() {
        var _this = this;
        this.$dialog.loading.open('');
        get_faq_detail({'id': this.$route.query.id}).then(function (res) {
          //console.log(res);
          _this.content = res.data.data.content;
          _this.$dialog.loading.close();
        }).catch(function (err) {
          console.log(err);
        })
      }
    }
  }
</script>
<style scoped="true">
  @import "../../../static/css/kf/kf.css";

  .kf_question_desc_title{
    padding:0.3rem;
    border-bottom:0.01rem solid #eee;
  }

  .kf_question_desc_title img{
    width:0.4rem;
    height:0.4rem;
    margin-right:0.3rem;
    float: left;
  }

  .kf_question_desc_title span{
    font-size:0.3rem;
  }
</style>
