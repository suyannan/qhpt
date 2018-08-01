<template>
  <div class="my-quan-container" :style="'min-height:'+minHeight">
    <ul class="disf ul">
      <li class="type-li " :class="{'active':activeType==1}" @click="changeType(1)">
        <span>未使用</span><span>{{'（' + avaliableLen + '）'}}</span>
      </li>
      <li class="type-li" :class="{'active':activeType==0}" @click="changeType(0)">
        <span>已失效</span><span>{{'（' + noAvaliableLen + '）'}}</span>
      </li>
    </ul>
    <div class="no-order-div" v-show="list.length==0">
      <img src="../../../static/img/my/no-coupon.png" class="no-coupon-pic" alt="">
      <p class="no-order-text">您还没有相关抵用券哦~</p>
    </div>
    <div :style="{'-webkit-overflow-scrolling': scrollMode}">
      <v-loadmore :bottom-method="loadBottom" :bottom-all-loaded="allLoaded" :distanceIndex="1" :bottomDistance="70"
                  :autoFill="false" ref="loadmore">
        <ul>
          <li class="coupons-li" v-for="item in list">
            <div class="coupon-div">
              <img src="../../../static/img/shop/coupon-userful.png" v-show="activeType==1" class="coupons" alt="" @click="cancelPreview()">
              <img src="../../../static/img/shop/coupon-nouse.png" v-show="activeType==0" class="coupons" alt=""  @click="cancelPreview()">
              <div class="red-block-text">
                <p class="value"><span class="sign">￥</span>{{item.price_value}}</p>
                <p class="condition"><span>满</span><span>{{item.limit_price}}</span><span>可用</span></p>
              </div>
              <div class="white-block-text">
                <p class="tit">满减券</p>
                <p class="time">{{item.dis}}</p>
                <!--<p class="condition1">仅限美妆频道使用</p>-->
                <p class="time">
                  有效期：<span>{{item.start_date.split(' ')[0]}}</span>-<span>{{item.end_date.split(' ')[0]}}</span></p>
              </div>
              <i class="icon iconfont icon-yishixiao" v-show="activeType==0"></i>
              <!--<i class="icon iconfont icon-erweima" v-show="activeType==1" @click="isShowCode=true"></i>-->
              <i class="icon iconfont icon-erweima" v-show="activeType==1" @click="isShowPic(item.voucher_code)"></i>

            </div>
          </li>
        </ul>
      </v-loadmore>
      <div v-if="list.length!==0&&allLoaded" class="texac no-more-tip">没有更多了~</div>
      <div v-else-if="list.length!==0&&!allLoaded" class="texac no-more-tip">上拉加载更多~</div>
    </div>

    <!--    <ul v-show="activeType==1" v-for="item in list">
          <li class="coupons-li">
            <div class="coupon-div">
              <img src="../../../static/img/shop/coupon-nouse.png" class="coupons" alt="">
              <div class="red-block-text">
                <p class="value"><span class="sign">￥</span>{{item.price_value}}</p>
                <p class="condition"><span>满</span><span>{{item.limit_price}}</span><span>可用</span></p>
              </div>
              <div class="white-block-text">
                <p class="tit">满减券</p>
                &lt;!&ndash;<p class="condition1">仅限美妆频道使用</p>&ndash;&gt;
                <p class="time">有效期：<span>{{item.start_date.split(' ')[0]}}</span>-<span>{{item.end_date.split(' ')[0]}}</span></p>
              </div>
              <i class="icon iconfont icon-yishixiao"></i>
            </div>
          </li>

        </ul>-->
    <div class="checkCodeCover" v-show="isShowCode">
      <div class="code-div">
        <img :src="srcUrl" alt="">
        <!--<i class="icon iconfont icon-erweima code-icon"></i>-->
      </div>
      <i class="icon iconfont icon-guanbi1" @click="isShowCode=false"></i>
    </div>

  </div>
</template>

<script>
  import {get_voucher_list} from '../../api/index'
