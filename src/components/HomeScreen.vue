<template>
  <div class="container mx-auto px-4 py-8">
    <div class="max-w-4xl mx-auto">
      <h1 class="text-4xl font-bold text-gray-800 mb-8 text-center">Alignment32</h1>
      
      <div class="bg-white rounded-lg shadow-md p-6 mb-8">
        <h2 class="text-2xl font-semibold text-gray-700 mb-4">Start New Session</h2>
        <p class="text-gray-600 mb-6">Begin a new alignment session by entering 32 words across 4 categories.</p>
        <button 
          @click="$emit('create-session')"
          class="bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-6 rounded-lg transition-colors"
        >
          Create New Session
        </button>
      </div>

      <div class="bg-white rounded-lg shadow-md p-6">
        <h2 class="text-2xl font-semibold text-gray-700 mb-4">Previous Sessions</h2>
        <div v-if="sessions.length === 0" class="text-gray-500 text-center py-8">
          No previous sessions found. Create your first session above.
        </div>
        <div v-else class="space-y-4">
          <div 
            v-for="session in sessions" 
            :key="session.id"
            class="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 cursor-pointer transition-colors"
            @click="$emit('open-session', session)"
          >
            <div class="flex justify-between items-start">
              <div>
                <h3 class="font-semibold text-gray-800">
                  Session {{ new Date(session.createdAt).toLocaleDateString() }}
                </h3>
                <p class="text-sm text-gray-600 mt-1">
                  Created {{ new Date(session.createdAt).toLocaleString() }}
                </p>
                <div v-if="session.finalWord" class="mt-2">
                  <span class="inline-block bg-green-100 text-green-800 px-2 py-1 rounded text-sm">
                    Final Word: {{ session.finalWord }}
                  </span>
                </div>
                <div v-if="session.wordHistory && session.wordHistory.length > 0" class="mt-2">
                  <p class="text-xs text-gray-500">
                    {{ getTotalWordsCount(session) }} words processed through {{ session.wordHistory.length }} stages
                  </p>
                </div>
              </div>
              <div class="text-right">
                <span class="text-sm text-gray-500">
                  {{ session.finalWord ? 'Completed' : 'In Progress' }}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'HomeScreen',
  props: {
    sessions: {
      type: Array,
      default: () => []
    }
  },
  emits: ['create-session', 'open-session'],
  methods: {
    getTotalWordsCount(session) {
      if (!session.wordHistory || session.wordHistory.length === 0) return 0
      return session.wordHistory[0].groups.reduce((total, group) => total + group.words.length, 0)
    }
  }
}
</script>