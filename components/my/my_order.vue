<template>
  <div class="box-div">
    <div id="common-scroll-nav">
      <ul class="disf common-list-ul">
        <li class="common-list" :class="{'common-active':activeIndex==0}" @click="changeActive(0,'all')">
          全部
        </li>
        <li class="common-list" :class="{'common-active':activeIndex==1}"
            @click="changeActive(1,'paying')">
          待付款
        </li>
        <li class="common-list" :class="{'common-active':activeIndex==2}"
            @click="changeActive(2,'confirming')">
          待分享
        </li>
        <li class="common-list" :class="{'common-active':activeIndex==3}"
            @click="changeActive(3,'payed')">
          待发货
        </li>
        <li class="common-list" :class="{'common-active':activeIndex==4}"
            @click="changeActive(4,'dispatch')">
          待收货
        </li>
        <li class="common-list" :class="{'common-active':activeIndex==5}"
            @click="changeActive(5,'commenting')">
          待评价
        </li>
      </ul>
    </div>

    <div :style="{'-webkit-overflow-scrolling': scrollMode}">
      <v-loadmore :bottom-method="loadBottom" :bottom-all-loaded="allLoaded" :distanceIndex="1" :bottomDistance="70"
                  :autoFill="false" ref="loadmore">
        <ul class="order-list">
          <li class="box-li" v-for="(item,index) in orderList" :id="'li'+item.id">
            <p class="order-num-p disf row" @click="checkOrderDesc(item.id,index)">
              <span>{{'订单号：' + item.order_number}}</span>
              <span class="status" v-if="item.state=='paying'">待付款</span>
              <span class="status" v-if="item.state=='confirming'">待分享</span>
              <span class="status" v-if="item.state=='payed'">待发货</span>
              <span class="status" v-if="item.state=='dispatch'">待收货</span>
              <span class="status" v-if="item.state=='commenting'">待评价</span>
              <span class="status" v-if="item.state=='completed'&&item.cancle_return=='normal'">交易完成</span>
              <span class="status" v-if="item.state=='completed'&&item.cancle_return=='cancle'">交易取消</span>
              <span class="status" v-if="item.state=='completed'&&item.cancle_return=='return'">已退款</span>
              <span class="status" v-if="item.state=='completed'&&item.cancle_return=='invalid'">交易关闭</span>
              <span class="status" v-if="item.state=='returning'">退款处理中</span>
              <span class="status" v-if="item.state=='returned'">已退款</span>
            </p>
            <div class="box disf row" v-for="good in item.goods" :class="item.type+'-'+good.id"
                 @click="checkOrderDesc(item.id,index)">
              <img :src="good.pic" class="good-pic" alt="">
              <div class="right-good">
                <p class="good-name">{{good.goods_name}}</p>
                <p class="good-size">{{good.pvs_name}}</p>
              </div>
            </div>
            <p class="msg"><span>共</span><span>{{item.goods.length}}</span><span>件，合计</span><span
              class="red-price">{{'￥' + item.total_price}}</span>
              <!--    <span class="gray">{{'（含运费￥' + item.freight + '）'}}</span>-->
            </p>
            <p class="btn-p">
              <!--待付款-->
              <button class="btn" v-if="item.state=='paying'" @click="cancelOrder(item.id,index)">取消订单</button>
              <button class="btn red-btn" v-if="item.state=='paying'" @click="payAgain(item)">付款</button>
              <!--待分享-->
              <button class="btn red-btn" v-if="item.state=='confirming'" @click="showShare(item)">邀请好友拼单</button>

              <!--待发货-->
              <!--<button class="btn" v-if="item.state=='payed'">提醒发货</button>-->

              <!--待收货-->
              <button class="btn" v-if="item.state=='dispatch'" @click="checkLogistics(item)">查看物流</button>
              <button class="btn red-btn" v-if="item.state=='dispatch'" @click="confirmReceive(item.id,index)">确认收货
              </button>

              <!--待评价-->
              <button class="btn red-btn" v-if="item.state=='commenting'" @click="comment(item.id,index)">去评价</button>
              <!--交易完成-->
              <button class="btn" v-if="item.state=='completed'" @click="deleteOrder(item.id,index)">删除订单
              </button>

            </p>
          </li>
        </ul>
      </v-loadmore>
      <div v-if="orderList.length!==0&&allLoaded" class="texac no-more-tip">没有更多了~</div>
      <div v-else-if="orderList.length!==0&&!allLoaded" class="texac no-more-tip">上拉加载更多~</div>
    </div>

    <div class="no-order-div" v-if="orderList.length==0">
      <img src="../../../static/img/my/no-order.png" class="no-order-pic" alt="">
      <p class="no-order-text">您还没有相关订单哦~</p>
    </div>
    <cover :isShowSize="isShowComment" :closeByZhao="true" @coverClose="coverClose">
      <div class="star-box">
        <p class="comment-tip-p"><span class="cancel" @click="coverClose">取消</span><span class="ok"
                                                                                         @click="submitComment">确定</span>
        </p>
        <p class="star-ti">请您对此次购物评分~</p>

        <div class="star-div">

          <i class="icon iconfont icon-xingxing  defaultClass" id="icon0" @click="commentStar($event,0)"></i>
          <i class="icon iconfont icon-xingxing  defaultClass" id="icon1" @click="commentStar($event,1)"></i>
          <i class="icon iconfont icon-xingxing  defaultClass" id="icon2" @click="commentStar($event,2)"></i>
          <i class="icon iconfont icon-xingxing  defaultClass" id="icon3" @click="commentStar($event,3)"></i>
          <i class="icon iconfont icon-xingxing  defaultClass" id="icon4" @click="commentStar($event,4)"></i>
        </div>
      </div>
    </cover>
    <div class="sell-cover"  @click="shareShow=false" v-if="shareShow">
      <img src="../../../static/img/click-share.png" class="click-share" alt="">
    </div>

    <div class="first_page">
      <router-link to="/"><img src="../../../static/img/first_page.png" alt=""></router-link>
    </div>

  </div>
