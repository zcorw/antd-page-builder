import _ from 'lodash';
import {history, IRoute} from 'umi';
import LocalRoutes from '../../config/routes';

const getPathname = (routes: IRoute[]): {key: string, path: string}[] => {
  return _.chain(routes)
    .map((menu) => {
      if (menu.routes)
        return _.flatten([{key: menu.access, path: menu.path as string}, getPathname(menu.routes)]);
      return [{key: menu.access, path: menu.path as string}];
    })
    .flatten()
    .compact()
    .value();
}

const map = new Map();
getPathname(LocalRoutes).forEach((data) => {
  map.set(data.key, data.path);
});

type historyParams = {query?: {[key: string]: string}, state?: any};

const common = (path: string) => {
  return {
    push(param?: historyParams) {
      history.push({
        pathname: path,
        query: param?.query
      }, param?.state)
    },
    path() {
      return path;
    }
  }
}

export default {
  push: (routeName: string, param?: historyParams) => {
    const pathname = map.get(routeName);
    history.push({
      pathname: pathname || routeName,
      query: param?.query
    }, param?.state)
  },
  path: (routeName: string) => map.get(routeName),
  add: (routeName: string) => common(`${map.get(routeName)}/add`),
  edit: (routeName: string, id: number) => common(`${map.get(routeName)}/edit/${id}`),
  detail: (routeName: string, id: number) => common(`${map.get(routeName)}/detail/${id}`),
  goBack: history.goBack,
}
