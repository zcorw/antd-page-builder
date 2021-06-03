import { useState } from 'react';
/**
 * 保存钩子
 * 函数返回两个值 loading 和 save,
 * loading 会告知当前接口状态，true 为正在请求，false 为请求还未开始或请求结束
 * save 对 submit 封装后的函数，如果要使用 loading，请使用该函数
 * @param submit 提交保存的接口函数
 * @returns {loading, save}
 */
const useSave = (submit: () => Promise<void>) => {
  const [loading, setLoading] = useState<boolean>(false);

  const handleSubmit = async () => {
    if (loading) {
      return false;
    }
    setLoading(true);
    try {
      await submit();
    } catch (e) {
      console.error(e);
    }
    setLoading(false)
    return true;
  }

  return { loading, save: handleSubmit };
}

export default useSave;
