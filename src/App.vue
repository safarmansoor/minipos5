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
  window.dispatchEvent(new CustomEvent('global-search', { 
    detail: { query, page: route.name } 
  }))
}
</script>

<template>
  <div class="app">
    <!-- Navigation Header -->
    <header class="app-header">
      <div class="container-fluid">
        <div class="row align-items-center">
          <div class="col-md-6">
            <div class="brand">
              <h1 class="brand-title">Lalasa Bakery POS</h1>
              <p class="brand-subtitle">Point of Sale System</p>
            </div>
          </div>
          <div class="col-md-6">
            <div class="search-container">
              <div class="input-group">
                <span class="input-group-text">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 16 16">
                    <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001q.044.06.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1 1 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0"/>
                  </svg>
                </span>
                <input 
                  type="text" 
                  class="form-control" 
                  placeholder="Search products, sales, or categories..." 
                  v-model="searchQuery"
                  @input="handleSearch"
                >
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>

    <!-- Main Content -->
    <main class="app-content">
      <div class="container-fluid">
        <RouterView :search-query="searchQuery" />
      </div>
    </main>
  </div>
</template>

<style scoped>
/* Remove global padding and margin */
:root {
  --app-margin: 0;
  --app-padding: 0;
}

* {
  box-sizing: border-box;
}

body, html {
  margin: 0 !important;
  padding: 0 !important;
  height: 100%;
  width: 100%;
}

.app {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  flex-direction: column;
  margin: 0;
  padding: 0;
}

.app-header {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border-bottom: 1px solid rgba(255, 255, 255, 0.2);
  position: sticky;
  top: 0;
  z-index: 1000;
}

.brand {
  text-align: left;
}

.brand-title {
  margin: 0;
  font-size: 1.5rem;
  font-weight: 700;
  color: #2c3e50;
  letter-spacing: -0.5px;
}

.brand-subtitle {
  margin: 0;
  font-size: 0.875rem;
  color: #6c757d;
  font-weight: 500;
}

.search-container {
  max-width: 600px;
  margin-left: auto;
}

.search-container .input-group {
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.search-container .form-control {
  border: none;
  border-radius: 50px;
  padding: 1rem 1.5rem;
  font-size: 1rem;
  box-shadow: none;
  transition: all 0.3s ease;
}

.search-container .form-control:focus {
  box-shadow: 0 0 0 3px rgba(13, 110, 253, 0.25);
  outline: none;
}

.search-container .input-group-text {
  background: transparent;
  border: none;
  padding: 0 1.5rem;
  color: #6c757d;
}

.app-content {
  flex: 1;
}

/* Fully responsive design */
@media (max-width: 768px) {
  .app-header {
    padding: 1rem 0;
  }
  
  .brand-title {
    font-size: 1.25rem;
  }
  
  .brand-subtitle {
    font-size: 0.75rem;
  }
  
  .search-container {
    max-width: 100%;
    margin: 1rem 0 0 0;
  }
  
  .app-content {
    padding: 1rem 0;
  }
}

@media (min-width: 769px) and (max-width: 1024px) {
  .app-header {
    padding: 1.25rem 0;
  }
  
  .brand-title {
    font-size: 1.375rem;
  }
  
  .brand-subtitle {
    font-size: 0.8125rem;
  }
  
  .app-content {
    padding: 2rem 0;
  }
}

@media (min-width: 1025px) {
  .app-header {
    padding: 1.5rem 0;
  }
  
  .brand-title {
    font-size: 1.5rem;
  }
  
  .brand-subtitle {
    font-size: 0.875rem;
  }
  
  .app-content {
    padding: 3rem 0;
  }
}

/* Page-specific styling */
.app-content .card {
  border: none;
  border-radius: 16px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
}

.app-content .card-header {
  background: transparent;
  border-bottom: 1px solid rgba(0, 0, 0, 0.05);
  border-radius: 16px 16px 0 0 !important;
}

.app-content .btn {
  border-radius: 12px;
  font-weight: 600;
  transition: all 0.3s ease;
}

.app-content .btn:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}
</style>