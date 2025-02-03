<template>
  <div class="container mx-auto p-4">
    <h1 class="text-4xl font-bold mb-4">Results</h1>
    <p>Your core insight is: <strong>{{ coreInsight }}</strong></p>
    <router-link to="/" class="btn btn-primary">Restart</router-link>
  </div>
</template>

<script setup>
import { useStore } from '../store';

const store = useStore();
const coreInsight = store.coreInsight;
</script>

<style scoped>
</style>
