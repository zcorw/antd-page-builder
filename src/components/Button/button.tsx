import React from 'react';
import { Button } from 'antd';
import { ButtonProps as AntdProps } from 'antd/lib/button';
import { PlusOutlined, DeleteOutlined, ImportOutlined, ExportOutlined } from '@ant-design/icons';
import { Link } from 'umi';

declare const ButtonTypes: ["add", "delete", "import", "export"];
export type ButtonProps = AntdProps & {
  iconType?: typeof ButtonTypes[number];
}

const getIcon = (type: typeof ButtonTypes[number]): React.ReactNode => {
  switch (type) {
    case 'add':
      return <PlusOutlined />;
    case 'delete':
      return <DeleteOutlined />;
    case 'import':
      return <ImportOutlined />;
    case 'export':
      return <ExportOutlined />;
    default:
      throw new Error(`${type}类型不存在`);
  }
}

export default (props: ButtonProps): React.ReactElement => {
  const { iconType, icon: propsIcon, children, href, ...p } = props;
  let icon: React.ReactNode = propsIcon;
  if (iconType !== undefined) {
    icon = getIcon(iconType);
  }
  const btnDom = <Button shape="round" type="primary" icon={icon} ghost {...p}>{children}</Button>;
  if (href !== undefined) {
    return <Link to={href}>{btnDom}</Link>
  }
  return btnDom
}