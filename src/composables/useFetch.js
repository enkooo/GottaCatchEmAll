import { ref, onMounted } from 'vue';
import axios from 'axios';

export const useFetch = (url) => {
	const data = ref(null);
	const error = ref(null);
	const loading = ref(false);

	const fetchData = async () => {
		loading.value = true;
		try {
			const res = await axios.get(url);
			data.value = res.data;
		} catch (err) {
			error.value = err.message;
		} finally {
			loading.value = false;
		}

		onMounted(() => {
			fetchData();
		});

		return { data, error, loading };
	};
};
