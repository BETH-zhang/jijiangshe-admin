import moment from 'moment';
import { parse, stringify } from 'qs';
import attempt from 'lodash/attempt';
import sortBy from 'lodash/sortBy';
import isFunction from 'lodash/isFunction';
import isObject from 'lodash/isObject';

export function fixedZero(val) {
  return val * 1 < 10 ? `0${val}` : val;
}

export function getTimeDistance(type) {
  const now = new Date();
  const oneDay = 1000 * 60 * 60 * 24;

  if (type === 'today') {
    now.setHours(0);
    now.setMinutes(0);
    now.setSeconds(0);
    return [moment(now), moment(now.getTime() + (oneDay - 1000))];
  }

  if (type === 'week') {
    let day = now.getDay();
    now.setHours(0);
    now.setMinutes(0);
    now.setSeconds(0);

    if (day === 0) {
      day = 6;
    } else {
      day -= 1;
    }

    const beginTime = now.getTime() - day * oneDay;

    return [moment(beginTime), moment(beginTime + (7 * oneDay - 1000))];
  }

  if (type === 'month') {
    const year = now.getFullYear();
    const month = now.getMonth();
    const nextDate = moment(now).add(1, 'months');
    const nextYear = nextDate.year();
    const nextMonth = nextDate.month();

    return [
      moment(`${year}-${fixedZero(month + 1)}-01 00:00:00`),
      moment(moment(`${nextYear}-${fixedZero(nextMonth + 1)}-01 00:00:00`).valueOf() - 1000),
    ];
  }

  if (type === 'year') {
    const year = now.getFullYear();

    return [moment(`${year}-01-01 00:00:00`), moment(`${year}-12-31 23:59:59`)];
  }
}

export function getPlainNode(nodeList, parentPath = '') {
  const arr = [];
  nodeList.forEach(node => {
    const item = node;
    item.path = `${parentPath}/${item.path || ''}`.replace(/\/+/g, '/');
    item.exact = true;
    if (item.children && !item.component) {
      arr.push(...getPlainNode(item.children, item.path));
    } else {
      if (item.children && item.component) {
        item.exact = false;
      }
      arr.push(item);
    }
  });
  return arr;
}

function accMul(arg1, arg2) {
  let m = 0;
  const s1 = arg1.toString();
  const s2 = arg2.toString();
  m += s1.split('.').length > 1 ? s1.split('.')[1].length : 0;
  m += s2.split('.').length > 1 ? s2.split('.')[1].length : 0;
  return (Number(s1.replace('.', '')) * Number(s2.replace('.', ''))) / 10 ** m;
}

export function digitUppercase(n) {
  const fraction = ['角', '分'];
  const digit = ['零', '壹', '贰', '叁', '肆', '伍', '陆', '柒', '捌', '玖'];
  const unit = [['元', '万', '亿'], ['', '拾', '佰', '仟', '万']];
  let num = Math.abs(n);
  let s = '';
  fraction.forEach((item, index) => {
    s += (digit[Math.floor(accMul(num, 10 * 10 ** index)) % 10] + item).replace(/零./, '');
  });
  s = s || '整';
  num = Math.floor(num);
  for (let i = 0; i < unit[0].length && num > 0; i += 1) {
    let p = '';
    for (let j = 0; j < unit[1].length && num > 0; j += 1) {
      p = digit[num % 10] + unit[1][j] + p;
      num = Math.floor(num / 10);
    }
    s = p.replace(/(零.)*零$/, '').replace(/^$/, '零') + unit[0][i] + s;
  }

  return s
    .replace(/(零.)*零元/, '元')
    .replace(/(零.)+/g, '零')
    .replace(/^整$/, '零元整');
}

function getRelation(str1, str2) {
  if (str1 === str2) {
    console.warn('Two path are equal!'); // eslint-disable-line
  }
  const arr1 = str1.split('/');
  const arr2 = str2.split('/');
  if (arr2.every((item, index) => item === arr1[index])) {
    return 1;
  } else if (arr1.every((item, index) => item === arr2[index])) {
    return 2;
  }
  return 3;
}

