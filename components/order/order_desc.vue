<template>
  <div class="container order-desc-container" :style="'min-height:'+minHeight">

    <div v-if="isReturn==0">
      <div class="status-div" v-if="desc.state=='paying'">
        <img src="../../../static/img/order/order-desc-bg.png" class="bg-img" alt="">
        <div class="status-content">
          <i class="icon iconfont icon-daifukuan1"></i>
          <div>
            <p class="status">待付款</p>
            <p class="time">
              <yd-countdown :time="payEndTime">
                <span>剩 </span><span>{%h}</span><span>小时</span><span>{%m}</span><span>分</span><span>{%s}</span><span>秒</span><span>自动关闭</span>
              </yd-countdown>
            </p>
          </div>
        </div>
      </div>

      <div class="status-div" v-if="desc.state=='confirming'">
        <img src="../../../static/img/order/order-desc-bg.png" class="bg-img" alt="">
        <div class="status-content">
          <i class="icon iconfont icon-shalou"></i>
          <span class="status">拼单还未成功</span>
        </div>
      </div>
      <div class="status-div" v-if="desc.state=='payed'">
        <img src="../../../static/img/order/order-desc-bg.png" class="bg-img" alt="">
        <div class="status-content">
          <i class="icon iconfont icon-daifahuo1"></i>
          <span class="status">待发货</span>
        </div>
      </div>
      <div class="status-div" v-if="desc.state=='dispatch'">
        <img src="../../../static/img/order/order-desc-bg.png" class="bg-img" alt="">
        <div class="status-content">
          <i class="icon iconfont icon-yifahuo1"></i>
          <span class="status">待收货</span>
        </div>
      </div>
      <div class="status-div" v-if="desc.state=='commenting'">
        <img src="../../../static/img/order/order-desc-bg.png" class="bg-img" alt="">
        <div class="status-content">
          <i class="icon iconfont icon-jinakangbaoicons17"></i>
          <span class="status">待评价</span>
        </div>
      </div>
      <div class="status-div" v-if="desc.state=='completed'">
        <img src="../../../static/img/order/order-desc-bg.png" class="bg-img" alt="">
        <div class="status-content">
          <i class="icon iconfont icon-guanbi1" v-if="desc.cancle_return=='cancle'||desc.cancle_return=='invalid'"></i>
          <i class="icon iconfont icon-jinakangbaoicons17" v-if="desc.cancle_return=='normal'||desc.cancle_return=='return'"></i>
          <span v-if="desc.cancle_return=='normal'">交易完成</span>
          <span v-if="desc.cancle_return=='cancle'">交易取消</span>
          <span v-if="desc.cancle_return=='return'">已退款</span>
          <span v-if="desc.cancle_return=='invalid'">交易关闭</span>
        </div>
      </div>

    </div>
    <div v-else>
      <div class="status-div">
        <img src="../../../static/img/order/order-desc-bg.png" class="bg-img" alt="">
        <div class="status-content">
          <!--<i class="icon iconfont icon-jinakangbaoicons17"></i>-->
          <i class="icon iconfont icon-tuikuan" v-if="desc.return_state=='handing'"></i>
          <i class="icon iconfont icon-jinakangbaoicons17" v-if="desc.return_state=='handed'"></i>
          <i class="icon iconfont icon-guanbi1" v-if="desc.return_state=='return'"></i>
          <span v-if="desc.return_state=='handing'">退款处理中</span>
          <span v-if="desc.return_state=='return'">退款驳回</span>
          <span v-if="desc.return_state=='handed'">已退款</span>
        </div>
      </div>
    </div>

    <div class="address disf" v-if="desc.user_name!=null">
      <span class="icon-span"><i class="icon iconfont icon-shouhuodizhi"></i></span>
      <div>
        <p>
          <span class="name">{{desc.user_name}}</span>
          <span class="mobile">{{desc.mobile}}</span>
        </p>
        <p class="address-msg"><span>地址：</span><span>{{desc.simple_adress + ' ' + desc.detail_adress}}</span></p>
      </div>
    </div>
    <!--拼团才有-->
    <div class="row rest-num" v-if="desc.state=='confirming'">
      <p>
        <span>仅剩</span><span class="person-num">{{remainNum}}</span><span>个名额，</span>
        <yd-countdown :time="groupEndTime" done-text="已结束">
          <span>剩余 </span><span>{%d}<i>天</i></span><span>{%h}</span><span>:</span><span>{%m}</span><span>:</span><span>{%s}</span>
        </yd-countdown>
      </p>
      <ul class="header-ul">
        <li class="header-li" v-for="(item,index) in groupMember">
          <img :src="item.head_pic" class="header" alt="">
          <span class="identity" v-if="index==0">团长</span>
        </li>
        <li class="header-li" v-for="n in Number(remainNum)">
          <span>?</span>
        </li>
      </ul>
    </div>
    <div class="msg-div">
      <div class="row disf msg-div-block">
        <span>商品信息</span>
        <router-link to="/main/connect" class="link-class"><i class="icon iconfont icon-kefu fll"></i><span>联系客服</span>
        </router-link>
      </div>
    </div>
    <div class="good-msg disf" v-for="item in desc.goods" @click="checkGoodsDesc(desc.type,item)"><!---->
      <img :src="item.pic" class="good-pic" alt="">
      <div class="good-center pa">
        <p class="good-name">{{item.goods_name}}</p>
        <p class="size">{{item.pvs_name}}</p>
      </div>
      <div class="good-right pa">
        <p>{{'￥' + item.price}}</p>
        <p class="num"><span>x</span><span>{{item.number}}</span></p>
      </div>

    </div>
    <p class="btn-p" v-if="desc.state=='payed'||desc.state=='dispatch'"><span class="btn" v-if="desc.type!='vip'" @click="returnApply()">退款</span></p>

    <div class="bor"></div>
    <div v-if="desc.type!='vip'">
      <div class="quan disf bgf" v-if="desc.state=='paying'">
        <span>优惠券</span>
        <div v-if="hasChoosedVoucher">
          <p @click="useVoucher()">
            <span>{{'满' + choosedVoucher.limit_price + '-' + choosedVoucher.price_value + '券'}}</span>
            <i class="icon iconfont icon-youjiantou right-icon1"></i>
          </p>
        </div>
        <div v-else>
          <p v-if="suitCount==0"><span class="nouse">暂无可用</span></p>
          <p v-if="suitCount>0" @click="useVoucher()">
            <span>{{suitCount + '张可用'}}</span>
            <i class="icon iconfont icon-youjiantou right-icon1"></i></p>
        </div>
      </div>
    </div>

    <div class="box box-pri">
      <p class="box-p disf"><span class="gray">商品金额</span><span class="gray">{{'￥' + desc.total_price}}</span></p>
      <div class="box-p disf yun" v-if="desc.state!='paying'&&Number(desc.voucher_price)>0">
        <span class="gray">优惠券</span>
        <span class="gray">{{'-￥' + desc.voucher_price}}</span>
      </div>
      <div class="box-p disf yun" v-if="desc.state=='paying'&&hasChoosedVoucher">
        <span class="gray">优惠券</span>
        <span class="gray">{{'-￥' + choosedVoucher.price_value}}</span>
      </div>

      <!--
            <p class="box-p disf yun"><span class="gray">运费</span><span class="gray">￥0.00</span></p>
      -->
    </div>
    <div class="box box-real">
      <p class="box-p disf" v-if="desc.state=='paying'">
        <span class="real-text">实付款</span>
        <span class="real-pri">{{'￥' + shouldPay}}</span>
      </p>
      <p class="box-p disf" v-else>
        <span class="real-text">实付款</span>
        <span class="real-pri">{{'￥' + (Number(desc.total_price) - Number(desc.voucher_price))}}</span>
      </p>
    </div>
    <div v-if="desc.state=='paying'">
      <div class="quan disf bgf pay_type" v-if="isVip==1">
        <span>支付方式</span>
        <div @click="choose_pay_type('wei')" v-if="pay_type=='wei'">
          <img src="../../../static/img/order/wx-pay.png" class="icon-logo icon-logo1" alt="">
          <span class="type">微信支付</span>
          <i class="icon iconfont icon-youjiantou right-icon1"></i>
        </div>
        <div @click="choose_pay_type('other')" v-if="pay_type=='other'">
          <img src="../../../static/img/order/account-pay.png" class="icon-logo" alt="">
          <span class="type">账户余额</span>
          <i class="icon iconfont icon-youjiantou right-icon1"></i>
        </div>
      </div>
      <p class="disf row bgf account-money" v-if="pay_type=='other'">
        <span>账户余额</span>
        <span class="total-price">{{'￥' + accountMoney}}</span>
      </p>
    </div>


    <div class="order-num">
      <p><span>订单编号：</span><span id="data">{{desc.order_number}}</span></p>
      <div v-if="desc.state=='paying'">
        <p><span>下单时间：</span><span>{{desc.creat_time}}</span></p>
      </div>
      <div v-else>
        <p><span>下单时间：</span><span>{{desc.creat_time}}</span></p>
        <p><span>付款时间：</span><span>{{desc.pay_time}}</span></p>
        <p>
          <span>支付方式：</span>
          <span v-if="desc.pay_type=='wei'">微信</span>
          <span v-if="desc.pay_type=='other'">账户余额</span>
        </p>
      </div>

      <button class="copy" data-clipboard-text="200813215234654" @click="copyOrderNum">复制</button>
    </div>
    <div class="bottom-div" v-if="desc.state=='paying'">
      <!--普通商品待付款--取消订单--付款-->
      <span class="btn" @click="cancelOrder(desc.id)">取消订单</span>
      <span class="btn btn-red normal-p" v-if="!isPaying" @click="toPay()">付款</span>
      <span class="btn btn-red normal-p" v-else>付款</span>
      <!--<span class="btn btn-red normal-p">付款</span>-->
    </div>
    <!--    <div class="bottom-div" v-if="desc.state=='payed'">
          &lt;!&ndash;待收货&ndash;&gt;
          <span class="btn">提醒发货</span>
        </div>-->
    <div class="bottom-div" v-if="desc.state=='dispatch'">
      <!--待收货-->
      <span class="btn" @click="checkLogistics(desc)">查看物流</span>
      <span class="btn btn-red" @click="confirmReceive(desc.id)">确认收货</span>
    </div>
    <div class="bottom-div" v-if="desc.state=='commenting'">
      <!--交易成功-->
      <span class="btn btn-red" @click="comment(desc.id)">去评价</span>
    </div>
    <div class="bottom-div" v-if="desc.state=='confirming'">
      <!--拼单还未成功-->
      <span class="btn btn-red btn1" @click="shareShow=true">邀请好友拼单</span>
    </div>
    <div class="bottom-div" v-if="desc.state=='completed'">
      <!--交易完成-->
      <span class="btn btn1" @click="deleteOrder(desc.id)">删除订单</span>
    </div>


    <div class="sell-cover" @click="shareShow=false" v-if="shareShow">
      <img src="../../../static/img/click-share.png" class="click-share" alt="">
    </div>
    <cover :isShowSize="isShowComment" :closeByZhao="true" @coverClose="coverClose">
      <div class="star-box">
        <p class="comment-tip-p"><span class="cancel" @click="coverClose">取消</span><span class="ok"
                                                                                         @click="submitComment">确定</span>
        </p>
        <p class="star-ti">请您对此次购物评分~</p>

        <div class="star-div">

          <i class="icon iconfont icon-xingxing  defaultClass" id="icon0" @click="commentStar($event,0)"></i>
          <i class="icon iconfont icon-xingxing  defaultClass" id="icon1" @click="commentStar($event,1)"></i>
          <i class="icon iconfont icon-xingxing  defaultClass" id="icon2" @click="commentStar($event,2)"></i>
          <i class="icon iconfont icon-xingxing  defaultClass" id="icon3" @click="commentStar($event,3)"></i>
          <i class="icon iconfont icon-xingxing  defaultClass" id="icon4" @click="commentStar($event,4)"></i>
        </div>
      </div>
    </cover>

    <div class="first_page">
      <router-link to="/"><img src="../../../static/img/first_page.png" alt=""></router-link>
    </div>
  </div>
