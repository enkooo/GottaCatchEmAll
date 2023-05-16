import axios from 'axios';
import { ref } from 'vue';

export function useAxios() {
	const isLoading = ref(false);
	const hasError = ref(false);

	const fetchData = async (url) => {
		isLoading.value = true;
		hasError.value = false;

		try {
			const response = await axios.get(url);
			return response.data;
		} catch (err) {
			hasError.value = true;
		} finally {
			isLoading.value = false;
		}
	};

	return {
		isLoading,
		hasError,
		fetchData,
	};
}
