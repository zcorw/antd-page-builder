import request from '@/utils/request';

export function batchDelete(url: string, ids: (number | string)[]): Promise<boolean> {
  return request(url, {
    method: 'DELETE',
    data: { ids },
  })
}
