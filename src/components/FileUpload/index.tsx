import React from 'react';
import { Upload, Button, message } from 'antd';
import { UploadChangeParam } from 'antd/lib/upload';
import { getToken } from '@/utils/authToken';
import {APIHOST as HOST} from '@/utils/request';

type propsType = {
  icon?: React.ReactNode;
  title: string;
  action: string;
  data?: object;
  done?: (data: any) => void;
  error?: (message: string) => void;
}

const FileUpload: React.FC<propsType> = (props) => {
  const token = getToken();
  const onChange = (info: UploadChangeParam) => {
    if (info.file.status === 'done') {
      if (info.file.response.code !== 0) {
        props.error?.(info.file.response.message);
        return undefined;
      }
      if (info.file.response.data?.error_msg) {
        props.error?.(info.file.response.data.error_msg);
        return undefined;
      }
      props.done?.(info.file.response.data);
    } else if (info.file.status === 'error') {
      props.error?.(info.file.response.error.message);
    }
  }
  return (
    <Upload action={`${HOST}${props.action}`} data={props.data} headers={{ Authorization: token || '' }} onChange={onChange}>
      <Button icon={props.icon}>{props.title}</Button>
    </Upload>
  )
}

export default FileUpload
