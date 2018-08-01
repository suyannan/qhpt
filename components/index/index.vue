<template>
  <div class="container index-container" :style="'min-height: '+minHeight">
    <footer-tab :list="tabList" :index="0"></footer-tab>
    <img src="../../../static/img/connect/kf-icon.png" class="kf-icon" alt="" @click="toConnect">
    <!--搜索-->
    <div class="search-top disf">
      <i class="icon iconfont icon-logo"></i>
      <div class="search-box disf">
        <i class="icon iconfont icon-sousuo"></i>
        <input type="text" @click="toSearch" class="text-input" placeholder="请输入要搜索的商品" name="new" readonly>
      </div>
      <router-link to="/main/shoppingcart"><i class="icon iconfont  icon-gouwuche"></i></router-link>
      <router-link class="xiaoxi-box" to="/main/news">
        <i class="icon iconfont icon-xiaoxi"></i>
        <span class="bage" v-if="newsCount!=0">{{newsCount}}</span>
      </router-link>
    </div>
    <!--滚动导航-->
    <div id="common-scroll-nav">
      <ul class="disf common-list-ul">
        <li class="common-list" :class="{'common-active':activeIndex==0}" @click="changeActive(0,'link','/')">
          精选
        </li>
        <li class="common-list" :class="{'common-active':activeIndex==1}"
            @click="changeActive(1,'link','/main/new_recommend')">
          新品推荐
        </li>
        <template v-for="(item,index) in homeClassifyList">
          <li class="common-list common-active" v-if="index+2==activeIndex"
              @click="changeActive(index+2,'classfiy',item.id)">
            {{item.name}}
          </li>
          <li class="common-list" v-else @click="changeActive(index+2,'classfiy',item.id)">{{item.name}}</li>
        </template>
      </ul>
    </div>
    <div class="co-box" id="discover">
      <!--轮播图-->
      <div class="swiper-container">
        <div class="swiper-wrapper">
          <template v-for="item in items">
            <div class="swiper-slide">
              <img class="banner-pic" :src="item.pic " alt="" @click="bannerLink(item.infor_type , item.subject_id)"
                   :style="'width:'+clientWidth+';height:'+bannerHeight">
            </div>
          </template>
        </div>
        <ul class="pagination-ul">
          <template v-for="n in bannerList.length">
            <li class="pagination activePagination" v-if="bannerIndex==n-1"></li>
            <li class="pagination" v-else></li>
          </template>
        </ul>
      </div>

      <!--团购抢购目前先不展示出来-->
      <!--&lt;!&ndash;限时购&ndash;&gt;-->
      <div class="scroll-box timing-box bor-top">
        <p class="ti texac"><i class="icon iconfont icon-qianggou"></i><span>限时购</span></p>
        <ul class="scroll-ul timing-ul disf timing-scroll-ul">
          <li class="scroll-li timing-li" v-for="item in scareGoodsList"
              @click="checkGoodDesc('scare',item.activeinfo.group_id)">
            <div class="timing-bg-box disf">
              <img :src="item.pic" class="timing-pic" alt="">
            </div>
            <!--<span class="integrate">{{'积分' + item.price.integral}}</span>-->
            <div class="grounp-name timing-name">{{item.goods_name}}</div>
            <div class="left-p disf">
              <div class="disf price-p">
                <span class="sign">￥</span><span class="price">{{Number(item.price.promotion_price-item.price.vh_price).toFixed(2)- 0}}</span>
                <span class="quan_add" v-if="item.price.vh_price!=0">+</span>
                <span class="quan" v-if="item.price.vh_price!=0">券</span>
                <span class="quan_xian" v-if="item.price.vh_price!=0">{{item.price.vh_price}}</span>
                <span class="sign2" v-if="item.price.vh_price!=0" style="margin-left: 0.2rem;font-size: 0.24rem;">原价：￥</span><span v-if="item.price.vh_price!=0" class="or-price" style="font-size: 0.24rem;">{{item.price.promotion_price}}</span>
              </div>
            </div>
            <p class="grounped">
              <span>库存</span><span>{{Number(item.activeinfo.now_quantity)}}</span>
            </p>
          </li>

        </ul>
      </div>

      <!--&lt;!&ndash;拼团&ndash;&gt;
      <div class="scroll-box pin-box bor-top">
        <p class="ti texac">拼团</p>
        <p class="tip texac">省着购 不如拼团购</p>
        <ul class="scroll-ul grounp-ul grounp-ul1">
          <li class="scroll-li grounp-li" v-for="item in groupGoodsList"
              @click="checkGoodDesc('group',item.activeinfo.group_id)">
            <div class="grounp-bg-box disf">
              <img :src="item.pic" class="grounp-pic" alt="">
            </div>
            <span class="integrate">{{'积分' + item.price.integral}}</span>
            <p class="grounp-name">{{item.goods_name}}</p>
            <p class="price-p disf">
              <span class="sign">￥</span><span class="price">{{item.price.promotion_price}}</span>
            </p>
            <p class="grounped"><span>已拼</span>{{item.activeinfo.now_quantity}}</p>
          </li>
        </ul>
      </div>-->

      <!--新品推荐-->
      <div class="box bor-top texac">
        <router-link to="/main/new_recommend" class="ti disb texac"><span>新品推荐</span><i
          class="icon iconfont icon-xinpintuijian"></i></router-link>
        <ul class="disf new-ul new-ul1">
          <li class="scroll-li new-li new-li1" v-for="item in newList" @click="checkGoodDesc('normal',item.id)">
            <div class="new-bg-box disf">
              <img :src="item.pic" class="new-pic" alt="">
            </div>
            <!--<p><span class="integrate">{{'积分' + item.price.integral}}</span></p>-->
            <p class="grounp-name">{{item.goods_name}}</p>
            <p class="price-p disf">
              <span class="sign">￥</span>
              <span class="price">{{Number(item.price.original_price-item.price.vh_price).toFixed(2)- 0}}</span>
              <span class="quan_add" v-if="item.price.vh_price!=0">+</span>
              <span class="quan" v-if="item.price.vh_price!=0">券</span>
              <span class="quan_xian" v-if="item.price.vh_price!=0">{{item.price.vh_price}}</span>
            </p>
            <p class="quan_ls">原价：<span class="quan_dele">{{item.price.original_price}}</span></p>
          </li>
        </ul>
      </div>
      <!--猜你喜欢-->
      <div class="box bor-top">
        <p class="ti texac"><i class="icon iconfont icon-xihuan"></i><span>猜你喜欢</span></p>
        <ul class="disf like-ul">
          <li class="scroll-li like-li" v-for="(item,index) in loveGoods" @click="checkGoodDesc('normal',item.id)">
            <div class="like-bg-box disf">
              <img :src="item.pic" class="like-goods-pic" alt="">
            </div>
            <!--<span class="integrate">{{'积分' + item.price.integral}}</span>-->
            <p class="grounp-name">{{item.goods_name}}</p>
            <p class="price-p disf">
              <span class="sign">￥</span><span class="price">{{Number(item.price.original_price-item.price.vh_price).toFixed(2)- 0}}</span>
              <span class="quan_add" v-if="item.price.vh_price!=0">+</span>
              <span class="quan" v-if="item.price.vh_price!=0">券</span>
              <span class="quan_xian" v-if="item.price.vh_price!=0">{{item.price.vh_price}}</span>
            </p>
            <p class="quan_ls">原价：<span class="quan_dele">{{item.price.original_price}}</span></p>
          </li>
        </ul>
      </div>
      <!--首页商品分类-->
      <template v-for="(item,i) in homeClassifyList">
        <!--全球尖货-->
        <div class="classify-container bor-top">
          <router-link :to="'/main/classifysecond?id='+item.id+'&class_id=0'">
            <p class="classify-ti">{{item.name}}</p>
            <div class="classify-bg-pic" :style="'width:'+clientWidth+';height:'+classifyPicHeight">
              <img :src="item.pic" class="classify-pic" alt="">
            </div>
          </router-link>

          <div class="classify-box">
            <ul class="disf new-ul classify-ul">
              <li class="scroll-li new-li classify-li" v-for="(good,index) in item.goods" v-if="index<3"
                  @click="checkGoodDesc('normal',good.id)">
                <div class="classify-bg-box disf" :style="'background:'+bgcolor[i]+';'">
                  <img :src="good.pic" class="classify-goods-pic" alt="">
                </div>
                <!--<span class="integrate">{{'积分' + good.price.integral}}</span>-->
                <p class="grounp-name">{{good.goods_name}}</p>
                <p class="price-p disf">
                  <span class="sign">￥</span>
                  <span class="price">{{Number(good.price.original_price-good.price.vh_price).toFixed(2)- 0}}</span>
                  <span class="quan_add" v-if="good.price.vh_price!=0">+</span>
                  <span class="quan" v-if="good.price.vh_price!=0">券</span>
                  <span class="quan_xian" v-if="good.price.vh_price!=0">{{good.price.vh_price}}</span>
                </p>
                <p class="quan_ls">原价：<span class="quan_dele">{{good.price.original_price}}</span></p>
              </li>
            </ul>
          </div>

        </div>
      </template>
    </div>
  </div>

