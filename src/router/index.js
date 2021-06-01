import { createWebHistory, createRouter } from "vue-router";
import Home from '../components/Home.vue'
import Info from '../components/Info.vue'
import Stat from '../components/Stat.vue'
import Settings from '../components/Settings.vue'
import Training from '../components/Training.vue'
import NotFound from '../components/NotFound.vue'

const routes = [
    {
        path: "/",
        name: "Home",
        component: Home,
    },
    {
        path: "/info",
        name: "Info",
        component: Info,
    },
    {
        path: "/stat",
        name: "Stat",
        component: Stat,
    },
    {
        path: "/settings",
        name: "Settings",
        component: Settings,
    },
    {
        path: '/training/:type',
        component: Training,
        name: "Training",
        props: true
    },
    {
        path: "/:catchAll(.*)",
        component: NotFound,
    },
]

const router = createRouter({
    history: createWebHistory(),
    routes,
});

export default router;