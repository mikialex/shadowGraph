import Vue from 'vue'
import Router from 'vue-router'
import Home from './views/home.vue'
import About from './views/about.vue'
import ParserView from './views/parser-view/parser-view.vue';

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/graph',
      name: 'home',
      component: Home
    },
    {
      path: '/parser',
      name: 'parser',
      component: ParserView
    },
    {
      path: '/about',
      name: 'about',
      component: About
    }
  ]
})
