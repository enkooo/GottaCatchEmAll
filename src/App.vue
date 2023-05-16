<script setup>
import ToastList from './components/ToastList.vue';
</script>

<template>
	<div class="h-screen">
		<Teleport to="body">
			<ToastList />
		</Teleport>
		<div class="flex justify-center gap-10 p-2">
			<router-link to="/" class="hover:underline">Search Pokemon</router-link>
			<router-link to="/pokedex" class="hover:underline">Pokedex</router-link>
		</div>
		<router-view />
	</div>
</template>

<style scoped></style>
