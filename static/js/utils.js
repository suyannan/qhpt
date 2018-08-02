import {get_signature} from '../../src/api/index'
import config from '../../src/api/config'

var utils = {
  timeChange: function (createdTime) {
    var date1 = new Date(createdTime.replace(/-/, '/'));  //开始时间
    var date2 = new Date();    //结束时间
    var date3 = date2.getTime() - date1.getTime();  //时间差的毫秒数
    //计算出相差天数
    var days = Math.floor(date3 / (24 * 3600 * 1000));
    //计算出小时数
    var leave1 = date3 % (24 * 3600 * 1000);   //计算天数后剩余的毫秒数
    var hours = Math.floor(leave1 / (3600 * 1000));
    //计算相差分钟数
    var leave2 = leave1 % (3600 * 1000);        //计算小时数后剩余的毫秒数
    var minutes = Math.floor(leave2 / (60 * 1000));
    //计算相差秒数
    var leave3 = leave2 % (60 * 1000);      //计算分钟数后剩余的毫秒数
    var seconds = Math.round(leave3 / 1000);
    if (days == 0 && hours == 0 && minutes == 0 && seconds != 0) {
      return '刚刚';
    } else if (days == 0 && hours == 0 && minutes > 0) {
      return minutes + '分钟前';
    } else if (days == 0 && hours > 0) {
      return hours + '小时前';
    } else if (0 < parseInt(days) && parseInt(days) <= 7) {
      return days + '天前';
    } else {
      var cTime = createdTime.split(' ')[0].split('-');
      return cTime[0] + '-' + cTime[1] + '-' + cTime[2];
    }
  },
  getQueryString: function (name) {
    var reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)', 'i');
    var r = window.location.search.substr(1).match(reg);
    if (r != null) {
      return unescape(r[2]);
    }
    return null;
  },
  floatObj: function () {
    /*
    * 判断obj是否为一个整数
    */
    function isInteger(obj) {
      return Math.floor(obj) === obj
    }

    /*
    * 将一个浮点数转成整数，返回整数和倍数。如 3.14 >> 314，倍数是 100
    * @param floatNum {number} 小数
    * @return {object}
    * {times:100, num: 314}
    */
    function toInteger(floatNum) {
      var ret = {times: 1, num: 0}
      if (isInteger(floatNum)) {
        ret.num = floatNum
        return ret
      }
      var strfi = floatNum + ''
      var dotPos = strfi.indexOf('.')
      var len = strfi.substr(dotPos + 1).length
      var times = Math.pow(10, len)
      var intNum = parseInt(floatNum * times + 0.5, 10)
      ret.times = times
      ret.num = intNum
      return ret
    }

    /*
    * 核心方法，实现加减乘除运算，确保不丢失精度
    * 思路：把小数放大为整数（乘），进行算术运算，再缩小为小数（除）
    *
    * @param a {number} 运算数1
    * @param b {number} 运算数2
    * @param digits {number} 精度，保留的小数点数，比如 2, 即保留为两位小数
    * @param op {string} 运算类型，有加减乘除（add/subtract/multiply/divide）
    *
    */
    function operation(a, b, digits, op) {
      var o1 = toInteger(a)
      var o2 = toInteger(b)
      var n1 = o1.num
      var n2 = o2.num
      var t1 = o1.times
      var t2 = o2.times
      var max = t1 > t2 ? t1 : t2
      var result = null
      switch (op) {
        case 'add':
          if (t1 === t2) { // 两个小数位数相同
            result = n1 + n2
          } else if (t1 > t2) { // o1 小数位 大于 o2
            result = n1 + n2 * (t1 / t2)
          } else { // o1 小数位 小于 o2
            result = n1 * (t2 / t1) + n2
          }
          return result / max
        case 'subtract':
          if (t1 === t2) {
            result = n1 - n2
          } else if (t1 > t2) {
            result = n1 - n2 * (t1 / t2)
          } else {
            result = n1 * (t2 / t1) - n2
          }
          return result / max
        case 'multiply':
          result = (n1 * n2) / (t1 * t2)
          return result
        case 'divide':
          result = (n1 / n2) * (t2 / t1)
          return result
      }
    }

    // 加减乘除的四个接口
    function add(a, b, digits) {
      return operation(a, b, digits, 'add')
    }

    function subtract(a, b, digits) {
      return operation(a, b, digits, 'subtract')
    }

    function multiply(a, b, digits) {
      return operation(a, b, digits, 'multiply')
    }

    function divide(a, b, digits) {
      return operation(a, b, digits, 'divide')
    }

    // exports
    return {
      add: add,
      subtract: subtract,
      multiply: multiply,
      divide: divide
    }
  }(),

};

