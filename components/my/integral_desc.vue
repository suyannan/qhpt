<template>
  <div class="desc-container" :style="'min-height:'+minHeight">


    <div :style="{'-webkit-overflow-scrolling': scrollMode}">
      <v-loadmore :bottom-method="loadBottom" :bottom-all-loaded="allLoaded" :distanceIndex="1" :bottomDistance="70"
                  :autoFill="false" ref="loadmore">
        <ul>
          <li class="li" v-for="item in list">
            <div class="disf desc-p">
              <span class="desc-title">{{item.dis}}</span>
              <p class="time">{{item.creat_time}}</p>
            </div>
            <div style="overflow: hidden;margin-top: 0.1rem;">
              <span style="float: left;margin-top: 0.05rem;font-size: 0.23rem;">总积分：{{item.total_score}}</span>
              <div style="float: right;">
                <span class="integral-num1" v-if="item.type=='plus'">+</span>
                <span class="integral-num1" style="color: #333;" v-else>-</span>
                <span class="integral-num1" v-if="item.type=='plus'">{{item.score}}</span>
                <span class="integral-num1" v-else style="color: #333;">{{item.score}}</span>
              </div>
            </div>
          </li>
        </ul>
      </v-loadmore>
      <div v-if="list.length!==0&&allLoaded" class="texac no-more-tip">没有更多了~</div>
      <div v-else-if="list.length!==0&&!allLoaded" class="texac no-more-tip">上拉加载更多~</div>
    </div>


  </div>
</template>

<script>


  import {getPersonScoreList} from '../../api/index'

  export default {
    data() {
      return {
        minHeight: '',
        list: [],
        params: {
          token: localStorage.getItem('token'),
          page: 1,
          number: 15,
        },
        //  上拉加载数据
        allLoaded: false,//是否可以上拉属性，false可以上拉，true为禁止上拉，就是不让往上划加载数据了
        scrollMode: 'auto',//移动端弹性滚动效果，touch为弹性滚动，auto是非弹性滚动
        totalPage: 0,
        isVip: 0,
        //classId: 0,
      }
    },
    created() {
      this.$dialog.loading.close();
      this.minHeight = localStorage.getItem('minHeight');
      this.getInteralList();
    },

    methods: {

      //获取积分列表
      getInteralList() {
        var _this = this;
        this.$dialog.loading.open('');
        getPersonScoreList(this.params).then(function (res) {
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
        getPersonScoreList(this.params).then(function (res) {
          var list = res.data.data.data;
          _this.list = _this.list.concat(list);
          _this.totalPage = Math.ceil(Number(res.data.data.count) / Number(_this.params.number));
          if (_this.params.page == _this.totalPage || list.length < _this.params.number) {
            _this.allLoaded = true;
          }
          _this.$refs.loadmore.onBottomLoaded();
        });
      }
    }
  }
</script>
<style scoped="true">
  .desc-container {
    background: #eee;
  }

  .li {
    padding: 0.19rem 0.29rem;
    background: #fff;
    border-bottom: 1px solid #eee;
  }

  .desc-p {
    justify-content: space-between;
  }

  .desc-title {
    font-size: 0.26rem;
    color: #2f2f2f;
  }

  .integral-num1 {
    font-size: 0.29rem;
    color: #b81f22;
  }

  .time {
    font-size: 0.23rem;
    color: #898989;
    margin-top: 0.02rem;
  }
</style>
