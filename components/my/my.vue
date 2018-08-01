<template>
  <div class="container" :style="'min-height: '+minHeight">
    <div class="bg-top">
      <img src="../../../static/img/my/my-bg.png" class="bg" alt="">
      <p class="icon-p">
        <router-link to="/main/setting">
          <i class="icon iconfont icon-shezhi setting"></i>
        </router-link>

        <router-link to="/main/shoppingcart">
          <i class="icon iconfont icon-gouwuche"></i>
        </router-link>
        <span class="xiaoxi-span">
          <router-link to="/main/news" class="xiao-bage">
          <i class="icon iconfont icon-xiaoxi"></i>
            <span class="news-bage" v-if="newsCount!=0">{{newsCount}}</span>
          </router-link>
        </span>
      </p>
      <div class="msg disf" @click="checkInFor()">
        <div class="disf ">
          <div class="header-box">
            <img src="../../../static/img/shop/default_header.png" class="header" v-if="head_pic==''" alt="">
            <img :src="head_pic" class="header" v-else alt="">
          </div>
          <div class="nick-div left">
            <p class="nick">{{nick_name}}</p>
            <template v-for="item in vipIdentity">
              <div class="identity" v-if="vip_rank==item.rank">
                <img src="../../../static/img/my/step.png" class="step" alt=""><span>{{item.identity}}</span>
              </div>
            </template>
          </div>
        </div>
          <i class="icon iconfont icon-youjiantou icon-youjiantou1"></i>
      </div>
    </div>
    <div class="two-div bgf">
      <router-link to="/main/my_integral" class="integral inb">
        <p class="tit-text">积分</p>
        <p class="num integral-num">{{now_score}}</p>
      </router-link>
      <router-link to="/main/my_quan" class="coupon inb">
        <p class="tit-text">抵用券（张）</p>
        <p class="num coupon-num"><span class="num">{{count}}</span><span class="dot" v-if="is_new_voucher==1"></span></p>
      </router-link>
    </div>
    <div class="bgf">
      <div class="check-all-p disf"><span class="my-order-text">我的订单</span>
        <p class="gray-right">
          <router-link to="/main/my_order?type=0"><span>查看所有订单</span> <i
            class="icon iconfont icon-youjiantou icon-youjiantou2"></i></router-link>
        </p>
      </div>
      <div class="five-div disf">

        <router-link class="block-five" to="/main/my_order?type=1">
          <i class="icon iconfont icon-daifukuan1 five-icon"></i>
          <p class="five-text">待付款</p>
          <span class="bage" v-if="order_count.paying!=0">{{order_count.paying}}</span>
        </router-link>

        <router-link class="block-five" to="/main/my_order?type=2">
          <i class="icon iconfont icon-daifenxiang five-icon"></i>
          <p class="five-text fenxiang-text">待分享</p>
          <span class="bage" v-if="order_count.confirming!=0">{{order_count.confirming}}</span>

        </router-link>

        <router-link class="block-five" to="/main/my_order?type=3">
          <i class="icon iconfont icon-daifahuo1 five-icon"></i>
          <p class="five-text">待发货</p>
          <span class="bage" v-if="order_count.payed!=0">{{order_count.payed}}</span>

        </router-link>

        <router-link class="block-five" to="/main/my_order?type=4">
          <i class="icon iconfont icon-yifahuo1 five-icon"></i>
          <p class="five-text">待收货</p>
          <span class="bage" v-if="order_count.dispatch!=0">{{order_count.dispatch}}</span>

        </router-link>
        <router-link class="block-five" to="/main/refund_and_aftersales?type=return">
          <i class="icon iconfont icon-weibiaoti- five-icon"></i>
          <p class="five-text">退款/售后</p>
        </router-link>
      </div>
    </div>
    <div class="bgf">
      <p class="check-all-p my-order-text often-p">常用工具</p>
      <div class="disf two-div">
        <router-link to="/main/address_manage" class="often-div often1">
          <img src="../../../static/img/my/address-manage.png" alt="" class="often-pic often-pic1">
          <p class="texac often-text">地址管理</p>
        </router-link>
        <!--618-->
<!--        <router-link to="/main/update_to_store_manager" class="often-div" v-if="isVip==0">
          <img src="../../../static/img/my/open-store.png" alt="" class="often-pic">
          <p class="texac often-text">申请开店</p>
        </router-link>-->
        <!--        <div class="often-div">
                  <img src="../../../static/img/my/lucky.png" alt="" class="often-pic">
                  <p class="texac often-text">积分抽奖</p>
                </div>-->
      </div>

    </div>
    <footer-tab :index="index" :list="tabList"></footer-tab>
  </div>

</template>

<script>
  import FooterTab from '../common_components/footer_tab.vue'
  import config from '../../api/config'
  import {getPersonInfo,get_messad_count} from '../../api/index'

  export default {
    data() {
      return {
        minHeight: 0,
        isVip: 0,
        head_pic: '',
        nick_name: '昵称',
        vip_rank: 0,
        now_score: 0,
        count: 0,
        index:3,
        is_new_voucher:0,
        order_count:{
          paying:0,
          payed:0,
          confirming:0,
          dispatch:0

        },
        newsCount:0,
        tabList:[],
        base:'',
        vipIdentity:[]
      }
    },
    created() {
      this.$dialog.loading.close();
      this.base = config.domain + location.pathname;
      this.isVip = localStorage.getItem('isVip');
/*      if (this.isVip == 1) {
        this.tabList =config.tabbar;
        this.index=4;
      } else {
        this.tabList =config.tabbar1;
        this.index=3;
      }*/
      this.tabList =config.tabbar1;
      this.index=3;
      this.minHeight = localStorage.getItem('minHeight');
      this.vipIdentity=config.vipIdentity;
      this.getUserInfor();
    },
/*    watch:{
      isVip(n,o){
        if(n==1){
          this.tabList =config.tabbar;
          this.index=4;
        }else{
          this.tabList =config.tabbar1;
          this.index=3;
        }
      }
    },*/
    methods: {
      //查看个人信息
      checkInFor(){
        this.$router.push('/main/person_information');
      },
      //是否有新消息
      isHasNews() {
        var _this = this;
        if (localStorage.getItem('token')) {
          get_messad_count({'token': localStorage.getItem('token')}).then(function (res) {
            var data = res.data.data;
            _this.newsCount = Number(data.person_count) + Number(data.system_count);
          }).catch(function (err) {
            console.log(err);
          })
        }

      },
      //获取个人信息
      getUserInfor() {
        var _this = this;
        this.$dialog.loading.open('');
        getPersonInfo({'token': localStorage.getItem('token')}).then(function (res) {
          //console.log('infor',res);
          var data = res.data.data;
          _this.head_pic = data.head_pic;
          _this.nick_name = data.nick_name;
          _this.vip_rank = data.vip_rank;
          _this.now_score = data.now_score;
          _this.count = data.count;
          _this.is_new_voucher=data.is_new_voucher;
          _this.order_count=data.order_count;
          if(localStorage.getItem('isVip')!=data.is_vip){
            localStorage.setItem('isVip',data.is_vip);
            _this.isVip=data.is_vip;
          }
          _this.$dialog.loading.close();

        }).catch(function (err) {
          console.log(err);
        })
      },
    },
    components: {
      'footer-tab': FooterTab
    },
  }
</script>
<style scoped="true">
  @import "../../../static/css/my/my.css";
  .setting{
    margin-right:0.4rem;
    font-size:0.34rem;
  }
</style>