//微信相关的公用方法
var wxutils = {
  // 此处我是定义在vue原型中 这样方便以后的调用 通过 this.wxShare()调用
  wxShare: function (title, desc, link, imgUrl) {
    //ios获取签名不对
    var url = document.location.href;// 当前url
    var u = navigator.userAgent;
    var isiOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); //ios终端
    // XXX: 修复iOS版微信HTML5 History兼容性问题
    var urlbase = config.domain+location.pathname+'#';
    if (isiOS && sessionStorage.getItem('iosurl')) {
      url = sessionStorage.getItem('iosurl');
    }
    get_signature({'url': url}).then(res => {// 获得签名配置
      var Data = res.data.data;
      // config信息验证后会执行ready方法，所有接口调用都必须在config接口获得结果之后，config是一个客户端的异步操作
      wx.config({
        debug: false, // 开启调试模式,开发时可以开启
        appId: Data.appId,   // 必填，公众号的唯一标识   由接口返回
        timestamp: Data.timestamp, // 必填，生成签名的时间戳 由接口返回
        nonceStr: Data.nonceStr,    // 必填，生成签名的随机串 由接口返回
        signature: Data.signature,   // 必填，签名 由接口返回
        jsApiList: [
          'onMenuShareAppMessage', // 分享给朋友
          'onMenuShareQQ',//分享到QQ
          'onMenuShareWeibo',//分享到腾讯微博
          'onMenuShareTimeline',//分享到朋友圈
          'onMenuShareQZone'//分享到QQ空间
        ] // 此处填你所用到的方法
      });

      wx.ready(() => {

        // 所以如果需要在页面加载时就调用相关接口，则须把相关接口放在ready函数中调用来确保正确执行。对于用户触发时才调用的接口，
        // 则可以直接调用，不需要放在ready函数中。
        wx.onMenuShareAppMessage({ // 分享给朋友
          title: title,       // 分享标题
          desc: desc,   // 分享描述
          link: link,       // 分享链接 默认以当前链接
          imgUrl: imgUrl,// 分享图标
          // 用户确认分享后执行的回调函数
          success: function () {
            //alert('分享成功');
          },
          // 用户取消分享后执行的回调函数
          cancel: function () {
           // alert('分享到朋友取消');
          }
        });
        //分享到朋友圈
        wx.onMenuShareTimeline({ //分享到朋友圈
          title: title,       // 分享标题
          desc: desc,   // 分享描述
          link: link,       // 分享链接 默认以当前链接
          imgUrl: imgUrl,// 分享图标
          // 用户确认分享后执行的回调函数
          success: function () {
            //alert('分享成功');
          },
          // 用户取消分享后执行的回调函数
          cancel: function () {
           // alert('分享到朋友取消');
          }
        });
        //分享到QQ
        wx.onMenuShareQQ({ // 分享到QQ
          title: title,       // 分享标题
          desc: desc,   // 分享描述
          link: link,       // 分享链接 默认以当前链接
          imgUrl: imgUrl,// 分享图标
          // 用户确认分享后执行的回调函数
          success: function () {
           // alert('分享成功');
          },
          // 用户取消分享后执行的回调函数
          cancel: function () {
           // alert('分享到朋友取消');
          }
        });

        //分享到腾讯微博
        wx.onMenuShareWeibo({ // 分享到腾讯微博
          title: title,       // 分享标题
          desc: desc,   // 分享描述
          link: link,       // 分享链接 默认以当前链接
          imgUrl: imgUrl,// 分享图标
          // 用户确认分享后执行的回调函数
          success: function () {
           // alert('分享成功');
          },
          // 用户取消分享后执行的回调函数
          cancel: function () {
           // alert('分享到朋友取消');
          }
        });

        //分享到腾讯微博
        wx.onMenuShareQZone({ // 分享到QQ空间
          title: title,       // 分享标题
          desc: desc,   // 分享描述
          link: link,       // 分享链接 默认以当前链接
          imgUrl: imgUrl,// 分享图标
          // 用户确认分享后执行的回调函数
          success: function () {
            //alert('分享成功');
          },
          // 用户取消分享后执行的回调函数
          cancel: function () {
            //alert('分享到朋友取消');
          }
        });


      });
    });
  },
  wxConfig: function () {
    //ios获取签名不对
    var url = document.location.href;// 当前url
    var u = navigator.userAgent;
    var isiOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); //ios终端
    // XXX: 修复iOS版微信HTML5 History兼容性问题
    //var urlbase = config.base_url+'#';
    var urlbase = config.domain+location.pathname+'#';
    if (isiOS && sessionStorage.getItem('iosurl')) {
      url = sessionStorage.getItem('iosurl');
      //alert(url+'===ios===')
    }
    get_signature({'url': url}).then(res => {// 获得签名配置
      var Data = res.data.data;
      // config信息验证后会执行ready方法，所有接口调用都必须在config接口获得结果之后，config是一个客户端的异步操作
      wx.config({
        debug: false, // 开启调试模式,开发时可以开启
        appId: Data.appId,   // 必填，公众号的唯一标识   由接口返回
        timestamp: Data.timestamp, // 必填，生成签名的时间戳 由接口返回
        nonceStr: Data.nonceStr,    // 必填，生成签名的随机串 由接口返回
        signature: Data.signature,   // 必填，签名 由接口返回
        jsApiList: [
          'chooseImage', //选择图片
          'uploadImage',//上传图片
          'downloadImage',//下载图片
          'chooseWXPay'//微信支付

        ] // 此处填你所用到的方法
      });

    });
  }
};


export {
  utils,//js方法
  wxutils//微信公用方法

} ;
