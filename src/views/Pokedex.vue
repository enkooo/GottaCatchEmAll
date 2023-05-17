<script setup>
import { ref, onMounted, watch } from 'vue';
import SearchInput from '../components/SearchInput.vue';
import { useAxios } from '../composables/useAxios';
import PokemonItem from '../components/PokemonItem.vue';
import { toastState } from '../stores/toastStore';

const { isLoading, hasError, fetchData } = useAxios();
const allPokemonData = ref([]);
const searchQuery = ref('');
const filteredPokemonList = ref([]);

const handleSearchQueryChange = (value) => {
	searchQuery.value = value;
};

onMounted(async () => {
	const savedPokemon = JSON.parse(localStorage.getItem('pokemonList')) || [];

	await fetchAllPokemonData(savedPokemon);
});

const fetchAllPokemonData = async (pokemonList) => {
	const pokemonPromises = pokemonList.map(async (name) => {
		const response = await fetchData(`https://pokeapi.co/api/v2/pokemon/${name}`);
		if (response) {
			return response;
		}
	});

	allPokemonData.value = await Promise.all(pokemonPromises);
};

const handlePokemonRemove = async (name) => {
	const pokemonList = JSON.parse(localStorage.getItem('pokemonList')) || [];
	const updatedPokemonList = pokemonList.filter((pokemon) => pokemon !== name);
	localStorage.setItem('pokemonList', JSON.stringify(updatedPokemonList));

	await fetchAllPokemonData(updatedPokemonList);

	toastState.items.unshift({
		key: Symbol(),
		message: 'Pokemon has been removed from your Pokedex!',
		type: 'success',
	});
};

const handleFilterPokemonList = () => {
	filteredPokemonList.value = allPokemonData.value.filter((pokemon) => {
		const searchValue = searchQuery.value.toLowerCase();
		return pokemon.name.toLowerCase().includes(searchValue);
	});
};

watch([allPokemonData, searchQuery], handleFilterPokemonList);
</script>

<template>
	<div class="flex flex-col justify-center items-center">
		<h1 class="font-bold text-3xl m-5">Pokedex</h1>
		<div class="flex gap-1">
			<SearchInput @queryChange="handleSearchQueryChange" class="w-96" @input="handleFilterPokemonList" />
		</div>
		<div class="min-h-[400px] flex justify-center items-center">
			<div v-if="!allPokemonData.length && !isLoading && !hasError" class="self-start mt-10">
				<p>Your pokedex is empty.</p>
				<p>Search for a pokemon and add it to your pokedex.</p>
			</div>

			<div v-if="!filteredPokemonList.length && allPokemonData.length" class="self-start mt-10">
				<p>No results found!</p>
			</div>

			<Loader v-if="isLoading" />
			<div v-else-if="hasError" class="self-start mt-10">
				<p>Error occurred while fetching data.</p>
				<p>Try again!</p>
			</div>

			<div v-else-if="filteredPokemonList.length">
				<div class="flex gap-10 flex-wrap justify-center my-5 max-w-7xl">
					<PokemonItem
						v-for="pokemon in filteredPokemonList"
						:name="pokemon.name"
						:imageUrl="pokemon.sprites.front_default"
						:abilities="pokemon.abilities"
						:is-removable="true"
						@pokemon-remove="handlePokemonRemove"
					/>
				</div>
			</div>
		</div>
	</div>
</template>
