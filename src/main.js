import './style.css'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY

const supabase = createClient(supabaseUrl, supabaseKey)

document.querySelector('#app').innerHTML = `
  <div class="container">
    <div class="glass-card">
      <h1 class="title">Glass Finder</h1>
      <p class="subtitle">Find compatible screen protectors for your phone</p>

      <div class="search-container">
        <input
          type="text"
          id="searchInput"
          class="search-input"
          placeholder="Enter phone model... (e.g. A15)"
          autocomplete="off"
        >
        <button id="searchBtn" class="search-button">
          <span>Search</span>
          <svg class="search-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="11" cy="11" r="8"></circle>
            <path d="m21 21-4.35-4.35"></path>
          </svg>
        </button>
      </div>

      <div id="results" class="results-container"></div>
    </div>
  </div>
`

const searchInput = document.getElementById('searchInput')
const searchBtn = document.getElementById('searchBtn')
const resultsContainer = document.getElementById('results')

async function searchCompatibleModels(searchTerm) {
  if (!searchTerm.trim()) {
    resultsContainer.innerHTML = `
      <div class="message-card">
        <svg class="message-icon" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <circle cx="12" cy="12" r="10"></circle>
          <path d="M12 16v-4"></path>
          <path d="M12 8h.01"></path>
        </svg>
        <p>Please enter a phone model to search</p>
      </div>
    `
    return
  }

  resultsContainer.innerHTML = `
    <div class="loading">
      <div class="spinner"></div>
      <p>Searching...</p>
    </div>
  `

  try {
    const { data: allModels, error } = await supabase
      .from('phone_models')
      .select('model_name, group_id')

    if (error) throw error

    const searchTermLower = searchTerm.toLowerCase().trim()
    const matchedModel = allModels.find(model =>
      model.model_name.toLowerCase().includes(searchTermLower)
    )

    if (!matchedModel) {
      resultsContainer.innerHTML = `
        <div class="message-card error">
          <svg class="message-icon" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="12" cy="12" r="10"></circle>
            <path d="m15 9-6 6"></path>
            <path d="m9 9 6 6"></path>
          </svg>
          <p>No compatible models found</p>
          <p class="sub-message">Try searching for: A15, A26, A17, A12, A13, A21s, Poco X3, Note 11 Pro</p>
        </div>
      `
      return
    }

    const compatibleModels = allModels.filter(model =>
      model.group_id === matchedModel.group_id &&
      model.model_name.toLowerCase() !== matchedModel.model_name.toLowerCase()
    )

    resultsContainer.innerHTML = `
      <div class="result-header">
        <h3>Compatible with <span class="highlight">${matchedModel.model_name}</span></h3>
        <p class="result-count">${compatibleModels.length} model${compatibleModels.length !== 1 ? 's' : ''} found</p>
      </div>
      <div class="results-grid">
        ${compatibleModels.map(model => `
          <div class="result-card">
            <svg class="checkmark" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
              <polyline points="20 6 9 17 4 12"></polyline>
            </svg>
            <span class="model-name">${model.model_name}</span>
          </div>
        `).join('')}
      </div>
    `
  } catch (error) {
    console.error('Search error:', error)
    resultsContainer.innerHTML = `
      <div class="message-card error">
        <svg class="message-icon" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <circle cx="12" cy="12" r="10"></circle>
          <path d="M12 8v4"></path>
          <path d="M12 16h.01"></path>
        </svg>
        <p>Error searching for models</p>
        <p class="sub-message">Please try again later</p>
      </div>
    `
  }
}

searchBtn.addEventListener('click', () => {
  searchCompatibleModels(searchInput.value)
})

searchInput.addEventListener('keypress', (e) => {
  if (e.key === 'Enter') {
    searchCompatibleModels(searchInput.value)
  }
})

searchInput.focus()
