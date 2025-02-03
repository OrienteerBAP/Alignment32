import { defineStore } from 'pinia';

export const useStore = defineStore('main', {
  state: () => ({
    words: {
      Physical: [],
      Mental: [],
      Emotional: [],
      Spiritual: [],
    },
    coreInsight: '',
  }),
  actions: {
    setWords(words) {
      this.words = words;
    },
    getPairs() {
      // ...existing code to get pairs of words...
    },
    mergeWords(mergedWords) {
      // ...existing code to merge words...
    },
  },
});
