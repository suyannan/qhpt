<template>
  <div class="container classify-container">
    <div class="disf top">
      <div class="disf input-box"><i class="icon iconfont icon-sousuo"></i><input type="text" @click="toSearch"
                                                                                  class="sousuo-input"
                                                                                  placeholder="请输入要搜索的商品"></div>
      <router-link to="/main/shoppingcart"><i class="icon iconfont  icon-gouwuche"></i></router-link>
      <router-link class="xiaoxi-box" to="/main/news"><i class="icon iconfont icon-xiaoxi"></i></router-link>

    </div>
    <!--轮播图-->
    <div class="swiper-container">
      <div class="swiper-wrapper">
        <template v-for="item in items">
          <div class="swiper-slide">
            <img class="banner-pic" :src="item.pic " alt="" @click="bannerLink(item.infor_type , item.subject_id)"  style="width:6.9rem;height:2.5rem">
          </div>
        </template>
      </div>
      <ul class="pagination-ul">
        <template v-for="n in bannerList.length">
          <li class="pagination activePagination" v-if="bannerIndex==n-1"></li>
          <li class="pagination" v-else></li>
        </template>
      </ul>
    </div>
    <ul class="classify-ul">
      <li class="classify-li" v-for="item in list" @click="checkGoods(item.id)">
        <img :src="item.pic" class="classify-pic" alt="">
        <div>{{item.name}}</div>
      </li>
    </ul>
      <footer-tab :index="1" :list="tabList"></footer-tab>
  </div>
</template>

<script>
  import FooterTab from '../common_components/footer_tab.vue'
  import config from '../../api/config'
  import {getgoods_classify, get_top_banner} from '../../api/index'

  export default {
    data() {
      return {
        //当前选中类别
        activeIndex: 0,
        bannerIndex: 0,
        list: [],
        //轮播图
        items:[],
        bannerList: [],
        tabList:[]
      }
    },
    created() {
      this.$dialog.loading.close();
  /*    if (localStorage.getItem('isVip') == 1) {
        this.tabList =config.tabbar;
      } else {
        this.tabList =config.tabbar1;
      }*/
      this.tabList =config.tabbar1;
      this.getClassify();
      this.getBanner();
    },
    methods: {
      //获取轮播图
      getBanner() {
        var _this = this;
        this.$dialog.loading.open();
        _this.bannerList=[];
        _this.bannerIndex=0;
        get_top_banner({'type': 'classfy'}).then(function (res) {
          _this.bannerList = res.data.data;
          _this.items = res.data.data;
          var mySwiper = new Swiper('.swiper-container', {
            initialSlide: 0,
            observer: true,//修改swiper自己或子元素时，自动初始化swiper
            observeParents: true,//修改swiper的父元素时，自动初始化swiper
            autoplay: true,
            on: {
              slideChange: function () {
                //轮播图循环播放时，用realIndex获取真实索引值
                _this.bannerIndex = Number(this.realIndex);
              }
            }
          });
          //轮播图配置end
          _this.$dialog.loading.close();
        }).catch(function (err) {
          console.log(err);
          _this.$dialog.loading.close();

        })
      },
      //获取分类
      getClassify() {
        var _this = this;
        this.$dialog.loading.open();
        getgoods_classify().then(function (res) {
          _this.list = res.data.data;
          _this.$dialog.loading.close();
        }).catch(function (err) {
          console.log(err)
        })
      },
      //搜索
      toSearch() {
        this.$router.push('/main/search?back=/main/classify');
      },
      //查看商品列表
      checkGoods(id) {
        this.$router.push('/main/classifysecond?id=' + id + '&class_id=0');
      },
      //轮播图跳转
      bannerLink(type,id){
        var _this=this;
        switch (type){
          case 'goods':
            _this.$router.push({
            path: '/main/goods_desc',
            query: {
              'id':id
            }
          });break;
          case 'activity':_this.$router.push('/main/activity_desc?id='+id);break;
          case 'article':_this.$router.push('/main/material_desc?id='+id);break;
          case 'web':_this.$router.push('/main/web_desc?id='+id);break;
        }
      }
    },
    components: {
      'footer-tab': FooterTab
    }


  }
</script>
<style scoped="true">
  html {
    background: #fff;
  }

  .classify-container {
    padding-bottom: 1.2rem;
  }

  .top {
    padding: 0 0.26rem;
    width: 100%;
    height: 0.9rem;
    justify-content: space-between;
    align-items: center;
    background: #fff;
    border-bottom: 0.01rem solid #e5e5e5;
    position: fixed;
    top: 0;
    left: 0;
    z-index: 100;
  }

  .icon-sousuo {
    margin: 0 0.17rem 0 0.32rem;
    font-size:0.38rem;
  }

  .input-box {
    width: 86%;
    height: 0.6rem;
    background-color: #f2f2f2;
    border-radius: 4px;
    align-items: center;
    padding: 0.15rem 0;
    color: #a4a4a4;
  }

  .sousuo-input {
    width: 80%;
    font-size:0.28rem;
  }

   .sousuo-input::-webkit-input-placeholder { /* WebKit browsers */
    font-size:0.28rem;
    color: #a4a4a4;
  }

   .sousuo-input:-moz-placeholder { /* Mozilla Firefox 4 to 18 */
    font-size:0.28rem;
    color: #a4a4a4;
  }

   .sousuo-input::-moz-placeholder { /* Mozilla Firefox 19+ */
    font-size:0.28rem;
    color: #a4a4a4;
  }

   .sousuo-input:-ms-input-placeholder { /* Internet Explorer 10+ */
    font-size:0.28rem;
    color: #a4a4a4;
  }

  .icon-gouwuche {
    margin: 0 0.25rem 0 0.15rem;
    font-size: 0.46rem;
    color: #2f2f2f;
  }

  .xiaoxi-box {
    padding-top: 0.08rem;
  }

  .icon-xiaoxi {
    font-size: 0.40rem;
    color: #2f2f2f;
  }

  /*轮播图*/
  .swiper-container {
    width: 6.90rem;
    height: 2.50rem;
    margin-top: 1.03rem;

  }

  .swiper-slide .banner-pic {
    width: 100%;
    height: 100%;
  }

  .pagination-ul {
    display: flex;
    justify-content: center;
    position: absolute;
    left: 0;
    right: 0;
    margin: auto;
    bottom: 0.15rem;
    z-index: 100;
  }

  .pagination {
    margin: 0.05rem;
    width: 0.12rem;
    height: 0.12rem;
    border-radius: 50%;
    background-color: #fff;
    opacity: 0.5;
    display: inline-block;
  }

  .pagination.activePagination {
    background-color: #fff;
    opacity: 1;
  }

  /*end*/

  .banner-pic {
    width: 100%;
  }

  .pagination {
    margin: 0.05rem;
    width: 0.12rem;
    height: 0.12rem;
    border-radius: 50%;
    background-color: rgba(255, 255, 255, 0.5);
    opacity: 0.5;
    display: inline-block;
  }

  .pagination.activePagination {
    background-color: #fff;
  }

  .classify-ul {
    padding: 0.23rem;
    display: flex;
    flex-wrap: wrap;
  }

  .classify-li {
    width: 25%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    padding: 0.35rem 0;
  }

  .classify-pic {
    width: 1.10rem;
    height: 1.10rem;
    margin-bottom: 0.25rem;
    border-radius: 50%;
  }

</style>
