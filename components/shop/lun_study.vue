<template>
  <div class="lun-study-container" :style="'min-height:'+minHeight">
    <div :style="{'-webkit-overflow-scrolling': scrollMode}">
      <v-loadmore :bottom-method="loadBottom" :bottom-all-loaded="allLoaded" :distanceIndex="1" :bottomDistance="70"
                  :autoFill="false" ref="loadmore">
        <ul class="list-ul" v-if="studyList.length!==0">
          <li class="list-li" v-for="(item,index) in studyList">
            <router-link :to="'/main/lun_desc?id='+item.id">
              <p class="row disf nick-p"><span>{{item.author}}</span><span class="time">{{item.creat_time}}</span></p>
              <p class="row tag-p"><span class="tag">{{item.tag_name}}</span></p>
              <p class="row title">{{item.title}}</p>
              <p class="content" v-if="item.dis.length>43">{{item.dis.substr(0, 41) + '...'}}</p>
              <p class="content" v-else>{{item.dis}}</p>
            </router-link>
          </li>
        </ul>
        <p class="texac nomore" v-if="studyList.length==0">没有更多数据~~</p>
      </v-loadmore>
      <div v-if="studyList.length!==0&&allLoaded" class="texac no-more-tip">没有更多了~</div>
      <div v-else-if="studyList.length!==0&&!allLoaded" class="texac no-more-tip">上拉加载更多~</div>
    </div>

  </div>
</template>

<script>
  import {getStudy_article_list} from '../../api/index'

  export default {
    data() {
      return {
        //  上拉加载数据
        minHeight: '',
        allLoaded: false,//是否可以上拉属性，false可以上拉，true为禁止上拉，就是不让往上划加载数据了
        scrollMode: 'auto',//移动端弹性滚动效果，touch为弹性滚动，auto是非弹性滚动
        totalPage: 0,
        /*more*/
        studyList: [],
        params: {
          page: 1,
          number: 10
        },
        isFirstEnter: false
      }
    },
    created() {
      this.$dialog.loading.close();
      this.isFirstEnter = true;
    },
    methods: {
      initialData(){
        this.minHeight='';
        this.allLoaded=false;
        this.scrollMode='auto';
        this.totalPage=0;
        this.studyList=[];
        this.params={
          page: 1,
          number: 10
        };
        this.isFirstEnter=false;
      },
      //课件列表
      getStudyList() {
        var _this = this;
        this.$dialog.loading.open('');
        getStudy_article_list(this.params).then(function (res) {
          var data = res.data.data.data;
          data.forEach(function (item) {
            item.creat_time = _this.utils.timeChange(item.creat_time);
          });
          //console.log(data);
          _this.studyList = data;
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
        getStudy_article_list(this.params).then(function (res) {
          var data = res.data.data.data;
          data.forEach(function (item) {
            item.creat_time = _this.utils.timeChange(item.creat_time);
          });
          _this.studyList = _this.studyList.concat(data);
          _this.totalPage = Math.ceil(Number(res.data.data.count) / Number(_this.params.number));
          if (_this.params.page == _this.totalPage || data.length < _this.params.number) {
            _this.allLoaded = true;
          }
          _this.$refs.loadmore.onBottomLoaded();
        });
      }
    },
    beforeRouteEnter(to, from, next) {
      // 路由导航钩子，此时还不能获取组件实例 `this`，所以无法在data中定义变量（利用vm除外）
      // 参考 https://router.vuejs.org/zh-cn/advanced/navigation-guards.html
      // 所以，利用路由元信息中的meta字段设置变量，方便在各个位置获取。这就是为什么在meta中定义isBack
      // 参考 https://router.vuejs.org/zh-cn/advanced/meta.html
      if (from.name == 'lun_desc') {
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
        this.minHeight = localStorage.getItem('minHeight');
        this.getStudyList();
      }
      // 恢复成默认的false，避免isBack一直是true，导致下次无法获取数据
      this.$route.meta.isBack = false;
      this.isFirstEnter = false;

    },
  }
</script>
<style scoped="true">
  @import "../../../static/css/shop/lun_study.css";
</style>
