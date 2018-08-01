<template>

  <div class="container" style="background: #eee;" :style="'min-height: '+minHeight">
    <ul class="connect_kf_list_ul">
      <li v-for="item in list" @click="look_question(item.id,item.title)">
        <span class="question-span">{{item.title}}</span>
        <i class="icon iconfont icon-youjiantou"></i>
      </li>
    </ul>
  </div>
</template>

<script>
  import {get_faq_list} from '../../api/index'
    export default {
      data() {
        return {
          type:'all',
          minHeight: '',
          list: []
        }
      },
      mounted() {
        this.type = this.$route.query.type
        this.$dialog.loading.close();
        //获取可用屏幕高度
        this.minHeight = localStorage.getItem('minHeight');

        if(this.type == 'shop'){
            document.title = '店长宝典'
        }

        if(this.type == 'sales_sv'){
            document.title = '售后问题'
        }

        if(this.type == 'order'){
            document.title = '订单科普'
        }

        this.getList();
      },
      methods: {
        //获取常见问题列表
        getList() {
          var _this = this;
          this.$dialog.loading.open('');
          get_faq_list({type: this.type}).then(function (res) {
            _this.list = res.data.data;
            _this.$dialog.loading.close();
          }).catch(function (err) {
            console.log(err);
          })
        },
        look_question(id,title){
            this.$router.push({path:'/main/kf_question_desc',query :{type:this.type,id:id,title:title}})
        }
      }
    }
</script>


<style scoped>
  @import "../../../static/css/kf/kf.css";

  .container {
    position: relative;
  }

  .header-div {
    padding: 0.24rem 0.29rem;
    background: #fff;
    font-size: 0.30rem;
    color: #2f2f2f;
  }

  .header {
    width: 0.80rem;
    height: 0.80rem;
    vertical-align: middle;
    display: inline-block;
    margin-right: 0.35rem;
  }

  .ti {
    padding: 0.28rem 0.29rem;
    font-size: 0.26rem;
    color: #898989;
  }

  ul li a{
    overflow: hidden;
    width:100%;
  }

  .iconfont{
    font-size:0.22rem;
    color: #898989;
    float: right;
    margin-right:0.3rem;
    margin-top:0.08rem;
  }
</style>
