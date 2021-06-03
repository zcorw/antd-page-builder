import React from 'react';
import { Modal, Form, Button, Typography, Row, Col } from 'antd';
import FileUpload from '@/components/FileUpload';
import { downloadFile } from '@/utils/utils';
import * as notification from '@/utils/notification';

export type propsType = {
  buttons: {
    action: string;
    title: string;
    icon?: React.ReactNode;
    data?: object;
  }[];
  fileLink: string;
  visible?: boolean;
  description?: React.ReactNode;
  onSubmit?: (data: any) => void;
  onError?: (message: string) => void;
  onClose?: (ok: boolean) => void;
  onSuccess?: (...args: any[]) => void;
}

const ImportModal: React.FC<propsType> = (props) => {
  const done = () => {
    notification.success('文件导入成功')
  }
  const error = (msg: string) => {
    notification.html('导入错误', msg);
    props.onError?.(msg);
  }
  const download = async () => {
    const url = /^http/.test(props.fileLink) ? props.fileLink : `${HOST}${props.fileLink.replace(/^\//, '')}`;
    downloadFile(url);
  }
  return (
    <Modal
      title="导入"
      visible={props.visible === undefined ? true : props.visible}
      onCancel={() => props.onClose?.(false)}
      onOk={() => props.onClose?.(true)}
      width={800}
      destroyOnClose>
      <Row justify="center">
        <Col span={16}>
          <Form.Item label="选择文件">
            {
              props.buttons.map(btn => (
                <Form.Item style={{ display: 'inline-block', marginRight: 20, marginBottom: 0 }}>
                  <FileUpload icon={btn.icon} action={btn.action} data={btn.data} title={btn.title} done={props.onSubmit || done} error={error} />
                </Form.Item>
              ))
            }
          </Form.Item>
        </Col>
        <Col offset={2} span={14}>
          <div>{props.description}</div>
          <Button type="link" onClick={download}>下载模板</Button>
        </Col>
      </Row>
    </Modal>
  )
}

export default ImportModal;
