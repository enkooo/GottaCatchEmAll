<script setup>
const props = defineProps({
	name: String,
	imageUrl: String,
	abilities: Array,
});
</script>

<template>
	<div class="flex flex-col items-center gap-2 shadow-lg p-8 bg-white rounded-lg">
		<img :src="props.imageUrl" alt="Pokemon Image" />
		<h2 class="font-bold">{{ props.name.toUpperCase() }}</h2>
		<div>
			<h3 class="text-center">Abilities:</h3>
			<ul class="text-gray-500">
				<li class="text-center" v-for="ability in props.abilities">{{ ability.ability.name }}</li>
			</ul>
		</div>
		<button class="bg-blue-600 text-white px-4 py-1 rounded-2xl">Save in Pokedex</button>
	</div>
</template>

<style scoped></style>
