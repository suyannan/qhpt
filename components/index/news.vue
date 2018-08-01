<template>
  <div :style="'min-height:'+minHeight">
    <ul class="disf ul">
      <li class="type-li " @click="changeType(0)">
        <i class="icon iconfont icon-xitongxiaoxi"></i><span> 系统消息</span><span>{{'（' + system_count + '）'}}</span>
        <div class="active-bor" v-if="activeType==0"></div>
      </li>
      <li class="type-li" :class="{'active':activeType==1}" @click="changeType(1)">
        <i class="icon iconfont icon-sixin"></i><span> 通知</span><span>{{'（' + person_count + '）'}}</span>
        <div class="active-bor" v-if="activeType==1"></div>
      </li>
    </ul>
    <div :style="{'-webkit-overflow-scrolling': scrollMode}">
      <v-loadmore :bottom-method="loadBottom" :bottom-all-loaded="allLoaded" :distanceIndex="1" :bottomDistance="70"
                  :autoFill="false" ref="loadmore">
        <ul class="news-ul">
          <li class="row" v-for="item in list">
            <div class="top-p disf">
              <div class="text">
                <div class="ti">{{item.title}}</div>
                <div class="text1" v-if="item.type=='vip'||item.type=='normal'">{{item.content}}</div>
                <div class="text1 link-text" v-if="item.type=='activity'||item.type=='goods'||item.type=='article'"
                     @click="checkDesc(item.object_id,item.type)">{{item.content}}
                </div>
              </div>
              <span class="time">{{item.creat_time}}</span>
            </div>
          </li>
        </ul>
      </v-loadmore>
      <div v-if="list.length!==0&&allLoaded" class="texac no-more-tip">没有更多了~</div>
      <div v-else-if="list.length!==0&&!allLoaded" class="texac no-more-tip">上拉加载更多~</div>
    </div>
    <div v-if="list.length==0" class="texac no-more-tip">
      <img src="../../../static/img/no-news.png" class="no-content-pic" alt="">
      <div class="no-page-word">您没有相关消息哦~</div>
    </div>

    <div class="first_page"><router-link to="/"><img src="../../../static/img/first_page.png" alt=""></router-link></div>
  </div>
</template>

