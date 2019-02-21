import lodash from 'lodash';
import React from 'react';
import moment from 'moment';
import * as reactRouter from 'react-router';
import classNames from 'classnames';
import numeral from 'numeral';
import * as dva from 'dva';
import * as dvaRouter from 'dva/router';
import qs from 'qs';
import dvaFetch from 'dva/fetch';
import axios from 'axios';
import url from 'url';
import pathToRegexp from 'path-to-regexp';
import loadable from 'react-loadable';
import dataSet from '@antv/data-set';
import propTypes from 'prop-types';
import * as createHistory from 'history';
import * as dvaLoading from 'dva-loading';
import setprototypeof from 'setprototypeof';

(() => {
  const cvsEle = document.createElement('canvas');
  document.body.appendChild(cvsEle);
  const svgEle = document.createElement('svg');
  document.body.appendChild(svgEle);
})();

/**
 * https://www.bootcdn.cn/
 https://cdn.bootcss.com/jquery/3.3.1/jquery.min.js
 https://cdn.bootcss.com/lozad.js/1.4.0/lozad.js
 https://cdn.bootcss.com/redux/4.0.0/redux.js
 https://cdn.bootcss.com/redux-saga/1.0.0-beta.1/redux-saga.js
 https://cdn.bootcss.com/impress.js/0.5.3/impress.js
 https://cdn.bootcss.com/require.js/2.3.5/require.js
 https://cdn.bootcss.com/d3/4.13.0/d3.js
 https://cdn.bootcss.com/velocity/2.0.4/velocity.js
 https://cdn.bootcss.com/three.js/92/three.js
 https://d3js.org/d3.v3.js
 */
export const frames = {
  window,
  console,
  lodash,
  react: React,
  reactRouter,
  moment,
  classNames,
  numeral,
  dva,
  dvaRouter,
  dvaFetch,
  dvaLoading,
  createHistory,
  axios,
  qs,
  url,
  pathToRegexp,
  loadable,
  dataSet,
  propTypes,
  audioContext: (() => {
    const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    return {
      default: audioCtx,
      oscillator: audioCtx.createOscillator(),
      gainNode: audioCtx.createGain(),
    };
  })(),
  canvas: (() => {
    const cvs = document.getElementsByTagName('canvas')[0];
    return { default: cvs, getContext: cvs.getContext('2d') };
  })(),
  canvasGL: (() => {
    const cvs = document.createElement('canvas');
    return {
      default: cvs,
      getContext: cvs.getContext('webgl') || cvs.getContext('experimental-webgl'),
    };
  })(),
  canvasGL2: (() => {
    const cvs = document.createElement('canvas');
    return { default: cvs, getContext: cvs.getContext('webgl2') };
  })(),
  svg: (() => {
    const svg = document.getElementsByTagName('svg')[0];
    return { default: svg };
  })(),
  setprototypeof: { default: setprototypeof },
  string: (() => {
    const a = 'beth';
    return { default: a };
  })(),
  array: (() => {
    const a = ['beth'];
    return { default: a };
  })(),
  object: (() => {
    const a = { name: 'beth' };
    return { default: a };
  })(),
  number: (() => {
    const a = 100;
    return { default: a };
  })(),
  math: { default: window.Math },
  regexp: { default: window.RegExp },
  date: { default: new Date() },
};

export const markdownStyle = [
  'marxico',
  'markdown',
  'markdown-black',
  'markdown-alt',
  'markdown1',
  'markdown2',
  'markdown3',
  'markdown4',
  'markdown5',
  'markdown6',
  'markdown7',
  'markdown8',
  'markdown9',
  'markdown10',
  'avenir-white',
  'foghorn',
  'screen',
  'swiss',
];
