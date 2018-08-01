<template>
  <div>
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

    <div class="box bor-top" :style="{'-webkit-overflow-scrolling': scrollMode}">
      <v-loadmore :bottom-method="loadBottom" :bottom-all-loaded="allLoaded" :distanceIndex="1" :bottomDistance="70"
                  :autoFill="false" ref="loadmore">
        <ul class="disf like-ul">
          <li class="scroll-li like-li" v-for="item in newList">
            <router-link :to="'/main/goods_desc?id='+item.id">
              <div class="like-bg-box disf">
                <img :src="item.pic" class="goods-pic" alt="">
              </div>
              <span class="integrate">{{'积分' + item.price.integral}}</span>
              <p class="grounp-name" v-if="item.goods_name.length<12">{{item.goods_name}}</p>
              <p class="grounp-name" v-else>{{item.goods_name.substr(0, 11) + '...'}}</p>
              <p class="price-p disf">
                <span class="sign">￥</span>
                <span class="price">{{item.price.original_price}}</span>
                <!--               <span class="price" v-if="isVip==0">{{item.price.original_price}}</span>
                               <span class="price" v-else>{{item.price.vip_price}}</span>-->
              </p>
            </router-link>
          </li>

        </ul>
      </v-loadmore>
      <div v-if="newList.length!==0&&allLoaded" class="texac no-more-tip">没有更多了~</div>
      <div v-else-if="newList.length!==0&&!allLoaded" class="texac no-more-tip">上拉加载更多~</div>
    </div>

    <!--商品列表-->

  </div>
</template>

<script>
  import {get_new_elect, get_top_banner} from './../../api/index'

  export default {
    data() {
      return {
        activeIndex: '0',
        bannerIndex: 0,
        //  上拉加载数据
        minHeight: 0,
        allLoaded: false,//是否可以上拉属性，false可以上拉，true为禁止上拉，就是不让往上划加载数据了
        scrollMode: 'auto',//移动端弹性滚动效果，touch为弹性滚动，auto是非弹性滚动
        totalPage: 0,
        id: 0,
        isVip: 0,
        params: {
          page: 1,
          number: 10
        },
        newList: [],
        //轮播图
        items: [],
        bannerList: [],
        clientWidth: '',
        bannerHeight: '',
        isFirstEnter: false
      }
    },
    created() {
      this.$dialog.loading.close();
      this.isFirstEnter = true;
    },
    methods: {
      initialData() {
        this.activeIndex = '0';
        this.bannerIndex = 0;
        this.minHeight = 0;
        this.allLoaded = false;
        this.scrollMode = 'auto';
        this.totalPage = 0;
        this.id = 0;
        this.isVip = 0;
        this.params = {
          page: 1,
          number: 10
        };
        this.newList = [];
        this.items = [];
        this.bannerList = [];
        this.clientWidth = '';
        this.bannerHeight = '';
        this.isFirstEnter = false;
      },
      bannerInitial(){
        var _this = this;
        var initialIndex=0;
        if(sessionStorage.getItem('swiperNew')){
          initialIndex=sessionStorage.getItem('swiperNew');
        }
        var mySwiper = new Swiper('.swiper-container', {
          initialSlide: initialIndex,
         /* observer: true,//修改swiper自己或子元素时，自动初始化swiper
          observeParents: true,//修改swiper的父元素时，自动初始化swiper*/
          autoplay: true,
          on: {
            slideChange: function () {
              //轮播图循环播放时，用realIndex获取真实索引值
              _this.bannerIndex = Number(this.realIndex);
            }
          }
        });
        mySwiper.updateSlides();
      },
      //获取轮播图
      getBanner() {
        var _this = this;
        this.$dialog.loading.open();
        _this.bannerList = [];
        _this.items = [];
        _this.bannerIndex = 0;
        get_top_banner({'type': 'new_elect'}).then(function (res) {
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

      //根据分类查找商品
      getNewList() {
        var _this = this;
        this.$dialog.loading.open('');
        get_new_elect(this.params).then(function (res) {
          var newList = res.data.data.data;
          _this.newList = newList;
          _this.totalPage = Math.ceil(Number(res.data.data.count) / Number(_this.params.number));
          if (_this.params.page == _this.totalPage || newList.length < _this.params.number) {
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
        get_new_elect(this.params).then(function (res) {
          var newList = res.data.data.data;
          _this.newList = _this.newList.concat(newList);
          _this.totalPage = Math.ceil(Number(res.data.data.count) / Number(_this.params.number));
          if (_this.params.page == _this.totalPage || newList.length < _this.params.number) {
            _this.allLoaded = true;
          }
          _this.$refs.loadmore.onBottomLoaded();
        });
      },
      bannerLink(type, id) {
        var _this = this;
        switch (type) {
          case 'goods':
            _this.$router.push('/main/goods_desc?id=' + id);
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
      this.$dialog.loading.close();
      if (!this.$route.meta.isBack || this.isFirstEnter) {
        this.initialData();
        this.clientWidth = localStorage.getItem('clientWidth');
        //轮播图高度
        this.bannerHeight = Number(this.clientWidth.split('px')[0]) / 750 * 360 + 'px';
        this.getNewList();
        this.getBanner();
      }else{
        this.$nextTick(() => {
          this.bannerInitial();// swiper重新初始化
        });
        /*this.getBanner();*/
      }
      // 恢复成默认的false，避免isBack一直是true，导致下次无法获取数据
      this.$route.meta.isBack = false;
      this.isFirstEnter = false;
    },
    beforeRouteLeave(to, from, next){
      sessionStorage.setItem('swiperNew',this.bannerIndex);
      next()
    },
  }
</script>
<style scoped="true">
  @import "../../../static/css/index/new_recommend.css";
</style>
