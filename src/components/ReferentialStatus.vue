<script setup lang="ts">
import { useReferentialStore } from '@/stores/referential';
import { computed } from 'vue';

const referential = useReferentialStore();
const status = computed(() => referential.status);
</script>

<template>
    <span>Status: {{ status }}</span>
</template>

<style scoped>
</style>
