import { ref, computed } from 'vue'

export function useCart() {
  const cart = ref([])

  // Load cart from localStorage on initialization
  const loadCart = () => {
    const savedCart = localStorage.getItem('cart')
    if (savedCart) {
      cart.value = JSON.parse(savedCart)
    }
  }

  // Save cart to localStorage
  const saveCart = () => {
    localStorage.setItem('cart', JSON.stringify(cart.value))
  }

  // Add item to cart
  const addToCart = (product) => {
    const existingItem = cart.value.find(item => item.id === product.id)
    
    if (existingItem) {
      existingItem.quantity += 1
    } else {
      cart.value.push({
        id: product.id,
        name: product.name,
        price: product.price,
        category: product.category,
        quantity: 1
      })
    }
    
    saveCart()
  }

  // Remove item from cart
  const removeFromCart = (productId) => {
    cart.value = cart.value.filter(item => item.id !== productId)
    saveCart()
  }

  // Update item quantity
  const updateQuantity = (productId, newQuantity) => {
    if (newQuantity <= 0) {
      removeFromCart(productId)
      return
    }

    const item = cart.value.find(item => item.id === productId)
    if (item) {
      item.quantity = newQuantity
      saveCart()
    }
  }

  // Clear cart
  const clearCart = () => {
    cart.value = []
    saveCart()
  }

  // Calculate total
  const calculateTotal = computed(() => {
    return cart.value.reduce((total, item) => {
      return total + (item.price * item.quantity)
    }, 0)
  })

  // Calculate item count
  const itemCount = computed(() => {
    return cart.value.reduce((count, item) => {
      return count + item.quantity
    }, 0)
  })

  // Initialize cart
  loadCart()

  return {
    cart,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    calculateTotal,
    itemCount
  }
}