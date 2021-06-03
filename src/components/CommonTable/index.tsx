import React, { useState, useRef, useImperativeHandle, useEffect } from 'react';
import ProTable, { ProColumns, ProTableProps, ProColumnsValueType, ActionType as TableActionRef } from '@ant-design/pro-table';
import { ListToolBarProps } from '@ant-design/pro-table';
import _ from 'lodash';
import * as filterFun from './filter';

/**
 * 筛选条件类别
 * @enum select 选择
 * @enum split 拆分，根据传入的字段组进行拆分
 * @enum keyword 关键字，模糊查询
 * @enum dateRange 日期范围
 */
declare const filterType: ['select', 'split', 'keyword', 'dateRange', 'startDate', 'endDate'];

export type ActionType = TableActionRef & {
  getFilter: () => conditionsType[];
}

export type propsType<
  T,
  U extends {
    [key: string]: any;
  } = {}
  > = Omit<ProTableProps<T, U>, 'actionRef'> & {
    /** 表单字段 */
    tableColumns: ProColumns<T>[];
    /** 
     * 搜索表单字段 
     * 与 protable 的表单字段相同，扩展了 4 个字段
     * 
     */
    searchColumns?: (ProColumns<T> & { filterType?: typeof filterType[number], filterKey?: string, placeholder?: string, props?: any })[];
    /** 数据请求来源 */
    tableData: (pageInfo: PageInfoType) => Promise<{total_count: number, list: T[]}>;
    /** 扩展按钮 */
    buttons?: { [key: string]: React.ReactNode };
    onSelect?: (selectedRowKeys: any[], selectedRows: T[]) => void;
    /** 接口请求前对筛选条件进行处理 */
    beforFetchData?: (params: any) => { [key: string]: any };
    actionRef?: React.MutableRefObject<ActionType | undefined> | ((actionRef: ActionType) => void);
    sort?: [keyof T, 'ascend' | 'descend'][];
  }

/** 筛选数据转换 */
const filerColumns = (value: any, key: any, type?: typeof filterType[number] | ProColumns['valueType'], props?: any): conditionsType[] => {
  switch (type) {
    case 'select':
      return filterFun.select(value, key);
    case 'keyword':
    case 'text':
      return filterFun.keyword(value, key);
    case 'split':
      return filterFun.split(value, key);
    case 'dateRange':
    case 'dateTimeRange':
      return filterFun.dateRange(value, key, props);
    case 'startDate':
      return filterFun.startDate(value, key, props);
    case 'endDate':
      return filterFun.endDate(value, key, props);
    case 'dateMonth':
      return filterFun.dateMonth(value, key);
    default:
      return filterFun.keyword(value, key);
  }
}
/**
 * 通用表格组件
 * 
 * @param props 
 */
const CommonTable = <T extends {}>(props: propsType<T>): React.ReactElement => {
  const actionRef = useRef<ActionType>();
  const { actionRef: propsActionRef, sort, rowKey = 'id' } = props;
  const [filter, setFileter] = useState<conditionsType[]>();

  useEffect(() => {
    if (typeof propsActionRef === 'function' && actionRef.current) {
      propsActionRef(Object.assign(actionRef.current, { getFilter: () => filter }));
    }
    if (typeof propsActionRef === 'object' && actionRef.current) {
      propsActionRef.current = Object.assign(actionRef.current, { getFilter: () => filter });
    }
  }, [actionRef.current, filter]);
  const {
    onSelect,
    beforFetchData,
    tableColumns: tableCol,
    searchColumns: searchCol,
    tableData,
    buttons,
    ...p
  } = props;
  const tableColumns: ProColumns[] = tableCol.map((item: ProColumns) => ({
    ...item,
    search: false,
  }));
  const searchColumns: ProColumns[] = (searchCol || []).map((item) => ({
    ...item,
    hideInTable: true,
    fieldProps: {
      placeholder: item.placeholder,
      ...item.fieldProps,
    }
  }));
  const columns = searchColumns.concat(tableColumns);
  if (buttons !== undefined) {
    const toolbar: ListToolBarProps = p.toolbar || {};
    p.toolbar = {
      ...toolbar,
      multipleLine: true,
      menu: {
        type: 'inline',
        items: Object.keys(buttons).map((key) => ({
          label: buttons[key],
          key,
        })),
      },
      filter: [],
    };
  }
  const sortFunc = (s: [keyof T, "ascend" | "descend"], a: any, b: any) => {
    if (a[s[0]] === undefined) {
      return 1;
    }
    if (b[s[0]] === undefined) {
      return -1;
    }
    if (typeof a[s[0]] === 'string') {
      const nameA: string = a[s[0]] as any;
      const nameB: string = b[s[0]] as any;
      const ascendSort = () => {
        const upperA = nameA.toLocaleUpperCase();
        const upperB = nameB.toLocaleUpperCase();
        if (upperA < upperB) {
          return -1;
        }
        if (upperA > upperB) {
          return 1;
        }
        return 0
      }
      if (s[1] === 'ascend') {
        return ascendSort();
      }
      return -ascendSort();
    }
    if (typeof a[s[0]] === 'number') {
      const nameA: number = a[s[0]] as any;
      const nameB: number = b[s[0]] as any;
      const ascendSort = () => {
        return nameA - nameB;
      }
      if (s[1] === 'ascend') {
        return ascendSort();
      }
      return -ascendSort();
    }
    return 0;
  }
  /** 数据请求 */
  const request = (params: any, current: number, pageSize: number) => {
    const customParams =
            _.chain(searchCol)
              .map((col) => {
                const { key, dataIndex } = col;
                const colKey = (key || dataIndex) as string;
                return _.isNil(params[colKey]) ? undefined : filerColumns(params[colKey], col.filterKey || colKey, col.filterType || col.valueType, col.props);
              })
              .compact()
              .flatten()
              .value();
          setFileter(customParams);
          return tableData({
            page_info: {
              page: current,
              per_page: pageSize,
            },
            conditions: customParams,
          }).then((res) => {
            const {list} = res;
            if (sort) {
              sort.forEach(s => {
                list.sort((a, b) => sortFunc(s, a, b))
              });
            }
            return {
              data: list,
              success: true,
              total: res.total_count,
              pageSize,
              current,
            };
          });
  }
  return (
    <ProTable<T>
      tableAlertRender={false}
      pagination={{ pageSize: 10 }}
      columns={columns}
      rowSelection={onSelect ? { onChange: onSelect } : undefined}
      request={(params) => {
        const current = params.current || 1;
        const pageSize = params.pageSize || 20;
        if (typeof tableData === 'function') {
          return request(params, current, pageSize);
        }
        throw new Error('tableData type error');
      }}
      rowKey={rowKey}
      search={{
        labelWidth: 120
      }}
      {...p}
      actionRef={(current) => {
        Object.assign(actionRef.current, current);
      }}
    />
  );
};

export default CommonTable;
