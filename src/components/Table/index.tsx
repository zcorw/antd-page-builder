import React, { useRef, useEffect, useState, useImperativeHandle } from 'react';
import CommonTable, { propsType as CommonPropsType, ActionType as ProCoreActionType } from '../CommonTable';

export { default as BatchButton } from './batchButton';

export type ActionType<T> = ProCoreActionType & {
  getSelectedRows: () => T[];
}

export type propsType<T, U extends {
  [key: string]: any;
} = {}> = Omit<CommonPropsType<T, U>, 'actionRef'> & {
  actionRef?: React.MutableRefObject<ActionType<T> | undefined> | ((actionRef: ActionType<T>) => void);
}

const CheckTable = <T extends object>(props: propsType<T>): React.ReactElement => {
  const actionRef = useRef<ProCoreActionType>({});
  const [selected, setSelected] = useState<T[]>([]);
  const { onSelect, actionRef: propsActionRef, ...p } = props;
  useImperativeHandle(propsActionRef, () => {
    return actionRef.current && Object.assign(
      actionRef.current,
      {getSelectedRows: () => selected})
  }, [actionRef.current, selected]);
  useEffect(() => {
    if (typeof propsActionRef === 'function' && actionRef.current) {
      propsActionRef(actionRef.current && Object.assign(
        actionRef.current,
        {getSelectedRows: () => selected})
      );
    }
  }, [actionRef.current, selected]);

  const handleSelect = (selectedRowKeys: any[], selectedRows: T[]) => {
    setSelected(selectedRows);
    props.onSelect?.(selectedRowKeys, selectedRows);
  }
  return (
    <CommonTable<T>
      {...p}
      actionRef={(current: ProCoreActionType) => {
        Object.assign(actionRef.current, current);
      }}
      rowSelection={props.onSelect && {
        onChange: handleSelect,
      }}
    />
  );
};

export default CheckTable;