</template>

<script>
  import {
    getgoods_classify,
    get_scaregoods,
    get_groupgoods,
    get_home_classfiy,
    get_new_elect,
    get_top_banner,
    get_love_goods,
    get_messad_count
  } from './../../api/index'
  import FooterTab from '../common_components/footer_tab.vue'
  import config from '../../api/config'

  export default {
    data() {
      return {
        orderData: '',
        tabList:[],
        items: [],
        minHeight: '',
        activeIndex: '0',
        bannerList: [],
        bannerIndex: 0,
        scareGoodsList: [],
        groupGoodsList: [],
        homeClassifyList: [],
        newList: [],
        isVip: 0,
        clientWidth: '',
        bannerHeight: '',
        classifyPicHeight: '',
        loveGoods: [],
        isFirstEnter: false,
        bgcolor: ['rgba(253,224,255,0.2)', 'rgba(254,231,164,0.3)', 'rgba(189,236,255,0.2)', 'rgba(220,229,244,0.2)', 'rgba(180,231,248,0.2)', 'rgba(239,216,200,0.2)', 'rgba(255,216,209,0.2)',],
        newsCount: 0,
      }
    },
    created() {
      this.isFirstEnter = true;
      //var str='{"nickname":"Hello","sex":2,"city":"\u671d\u9633","province":"\u5317\u4eac","country":"\u4e2d\u56fd","headimgurl":"http:\\/\\/thirdwx.qlogo.cn\\/mmopen\\/vi_32\\/DYAIOgq83erOhAwTvCZvCiam6zQ6V75aTiahuT6wEZLj0Nx2Ul4EmE4peicc1lo3L6Vgv8QbZXJJ6sWxJhuskl3jA\\/132","token":"ce27640a2a729658c9053f6a2e7feaff"}';
      //localStorage.setItem('userInfor',str);
    },
    methods: {
      //初始化数据
      initialData(){
        this.tabList=[];
        this.items=[];
        this.minHeight='';
        this.activeIndex='0';
        this.bannerList=[];
        this.bannerIndex=0;
        this.scareGoodsList=[];
        this.groupGoodsList=[];
        this.homeClassifyList=[];
        this.newList=[];
        this.isVip='';
        this.clientWidth='';
        this.bannerHeight='';
        this.classifyPicHeight='';
        this.isFirstEnter=false;
        this.loveGoods=[];
        this.bgcolor=['rgba(253,224,255,0.2)', 'rgba(254,231,164,0.3)', 'rgba(189,236,255,0.2)', 'rgba(220,229,244,0.2)', 'rgba(180,231,248,0.2)', 'rgba(239,216,200,0.2)', 'rgba(255,216,209,0.2)',];
        this.newsCount=0;
      },
      //底部菜单切换
      computeTab(){
    /*    if (localStorage.getItem('isVip') == 1) {
          this.tabList =config.tabbar;
        } else {
          this.tabList =config.tabbar1;
        }*/
        this.tabList =config.tabbar1;
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
      //查看商品详情
      checkGoodDesc(type, id) {
        var inviter = '0';
        if (localStorage.getItem('invite_code')) {
          inviter = localStorage.getItem('invite_code');
        }
        if (type == 'normal') {
          this.$router.push({
            path: '/main/goods_desc',
            query: {
              'id': id
            }
          })
        } else if (type == 'group') {
          this.$router.push({
            path: '/main/grounp_desc',
            query: {
              'id': id,
              'groupInviter': inviter,
              'inviter': inviter
            }
          })
        } else if (type == 'scare') {
          this.$router.push({
            path: '/main/timing_desc',
            query: {
              'id': id,
              'scareInviter': inviter,
              'inviter': inviter
            }
          })
        }

      },
      //联系客服
      toConnect() {
        this.$router.push('/main/connect')
      },
      //搜索
      toSearch() {
        this.$router.push('/main/search?back=/')
      },
      bannerInitial(){
        var _this = this;
        var initialIndex=0;
        if(sessionStorage.getItem('swiperIndex')){
          initialIndex=sessionStorage.getItem('swiperIndex');
        }
        var mySwiper = new Swiper('.swiper-container', {
          initialSlide: initialIndex,
          /*observer: true,//修改swiper自己或子元素时，自动初始化swiper
          observeParents: true,//修改swiper的父元素时，自动初始化swiper*/
          autoplay: true,
          on: {
            slideChange: function () {
              _this.bannerIndex = Number(this.realIndex);
            }
          }
        });
        mySwiper.updateSlides();
      },
      //获取轮播图
      getBanner() {
        var _this = this;
        _this.bannerList=[];
        _this.bannerIndex=0;
      /*  var mySwiper = new Swiper('.swiper-container');
        mySwiper.destroy(false);*/
        this.$dialog.loading.open('正在加载');
        get_top_banner({'type': 'home'}).then(function (res) {
          _this.bannerList = res.data.data;
          _this.items = res.data.data;
          _this.$nextTick(() => {
            _this.bannerInitial();// swiper重新初始化
          });
          //轮播图配置end
          _this.$dialog.loading.close();
        }).catch(function (err) {
          console.log(err);
          _this.$dialog.loading.close();

        })
      },
      //切换滚动导航
      changeActive(index, type, params) {
        var _this = this;
        this.activeIndex = index;
        this.$dialog.loading.open('正在加载');
        if (type == 'link') {
          setTimeout(function () {
            _this.$dialog.loading.close();
            _this.$router.push(params);
          }, 100)
        } else {
          setTimeout(function () {
            _this.$dialog.loading.close();
            _this.$router.push('/main/classifysecond?id=' + params + '&class_id=0');
          }, 100)
        }
      },
      //获取抢购商品
      getScareGoods() {
        var _this = this;
        this.$dialog.loading.open('正在加载');
        get_scaregoods().then(function (res) {
          var data = res.data.data;
          var now = new Date();
          data.forEach(function (item) {
            var start_time = item.activeinfo.start_time;
            var end_time = item.activeinfo.end_time;
            var total_quantity = item.activeinfo.total_quantity;
            var now_quantity = item.activeinfo.now_quantity;
            if (Number(now_quantity) > 0) {
              item.notify = '去抢购';//在抢购时段内，且数量充足
            } else {
              item.notify = '已售罄';//在抢购时段内，但数量不足
            }
          });
          _this.scareGoodsList = data;
          _this.$dialog.loading.close();
        }).catch(function (err) {
          console.log(err);
          _this.$dialog.loading.close();
        })
      },
      //获取团购商品
      getGroupGoods() {
        var _this = this;
        this.$dialog.loading.open('正在加载中');
        get_groupgoods().then(function (res) {
          var data = res.data.data;
          _this.groupGoodsList = data;
          _this.$dialog.loading.close();
        }).catch(function (err) {
          console.log(err);
          _this.$dialog.loading.close();
        })
      },
      //比较时间大小
      compareTime(date1, date2) {
        var oDate1 = new Date(date1);
        var oDate2 = new Date(date2);
        if (oDate1.getTime() > oDate2.getTime()) {
          //第一个大
          return true;
        } else {
          //第二个大
          return false;
        }
      },
      //首页商品分类
      getHomeClassify() {
        var _this = this;
        this.$dialog.loading.open('正在加载');
        get_home_classfiy().then(function (res) {
          _this.homeClassifyList = res.data.data;
          _this.$dialog.loading.close();
        }).catch(function (err) {
          console.log(err);
          _this.$dialog.loading.close();

        })
      },
      //新品推荐
      getNewList() {
        var _this = this;
        this.$dialog.loading.open('正在加载');
        get_new_elect({'page': 1, 'number': 3}).then(function (res) {
          _this.newList = res.data.data.data;
          _this.$dialog.loading.close();
        }).catch(function (err) {
          console.log(err);
          _this.$dialog.loading.close();
        })
      },
      //轮播图跳转
      bannerLink(type, id) {

        var _this = this;
        switch (type) {
          case 'goods':
            _this.$router.push({
              path: '/main/goods_desc',
              query: {
                'id': id
              }
            });
            break;
          case 'activity':
            _this.$router.push('/main/activity_desc?id=' + id);
            break;
          case 'article':
            _this.$router.push('/main/material_desc?id=' + id);
            break;
          case 'web':
            _this.$router.push('/main/web_desc?id=' + id);
            break;
        }
      },
      //猜你喜欢
      getLoveGoods() {
        var token;
        if (localStorage.getItem('token')) {
          token = localStorage.getItem('token');
        } else {
          token = '';
        }
        var _this = this;
        get_love_goods({'token': token}).then(function (res) {
          _this.loveGoods = res.data.data;
        }).catch(function (err) {
          console.log(err);
        })
      }


    },
    beforeRouteEnter(to, from, next) {
      sessionStorage.setItem('activeIndex', 0);
      // 路由导航钩子，此时还不能获取组件实例 `this`，所以无法在data中定义变量（利用vm除外）
      // 参考 https://router.vuejs.org/zh-cn/advanced/navigation-guards.html
      // 所以，利用路由元信息中的meta字段设置变量，方便在各个位置获取。这就是为什么在meta中定义isBack
      // 参考 https://router.vuejs.org/zh-cn/advanced/meta.html
      if (from.name == 'goods_desc' || from.name == 'timing_desc' || from.name == 'grounp_desc' || from.name == 'classifysecond') {
        to.meta.isBack = true;
        //判断是从哪个路由过来的，
        //如果是page2过来的，表明当前页面不需要刷新获取新数据，直接用之前缓存的数据即可
      }
      next();
    },
    activated() {
      this.$dialog.loading.close();
      if (!this.$route.meta.isBack || this.isFirstEnter) {
        console.log('noback');
        this.initialData();
        this.minHeight = localStorage.getItem('minHeight');
        this.clientWidth = localStorage.getItem('clientWidth');
        //轮播图高度
        this.bannerHeight = Number(this.clientWidth.split('px')[0]) / 750 * 360 + 'px';
        this.classifyPicHeight = Number(this.clientWidth.split('px')[0]) / 750 * 260 + 'px';
        if (localStorage.getItem('isVip')) {
          this.isVip = localStorage.getItem('isVip');
        }
        this.getBanner();
        this.isHasNews();
        this.computeTab();
        this.getHomeClassify();
        this.getScareGoods();
        this.getGroupGoods();
        this.getNewList();
        this.getLoveGoods();
      }else{
        this.activeIndex = 0;
        this.isVip = localStorage.getItem('isVip');
        /*this.getBanner();*/
        this.$nextTick(() => {
          this.bannerInitial();// swiper重新初始化
        });
        this.isHasNews();
        this.computeTab();
      }
      // 恢复成默认的false，避免isBack一直是true，导致下次无法获取数据
      this.$route.meta.isBack = false;
      this.isFirstEnter = false;
    },
    beforeRouteLeave(to, from, next){
      sessionStorage.setItem('swiperIndex',this.bannerIndex);
      next()
    },

    components: {
      'footer-tab': FooterTab
    }

  }
</script>
<style scoped="true">
  @import "../../../static/css/index/index.css";

  .timing-pic {
    -webkit-border-radius: 4px;
    -moz-border-radius: 4px;
    border-radius: 4px;
  }
</style>
