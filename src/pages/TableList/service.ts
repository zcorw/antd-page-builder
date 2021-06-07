import request from '@/utils/request';
import type { TableListParams, TableListItem } from './data.d';

type ReturnType<T> = {
  list: T[];
  total_count: number;
}

export async function queryRule(params?: PageInfoType): Promise<ReturnType<TableListItem>> {
  return request('/api/rule/list', {
    method: 'post',
    data: params,
  });
}

export async function getRule(id: number): Promise<TableListItem> {
  return request('/api/rule', {
    params: {
      id,
    }
  }).then((res) => res.data);
}

export async function removeRule(params: { key: number[] }) {
  return request('/api/rule', {
    method: 'POST',
    data: {
      ...params,
      method: 'delete',
    },
  });
}

export async function addRule(params: TableListItem) {
  return request('/api/rule', {
    method: 'POST',
    data: {
      ...params,
      method: 'post',
    },
  });
}

export async function updateRule(params: TableListParams) {
  return request('/api/rule', {
    method: 'POST',
    data: {
      ...params,
      method: 'update',
    },
  });
}
