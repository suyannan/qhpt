<template>
  <div class="search-container">
    <div class="search-top disf">
      <div class="search-box disf">
        <i class="icon iconfont icon-sousuo"></i>
        <input type="text" class="search-input" v-model="params.key_word" autofocus="autofocus" v-focus @blur="getSearchList"
               placeholder="请输入要搜索的商品">
      </div>
     <span class="cancel" @click="cancelSearch()">取消</span>
    </div>
    <div class="history-div" v-if="searched">
      <p class="row ti disf history-ti">
        <span>历史记录</span><i class="icon iconfont icon-shanchu" v-if="isHistory == 1" @click="deleteHistory"></i>
      </p>
      <p class="history disf">
        <span v-for="item in history2" @click="search(item.name)">{{item.name}}</span>
      </p>
      <div class="bor"></div>
      <p class="row ti">热门搜索</p>
      <p class="history disf">
        <span class='red' v-for="item in items" @click="search(item)">{{item}}</span>
      </p>
    </div>
    <div v-else>
      <div :style="{'-webkit-overflow-scrolling': scrollMode}">
        <v-loadmore :bottom-method="loadBottom" :bottom-all-loaded="allLoaded" :distanceIndex="1" :bottomDistance="70"
                    :autoFill="false" ref="loadmore">
          <ul class="goods-list">
            <li v-for="item in searchGoodsList" class="goods-li disf" @click="checkDesc(item.id)">
              <div class="goods-pic">
                <img :src="item.pic" class="goods-pic-class" alt="">
              </div>
              <div class="goods-msg">
                <div class="goods-name goods-name1">
                  <!--<span class="integrate" v-if="item.price.integral">{{'积分' + item.price.integral}}</span>-->
                  <!--<span class="integrate" v-else>积分0</span>-->

                  <span class="bt">{{item.goods_name}}</span>
                </div>
                <p class="disf goods-pri">
                  <span class="sign red">￥</span>
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
        <div v-if="searchGoodsList.length!==0&&allLoaded" class="texac no-more-tip">没有更多了~</div>
        <div v-else-if="searchGoodsList.length!==0&&!allLoaded" class="texac no-more-tip">上拉加载更多~</div>
        <div v-if="searchGoodsList.length==0">
          <img src="../../../static/img/no-goods.png" class="no-content-pic" alt="">
        </div>


      </div>
    </div>
  </div>
</template>

