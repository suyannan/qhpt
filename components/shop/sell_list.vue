<template>
  <div class="container my-share-container" :style="'min-height:'+minHeight">
    <div :style="{'-webkit-overflow-scrolling': scrollMode}">
      <v-loadmore :bottom-method="loadBottom" :bottom-all-loaded="allLoaded" :distanceIndex="1" :bottomDistance="70"
                  :autoFill="false" ref="loadmore">
        <ul v-if="list.length!=0">
          <li class="row disf">
            <div>
              <div class="desc"><span>{{list.name}}</span><span>{{list.dis}}</span></div>
              <div class="time">{{list.creat_time}}</div>
            </div>
            <div class="money"><span v-if="list.type=='type'">+</span><span>-</span>{{list.money}}</div>
          </li>
        </ul>
      </v-loadmore>
      <div v-if="list.length!==0&&allLoaded" class="texac no-more-tip">没有更多了~</div>
      <div v-else-if="list.length!==0&&!allLoaded" class="texac no-more-tip">上拉加载更多~</div>
    </div>
    <img src="../../../static/img/shop/noshare.png" class="noshar" alt="" v-if="list.length==0">
    <p class="texac no-tip" v-if="list.length==0">暂无销售记录</p>
  </div>
</template>

<script>
  import {get_my_trade} from '../../api/index'
  export default {
    data() {
      return {
        minHeight: '',
        list: [],
        params:{
          token:'',
          page:1,
          number:10
        },
        allLoaded: false,//是否可以上拉属性，false可以上拉，true为禁止上拉，就是不让往上划加载数据了
        scrollMode: 'auto',//移动端弹性滚动效果，touch为弹性滚动，auto是非弹性滚动
        totalPage: 0,
      }
    },
    mounted() {
      this.$dialog.loading.close();
      this.minHeight = localStorage.getItem('minHeight');
      this.params.token=localStorage.getItem('token');
      this.getList();
    },
    methods:{
      //根据分类查找商品
      getList(){
        var _this = this;
        this.$dialog.loading.open('');
        get_my_trade(this.params).then(function (res) {
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
        get_my_trade(this.params).then(function (res) {
          const list = res.data.data.data;
          _this.list = _this.list.concat(list);
          _this.totalPage = Math.ceil(Number(res.data.data.count) / Number(_this.params.number));
          if (_this.params.page == _this.totalPage || list.length < _this.params.number) {
            _this.allLoaded = true;
          }
          _this.$refs.loadmore.onBottomLoaded();
        });
      },
    }

  }
</script>
<style scoped="true">
  .row {
    padding: 0.24rem 0.29rem;
    justify-content: space-between;
    align-items: center;
  }

  .desc {
    font-size: 0.28rem;
    color: #2f2f2f;
  }

  .time {
    font-size: 0.26rem;
    color: #898989;
    margin-top: 0.19rem;
  }

  .money {
    font-size: 0.30rem;
    color: #2f2f2f;
  }

  .noshar {
    width: 78%;
    display: block;
    margin: 3.1rem auto 0 auto;
  }

  .no-tip {
    font-size: 0.32rem;
    color: #898989;
    margin-top: -0.3rem;
    z-index: 100;
  }
</style>
