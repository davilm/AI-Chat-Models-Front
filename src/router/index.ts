import { createRouter, createWebHashHistory } from 'vue-router'
import ChatView from '../views/ChatView.vue'

const router = createRouter({
  history: createWebHashHistory(), // hash mode → funciona na Hostinger sem config extra
  routes: [
    { path: '/', component: ChatView },
  ],
})

export default router
