import { Modal, message } from 'antd';
import * as notification from '@/utils/notification';

function confirm(content: string, request:() => Promise<any>): Promise<number> {
  return new Promise((resolve) => {
    Modal.confirm({
      content,
      onOk() {
        request().then(() => {
          notification.success(`删除成功`);
          resolve(1);
        });
      },
      onCancel() {
        resolve(0)
      }
    });
  })
}

export function remove<T = number>(item: {id: T, name: string}, request: (id: typeof item['id']) => Promise<any>, content?: string): Promise<number> {
  return confirm(content || `确定要删除${item.name}该条记录吗`, () => request(item.id));
}

export function batchRemove(ids: (number | string)[], request: (id: (number | string)[]) => Promise<any>, content?: string): Promise<number> {
  return confirm(content || `确定要删除被选中的记录吗`, () => request(ids));
}
