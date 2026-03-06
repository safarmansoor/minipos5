<script setup>
import { ref, onMounted, computed, watch } from 'vue'
import { supabase } from '../services/supabase'

// Props for search functionality
const props = defineProps({
  searchQuery: {
    type: String,
    default: ''
  }
})

const products = ref([])
const filteredProducts = ref([])
const isLoading = ref(false)
const error = ref('')
const success = ref('')

// Form data for add/edit
const isEditing = ref(false)
const editingProduct = ref(null)
const formData = ref({
  name: '',
  price: '',
  category: ''
})

// Categories for dropdown
const categories = ref(['Bakery', 'Drinks', 'Snacks', 'Others'])

onMounted(async () => {
  await loadProducts()
})

// Watch for search query changes
watch(() => props.searchQuery, (newQuery) => {
  if (newQuery.trim() === '') {
    filteredProducts.value = products.value
  } else {
    filteredProducts.value = products.value.filter(product =>
      product.name.toLowerCase().includes(newQuery.toLowerCase()) ||
      product.category.toLowerCase().includes(newQuery.toLowerCase())
    )
  }
})

const loadProducts = async () => {
  isLoading.value = true
  error.value = ''
  
  try {
    const { data, error: dbError } = await supabase
      .from('products')
      .select('*')
      .order('name', { ascending: true })

    if (dbError) {
      error.value = 'Failed to load products'
      console.error('Load products error:', dbError)
    } else {
      products.value = data || []
      filteredProducts.value = products.value
    }
  } catch (err) {
    error.value = 'An unexpected error occurred'
    console.error('Load products error:', err)
  } finally {
    isLoading.value = false
  }
}

const openAddModal = () => {
  isEditing.value = false
  editingProduct.value = null
  formData.value = {
    name: '',
    price: '',
    category: categories.value[0] || 'Others'
  }
  // Show modal
  const modal = new bootstrap.Modal(document.getElementById('productModal'))
  modal.show()
}

const openEditModal = (product) => {
  isEditing.value = true
  editingProduct.value = product
  formData.value = {
    name: product.name,
    price: product.price,
    category: product.category
  }
  // Show modal
  const modal = new bootstrap.Modal(document.getElementById('productModal'))
  modal.show()
}

const handleSubmit = async () => {
  if (!formData.value.name || !formData.value.price || !formData.value.category) {
    error.value = 'Please fill in all fields'
    return
  }

  if (parseFloat(formData.value.price) <= 0) {
    error.value = 'Price must be greater than 0'
    return
  }

  isLoading.value = true
  error.value = ''
  success.value = ''

  try {
    if (isEditing.value && editingProduct.value) {
      // Update existing product
      const { data, error: dbError } = await supabase
        .from('products')
        .update({
          name: formData.value.name,
          price: parseFloat(formData.value.price),
          category: formData.value.category
        })
        .eq('id', editingProduct.value.id)
        .single()

      if (dbError) {
        error.value = 'Failed to update product'
        console.error('Update product error:', dbError)
      } else {
        // Update local state
        const index = products.value.findIndex(p => p.id === editingProduct.value.id)
        if (index !== -1) {
          products.value[index] = data
        }
        filteredProducts.value = products.value
        success.value = 'Product updated successfully!'
        closeModal()
      }
    } else {
      // Create new product
      const { data, error: dbError } = await supabase
        .from('products')
        .insert([
          {
            name: formData.value.name,
            price: parseFloat(formData.value.price),
            category: formData.value.category
          }
        ])
        .single()

      if (dbError) {
        error.value = 'Failed to create product'
        console.error('Create product error:', dbError)
      } else {
        products.value.push(data)
        filteredProducts.value = products.value
        success.value = 'Product created successfully!'
        closeModal()
      }
    }
  } catch (err) {
    error.value = 'An unexpected error occurred'
    console.error('Product operation error:', err)
  } finally {
    isLoading.value = false
  }
}

const handleDelete = async (productId) => {
  if (!confirm('Are you sure you want to delete this product?')) {
    return
  }

  isLoading.value = true
  error.value = ''

  try {
    const { error: dbError } = await supabase
      .from('products')
      .delete()
      .eq('id', productId)

    if (dbError) {
      error.value = 'Failed to delete product'
      console.error('Delete product error:', dbError)
    } else {
      // Remove from local state
      products.value = products.value.filter(p => p.id !== productId)
      filteredProducts.value = products.value
      success.value = 'Product deleted successfully!'
    }
  } catch (err) {
    error.value = 'An unexpected error occurred'
    console.error('Delete product error:', err)
  } finally {
    isLoading.value = false
  }
}

const closeModal = () => {
  const modal = bootstrap.Modal.getInstance(document.getElementById('productModal'))
  if (modal) {
    modal.hide()
  }
}

const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  }).format(amount)
}
</script>

