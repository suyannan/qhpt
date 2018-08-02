import Vue from 'vue'
import axios from 'axios'
import Router from 'vue-router'
import config from '../api/config'
import Index from '../components/index/index.vue'


Vue.use(Router);

var router = new Router({
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    } else {
      return {
        x: 0,
        y: 0
      }
    }
  },
  routes: [
    {
      path: '/protocol',
      name: 'protocol',
      meta: {
        keepAlive: false,
        requireAuth: false,
        isBack:false,
      },
      component: resolve => require(['../components/protocol.vue'], resolve)
    },
    {
      path: '/unlogin',
      name: 'unlogin',
      meta: {
        title: '未登录',
        isBack:false,
        keepAlive: false,
        requireAuth: false,
      },
      component: resolve => require(['../components/unlogin.vue'], resolve)
    },
    {
      path: '/register',
      name: 'register',
      meta: {
        title: '注册',
        isBack:false,
        keepAlive: false,
        requireAuth: false
      },
      component: resolve => require(['../components/register.vue'], resolve)
    },
    {
      path: '/login',
      name: 'login',
      meta: {
        title: '登录',
        isBack:false,
        keepAlive: false,
        requireAuth: false
      },
      component: resolve => require(['../components/login.vue'], resolve)
    },
    {
      path: '/forget_pass',
      name: 'forget_pass',
      meta: {
        title: '忘记密码',
        isBack:false,
        keepAlive: false,
        requireAuth: false
      },
      component: resolve => require(['../components/forget_pass.vue'], resolve)
    },
    {
      path: '/reset_tel',
      name: 'reset_tel',
      meta: {
        title: '换绑手机',
        isBack:false,
        keepAlive: false,
        requireAuth: false
      },
      component: resolve => require(['../components/reset_tel.vue'], resolve)
    },
    {
      path: '/',
      name: 'index',
      meta: {
        title: '首页',
        keepAlive: true,
        isBack:false,
        requireAuth: false
      },
      component: Index
    },
    {
      path: '/main/classify',
      name: 'classify',
      meta: {
        title: '分类',
        isBack:false,
        keepAlive: false,
        requireAuth: false

      },
      component: resolve => require(['../components/classify/classify.vue'], resolve)
    },
    {
      path: '/main/find',
      name: 'find',
      meta: {
        title: '发现',
        keepAlive: true,
        requireAuth: false,
        isBack:false
      },
      component: resolve => require(['../components/find/find.vue'], resolve),
    },
    {
      path: '/main/noShop',
      name: 'noShop',
      meta: {
        title: '商品不存在',
        keepAlive: false,
        requireAuth: false,
        isBack:false
      },
      component: resolve => require(['../components/common_components/noShop.vue'], resolve),
    },
    {
      path: '/main/noPage',
      name: 'noPage',
      meta: {
        title: '页面不存在',
        keepAlive: false,
        requireAuth: false,
        isBack:false
      },
      component: resolve => require(['../components/common_components/noPage.vue'], resolve),
    },
    {
      path: '/main/my',
      name: 'my',
      meta: {
        title: '我的',
        keepAlive: false,
        requireAuth: true,
        isBack:false
      },
      component: resolve => require(['../components/my/my.vue'], resolve)
    },
    {
      path: '/main/setting',
      name: 'setting',
      meta: {
        title: '设置',
        keepAlive: false,
        requireAuth: true,
        isBack:false
      },
      component: resolve => require(['../components/my/setting.vue'], resolve)
    },
    {
      path: '/main/shop',
      name: 'shop',
      meta: {
        title: '店铺',
        isBack:false,
        keepAlive: false,
        requireAuth:true
      },
      component: resolve => require(['../components/shop/shop.vue'], resolve),
    },
    {
      path: '/main/search',
      name: 'search',
      meta: {
        title: '搜索',
        isBack:false,
        keepAlive: true,
        requireAuth: false

      },
      component: resolve => require(['../components/index/search.vue'], resolve),
    },
    {
      path: '/main/shoppingcart',
      name: 'shoppingcart',
      meta: {
        title: '购物车',
        isBack:false,
        keepAlive: true,
        requireAuth: true

      },
      component: resolve => require(['../components/shopping_cart.vue'], resolve)
    },
    {
      path: '/main/classifysecond',
      name: 'classifysecond',
      meta: {
        title: '分类',
        keepAlive: true,
        isBack:false,
        requireAuth: false
      },
      component: resolve => require(['../components/classify/classify_second.vue'], resolve),
    },
    {
      path: '/main/connect',
      name: 'connect',
      meta: {
        title: '客服中心',
        isBack:false,
        keepAlive: false,
        requireAuth: false
      },
      component: resolve => require(['../components/index/connect_kf.vue'], resolve),
    },
    {
      path: '/main/connect_list',
      name: 'connect_list',
      meta: {
        title: '常见问题',
        isBack:false,
        keepAlive: false,
        requireAuth: false
      },
      component: resolve => require(['../components/index/connect_kf_list.vue'], resolve),
    },
    {
      path: '/main/timing_desc',
      name: 'timing_desc',
      meta: {
        title: '商品详情',
        isBack:false,
        keepAlive: false,
        requireAuth: false
      },
      component: resolve => require(['../components/index/timing_desc.vue'], resolve),
    },
    {
      path: '/main/grounp_desc',
      name: 'grounp_desc',
      meta: {
        title: '商品详情',
        isBack:false,
        keepAlive: false,
        requireAuth: false
      },
      component: resolve => require(['../components/index/grounp_desc.vue'], resolve),
    },
    {
      path: '/main/goods_desc',
      name: 'goods_desc',
      meta: {
        title: '商品详情',
        keepAlive: false,
        requireAuth: false,
        isBack:false

      },
      component: resolve => require(['../components/classify/goods_desc.vue'], resolve),
    },
    {
      path: '/main/order_create',
      name: 'order_create',
      meta: {
        title: '确认订单',
        isBack:false,
        keepAlive: false,
        requireAuth: true
      },
      component: resolve => require(['../components/order/order_create.vue'], resolve),
    },
    {
      path: '/main/gift_order_create',
      name: 'gift_order_create',
      meta: {
        title: '确认订单',
        isBack:false,
        keepAlive: false,
        requireAuth: true
      },
      component: resolve => require(['../components/order/gift_order_create.vue'], resolve),
    },
    {
      path: '/main/group_order_create',
      name: 'group_order_create',
      meta: {
        title: '确认订单',
        isBack:false,
        keepAlive: false,
        requireAuth: true
      },
      component: resolve => require(['../components/order/group_order_create.vue'], resolve),
    },
    {
      path: '/main/scare_order_create',
      name: 'scare_order_create',
      meta: {
        title: '确认订单',
        isBack:false,
        keepAlive: false,
        requireAuth: true
      },
      component: resolve => require(['../components/order/scare_order_create.vue'], resolve),
    },
    {
      path: '/main/cart_order_create',
      name: 'cart_order_create',
      meta: {
        title: '确认订单',
        isBack:false,
        keepAlive: false,
        requireAuth: true
      },
      component: resolve => require(['../components/order/cart_order_create.vue'], resolve),
    },
    {
      path: '/main/pay',
      name: 'pay',
      meta: {
        title: '订单支付',
        isBack:false,
        keepAlive: false,
        requireAuth: true
      },
      component: resolve => require(['../components/order/pay.vue'], resolve),
    },
    {
      path: '/main/pay_again',
      name: 'pay_again',
      meta: {
        title: '订单支付',
        isBack:false,
        keepAlive: false,
        requireAuth: true
      },
      component: resolve => require(['../components/order/pay_again.vue'], resolve),
    },
    {
      path: '/main/withdraw',
      name: 'withdraw',
      meta: {
        title: '提现',
        isBack:false,
        keepAlive: false,
        requireAuth: true
      },
      component: resolve => require(['../components/shop/withdraw.vue'], resolve),
    },
    {
      path: '/main/shop_school',
      name: 'shop_school',
      meta: {
        title: '商学院',
        requireAuth: true,
        keepAlive: true,
        isBack:false
      },
      component: resolve => require(['../components/shop/shop_school.vue'], resolve),
    },
    {
      path: '/main/business_training',
      name: 'business_training',
      meta: {
        title: '业务培训',
        requireAuth: true,
        keepAlive: true,
        isBack:false
      },
      component: resolve => require(['../components/shop/business_training.vue'], resolve),
    },
    {
      path: '/main/new_address',
      name: 'new_address',
      meta: {
        title: '管理收货地址',
        isBack:false,
        keepAlive: false,
        requireAuth: true
      },
      component: resolve => require(['../components/my/new_address.vue'], resolve),
    },
    {
      path: '/main/address_manage',
      name: 'address_manage',
      meta: {
        title: '管理收货地址',
        isBack:false,
        keepAlive: false,
        requireAuth: true
      },
      component: resolve => require(['../components/my/address_manage.vue'], resolve),
    },
    {
      path: '/main/choose_address',
      name: 'choose_address',
      meta: {
        title: '选择收货地址',
        isBack:false,
        keepAlive: false,
        requireAuth: true
      },
      component: resolve => require(['../components/my/choose_address.vue'], resolve),
    },
    {
      path: '/main/new_recommend',
      name: 'new_recommend',
      meta: {
        title: '新品推荐',
        keepAlive: true,
        isBack:false,
        requireAuth: false
      },
      component: resolve => require(['../components/index/new_recommend.vue'], resolve),
    },
    {
      path: '/main/my_order',
      name: 'my_order',
      meta: {
        title: '我的订单',
        keepAlive: true,
        isBack:false,
        requireAuth: true
      },
      component: resolve => require(['../components/my/my_order.vue'], resolve),
    },
    {
      path: '/main/order_desc',
      name: 'order_desc',
      meta: {
        title: '订单详情',
        isBack:false,
        keepAlive: false,
        requireAuth: true
      },
      component: resolve => require(['../components/order/order_desc.vue'], resolve),
    },
    {
      path: '/main/my_quan',
      name: 'my_quan',
      meta: {
        title: '我的抵用券',
        isBack:false,
        keepAlive: false,
        requireAuth: true
      },
      component: resolve => require(['../components/my/my_quan.vue'], resolve),
    },

    {
      path: '/main/my_bussiness',
      name: 'my_bussiness',
      meta: {
        title: '我的生意',
        isBack:false,
        keepAlive: false,
        requireAuth: true
      },
      component: resolve => require(['../components/shop/my_bussiness.vue'], resolve),
    },
    {
      path: '/main/sell_list',
      name: 'sell_list',
      meta: {
        title: '销售记录',
        isBack:false,
        keepAlive: false,
        requireAuth: true
      },
      component: resolve => require(['../components/shop/sell_list.vue'], resolve),
    },
    {
      path: '/main/client_account',
      name: 'client_account',
      meta: {
        title: '收支明细',
        isBack:false,
        keepAlive: false,
        requireAuth: true
      },
      component: resolve => require(['../components/shop/client_account.vue'], resolve),
    },
    {
      path: '/main/lun_study',
      name: 'lun_study',
      meta: {
        title: '论语学习',
        keepAlive: true,
        isBack:false,
        requireAuth: true

      },
      component: resolve => require(['../components/shop/lun_study.vue'], resolve),
    },
    {
      path: '/main/lun_desc',
      name: 'lun_desc',
      meta: {
        title: '论语学习',
        isBack:false,
        keepAlive: false,
        requireAuth: true

      },
      component: resolve => require(['../components/shop/lun_study_desc.vue'], resolve),
    },

    {
      path: '/main/find_desc',
      name: 'find_desc',
      meta: {
        title: '发现',
        isBack:false,
        keepAlive: false,
        requireAuth: false
      },
      component: resolve => require(['../components/find/find_desc.vue'], resolve),
    },
    {
      path: '/main/news',
      name: 'news',
      meta: {
        title: '消息中心',
        isBack:false,
        keepAlive: false,
        requireAuth: true
      },
      component: resolve => require(['../components/index/news.vue'], resolve),
    },
    {
      path: '/main/logistics_desc',
      name: 'logistics_desc',
      meta: {
        title: '物流详情',
        isBack:false,
        keepAlive: false,
        requireAuth: true
      },
      component: resolve => require(['../components/order/logistics_desc.vue'], resolve),
    },
    {
      path: '/main/material_desc',
      name: 'material_desc',
      meta: {
        title: '课件详情',
        isBack:false,
        keepAlive: false,
        requireAuth: true
      },
      component: resolve => require(['../components/shop/material_desc.vue'], resolve),
    },
    {
      path: '/main/my_shelves',
      name: 'my_shelves',
      meta: {
        title: '我的货架',
        keepAlive: true,
        isBack:false,
        requireAuth: false
      },
      component: resolve => require(['../components/shop/my_shelves.vue'], resolve),
    },
    {
      path: '/main/share',
      name: 'share',
      meta: {
        title: '分享',
        isBack:false,
        keepAlive: false,
        requireAuth: true
      },
      component: resolve => require(['../components/shop/share.vue'], resolve),
    },
    {
      path: '/main/my_friend',
      name: 'my_friend',
      meta: {
        title: '我的好友',
        isBack:false,
        keepAlive: false,
        requireAuth: true
      },
      component: resolve => require(['../components/shop/my_friend.vue'], resolve),
    },
    {
      path: '/main/invite_friend',
      name: 'invite_friend',
      meta: {
        title: '邀请好友',
        isBack:false,
        keepAlive: false,
        requireAuth: true
      },
      component: resolve => require(['../components/shop/invite_friend.vue'], resolve),
    },
    {
      path: '/main/my_integral',
      name: 'my_integral',
      meta: {
        title: '我的积分',
        isBack:false,
        keepAlive: false,
        requireAuth: true
      },
      component: resolve => require(['../components/my/my_integral.vue'], resolve),
    },
    {
      path: '/main/person_information',
      name: 'person_information',
      meta: {
        title: '个人资料',
        isBack:false,
        keepAlive: false,
        requireAuth: true
      },
      component: resolve => require(['../components/my/person_information.vue'], resolve),
    },
    {
      path: '/main/group_invite',
      name: 'group_invite',
      meta: {
        title: '邀请好友',
        isBack:false,
        keepAlive: false,
        requireAuth: true
      },
      component: resolve => require(['../components/order/group_invite.vue'], resolve),
    },
    {
      path: '/main/activity_desc',
      name: 'activity_desc',
      meta: {
        title: '活动详情',
        isBack:false,
        keepAlive: false,
        requireAuth: false
      },
      component: resolve => require(['../components/shop/activity_desc.vue'], resolve),
    },
    {
      path: '/main/pay_success',
      name: 'pay_success',
      meta: {
        title: '支付成功',
        isBack:false,
        keepAlive: false,
        requireAuth: true
      },
      component: resolve => require(['../components/order/pay_success.vue'], resolve),
    },
    {
      path: '/main/person_news_list',
      name: 'person_news_list',
      meta: {
        title: '私信消息',
        isBack:false,
        keepAlive: false,
        requireAuth: true
      },
      component: resolve => require(['../components/index/person_news_list.vue'], resolve),
    },
    {
      path: '/main/person_news_content',
      name: 'person_news_content',
      meta: {
        title: '私信消息',
        isBack:false,
        keepAlive: false,
        requireAuth: true
      },
      component: resolve => require(['../components/index/person_news_content.vue'], resolve),
    },
    {
      path: '/main/refund',
      name: 'refund',
      meta: {
        title: '退款',
        isBack:false,
        keepAlive: false,
        requireAuth: true
      },
      component: resolve => require(['../components/order/refund.vue'], resolve),
    },
    {
      path: '/main/complete_material',
      name: 'complete_material',
      meta: {
        title: '完善资料',
        isBack:false,
        keepAlive: false,
        requireAuth: false
      },
      component: resolve => require(['../components/complete_material.vue'], resolve),
    },
    {
      path: '/main/invite_friend_get',
      name: 'invite_friend_get',
      meta: {
        title: '邀请VIP好友',
        isBack:false,
        keepAlive: false,
        requireAuth: false
      },
      component: resolve => require(['../components/shop/invite_friend_get.vue'], resolve),
    },
    {
      path: '/main/activity_list',
      name: 'activity_list',
      meta: {
        title: '活动',
        keepAlive: true,
        isBack:false,
        requireAuth: false
      },
      component: resolve => require(['../components/shop/activity_list.vue'], resolve),
    },
    {
      path: '/main/bank_list',
      name: 'bank_list',
      meta: {
        title: '选择银行',
        isBack:false,
        keepAlive: false,
        requireAuth: true
      },
      component: resolve => require(['../components/shop/bank_list.vue'], resolve),
    },
    {
      path: '/main/integral_desc',
      name: 'integral_desc',
      meta: {
        title: '积分明细',
        isBack:false,
        keepAlive: false,
        requireAuth: true
      },
      component: resolve => require(['../components/my/integral_desc.vue'], resolve),
    },
    {
      path: '/main/withdraw_desc',
      name: 'withdraw_desc',
      meta: {
        title: '提现记录',
        isBack:false,
        keepAlive: false,
        requireAuth: true
      },
      component: resolve => require(['../components/shop/withdraw_desc.vue'], resolve),
    },
    {
      path: '/main/shop_giftBag',
      name: 'shop_giftBag',
      meta: {
        title: '分享开店大礼包',
        isBack:false,
        keepAlive: false,
        requireAuth: true
      },
      component: resolve => require(['../components/shop/shop_giftBag.vue'], resolve),
    },
    {
      path: '/main/shop_giftContent',
      name: 'shop_giftContent',
      meta: {
        title: '开店礼包详情',
        isBack:false,
        keepAlive: false,
        requireAuth: false
      },
      component: resolve => require(['../components/shop/shop_giftContent.vue'], resolve),
    },
    {
      path: '/main/withdraw_complete',
      name: 'withdraw_complete',
      meta: {
        title: '提现详情',
        isBack:false,
        keepAlive: false,
        requireAuth: true
      },
      component: resolve => require(['../components/shop/withdraw_complete.vue'], resolve),
    },
    {
      path: '/main/kf_question_desc',
      name: 'kf_question_desc',
      meta: {
        // title: '问答',
        isBack:false,
        keepAlive: false,
        requireAuth: false
      },
      component: resolve => require(['../components/index/kf_question_desc.vue'], resolve),
    },
    {
      path: '/main/update_to_store_manager',
      name: 'update_to_store_manager',
      meta: {
        title: '91TOP',
        isBack:false,
        keepAlive: false,
        requireAuth: true
      },
      component: resolve => require(['../components/my/update_to_store_manager.vue'], resolve),
    },
    {
      path: '/main/order_create_voucher',
      name: 'order_create_voucher',
      meta: {
        title: '可用优惠券',
        isBack:false,
        keepAlive: false,
        requireAuth: true
      },
      component: resolve => require(['../components/order/order_create_voucher.vue'], resolve),
    },
    {
      path: '/main/my_friend_lines',
      name: 'my_friend_lines',
      meta: {
        title: '好友列表',
        isBack:false,
        keepAlive: false,
        requireAuth: true
      },
      component: resolve => require(['../components/shop/my_friend_lines.vue'], resolve),
    },
    {
      path: '/main/web_desc',
      name: 'web_desc',
      meta: {
        title: '详情',
        isBack:false,
        keepAlive: false,
        requireAuth: false
      },
      component: resolve => require(['../components/web_desc.vue'], resolve),
    },
    {
      path: '/main/refund_and_aftersales',
      name: 'refund_and_aftersales',
      meta: {
        title: '退款/售后',
        isBack:false,
        keepAlive: false,
        requireAuth: true
      },
      component: resolve => require(['../components/my/refund_and_aftersales.vue'], resolve),
    },
    {
      path: '/main/set_password',
      name: 'set_password',
      meta: {
        title: '设置密码',
        isBack:false,
        keepAlive: false,
        requireAuth: false
      },
      component: resolve => require(['../components/shop/set_password.vue'], resolve),
    }
  ]
});

