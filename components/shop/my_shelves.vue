<template>
  <div class="shelves-container" :style="'min-height: '+minHeight">
    <div class="fixed-div">
      <div class="bg">
        <img src="../../../static/img/shop/shelves-bg.png" alt="">
        <div class="msg">
          <div class="header-div">
            <img src="../../../static/img/shop/default_header.png" v-if="infor.head_pic==''" class="header" alt="">
            <img :src="infor.head_pic" v-else class="header" alt="">
          </div>
          <div>
            <p class="username">{{infor.nick_name}}</p>
            <p><span>商品 </span><span>{{goodsLen}}</span><span class="text">活动 </span><span>{{activityLen}}</span></p>
          </div>
        </div>
        <span class="share-btn" @click="shareShow=true">店铺分享</span>
      </div>
      <div class="type-div">
        <span class="type-span " :class="[active==0?'type-active':'']" @click="changeActive(0)">商品</span>
        <span class="type-span" :class="[active==1?'type-active':'']" @click="changeActive(1)">活动</span>
      </div>
    </div>

    <div class="first_page">
      <router-link to="/"><img src="../../../static/img/first_page.png" alt=""></router-link>
    </div>


    <div class="sell-cover"  @click="shareShow=false" v-if="shareShow">
      <img src="../../../static/img/click-share.png" class="click-share" alt="">
    </div>

    <div :style="{'-webkit-overflow-scrolling': scrollMode}">
      <v-loadmore :bottom-method="loadBottom" :bottom-all-loaded="allLoaded" :distanceIndex="1" :bottomDistance="70"
                  :autoFill="false" ref="loadmore">
        <!--货架商品-->
        <ul class="goods ul" v-if="active==0&&list.length!==0">
          <li class="goods-li" v-for="(item,index) in list" @click="checkGoodDesc(item.id)">
            <img :src="item.pic" class="goods-pic" alt="" >
            <div class="goods-msg">
              <p><span class="integral">{{'积分' + item.price.integral}}</span><span
                class="goods-name">{{item.goods_name}}</span>
              </p>
              <div class="disf price-div">
                <div class="price">
                  <!-- <span class="sign">￥</span><span v-if="isVip==1">{{item.price.vip_price}}</span>
                   <span v-else>{{item.price.original_price}}</span>-->
                  <span>￥{{item.price.original_price}}</span>
                </div>
                <i class="icon iconfont icon-xiajia" @click.stop.prevent="shelvesDown(item.id,'goods',index)" v-if="!isFromShare"></i>
              </div>
            </div>

          </li>
        </ul>
        <!--货架活动-->
        <ul class="activities ul" v-if="active==1&&list.length!==0">
          <li class="activity-li" v-for="(item,index) in list">
            <router-link :to="'/main/activity_desc?id='+item.id">
              <img :src="item.cover_pic" class="activity-pic" alt="">
            </router-link>
            <div class="down-div">
              <i class="icon iconfont icon-xiajia" @click="shelvesDown(item.id,'activity',index)" v-if="!isFromShare"></i>
            </div>

          </li>

        </ul>
      </v-loadmore>
      <div v-if="list.length!==0&&allLoaded" class="texac no-more-tip">没有更多了~</div>
      <div v-else-if="list.length!==0&&!allLoaded" class="texac no-more-tip">上拉加载更多~</div>
    </div>
    <div class="no-page-list" v-if="list.length==0">
      <img src="../../../static/img/shop/no-activity.png" v-if="params.type=='activity'" alt="">
      <div class="no-page-word" v-if="params.type=='activity'">暂无活动哦~</div>
      <img src="../../../static/img/shop/no-goods.png" v-if="params.type=='goods'" alt="">
      <div class="no-page-word" v-if="params.type=='goods'">暂无商品哦~</div>
    </div>


  </div>
</template>

