<script setup lang="ts">
import { referentialStore } from '@/stores/referential';

const status = referentialStore().status;
</script>

<template>
    <span>Status: {{ status }}</span>
</template>

<style scoped>
</style>
