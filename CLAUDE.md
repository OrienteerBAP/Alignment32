# Alignment32 - AI Assistant Context

## Project Overview
Alignment32 is a Vue 3 web application that guides users through a systematic word alignment process. Users start with 32 words across 4 categories and progressively merge them through associations until reaching a single final word that represents their personal alignment.

## Tech Stack
- **Frontend**: Vue 3 with Composition API
- **Styling**: Tailwind CSS
- **Build Tool**: Vite
- **Storage**: localStorage for session persistence
- **Module Type**: ES modules (`"type": "module"` in package.json)

## Core Concept
The application implements a structured word reduction process:
1. **Initial Input**: 32 words across 4 categories (Physical, Mental, Emotional, Spiritual) - 8 words each
2. **Association Phase**: Users create associations between word pairs from different groups
3. **Iterative Reduction**: Groups are merged repeatedly until one final word remains
4. **Session Persistence**: Complete word history and associations are saved

## Application Architecture

### Main Components
```
App.vue (Root)
├── HomeScreen.vue - Session management and navigation
├── WordEntry.vue - Initial 32-word input form
├── Association.vue - Word pairing and association logic
└── SessionDetail.vue - Read-only session history viewer
```

### Data Flow
1. **Session Creation**: `App.vue` manages session state and navigation
2. **Word Entry**: `WordEntry.vue` collects 32 words, validates completion
3. **Association Process**: `Association.vue` handles iterative word merging
4. **Persistence**: All data saved to localStorage with complete history

## Key Features

### Session Management
- **New Sessions**: Create fresh alignment sessions
- **Session Persistence**: All sessions saved with complete word history
- **Read-Only Viewing**: Completed sessions are view-only
- **Resume Capability**: Continue incomplete sessions

### Word Processing Algorithm
```javascript
// Initial: 4 groups × 8 words = 32 words
Physical: [word1, word2, ..., word8]
Mental: [word1, word2, ..., word8]
Emotional: [word1, word2, ..., word8]
Spiritual: [word1, word2, ..., word8]

// Step 1: Physical+Mental → Group1, Emotional+Spiritual → Group2
// Step 2: Group1+Group2 → FinalGroup (8 words)
// Step 3: Split FinalGroup → Group1A (4 words) + Group1B (4 words)
// Step 4: Group1A+Group1B → Final result (1 word)
```

### Data Structure
```javascript
session = {
  id: timestamp,
  createdAt: Date,
  initialWords: {
    Physical: [...],
    Mental: [...],
    Emotional: [...],
    Spiritual: [...]
  },
  wordHistory: [
    { step: 0, stage: 'Initial Words', groups: [...] },
    { step: 1, stage: 'Step 1 - After Association', groups: [...] },
    // ... complete progression
  ],
  associations: [
    { step: 1, stage: 'Step 1', associations: [
      { word1: 'health', word2: 'focus', association: 'vitality', group1: 'Physical', group2: 'Mental' }
    ]}
  ],
  finalWord: 'alignment' // null if incomplete
}
```

## Component Details

### HomeScreen.vue
- **Purpose**: Main dashboard showing session list and creation
- **Features**: Session status, word count display, creation button
- **Navigation**: Routes to WordEntry (new) or SessionDetail (completed)

### WordEntry.vue
- **Purpose**: 32-word input form with validation
- **Features**: 4 category sections, progress tracking, word count validation
- **Props**: `existingWords` for resuming incomplete sessions
- **Validation**: Ensures all 32 words are filled before proceeding

### Association.vue
- **Purpose**: Core word association and merging logic
- **Features**: Step-by-step association, progress tracking, history recording
- **Algorithm**: Handles group pairing, splitting, and final word extraction
- **Props**: `groups` (current word groups), `initialWordHistory` (for resume)

### SessionDetail.vue
- **Purpose**: Read-only display of completed sessions
- **Features**: Complete word history, association timeline, final result
- **Data**: Shows full progression from initial 32 words to final word

## Development Commands
```bash
npm run dev     # Start development server
npm run build   # Build for production
npm run preview # Preview production build
```

## Key Business Logic

### Word Association Process
1. **Pair Formation**: Groups are paired (Physical+Mental, Emotional+Spiritual)
2. **Association Creation**: Users create associations for each word pair
3. **Group Merging**: New groups formed from associations
4. **Iteration**: Process repeats until single group remains
5. **Final Split**: If final group has >1 word, split and associate until 1 word

### Session State Management
- **New Sessions**: Start with word entry
- **Incomplete Sessions**: Resume at appropriate stage
- **Completed Sessions**: Show read-only history
- **Data Persistence**: All stages saved to localStorage

## Error Handling
- **Validation**: Prevent progression without complete word sets
- **State Recovery**: Handle incomplete sessions gracefully
- **Data Integrity**: Preserve all word history and associations

## UI/UX Patterns
- **Progressive Disclosure**: Step-by-step guidance
- **Visual Feedback**: Progress bars and completion indicators
- **Responsive Design**: Works on desktop and mobile
- **Clear Navigation**: Breadcrumbs and back buttons throughout

## Common Debugging Areas
1. **Session Loading**: Check localStorage data structure
2. **Word Validation**: Ensure all 32 words are present
3. **Association Logic**: Verify group pairing and merging
4. **History Preservation**: Confirm all steps are recorded
5. **Navigation State**: Check view transitions and data passing

## Future Enhancement Opportunities
- Export/import sessions
- Session sharing capabilities
- Advanced analytics on word patterns
- Custom category definitions
- Multi-language support