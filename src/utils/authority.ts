import { MenuDataItem } from '@ant-design/pro-layout';
import {IRoute} from 'umi';
import routes from '../../config/routes';

export type authMenu = {
  route_name: string;
  children?: authMenu[];
}

export type routeMenu = MenuDataItem & {
  isTop?: boolean;
  parent?: string;
  route_name: string;
  children?: routeMenu[];
}

const routeAccess = new Map();
const setAccess = (cRoutes: IRoute[]) => {
  cRoutes.forEach((route) => {
    if (route.routes) {
      setAccess(route.routes);
    }
    if (route.access) {
      routeAccess.set(route.path, route.access);
    }
  })
}
setAccess(routes);
export const searchAccess: (pathname: string) => (string | undefined) = (pathname) => {
  return routeAccess.get(pathname);
}

export function setAuthority(authority: string | string[]): void {
  const proAuthority = typeof authority === 'string' ? [authority] : authority;
  localStorage.setItem('antd-pro-authority', JSON.stringify(proAuthority));
}