<template>
  <!--<button @click="login">登录</button>-->
  <div class="container login-container" :style="'min-height: '+minHeight">
    <div class="first_page"><router-link to="/"><img src="../../static/img/first_page.png" alt=""></router-link></div>
    <img class="login-pic" src="../../static/img/connect/login.png" alt="">
    <div>
      <div class="row disf"><span class="label">账号：</span><input v-model="mobile" class="flex1" type="text" placeholder="请输入手机号">
      </div>
      <div class="row disf"><span class="label">密码：</span><input v-model="password" class="flex1" type="password" placeholder="请输入密码">
      </div>
    </div>
    <p class="forget"><router-link to="/forget_pass">忘记密码？</router-link></p>
    <button class="login-btn" @click="login">登录</button>
    <p class="nocount-p"><span class="nocount">还没有账号？</span><span class="register" @click="toRegister">去注册！</span></p>

  </div>

</template>

<script>
  import {user_login} from '../api/index'
  export default {
    data() {
      return {
        from: '',
        mobile: '',
        password: '',
        redirect: '',
        minHeight: ''

      }
    },
    mounted() {
      this.$dialog.loading.close();
      this.minHeight = localStorage.getItem('minHeight');
      //判断是否是从其他页面进入的登录页
      if (this.$route.query.redirect) {
        this.redirect = this.$route.query.redirect;
      } else {
        this.redirect = '/';
      }
    },
    methods: {
      //登录
      login() {
        var _this=this;
        this.$dialog.loading.open('登录中');
        var obj={
          mobile: this.mobile,
          password: this.password,
        };
        user_login(obj).then(function (res) {
          if(res.data.errcode==0){
            //登录接口返回的用户信息
            //localStorage.setItem('loginmsg', JSON.stringify(res.data.data));
            localStorage.setItem('uid', res.data.data.id);
            localStorage.setItem('mobile', res.data.data.mobile);
            localStorage.setItem('nick_name', res.data.data.nick_name);
            localStorage.setItem('head_pic', res.data.data.head_pic);
            localStorage.setItem('ic_number', res.data.data.ic_number);
            localStorage.setItem('ic_name', res.data.data.ic_name);
            localStorage.setItem('isVip', res.data.data.is_vip);
            localStorage.setItem('invite_code', res.data.data.invite_code);
            _this.$dialog.loading.close();
            if(res.data.data.name==''){
              _this.$dialog.toast({
                mes: '您尚未完善个人资料，请先完善个人资料',
                timeout: 1300
              });
              setTimeout(function () {
                _this.$router.push({
                  path: '/main/complete_material',
                  query: {
                    'token':res.data.data.token,
                    'redirect': _this.redirect,
                    'isLogin':true
                  }  // 将跳转的路由path作为参数，登录成功后跳转到该路由
                })
              },1310);
            }else{
              localStorage.setItem('token', res.data.data.token);
              _this.$router.push(_this.redirect);
            }

          }else{
            _this.$dialog.loading.close();
            _this.$dialog.toast({
              mes: res.data.errdesc,
              timeout: 1500
            });
          }
        }).catch(function (err) {
          console.log(err);
        });
      },
      //注册
      toRegister() {
        this.$router.push({
          path: '/register',
          query: {'redirect': this.redirect}  // 将跳转的路由path作为参数，登录成功后跳转到该路由
        })
      }
    }
  }
</script>
<style scoped="true">
  @import "../../static/css/login.css";
  .first_page{
    position: fixed;
    right:0.25rem;
    bottom:1rem;
    width:1.5rem;
    height:1.5rem;
  }
  .first_page img{
    width:100%;
    height:100%;
  }
  .row{
    border-bottom:0.01rem solid #e5e5e5;
  }
</style>
