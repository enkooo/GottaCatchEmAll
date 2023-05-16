<script setup>
import { ref } from 'vue';

const emit = defineEmits(['queryChange']);
const searchQuery = ref('');

const handleSearchQueryChange = () => {
	emit('queryChange', searchQuery.value);
};
</script>

<template>
	<input
		type="search"
		id="search"
		placeholder="Search..."
		class="border-2 border-gray-300 rounded-md px-4 py-2"
		v-model="searchQuery"
		@input="handleSearchQueryChange"
	/>
</template>

<style scoped></style>
