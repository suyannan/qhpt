<template>
  <div class="container">
    <div>
      <!--解注-->
      <!--轮播图-->
      <div class="swiper-container">
        <div class="swiper-wrapper">
          <template v-for="item in items">
            <div class="swiper-slide">
              <img class="banner-pic" :src="item.pic " alt="" @click="bannerLink(item.infor_type , item.subject_id)"  :style="'width:'+clientWidth+';height:'+bannerHeight">
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

      <ul class="two-block disf">
        <li class="two-li two-li1">
          <router-link to="/main/business_training">
          <img class="logo" src="../../../static/img/shop/training.png" alt="图片加载失败"><span class="name">业务培训</span><span class="bor"></span>
          </router-link>
        </li>
        <li class="two-li">
          <router-link to="/main/lun_study">
          <img class="logo" src="../../../static/img/shop/lun-study.png" alt=""><span class="name">论语学习</span>
          </router-link>
        </li>
      </ul>
      <p class="texac best-new">- 最新课件 -</p>
      <ul class="material-list">
        <li class="material-li" v-for="item in materialList">
          <router-link :to="'/main/material_desc?id='+item.id">
          <img :src="item.pic" class="material-pic" alt="图片加载失败">
          <p class="title">{{item.title}}</p>
          <p class="disf msg"><span class="tag_name">{{'#'+item.tag_name}}</span><span class="create_time">{{item.creat_time}}</span></p>
          </router-link>
        </li>
      </ul>

    </div>

    <div class="first_page"><router-link to="/"><img src="../../../static/img/first_page.png" alt=""></router-link></div>

  </div>
</template>

<script>
  import {getleatest_material,get_top_banner} from '../../api/index'

  export default {
    data() {
      return {
        materialList: [],
        bannerIndex:0,
        //轮播图
        items: [],
        bannerList: [],
        clientWidth:'',
        bannerHeight:'',
        isFirstEnter:false
      }
    },
    created() {
      this.isFirstEnter=true;
      this.$dialog.loading.close();
    },
    methods: {
      initialData(){
        this.materialList=[];
        this.bannerIndex=0;
        this.items=[];
        this.bannerList=[];
        this.clientWidth='';
        this.bannerHeight='';
        this.isFirstEnter=false;
      },
      bannerInitial(){
        var _this = this;
        var initialIndex=0;
        if(sessionStorage.getItem('swiperShop')){
          initialIndex=sessionStorage.getItem('swiperShop');
        }
        var mySwiper = new Swiper('.swiper-container', {
          initialSlide: initialIndex,
          /*observer: true,//修改swiper自己或子元素时，自动初始化swiper
          observeParents: true,//修改swiper的父元素时，自动初始化swiper*/
          autoplay: true,
          on: {
            slideChange: function () {
              _this.bannerIndex = Number(this.realIndex);
            }
          }
        });
        mySwiper.updateSlides();
      },
      //获取轮播图
      getBanner() {
        var _this = this;
        this.$dialog.loading.open();
        this.bannerIndex=0;
        this.items=[];
        this.bannerList=[];
        get_top_banner({'type':'article'}).then(function (res) {
          _this.bannerList = res.data.data;
          _this.items = res.data.data;
          _this.$nextTick(() => {
            _this.bannerInitial();// swiper重新初始化
          });

          //轮播图配置end

          _this.$dialog.loading.close();
        }).catch(function (err) {
          console.log(err);
          _this.$dialog.loading.close();

        })
      },
      getMaterialList() {
        var _this = this;
        _this.$dialog.loading.open();
        getleatest_material().then(function (res) {
          var data=res.data.data;
          data.forEach(function (item) {
            item.creat_time=_this.utils.timeChange(item.creat_time);
          });
          _this.materialList = data;
          _this.$dialog.loading.close();

        }).catch(function (err) {
          console.log(err);
        })
      },
      //轮播图跳转
      bannerLink(type,id){
        var _this=this;
        switch (type){
          case 'goods':_this.$router.push({
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
    beforeRouteEnter(to, from, next) {
      // 路由导航钩子，此时还不能获取组件实例 `this`，所以无法在data中定义变量（利用vm除外）
      // 参考 https://router.vuejs.org/zh-cn/advanced/navigation-guards.html
      // 所以，利用路由元信息中的meta字段设置变量，方便在各个位置获取。这就是为什么在meta中定义isBack
      // 参考 https://router.vuejs.org/zh-cn/advanced/meta.html
      if(from.name=='material_desc'){
        to.meta.isBack=true;
        //判断是从哪个路由过来的，
        //如果是page2过来的，表明当前页面不需要刷新获取新数据，直接用之前缓存的数据即可
      }
      next();
    },
    activated() {
      this.$dialog.loading.close();
      if(!this.$route.meta.isBack|| this.isFirstEnter){
        this.initialData();
        this.clientWidth = localStorage.getItem('clientWidth');
        //轮播图高度
        this.bannerHeight=Number(this.clientWidth.split('px')[0])/750*360+'px';
        this.getBanner();
        this.getMaterialList();
      }else{
        this.$nextTick(() => {
          this.bannerInitial();// swiper重新初始化
        });
      /*  this.getBanner();*/
      }
      // 恢复成默认的false，避免isBack一直是true，导致下次无法获取数据
      this.$route.meta.isBack=false;
      this.isFirstEnter=false;

    },
    beforeRouteLeave(to, from, next){
      sessionStorage.setItem('swiperShop',this.bannerIndex);
      next()
    },

  }
</script>
<style scoped="true">
  @import "../../../static/css/shop/shop_school.css";



</style>
