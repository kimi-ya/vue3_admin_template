// 通过vue-router插件实现模板路由配置
import { createRouter, createWebHashHistory } from 'vue-router'
import { constantRoute } from './routes'

// 创建路由器
const router = createRouter({
  // 路由模式hash
  history: createWebHashHistory(),
  routes: constantRoute,
  // 滚动行为
  scrollBehavior() {
    return {
      left: 0,
      right: 0,
    }
  },
})

// 重置路由
//退出时重置路由，防止切换角色后还能访问另一个角色的权限
export function resetRouter() {
  const routers = router.getRoutes()
  const arr: string[] = []
  constantRoute.forEach((item) => arr.push(item.name))
  routers.map((item: any) => {
    if (!arr.includes(item.name)) {
      router.removeRoute(item.name)
    }
  })
}

export default router
