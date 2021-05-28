import _ from 'lodash';
import {IRoute} from 'umi';
import LocalRoutes from '../config/routes';

const getAccess = (routes: IRoute[]): string[] => {
  return _.chain(routes)
    .map((menu) => {
      if (menu.routes)
        return _.flatten([menu.access, getAccess(menu.routes)]);
      return [menu.access];
    })
    .flatten()
    .compact()
    .value();
}

export default function access(initialState: {routes: string[]}) {
  return getAccess(LocalRoutes).reduce((res, route) => {
    return {
      ...res,
      [route]: initialState.routes.includes(route),
    }
  }, {});
}
