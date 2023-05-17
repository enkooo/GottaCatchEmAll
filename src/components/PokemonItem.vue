<script setup>
import { onMounted, ref, watch } from 'vue';
import { useAxios } from '../composables/useAxios';

const { fetchData } = useAxios();

const props = defineProps({
	name: String,
	imageUrl: String,
	abilities: Array,
	isRemovable: Boolean,
});

const emit = defineEmits(['pokemonSave']);

const abilitiesDetails = ref([]);

const fetchAbilityDetails = async (ability) => {
	const response = await fetchData(`https://pokeapi.co/api/v2/ability/${ability.ability.name}`);
	if (response) {
		return response;
	}
};

const fetchAllAbilities = async () => {
	const abilitiesPromises = props.abilities.map(fetchAbilityDetails);
	abilitiesDetails.value = await Promise.all(abilitiesPromises);
};

onMounted(async () => {
	await fetchAllAbilities();
});

watch(
	() => props.abilities,
	async () => {
		await fetchAllAbilities();
	}
);

const handlePokemonSave = () => {
	emit('pokemonSave', props.name);
};

const handlePokemonRemove = () => {
	emit('pokemonRemove', props.name);
};
</script>

<template>
	<div class="flex flex-col items-center gap-2 shadow-lg p-8 bg-white rounded-lg">
		<img :src="props.imageUrl" alt="Pokemon Image" />
		<h2 class="font-bold">{{ props.name.toUpperCase() }}</h2>
		<div>
			<h3 class="text-center">Abilities:</h3>
			<ul class="text-gray-500">
				<li class="text-center tooltip" v-for="(ability, index) in props.abilities">
					{{ ability.ability.name }}
					<span class="tooltiptext">{{ abilitiesDetails[index]?.effect_entries[1]?.short_effect }}</span>
				</li>
			</ul>
		</div>
		<button
			v-if="!isRemovable"
			class="bg-blue-600 text-white px-4 py-1 rounded-2xl hover:bg-blue-800 mt-auto"
			@click="handlePokemonSave"
		>
			Save in Pokedex
		</button>
		<button
			v-else
			class="bg-blue-600 text-white px-4 py-1 rounded-2xl hover:bg-blue-800 mt-auto"
			@click="handlePokemonRemove"
		>
			Remove from Pokedex
		</button>
	</div>
</template>

<style scoped>
.tooltip {
	position: relative;
	display: block;
}

.tooltip .tooltiptext {
	visibility: hidden;
	width: 120px;
	background-color: #808080;
	color: #fff;
	text-align: center;
	border-radius: 6px;
	padding: 5px;

	position: absolute;
	width: 120px;
	bottom: 100%;
	left: 50%;
	margin-left: -60px;
}

.tooltip:hover .tooltiptext {
	visibility: visible;
}
</style>