<script>

  import {getMy_shelves, add_shelves, getmy_shelves_infor} from '../../api/index'
  import config from '../../api/config'

  export default {
    data() {
      return {
        //  上拉加载数据
        allLoaded: false,//是否可以上拉属性，false可以上拉，true为禁止上拉，就是不让往上划加载数据了
        scrollMode: 'auto',//移动端弹性滚动效果，touch为弹性滚动，auto是非弹性滚动
        totalPage: 0,
        id: 0,
        isVip: 0,
        minHeight: '',
        active: 0,
        params: {
          invite_code: '',
          page: 1,
          number: 10,
          type: 'goods',
        },
        list: [],
        shareShow: false,
        infor: {
          head_pic: ''
        },
        goodsLen: 0,
        activityLen: 0,
        inviter: '0',
        isFirstEnter: false,
        isFromShare: false
      }
    },
    created() {
      this.isFirstEnter = true;
    },
    methods: {
      initialData() {
        this.allLoaded = false;
        this.scrollMode = 'auto';
        this.totalPage = 0;
        this.id = 0;
        this.isVip = 0;
        this.minHeight = '';
        this.active = 0;
        this.params = {
          invite_code: '',
          page: 1,
          number: 10,
          type: 'goods',
        };
        this.list = [];
        this.shareShow = false;
        this.infor = {
          head_pic: ''
        };
        this.goodsLen = 0;
        this.activityLen = 0;
        this.inviter = '0';
        this.isFirstEnter = false;
        this.isFromShare = false;
      },
      //初始时获取活动的数量
      getLen() {
        var _this = this;
        var obj = {
          invite_code: this.params.invite_code,
          page: 1,
          number: 10,
          type: 'activity',
        };
        getMy_shelves(obj).then(function (res) {
          _this.activityLen = res.data.data.count;
        }).catch(function (err) {
          console.log(err);
        })
      },
      //获取个人信息
      getInfor() {
        var _this = this;
        getmy_shelves_infor({'invite_code': this.params.invite_code}).then(function (res) {
          _this.infor = res.data.data;
          /*分享start----货架分享出去带的参数shelves_owner,是货架主人的邀请码*/
          var invite_code = 0;
          if (localStorage.getItem('invite_code')) {
            invite_code = localStorage.getItem('invite_code');  //inviter的值有两种可能，登录状态下是自己的邀请码，否则为0
          }
          var UrlAttr = (decodeURIComponent(location.href)).split('#');
          var param = '/main/my_shelves?shelves_owner=' + _this.params.invite_code + '&inviter=' + invite_code;//两个参数，店主和邀请人
          var link = config.redirect_url + "?host=" + encodeURIComponent(UrlAttr[0]) + "&param=" + encodeURIComponent(param);
          _this.wxutils.wxShare(_this.infor.nick_name, _this.infor.nick_name + '的91云店', link, _this.infor.head_pic);
          /*end*/
        }).catch(function (err) {
          console.log(err)
        })
      },
      //切换选中
      changeActive(type) {
        this.list = [];
        this.params.page = 1;
        this.allLoaded = false;
        this.totalPage = 0;
        this.scrollMode = 'auto';
        this.active = type;
        if (type == 0) {
          this.params.type = 'goods';
        } else {
          this.params.type = 'activity';
        }
        this.getMyShelves();
      },
      //获取我的货架列表
      getMyShelves() {
        var _this = this;
        this.$dialog.loading.open('');
        getMy_shelves(this.params).then(function (res) {
          if (_this.params.type == 'goods') {
            _this.goodsLen = res.data.data.count;
          } else {
            _this.activityLen = res.data.data.count;
          }
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
        getMy_shelves(this.params).then(function (res) {
          const list = res.data.data.data;
          _this.list = _this.list.concat(list);
          _this.totalPage = Math.ceil(Number(res.data.data.count) / Number(_this.params.number));
          if (_this.params.page == _this.totalPage || list.length < _this.params.number) {
            _this.allLoaded = true;
          }
          _this.$refs.loadmore.onBottomLoaded();
        });
      },
      //下架
      shelvesDown(id, type,index) {
        var _this = this;
        var obj = {
          token: localStorage.getItem('token'),
          goods_id: id,
          is_collect: 'n',
          type: type
        };
        add_shelves(obj).then(function (res) {
          console.log('res', res);
          if (res.data.errcode == 0) {
            _this.$dialog.toast({
              mes: '已下架',
              timeout: 1500
            });
            _this.list = _this.list.slice(0, index).concat(_this.list.slice(index + 1, _this.list.length));
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
      //查看商品详情
      checkGoodDesc(id) {
        //其他人打开链接后，在购买商品时必须登录，购买完可以获得邀请码，分享时带上自己的邀请码，否则就是0，货主分享时会带上自己的邀请码
        this.$router.push({
          path: '/main/goods_desc',
          query: {
            'id': id,
            'shelves_owner': this.params.invite_code,
            'inviter': this.inviter
          }
        })
      }
    },
    beforeRouteEnter(to, from, next) {
      // 路由导航钩子，此时还不能获取组件实例 `this`，所以无法在data中定义变量（利用vm除外）
      // 参考 https://router.vuejs.org/zh-cn/advanced/navigation-guards.html
      // 所以，利用路由元信息中的meta字段设置变量，方便在各个位置获取。这就是为什么在meta中定义isBack
      // 参考 https://router.vuejs.org/zh-cn/advanced/meta.html
      if (from.name == 'goods_desc') {
        to.meta.isBack = true;
        //判断是从哪个路由过来的，
        //如果是page2过来的，表明当前页面不需要刷新获取新数据，直接用之前缓存的数据即可
      }

      next();
    },
    activated() {
      if (!this.$route.meta.isBack || this.isFirstEnter) {
        this.initialData();
        this.minHeight = localStorage.getItem('minHeight');
        this.isVip = localStorage.getItem('isVip');
        //为了区分是通过别人分享打开的货架还是自己的货架，获取货架内容的时候需要根据邀请码加载内容
        if (this.$route.query.shelves_owner) {
          //他人的货架
          this.params.invite_code = this.$route.query.shelves_owner;
          this.isFromShare = true;
        } else {
          //自己的货架
          if (localStorage.getItem('invite_code')) {
            this.params.invite_code = localStorage.getItem('invite_code');
          } else {
            //查看自己货架时未登录的情况
            sessionStorage.setItem('redirect', '/main/my_shelves');
            //没登录
            this.$router.push({
              path: '/unlogin',
              query: {redirect: '/main/my_shelves'}  // 将跳转的路由path作为参数，登录成功后跳转到该路由
            })
          }
          if (this.$route.query.inviter) {
            this.inviter = this.$route.query.inviter;
          }
        }
        this.getMyShelves();
        this.getInfor();
        this.getLen();
        // 如果isBack是false，表明需要获取新数据，否则就不再请求，直接使用缓存的数据
      } else {
        this.getInfor();
      }
      // 恢复成默认的false，避免isBack一直是true，导致下次无法获取数据
      this.$route.meta.isBack = false;
      this.isFirstEnter = false;

    },
  }
</script>
<style scoped="true">
  @import "../../../static/css/shop/my_shelves.css";

  .first_page {
    position: fixed;
    left: 0.25rem;
    bottom: 1rem;
    width: 1.5rem;
    height: 1.5rem;
    z-index:100;
  }

  .first_page img {
    width: 100%;
    height: 100%;
  }
  .no-page-list{
    width:100%;
    margin-top: 25%;
    position: relative;
  }
  .no-page-list img{
    width: 90%;
    margin: auto;
  }
  .no-page-word{
    position: absolute;
    font-size:  0.30rem;
    color:#898989;
    text-align: center;
    top:50%;
    left:0;
    width: 100%;
  }
</style>
