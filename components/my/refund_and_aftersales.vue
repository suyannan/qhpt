<template>
  <div>

    <div :style="{'-webkit-overflow-scrolling': scrollMode}">
      <v-loadmore :bottom-method="loadBottom" :bottom-all-loaded="allLoaded" :distanceIndex="1" :bottomDistance="70"
                  :autoFill="false" ref="loadmore">
        <ul class="order-list">
          <li class="box-li" v-for="item in orderList">
            <p class="order-num-p disf row">
              <span>{{'订单号：' + item.order_number}}</span>
              <span class="status" v-if="item.return_state=='handing'">处理中</span>
              <span class="status" v-if="item.return_state=='return'">驳回</span>
              <span class="status" v-if="item.return_state=='handed'">已退款</span>
            </p>
            <div class="box disf row" v-for="good in item.goods" :class="item.type+'-'+good.id"
                 @click="checkOrderDesc(item.id)">
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
          </li>

        </ul>
      </v-loadmore>
      <div v-if="orderList.length!==0&&allLoaded" class="texac no-more-tip">没有更多了~</div>
      <div v-else-if="orderList.length!==0&&!allLoaded" class="texac no-more-tip">上拉加载更多~</div>
    </div>


    <div class="no-order-div" v-if="orderList.length==0">
      <img src="../../../static/img/my/no-order.png" class="no-order-pic" alt="">
      <p class="no-order-text">您还没有相关订单哦</p>
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

    <div class="first_page"><router-link to="/"><img src="../../../static/img/first_page.png" alt=""></router-link></div>

  </div>
</template>

<script>

  import Cover from '../common_components/cover.vue'
  import {get_my_orderlist, upload_order_comment, confirm_receive} from '../../api/index'
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
          number: 20,
          state: '',
        },
        orderList: [],
        isShowComment: false,
        commentId: '',
        score: 0,
        shareShow: false
      }
    },
    created() {
      this.$dialog.loading.close();
      this.minHeight = localStorage.getItem('minHeight');
      this.params.state = this.$route.query.type;
      this.params.token = localStorage.getItem('token');
      this.getMyOrderList();
    },
    methods: {
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
          var orderList = res.data.data.data;
          _this.orderList = _this.orderList.concat(orderList);
          _this.totalPage = Math.ceil(Number(res.data.data.count) / Number(_this.params.number));
          if (_this.params.page == _this.totalPage || orderList.length < _this.params.number) {
            _this.allLoaded = true;
          }
          _this.$refs.loadmore.onBottomLoaded();
        });
      },
      //查看订单详情
      checkOrderDesc(id) {
        this.$router.push('/main/order_desc?order_id=' + id+'&from=/main/refund_and_aftersales');
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
      comment(id) {
        this.isShowComment = true;
        this.commentId = id;
      },
      //星星点击事件
      commentStar(event, index) {
        //console.log(event,index);
        //console.log(event.target.className);
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
        this.$router.push('/main/pay_again/' + item.id + '/' + item.total_price)
      },
      //邀请好友拼单
      showShare(item) {
        this.shareShow = true;
        var _this = this;
        var UrlAttr = (decodeURIComponent(location.href)).split('#');
        var param = '/main/grounp_desc?id=' + item.group_id + '&groupInviter=' + item.invite_code;
        var link = config.redirect_url + "?host=" + encodeURIComponent(UrlAttr[0]) + "&param=" + encodeURIComponent(param);
        _this.wxutils.wxShare(item.goods[0].goods_name, item.goods[0].goods_name, link, item.goods[0].pic);
      },
      confirmReceive(id) {
        var _this = this;
        confirm_receive({'token': localStorage.getItem('token'), 'order_id': id}).then(function (res) {
          console.log('res==', res);
          if (res.data.errcode == 0) {
            _this.$dialog.toast({
              mes: '确认收货成功',
              timeout: 1000,
              icon: 'success'
            });
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

    },
    components: {
      'cover': Cover
    }

  }
</script>
<style scoped="true">
  @import '../../../static/css/order/my_order.css';

  .order-list {
    margin-top: 0;
    padding-top: 0.2rem;
  }

  .star-div {
    background: #fff;
    font-size: 0.28rem;
    color: #2f2f2f;
  }
  .box-li {
    border-bottom: 0.14rem solid #eee;
    border-top:0;
  }

  .comment-text {
    margin-right: 0.42rem;
  }

  .star-box {
    background: #fff;
  }

  .star-div {
    padding-bottom: 1rem;
    margin: 0 0.29rem 0 1rem;
    display: flex;
    align-items: center;
    border-bottom: 1px solid #eee;
  }

  .comment-text {
    margin-right: 0.3rem;
  }

  .choosedClass {
    color: #ffc700;
  }

  .defaultClass {
    color: #eeeeee;
  }

  .icon-xingxing {
    font-size: 0.58rem;
    margin: 0 0.18rem;
  }

  .star-ti {
    padding: 0.5rem 0.45rem 0.6rem 0.45rem;
    font-size: 0.28rem;
    color: #2f2f2f;
  }

  .comment-tip-p {
    padding: 0.29rem 0.45rem;
    display: flex;
    justify-content: space-between;
    border-bottom: 1px solid #d9d9d9;
    background: #FBFBFB;
    font-weight: bold;
  }

  .ok {
    color: #0BB20C;
    font-size: 0.28rem;

  }

  .cancel {
    color: #2f2f2f;
    font-size: 0.28rem;
  }

  .good-pic {
    width: 1.6rem;
    height: 1.6rem;
    margin: 0 0.58rem 0 0.32rem;
  }

</style>
