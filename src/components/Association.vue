<template>
  <div class="container mx-auto px-4 py-8">
    <div class="max-w-4xl mx-auto">
      <div class="flex items-center mb-8">
        <button 
          @click="$emit('back')"
          class="mr-4 p-2 rounded-lg bg-gray-200 hover:bg-gray-300 transition-colors"
        >
          ← Back
        </button>
        <h1 class="text-3xl font-bold text-gray-800">Association Process</h1>
      </div>

      <div class="bg-white rounded-lg shadow-md p-6 mb-6">
        <div class="flex items-center justify-between mb-4">
          <h2 class="text-xl font-semibold text-gray-700">
            Step {{ currentStep }} of {{ totalSteps }}
          </h2>
          <div class="text-sm text-gray-500">
            Groups: {{ currentGroups.length }} → {{ Math.ceil(currentGroups.length / 2) }}
          </div>
        </div>
        
        <div class="w-full bg-gray-200 rounded-full h-2 mb-4">
          <div 
            class="bg-blue-500 h-2 rounded-full transition-all duration-300"
            :style="{ width: `${(currentStep / totalSteps) * 100}%` }"
          ></div>
        </div>

        <p class="text-gray-600">
          Create associations between word pairs from different groups. Each association will form a new merged group.
        </p>
      </div>

      <div v-if="currentGroups.length > 1" class="space-y-6">
        <div 
          v-for="(pair, index) in currentPairs" 
          :key="`pair-${currentStep}-${index}`"
          class="bg-white rounded-lg shadow-md p-6"
        >
          <h3 class="text-lg font-semibold text-gray-800 mb-4">
            Pair {{ index + 1 }}: {{ pair.group1.name }} + {{ pair.group2.name }}
          </h3>
          
          <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div class="text-center">
              <h4 class="font-semibold text-gray-700 mb-2">{{ pair.group1.name }}</h4>
              <div class="space-y-1">
                <div 
                  v-for="(word, i) in pair.group1.words" 
                  :key="`g1-${i}`"
                  class="px-3 py-1 bg-red-100 text-red-800 rounded text-sm"
                >
                  {{ word }}
                </div>
              </div>
            </div>
            
            <div class="flex items-center justify-center">
              <div class="text-2xl text-gray-400">+</div>
            </div>
            
            <div class="text-center">
              <h4 class="font-semibold text-gray-700 mb-2">{{ pair.group2.name }}</h4>
              <div class="space-y-1">
                <div 
                  v-for="(word, i) in pair.group2.words" 
                  :key="`g2-${i}`"
                  class="px-3 py-1 bg-blue-100 text-blue-800 rounded text-sm"
                >
                  {{ word }}
                </div>
              </div>
            </div>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div 
              v-for="i in Math.min(pair.group1.words.length, pair.group2.words.length)" 
              :key="`association-${i}`"
              class="flex items-center space-x-2"
            >
              <span class="w-6 text-sm text-gray-500">{{ i }}.</span>
              <div class="flex-1 flex items-center space-x-2">
                <span class="px-2 py-1 bg-red-100 text-red-800 rounded text-sm">
                  {{ pair.group1.words[i-1] }}
                </span>
                <span class="text-gray-400">+</span>
                <span class="px-2 py-1 bg-blue-100 text-blue-800 rounded text-sm">
                  {{ pair.group2.words[i-1] }}
                </span>
                <span class="text-gray-400">=</span>
                <input
                  v-model="associations[`${index}-${i-1}`]"
                  type="text"
                  :placeholder="`Association ${i}`"
                  class="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  @input="updateProgress"
                />
              </div>
            </div>
          </div>
        </div>

        <div class="bg-white rounded-lg shadow-md p-6">
          <div class="flex items-center justify-between">
            <div>
              <h3 class="text-lg font-semibold text-gray-800">Progress</h3>
              <p class="text-sm text-gray-600">{{ filledAssociations }} of {{ requiredAssociations }} associations completed</p>
            </div>
            <button 
              @click="submitAssociations"
              :disabled="filledAssociations < requiredAssociations"
              class="px-6 py-2 bg-green-500 text-white rounded-lg font-semibold transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed hover:bg-green-600"
            >
              {{ currentGroups.length > 2 ? 'Continue' : 'Complete' }}
            </button>
          </div>
        </div>
      </div>

      <div v-else class="bg-white rounded-lg shadow-md p-8 text-center">
        <h2 class="text-2xl font-bold text-gray-800 mb-4">Final Result</h2>
        <div class="text-6xl mb-6">🎯</div>
        <h3 class="text-3xl font-semibold text-blue-600 mb-4">{{ finalWord }}</h3>
        <p class="text-gray-600 mb-6">
          Congratulations! You've completed the alignment process. This word represents the synthesis of all your 32 words.
        </p>
        <button 
          @click="completeProcess"
          class="px-8 py-3 bg-blue-500 text-white rounded-lg font-semibold hover:bg-blue-600 transition-colors"
        >
          Return to Home
        </button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Association',
  props: {
    groups: {
      type: Array,
      required: true
    },
    initialWordHistory: {
      type: Array,
      default: () => []
    }
  },
  emits: ['associations-complete', 'back'],
  data() {
    return {
      currentGroups: [],
      currentStep: 1,
      totalSteps: 0,
      associations: {},
      filledAssociations: 0,
      requiredAssociations: 0,
      finalWord: '',
      wordHistory: [],
      allAssociations: []
    }
  },
  computed: {
    currentPairs() {
      const pairs = []
      for (let i = 0; i < this.currentGroups.length; i += 2) {
        if (i + 1 < this.currentGroups.length) {
          pairs.push({
            group1: this.currentGroups[i],
            group2: this.currentGroups[i + 1]
          })
        }
      }
      return pairs
    }
  },
  mounted() {
    this.initializeProcess()
  },
  methods: {
    initializeProcess() {
      this.currentGroups = [...this.groups]
      this.wordHistory = [...this.initialWordHistory]
      this.calculateTotalSteps()
      this.calculateRequiredAssociations()
    },
    calculateTotalSteps() {
      let groupCount = this.currentGroups.length
      let steps = 0
      
      while (groupCount > 1) {
        steps++
        groupCount = Math.ceil(groupCount / 2)
      }
      
      this.totalSteps = steps
    },
    calculateRequiredAssociations() {
      this.requiredAssociations = this.currentPairs.reduce((total, pair) => {
        return total + Math.min(pair.group1.words.length, pair.group2.words.length)
      }, 0)
    },
    updateProgress() {
      this.filledAssociations = Object.values(this.associations).filter(assoc => assoc && assoc.trim() !== '').length
    },
    submitAssociations() {
      if (this.filledAssociations < this.requiredAssociations) return
      
      const stepAssociations = []
      const newGroups = []
      
      this.currentPairs.forEach((pair, pairIndex) => {
        const newWords = []
        const minLength = Math.min(pair.group1.words.length, pair.group2.words.length)
        
        for (let i = 0; i < minLength; i++) {
          const association = this.associations[`${pairIndex}-${i}`]
          if (association && association.trim() !== '') {
            newWords.push(association.trim())
            stepAssociations.push({
              word1: pair.group1.words[i],
              word2: pair.group2.words[i],
              association: association.trim(),
              group1: pair.group1.name,
              group2: pair.group2.name
            })
          }
        }
        
        if (newWords.length > 0) {
          newGroups.push({
            name: `${pair.group1.name}-${pair.group2.name}`,
            words: newWords
          })
        }
      })
      
      if (this.currentGroups.length % 2 === 1) {
        newGroups.push(this.currentGroups[this.currentGroups.length - 1])
      }
      
      this.allAssociations.push({
        step: this.currentStep,
        stage: `Step ${this.currentStep}`,
        associations: stepAssociations
      })
      
      this.wordHistory.push({
        step: this.currentStep,
        stage: `Step ${this.currentStep} - After Association`,
        groups: newGroups.map(g => ({ name: g.name, words: [...g.words] }))
      })
      
      this.currentGroups = newGroups
      this.currentStep++
      
      if (this.currentGroups.length === 1) {
        if (this.currentGroups[0].words.length > 1) {
          this.splitFinalGroup()
        } else {
          this.finalWord = this.currentGroups[0].words[0]
        }
      } else {
        this.associations = {}
        this.filledAssociations = 0
        this.calculateRequiredAssociations()
      }
    },
    splitFinalGroup() {
      const finalGroup = this.currentGroups[0]
      const midPoint = Math.ceil(finalGroup.words.length / 2)
      
      const splitGroups = [
        {
          name: `${finalGroup.name}-A`,
          words: finalGroup.words.slice(0, midPoint)
        },
        {
          name: `${finalGroup.name}-B`,
          words: finalGroup.words.slice(midPoint)
        }
      ]
      
      this.wordHistory.push({
        step: this.currentStep,
        stage: `Step ${this.currentStep} - Split Final Group`,
        groups: splitGroups.map(g => ({ name: g.name, words: [...g.words] }))
      })
      
      this.currentGroups = splitGroups
      this.associations = {}
      this.filledAssociations = 0
      this.calculateRequiredAssociations()
    },
    completeProcess() {
      this.$emit('associations-complete', {
        finalWord: this.finalWord,
        wordHistory: this.wordHistory,
        associations: this.allAssociations
      })
    }
  }
}
</script>