router.beforeEach((to, from, next) => {
  document.title=to.meta.title;
  //记住URL
  localStorage.setItem('from', from.fullPath);
  localStorage.setItem('to', to.fullPath);
  var u = navigator.userAgent;
  var isiOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); //ios终端
  // XXX: 修复iOS版微信HTML5 History兼容性问题
  //var urlbase = config.base_url + '#';
  var urlbase = config.domain+location.pathname + '#';
  if (isiOS && !sessionStorage.getItem('iosurl')) {
    sessionStorage.setItem('iosurl', urlbase + to.fullPath);
    //alert(sessionStorage.getItem('iosurl'));
  }
  //判断是否需要登录
  if (to.meta.requireAuth) {
    //检测token是否已经登录
    if (localStorage.getItem('token')) {
      //登录了
      next();
    } else {
      sessionStorage.setItem('redirect', to.fullPath);
      //没登录
      next({
        path: '/unlogin',
        query: {redirect: to.fullPath}  // 将跳转的路由path作为参数，登录成功后跳转到该路由
      })
    }
  } else {
    next();
  }
});
// http response 拦截器
axios.interceptors.response.use(
  response => {
    //未登录状态时调用接口
    if (response.data.errcode == 9999) {
      new Vue().$dialog.confirm({
        title: '您还未登录',
        mes: response.data.errdesc,
        opts: [
          {
            txt: '确定',
            color: true,
            callback: () => {
              window.localStorage.removeItem('token');
              setTimeout(function () {
                router.replace({
                  path: '/login',
                  query: {redirect: router.currentRoute.fullPath}
                });
              }, 500);
            }
          }
        ]
      });

      return;
    }
    return response;
  },
  error => {
    if (error.response) {
      console.log('errorerror=====', error.response);
    }
  });


export default router;