//  import VueQArt from '../common_components/vue-qart'
  export default {
//    components: {VueQArt},
    data() {
      return {
        srcUrl: '',
        minHeight: '',
        activeType: 1,//未使用1，已失效0
        noCoupon: false,
        avaliableLen: 0,
        noAvaliableLen: 0,
        list: [],
        no_avaliable_list: [],
        params: {
          token: localStorage.getItem('token'),
          page: 1,
          number: 10,
          is_available: 1,
        },
        //  上拉加载数据
        allLoaded: false,//是否可以上拉属性，false可以上拉，true为禁止上拉，就是不让往上划加载数据了
        scrollMode: 'auto',//移动端弹性滚动效果，touch为弹性滚动，auto是非弹性滚动
        totalPage: 0,
        isVip: 0,
        isShowCode: false
      }
    },
    created() {
      this.$dialog.loading.close();

    },
    mounted() {
      this.minHeight = localStorage.getItem('minHeight');
      this.getVoucherList(1);
      this.getNoAvaliableLen();
    },
    methods: {

      //切换类别
      changeType(type) {
        this.params.page = 1;
        this.allLoaded = false;
        this.totalPage = 0;
        this.scrollMode = 'auto';
        this.list = [];
        this.activeType = type;
        this.getVoucherList(type);
      },

      //二维码生成
      isShowPic(code){
        this.isShowCode = true;
        var QRCode = require('qrcode')
        var _this = this;
        QRCode.toDataURL(code,{
          width:700,
          height:700
        }, function (err, url) {
          _this.srcUrl = url;
        })
      },
      //获取我的抵用券列表
      getVoucherList(is_available) {
        var _this = this;
        this.params.is_available = is_available;
        this.$dialog.loading.open('');
        get_voucher_list(this.params).then(function (res) {
          var list = res.data.data.data;
          _this.list = list;

          if (is_available == 1) {
            _this.avaliableLen = res.data.data.count;
          } else {
            _this.noAvaliableLen = res.data.data.count;
          }
          _this.totalPage = Math.ceil(Number(res.data.data.count) / Number(_this.params.number));
          if (_this.params.page == _this.totalPage || list.length < _this.params.number) {
            _this.allLoaded = true;
          }
          _this.$nextTick(function () {
            // 原意是DOM更新循环结束时调用延迟回调函数，大意就是DOM元素在因为某些原因要进行修改就在这里写，要在修改某些数据后才能写，
            // 这里之所以加是因为有个坑，iphone在使用-webkit-overflow-scrolling属性，就是移动端弹性滚动效果时会屏蔽loadmore的上拉加载效果，
            // 花了好久才解决这个问题，就是用这个函数，意思就是先设置属性为auto，正常滑动，加载完数据后改成弹性滑动，安卓没有这个问题，移动端弹性滑动体验会更好
            _this.scrollMode = "touch";
          });
          _this.$dialog.loading.close();

        }).catch(function (err) {
          console.log(err);
        })
      },
      loadBottom() {
        var _this = this;
        _this.params.page++;
        get_voucher_list(this.params).then(function (res) {
          var list = res.data.data.data;
          _this.list = _this.list.concat(list);
          _this.totalPage = Math.ceil(Number(res.data.data.count) / Number(_this.params.number));
          if (_this.params.page == _this.totalPage || list.length < _this.params.number) {
            _this.allLoaded = true;
          }
          _this.$refs.loadmore.onBottomLoaded();
        });
      },
      //获取已失效抵用券的数量
      getNoAvaliableLen() {
        var _this = this;
        var obj={
          token: localStorage.getItem('token'),
          page: 1,
          number: 10,
          is_available: 0
        };
        get_voucher_list(obj).then(function (res) {
          _this.noAvaliableLen = res.data.data.count;
        }).catch(function (err) {
          console.log(err);
        })
      },
      cancelPreview(){}

    }

  }
</script>
<style scoped="true">
  @import "../../../static/css/my/my_quan.css";
  .code-div img{
    width:100%;
  }
</style>
