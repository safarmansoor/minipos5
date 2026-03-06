<script setup>
import { ref, onMounted, computed, watch } from 'vue'
import { useRouter } from 'vue-router'
import { supabase } from '../services/supabase'
import { useCart } from '../composables/useCart'

// Props for search functionality
const props = defineProps({
  searchQuery: {
    type: String,
    default: ''
  }
})

const router = useRouter()
const products = ref([])
const filteredProducts = ref([])
const isLoading = ref(false)
const error = ref('')

// Cart functionality
const { cart, addToCart, removeFromCart, updateQuantity, clearCart, calculateTotal } = useCart()

// Get current user
const currentUser = JSON.parse(localStorage.getItem('user'))

onMounted(async () => {
  if (!currentUser) {
    router.push('/login')
    return
  }
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

const handleAddToCart = (product) => {
  addToCart(product)
}

const handleCharge = async () => {
  if (cart.value.length === 0) {
    alert('Please add items to cart before charging')
    return
  }

  isLoading.value = true
  error.value = ''

  try {
    const total = calculateTotal()
    const items = cart.value.map(item => ({
      id: item.id,
      name: item.name,
      price: item.price,
      quantity: item.quantity,
      category: item.category
    }))

    // Save sale to database
    const { data, error: dbError } = await supabase
      .from('sales')
      .insert([
        {
          user_id: currentUser.id,
          items: items,
          total: total,
          status: 'completed'
        }
      ])
      .single()

    if (dbError) {
      error.value = 'Failed to save sale'
      console.error('Save sale error:', dbError)
    } else {
      // Clear cart and show success
      clearCart()
      alert('Sale completed successfully!')
    }
  } catch (err) {
    error.value = 'An unexpected error occurred'
    console.error('Charge error:', err)
  } finally {
    isLoading.value = false
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
  <div class="sales-page">
    <!-- Page Header -->
    <div class="row mb-4">
      <div class="col-12">
        <h2 class="text-primary fw-bold">Sales Terminal</h2>
        <p class="text-muted">Select products to add to cart</p>
      </div>
    </div>

    <!-- Error Alert -->
    <div v-if="error" class="alert alert-danger alert-dismissible fade show" role="alert">
      {{ error }}
      <button type="button" class="btn-close" @click="error = ''"></button>
    </div>

    <div class="row">
      <!-- Product Grid -->
      <div class="col-lg-8">
        <div class="card shadow-sm">
          <div class="card-header bg-white">
            <h5 class="card-title mb-0">Products</h5>
          </div>
          <div class="card-body">
            <div v-if="isLoading" class="text-center py-5">
              <div class="spinner-border text-primary" role="status">
                <span class="visually-hidden">Loading...</span>
              </div>
            </div>
            
            <div v-else-if="filteredProducts.length === 0" class="text-center py-5">
              <h5 class="text-muted">No products found</h5>
              <p class="text-muted">Try adjusting your search or add new products</p>
            </div>

            <div v-else class="row g-3">
              <div 
                v-for="product in filteredProducts" 
                :key="product.id"
                class="col-6 col-sm-4 col-md-3 col-lg-4 col-xl-3"
              >
                <div 
                  class="product-card card h-100 border-0 shadow-sm"
                  @click="handleAddToCart(product)"
                >
                  <div class="card-body text-center p-3">
                    <div class="product-icon mb-2">
                      <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" fill="currentColor" class="bi bi-cup-hot text-primary" viewBox="0 0 16 16">
                        <path d="M.5 1a.5.5 0 0 0 0 1h1.11l.401 1.607 1.495 7.97A1 1 0 0 0 4.413 13h5.172a1 1 0 0 0 .996-.866l1.495-7.97L13.68 2h1.11a.5.5 0 0 0 0-1h-13Zm1.5 1h12.934l-1.368 7.151a.5.5 0 0 1-.489.399H4.317a.5.5 0 0 1-.489-.399L2.46 2H2Zm-.437 8.5h13.874L15 14H1l1.063-2.5Zm1.629-6.5 1.256 5h9.71l1.256-5H2.152Z"/>
                      </svg>
                    </div>
                    <h6 class="product-name fw-semibold">{{ product.name }}</h6>
                    <p class="product-category text-muted small">{{ product.category }}</p>
                    <div class="product-price text-primary fw-bold">
                      {{ formatCurrency(product.price) }}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Cart Sidebar -->
      <div class="col-lg-4">
        <div class="card shadow-sm">
          <div class="card-header bg-white">
            <h5 class="card-title mb-0">Cart</h5>
          </div>
          <div class="card-body">
            <div v-if="cart.length === 0" class="text-center py-4">
              <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" fill="currentColor" class="bi bi-cart text-muted mb-3" viewBox="0 0 16 16">
                <path d="M0 1.5A.5.5 0 0 1 .5 1H2a.5.5 0 0 1 .485.379L2.89 3H14.5a.5.5 0 0 1 .491.592l-1.5 8A.5.5 0 0 1 13 12H4a.5.5 0 0 1-.491-.408L2.01 3.607 1.61 2H.5a.5.5 0 0 1-.5-.5M3.102 4l1.313 7h8.17l1.313-7zM5 12a2 2 0 1 0 0 4 2 2 0 0 0 0-4m7 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4m-7 1a1 1 0 1 1 0 2 1 1 0 0 1 0-2m7 0a1 1 0 1 1 0 2 1 1 0 0 1 0-2"/>
              </svg>
              <p class="text-muted">Your cart is empty</p>
              <p class="text-muted small">Add products to start a sale</p>
            </div>

            <div v-else>
              <div class="cart-items">
                <div 
                  v-for="item in cart" 
                  :key="item.id"
                  class="cart-item d-flex align-items-center justify-content-between border-bottom py-2"
                >
                  <div class="flex-grow-1">
                    <h6 class="mb-1">{{ item.name }}</h6>
                    <p class="text-muted small mb-0">{{ formatCurrency(item.price) }} x {{ item.quantity }}</p>
                  </div>
                  <div class="d-flex align-items-center">
                    <button 
                      class="btn btn-sm btn-outline-secondary me-2"
                      @click.stop="updateQuantity(item.id, item.quantity - 1)"
                      :disabled="item.quantity <= 1"
                    >
                      -
                    </button>
                    <span class="fw-bold">{{ item.quantity }}</span>
                    <button 
                      class="btn btn-sm btn-outline-secondary ms-2"
                      @click.stop="updateQuantity(item.id, item.quantity + 1)"
                    >
                      +
                    </button>
                    <button 
                      class="btn btn-sm btn-danger ms-2"
                      @click.stop="removeFromCart(item.id)"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-trash" viewBox="0 0 16 16">
                        <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0z"/>
                        <path d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4zM2.5 3h11V2h-11z"/>
                      </svg>
                    </button>
                  </div>
                </div>
              </div>

              <div class="cart-summary border-top pt-3 mt-3">
                <div class="d-flex justify-content-between mb-2">
                  <span class="text-muted">Subtotal:</span>
                  <span class="fw-bold">{{ formatCurrency(calculateTotal()) }}</span>
                </div>
                <div class="d-flex justify-content-between mb-3">
                  <span class="text-muted">Items:</span>
                  <span class="fw-bold">{{ cart.reduce((sum, item) => sum + item.quantity, 0) }}</span>
                </div>
                
                <button 
                  class="btn btn-primary btn-lg w-100"
                  @click="handleCharge"
                  :disabled="isLoading"
                >
                  <span v-if="isLoading" class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                  CHARGE ({{ formatCurrency(calculateTotal()) }})
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.sales-page {
  max-width: 1400px;
  margin: 0 auto;
}

.product-card {
  cursor: pointer;
  transition: all 0.2s ease;
  border: 2px solid transparent;
  height: 100%;
  display: flex;
  flex-direction: column;
}

.product-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0,0,0,0.15);
  border-color: #e9ecef;
}

.product-card:active {
  transform: translateY(0);
}

.product-name {
  font-size: 0.9rem;
  line-height: 1.2;
  min-height: 2.4rem;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  flex-grow: 1;
}

.product-category {
  margin-bottom: 0.5rem;
}

.product-price {
  font-size: 1.1rem;
  margin-top: auto;
}

.cart-item {
  transition: all 0.2s ease;
}

.cart-item:hover {
  background-color: #f8f9fa;
  border-radius: 8px;
}

.cart-summary {
  background-color: #f8f9fa;
  padding: 1.5rem;
  border-radius: 12px;
  position: sticky;
  top: 100px;
  align-self: flex-start;
}

/* Responsive design - better desktop experience */
@media (min-width: 768px) {
  .product-card {
    min-height: 200px;
  }
  
  .product-name {
    font-size: 1rem;
  }
  
  .product-price {
    font-size: 1.25rem;
  }
}

@media (min-width: 1200px) {
  .product-card {
    min-height: 220px;
  }
  
  .product-name {
    font-size: 1.1rem;
  }
  
  .product-price {
    font-size: 1.35rem;
  }
}

/* Mobile responsive adjustments */
@media (max-width: 768px) {
  .product-card {
    margin-bottom: 1rem;
  }
  
  .cart-summary {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    background: white;
    box-shadow: 0 -2px 10px rgba(0,0,0,0.1);
    z-index: 100;
    margin: 0;
    border-top-left-radius: 12px;
    border-top-right-radius: 12px;
    padding: 1rem;
  }
  
  .sales-page {
    padding-bottom: 140px; /* Space for fixed cart summary */
  }
}
</style>