function getRenderArr(routes) {
  let renderArr = [];
  renderArr.push(routes[0]);
  for (let i = 1; i < routes.length; i += 1) {
    // 去重
    renderArr = renderArr.filter(item => getRelation(item, routes[i]) !== 1);
    // 是否包含
    const isAdd = renderArr.every(item => getRelation(item, routes[i]) === 3);
    if (isAdd) {
      renderArr.push(routes[i]);
    }
  }
  return renderArr;
}

/**
 * Get router routing configuration
 * { path:{name,...param}}=>Array<{name,path ...param}>
 * @param {string} path
 * @param {routerData} routerData
 */
export function getRoutes(path, routerData) {
  let routes = Object.keys(routerData).filter(
    routePath => routePath.indexOf(path) === 0 && routePath !== path
  );
  // Replace path to '' eg. path='user' /user/name => name
  routes = routes.map(item => item.replace(path, ''));
  // Get the route to be rendered to remove the deep rendering
  const renderArr = getRenderArr(routes);
  // Conversion and stitching parameters
  const renderRoutes = renderArr.map(item => {
    const exact = !routes.some(route => route !== item && getRelation(route, item) === 1);
    return {
      exact,
      ...routerData[`${path}${item}`],
      key: `${path}${item}`,
      path: `${path}${item}`,
    };
  });
  return renderRoutes;
}

export function getPageQuery() {
  return parse(window.location.href.split('?')[1]);
}

export function getQueryPath(path = '', query = {}) {
  const search = stringify(query);
  if (search.length) {
    return `${path}?${search}`;
  }
  return path;
}