</template>

<script>
  import Cover from '../common_components/cover.vue'
  import {
    get_my_orderlist,
    upload_order_comment,
    confirm_receive,
    getOrderTracesByJson,
    delete_order,
    cancle_order
  } from '../../api/index'
  import config from '../../api/config'

  export default {
    data() {
      return {
        //  上拉加载数据
        minHeight: 0,
        allLoaded: false,//是否可以上拉属性，false可以上拉，true为禁止上拉，就是不让往上划加载数据了
        scrollMode: 'auto',//移动端弹性滚动效果，touch为弹性滚动，auto是非弹性滚动
        totalPage: 0,
        id: 0,
        isVip: 0,
        activeIndex: 0,
        params: {
          token: '',
          page: 1,
          number: 15,
          state: 'all',
        },
        orderList: [],
        isShowComment: false,
        commentId: '',
        commentIndex: 0,
        score: 0,
        shareShow: false,
        isFirstEnter: false
      }
    },
    created() {

      this.isFirstEnter = true;

    },
    methods: {
      //初始化数据
      initialData() {
        this.minHeight = '';
        this.allLoaded = false;
        this.scrollMode = 'auto';
        this.totalPage = 0;
        this.id = 0;
        this.isVip = 0;
        this.activeIndex = 0;
        this.params = {
          token: '',
          page: 1,
          number: 15,
          state: 'all',
        };
        this.orderList = [];
        this.isShowComment = false;
        this.commentId = '';
        this.commentIndex = 0;
        this.score = 0;
        this.shareShow = false;
        this.isFirstEnter = false;
      },
      //切换滚动导航
      changeActive(index, state) {
        var _this = this;
        this.orderList = [];
        this.activeIndex = index;
        this.params.state = state;
        this.params.page = 1;
        this.allLoaded = false;
        this.totalPage = 0;
        this.scrollMode = 'auto';
        this.getMyOrderList();

      },
      //获取我的订单列表
      getMyOrderList() {
        var _this = this;
        this.$dialog.loading.open('');
        get_my_orderlist(this.params).then(function (res) {
          var data = res.data.data.data;
          _this.orderList = data;
          _this.totalPage = Math.ceil(Number(res.data.data.count) / Number(_this.params.number));
          if (_this.params.page == _this.totalPage || data.length < _this.params.number) {
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
        get_my_orderlist(this.params).then(function (res) {
          var data = res.data.data.data;
          _this.orderList = _this.orderList.concat(data);
          _this.totalPage = Math.ceil(Number(res.data.data.count) / Number(_this.params.number));
          if (_this.params.page == _this.totalPage || data.length < _this.params.number) {
            _this.allLoaded = true;
          }
          _this.$refs.loadmore.onBottomLoaded();
        });
      },
      orderReload() {
        var _this = this;
        var osTop = document.documentElement.scrollTop || document.body.scrollTop;
        sessionStorage.setItem('order_top', osTop);
        _this.params.number = this.orderList.length;
        this.params.page = 1;
        this.totalPage = 0;
        this.scrollMode = 'auto';
        this.allLoaded = false;
        _this.orderList = [];
        _this.getMyOrderList();
        _this.params.number = 5;
        setTimeout(function () {
          if (sessionStorage.getItem('order_top')) {
            window.scrollTo(0, Number(sessionStorage.getItem('order_top')));
          } else {
            window.scrollTo(0, 0);
          }
        }, 200)
      },
      //查看订单详情
      checkOrderDesc(id, index) {
        this.$router.push('/main/order_desc?order_id=' + id + '&type=' + this.activeIndex+'&from=/main/my_order');
      },
      //子组件发射事件遮罩层关闭coverClose
      coverClose(bool) {
        //bool为子组件通过自定义事件close穿过来的值
        this.isShowComment = false;
        this.changeAllStarGray();
      },
      //评价弹窗关闭时，把所有的星星都变为灰色
      changeAllStarGray() {
        for (var i = 0; i < 5; i++) {
          var icon = document.getElementById('icon' + i);
          if (icon.className.match(new RegExp("(\\s|^)" + 'choosedClass' + "(\\s|$)"))) {
            icon.className = icon.className.replace(new RegExp("(\\s|^)" + 'choosedClass' + "(\\s|$)"), " defaultClass");
          }
        }
      },
      //评价框
      comment(id, index) {
        this.isShowComment = true;
        this.commentId = id;
        this.commentIndex = index
      },
      //星星点击事件
      commentStar(event, index) {
        this.score = Number(index) + 1;
        for (var i = 0; i < 5; i++) {
          var icon = document.getElementById('icon' + i);
          if (i == index) {
            if (icon.className.match(new RegExp("(\\s|^)" + 'defaultClass' + "(\\s|$)"))) {
              icon.className = icon.className.replace(new RegExp("(\\s|^)" + 'defaultClass' + "(\\s|$)"), " choosedClass");
            }
          } else if (i < index) {
            if (icon.className.match(new RegExp("(\\s|^)" + 'defaultClass' + "(\\s|$)"))) {
              icon.className = icon.className.replace(new RegExp("(\\s|^)" + 'defaultClass' + "(\\s|$)"), " choosedClass");
            }
          } else if (i > index) {
            if (icon.className.match(new RegExp("(\\s|^)" + 'choosedClass' + "(\\s|$)"))) {
              icon.className = icon.className.replace(new RegExp("(\\s|^)" + 'choosedClass' + "(\\s|$)"), " defaultClass");
            }
          }

        }
      },
      //提交评价
      submitComment() {
        var _this = this;
        var obj = {
          'order_id': this.commentId,
          'token': localStorage.getItem('token'),
          'score': this.score,
        };
        upload_order_comment(obj).then(function (res) {
          console.log(res);
          if (res.data.errcode == 0) {
            _this.isShowComment = false;
            _this.changeAllStarGray();
            _this.$dialog.toast({
              mes: '发表成功',
              timeout: 1000
            });
            _this.orderReload();

//             _this.orderList[_this.commentIndex].state = 'completed';

          } else {
            _this.$dialog.toast({
              mes: res.data.errdesc,
              timeout: 1000
            });
          }

        }).catch(function (err) {
          console.log(err);
        })
      },
      //付款
      payAgain(item) {
        this.$router.push('/main/pay_again?order_id=' + item.id + '&total_price=' + item.total_price + '&type=' + item.type);
      },
      //邀请好友拼单
      showShare(item) {
        this.$router.push('/main/group_invite?order_id=' + item.id);
      },
      //确认收货
      confirmReceive(id, index) {
        var _this = this;
        confirm_receive({'token': localStorage.getItem('token'), 'order_id': id}).then(function (res) {
          console.log('res==', res);
          if (res.data.errcode == 0) {
            _this.$dialog.toast({
              mes: '确认收货成功',
              timeout: 1000,
              icon: 'success'
            });
            _this.orderReload();
          } else {
            _this.$dialog.toast({
              mes: res.data.errdesc,
              timeout: 1000
            });
          }
        }).catch(function (err) {
          console.log(err);
        })
      },
      //查看物流
      checkLogistics(item) {
        this.$router.push({
          path: '/main/logistics_desc',
          query: {
            order_id: item.id,
            orderCode: item.order_number,
            shipperCode: item.shipperCode,
            logisticCode: item.logisticCode
          }
        })
      },
      //删除订单
      deleteOrder(id, index) {
        var _this = this;
        this.$dialog.confirm({
          title: '提示',
          mes: '您确定要删除订单吗？',
          opts: () => {
            delete_order({'token': localStorage.getItem('token'), 'order_id': id}).then(function (res) {
              if (res.data.errcode == 0) {
                _this.$dialog.toast({
                  mes: '删除成功',
                  timeout: 1000,
                  icon: 'success'
                });
                /*_this.orderReload();*/
                _this.orderList = _this.orderList.slice(0, index).concat(_this.orderList.slice(index + 1, _this.orderList.length));

              } else {
                _this.$dialog.toast({
                  mes: res.data.errdesc,
                  timeout: 1000
                });
              }
            }).catch(function (err) {
              console.log(err);
            })
          }
        });
      },
      //取消订单
      cancelOrder(id, index) {
        var _this = this;
        this.$dialog.confirm({
          title: '提示',
          mes: '您确定要取消订单吗？',
          opts: () => {
            cancle_order({'token': localStorage.getItem('token'), 'order_id': id}).then(function (res) {
              if (res.data.errcode == 0) {
                _this.$dialog.toast({
                  mes: '取消成功',
                  timeout: 1000,
                  icon: 'success'
                });
                _this.orderList[index].state = 'completed';
              } else {
                _this.$dialog.toast({
                  mes: res.data.errdesc,
                  timeout: 1000
                });
              }
            }).catch(function (err) {
              console.log(err);
            })
          }
        });

      },

    },
    components: {
      'cover': Cover
    },
    beforeRouteEnter(to, from, next) {
      // 路由导航钩子，此时还不能获取组件实例 `this`，所以无法在data中定义变量（利用vm除外）
      // 参考 https://router.vuejs.org/zh-cn/advanced/navigation-guards.html
      // 所以，利用路由元信息中的meta字段设置变量，方便在各个位置获取。这就是为什么在meta中定义isBack
      // 参考 https://router.vuejs.org/zh-cn/advanced/meta.html
      if (from.name == 'order_desc' || from.name == 'logistics_desc') {
        to.meta.isBack = true;
        //判断是从哪个路由过来的，
        //如果是page2过来的，表明当前页面不需要刷新获取新数据，直接用之前缓存的数据即可
      }

      next();
    },
    activated() {
      this.$dialog.loading.close();
      if (!this.$route.meta.isBack || this.isFirstEnter) {
        this.initialData();
        this.minHeight = localStorage.getItem('minHeight');
        this.activeIndex = Number(this.$route.query.type);
        switch (this.activeIndex) {
          case 0:
            this.params.state = 'all';
            break;
          case 1:
            this.params.state = 'paying';
            break;
          case 2:
            this.params.state = 'confirming';
            break;
          case 3:
            this.params.state = 'payed';
            break;
          case 4:
            this.params.state = 'dispatch';
            break;
          case 5:
            this.params.state = 'commenting';
            break;
        }
        this.params.token = localStorage.getItem('token');
        this.getMyOrderList();
      }
      if (this.$route.meta.isBack) {
        this.params.page = 1;
        this.totalPage = 0;
        this.scrollMode = 'auto';
        this.allLoaded = false;
        this.params.number = this.orderList.length;
        this.orderList = [];
        this.getMyOrderList();
        this.params.number = 10;
        setTimeout(function () {
          if (sessionStorage.getItem('order_top')) {
            window.scrollTo(0, Number(sessionStorage.getItem('order_top')));
          } else {
            window.scrollTo(0, 0);
          }
        }, 200)
      }
      // 恢复成默认的false，避免isBack一直是true，导致下次无法获取数据
      this.$route.meta.isBack = false;
      this.isFirstEnter = false;
    },
    beforeRouteLeave(to, from, next) {
      var osTop = document.documentElement.scrollTop || document.body.scrollTop;
      sessionStorage.setItem('order_top', osTop);
      next();
    },


  }
</script>
<style scoped="true">
  @import '../../../static/css/order/my_order.css';


</style>
