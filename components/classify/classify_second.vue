<template>
  <!--二级分类-->
  <div class="box-div">
    <div id="common-scroll-nav">
      <ul class="disf common-list-ul">
        <template v-for="(item,index) in list">
          <li class="common-list common-active" id="common-active" v-if="params.class_id==item.id"
              @click="chooseActive(item)">
            {{item.name}}
          </li>
          <li class="common-list" v-else @click="chooseActive(item)">{{item.name}}</li>
        </template>
      </ul>
    </div>
    <div class="bor"></div>
    <!--商品列表-->
    <div :style="{'-webkit-overflow-scrolling': scrollMode}">
      <v-loadmore :bottom-method="loadBottom" :bottom-all-loaded="allLoaded" :distanceIndex="1" :bottomDistance="70"
                  :autoFill="false" ref="loadmore">
        <ul class="goods-list">
          <li v-for="(item,index) in goods" :id="'li'+item.id" @click="checkGoodsDesc(item.id)" class="goods-li disf">
            <div class="goods-pic">
              <img :src="item.pic" class="goods-pic-class" alt="图片加载失败">
            </div>
            <div class="goods-msg">
              <div class="goods-name goods-name1">
                <!--<span class="integrate" v-if="item.price.integral">{{'积分' + item.price.integral}}</span>
                <span class="integrate" v-else>积分0</span>-->
                <span>{{item.goods_name}}</span>
              </div>
              <p class="disf goods-pri">
                <span class="sign">￥</span>
                <span class="goods-price">{{Number(item.price.original_price-item.price.vh_price).toFixed(2)- 0}}</span>
                <span class="quan_add" v-if="item.price.vh_price!=0">+</span>
                <span class="quan" v-if="item.price.vh_price!=0">券</span>
                <span class="quan_xian"  v-if="item.price.vh_price!=0">{{item.price.vh_price}}</span>
                <span class="quan_dele"  v-if="item.price.vh_price!=0">原价：{{item.price.original_price}}</span>
              </p>
            </div>
          </li>
        </ul>
      </v-loadmore>
      <div v-if="goods.length!==0&&allLoaded" class="texac no-more-tip">没有更多了~</div>
      <div v-else-if="goods.length!==0&&!allLoaded" class="texac no-more-tip">上拉加载更多~</div>
    </div>

    <div class="first_page"><router-link to="/"><img src="../../../static/img/first_page.png" alt=""></router-link></div>
  </div>
</template>
<script>
  import {getgoods_classify, getgoods_byclass} from '../../api/index'

  export default {
    data() {
      return {
        //  上拉加载数据
        allLoaded: false,//是否可以上拉属性，false可以上拉，true为禁止上拉，就是不让往上划加载数据了
        scrollMode: 'auto',//移动端弹性滚动效果，touch为弹性滚动，auto是非弹性滚动
        totalPage: 0,
        goods: [],
        //classId: 0,s
        params: {
          class_id: 0,
          page: 1,
          number: 15
        },
        isVip: 0,
        //类别
        list: [],
        //商品列表
        isFirstEnter: false
      }
    },
    created() {
      this.$dialog.loading.close();
      this.isFirstEnter = true;
      //获取上一页面选中的类型、索引
    },
    methods: {
      //初始化数据
      initialData() {
        this.allLoaded = false;
        this.scrollMode = 'auto';
        this.totalPage = 0;
        this.goods = [];
        this.params = {
          class_id: 0,
          page: 1,
          number: 15
        };
        this.isVip = 0;
        this.list = [];
        this.isFirstEnter = false;
      },
      //获取分类
      getClassify() {
        this.$dialog.loading.open();
        var _this = this;
        getgoods_classify().then(function (res) {
          //console.log(res.data.data);
          _this.list = res.data.data;
          //获取选中的当前的位置，控制滑块滑动到当前选中
          setTimeout(function () {
            var active = document.getElementById('common-active').offsetLeft - 15;
            //console.log(active);
            document.getElementById('common-scroll-nav').scrollLeft = active;
            _this.$dialog.loading.close();
          }, 100);

        }).catch(function (err) {
          console.log(err)
        })
      },
      //切换选中
      chooseActive(item) {
        this.params.page = 1;
        this.params.class_id = item.id;
        this.allLoaded = false;
        this.totalPage = 0;
        this.scrollMode = 'auto';
        this.goods = [];
        this.getGoodsByClass();
      },
      //根据分类查找商品
      getGoodsByClass() {
        var _this = this;
        this.$dialog.loading.open('');
        getgoods_byclass(this.params).then(function (res) {
          var goods = res.data.data.data;
          _this.goods = goods;
          _this.totalPage = Math.ceil(Number(res.data.data.count) / Number(_this.params.number));
          if (_this.params.page == _this.totalPage || goods.length < _this.params.number) {
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
        getgoods_byclass(this.params).then(function (res) {
          const goods = res.data.data.data;
          _this.goods = _this.goods.concat(goods);
          _this.totalPage = Math.ceil(Number(res.data.data.count) / Number(_this.params.number));
          if (_this.params.page == _this.totalPage || goods.length < _this.params.number) {
            _this.allLoaded = true;
          }
          _this.$refs.loadmore.onBottomLoaded();
        });
      },
      checkGoodsDesc(id) {
        this.$router.push({
          path: '/main/goods_desc',
          query: {
            'id': id
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
      this.$dialog.loading.close();
      if (!this.$route.meta.isBack || this.isFirstEnter) {
        // 如果isBack是false，表明需要获取新数据，否则就不再请求，直接使用缓存的数据
        this.initialData();
        this.params.class_id = this.$route.query.id;
        this.getGoodsByClass();
        this.getClassify();
      }
      // 恢复成默认的false，避免isBack一直是true，导致下次无法获取数据
      this.$route.meta.isBack = false;
      this.isFirstEnter = false;

    },

  }
</script>
<style scoped="true">
  @import "../../../static/css/classify/classify_second.css";

</style>
