<script setup>
import { ref } from 'vue';
import { useAxios } from '../composables/useAxios';
import SearchInput from './SearchInput.vue';

const searchQuery = ref('');
const pokemonData = ref(null);
const evolutionData = ref([]);
const allPokemonData = ref([]);
const { isLoading, hasError, fetchData } = useAxios();

const handleSearchQueryChange = (value) => {
	searchQuery.value = value;
};

const fetchPokemon = async () => {
	if (searchQuery.value === '') return;

	const response = await fetchData(`https://pokeapi.co/api/v2/pokemon/${searchQuery.value.toLowerCase()}`);

	pokemonData.value = response;

	const speciesUrl = response.species.url;
	const speciesResponse = await fetchData(speciesUrl);
	if (!speciesResponse) return;

	const evolutionChainUrl = speciesResponse.evolution_chain.url;
	const evolutionChainResponse = await fetchData(evolutionChainUrl);
	if (!evolutionChainResponse) return;

	evolutionData.value = extractEvolutions(evolutionChainResponse.chain);

	await fetchAllPokemonData(evolutionData.value);

	searchQuery.value = '';
};

const extractEvolutions = (chain) => {
	const evolutions = [];

	const traverseChain = (chain) => {
		evolutions.push(chain.species.name);
		if (chain.evolves_to.length > 0) {
			chain.evolves_to.forEach((evolution) => {
				traverseChain(evolution);
			});
		}
	};

	traverseChain(chain);

	return evolutions;
};

const fetchAllPokemonData = async (evolutionNames) => {
	const pokemonPromises = evolutionNames.map(async (name) => {
		const response = await fetchData(`https://pokeapi.co/api/v2/pokemon/${name}`);
		if (response) {
			return response;
		}
	});

	allPokemonData.value = await Promise.all(pokemonPromises);
};
</script>

<template>
	<div class="flex flex-col justify-center items-center h-screen">
		<h1 class="font-bold text-3xl m-5">Gotta Catch 'em All!</h1>
		<div class="flex gap-1">
			<SearchInput @queryChange="handleSearchQueryChange" class="w-96" />
			<button class="bg-blue-600 rounded-md px-8 py-2 text-white" @click="fetchPokemon">Search</button>
		</div>
		<div class="min-h-[500px]">
			<div v-if="isLoading">Loading...</div>
			<div v-else-if="hasError">Error occurred while fetching data.</div>

			<div v-else-if="allPokemonData">
				<div class="flex">
					<div v-for="pokemon in allPokemonData">
						<h2>{{ pokemon.name }}</h2>
						<img :src="pokemon.sprites.front_default" alt="Pokemon Image" />
					</div>
				</div>
			</div>
		</div>
	</div>
</template>
