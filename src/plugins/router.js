import { createRouter, createWebHistory } from 'vue-router';

const routes = [
	{
		path: '',
		name: 'PokemonSearch',
		component: () => import('../views/PokemonSearch.vue'),
	},
	{
		path: '/pokedex',
		name: 'Pokedex',
		component: () => import('../views/Pokedex.vue'),
	},
];

const router = createRouter({
	routes,
	history: createWebHistory('/GottaCatchEmAll/'),
});

export default router;
