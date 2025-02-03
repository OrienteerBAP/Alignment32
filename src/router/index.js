
import { createRouter, createWebHistory } from 'vue-router';
import HomePage from '../pages/HomePage.vue';
import TestPage from '../pages/TestPage.vue';
import ResultsPage from '../pages/ResultsPage.vue';

const routes = [
  { path: '/', component: HomePage },
  { path: '/test', component: TestPage },
  { path: '/results', component: ResultsPage },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;