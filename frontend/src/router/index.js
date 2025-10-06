import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '@/views/HomeView.vue'
import FormContainer from '@/components/dialogs/FormContainer.vue'

const routes = [
  { path: '/', component: HomeView },
   { path: '/form', component: FormContainer } 
  
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router
