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

const sales = ref([])
const filteredSales = ref([])
const isLoading = ref(false)
const error = ref('')
const success = ref('')

// Get current user
const currentUser = JSON.parse(localStorage.getItem('user'))

onMounted(async () => {
  if (!currentUser) {
    // Redirect to login handled by router guard
    return
  }
  await loadSales()
})

// Watch for search query changes
watch(() => props.searchQuery, (newQuery) => {
  if (newQuery.trim() === '') {
    filteredSales.value = sales.value
  } else {
    filteredSales.value = sales.value.filter(sale =>
      sale.id.toString().includes(newQuery) ||
      new Date(sale.created_at).toLocaleDateString().includes(newQuery) ||
      sale.status.toLowerCase().includes(newQuery.toLowerCase())
    )
  }
})

const loadSales = async () => {
  isLoading.value = true
  error.value = ''
  
  try {
    const { data, error: dbError } = await supabase
      .from('sales')
      .select('*')
      .eq('user_id', currentUser.id)
      .order('created_at', { ascending: false })

    if (dbError) {
      error.value = 'Failed to load sales history'
      console.error('Load sales error:', dbError)
    } else {
      sales.value = data || []
      filteredSales.value = sales.value
    }
  } catch (err) {
    error.value = 'An unexpected error occurred'
    console.error('Load sales error:', err)
  } finally {
    isLoading.value = false
  }
}

const handleCancelSale = async (saleId) => {
  if (!confirm('Are you sure you want to cancel this sale? This action cannot be undone.')) {
    return
  }

  isLoading.value = true
  error.value = ''

  try {
    const { data, error: dbError } = await supabase
      .from('sales')
      .update({
        status: 'cancelled'
      })
      .eq('id', saleId)
      .single()

    if (dbError) {
      error.value = 'Failed to cancel sale'
      console.error('Cancel sale error:', dbError)
    } else {
      // Update local state
      const index = sales.value.findIndex(s => s.id === saleId)
      if (index !== -1) {
        sales.value[index] = data
      }
      filteredSales.value = sales.value
      success.value = 'Sale cancelled successfully!'
    }
  } catch (err) {
    error.value = 'An unexpected error occurred'
    console.error('Cancel sale error:', err)
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

const formatDate = (dateString) => {
  return new Date(dateString).toLocaleString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

const getStatusBadgeClass = (status) => {
  switch (status) {
    case 'completed':
      return 'bg-success'
    case 'cancelled':
      return 'bg-danger'
    default:
      return 'bg-secondary'
  }
}
</script>

<template>
  <div class="sales-history">
    <!-- Page Header -->
    <div class="row mb-4">
      <div class="col-12">
        <h2 class="text-primary fw-bold">Sales History</h2>
        <p class="text-muted">View and manage your sales records</p>
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
          <div class="card-header bg-white">
            <h5 class="card-title mb-0">Sales Records</h5>
          </div>
          <div class="card-body">
            <div v-if="isLoading" class="text-center py-5">
              <div class="spinner-border text-primary" role="status">
                <span class="visually-hidden">Loading...</span>
              </div>
            </div>
            
            <div v-else-if="filteredSales.length === 0" class="text-center py-5">
              <h5 class="text-muted">No sales found</h5>
              <p class="text-muted">Make your first sale to see it here</p>
            </div>

            <div v-else class="table-responsive">
              <table class="table table-hover">
                <thead>
                  <tr>
                    <th>Sale ID</th>
                    <th>Date & Time</th>
                    <th>Items</th>
                    <th>Total</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="sale in filteredSales" :key="sale.id">
                    <td>
                      <strong>#{{ sale.id }}</strong>
                    </td>
                    <td>
                      {{ formatDate(sale.created_at) }}
                    </td>
                    <td>
                      <span class="badge bg-primary">{{ sale.items.length }}</span>
                      <button 
                        class="btn btn-sm btn-outline-primary ms-2"
                        data-bs-toggle="modal"
                        :data-bs-target="'#saleModal' + sale.id"
                      >
                        View Items
                      </button>
                    </td>
                    <td class="text-primary fw-bold">
                      {{ formatCurrency(sale.total) }}
                    </td>
                    <td>
                      <span 
                        class="badge"
                        :class="getStatusBadgeClass(sale.status)"
                      >
                        {{ sale.status }}
                      </span>
                    </td>
                    <td>
                      <button 
                        v-if="sale.status === 'completed'"
                        class="btn btn-outline-danger btn-sm"
                        @click="handleCancelSale(sale.id)"
                        :disabled="isLoading"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-x-circle me-2" viewBox="0 0 16 16">
                          <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14m0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16"/>
                          <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708"/>
                        </svg>
                        Cancel Sale
                      </button>
                      <span v-else class="text-muted">Cancelled</span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Sale Details Modal -->
    <div 
      v-for="sale in filteredSales" 
      :key="sale.id"
      class="modal fade" 
      :id="'saleModal' + sale.id" 
      tabindex="-1" 
      :aria-labelledby="'saleModalLabel' + sale.id" 
      aria-hidden="true"
    >
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" :id="'saleModalLabel' + sale.id">
              Sale Details - #{{ sale.id }}
            </h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body">
            <div class="row mb-3">
              <div class="col-md-6">
                <strong>Date:</strong><br>
                {{ formatDate(sale.created_at) }}
              </div>
              <div class="col-md-6">
                <strong>Status:</strong><br>
                <span 
                  class="badge"
                  :class="getStatusBadgeClass(sale.status)"
                >
                  {{ sale.status }}
                </span>
              </div>
            </div>

            <div class="table-responsive">
              <table class="table table-sm">
                <thead>
                  <tr>
                    <th>Product</th>
                    <th>Qty</th>
                    <th>Price</th>
                    <th>Total</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="item in sale.items" :key="item.id">
                    <td>{{ item.name }}</td>
                    <td>{{ item.quantity }}</td>
                    <td>{{ formatCurrency(item.price) }}</td>
                    <td>{{ formatCurrency(item.price * item.quantity) }}</td>
                  </tr>
                </tbody>
                <tfoot>
                  <tr class="table-primary">
                    <td colspan="3" class="text-end"><strong>Total:</strong></td>
                    <td><strong>{{ formatCurrency(sale.total) }}</strong></td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
            <button 
              v-if="sale.status === 'completed'"
              type="button" 
              class="btn btn-danger"
              @click="handleCancelSale(sale.id)"
              data-bs-dismiss="modal"
              :disabled="isLoading"
            >
              Cancel Sale
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.sales-history {
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
  .table-responsive {
    font-size: 0.9rem;
  }
  
  .modal-body .row {
    font-size: 0.9rem;
  }
}
</style>
