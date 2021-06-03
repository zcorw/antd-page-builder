import React from 'react';
import request from '@/utils/request';
import {downloadFile} from '@/utils/utils';
import Button from './button';

type propsType = {
  action: string;
  params?: any | (() => any);
}

const ExportBtn: React.FC<propsType> = (props) => {
  const onClick = () => {
    request(props.action, {
      method: 'POST',
      data: typeof props.params === 'function' ? props.params() : props.params,
    }).then(res => {
      const url: string = res.file;
      downloadFile(url);
    })
  }
  return <Button iconType="export" onClick={onClick}>导出</Button>
}

export default ExportBtn;
