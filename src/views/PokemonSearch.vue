<script setup>
import { ref } from 'vue';
import { useAxios } from '../composables/useAxios';
import SearchInput from '../components/SearchInput.vue';
import PokemonItem from '../components/PokemonItem.vue';
import Loader from '../components/Loader.vue';
import { toastState } from '../stores/toastStore';

const searchQuery = ref('');
const pokemonData = ref(null);
const evolutionData = ref([]);
const allPokemonData = ref([]);

const { isLoading, hasError, fetchData } = useAxios();

const handleSearchQueryChange = (value) => {
	searchQuery.value = value;
};

const fetchPokemonData = async () => {
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

const handlePokemonSave = (name) => {
	const pokemonList = JSON.parse(localStorage.getItem('pokemonList')) ?? [];

	if (pokemonList.includes(name)) {
		toastState.items.unshift({
			key: Symbol(),
			message: 'Pokemon is already in your Pokedex!',
			type: 'error',
		});
		return;
	}

	pokemonList.push(name);
	localStorage.setItem('pokemonList', JSON.stringify(pokemonList));

	toastState.items.unshift({
		key: Symbol(),
		message: 'Pokemon has been added to your Pokedex!',
		type: 'success',
	});
};
</script>

<template>
	<div class="flex flex-col justify-center items-center">
		<h1 class="font-bold text-3xl m-5">Gotta Catch 'em All!</h1>
		<div class="flex gap-1">
			<SearchInput @queryChange="handleSearchQueryChange" class="w-96" @keyup.enter="fetchPokemonData" />
			<button
				class="bg-blue-600 rounded-md px-12 py-2 text-white hover:bg-blue-800 hidden md:block"
				@click="fetchPokemonData"
			>
				Search
			</button>
		</div>
		<div class="min-h-[400px] flex justify-center items-center">
			<div v-if="!allPokemonData.length && !isLoading && !hasError" class="self-start mt-10">
				<p>Search for a Pokemon to see its details and evolution chain.</p>
				<p>For example, try searching for 'pikachu'.</p>
			</div>

			<Loader v-if="isLoading" />
			<div v-else-if="hasError" class="self-start mt-10">
				<p>Error occurred while fetching data.</p>
				<p>Try again!</p>
			</div>

			<div v-else-if="allPokemonData.length">
				<div class="flex gap-10 flex-wrap justify-center my-5 max-w-7xl">
					<PokemonItem
						v-for="pokemon in allPokemonData"
						:name="pokemon.name"
						:imageUrl="pokemon.sprites.front_default"
						:abilities="pokemon.abilities"
						@pokemon-save="handlePokemonSave"
					/>
				</div>
			</div>
		</div>
	</div>
</template>
