<template>
  <div class="container" :style="'min-height: '+minHeight">
    <div class="shopping-container" :style="'min-height: '+minHeight" v-if="list.length>0||invalid.length>0">
      <!--购物车列表-->
      <ul class="shopcart-list" v-if="list.length>0">
        <li v-for="(item,index) in list">
          <div class="disf goods-list">
            <input type="checkbox" :id="'li'+item.id" class="disn" :value="item" v-model="checkedNames">

            <label :for="'li'+item.id" class="i-span">
              <img src="../../static/img/no-choose.png" alt="" v-if="item.is_choosed==0" class="choose-pic">
              <img src="../../static/img/choosed.png" alt="" v-else class="choose-pic">
            </label>

            <div class="goods">
              <router-link :to="'/main/goods_desc?id='+item.goods_id">
                <img :src="item.pic" class="goods-pic" alt="">
              </router-link>

            </div>
            <div class="goods-msg">
              <div class="goods-name">
                <router-link :to="'/main/goods_desc?id='+item.goods_id">
                  <div class="integral-div"><span class="integral-span">{{'积分' + item.price.integral}}</span></div>
                  <span>{{item.goods_name}}</span>
                </router-link>
              </div>
              <p class="goods-size">{{item.price.pvs_name}}</p>
              <div class="goods-price disf">
                <div v-if="item.type=='normal'">
                  <span style="font-size: 0.24rem;">￥</span><span
                  style="font-size:0.3rem">{{item.price.original_price}}</span>
                </div>
                <div v-else>
                  <span style="font-size: 0.24rem;">￥</span><span style="font-size:0.3rem">{{item.price.promotion_price}}</span>
                  <span class="nouse_price">{{'￥' + item.price.original_price}}</span>
                </div>
                <table class="right count-div">
                  <tr>
                    <td class="common-discount" style="color: #898989;" @click="updateNumber(item,'0',index)"
                        v-if="item.number>1">-
                    </td>
                    <td class="common-discount common-disabled" style="color: #b5b4b4b4;" v-else>-</td>
                    <td class="common-num">{{item.number}}</td>
                    <td class="common-add" @click="updateNumber(item,'1',index)"
                        v-if="parseInt(item.number)<parseInt(item.price.stock)">+
                    </td>
                    <td class="common-add" style="color: #b5b4b4b4;" v-else>+</td>
                  </tr>
                  <i class="icon iconfont icon-shanchu" @click="deleteGoods(item.id,'您确定要删除宝贝吗？','删除成功',index)"></i>
                </table>
              </div>
            </div>
          </div>
        </li>
      </ul>
      <ul class="timeout-goods-ul" v-if="invalid.length>0">
        <li>
          <p class="disf sxp"><span>{{'已失效商品' + invalid.length + '件'}}</span><span class="red-text"
                                                                                   @click="deleteOutInvalid">清空失效商品</span>
          </p>
        </li>
        <li class="disf goods-list" v-for="item in invalid">
          <div class="disf span-div">
            <span class="text-span">失效</span>
          </div>
          <div class="goods">
            <img :src="item.pic" class="goods-pic" alt="">
          </div>
          <div class="goods-msg1">
            <p class="goods-name out-good-name">{{item.goods_name}}</p>
            <p class="goods-tip">{{item.invalid_dis}}</p>
          </div>
        </li>
      </ul>
      <!--底部button-->
      <!--618-->
<!--      <div class="disf total" v-if="list.length>0">
        <div class="all-div" @click="chooseAll()">
          <img src="../../static/img/no-choose.png" alt="" v-if="allChoosed==0" class="choose-pic">
          <img src="../../static/img/choosed.png" alt="" v-else class="choose-pic">
          <span>全选</span>
        </div>
        <div class="hj-btn disf">
          <div class="hj"><span>合计： </span><span class="money">{{'￥ ' + totalPrice}}</span></div>
          <div class="lr"><span>积分累计： </span><span class="">{{'￥ ' + totalIntegral}}</span></div>
        </div>
        <span class="pay" @click="pay()">{{'结算(' + totalNumber + ')'}}</span>
      </div>-->
    </div>
    <div v-if="isLoaded">
      <div class="no-list-div" v-if="list.length==0&&invalid.length==0">
        <img src="../../static/img/my/shopping_cart_nolist.png" class="no-list-pic" alt="">
        <p class="texac no-text">购物车竟然是空的</p>
      </div>
    </div>


  </div>
