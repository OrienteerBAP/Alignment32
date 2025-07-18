<template>
  <div class="container mx-auto px-4 py-8">
    <div class="max-w-6xl mx-auto">
      <div class="flex items-center mb-8">
        <button 
          @click="$emit('back')"
          class="mr-4 p-2 rounded-lg bg-gray-200 hover:bg-gray-300 transition-colors"
        >
          ← Back
        </button>
        <h1 class="text-3xl font-bold text-gray-800">Enter Your 32 Words</h1>
      </div>
      
      <div class="bg-white rounded-lg shadow-md p-6 mb-6">
        <p class="text-gray-600 mb-4">
          Enter 8 words for each category. These words should represent different aspects of your life in each dimension.
        </p>
        <div class="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <p class="text-sm text-blue-800">
            <strong>Tip:</strong> Choose words that resonate with you personally. They can be nouns, adjectives, or concepts that represent your values, goals, or current state in each area.
          </p>
        </div>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div 
          v-for="(category, categoryName) in categories" 
          :key="categoryName"
          class="bg-white rounded-lg shadow-md p-6"
        >
          <h2 class="text-2xl font-semibold mb-4" :class="category.color">
            {{ categoryName }}
          </h2>
          <div class="space-y-3">
            <div 
              v-for="i in 8" 
              :key="i"
              class="flex items-center space-x-2"
            >
              <span class="w-6 text-sm text-gray-500">{{ i }}.</span>
              <input
                v-model="words[categoryName][i-1]"
                type="text"
                :placeholder="`${categoryName} word ${i}`"
                class="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                @input="updateProgress"
              />
            </div>
          </div>
        </div>
      </div>

      <div class="mt-8 bg-white rounded-lg shadow-md p-6">
        <div class="flex items-center justify-between">
          <div>
            <h3 class="text-lg font-semibold text-gray-800">Progress</h3>
            <p class="text-sm text-gray-600">{{ filledWords }} of 32 words completed</p>
          </div>
          <div class="flex items-center space-x-4">
            <div class="w-48 bg-gray-200 rounded-full h-2">
              <div 
                class="bg-blue-500 h-2 rounded-full transition-all duration-300"
                :style="{ width: `${(filledWords / 32) * 100}%` }"
              ></div>
            </div>
            <button 
              @click="submitWords"
              :disabled="filledWords < 32"
              class="px-6 py-2 bg-green-500 text-white rounded-lg font-semibold transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed hover:bg-green-600"
            >
              Continue to Association
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'WordEntry',
  props: {
    existingWords: {
      type: Object,
      default: () => ({})
    }
  },
  emits: ['words-complete', 'back'],
  data() {
    return {
      categories: {
        Physical: { color: 'text-red-600' },
        Mental: { color: 'text-blue-600' },
        Emotional: { color: 'text-yellow-600' },
        Spiritual: { color: 'text-purple-600' }
      },
      words: {
        Physical: this.existingWords.Physical || Array(8).fill(''),
        Mental: this.existingWords.Mental || Array(8).fill(''),
        Emotional: this.existingWords.Emotional || Array(8).fill(''),
        Spiritual: this.existingWords.Spiritual || Array(8).fill('')
      },
      filledWords: 0
    }
  },
  mounted() {
    this.updateProgress()
  },
  methods: {
    updateProgress() {
      this.filledWords = Object.values(this.words).flat().filter(word => word.trim() !== '').length
    },
    submitWords() {
      if (this.filledWords === 32) {
        const cleanWords = {}
        Object.keys(this.words).forEach(category => {
          cleanWords[category] = this.words[category].map(word => word.trim()).filter(word => word !== '')
        })
        this.$emit('words-complete', cleanWords)
      }
    }
  }
}
</script>