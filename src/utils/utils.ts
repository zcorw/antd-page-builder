import { parse } from 'querystring';

/* eslint no-useless-escape:0 import/prefer-default-export:0 */
const reg = /(((^https?:(?:\/\/)?)(?:[-;:&=\+\$,\w]+@)?[A-Za-z0-9.-]+(?::\d+)?|(?:www.|[-;:&=\+\$,\w]+@)[A-Za-z0-9.-]+)((?:\/[\+~%\/.\w-_]*)?\??(?:[-\+=&;%@.\w_]*)#?(?:[\w]*))?)$/;

export const isUrl = (path: string): boolean => reg.test(path);

export const isAntDesignPro = (): boolean => {
  if (ANT_DESIGN_PRO_ONLY_DO_NOT_USE_IN_YOUR_PRODUCTION === 'site') {
    return true;
  }
  return window.location.hostname === 'preview.pro.ant.design';
};

// For the official demo site, it is used to turn off features that are not needed in the real development environment
export const isAntDesignProOrDev = (): boolean => {
  const { NODE_ENV } = process.env;
  if (NODE_ENV === 'development') {
    return true;
  }
  return isAntDesignPro();
};

export const getPageQuery = () => parse(window.location.href.split('?')[1]);

export const menuRemoteToLoacl = <R extends {children?: R[], pid: number | string},T extends object>(remote: R[], callback: (item: R) => T): T[] => {
  const explain = callback;
  const isIRoute = (item: any): item is T => {
    return item !== undefined;
  }
  const local = remote.map<T>(item => {
    if (item.children === undefined) {
      return {
        ...explain(item),
        isLeaf: true,
        pid: item.pid,
      };
    }
    const children = menuRemoteToLoacl(item.children, callback);
    return {
      ...explain(item),
      isLeaf: false,
      children: children.length > 0 ? children : undefined,
      pid: item.pid,
    }
  });
  return local.filter<T>(isIRoute);
}

let iframe: HTMLIFrameElement;
export const downloadFile = (url: string) => {
  iframe = iframe || document.createElement('iframe');
  iframe.style.display = 'none';
  function iframeLoad() {
    const win = iframe.contentWindow as Window;
    const doc = win.document;
    if (win.location.href === url) {
      if (doc.body.childNodes.length > 0) {
        // response is error
      }
      iframe.parentNode?.removeChild(iframe);
    }
  }
  if ('onload' in iframe) {
    iframe.onload = iframeLoad;
  } else if (iframe.attachEvent) {
    iframe.attachEvent('onload', iframeLoad);
  } else {
    iframe.onreadystatechange = function onreadystatechange() {
      if (iframe.readyState === 'complete') {
        iframeLoad;
      }
    };
  }
  iframe.src = '';
  document.body.appendChild(iframe);

  setTimeout(function loadUrl() {
    iframe.contentWindow.location.href = url;
  }, 50);
}