</template>

<script>
  import {
    get_order_detail,
    get_suit_count,
    getPersonInfo,
    pay_order,
    get_realgrouporer,
    confirm_receive,
    delete_order,
    cancle_order,
    upload_order_comment
  } from '../../api/index'
  import config from '../../api/config'
  import Cover from '../common_components/cover.vue'

  export default {
    data() {
      return {
        minHeight: '',
        hasChoosedVoucher: false,
        suitCount: 0,
        total: 0,
        shouldPay: 0,//应付金额
        choosedVoucher: {},//付款时选择的优惠券信息
        voucher_id: 0,//优惠券id，未付款时需要
        desc: {},//订单信息
        isVip: 0,//是不是店长
        pay_type: 'wei',//付款方式
        accountMoney: 0,//账户余额
        payEndTime: '',//付款结束时间
        groupEndTime: '',//拼团结束时间
        remainNum: 0,//拼团剩余人数
        groupMember: [],//拼团的团员信息
        groupChief: '',//团长邀请码
        shareShow: false,//分享
        group_id: 0,//拼团的id
        isShowComment: false,
        commentId: '',
        score: 0,
        isPaying:false,
        isReturn:0
      }
    },
    created() {
      this.$dialog.loading.close();
      this.order_id = this.$route.query.order_id;
      this.isVip = localStorage.getItem('isVip');
      if (sessionStorage.getItem('pay_type')) {
        this.pay_type = sessionStorage.getItem('pay_type');
        sessionStorage.removeItem('pay_type');
      }
      if (this.pay_type == 'other') {
        this.getAccount();
      }
      this.getDetail();
      this.wxutils.wxConfig();
    },
    mounted() {
      //获取可用屏幕高度
      this.minHeight = localStorage.getItem('minHeight');
    },
    methods: {
      //子组件发射事件遮罩层关闭coverClose
      coverClose(bool) {
        //bool为子组件通过自定义事件close穿过来的值
        this.isShowComment = false;
        this.changeAllStarGray();
      },
      //评价框
      comment(id) {
        this.isShowComment = true;
        this.commentId = id;
      },
      //星星点击事件
      commentStar(event, index) {
        //console.log(event,index);
        //console.log(event.target.className);
        this.score = Number(index) + 1;
        for (var i = 0; i < 5; i++) {
          var icon = document.getElementById('icon' + i);
          if (i == index) {
            if (icon.className.match(new RegExp("(\\s|^)" + 'defaultClass' + "(\\s|$)"))) {
              icon.className = icon.className.replace(new RegExp("(\\s|^)" + 'defaultClass' + "(\\s|$)"), " choosedClass");
            }
          } else if (i < index) {
            if (icon.className.match(new RegExp("(\\s|^)" + 'defaultClass' + "(\\s|$)"))) {
              icon.className = icon.className.replace(new RegExp("(\\s|^)" + 'defaultClass' + "(\\s|$)"), " choosedClass");
            }
          } else if (i > index) {
            if (icon.className.match(new RegExp("(\\s|^)" + 'choosedClass' + "(\\s|$)"))) {
              icon.className = icon.className.replace(new RegExp("(\\s|^)" + 'choosedClass' + "(\\s|$)"), " defaultClass");
            }
          }

        }
      },
      //提交评价
      submitComment() {
        var _this = this;
        var obj = {
          'order_id': this.commentId,
          'token': localStorage.getItem('token'),
          'score': this.score,
        };
        upload_order_comment(obj).then(function (res) {
          console.log(res);
          if (res.data.errcode == 0) {
            _this.isShowComment = false;
            _this.changeAllStarGray();
            _this.$dialog.toast({
              mes: '发表成功',
              timeout: 1000
            });

          } else {
            _this.$dialog.toast({
              mes: res.data.errdesc,
              timeout: 1000
            });
          }

        }).catch(function (err) {
          console.log(err);
        })
      },
      changeTime(a){
        if(parseInt(a)<10){
          return '0'+a;
        }else{
          return a;
        }
      },
      //获取订单详情
      getDetail() {
        this.$dialog.loading.open('正在加载');
        var _this = this;
        get_order_detail({'token': localStorage.getItem('token'), 'order_id': this.order_id}).then(function (res) {
          //console.log('des==', res);
          var data = res.data.data;
          _this.desc = data;
          if(_this.desc.return_state){
            _this.isReturn=1;
            /*console.log('sss',_this.desc.return_state);*/
          }
          _this.total = data.total_price;
          _this.groupChief = data.invite_code;
          _this.$dialog.loading.close();
          if (data.state == 'paying') {
            var time = _this.computeEndTime(data.creat_time, data.out_time);
            var year=new Date(time).getFullYear();
            var month=_this.changeTime(new Date(time).getMonth()+1);
            var date=_this.changeTime(new Date(time).getDate());
            var hour=_this.changeTime(new Date(time).getHours());
            var minuetes=_this.changeTime(new Date(time).getMinutes());
            var seconds=_this.changeTime(new Date(time).getSeconds());
            _this.payEndTime =year+'/'+ month+'/'+date+' '+hour+':'+minuetes+':'+seconds;
            //获取可用优惠券的数量
            var obj = {
              token: localStorage.getItem('token'),
              order_price: data.total_price
            };
            get_suit_count(obj).then(function (res) {
              _this.suitCount = res.data.data.count;
            }).catch(function (err) {
              console.log(err);
            })

          }
          if (sessionStorage.getItem('choosedVoucher')) {
            _this.choosedVoucher = JSON.parse(sessionStorage.getItem('choosedVoucher'));
            sessionStorage.removeItem('pay_type');
            if (parseFloat(_this.choosedVoucher.limit_price) <= parseFloat(data.total_price)) {
              _this.hasChoosedVoucher = true;
              _this.voucher_id = _this.choosedVoucher.id;
              _this.shouldPay = Number(_this.total) - _this.choosedVoucher.price_value;
            } else {
              _this.hasChoosedVoucher = false;
              _this.voucher_id = 0;
              _this.choosedVoucher = {};
              _this.shouldPay = Number(_this.total);
            }
          } else {
            _this.hasChoosedVoucher = false;
            _this.voucher_id = 0;
            _this.choosedVoucher = {};
            _this.shouldPay = Number(_this.total);
          }
          if (data.state == 'confirming') {
            _this.group_id = data.group_id;
            get_realgrouporer({'order_id': _this.order_id}).then(function (res) {
              var data = res.data.data;
              _this.groupEndTime = data.group.end_time.replace(/-/g, "/");
              console.log('groupEndTime===', _this.groupEndTime);
              _this.remainNum = Number(data.group.start_quantity) - Number(data.users.length);
              _this.groupMember = data.users;
            }).catch(function (err) {
              console.log(err);
            });
            var invite_code;
            if (localStorage.getItem('invite_code')) {
              invite_code = localStorage.getItem('invite_code');
            } else {
              invite_code = '0';
            }
            //自定义分享start--分享时带上团长的邀请码
            var UrlAttr = (decodeURIComponent(location.href)).split('#');
            var groupInviter = _this.groupChief;
            var param = '/main/grounp_desc?id=' + _this.group_id + '&groupInviter=' + groupInviter + '&inviter=' + invite_code;
            var link = config.redirect_url + "?host=" + encodeURIComponent(UrlAttr[0]) + "&param=" + encodeURIComponent(param);
            _this.wxutils.wxShare(data.goods[0].goods_name, data.goods[0].goods_name, link, data.goods[0].pic);
            //end
          }

        }).catch(function (err) {
          console.log(err);
        })
      },
      //复制订单号
      copyOrderNum() {
        var _this = this;
        var copyDOM = document.querySelector('#data');  //要复制文字的节点
        var range = document.createRange();
        // 选中需要复制的节点
        range.selectNode(copyDOM);
        // 执行选中元素
        window.getSelection().addRange(range);
        // 执行 copy 操作
        var successful = document.execCommand('copy');
        try {
          var msg = successful ? 'successful' : 'unsuccessful';
          _this.$dialog.toast({
            mes: '已复制',
            timeout: 1500
          });
        } catch (err) {
          _this.$dialog.toast({
            mes: '复制未成功',
            timeout: 1500
          });
        }
        // 移除选中的元素
        window.getSelection().removeAllRanges();
      },
      //选择可用优惠券
      useVoucher() {
        sessionStorage.setItem('pay_type',this.pay_type);
        sessionStorage.setItem('choosedVoucher',JSON.stringify(this.choosedVoucher));
        var hasType = '';
        if (this.$route.query.type) {
          hasType = '&type=' + this.$route.query.type;
        }
        this.$router.push({
          path: '/main/order_create_voucher',
          query: {
            order_price:this.desc.total_price,
            back: '/main/order_desc?order_id=' + this.order_id + hasType+'&from=' + this.$route.query.from
          }
        })
      },
      //选择付款方式
      choose_pay_type(type) {
        sessionStorage.setItem('pay_type',this.pay_type);
        sessionStorage.setItem('choosedVoucher',JSON.stringify(this.choosedVoucher));
        var hasType = '';
        if (this.$route.query.type) {
          hasType = '&type=' + this.$route.query.type;
        }
        this.$router.push({
          path: '/main/pay',
          query: {
            type: type,
            back: '/main/order_desc?order_id=' + this.order_id + hasType+'&from=' + this.$route.query.from
          }
        });

      },
      //获取账户余额
      getAccount() {
        var _this = this;
        getPersonInfo({'token': localStorage.getItem('token')}).then(function (res) {
          //console.log('getAccount==', res);
          _this.accountMoney = res.data.data.bonus_enable;
        }).catch(function (err) {
          console.log(err);
        })
      },
      //查看商品详情
      checkGoodsDesc(type, item) {
        var _this = this;
        switch (type) {
          case 'normal':
            this.$router.push('/main/goods_desc?id=' + item.id);
            break;//普通订单
          case 'scare':
            this.$router.push('/main/timing_desc?id=' +_this.desc.group_id);
            break;//抢购订单
          case 'group':
            this.$router.push('/main/grounp_desc?id=' + _this.desc.group_id);
            break;//团购订单
          case 'vip':
            this.$router.push('/main/shop_giftContent?id=' + _this.desc.group_id);
            break;//店长礼包
        }
      },
      //付款
      toPay() {
        this.isPaying=true;
        this.$dialog.loading.open('正在支付哦~');
        var _this = this;
        var obj = {
          token: localStorage.getItem('token'),
          order_id: this.order_id,
          pay_type: this.pay_type,
          voucher_id: this.voucher_id,
        };
        pay_order(obj).then(function (res) {
          //console.log('pay', res);
          var data = res.data.data;
          if (res.data.errcode == 0) {
            sessionStorage.removeItem('choosedVoucher');
            sessionStorage.removeItem('pay_type');
            if (_this.pay_type == 'wei') {
              var order_sign = data.order_sign;
              wx.chooseWXPay({
                timestamp: order_sign.timeStamp.replace(/s/g, "S"), // 支付签名时间戳，注意微信jssdk中的所有使用timestamp字段均为小写。但最新版的支付后台生成签名使用的timeStamp字段名需大写其中的S字符
                nonceStr: order_sign.nonceStr, // 支付签名随机串，不长于 32 位
                package: order_sign.package, // 统一支付接口返回的prepay_id参数值，提交格式如：prepay_id=\*\*\*）
                signType: order_sign.signType, // 签名方式，默认为'SHA1'，使用新版支付需传入'MD5'
                paySign: order_sign.paySign, // 支付签名
                success: function (res) {
                  _this.isPaying = false;
                  _this.$dialog.loading.close();
                  // 支付成功后的回调函数
                  _this.$router.push('/main/pay_success?order_id=' + data.order_id);
                },
                cancel: function (res) {
                  _this.isPaying = false;
                  _this.$dialog.loading.close();
                }
              });
            } else {
              _this.$dialog.loading.close();
              _this.$dialog.toast({
                mes: '支付成功',
                timeout: 1000,
                icon: 'success'
              });
              setTimeout(function () {
                _this.isPaying = false;
                _this.$router.push('/main/pay_success?order_id=' + data.order_id);
              }, 1100)
            }
          } else if (res.data.errcode == 15) {
            _this.$dialog.loading.close();
            _this.isPaying = false;
            _this.$dialog.confirm({
              title: '提示',
              mes: '您未授权微信支付，是否确认授权？',
              opts: () => {
                localStorage.removeItem('userInfor');
                var hasType = '';
                if (this.$route.query.type) {
                  hasType = '&type=' + this.$route.query.type;
                }
                sessionStorage.setItem('redirect', '/main/order_desc?order_id=' + _this.order_id + hasType+'&from=' + _this.$route.query.from);
                _this.$router.push({
                  path: '/unlogin',
                  query: {redirect: '/main/order_desc?order_id=' + _this.order_id + hasType+'&from=' + _this.$route.query.from}
                });
              }
            });
          } else {
            _this.$dialog.loading.close();
            _this.isPaying = false;
            _this.$dialog.toast({
              mes: res.data.errdesc,
              timeout: 1500
            });
          }
        }).catch(function (err) {
          console.log(err);
        });
      },
      //计算付款结束时间
      computeEndTime(time, during) {
        var now = new Date(time.replace(/-/g, "/"));
        now.setMinutes(now.getMinutes() + Number(during) * 60);
        return now;
      },
      //退款申请
      returnApply() {
        this.$router.push('/main/refund?order_id=' + this.order_id)
      },
      //确认收货
      confirmReceive(id) {
        var _this = this;
        confirm_receive({'token': localStorage.getItem('token'), 'order_id': id}).then(function (res) {
          console.log('res==', res);
          if (res.data.errcode == 0) {
            _this.$dialog.toast({
              mes: '确认收货成功',
              timeout: 1000,
              icon: 'success'
            });
          } else {
            _this.$dialog.toast({
              mes: res.data.errdesc,
              timeout: 1000
            });
          }
        }).catch(function (err) {
          console.log(err);
        })
      },
      //查看物流
      checkLogistics(item) {
        this.$router.push({
          path: '/main/logistics_desc',
          query: {
            order_id: item.id,
            orderCode: item.order_number,
            shipperCode: item.shipperCode,
            logisticCode: item.logisticCode
          }
        })
      },
      //删除订单
      deleteOrder(id) {
        var _this = this;
        this.$dialog.confirm({
          title: '提示',
          mes: '您确定要删除订单吗？',
          opts: () => {
            delete_order({'token': localStorage.getItem('token'), 'order_id': id}).then(function (res) {
              if (res.data.errcode == 0) {
                _this.$dialog.toast({
                  mes: '删除成功',
                  timeout: 1000,
                  icon: 'success'
                });
                if (_this.$route.query.from == '/main/refund_and_aftersales') {
                  _this.$router.replace('/main/refund_and_aftersales?type=return');
                } else {
                  if (_this.$route.query.type) {
                    _this.$router.replace('/main/my_order?type=' + _this.$route.query.type);
                  } else {
                    _this.$router.replace('/main/my_order?type=0');

                  }
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
      //取消订单
      cancelOrder(id) {
        var _this = this;
        this.$dialog.confirm({
          title: '提示',
          mes: '您确定要取消订单吗？',
          opts: () => {
            cancle_order({'token': localStorage.getItem('token'), 'order_id': id}).then(function (res) {
              if (res.data.errcode == 0) {
                _this.$dialog.toast({
                  mes: '取消成功',
                  timeout: 1000,
                  icon: 'success'
                });
                setTimeout(function () {
                  _this.getDetail();
                }, 1100)

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

      }
    },
    components: {
      'cover': Cover
    },
  }
</script>
<style scoped="true">
  @import "../../../static/css/order/order_desc.css";

</style>