/* eslint no-useless-escape:0 */
const reg = /(((^https?:(?:\/\/)?)(?:[-;:&=\+\$,\w]+@)?[A-Za-z0-9.-]+(?::\d+)?|(?:www.|[-;:&=\+\$,\w]+@)[A-Za-z0-9.-]+)((?:\/[\+~%\/.\w-_]*)?\??(?:[-\+=&;%@.\w_]*)#?(?:[\w]*))?)$/;

export function isUrl(path) {
  return reg.test(path);
}

// qiuge.me

// 获取url的参数
export const queryString = () => {
  const qs = {};
  const query = window.location.search.substr(1);
  if (!query) {
    return {};
  }
  const vars = query.split('&');
  vars.forEach(v => {
    const pair = v.split('=');
    if (!qs[pair[0]]) {
      qs[pair[0]] = decodeURIComponent(pair[1]);
    } else if (typeof qs[pair[0]] === 'string') {
      const arr = [qs[pair[0]], decodeURIComponent(pair[1])];
      qs[pair[0]] = arr;
    } else {
      qs[pair[0]].push(decodeURIComponent(pair[1]));
    }
  });
  return qs;
};

// 处理重复请求
window.firstTime = {};
export const onlyOneRequest = key => ({
  start: (request, params) => {
    if (!window.firstTime || !window.firstTime[key]) {
      window.firstTime[key] = true;
      request(params);
    }
  },
  pause: () => {
    window.firstTime[key] = false;
  },
});

// 金额转换
export const priceFormat = value => {
  let v = '';
  let j = '';
  let sj = '';
  let rv = '';
  v = value.replace(/,/g, '').split('.');
  j = v[0].length % 3;
  sj = v[0].substr(j).toString();

  for (let i = 0; i < sj.length; i += 1) {
    rv = i % 3 === 0 ? `${rv},${sj.substr(i, 1)}` : rv + sj.substr(i, 1);
  }
  let rvalue = v[1] === undefined ? v[0].substr(0, j) + rv : `${v[0].substr(0, j)}${rv}.${v[1]}`;
  if (rvalue.charCodeAt(0) === 44) {
    rvalue = rvalue.substr(1);
  }
  return rvalue;
};

// 电话转换
export const phoneFormat = value => {
  const val = `${value}`;
  if (isNaN(Number(value))) {
    return val;
  } else if (val.length === 11) {
    return `${val.substr(0, 3)}-${val.substr(3, 4)}-${val.substr(7, 4)}`;
  } else if (val.length === 12) {
    return `${val.substr(0, 4)}-${val.substr(4, 8)}`;
  }
  return val;
};

// 获取上传文件
export const upload = (evt, callback) => {
  const file = evt.currentTarget.files[0];
  const reader = new FileReader();
  reader.onload = () => {
    const formData = new FormData();
    formData.append('file', file);
    callback(formData, file);
  };
  reader.readAsDataURL(file);
};

export const getSelectOptions = len => {
  let ary = [];
  if (len < 11) {
    ary = Array(len)
      .fill(0)
      .map((item, index) => index + 1);
  } else if (len > 10) {
    const ary1 = [1];
    const len1 = Math.floor(len / 10);
    const ary2 = Array(len1)
      .fill(0)
      .map((item, index) => (index + 1) * 10);
    const len2 = len % 10;
    // const ary3 = len2 ? Array(len2).fill(0).map((item, index) => (len1 * 10 + (index + 1))) : [];
    const ary3 = len2 ? [] : [len1 * 10 + len2];
    ary = ary1.concat(ary2).concat(ary3);
  }
  return ary;
};

// lodash封装的parse
export const parseLodash = str => {
  return attempt(JSON.parse.bind(null, str));
};

// 根据field字段将数组转换成对象
export const arrayToObjectByField = (list, field, sort) => {
  const data = sort ? sortBy(list, item => item[sort]) : list;
  const obj = {};
  let key = null;
  let ary = [];
  data.forEach((item, index) => {
    const keyTmp = isFunction(field) ? field(item) : item[field];
    if (data.length - 1 === index && keyTmp === key) {
      ary.push(item);
      obj[key] = ary;
    } else if (!index) {
      key = keyTmp;
      ary.push(item);
      if (data.length - 1 === index) {
        obj[key] = ary;
      }
    } else if (keyTmp !== key) {
      // 保存上一份记录
      obj[key] = ary;
      ary = [];
      // 重新进行保存
      ary.push(item);
      key = keyTmp;
      if (data.length - 1 === index) {
        obj[key] = ary;
      }
    } else {
      ary.push(item);
    }
  });
  return obj;
};

// 驼峰转下划线大写
export const toUnderlineUpper = value => value.replace(/([A-Z])/g, '_$1').toUpperCase();

/**
 * param 将要转为URL参数字符串的对象
 * key URL参数字符串的前缀
 * encode true/false 是否进行URL编码,默认为true
 *
 * return URL参数字符串
 */
export const urlEncode = (param, key, encode) => {
  if (param == null) return '';
  let paramStr = '';
  const t = typeof param;
  if (t === 'string' || t === 'number' || t === 'boolean') {
    paramStr += `&${key}=${encode == null || encode ? encodeURIComponent(param) : param}`;
  } else {
    Object.keys(param).forEach(i => {
      const k = key == null ? i : key + (param instanceof Array ? `[${i}]` : `.i`);
      paramStr += urlEncode(param[i], k, encode);
    });
  }
  return paramStr.substr(1);
};

export const parseFunc = func => {
  if (isFunction(func)) {
    console.log('function');
    return func.toString();
  } else if (isObject(func)) {
    console.log('object');
    return JSON.stringify(func).replace(/,/g, ',\n ');
  }
  return func;
};

export const loopPrint = link => {
  // 需要更多的内容
  const pwin = window.open(link, 'print'); // 如果是本地测试，需要先新建Print.htm，如果是在域中使用，则不需要
  // // pwin.document.write(printStr);
  // pwin.document.close();// 这句很重要，没有就无法实现
  pwin.print();
};
