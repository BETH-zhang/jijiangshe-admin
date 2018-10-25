/**
 * 网站统计的设计与实现
 * 1.埋点设计与实现
 * 2.页面引入
 * 3.数据接收
 * 4.数据入库
 * 5.统计分析
 */

/* eslint-disable */
(function() {
  var params = {};
  // Document对象数据
  if (document) {
    params.domain = document.domain || '';
    params.url = document.URL || '';
    params.title = document.title || '';
    params.referrer = document.referrer || '';
  }
  // Window对象数据
  if (window && window.screen) {
    params.sh = window.screen.height || 0;
    params.sw = window.screen.width || 0;
    params.cd = window.screen.colorDepth || 0;
  }
  // navigator对象数据
  if (navigator) {
    params.userAgent = navigator.userAgent || '';
    params.platform = navigator.platform || '';
    params.language = navigator.language || '';
  }
  // 解析_maq配置
  if (_maq) {
    for (var i in _maq) {
      switch (_maq[i][0]) {
        case 'usermac':
          params.userMac = _maq[i][1];
          break;
        case 'apmac':
          params.apMac = _maq[i][1];
          break;
        default:
          break;
      }
    }
  }
  // 拼接参数串
  var args = '';
  for (var i in params) {
    if (args != '') {
      args += '&';
    }
    args += i + '=' + encodeURIComponent(params[i]);
  }

  // 通过Image对象请求后端脚本
  var img = new Image(1, 1);
  img.src = '//localhost:8080/api/statistics/log?' + args;
})();
