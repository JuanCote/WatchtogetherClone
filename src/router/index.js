import {createRouter, createWebHistory}  from 'vue-router'
import HomeView from '../views/HomeView.vue'
import RoomView from '../views/RoomView.vue'

const routes = [
    { path: '/', component: HomeView, name: 'Home' },
    { path: '/rooms/:room_id', component: RoomView, name: 'Rooms' }
  ]

const router = createRouter({
    history:createWebHistory(),
    routes
})

export default router
