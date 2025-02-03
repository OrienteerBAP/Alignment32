<template>
  <div class="container mx-auto p-4">
    <h1 class="text-4xl font-bold mb-4">Test Page</h1>
    <WordInput v-if="step === 1" />
    <WordMerge v-else />
  </div>
</template>

<script setup>
import { ref } from 'vue';
import WordInput from '../components/WordInput.vue';
import WordMerge from '../components/WordMerge.vue';

const step = ref(1);
</script>

<style scoped>
</style>
