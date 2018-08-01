<template>
  <div class="container" id="content" >
    <video v-if="isHave == 1" :src="src" style="width: 100%;" controls poster="../../../static/img/shop/shop_gif_p1.png"></video>
    <div class="content ql-editor" v-html="desc" id="desc-content"></div>
  </div>
</template>

<script>
  import {readmaterial_detail,quer_read} from '../../api/index'

  export default {
    data() {
      return {
        isHave: 0,
        src: '',
        desc: '',
        second:0,
        already:false,
        minHeight:''
      }
    },
    created() {

      this.getMaterialDetail();
    },
    methods: {
      getMaterialDetail() {
        var _this=this;
        var obj = {
          id: this.$route.query.id,
          token: localStorage.getItem('token')
        };
        readmaterial_detail(obj).then(function (res) {
          //console.log('desc==',res.data.data.content);
          var desc=res.data.data.content;
          _this.desc=desc;
          var eft_time=res.data.data.eft_time;
          if(res.data.data.video == ''){
            _this.isHave = 0
          }else{
              _this.isHave = 1
          }
          _this.src =res.data.data.video;
          setTimeout(function () {
            var imgArr=document.getElementById('desc-content').getElementsByTagName('img');
            for(var i=0;i<imgArr.length;i++){
              imgArr[i].style.width='100%';
            }
          },200);

          var computed = null;
          //计时器
          computed = setInterval(function () {
            var contentHeight = document.getElementById('content').scrollHeight;
            var minHeight = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight || window.screen.availHeight;
            _this.minHeight = minHeight;
            _this.contentHeight = contentHeight;
            _this.second++;
            if(contentHeight<minHeight){
              if (_this.second >= eft_time) {
                console.log('完成');
                clearInterval(computed);
                _this.already=true;
              }
            }
            //到达指定位置，清除定时器
          }, 1000);
          setTimeout(function () {
            var contentHeight = document.getElementById('content').scrollHeight;
            var minHeight = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight || window.screen.availHeight;
            _this.minHeight = minHeight;
            _this.contentHeight = contentHeight;
            if(contentHeight<minHeight){
              console.log('ss');
              if (_this.second >= eft_time) {
                clearInterval(computed);
                _this.already=true;
              }
            }else{
              window.onscroll = function () {
                //页面滚动实时获取滚动条位置
                var osTop = document.documentElement.scrollTop || document.body.scrollTop;
                // console.log('osTop', osTop);
                //到底了
                if (_this.contentHeight - osTop - minHeight < 20) {
                  console.log('到底了');
                  console.log(_this.second);
                  //判断阅读时间（阅读时间现设置的是5秒）
                  if (_this.second >= eft_time) {
                    console.log('完成');
                    clearInterval(computed);
                    _this.already=true;
                  }
                }
              };
            }

          }, 500);
        }).catch(function (err) {
          console.log(err);
        })
      }
    },
    watch:{
        already(n,o){
          if(n){
            var obj = {
              id: this.$route.query.id,
              token: localStorage.getItem('token')
            };
            quer_read(obj).then(function (res) {
              console.log(res);
            }).catch(function (err) {
              console.log(err);
            })
          }
        }
    },
    beforeRouteLeave(to, from, next) {
      window.onscroll = function () {
      };
      next();
    }
  }

</script>
<style scoped="true">
  @import "../../../static/css/quill.snow.css";

</style>
