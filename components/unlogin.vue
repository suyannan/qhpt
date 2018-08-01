<template>
  <div class="container unlogin-container" :style="'min-height: '+minHeight">

    <div class="first_page">
      <router-link to="/"><img src="../../static/img/first_page.png" alt=""></router-link>
    </div>

   <!-- <img class="unlogin-pic" src="../../static/img/order/unlogin.png" alt="">
    <p class="text">您还未登录</p>-->
    <img src="../../static/img/leader.png" class="leader-pic" alt="">
    <!-- <button class="button" @click="toLogin">去登录</button>-->
    <!--<span>{{code}}</span>-->

  </div>
</template>

<script>
  import config from '../api/config'
  import {getAuthor_infor, third_login, relate_weixi} from '../api/index'

  export default {
    data() {
      return {
        minHeight: '',
        code: null,
        base: ''
      }
    },
    mounted() {
      this.$dialog.loading.close();
      this.minHeight = localStorage.getItem('minHeight');
      this.base = config.domain + location.pathname;
      //记录之前的路由
      var _this = this;
      console.log('cookie', document.cookie);
      //获取用户微信信息未成功的各种可能状态
      if (document.cookie == '' || decodeURIComponent(document.cookie).split('user_infor=')[1] == '' || decodeURIComponent(document.cookie).split('user_infor=')[1] == null || decodeURIComponent(document.cookie).split('user_infor=')[1] == 'undefined' || decodeURIComponent(document.cookie).split('user_infor=')[1] == undefined) {
        this.toLogin();
      } else {
        //成功获取微信信息
        var u = navigator.userAgent;
        var isiOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); //ios终端
        if (isiOS) {
          sessionStorage.setItem('iosurl', _this.base + '#/unlogin');
        }
        var userInfor = decodeURIComponent(document.cookie).split('user_infor=')[1];
        localStorage.setItem('userInfor', userInfor);
        if (localStorage.getItem('token')) {
          this.relateWX();//授权后判断是否已经登录，如果已经登录直接绑定微信
        } else {
          _this.thirdLogin();
        }

      }

    },
    methods: {

      toLogin() {
        var _this = this;
        //var code = this.getQueryString('code');
        //微信授权部分
        if (!localStorage.getItem('userInfor')) {
          //刚开始进入没有授权时,没有用户微信信息，调用微信接口授权通过后台重定向返回页面，通过state参数传递给后台，重定向回unlogin页面
          //第一个版本前端跳转
          //var url = this.base + '#/unlogin';
          //第二个版本调用后台接口重定向
          var url = config.getAuthor_infor;
          //进行编码一下
          var encodeUrl = encodeURIComponent(url);
          console.log('encodeUrl', encodeUrl);
          //通过state参数传递给后台，重定向回unlogin页面,对unlogin页面路由进行编码
          var state = '/unlogin';
          var query = encodeURIComponent(state);
          //location.href = 'https://open.weixin.qq.com/connect/oauth2/authorize?appid=wxa7641616abe7bf5f&redirect_uri=' + encodeUrl + '&response_type=code&scope=snsapi_userinfor&state=' + query + '#wechat_redirect';
          location.href = 'https://open.weixin.qq.com/connect/oauth2/authorize?appid=' + config.appId + '&redirect_uri=' + encodeUrl + '&response_type=code&scope=snsapi_userinfo&state=' + query + '#wechat_redirect'
        } else {
          _this.thirdLogin();
        }
      },
      //第三方登录
      thirdLogin() {
        var _this = this;
        var userInforObj = JSON.parse(localStorage.getItem('userInfor'));
        var token = userInforObj.token;
        this.$dialog.loading.open('登录中');
        third_login({'token': token}).then(function (res) {
          _this.$dialog.loading.close();
          //console.log('third===', res);
          if (res.data.errcode == 0) {
            //usermsg为第三方登录时用户的相关信息
            //localStorage.setItem('usermsg', JSON.stringify(res.data.data));
            localStorage.setItem('uid', res.data.data.id);
            localStorage.setItem('mobile', res.data.data.mobile);
            localStorage.setItem('nick_name', res.data.data.nick_name);
            localStorage.setItem('head_pic', res.data.data.head_pic);
            localStorage.setItem('isVip', res.data.data.is_vip);
            localStorage.setItem('invite_code', res.data.data.invite_code);
            //console.log('usermsg',localStorage.getItem('usermsg'));
            if (res.data.data.name == '') {
              _this.$dialog.toast({
                mes: '您尚未完善个人资料，请先完善个人资料',
                timeout: 1300
              });
              setTimeout(function () {
                _this.$router.replace({
                  path: '/main/complete_material',
                  query: {
                    'token':res.data.data.token,
                    'redirect': sessionStorage.getItem('redirect'),
                    'isLogin': true
                  }  // 将跳转的路由path作为参数，登录成功后跳转到该路由
                })
              }, 1310);
            } else {
              localStorage.setItem('token', res.data.data.token);
              _this.$router.replace(sessionStorage.getItem('redirect'));
            }
          } else if (res.data.errcode == 1) {
            _this.$router.replace({
              path: '/login',
              query: {redirect: sessionStorage.getItem('redirect')}  // 将跳转的路由path作为参数，登录成功后跳转到该路由
            })
          }

        })
      },
      //未授权时，授权后关联微信
      relateWX() {
        var _this = this;
        var infor = JSON.parse(localStorage.getItem('userInfor'));
        var obj = {
          'mobile': localStorage.getItem('mobile'),
          'token': infor.token,
          'nick_name': infor.nickname,
          'pic': infor.headimgurl
        };
        relate_weixi(obj).then(function (res) {
          if (res.data.errcode == 0) {
            _this.$router.replace({
                path: sessionStorage.getItem('redirect'),
                query: {isAuthored: 1}
              }
            );
          } else {
            _this.$dialog.toast({
              mes: res.data.errdesc,
              timeout: 1500
            });
          }
        }).catch(function (err) {
          console.log(err);
        })
      }

    }
  }
</script>
<style scoped="true">
  .unlogin-container {
    background: #fff;
    position: relative;;
  }

  .text {
    width: 100%;
    text-align: center;
    position: absolute;
    top: 40.5%;
    left: 0;
    color: #898989;
    font-size: 0.30rem;

  }

  .button {
    display: block;
    padding: 0.15rem 0.35rem;
    /*height: 0.7rem;*/
    /* line-height: 0.7rem;*/
    margin: auto;
    background: #B91E22;
    color: #fff;
    border: 0;
    border-radius: 4px;
    text-align: center;
    margin-top: 0.3rem;

  }

  .unlogin-pic {
    width: 80%;
    margin: 35% auto 0 auto;
  }
  .leader-pic{
    width:100%;
  }

  .first_page {
    position: fixed;
    right: 0.25rem;
    bottom: 1rem;
    width: 1.5rem;
    height: 1.5rem;
  }

  .first_page img {
    width: 100%;
    height: 100%;
  }


</style>



