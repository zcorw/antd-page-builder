/**
 * 列表页
 */

import React from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import type { propsType } from './Table';
import Table from './Table';

export type { ActionType } from './Table';
export type ColunmsType<T> = propsType<T>['columns'];
export type SearchType<T> = propsType<T>['search'];

const ListPage = <T extends any>(props: propsType<T> & { title?: string, extra?: React.ReactNode }) => {
  const { title, extra, ...p } = props;
  return (
    <PageContainer header={{ title, extra }}>
      <Table {...p} />
    </PageContainer>
  )
}

export default ListPage;