<template>
  <div class="product-management">
    <!-- Page Header -->
    <div class="row mb-4">
      <div class="col-12">
        <h2 class="text-primary fw-bold">Product Management</h2>
        <p class="text-muted">Manage your bakery products</p>
      </div>
    </div>

    <!-- Alerts -->
    <div v-if="error" class="alert alert-danger alert-dismissible fade show" role="alert">
      {{ error }}
      <button type="button" class="btn-close" @click="error = ''"></button>
    </div>

    <div v-if="success" class="alert alert-success alert-dismissible fade show" role="alert">
      {{ success }}
      <button type="button" class="btn-close" @click="success = ''"></button>
    </div>

    <div class="row">
      <div class="col-12">
        <div class="card shadow-sm">
          <div class="card-header bg-white d-flex justify-content-between align-items-center">
            <h5 class="card-title mb-0">Products</h5>
            <button class="btn btn-primary" @click="openAddModal">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-plus-lg me-2" viewBox="0 0 16 16">
                <path fill-rule="evenodd" d="M8 2a.5.5 0 0 1 .5.5v5h5a.5.5 0 0 1 0 1h-5v5a.5.5 0 0 1-1 0v-5h-5a.5.5 0 0 1 0-1h5v-5A.5.5 0 0 1 8 2"/>
              </svg>
              Add Product
            </button>
          </div>
          <div class="card-body">
            <div v-if="isLoading" class="text-center py-5">
              <div class="spinner-border text-primary" role="status">
                <span class="visually-hidden">Loading...</span>
              </div>
            </div>
            
            <div v-else-if="filteredProducts.length === 0" class="text-center py-5">
              <h5 class="text-muted">No products found</h5>
              <p class="text-muted">Add your first product to get started</p>
              <button class="btn btn-primary" @click="openAddModal">Add First Product</button>
            </div>

            <div v-else class="table-responsive">
              <table class="table table-hover">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Category</th>
                    <th>Price</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="product in filteredProducts" :key="product.id">
                    <td>
                      <strong>{{ product.name }}</strong>
                    </td>
                    <td>
                      <span class="badge bg-secondary">{{ product.category }}</span>
                    </td>
                    <td class="text-primary fw-bold">
                      {{ formatCurrency(product.price) }}
                    </td>
                    <td>
                      <div class="btn-group" role="group">
                        <button 
                          class="btn btn-outline-primary btn-sm"
                          @click="openEditModal(product)"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-pencil" viewBox="0 0 16 16">
                            <path d="M12.146.146a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1 0 .708l-10 10a.5.5 0 0 1-.168.11l-5 2a.5.5 0 0 1-.65-.65l2-5a.5.5 0 0 1 .11-.168zM11.207 2.5 13.5 4.793 14.793 3.5 12.5 1.207zm-2.768 3.557-7 7 2.828 2.828 7-7z"/>
                          </svg>
                          Edit
                        </button>
                        <button 
                          class="btn btn-outline-danger btn-sm"
                          @click="handleDelete(product.id)"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-trash" viewBox="0 0 16 16">
                            <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0z"/>
                            <path d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4zM2.5 3h11V2h-11z"/>
                          </svg>
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Product Modal -->
    <div class="modal fade" id="productModal" tabindex="-1" aria-labelledby="productModalLabel" aria-hidden="true">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="productModalLabel">
              {{ isEditing ? 'Edit Product' : 'Add New Product' }}
            </h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body">
            <form @submit.prevent="handleSubmit">
              <div class="mb-3">
                <label for="productName" class="form-label">Product Name</label>
                <input 
                  type="text" 
                  class="form-control" 
                  id="productName"
                  v-model="formData.name"
                  placeholder="Enter product name"
                  required
                >
              </div>

              <div class="mb-3">
                <label for="productPrice" class="form-label">Price</label>
                <div class="input-group">
                  <span class="input-group-text">$</span>
                  <input 
                    type="number" 
                    class="form-control" 
                    id="productPrice"
                    v-model="formData.price"
                    step="0.01"
                    min="0.01"
                    placeholder="0.00"
                    required
                  >
                </div>
              </div>

              <div class="mb-3">
                <label for="productCategory" class="form-label">Category</label>
                <select 
                  class="form-select" 
                  id="productCategory"
                  v-model="formData.category"
                  required
                >
                  <option v-for="category in categories" :key="category" :value="category">
                    {{ category }}
                  </option>
                </select>
              </div>
            </form>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
            <button 
              type="button" 
              class="btn btn-primary"
              @click="handleSubmit"
              :disabled="isLoading"
            >
              <span v-if="isLoading" class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
              {{ isEditing ? 'Update Product' : 'Add Product' }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.product-management {
  max-width: 1400px;
  margin: 0 auto;
}

.table th {
  border-top: none;
  font-weight: 600;
  color: #495057;
}

.table td {
  vertical-align: middle;
}

.badge {
  font-size: 0.85rem;
}

.btn-group .btn {
  border-radius: 0;
}

.btn-group .btn:first-child {
  border-top-left-radius: 4px;
  border-bottom-left-radius: 4px;
}

.btn-group .btn:last-child {
  border-top-right-radius: 4px;
  border-bottom-right-radius: 4px;
}

/* Responsive design - larger on desktop */
@media (min-width: 768px) {
  .table th {
    font-size: 0.95rem;
  }
  
  .table td {
    font-size: 0.95rem;
  }
}

@media (min-width: 1200px) {
  .table th {
    font-size: 1rem;
  }
  
  .table td {
    font-size: 1rem;
  }
}

/* Mobile responsive adjustments */
@media (max-width: 768px) {
  .btn-group {
    display: flex;
    flex-direction: column;
  }
  
  .btn-group .btn {
    border-radius: 4px;
    margin-bottom: 5px;
  }
  
  .table-responsive {
    font-size: 0.9rem;
  }
}
</style>
