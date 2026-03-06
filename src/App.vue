<script setup>
import { RouterView } from 'vue-router'
import { ref, computed } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const searchQuery = ref('')

// Global search functionality
const handleSearch = (event) => {
  const query = event.target.value.toLowerCase()
  searchQuery.value = query
  
  // Emit search event to current page component
  // This will be handled by each page component individually
  window.dispatchEvent(new CustomEvent('global-search', { 
    detail: { query, page: route.name } 
  }))
}
</script>

<template>
  <div class="app-container">
    <!-- Global Search Bar -->
    <div class="search-bar-container bg-primary text-white py-2 px-3">
      <div class="container-fluid">
        <div class="row align-items-center">
          <div class="col-12">
            <div class="input-group">
              <span class="input-group-text bg-white border-0">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-search" viewBox="0 0 16 16">
                  <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001q.044.06.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1 1 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0"/>
                </svg>
              </span>
              <input 
                type="text" 
                class="form-control border-0 shadow-none" 
                placeholder="Search..." 
                v-model="searchQuery"
                @input="handleSearch"
              >
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Page Content -->
    <main class="main-content">
      <RouterView :search-query="searchQuery" />
    </main>
  </div>
</template>

<style scoped>
.app-container {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.search-bar-container {
  position: sticky;
  top: 0;
  z-index: 1000;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.main-content {
  flex: 1;
  padding: 1rem;
  background-color: #f8f9fa;
}

/* Responsive design - larger on desktop */
@media (min-width: 768px) {
  .main-content {
    padding: 2rem;
  }
}

@media (min-width: 1200px) {
  .main-content {
    padding: 3rem;
    max-width: 1400px;
    margin: 0 auto;
    width: 100%;
  }
}
</style>
