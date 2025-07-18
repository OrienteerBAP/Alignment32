<template>
  <div class="min-h-screen bg-gray-100">
    <HomeScreen 
      v-if="currentView === 'home'"
      @create-session="startNewSession"
      @open-session="openSession"
      :sessions="sessions"
    />
    <WordEntry
      v-if="currentView === 'word-entry'"
      :existing-words="currentSession ? currentSession.initialWords : {}"
      @words-complete="onWordsComplete"
      @back="currentView = 'home'"
    />
    <Association
      v-if="currentView === 'association'"
      :groups="currentGroups"
      :initial-word-history="currentSession.wordHistory"
      @associations-complete="onAssociationsComplete"
      @back="currentView = 'word-entry'"
    />
    <SessionDetail
      v-if="currentView === 'session-detail'"
      :session="currentSession"
      @back="currentView = 'home'"
    />
  </div>
</template>

<script>
import HomeScreen from './components/HomeScreen.vue'
import WordEntry from './components/WordEntry.vue'
import Association from './components/Association.vue'
import SessionDetail from './components/SessionDetail.vue'

export default {
  name: 'App',
  components: {
    HomeScreen,
    WordEntry,
    Association,
    SessionDetail
  },
  data() {
    return {
      currentView: 'home',
      sessions: [],
      currentSession: null,
      currentGroups: []
    }
  },
  mounted() {
    this.loadSessions()
  },
  methods: {
    startNewSession() {
      this.currentSession = {
        id: Date.now(),
        createdAt: new Date(),
        initialWords: {},
        wordHistory: [],
        associations: [],
        finalWord: null
      }
      this.currentView = 'word-entry'
    },
    openSession(session) {
      this.currentSession = session
      if (session.finalWord) {
        // Completed session - show read-only detail view
        this.currentView = 'session-detail'
      } else {
        // Incomplete session - allow editing
        if (session.initialWords && Object.keys(session.initialWords).length > 0) {
          // Has initial words, continue with association
          this.currentGroups = [
            { name: 'Physical', words: session.initialWords.Physical || [] },
            { name: 'Mental', words: session.initialWords.Mental || [] },
            { name: 'Emotional', words: session.initialWords.Emotional || [] },
            { name: 'Spiritual', words: session.initialWords.Spiritual || [] }
          ]
          this.currentView = 'association'
        } else {
          // No initial words, start from word entry
          this.currentView = 'word-entry'
        }
      }
    },
    onWordsComplete(words) {
      this.currentSession.initialWords = words
      this.currentSession.wordHistory = [{
        step: 0,
        stage: 'Initial Words',
        groups: [
          { name: 'Physical', words: words.Physical },
          { name: 'Mental', words: words.Mental },
          { name: 'Emotional', words: words.Emotional },
          { name: 'Spiritual', words: words.Spiritual }
        ]
      }]
      this.currentGroups = [
        { name: 'Physical', words: words.Physical },
        { name: 'Mental', words: words.Mental },
        { name: 'Emotional', words: words.Emotional },
        { name: 'Spiritual', words: words.Spiritual }
      ]
      this.currentView = 'association'
    },
    onAssociationsComplete(result) {
      this.currentSession.finalWord = result.finalWord
      this.currentSession.wordHistory = result.wordHistory
      this.currentSession.associations = result.associations
      this.saveSession()
      this.currentView = 'home'
    },
    saveSession() {
      const existingIndex = this.sessions.findIndex(s => s.id === this.currentSession.id)
      if (existingIndex >= 0) {
        this.sessions[existingIndex] = this.currentSession
      } else {
        this.sessions.push(this.currentSession)
      }
      localStorage.setItem('alignment32-sessions', JSON.stringify(this.sessions))
    },
    loadSessions() {
      const saved = localStorage.getItem('alignment32-sessions')
      if (saved) {
        this.sessions = JSON.parse(saved)
      }
    }
  }
}
</script>