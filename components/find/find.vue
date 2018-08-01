<template>
  <div class="find-container" :style="'min-height: '+minHeight">
    <div :style="{'-webkit-overflow-scrolling': scrollMode}">
      <v-loadmore :bottom-method="loadBottom" :bottom-all-loaded="allLoaded" :distanceIndex="1" :bottomDistance="70"
                  :autoFill="false" ref="loadmore">
        <ul>
          <li class="row" v-for="item in list">
            <div class="disf">

              <img src="../../../static/img/find/find-logo.png" v-for="" class="find-logo" alt="">
              <div>
                <p class="top91">91TOP</p>
                <p class="time">{{item.creat_time}}</p>
              </div>
            </div>
            <router-link :to="'/main/goods_desc?id='+item.subject_id">
              <p class="title">{{item.title}}</p>
              <p class="describe">{{item.dis}}</p>
            </router-link>
            <img :src="pic" v-for="pic in item.pics" class="pic" alt="" @click="ShowBigImg(pic)">
            <router-link :to="'/main/goods_desc?id='+item.subject_id" class="link-div disf">
              <img :src="item.goods_pic" class="pic1" alt="">
              <div class="desc-text">
                <p>{{item.goods_name}}</p>
                <p class="price goods-pri">
                  <span class="sign red">￥</span>
                  <span class="goods-price">{{Number(item.price.original_price-item.price.vh_price).toFixed(2)- 0}}</span>
                  <span class="quan_add" v-if="item.price.vh_price!=0">+</span>
                  <span class="quan" v-if="item.price.vh_price!=0">券</span>
                  <span class="quan_xian"  v-if="item.price.vh_price!=0">{{item.price.vh_price}}</span>
                  <span class="quan_dele"  v-if="item.price.vh_price!=0">原价：{{item.price.original_price}}</span>
                </p>
              </div>
            </router-link>
          </li>
        </ul>
      </v-loadmore>
      <div v-if="list.length!==0&&allLoaded" class="texac no-more-tip">没有更多了~</div>
      <div v-else-if="list.length!==0&&!allLoaded" class="texac no-more-tip">上拉加载更多~</div>
    </div>

    <div class="checkCodeCover" v-show="isShowBigImg" :style="'min-height:'+minHeight" @click="isShowBigImg=false">
      <div id="pic-container">
        <img :src="bigImgPic" class="bigImg" alt="" >
      </div>

    </div>
    <footer-tab :index="2" :list="tabList"></footer-tab>

  </div>
</template>

<script>

  import FooterTab from '../common_components/footer_tab.vue'
  import config from '../../api/config'
  import {getFind_list} from '../../api/index'

  export default {
    data() {
      return {
        //  上拉加载数据
        minHeight: 0,
        allLoaded: false,//是否可以上拉属性，false可以上拉，true为禁止上拉，就是不让往上划加载数据了
        scrollMode: 'auto',//移动端弹性滚动效果，touch为弹性滚动，auto是非弹性滚动
        totalPage: 0,
        id: 0,
        list: [],
        isVip: 0,
        params: {
          page: 1,
          number: 10
        },
        isShowBigImg: false,
        bigImgPic: '',
        isFirstEnter: false,
        tabList:[]
      }
    },
    created() {
      this.isFirstEnter = true;
    },
    methods: {
      //初始化数据
      initialData(){
        this.minHeight='';
        this.allLoaded=false;
        this.scrollMode='auto';
        this.totalPage=0;
        this.id=0;
        this.list=[];
        this.isVip=0;
        this.params={
          page: 1,
          number: 10
        };
        this.isShowBigImg=false;
        this.bigImgPic='';
        this.isFirstEnter=false;
        this.tabList=[];
      },
      //底部菜单切换
      computeTab(){
  /*      if (localStorage.getItem('isVip') == 1) {
          this.tabList =config.tabbar;
        } else {
          this.tabList =config.tabbar1;
        }*/
        this.tabList =config.tabbar1;
      },

      //获取发现列表
      getFindList() {
        var _this = this;
        this.$dialog.loading.open('');
        getFind_list(this.params).then(function (res) {
          var list = res.data.data.data;
          list.forEach(function (item) {
            item.creat_time = _this.utils.timeChange(item.creat_time);
          });
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
        getFind_list(this.params).then(function (res) {
          var list = res.data.data.data;
          list.forEach(function (item) {
            item.creat_time = _this.utils.timeChange(item.creat_time);
          });
          _this.list = _this.list.concat(list);
          _this.totalPage = Math.ceil(Number(res.data.data.count) / Number(_this.params.number));
          if (_this.params.page == _this.totalPage || list.length < _this.params.number) {
            _this.allLoaded = true;
          }
          _this.$refs.loadmore.onBottomLoaded();
        });
      },
      //点击查看大图
      ShowBigImg(pic) {
        var container=document.getElementById('pic-container').offsetTop;
        this.bigImgPic = pic;
        this.isShowBigImg = true;
      }
    },
    components: {
      'footer-tab': FooterTab
    },
    beforeRouteEnter(to, from, next) {
      sessionStorage.setItem('activeIndex', 2);
      // 路由导航钩子，此时还不能获取组件实例 `this`，所以无法在data中定义变量（利用vm除外）
      // 参考 https://router.vuejs.org/zh-cn/advanced/navigation-guards.html
      // 所以，利用路由元信息中的meta字段设置变量，方便在各个位置获取。这就是为什么在meta中定义isBack
      // 参考 https://router.vuejs.org/zh-cn/advanced/meta.html
      if (from.name == 'index' || from.name == 'goods_desc' || from.name == 'classify'  || from.name == 'my'|| from.name == 'shop') {
        to.meta.isBack = true;
        //判断是从哪个路由过来的，
        //如果是page2过来的，表明当前页面不需要刷新获取新数据，直接用之前缓存的数据即可
      }
      next();
    },
    activated() {
      this.$dialog.loading.close();
      if (!this.$route.meta.isBack || this.isFirstEnter) {
        // 如果isBack是false，表明需要获取新数据，否则就不再请求，直接使用缓存的数据
        this.minHeight = localStorage.getItem('minHeight');
        this.initialData();
        this.computeTab();
        this.getFindList();
      }else{
        this.isVip = localStorage.getItem('isVip');
        this.computeTab();
      }
      // 恢复成默认的false，避免isBack一直是true，导致下次无法获取数据
      this.$route.meta.isBack = false;
      this.isFirstEnter = false;

    },
  }
</script>
<style scoped="true">
  @import "../../../static/css/find.css";

</style>
