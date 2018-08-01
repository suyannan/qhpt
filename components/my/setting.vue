<template>
  <div class="container" :style="'min-height: '+minHeight">
    <ul class="setting_ul">
      <router-link to="/forget_pass">
        <li>
            <p>忘记密码 <i class="iconfont icon-youjiantou"></i></p>
        </li>
      </router-link>

      <!--<router-link to="/reset_tel">
        <li>
            <p>换绑手机号 <i class="iconfont icon-youjiantou"></i></p>
        </li>
      </router-link>-->
    </ul>

    <button @click="tuichu" class="tuichu">退出登录</button>

  </div>
</template>

<script>
    export default {
      data(){
          return{
            minHeight: 0
          }
      },
      created(){
        this.$dialog.loading.close();
        this.minHeight = localStorage.getItem('minHeight');
      },
      methods: {
        tuichu(){
          this.$dialog.confirm({
            mes: '确认退出登录？',
            opts: () => {
              localStorage.removeItem('token');
              localStorage.removeItem('invite_code');
              localStorage.removeItem('isVip');
              this.$router.push('/login')
              this.$dialog.toast({mes: '退出成功', timeout: 1000});
            }
          });
        }
      }
    }
</script>


<style scoped>
  @import "../../../static/css/my/my.css";
  .container{
    background: #eee;
  }
</style>
