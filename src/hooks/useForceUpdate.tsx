import { useState } from 'react';

/**
 * @desc hook forceUpdate
 * 刷新当前组件
 * @example const forceUpdate = useForceUpdate();
 * forceUpdate()
 */
const useForceUpdate = () => {
  let [_, set$ForceUpdate] = useState({});
  return function forceUpdate() {
    set$ForceUpdate({});
  };
};

export default useForceUpdate;
