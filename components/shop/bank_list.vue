<template>
    <div class="container" :style="'min-height:'+minHeight">
<ul>
  <li v-for="item in list" @click="chooseBank(item)">
    <img :src="item.pic_name" class="pic" alt="">
    <span class="text">{{item.bank_name}}</span>
  </li>
</ul>
      <mt-index-list>
        <mt-index-section :index="item.initials" v-for="item in list" :key="'list'+item.initials">
          <ul>
            <li v-for="bank in item.data" class="bank-li" @click="chooseBank(bank)">
             <!-- <img :src="item.pic_name" class="pic" alt="">-->
              <span class="text">{{bank.bank_name}}</span>
            </li>
          </ul>
        </mt-index-section>
      </mt-index-list>

    </div>
</template>

<script>
  import banks from '../../../static/js/bank'
  import {getAllBankList} from '../../api/index'
  export default {
    data() {
      return {
        minHeight: '',
        list: []
      }
    },
    created() {
      this.$dialog.loading.close();
      this.minHeight = localStorage.getItem('minHeight');
      this.list = JSON.parse(banks.bankItems);
    },
    mounted() {

    },
    methods: {
      //获取银行列表
      getBankList() {
        var _this = this;
        getAllBankList().then(function (res) {
          _this.list = res.data.data;
          var bank=[];
          var arr=['A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R','S','T','U','V','W','X','Y','Z'];
          arr.forEach(function (item) {
            var obj={
              initials:'',
              data:[]
            };
            obj.initials=item;
            _this.list.forEach(function (listItem) {
              if(listItem.initial.toUpperCase()==obj.initials){
                obj.data.push(listItem);
              }
            });
            bank.push(obj);
          });
          console.log(JSON.stringify(bank));

        }).catch(function (err) {
          console.log(err);
        })
      },
      //选择银行列表
      chooseBank(item) {
        var _this = this;
        sessionStorage.setItem('bankInfo', JSON.stringify(item));
        setTimeout(function () {
          _this.$router.push(_this.$route.query.redirect);
        },100)
      }
    }
  }
</script>
<style scoped="true">
.bank-li{
  padding:0.25rem 0.2rem;
  border-bottom: 1px solid #eee;
  font-size: 0.3rem;
  color:#2f2f2f;
}
</style>
