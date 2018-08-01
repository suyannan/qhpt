<template>
  <div class="container" :style="'min-height:'+minHeight">

    <div :style="{'-webkit-overflow-scrolling': scrollMode}">
      <v-loadmore :bottom-method="loadBottom" :bottom-all-loaded="allLoaded" :distanceIndex="1" :bottomDistance="70"
                  :autoFill="false" ref="loadmore">
        <ul v-for="item in list">
          <li class="coupons-li" @click="choosed(item)">
            <div class="coupon-div">
              <img src="../../../static/img/shop/coupon-userful.png" class="coupons" alt="">
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
            </div>
          </li>

        </ul>
      </v-loadmore>
      <div v-if="list.length!==0&&allLoaded" class="texac no-more-tip">没有更多了~</div>
      <div v-else-if="list.length!==0&&!allLoaded" class="texac no-more-tip">上拉加载更多~</div>
    </div>

  </div>
</template>

<script>

  import {get_suit_voucher} from '../../api/index'

  export default {
    data() {
      return {
        minHeight: '',
        params: {
          token: localStorage.getItem('token'),
          page: 1,
          number: 10,
          order_price: 0,
        },
        list: [],
        allLoaded: false,//是否可以上拉属性，false可以上拉，true为禁止上拉，就是不让往上划加载数据了
        scrollMode: 'auto',//移动端弹性滚动效果，touch为弹性滚动，auto是非弹性滚动
        totalPage: 0,
      }
    },
    created() {
      this.$dialog.loading.close();
      this.minHeight = localStorage.getItem('minHeight');
      this.params.order_price = this.$route.query.order_price;
      this.getSuitVoucher();
    },
    methods: {
      //获取下单时可用优惠券列表
      getSuitVoucher() {
        var _this = this;
        this.$dialog.loading.open('');
        get_suit_voucher(this.params).then(function (res) {
          var list = res.data.data.data;
          _this.list = list;
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
        get_suit_voucher(this.params).then(function (res) {
          const goods = res.data.data.data;
          var list = res.data.data.data;
          _this.list = _this.list.concat(list);
          _this.totalPage = Math.ceil(Number(res.data.data.count) / Number(_this.params.number));
          if (_this.params.page == _this.totalPage || list.length < _this.params.number) {
            _this.allLoaded = true;
          }
          _this.$refs.loadmore.onBottomLoaded();
        });
      },
      //选择完优惠券后返回创建订单界面
      choosed(item) {
        sessionStorage.setItem('choosedVoucher', JSON.stringify(item));
        this.$router.push(this.$route.query.back);
      }
    }
  }
</script>
<style scoped="true">
  .container {
    background: #eee;
  }

  .ul {
    padding: 0.19rem 1.17rem 0 1.17rem;
    justify-content: space-between;
    background: #fff;
  }

  .type-li {
    font-size: 0.28rem;
    color: #2f2f2f;
    padding-bottom: 0.1rem;
    padding-left: 0.1rem;
  }

  .active {
    color: #b81f23;
    border-bottom: 2px solid #b81f23;
  }

  .coupons-li {
    /* padding: 0.3rem 0;*/
    margin: 0.34rem 0.2rem;
  }

  .coupons {
    width: 100%;
  }

  .coupon-div {
    width: 100%;
    position: relative;
    margin-top: 0.24rem;
  }

  .red-block-text {
    position: absolute;
    left: 0.49rem;
    top: 0.4rem;
  }

  .value {
    font-size: 0.70rem;
    color: #ffffff;
    margin-bottom: 0.09rem;
  }

  .sign {
    font-size: 0.30rem;
    color: #ffffff;
  }

  .condition {
    font-size: 0.20rem;
    color: #ffffff;
    padding-left: 0.15rem;
  }

  .white-block-text {
    height: 100%;
    position: absolute;
    left: 2.57rem;
    top: 0;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    padding-top: 0.23rem;
    padding-bottom: 0.2rem;
  }

  .tit {
    font-size: 0.28rem;
    color: #2f2f2f;
  }

  .condition1 {
    font-size: 0.22rem;
    color: #898989;
  }

  .time {
    font-size: 0.22rem;
    color: #898989;
  }

  .icon-yishixiao {
    position: absolute;
    top: -0.2rem;
    right: 0.1rem;
    font-size: 1.4rem;
    color: #d2d2d2;
  }

  .tip {
    text-align: center;
    font-size: 0.26rem;
    color: #898989;
    margin-top: 0.36rem;
  }

  .no-order-div {
    width: 100%;
    margin-top: 2rem;
    position: relative;

  }

  .no-coupon-pic {
    width: 100%;
  }

  .no-order-text {
    position: absolute;
    width: 100%;
    text-align: center;
    bottom: 1.2rem;
    left: 0;
    font-size: 0.26rem;
    color: #898989;
  }

</style>