<script>
  import {get_message_list} from '../../api/index'

  export default {
    data() {
      return {
        minHeight: '',
        activeType: 0,
        person_count: 0,
        system_count: 0,
        params: {
          token: localStorage.getItem('token'),
          page: 1,
          number: 10
        },
        list: [],
        allLoaded: false,//是否可以上拉属性，false可以上拉，true为禁止上拉，就是不让往上划加载数据了
        scrollMode: 'auto',//移动端弹性滚动效果，touch为弹性滚动，auto是非弹性滚动
        totalPage: 0,
      }
    },
    mounted() {
      this.$dialog.loading.close();
      this.minHeight = localStorage.getItem('minHeight');
      this.getList();
    },
    methods: {
      checkDesc(id, type) {
        if (type == 'activity') {
          this.$router.push('/main/activity_desc?id=' + id);
        } else if (type == 'article') {
          this.$router.push('/main/material_desc?id=' + id);
        } else if (type == 'goods') {
          this.$router.push({
            path: '/main/goods_desc',
            query: {
              'id': id
            }
          })
        }
      },
      changeType(type) {
        this.params.page = 1;
        this.allLoaded = false;
        this.totalPage = 0;
        this.scrollMode = 'auto';
        this.activeType = type;
        this.list = [];
        this.getList();
      },
      getList() {
        var _this = this;
        get_message_list(this.params).then(function (res) {
          console.log('res--', res);
          var data = res.data.data;
          _this.person_count = data.person_count;
          _this.system_count = data.system_count;
          if (_this.activeType == 0) {
            _this.list = data.system_message;
          } else {
            _this.list = data.person_message;
          }
        }).catch(function (err) {
          console.log(err);
        })
      },

      //获取消息列表
      getList() {
        var _this = this;
        this.$dialog.loading.open('');
        get_message_list(this.params).then(function (res) {
          var data = res.data.data;
          _this.person_count = data.person_count;
          _this.system_count = data.system_count;
          if (_this.activeType == 0) {
            _this.list = data.system_message;
            _this.totalPage = Math.ceil(Number(data.system_count) / Number(_this.params.number));
          } else {
            _this.list = data.person_message;
            _this.totalPage = Math.ceil(Number(data.person_count) / Number(_this.params.number));
          }
          if (_this.params.page == _this.totalPage || _this.list.length < _this.params.number) {
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
        get_message_list(this.params).then(function (res) {
          var data = res.data.data;
          _this.person_count = data.person_count;
          _this.system_count = data.system_count;
          if (_this.activeType == 0) {
            _this.list = data.system_message;
            _this.totalPage = Math.ceil(Number(data.system_count) / Number(_this.params.number));
          } else {
            _this.list = data.person_message;
            _this.totalPage = Math.ceil(Number(data.person_count) / Number(_this.params.number));
          }
          if (_this.params.page == _this.totalPage || _this.list.length < _this.params.number) {
            _this.allLoaded = true;
          }
          _this.$refs.loadmore.onBottomLoaded();
        });
      },
    }
  }
</script>
<style scoped="true">

  .first_page{
    position: fixed;
    left:0.25rem;
    bottom:1rem;
    width:1.5rem;
    height:1.5rem;
  }
  .first_page img{
    width:100%;
    height:100%;
  }

  .newslist {
    width: 100%;
  }

  .icon-div {
    width: 0.70rem;
  }

  .icon-span {
    /*margin-right: 0.35rem;*/
    color: #898989;
    position: relative;
    display: inline-block;
  }

  .row:first-child {
    border-bottom: 1px solid #eee;
  }

  .row {
    padding: 0.29rem 0.37rem;
    background: #fff;
  }

  .top-p {
    align-items: flex-start;
  }

  .text {
    flex: 1;
    font-size: 0.28rem;
    color: #2f2f2f;
    line-height: 0.24rem;
  }

  .time {
    font-size: 0.24rem;
    color: #a4a4a4;
  }

  .text1 {
    font-size: 0.26rem;
    color: #2f2f2f;
    margin-top: 0.2rem;
  }

  .icon-xitongxiaoxi, .icon-sixin {
    font-size: 0.38rem;
    margin-right: 0.15rem;
  }

  .ti, .time {
    padding-top: 0.08rem;
    padding-bottom: 0.1rem;
  }

  .dot {
    width: 5px;
    height: 5px;
    border-radius: 50%;
    background-color: #b81f23;
    position: absolute;
    top: 2px;
    right: -1px;
  }

  .ul {
    padding: 0.24rem 0.6rem 0 0.6rem;
    justify-content: space-between;
    background: #fff;
    border-bottom: 0.14rem solid #eee;
  }

  .type-li {
    font-size: 0.28rem;
    color: #2f2f2f;
    padding-bottom: 0.2rem;
    padding-left: 0.1rem;
    display: -webkit-flex;
    display: -webkit-box;
    display: -ms-flexbox;
    display: flex;
    -webkit-box-align: center;
    -ms-flex-align: center;
    align-items: center;
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
    font-weight: bold;
    width: 2.8rem;
    position: relative;
    text-align: center;
    justify-content: center;
  }

  /*.active {
    color: #b81f23;
    border-bottom: 2px solid #b81f23;
  }*/
  .active-bor {
    position: absolute;
    width: 100%;
    height: 2px;
    background: #b81f23;
    bottom: 0;
    left: 0;
  }

  .link-text {
    text-decoration: underline;
    color: #b81f23;
  }
  .no-page-word{
    position: absolute;
    font-size:0.30rem;
    color:#898989;
    text-align: center;
    top:60%;
    left:0;
    width: 100%;
  }

</style>
