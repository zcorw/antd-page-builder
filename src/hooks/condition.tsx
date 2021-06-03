import React, { useMemo, useState } from "react";
import _ from 'lodash';
import moment, { Moment } from "moment";
import {ProSchema} from '@ant-design/pro-utils';
import {SearchType} from '@/components/ListPage';

export const useText = <T extends object>(title: string | React.ReactNode, name: string, placeholder?: string): NonNullable<SearchType<T>>[number] => useMemo(() => ({
  title,
  key: name,
  valueType: 'text',
  placeholder: placeholder || `请输入${title}`,
}), []);

export const useSelect = <T extends object>(title: string | React.ReactNode, key: string, options: Map<number, string | React.ReactNode>): NonNullable<SearchType<T>>[number] => useMemo(() => ({
    title,
    key,
    valueType: 'select',
    valueEnum: options,
  }), []);

export const useRangeDate = <T extends object>(title: string | React.ReactNode, key: string, ranges?: { [key: string]: [Moment, Moment] }): NonNullable<SearchType<T>>[number] => useMemo(() => ({
  title,
  valueType: 'dateRange',
  key,
  fieldProps: {
    ranges: ranges || {
      '近三天': [moment().subtract(3, 'd'), moment()],
      '近一周': [moment().subtract(7, 'd'), moment()],
      '近一个月': [moment().subtract(30, 'd'), moment()],
      '近三个月': [moment().subtract(90, 'd'), moment()],
      '近一年': [moment().subtract(365, 'd'), moment()],
    }
  }
}), []);

export const useMonth = <T extends object>(title: string | React.ReactNode, key: string): NonNullable<SearchType<T>>[number] => useMemo(() => {
  return {
    title,
    key,
    valueType: 'dateMonth',
  };
}, []);
