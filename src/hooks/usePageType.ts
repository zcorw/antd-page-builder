import { useMemo } from 'react';
import { useLocation } from 'umi';

export default (url?: string) => {
  const { pathname } = useLocation();

  return useMemo(() => {
    return /add(\/?)$/.test(url || pathname) ? 'add' : 'edit';
  }, [url])
}
