// 用于自定义路由的设计和转换

const routeMetaKeys = {
  header: true, // 是否展示顶部菜单, 默认为时
  login: false, // 是否需要登录 , 默认为否
  admin: false, // 是否管理员权限 , 默认为否
};

export function routeTransform(routes): any {
  if (!Array.isArray(routes)) {
    return;
  }
  
  routes.forEach((route) => {
    let meta =  route.meta = { ...routeMetaKeys };
    for (let routeKey in route) {
      if (routeKey in routeMetaKeys) {
        meta[routeKey] = route[routeKey];
      }
      
      if(route.children){
        routeTransform(route.children)
      }
    }
  });

  return routes;
}
