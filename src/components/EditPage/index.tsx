import React, { useContext } from 'react';
import { PageContainer, RouteContext } from '@ant-design/pro-layout';
import { Button } from 'antd';
import { history, IRoute } from 'umi';
import { PageContainerProps } from '@ant-design/pro-layout';
import useSave from '@/hooks/useSave';

export type propsType = {
  /** 头部额外内容 */
  extraContent?: React.ReactNode | ((node: React.ReactNode) => React.ReactNode);
  /** 页面路由信息 */
  route?: IRoute;
  /** 页面标题 */
  title?: React.ReactNode;
  /** 确认 */
  submit?: () => Promise<void>;
  /** 取消 */
  cancel?: () => void;
  /** 标签 */
  tabList?: PageContainerProps['tabList'];
  /** 切换面板的回调 */
  onTabChange?: (key: string) => void;
  /** 当前高亮的标签 */
  tabActiveKey?: string;
  /** 确认按钮文本 */
  saveText?: string;
}

const EditPage: React.FC<propsType> = (props) => {
  const { extraContent, route, submit, cancel, title, saveText, ...p } = props;
  const {pageTitleInfo: menu} = useContext(RouteContext);
  const {loading, save} = useSave(submit || Promise.resolve);
  const handleCallBack = () => {
    if (cancel) {
      cancel()
    } else {
      history.goBack()
    }
  }
  const buttons = (
    <>
      {submit && <Button type="primary" shape="round" onClick={save} loading={loading}>{saveText || '保存'}</Button>}
      <Button shape="round" onClick={handleCallBack}>返回</Button>
    </>
  )
  const headerTitle = title === undefined ? menu?.pageName || route?.name : title;
  const extra = () => {
    if (extraContent) {
      if (typeof extraContent === 'function') {
        return extraContent(buttons);
      }
      return extraContent;
    }
    return buttons;
  }
  return (
    <PageContainer header={{ title: headerTitle, extra: extra() }} {...p}>
      {props.children}
    </PageContainer>
  )
}
export default EditPage;
