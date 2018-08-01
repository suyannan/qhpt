<template>
  <div class="box-div" :style="'min-height:'+minHeight">
    <!--分类-->
    <div id="common-scroll-nav">
      <ul class="disf common-list-ul">
        <li class="common-list common-active" v-if="choosed=='全部'" @click="chooseActive('全部',0)">全部</li>
        <li class="common-list" v-else @click="chooseActive('全部',0)">全部</li>
        <template v-for="(item,index) in tagLists">
          <li class="common-list common-active" v-if="choosed==item.name" @click="chooseActive(item.name,item.id)">
            {{item.name}}
          </li>
          <li class="common-list" v-else @click="chooseActive(item.name,item.id)">{{item.name}}</li>
        </template>
      </ul>
    </div>


    <!--商品列表-->
    <div :style="{'-webkit-overflow-scrolling': scrollMode}">
      <v-loadmore :bottom-method="loadBottom" :bottom-all-loaded="allLoaded" :distanceIndex="1" :bottomDistance="70"
                  :autoFill="false" ref="loadmore">
        <ul class="material-list" v-if="materialList.length>0">
          <li class="material-li" v-for="item in materialList">
            <router-link :to="'/main/material_desc?id='+item.id">
              <img :src="item.pic" class="material-pic" alt="图片加载失败">
              <p class="title">{{item.title}}</p>
              <p class="disf msg"><span class="tag_name">{{'#' + item.tag_name}}</span><span
                class="create_time">{{item.creat_time}}</span></p>
            </router-link>
          </li>
        </ul>
        <div class="material-list material-list1" :style="'min-height: '+minHeight" v-if="materialList.length==0">
          <p class="texac nomore">没有更多了~~</p>
        </div>
      </v-loadmore>
      <div v-if="materialList.length!==0&&allLoaded" class="texac no-more-tip">没有更多了~</div>
      <div v-else-if="materialList.length!==0&&!allLoaded" class="texac no-more-tip">上拉加载更多~</div>
    </div>


  </div>
</template>

<script>
  import {get_material_tags, getmaterial_bytags} from '../../api/index'

  export default {
    data() {
      return {
        //  上拉加载数据
        allLoaded: false,//是否可以上拉属性，false可以上拉，true为禁止上拉，就是不让往上划加载数据了
        scrollMode: 'auto',//移动端弹性滚动效果，touch为弹性滚动，auto是非弹性滚动
        minHeight: 0,
        totalPage: 0,
        materialList: [],
        params: {
          tag_id: 0,
          page: 1,
          number: 10
        },
        isVip: 0,
        //  上拉加载数据
        choosed: '全部',
        tagLists: [],
        isFirstEnter: false
      }
    },
    created() {
      this.isFirstEnter = true;
      this.$dialog.loading.close();
    },
    methods: {
      initialData() {
        this.allLoaded = false;
        this.scrollMode = 'auto';
        this.minHeight = 0;
        this.totalPage = 0;
        this.materialList = [];
        this.params = {
          tag_id: 0,
          page: 1,
          number: 10
        };
        this.isVip = 0;
        this.choosed = '全部';
        this.tagLists = [];
        this.isFirstEnter = false;
      },
      //业务培训，获取课件分类
      getTags() {
        var _this = this;
        _this.$dialog.loading.open();
        get_material_tags().then(function (res) {
          _this.tagLists = res.data.data;
          _this.$dialog.loading.close();
        }).catch(function (err) {
          console.log(err);
        })
      },
      //切换选中类别
      chooseActive(name, id) {
        this.choosed = name;
        this.params.tag_id = id;
        this.params.page = 1;
        this.allLoaded = false;
        this.totalPage = 0;
        this.materialList = [];
        this.scrollMode = 'auto';
        this.getMaterialByTags();
      },
      loadBottom() {
        var _this = this;
        _this.params.page++;
        getmaterial_bytags(this.params).then(function (res) {
          var data = res.data.data.data;
          data.forEach(function (item) {
            item.creat_time = _this.utils.timeChange(item.creat_time);
          });
          _this.materialList = _this.materialList.concat(data);
          _this.totalPage = Math.ceil(Number(res.data.data.count) / Number(_this.params.number));
          if (_this.params.page == _this.totalPage || data.length < _this.params.number) {
            _this.allLoaded = true;
          }
          _this.$refs.loadmore.onBottomLoaded();
        });
      },
      //根据分类获取课件
      getMaterialByTags() {
        var _this = this;
        _this.$dialog.loading.open();
        getmaterial_bytags(this.params).then(function (res) {
          var data = res.data.data.data;
          data.forEach(function (item) {
            item.creat_time = _this.utils.timeChange(item.creat_time);
          });
          _this.materialList = data;
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
      }
    },
    beforeRouteEnter(to, from, next) {
      // 路由导航钩子，此时还不能获取组件实例 `this`，所以无法在data中定义变量（利用vm除外）
      // 参考 https://router.vuejs.org/zh-cn/advanced/navigation-guards.html
      // 所以，利用路由元信息中的meta字段设置变量，方便在各个位置获取。这就是为什么在meta中定义isBack
      // 参考 https://router.vuejs.org/zh-cn/advanced/meta.html
      if (from.name == 'material_desc') {
        to.meta.isBack = true;
        //判断是从哪个路由过来的，
        //如果是page2过来的，表明当前页面不需要刷新获取新数据，直接用之前缓存的数据即可
      }

      next();
    },
    activated() {
      if (!this.$route.meta.isBack || this.isFirstEnter) {
        this.initialData();
        // 如果isBack是false，表明需要获取新数据，否则就不再请求，直接使用缓存的数据
        this.minHeight = localStorage.getItem('minHeight');
        this.getTags();
        this.getMaterialByTags();
      }
      // 恢复成默认的false，避免isBack一直是true，导致下次无法获取数据
      this.$route.meta.isBack = false;
      this.isFirstEnter = false;

    },
  }
</script>
<style scoped="true">
  @import "../../../static/css/shop/business_training.css";
</style>
