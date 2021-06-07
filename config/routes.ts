type RouteType = {
  path: string;
  name: string;
  access?: string;
  icon?: string;
  component: string;
  hideInMenu?: true;
}
declare const PointType: ['add', 'edit', 'detail'];
const pointTitle = {
  add: '添加%s',
  edit: '编辑%s',
  detail: '%s详情',
}
const pointPath = {
  add: '/add',
  edit: '/edit/:id?',
  detail: '/detail/:id?',
}
const pointComponent = {
  add: '/edit',
  edit: '/edit',
  detail: '/detail',
}
const routeCreator = (
  title: string,
  path: string,
  access: string,
  component: string,
  options?: { curd?: { type: typeof PointType[number], name?: string, component?: string }[], icon?: string, title?: string }
): RouteType[] => {
  const routes: RouteType[] = [];
  if (options?.curd) {
    options.curd.forEach(route => routes.push({
      path: `${path}${pointPath[route.type]}`,
      name: route.name || pointTitle[route.type].replace('%s', title),
      component: route.component || `${component}${pointComponent[route.type]}`,
      hideInMenu: true,
    }));
  }
  routes.unshift({
    path,
    name: options?.title || `${title}管理`,
    access,
    component,
    icon: options?.icon,
  });
  return [...routes];
}

export default [
  {
    path: '/',
    component: '../layouts/BlankLayout',
    routes: [
      {
        path: '/user',
        component: '../layouts/UserLayout',
        routes: [
          {
            name: 'login',
            path: '/user/login',
            component: './User/login',
          },
        ],
      },
      {
        path: '/',
        component: '../layouts/SecurityLayout',
        routes: [
          {
            path: '/',
            component: '../layouts/BasicLayout',
            authority: ['admin', 'user'],
            routes: [
              {
                path: '/',
                redirect: '/welcome',
              },
              {
                path: '/welcome',
                name: 'welcome',
                icon: 'smile',
                component: './Welcome',
                access: 'welcome',
              },
              {
                path: '/admin',
                name: 'admin',
                icon: 'crown',
                component: './Admin',
                access: 'admin',
                routes: [
                  {
                    path: '/admin/sub-page',
                    name: 'sub-page',
                    icon: 'smile',
                    component: './Welcome',
                    authority: ['admin'],
                  },
                ],
              },
              ...routeCreator('list.table-list', '/list', 'table', './TableList', {
                curd: [{
                  type: 'detail',
                  name: 'list.table-detail',
                }],
                title: 'list.table-list'
              }
              ),
              {
                component: './404',
              },
            ],
          },
          {
            component: './404',
          },
        ],
      },
    ],
  },
  {
    component: './404',
  },
];
