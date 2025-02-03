
import { ref } from 'vue';

export function useWordMerge() {
  const words = ref([]);
  const mergedWords = ref([]);

  const mergeWords = (newWords) => {
    mergedWords.value = newWords;
    // ...existing code to handle merging logic...
  };

  return {
    words,
    mergedWords,
    mergeWords,
  };
}