import React from 'react';
import {remove} from '@/utils/remove';

type propsType<T> = {
  id: T;
  name: string;
  tableRef: React.MutableRefObject<{reload: () => void} | undefined>;
  fetch: (id: T) => Promise<void>;
}

const Del = <T extends any = number>(props: propsType<T>): React.ReactElement => {
  const clickHandle = async () => {
    await remove({id: props.id, name: props.name}, props.fetch);
    props.tableRef.current?.reload();
  }
  return <a key="delete" onClick={clickHandle}>删除</a>;
}

export default Del;