<script>

  import {search_goods, get_hot_search} from '../../api/index'

  export default {
    data() {
      return {
        isHistory: 0, // 是否有历史记录，默认没有
        items: [],  //热词搜索
        history: [],  //历史记录数组
        history2: [], //历史记录需要存储浏览器的数组
        //  上拉加载数据
        minHeight: 0,
        allLoaded: false,//是否可以上拉属性，false可以上拉，true为禁止上拉，就是不让往上划加载数据了
        scrollMode: 'auto',//移动端弹性滚动效果，touch为弹性滚动，auto是非弹性滚动
        totalPage: 0,
        id: 0,
        isVip: 0,
        from: '',
        searched: true,
        searchGoodsList: [],
        params: {
          key_word: '',
          page: 1,
          number: 10
        },
        isFirstEnter:false
      }
    },
    created() {
      this.isFirstEnter=true;
    },
    methods: {
      //初始化数据
      initialData(){
        this.isHistory=0;
        this.items=[];
        this.history=[];
        this.history2=[];
        this.minHeight=0;
        this.allLoaded=false;
        this.scrollMode='auto';
        this.totalPage=0;
        this.id=0;
        this.isVip=0;
        this.from='';
        this.searched=true;
        this.searchGoodsList=[];
        this.params= {
          key_word: '',
          page: 1,
          number: 10
        };
      },
      cancelSearch(){
        this.$router.replace(this.from);
      },
      hotSearchList() {
        var _this = this;
        get_hot_search().then(function (res) {
          _this.items = res.data.data
        }).catch(function (err) {
          console.log(err);
        })
      },
      deleteHistory() {
        this.$dialog.confirm({
          mes: '确认删除全部历史记录！',
          opts: () => {
            this.history = [];
            this.history2 = [];
            localStorage.removeItem('history2');
            this.$dialog.toast({mes: '删除成功', timeout: 1000});
            this.isHistory = 0;
          }
        });
      },
      search(history) {
        this.params.key_word = history;
        this.getSearchList();
      },
      getSearchList() {
        var _this = this;
        if (_this.params.key_word == '') {
          _this.searched = true;
        } else {
          _this.searched = false;
          //最新一条插入到最前面
          this.history.unshift((this.params.key_word).toString());
          //es6数组去重
          var set = new Set(this.history);
          this.history = Array.from(set);
          //截取前三条
          window.localStorage.setItem('history2', (this.history).slice(0, 3))
          this.$dialog.loading.open('');
          search_goods(this.params).then(function (res) {
            var searchGoodsList = res.data.data.data;
            _this.searchGoodsList = searchGoodsList;
            _this.totalPage = Math.ceil(Number(res.data.data.count) / Number(_this.params.number));
            if (_this.params.page == _this.totalPage || searchGoodsList.length < _this.params.number) {
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
      loadBottom() {
        var _this = this;
        _this.params.page++;
        search_goods(this.params).then(function (res) {
          var searchGoodsList = res.data.data.data;
          _this.searchGoodsList = _this.searchGoodsList.concat(searchGoodsList);
          _this.totalPage = Math.ceil(Number(res.data.data.count) / Number(_this.params.number));
          if (_this.params.page == _this.totalPage || searchGoodsList.length < _this.params.number) {
            _this.allLoaded = true;
          }
          _this.$refs.loadmore.onBottomLoaded();
        });
      },
      checkDesc(id) {
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
        this.initialData();
        this.from = this.$route.query.back;
        this.getSearchList();
        this.hotSearchList();
        //历史记录
        var yourString = window.localStorage.getItem('history2')
        if (yourString) {

          this.isHistory = 1;

          //浏览器取到的string类型，准换成数组，方便上边dom使用，显示在页面上
          var result = yourString.split(",");

          for (var i = 0; i < result.length; i++) {
            var obj = {
              name: result[i]
            }
            this.history2.push(obj)
            this.history.push(result[i])  //记录上次的搜索
          }
        }
      }
      // 恢复成默认的false，避免isBack一直是true，导致下次无法获取数据
      this.$route.meta.isBack = false;
      this.isFirstEnter = false;
    },
  }
</script>
<style scoped="true">
  .search-container {
    padding-top: 1rem;
  }

  .search-top {
    padding: 0.12rem 0.36rem;
    align-items: center;
    border-bottom: 1px solid #eee;
    position: fixed;
    width: 100%;
    top: 0;
    left: 0;
    background: #fff;
  }

  .search-box {
    align-items: center;
    background-color: #ededed;
    border-radius: 4px;
    color: #a4a4a4;
    font-size: 0.28rem;
    padding: 0.1rem 0.22rem;
    flex: 1;
  }

  .search-input {
    font-size: 0.28rem;
    width: 100%;
    color: #2f2f2f;
  }

  .icon-sousuo {
    margin-right: 0.17rem;
    font-size: 0.38rem;
  }

  .search-input::-webkit-input-placeholder { /* WebKit browsers */
    font-size: 0.28rem;
    color: #a4a4a4;
  }

  .search-input:-moz-placeholder { /* Mozilla Firefox 4 to 18 */
    font-size: 0.28rem;
    color: #a4a4a4;
  }

  .search-input::-moz-placeholder { /* Mozilla Firefox 19+ */
    font-size: 0.28rem;
    color: #a4a4a4;
  }

  .search-input:-ms-input-placeholder { /* Internet Explorer 10+ */
    font-size: 0.28rem;
    color: #a4a4a4;
  }

  .cancel {
    font-size: 0.28rem;
    color: #2f2f2f;
    margin-left: 0.23rem;
  }

  .row {
    padding: 0.33rem 0.31rem;
  }

  .ti {
    font-size: 0.26rem;
    color: #898989;
  }

  .red {
    color: #b81f23;
  }

  .history {
    padding: 0 0.31rem;

  }

  .history-ti {
    justify-content: space-between;
  }

  .history span {
    padding: 0.1rem 0.15rem;
    border-radius: 4px;
    border: solid 1px #b5b5b5;
    font-size: 0.24rem;
    color: #2f2f2f;
    margin-right: 0.3rem;
  }

  .history .red {
    border: solid 1px #b81f23;
    color: #b81f23;
  }

  .bor {
    height: 0.14rem;
    background-color: #eeeeee;
    margin-top: 0.3rem;
  }

  .icon-shanchu {
    font-size: 0.3rem;
  }

  .classify-second-container {
    padding-top: 0.8rem;
  }

  .bor {
    height: 0.14rem;
    background-color: #eeeeee;
  }

  #common-scroll-nav {
    top: 0;
  }

  .goods-list {
    padding: 0 0.27rem 0 0.27rem;
  }

  .goods-li {
    /*padding: 0.25rem 0;*/
    height: 2.2rem;
    -webkit-box-align: center;
    -ms-flex-align: center;
    align-items: center;
    border-bottom: 1px solid #eeeeee;
  }

  .goods-pic {
    width: 1.9rem;
    height: 1.9rem;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .goods-pic-class {
    width: 100%;
    height: 100%;
  }

  .goods-msg {
    height: 100%;
    -webkit-box-flex: 1;
    -ms-flex: 1;
    flex: 1;
    display: -webkit-box;
    display: -ms-flexbox;
    display: flex;
    -webkit-box-direction: normal;
    -ms-flex-direction: column;
    flex-direction: column;
    -webkit-box-pack: justify;
    -ms-flex-pack: justify;
    justify-content: space-between;
    padding: 0.2rem 0 0.45rem 0.27rem /* padding-bottom: 0.55rem;*/;
  }

  .goods-name {
    padding-top: 0.13rem;
    font-size: 0.28rem;
    line-height: 1.6;
    color: #2f2f2f;
    vertical-align: bottom;
    margin-bottom: 0.1rem;
  }

  .goods-name1 {
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    /* autoprefixer: off */
    -webkit-box-orient: vertical;
    /* autoprefixer: on */
    white-space: normal;
    -webkit-line-clamp: 2;
  }

  .goods-pri {
    display: -webkit-box;
    display: -ms-flexbox;
    display: flex;
    -webkit-box-align: center;
    -ms-flex-align: center;
    align-items: center;
    color: #b81f23;
  }

  .sign {
    font-size: 0.24rem;
    color: #b81f23;
  }

  .goods-price {
    font-size: 0.3rem;
    color: #b81f23;
  }

  .sign1 {
    font-size: 0.31rem;
    color: #c3c3c3;
  }

  .profit {
    font-size: 0.24rem;
    color: #b81f23;
  }

  .profit-value {
    font-size: 0.3rem;
    color: #b81f23;
  }

  .bt {

  }

  .integrate {
    padding: 0.04rem 0.12rem;
    display: inline-block;
    text-align: center;
    background-color: #f27878;
    border-radius: 2px;
    color: #fff;
    font-size: 0.2rem;
    margin-right: 0.15rem;
    line-height: normal;
    /* float: left; */
  }

  input::input-placeholder {
    font-size: 0.26rem;
    color: #a4a4a4;
  }

  input::-webkit-input-placeholder {
    font-size: 0.26rem;
    color: #a4a4a4;
  }

  input:-ms-input-placeholder {
    font-size: 0.26rem;
    color: #a4a4a4;
  }

  input:-moz-placeholder {
    font-size: 0.26rem;
    color: #a4a4a4;
  }

  input::-moz-placeholder {
    font-size: 0.26rem;
    color: #a4a4a4;
  }

  .quan_dele{
    text-decoration:line-through;
    color: #898989;
    font-size:0.25rem;
    margin-left:0.3rem;
  }
  .quan{
    background: #b81f23;
    color: #fff;
    padding:0.0045rem 0.05rem;
    font-size:0.22rem;
  }
  .quan_xian{
    border:1px solid #b81f23;
    padding:0rem 0.07rem;
    color: #b81f23;
    line-height:1.2;
  }
  .quan_add{
    color: #b81f23;
    margin: 0 0.05rem;
  }

</style>
