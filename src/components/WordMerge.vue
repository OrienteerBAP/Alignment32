<template>
  <div>
    <h2 class="text-2xl font-bold mb-4">Step 2: Merge Words</h2>
    <div v-for="(pair, index) in pairs" :key="index" class="mb-4">
      <div class="flex justify-between">
        <span>{{ pair[0] }}</span>
        <span>{{ pair[1] }}</span>
      </div>
      <input type="text" class="input" v-model="mergedWords[index]" />
    </div>
    <button @click="mergeWords" class="btn btn-primary">Next</button>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useStore } from '../store';

const store = useStore();
const pairs = ref(store.getPairs());
const mergedWords = ref(Array(pairs.value.length).fill(''));

const mergeWords = () => {
  store.mergeWords(mergedWords.value);
  // ...existing code to move to the next step...
};
</script>

<style scoped>
// ...existing code...
</style>
