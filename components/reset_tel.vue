<template>
  <div class="container register-container" :style="'min-height: '+minHeight">
    <div class="first_page"><router-link to="/"><img src="../../static/img/first_page.png" alt=""></router-link></div>
    <!--<p class="register-p">注册</p>-->
    <div class="row"><span class="label">手机号：</span><input type="text" v-model="mobile" placeholder="请输入手机号"
                                                           class="input"></div>
    <div class="row"><span class="label">验证码：</span><input type="text" v-model="code" placeholder="请输入验证码"
                                                           class="input code-input"><span class="code-btn"
                                                                                          @click="getCode">{{tip}}</span>
    </div>
    <!--<div class="row"><span class="label">密码：</span><input type="password" v-model="password" placeholder="请输入密码"
                                                          class="input"></div>
    <div class="row"><span class="label">确认密码：</span><input type="password" v-model="password1" placeholder="请再次输入密码"
                                                            class="input"></div>-->
    <button class="save" @click="register">保存</button>
  </div>
</template>

<script>
  import {changePhone, send_roundstr} from '../api/index'

  export default {
    data() {
      return {
        redirect: '',
        minHeight: '',
        mobile: '',
        code: '',
        token: '',
        tip: '获取',
        tip1: 59

      }
    },
    mounted() {
      this.$dialog.loading.close();
      this.token = window.localStorage.getItem('token');
      this.minHeight = localStorage.getItem('minHeight');
      if (this.$route.query.redirect) {
        this.redirect = this.$route.query.redirect;
      } else {
        this.redirect = '/';
      }
    },
    methods: {
      getCode() {
        var _this = this;
        this.tip1=59;
        this.tip = this.tip1 + 's';
        var timer = null;
        timer = setInterval(function () {
          if (_this.tip1 == 0) {
            clearInterval(timer);
            _this.tip = '获取';
            return;
          }
          _this.tip1--;
          _this.tip = _this.tip1 + 's';
        }, 1000);
        var myreg = /^[1][3,4,5,7,8][0-9]{9}$/;
        var _this = this;
        if (!myreg.test(this.mobile)) {
          this.$dialog.alert({mes: '请输入正确的手机号码'});
        } else {
          send_roundstr({'mobile': this.mobile}).then(function (res) {
            console.log('验证码接口res', res)
          }).catch(function (err) {
            console.log(err);
          })
        }

      },
      register() {
        //手机号正则表达式
        var myreg = /^[1][3,4,5,7,8][0-9]{9}$/;
        var _this = this;
        if (!myreg.test(this.mobile)) {
          this.$dialog.alert({mes: '请输入正确的手机号码'});
        } else if (this.code == '') {
          this.$dialog.alert({mes: '请输入验证码'});
        } else {
          var obj = {
            token:window.localStorage.getItem('token'),
            mobile: this.mobile,
            roundstr: this.code//验证码
          };
          _this.$dialog.loading.open('保存中');
          changePhone(obj).then(function (res) {
            console.log('changePhone==',res);
            _this.$dialog.loading.close();
            if (res.data.errcode == 0) {
              _this.$dialog.toast({
                mes: '保存成功！',
                timeout: 1500
              });
              setTimeout(function () {
                _this.$router.push({
                  path: '/main/connect'
                })
              },2000)

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
  }
</script>
<style scoped="true">
  .register-container {
    background: #eee;
  }

  .register-p {
    height: 0.82rem;
    line-height: 0.82rem;
    background-color: #ffffff;
    font-size: 0.3rem;
    color: #2f2f2f;
    text-align: center;
    margin-bottom: 0.2rem;
  }

  .row {
    display: flex;
    align-items: center;
    padding: 0.36rem 0.29rem;
    background: #fff;
    margin-bottom: 1px;
    font-size: 0.28rem;

  }

  .label {
    color: #2f2f2f;
    margin-right: 0.2rem;
    width: 1.5rem;
    display: inline-block;
  }

  .input {
    flex: 1;
    width: 60%;
  }

  .code-input {
    width: 55%;

  }

  .save {
    width: 6.90rem;
    height: 0.90rem;
    line-height: 0.90rem;
    background-color: #b81f23;
    border-radius: 4px;
    font-size: 0.30rem;
    text-align: center;
    color: #ffffff;
    margin: 1.02rem auto 0 auto;
    display: block;
    border: 0;
  }

  .code-btn {
    display: flex;
    width: 1.20rem;
    height: 0.50rem;
    justify-content: center;
    align-items: center;
    /* line-height: 0.50rem;*/
    background-color: #eeeeee;
    border-radius: 4px;
    font-size: 0.26rem;
    color: #2f2f2f;
    text-align: center;
  }

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

  input::-webkit-input-placeholder { /* WebKit browsers */
    font-size: 0.28rem;
    color: #a4a4a4;
  }

  input:-moz-placeholder { /* Mozilla Firefox 4 to 18 */
    font-size: 0.28rem;
    color: #a4a4a4;
  }

  input::-moz-placeholder { /* Mozilla Firefox 19+ */
    font-size: 0.28rem;
    color: #a4a4a4;
  }

  input:-ms-input-placeholder { /* Internet Explorer 10+ */
    font-size: 0.28rem;
    color: #a4a4a4;
  }
</style>
