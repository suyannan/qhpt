<template>
  <div class="my-share-container" :style="'min-height:'+minHeight">
    <div class="account-div">
      <p class="ti">可提现金额（元）</p>
      <p class="money">{{bonus_enable}}</p>
      <p class="money-p" >总金额 {{money}} 元</p>
    </div>
    <div :style="{'-webkit-overflow-scrolling': scrollMode}" v-if="list.length!=0">
      <v-loadmore :bottom-method="loadBottom" :bottom-all-loaded="allLoaded" :distanceIndex="1" :bottomDistance="70"
                  :autoFill="false" ref="loadmore">

        <ul class="ul">
          <li class="row disf" v-for="item in list">
            <div>
              <p class="type">{{item.dis}}</p>
              <p class="total-money">总金额：{{item.total_money}}</p>
            </div>
            <div>
              <p class="time">{{item.creat_time}}</p>
              <div><span class="value plus" v-if="item.type=='plus'">+</span>
                <span class="value" v-else>-</span>
                <span class="value plus" v-if="item.type=='plus'">{{item.money}}</span>
                <span class="value" v-else>{{item.money}}</span>
              </div>
            </div>
          </li>
        </ul>
      </v-loadmore>
      <div v-if="list.length!==0&&allLoaded" class="texac no-more-tip">没有更多了~</div>
      <div v-else-if="list.length!==0&&!allLoaded" class="texac no-more-tip">上拉加载更多~</div>
    </div>
    <div v-if="list.length==0" class="no-tip">暂无收支明细哦~</div>
  </div>
</template>

<script>
  import {getPersonMoneyList, getPerson_homepageInfo} from '../../api/index'

  export default {
    data() {
      return {
        allLoaded: false,//是否可以上拉属性，false可以上拉，true为禁止上拉，就是不让往上划加载数据了
        scrollMode: 'auto',//移动端弹性滚动效果，touch为弹性滚动，auto是非弹性滚动
        totalPage: 0,
        minHeight: '',
        money: '0',
        bonus_enable: 0,
        list: [],
        params: {
          token: localStorage.getItem('token'),
          page: 1,
          number: 15
        }
      }
    },
    mounted() {
      this.$dialog.loading.close();
      this.minHeight = localStorage.getItem('minHeight');
      this.getPersonBouns();
      this.getList();
    },
    methods: {
      //获取用户余额
      getPersonBouns() {
        var _this = this;
        this.$dialog.loading.open('');
        getPerson_homepageInfo({'invite_code': localStorage.getItem('invite_code')}).then(function (res) {
          //console.log(res.data.data);
          var data = res.data.data;
          _this.money = data.bonus;
          _this.bonus_enable = data.bonus_enable;
          _this.$dialog.loading.close();
        }).catch(function (err) {
          console.log(err);
        })
      },
      //获取明细列表
      getList() {
        var _this = this;
        this.$dialog.loading.open('');
        getPersonMoneyList(this.params).then(function (res) {
          //console.log('res--',res);


          _this.$dialog.loading.close();
        }).catch(function (err) {
          console.log(err);
        })
      },
      //获取明细列表
      getList() {
        var _this = this;
        this.$dialog.loading.open('');
        getPersonMoneyList(this.params).then(function (res) {
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
        getPersonMoneyList(this.params).then(function (res) {
          var list = res.data.data.data;
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
  .my-share-container {
    background: #eee;
  }

  .ul {
    background: #fff;
  }

  .row {
    margin: 0 0.29rem;
    padding: 0.26rem 0;
    justify-content: space-between;
    align-items: center;
    background: #fff;
    font-size: 0.28rem;
    color: #2f2f2f;
    border-bottom: 1px solid #eee;
  }

  .account-div {
    padding: 0.58rem 0 0.65rem 0;
    background: #fff;
    border-bottom: 0.14rem solid #eee;
  }

  .ti {
    font-size: 0.24rem;
    text-align: center;
    margin-bottom: 0.26rem;
    color: #898989;
    padding-left: 0.3rem;
  }

  .money {
    margin-bottom: 0.26rem;
    font-size: 0.50rem;
    color: #b81f23;
    text-align: center;
    font-weight: bold;
  }

  .time{
    font-size: 0.26rem;
    color: #898989;
    margin-bottom: 0.2rem;
  }

  .total-money {
    font-size: 0.24rem;
  }

  .type {
    font-size: 0.28rem;
    color: #2f2f2f;
    margin-bottom: 0.2rem;
  }

  .value {
    font-size: 0.31rem;
    color: #2f2f2f;
  }

  .plus{
    color: #b81f23;
  }
  .money-p{
    text-align:center;
    font-size: 0.25rem;
  }
  .no-tip{
    font-size: 0.32rem;
    color:#898989;
    text-align: center;
    margin-top: 50%;
  }
</style>
