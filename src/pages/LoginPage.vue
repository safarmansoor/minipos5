<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { supabase } from '../services/supabase'

const router = useRouter()
const username = ref('')
const password = ref('')
const isLoading = ref(false)
const error = ref('')

// Check if user is already authenticated
onMounted(async () => {
  const { data: { session } } = await supabase.auth.getSession()
  if (session) {
    router.push('/sales')
  }
})

const handleLogin = async () => {
  if (!username.value || !password.value) {
    error.value = 'Please enter both username and password'
    return
  }

  isLoading.value = true
  error.value = ''

  try {
    // Check if Supabase is configured
    const { data, error: dbError } = await supabase
      .from('users')
      .select('*')
      .eq('username', username.value)
      .single()

    if (dbError && dbError.message.includes('Supabase not configured')) {
      // Demo mode - allow any login for testing
      const demoUser = {
        id: 'demo-user-' + Date.now(),
        username: username.value,
        role: 'cashier'
      }
      localStorage.setItem('user', JSON.stringify(demoUser))
      router.push('/sales')
      return
    }

    if (dbError) {
      error.value = 'Login failed. Please try again.'
      console.error('Login error:', dbError)
    } else if (!data) {
      error.value = 'Invalid username or password'
    } else {
      // Store user in localStorage for persistence
      localStorage.setItem('user', JSON.stringify(data))
      router.push('/sales')
    }
  } catch (err) {
    error.value = 'An unexpected error occurred'
    console.error('Login error:', err)
  } finally {
    isLoading.value = false
  }
}

const handleRegister = async () => {
  if (!username.value || !password.value) {
    error.value = 'Please enter both username and password'
    return
  }

  isLoading.value = true
  error.value = ''

  try {
    // Create new user
    const { data, error: dbError } = await supabase
      .from('users')
      .insert([
        {
          username: username.value,
          password_hash: password.value, // In real app, hash this!
          role: 'cashier'
        }
      ])
      .single()

    if (dbError) {
      error.value = 'Registration failed. User might already exist.'
      console.error('Registration error:', dbError)
    } else {
      // Store user in localStorage for persistence
      localStorage.setItem('user', JSON.stringify(data))
      router.push('/sales')
    }
  } catch (err) {
    error.value = 'An unexpected error occurred'
    console.error('Registration error:', err)
  } finally {
    isLoading.value = false
  }
}
</script>

<template>
  <div class="login-container">
    <div class="row justify-content-center">
      <div class="col-md-6 col-lg-4">
        <div class="card shadow-lg border-0">
          <div class="card-body p-4">
            <div class="text-center mb-4">
              <h2 class="text-primary fw-bold">Lalasa Bakery POS</h2>
              <p class="text-muted">Point of Sale System</p>
            </div>

            <form @submit.prevent="handleLogin">
              <div class="mb-3">
                <label for="username" class="form-label">Username</label>
                <input 
                  type="text" 
                  class="form-control form-control-lg" 
                  id="username"
                  v-model="username"
                  placeholder="Enter your username"
                  required
                >
              </div>

              <div class="mb-3">
                <label for="password" class="form-label">Password</label>
                <input 
                  type="password" 
                  class="form-control form-control-lg" 
                  id="password"
                  v-model="password"
                  placeholder="Enter your password"
                  required
                >
              </div>

              <div v-if="error" class="alert alert-danger" role="alert">
                {{ error }}
              </div>

              <div class="d-grid gap-2">
                <button 
                  type="submit" 
                  class="btn btn-primary btn-lg"
                  :disabled="isLoading"
                >
                  <span v-if="isLoading" class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                  {{ isLoading ? 'Signing In...' : 'Sign In' }}
                </button>
                
                <button 
                  type="button" 
                  class="btn btn-outline-primary btn-lg"
                  @click="handleRegister"
                  :disabled="isLoading"
                >
                  <span v-if="isLoading" class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                  {{ isLoading ? 'Creating Account...' : 'Create Account' }}
                </button>
              </div>
            </form>

            <div class="text-center mt-3">
              <div class="alert alert-warning" role="alert">
                <strong>⚠️ Demo Mode Active</strong><br>
                <small class="text-muted">
                  Replace Supabase credentials in .env.local to exit demo mode and use full database features.
                </small>
              </div>
              <small class="text-muted">
                Note: This is a demo system. In production, use proper authentication.
              </small>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.login-container {
  min-height: 80vh;
  display: flex;
  align-items: center;
  justify-content: center;
}

.card {
  border-radius: 12px;
}

.card-body {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border-radius: 12px;
}

.form-control {
  border-radius: 8px;
  border: none;
  box-shadow: none;
}

.btn {
  border-radius: 8px;
  font-weight: 600;
}

.btn-outline-primary {
  background: transparent;
  border: 2px solid rgba(255, 255, 255, 0.3);
  color: white;
}

.btn-outline-primary:hover {
  background: rgba(255, 255, 255, 0.1);
  border-color: rgba(255, 255, 255, 0.5);
}

.alert {
  border-radius: 8px;
}

/* Mobile responsive adjustments */
@media (max-width: 768px) {
  .login-container {
    padding: 1rem;
  }
  
  .card {
    margin: 0 1rem;
  }
}
</style>