</template>

<script>
  import LoadMore from './common_components/loadmore.vue';
  import {
    getmy_shopping_cart,
    add_shopping_cart,
    update_goodsnumber,
    delete_shopCart
  } from '../api/index'

  export default {
    data() {
      return {
        //  上拉加载数据
        minHeight: 0,
        scrollTop: 0,
        containerHeight: 0,
        id: 0,
        isVip: 0,
        list: [],
        checkedNames: [],
        totalNumber: 0,
        totalPrice: 0,
        totalIntegral: 0,
        totalProfit: 0,
        params: {
          token: ''
        },
        invalid: [],
        isLoaded: false,
        isFirstEnter: false,
        allChoosed: 0
      }
    },
    watch: {
      checkedNames: {
        handler(n, o) {
          var _this = this;
          this.totalNumber = n.length;
          this.totalPrice = 0;
          this.totalIntegral = 0;
          //切换选中时类
          _this.list.forEach(function (li, index) {
            li.is_choosed = 0;
          });
          n.forEach(function (item) {
            var itemTotal = _this.utils.floatObj.multiply(item.price.original_price, item.number);
            var itemIntegral = _this.utils.floatObj.multiply(item.price.integral, item.number);
            _this.totalPrice = _this.utils.floatObj.add(_this.totalPrice, itemTotal);
            _this.totalIntegral = _this.utils.floatObj.add(_this.totalIntegral, itemIntegral);
            _this.list.forEach(function (li, index) {
              if (li.id == item.id) {
                _this.list[index].is_choosed = 1;
              }
            })
          })
        },
        deep: true
      }
    },
    created() {
      this.isFirstEnter = true;
      this.$dialog.loading.close();

      console.log(this.utils.floatObj.add(this.utils.floatObj.multiply(32.9, 2), 59.9));
    },
    methods: {
      //全选
      chooseAll() {
        if (this.allChoosed == 0) {
          this.allChoosed = 1;
          this.checkedNames = [];
          var _this = this;
          //切换选中时类
          _this.list.forEach(function (li, index) {
            li.is_choosed = 0;
            _this.checkedNames.push(li);
          });
        } else {
          this.allChoosed = 0;
          this.checkedNames = [];
        }

      },
      //初始化数据
      initialData() {
        this.minHeight = 0;
        this.scrollTop = 0;
        this.containerHeight = 0;
        this.id = 0;
        this.isVip = 0;
        this.list = [];
        this.checkedNames = [];
        this.totalNumber = 0;
        this.totalPrice = 0;
        this.totalIntegral = 0;
        this.totalProfit = 0;
        this.params = {
          token: ''
        };
        this.invalid = [];
        this.isLoaded = false;
        this.isFirstEnter = false;

      },
      //更新购物车中商品数量
      updateNumber(item, type, index) {
        var obj = {
          number: Number(item.number),
          token: localStorage.getItem('token'),
          id: item.id
        };
        var _this = this;
        if (type == 0) {
          obj.number--;
        } else {
          obj.number++;
        }
        update_goodsnumber(obj).then(function (res) {
          if (res.data.errcode == 1) {
            _this.$dialog.toast({
              mes: res.data.errdesc,
              timeout: 1500
            });
          } else {
            _this.checkedNames.forEach(function (checkItem, index) {
              if (checkItem.id == item.id) {
                _this.checkedNames[index].number = Number(obj.number);
              }
            });
            _this.list[index].number = Number(obj.number)
          }
        }).catch(function (err) {
          console.log(err);
        })
      },
      //获取购物车列表
      getCartList() {
        var _this = this;
        _this.isLoaded = false;
        this.$dialog.loading.open('加载中...');
        getmy_shopping_cart(this.params).then(function (res) {
          var effective = res.data.data.effective;
          var invalid = res.data.data.invalid;
          _this.list = effective;
          _this.list.forEach(function (item) {
            item.is_choosed = 0;
          });
          _this.invalid = invalid;
          _this.isLoaded = true;
          _this.$dialog.loading.close();
        }).catch(function (err) {
          console.log(err);
        })
      },
      //结算
      pay() {
        if (this.checkedNames.length == 0) {
          this.$dialog.toast({
            mes: '请选择需要结算的商品',
            timeout: 1000
          });
        } else {
          var cartGoodsChoosed = {};
          cartGoodsChoosed.goods = this.checkedNames;
          cartGoodsChoosed.total_price = this.totalPrice;
          cartGoodsChoosed.total_integral = this.totalIntegral;
          sessionStorage.setItem('cartGoodsChoosed', JSON.stringify(cartGoodsChoosed));
          this.$router.push('/main/cart_order_create');
        }

      },
      deleteGoods(id, tip, des, index) {
        var _this = this;
        this.$dialog.confirm({
          title: '提示',
          mes: tip,
          opts: () => {
            var obj = {
              'token': localStorage.getItem('token'),
              'id': id
            };
            delete_shopCart(obj).then(function (res) {
              if (res.data.errcode == 0) {
                _this.$dialog.toast({
                  mes: des,
                  timeout: 1000
                });
                if (!isNaN(index)) {
                  for (var i = 0; i < _this.checkedNames.length; i++) {
                    if (_this.checkedNames[i].id == id) {
                      _this.checkedNames = _this.checkedNames.slice(0, i).concat(_this.checkedNames.slice(i + 1, _this.checkedNames.length));
                      break;
                    }
                  }
                  _this.list = _this.list.slice(0, index).concat(_this.list.slice(index + 1, _this.list.length));
                } else {
                  _this.invalid = [];
                }
              } else {
                _this.$dialog.toast({
                  mes: res.data.errdesc,
                  timeout: 1000
                });
              }
            }).catch(function (err) {
              console.log(err);
            })
          }
        });
      },
      //清空已失效
      deleteOutInvalid() {
        var idArr = [];
        this.invalid.forEach(function (item) {
          idArr.push(item.id);
        });
        var idStr = idArr.join(',');
        this.deleteGoods(idStr, '您确定要清空宝贝吗？', '已清空');
      }
    },
    beforeRouteEnter(to, from, next) {
      sessionStorage.setItem('activeIndex', 0);
      // 路由导航钩子，此时还不能获取组件实例 `this`，所以无法在data中定义变量（利用vm除外）
      // 参考 https://router.vuejs.org/zh-cn/advanced/navigation-guards.html
      // 所以，利用路由元信息中的meta字段设置变量，方便在各个位置获取。这就是为什么在meta中定义isBack
      // 参考 https://router.vuejs.org/zh-cn/advanced/meta.html
      if (from.name == 'cart_order_create') {
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
        this.minHeight = localStorage.getItem('minHeight');
        this.params.token = localStorage.getItem('token');
        this.getCartList();
      }
      // 恢复成默认的false，避免isBack一直是true，导致下次无法获取数据
      this.$route.meta.isBack = false;
      this.isFirstEnter = false;
    },
  }
</script>
<style scoped>
  @import "../../static/css/shopping_cart/shopping_cart.css";

  .all-div {
    line-height: 2.5;
    font-size: 0.28rem;
    color: #898989;
    padding: 0 0 0 0.2rem;

  }

  .all-div img {
    display: inline-block;
    vertical-align: sub;
    width: 0.3rem;
  }

  .hj-btn {
    flex: 1;
  }

  .icon-weixuanzhong-01 {
    color: #b5b4b4;
  }

  .choose-pic {
    width: 0.35rem;
  }
</style>
