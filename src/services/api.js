import { stringify } from 'qs';
import assign from 'lodash/assign';
import request, { get, post } from '../utils/request';
import config from '../common/config';

export const queryAllList = data =>
  get({
    url: '/api/common/gets',
    data: {
      ...data,
      token: config.token,
    },
  });

export async function queryDetail(data) {
  return get({
    url: '/api/common/get',
    data: assign(data, {
      token: config.token,
    }),
  });
}

export async function createItem(data) {
  return post({
    url: `/api/common/post?${stringify({
      token: config.token,
      sql: data.sql,
    })}`,
    data,
  });
}

export async function createList(data) {
  return post({
    url: `/api/common/posts?${stringify({
      token: config.token,
      sql: data.sql,
    })}`,
    data,
  });
}

export async function updateDetail(data) {
  return post({
    url: `/api/common/update?${stringify({
      token: config.token,
      sql: data.sql,
    })}`,
    data,
  });
}

export async function deleteItem(data) {
  return post({
    url: `/api/common/delete?${stringify({
      token: config.token,
      sql: data.sql,
    })}`,
    data,
  });
}

export async function queryProjectNotice() {
  return request('/api/project/notice');
}

export async function queryActivities() {
  return request('/api/activities');
}

export async function queryRule(params) {
  return request(`/api/rule?${stringify(params)}`);
}

export async function removeRule(params) {
  return request('/api/rule', {
    method: 'POST',
    body: {
      ...params,
      method: 'delete',
    },
  });
}

export async function addRule(params) {
  return request('/api/rule', {
    method: 'POST',
    body: {
      ...params,
      method: 'post',
    },
  });
}

export async function fakeSubmitForm(params) {
  return request('/api/forms', {
    method: 'POST',
    body: params,
  });
}

export async function fakeChartData() {
  return request('/api/fake_chart_data');
}

export async function queryTags() {
  return request('/api/tags');
}

export async function queryBasicProfile() {
  return request('/api/profile/basic');
}

export async function queryAdvancedProfile() {
  return request('/api/profile/advanced');
}

export async function queryFakeList(params) {
  return request(`/api/fake_list?${stringify(params)}`);
}

export async function fakeAccountLogin(params) {
  return request('/api/login/account', {
    method: 'POST',
    body: params,
  });
}

export async function fakeRegister(params) {
  return request('/api/register', {
    method: 'POST',
    body: params,
  });
}

export async function queryNotices() {
  return request('/api/notices');
}
