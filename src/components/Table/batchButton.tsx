import React, { useEffect, useState } from 'react';
import Button from '@/components/Button';
import { batchRemove as handleRemove } from '@/utils/remove';
import _ from 'lodash';
import {ActionType} from '@ant-design/pro-table'
import { batchDelete as fatch } from './serivces';

type selectedKeys = (number | string)[]

export type actionType = {
  setSelectd: (ids: selectedKeys) => void;
  onSelect: (getId?: (selectedRow: any) => any) => (selectedRowKeys: any[], selectedRows: any[]) => void
}

type commonType = {
  actionRef: React.MutableRefObject<actionType | undefined>;
  tableRef: React.MutableRefObject<ActionType | undefined>;
}

type normalPropsType = commonType & {
  url: string;
};

type customPropsType = commonType & {
  customFetch: (ids: selectedKeys) => Promise<boolean>;
}

type propsType = normalPropsType | customPropsType;

function isCustom(value: any): value is customPropsType {
  return typeof value.customFetch === 'function';
}

const BatchButton: React.FC<propsType> = (props) => {
  const [selected, setSelected] = useState<selectedKeys>([]);
  const handleClick = () => handleRemove(
    selected,
    isCustom(props) ? props.customFetch : _.curry<string, selectedKeys, Promise<boolean>>(fatch)(props.url))
    .then(res => {
      if (res === 1) {
        props.tableRef.current?.reload();
        setSelected([]);
      }
    });
  useEffect(() => {
    if (props.actionRef === undefined) {
      return;
    }
    // eslint-disable-next-line no-param-reassign
    props.actionRef.current = {
      setSelectd(ids) {
        setSelected(ids);
      },
      onSelect(callback) {
        let getId: typeof callback = callback;
        if (callback === undefined) {
          getId = (selectedRow: any) => {
            return selectedRow.id;
          }
        }
        return (selectedRowKeys: any[], selectedRows: any[]) => {
          setSelected(selectedRows.map(getId!));
        }
      }
    }
  }, [props.actionRef]);
  return <Button iconType="delete" disabled={selected.length === 0} onClick={handleClick}>删除</Button>
}

export default BatchButton;
