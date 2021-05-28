# Ant Design Pro 模板
## 权限
权限控制使用了 [@umijs/plugin-access](https://umijs.org/zh-CN/plugins/plugin-access) 插件
- src/app.ts 拉取权限数据
- src/access.ts 组织数据，后续在组件中用 useAccess() 获取