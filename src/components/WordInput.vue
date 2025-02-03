<template>
  <div>
    <h2 class="text-2xl font-bold mb-4">Step 1: Enter Words</h2>
    <div v-for="category in categories" :key="category" class="mb-4">
      <h3 class="text-xl font-semibold">{{ category }}</h3>
      <input v-for="n in 8" :key="n" type="text" class="input" v-model="words[category][n-1]" />
    </div>
    <button @click="nextStep" class="btn btn-primary">Next</button>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useStore } from '../store';

const store = useStore();
const categories = ['Physical', 'Mental', 'Emotional', 'Spiritual'];
const words = ref({
  Physical: Array(8).fill(''),
  Mental: Array(8).fill(''),
  Emotional: Array(8).fill(''),
  Spiritual: Array(8).fill(''),
});

const nextStep = () => {
  store.setWords(words.value);
  // ...existing code to move to the next step...
};
</script>

<style scoped>
// ...existing code...
</style>
