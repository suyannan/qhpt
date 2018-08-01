<template>
  <div :class="{'withdesc-container':list.length!=0}" :style="'min-height:'+minHeight">
    <div :style="{'-webkit-overflow-scrolling': scrollMode}">
      <v-loadmore :bottom-method="loadBottom" :bottom-all-loaded="allLoaded" :distanceIndex="1" :bottomDistance="70"
                  :autoFill="false" ref="loadmore">
        <ul>
          <template v-for="item in list">
            <li v-if="item.type=='card'">
              <img src="../../../static/img/shop/bank.png" class="pic" v-if="item.pic_name==''" alt="">
              <img :src="item.pic_name" class="pic" alt="" v-else>
              <div class="div-right">
                <div class="disf msg-p top-p">
                  <div class="dis">
                    <span>{{item.bank_name}}</span>
                    <span>（尾号</span>
                    <span>{{item.ic_number}}</span>
                    <span>）</span>
                  </div>
                  <div>
                    <span class="sign">-</span><span class="value">{{item.money}}</span>
                  </div>
                </div>
                <div class="disf msg-p"><span class="time">{{item.creat_time}}</span><span class="state" v-if="item.state=='handing'">正在审核</span><span class="state" v-else-if="item.state=='success'">已到账</span><span class="state" v-else-if="item.state=='fail'">提现失败</span></div>
              </div>
            </li>
            <li v-else>
              <img src="../../../static/img/shop/alipay.png" class="pic" alt="">
              <div class="div-right">
                <div class="disf msg-p top-p">
                  <div class="dis">
                    <span>支付宝</span>
                    <span>{{'（'+item.ic_number+'）'}}</span>
                  </div>
                  <div>
                    <span class="sign">-</span><span class="value">{{item.money}}</span>
                  </div>
                </div>
                <div class="disf msg-p"><span class="time">{{item.creat_time}}</span><span class="state" v-if="item.state=='handing'">正在审核</span><span class="state" v-else>已到账</span></div>
              </div>
            </li>
          </template>
        </ul>
      </v-loadmore>
      <div v-if="list.length!==0&&allLoaded" class="texac no-more-tip">没有更多了~</div>
      <div v-else-if="list.length!==0&&!allLoaded" class="texac no-more-tip">上拉加载更多~</div>
    </div>
    <div class="no-page-list" v-if="list.length==0">
      <img src="../../../static/img/shop/no-withdraw.png" alt="">
      <div class="no-page-word">暂无提现记录</div>
    </div>
  </div>
</template>

<script>
  import {get_withdraw_list} from '../../api/index'

  export default {
    data() {
      return {
        minHeight: '',
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
    created() {
      this.$dialog.loading.close();
      this.minHeight = localStorage.getItem('minHeight');
      this.getList();
    },
    methods: {
      //获取提现列表
      getList() {
        var _this = this;
        this.$dialog.loading.open('');
        get_withdraw_list(this.params).then(function (res) {
          var data = res.data.data.data;
          data.forEach(function (item) {
            if (item.type == 'card') {
              var len = item.ic_number.length;
              item.ic_number = item.ic_number.substr(len - 4, 4);
            } else {
              var len = item.ic_number.length;
              var num = len - 7;
              var s = '';
              for (var i = 0; i < num; i++) {
                s += '*';
              }
              item.ic_number = item.ic_number.substr(0, 3) + s + item.ic_number.substr(len - 4, 4);
            }
          });
          _this.list = data;
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
        get_withdraw_list(this.params).then(function (res) {
          var data = res.data.data.data;
          data.forEach(function (item) {
            if (item.type == 'card') {
              var len = item.ic_number.length;
              item.ic_number = item.ic_number.substr(len - 4, 4);
            } else {
              var len = item.ic_number.length;
              var num = len - 7;
              var s = '';
              for (var i = 0; i < num; i++) {
                s += '*';
              }
              item.ic_number = item.ic_number.substr(0, 3) + s + item.ic_number.substr(len - 4, 4);
            }
          });
          _this.list = _this.list.concat(data);
          _this.totalPage = Math.ceil(Number(res.data.data.count) / Number(_this.params.number));
          if (_this.params.page == _this.totalPage || data.length < _this.params.number) {
            _this.allLoaded = true;
          }
          _this.$refs.loadmore.onBottomLoaded();
        });
      },
    }
  }
</script>
<style scoped="true">
  .withdesc-container {
    background: #eee;
  }

  li {
    display: flex;
    padding: 0.29rem 0.3rem;
    background: #fff;
    align-items: center;
  }

  .pic {
    width: 0.58rem;
    height: 0.58rem;
    border-radius: 50%;
    margin-right: 0.26rem;
  }

  .div-right {
    flex: 1;
  }

  .msg-p {
    display: flex;
    justify-content: space-between;
  }

  .top-p {
    margin-bottom: 0.18rem;
  }

  .time {
    font-size: 0.26rem;
    color: #898989;
  }

  .dis {
    font-size: 0.28rem;
    color: #2f2f2f;
  }

  .state {
    font-size: 0.26rem;
    color: #2f2f2f;
  }

  .value, .sign {
    font-size: 0.28rem;
    color: #2f2f2f;
  }
  /*空白页面*/
  .no-page-list{
    width:100%;
    margin-top: 40%;
    position: relative;
  }
  .no-page-list img{
    width:100%;
  }
  .no-page-word{
    position: absolute;
    font-size: 0.30rem;
    color:#898989;
    text-align: center;
    top:50%;
    left:0;
    width: 100%;
  }
</style>
