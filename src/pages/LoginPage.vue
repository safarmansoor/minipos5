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
    console.log('Attempting login for user:', username.value)
    
    // Check if Supabase is configured
    const { data, error: dbError } = await supabase
      .from('users')
      .select('*')
      .eq('username', username.value)
      .single()

    console.log('Supabase response:', { data, dbError })

    if (dbError) {
      error.value = 'Database connection failed. Please check your Supabase configuration.'
      console.error('Login error:', dbError)
      return
    }

    if (!data) {
      error.value = 'Invalid username or password'
      console.log('No user found')
    } else {
      console.log('User found, logging in:', data)
      // Store user in localStorage for persistence
      localStorage.setItem('user', JSON.stringify(data))
      console.log('User stored in localStorage')
      router.push('/sales')
      console.log('Navigation triggered')
    }
  } catch (err) {
    error.value = 'An unexpected error occurred. Please check your Supabase configuration.'
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
  <div class="login-page">
    <div class="login-card">
      <div class="login-header text-center mb-4">
        <h1 class="login-title">Welcome</h1>
        <p class="login-subtitle">Lalasa Bakery POS System</p>
      </div>

      <form @submit.prevent="handleLogin" class="login-form">
        <div class="mb-3">
          <label for="username" class="form-label">Username</label>
          <input 
            type="text" 
            class="form-control" 
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
            class="form-control" 
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

      <div class="login-footer text-center mt-3">
        <small class="text-muted">
          Please use your credentials to access the POS system.
        </small>
      </div>
    </div>
  </div>
</template>

<style scoped>
.login-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem 0;
  flex: 1;
}

.login-card {
  width: 100%;
  max-width: 400px;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border-radius: 16px;
  padding: 2rem;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
}

.login-header {
  margin-bottom: 2rem;
}

.login-title {
  margin: 0 0 0.5rem 0;
  font-size: 2rem;
  font-weight: 700;
  color: #2c3e50;
  letter-spacing: -0.5px;
}

.login-subtitle {
  margin: 0;
  font-size: 1rem;
  color: #6c757d;
  font-weight: 500;
}

.login-form {
  margin-bottom: 2rem;
}

.form-control {
  border: 1px solid #e9ecef;
  border-radius: 12px;
  padding: 0.75rem 1rem;
  font-size: 1rem;
  transition: all 0.3s ease;
}

.form-control:focus {
  border-color: #0d6efd;
  box-shadow: 0 0 0 3px rgba(13, 110, 253, 0.25);
  outline: none;
}

.form-label {
  font-weight: 600;
  color: #495057;
  margin-bottom: 0.5rem;
}

.btn {
  border-radius: 12px;
  font-weight: 600;
  padding: 0.75rem 1rem;
  transition: all 0.3s ease;
}

.btn-primary {
  background: linear-gradient(135deg, #0d6efd 0%, #0dcaf0 100%);
  border: none;
  color: white;
}

.btn-primary:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(13, 110, 253, 0.4);
}

.btn-outline-primary {
  border: 2px solid #0d6efd;
  color: #0d6efd;
  background: transparent;
}

.btn-outline-primary:hover {
  background: #0d6efd;
  color: white;
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(13, 110, 253, 0.3);
}

.alert {
  border-radius: 12px;
  border: none;
  margin-bottom: 1rem;
}

.login-footer {
  padding-top: 1rem;
  border-top: 1px solid #e9ecef;
}

.login-footer small {
  color: #6c757d;
}

/* Mobile responsive adjustments */
@media (max-width: 768px) {
  .login-page {
    padding: 1rem 0;
    min-height: 50vh;
  }
  
  .login-card {
    padding: 1.5rem;
    margin: 0 1rem;
  }
  
  .login-title {
    font-size: 1.5rem;
  }
  
  .login-subtitle {
    font-size: 0.875rem;
  }
}

/* Tablet responsive adjustments */
@media (min-width: 769px) and (max-width: 1024px) {
  .login-card {
    padding: 2.5rem;
  }
}
</style>
