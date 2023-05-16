<script setup>
import ToastListItem from './ToastListItem.vue';
import { toastState } from '../stores/toastStore';

const handleRemoveToast = (toast) => {
	const index = toastState.items.indexOf(toast);
	toastState.items.splice(index, 1);
};
</script>

<template>
	<TransitionGroup
		tag="div"
		enter-from-class="translate-x-full opacity-0"
		enter-active-class="duration-500"
		leave-active-class="duration-500"
		leave-to-class="translate-x-full opacity-0"
		class="fixed top-4 right-4 z-50 w-full max-w-xs space-y-4"
	>
		<ToastListItem
			v-for="(toast, index) in toastState.items"
			:key="toast.key"
			:message="toast.message"
			:type="toast.type"
			@remove-toast="handleRemoveToast(toast)"
		/>
	</TransitionGroup>
</template>

<style scoped></style>
