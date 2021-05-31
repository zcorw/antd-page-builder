/**
 * 该部分为 protable 的 search 数据与接口筛选数据的封装方法，要根据实际项目进行修改
 */
import _ from 'lodash';
import moment, { Moment } from 'moment';

/** 下拉选择 */
const selectFunc = (value: any, key: string): Required<PageInfoType>['conditions'] => {
  return [{
    field_name: key,
    field_type: 'select',
    type: 1,
    value,
  }];
}
/** 关键词 */
const keywordFunc = (value: string, key: string): Required<PageInfoType>['conditions'] => {
  const keys = key.split(',');
  return keys.map((k) => ({
    field_name: k,
    field_type: 'text',
    type: 3,
    value,
  }));
}
/** 级联 */
const splitFunc = (value: {value: any, label: string}[], key: string): Required<PageInfoType>['conditions'] => {
  const keys = key.split(',');
  const vals = _.map(value, 'value');
  return vals.map((v, i) => ({
    field_name: keys[i],
    field_type: 'text',
    type: 1,
    value: v,
  }));
}
/** 日期范围选择 */
const dateRangeFunc = (value: string[], key: string): Required<PageInfoType>['conditions'] => {
  return [{
    field_name: key,
    field_type: 'date',
    type: 7,
    value: value[0],
  },
  {
    field_name: key,
    field_type: 'date',
    type: 9,
    value: value[1],
  }]
}
/** 开始日期 */
const startDateFunc = (value: string, key: string): Required<PageInfoType>['conditions'] => {
  return [{
    field_name: key,
    field_type: 'date',
    type: 7,
    value,
  }]
}
/** 结束日期 */
const endDateFunc = (value: string, key: string): Required<PageInfoType>['conditions'] => {
  return [{
    field_name: key,
    field_type: 'date',
    type: 9,
    value,
  }]
}
/** 日期选择 */
const dateFunc = (value: number, key: string): Required<PageInfoType>['conditions'] => {
  return [{
    field_name: key,
    field_type: 'date',
    type: 1,
    value,
  }]
}


export const select = (value: any, key: any): Required<PageInfoType>['conditions'] => {
  return selectFunc(value, key);
}

export const keyword = (value: any, key: any): Required<PageInfoType>['conditions'] => {
  return keywordFunc(value, key);
}

export const split = (value: any, key: any): Required<PageInfoType>['conditions'] => {
  return splitFunc(value, key);
}

export const startDate = (value: any, key: any, props: any): Required<PageInfoType>['conditions'] => {
  return startDateFunc(props?.format ? moment(value).format(props.format) : `${moment(value).format('YYYY-MM-DD')} 00:00:00`, key);
}

export const endDate = (value: any, key: any, props: any): Required<PageInfoType>['conditions'] => {
  return endDateFunc(props?.format ? moment(value).format(props.format) : `${moment(value).format('YYYY-MM-DD')} 23:59:59`, key);
}

export const dateRange = (value: any, key: any, props: any): Required<PageInfoType>['conditions'] => {
  return dateRangeFunc(value.map((time: Moment, i: number) => {
    if (i === 0) {
      return props?.format ? moment(value).format(props.format) : `${moment(time).format('YYYY-MM-DD')} 00:00:00`;
    }
    return props?.format ? moment(value).format(props.format) : `${moment(time).format('YYYY-MM-DD')} 23:59:59`;
  }), key);
}

export const dateMonth = (value: any, key: any): Required<PageInfoType>['conditions'] => {
  return dateFunc(+moment(value).format('YYYYMM'), key);
}
