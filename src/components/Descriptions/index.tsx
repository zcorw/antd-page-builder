import React from 'react';
import { Descriptions as AntdDescriptions } from 'antd';
import {DescriptionsProps} from 'antd/lib/descriptions';

const { Item } = AntdDescriptions;

export type ItemType<T> = {
  key: string;
  label: string;
  render?: (value: any, record: Partial<T>) => React.ReactNode;
  span?: number;
  defaultValue?: any;
}

type propsType<T> = DescriptionsProps & {
  /**
   * @name itemColumns 字段配置
   */
  itemColumns: ItemType<T>[];
  value?: T;
  /**
   * 单字段占用宽度，详见 https://ant.design/components/descriptions-cn/#DescriptionItem 中 span 字段
   */
  span?: number;
}

const ItemRender = <T extends object>(props: { value: any, record?: T, render?: (value: any, record: T) => React.ReactNode }) => {
  // eslint-disable-next-line no-nested-ternary
  return props.render ? props.render(props.value, props.record || {}) : props.value === undefined ? null : props.value;
}

/**
 * 详情组件
 */
const Descriptions = <T extends object>(props: propsType<T>) => {
  const {itemColumns, value, ...p} = props;
  return (
    <AntdDescriptions {...p}>
      {
        itemColumns.map(item => (
          <Item key={item.key} label={item.label} span={item.span || props.span}>
            <ItemRender value={value?.[item.key] === undefined ? item.defaultValue : value[item.key]} record={value} render={item.render} />
          </Item>
        ))
      }
    </AntdDescriptions>
  )
}

export default Descriptions;
