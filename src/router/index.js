/* eslint-disable */
import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '../views/Login.vue'
import Home from '../views/Home.vue'
import Welcome from '../views/Welcome.vue'
import Users from '../views/user/Users.vue'
import RoleList from '../views/rights/RoleList.vue'
import Rights from '../views/rights/Rights.vue'
import Goods from '../views/shop/Goods.vue'
import Add from '../views/shop/Add.vue'
import Edit from '../views/shop/Edit.vue'
import Params from '../views/shop/Params.vue'
import Categories from '../views/shop/Categories.vue'

Vue.use(VueRouter)

const routes = [{
    path: '/',
    redirect: '/login'
  },
  {
    path: '/login',
    component: Login
  },
  {
    path: '/home',
    component: Home,
    redirect: '/welcome',
    children: [{
      path: '/welcome',
      component: Welcome
    }, {
      path: '/users',
      component: Users
    }, {
      path: '/roles',
      component: RoleList
    }, {
      path: '/rights',
      component: Rights
    }, {
      path: '/goods',
      component: Goods
    }, {
      path: '/goods/add',
      component: Add
    }, {
      path: '/goods/edit/:goodsId',
      component: Edit,
      props: true
    }, {
      path: '/params',
      component: Params
    }, {
      path: '/categories',
      component: Categories
    }]
  }
]

const router = new VueRouter({
  routes
})

// 挂载路由守卫,判断页面是否有token，没有则跳转到login页面
router.beforeEach((to, from, next) => {
  if (to.path === '/login') return next();
  const token = sessionStorage.getItem('Token');
  if (!token) return next('/login');
  next()

})

export default router
