import { queryPermission } from '@/services/user';
import _ from 'lodash';
import { IRoute } from 'umi';
import { menuRemoteToLoacl } from '@/utils/utils';

type MenuType = (IRoute & { route_name: string, children?: MenuType[] });

const routeName = (menus: MenuType[]): string[] => {
  return _.chain(menus)
    .map((menu) => {
      if (menu.children)
        return _.flatten([menu.route_name, routeName(menu.children)]);
      return [menu.route_name];
    })
    .flatten()
    .value();
}

export async function getInitialState() {
  let remoteMenu: MenuType[] = [];
  try {
      // 后续可以在这里增加一个登录验证判断，登录后才执行
      const menus = await queryPermission();
      remoteMenu = menuRemoteToLoacl<RemoteMenuType, MenuType>(menus, (item) => {
        return {
          id: item.id,
          route_name: item.route_name,
        }
      });
  } catch(e) {
    remoteMenu = [];
  }
  return {
    routes: routeName(remoteMenu)
  };
}
