<template>
  <div :style="{'-webkit-overflow-scrolling': scrollMode}">
    <v-loadmore :bottom-method="loadBottom" :bottom-all-loaded="allLoaded" :distanceIndex="1"	 :bottomDistance="70" :autoFill="false" ref="loadmore">
      <ul class="goods-list">
        <li v-for="(item,index) in goods" :id="'li'+item.id" @click="checkGoodsDesc(item.id)" class="goods-li disf">
          <div class="goods-pic">
            <img :src="item.pic" class="goods-pic-class" alt="图片加载失败">
          </div>
          <div class="goods-msg">
            <div class="goods-name goods-name1">
              <span class="integrate" v-if="item.price.integral">{{'积分' + item.price.integral}}</span>
              <span class="integrate" v-else>积分0</span>
              <span>{{item.goods_name}}</span>
            </div>
            <p class="disf goods-pri">
              <span class="sign">￥</span>
              <span class="goods-price">{{item.price.original_price}}</span>
            </p>
          </div>
        </li>
      </ul>
    </v-loadmore>
    <div v-if="allLoaded" class="texac no-more-tip">没有更多了~</div>


  </div>
</template>

<script type="text/babel">
  import {getgoods_classify, getgoods_byclass} from '../../api/index'

  export default {
    data() {
      return {
        params: {
          class_id: 6,
          page: 1,
          number: 10
        },
        totalPage:0,
        goods: [],
        allLoaded: false,//是否可以上拉属性，false可以上拉，true为禁止上拉，就是不让往上划加载数据了
        scrollMode: 'auto'//移动端弹性滚动效果，touch为弹性滚动，auto是非弹性滚动
      }
    },
    created() {
      this.getGoodsByClass();
    },
    methods: {
      loadBottom() {
        var _this = this;
        _this.params.page++;
        getgoods_byclass(this.params).then(function (res) {
          const goods = res.data.data.data;
          _this.goods = _this.goods.concat(goods);
          _this.totalPage = Math.ceil(Number(res.data.data.count) / Number(_this.params.number));
          if(_this.params.page == _this.totalPage||goods.length < _this.params.number){
            _this.allLoaded = true;
          }
          _this.$refs.loadmore.onBottomLoaded();
        });
      },
      //根据分类查找商品
      getGoodsByClass() {
        var _this = this;
        getgoods_byclass(this.params).then(function (res) {
          var  goods = res.data.data.data;
          _this.goods = goods;
          _this.totalPage = Math.ceil(Number(res.data.data.count) / Number(_this.params.number));
          if(_this.params.page == _this.totalPage||goods.length < _this.params.number){
            _this.allLoaded = true;
          }
          _this.$nextTick(function () {
            // 原意是DOM更新循环结束时调用延迟回调函数，大意就是DOM元素在因为某些原因要进行修改就在这里写，要在修改某些数据后才能写，
            // 这里之所以加是因为有个坑，iphone在使用-webkit-overflow-scrolling属性，就是移动端弹性滚动效果时会屏蔽loadmore的上拉加载效果，
            // 花了好久才解决这个问题，就是用这个函数，意思就是先设置属性为auto，正常滑动，加载完数据后改成弹性滑动，安卓没有这个问题，移动端弹性滑动体验会更好
            _this.scrollMode = "touch";
          });

        }).catch(function (err) {
          console.log(err);
        })
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

  }
</script>
<style scoped="true">
  /*  .img{
      width:50px;
      height:50px;
    }*/
  @import "../../../static/css/classify/classify_second.css";
  .no-more-tip{
    text-align: center;
    font-size: 0.24rem;
    color: #c7c7c7;
    padding:0.25rem ;
  }

</style>
