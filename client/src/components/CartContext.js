import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { toast } from 'react-toastify';

const CartContext = createContext();

// Action types
const CART_ACTIONS = {
  ADD_TO_CART: 'ADD_TO_CART',
  REMOVE_FROM_CART: 'REMOVE_FROM_CART',
  UPDATE_QUANTITY: 'UPDATE_QUANTITY',
  CLEAR_CART: 'CLEAR_CART',
  SET_LOADING: 'SET_LOADING'
};

// Initial state
const initialState = {
  items: [],
  total: 0,
  itemCount: 0,
  sessionId: null,
  loading: false
};

// Cart reducer
function cartReducer(state, action) {
  switch (action.type) {
    case CART_ACTIONS.ADD_TO_CART: {
      const existingItem = state.items.find(item => item.productId === action.payload.productId);
      
      let newItems;
      if (existingItem) {
        newItems = state.items.map(item =>
          item.productId === action.payload.productId
            ? { ...item, quantity: item.quantity + action.payload.quantity }
            : item
        );
      } else {
        newItems = [...state.items, action.payload];
      }
      
      const newTotal = newItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
      const newItemCount = newItems.reduce((sum, item) => sum + item.quantity, 0);
      
      return {
        ...state,
        items: newItems,
        total: newTotal,
        itemCount: newItemCount
      };
    }
    
    case CART_ACTIONS.REMOVE_FROM_CART: {
      const newItems = state.items.filter(item => item.productId !== action.payload);
      const newTotal = newItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
      const newItemCount = newItems.reduce((sum, item) => sum + item.quantity, 0);
      
      return {
        ...state,
        items: newItems,
        total: newTotal,
        itemCount: newItemCount
      };
    }
    
    case CART_ACTIONS.UPDATE_QUANTITY: {
      const newItems = state.items.map(item =>
        item.productId === action.payload.productId
          ? { ...item, quantity: action.payload.quantity }
          : item
      ).filter(item => item.quantity > 0);
      
      const newTotal = newItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
      const newItemCount = newItems.reduce((sum, item) => sum + item.quantity, 0);
      
      return {
        ...state,
        items: newItems,
        total: newTotal,
        itemCount: newItemCount
      };
    }
    
    case CART_ACTIONS.CLEAR_CART: {
      return {
        ...state,
        items: [],
        total: 0,
        itemCount: 0
      };
    }
    
    case CART_ACTIONS.SET_LOADING: {
      return {
        ...state,
        loading: action.payload
      };
    }
    
    default:
      return state;
  }
}

// Cart Provider component
export function CartProvider({ children }) {
  const [state, dispatch] = useReducer(cartReducer, {
    ...initialState,
    sessionId: getOrCreateSessionId()
  });
  
  // Get or create session ID
  function getOrCreateSessionId() {
    let sessionId = localStorage.getItem('cart_session_id');
    if (!sessionId) {
      sessionId = uuidv4();
      localStorage.setItem('cart_session_id', sessionId);
    }
    return sessionId;
  }
  
  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('cart_items', JSON.stringify(state.items));
    localStorage.setItem('cart_total', state.total.toString());
  }, [state.items, state.total]);
  
  // Load cart from localStorage on mount
  useEffect(() => {
    try {
      const savedItems = localStorage.getItem('cart_items');
      
      if (savedItems) {
        const items = JSON.parse(savedItems);
        
        // Validate and fix cart items
        const validItems = items.filter(item => 
          item && 
          item.productId && 
          typeof item.price === 'number' && 
          typeof item.quantity === 'number' &&
          item.title
        );
        
        if (validItems.length > 0) {
          // Recalculate totals from valid items
          const total = validItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
          const itemCount = validItems.reduce((sum, item) => sum + item.quantity, 0);
          
          // Update state with valid items
          dispatch({
            type: CART_ACTIONS.CLEAR_CART
          });
          
          validItems.forEach(item => {
            dispatch({
              type: CART_ACTIONS.ADD_TO_CART,
              payload: item
            });
          });
        }
      }
    } catch (error) {
      console.error('Error loading cart from localStorage:', error);
      // Clear corrupted data
      localStorage.removeItem('cart_items');
      localStorage.removeItem('cart_total');
    }
  }, []);
  
  // Cart actions
  const addToCart = (product, quantity = 1) => {
    dispatch({
      type: CART_ACTIONS.ADD_TO_CART,
      payload: {
        productId: product.id,
        title: product.title,
        price: product.price,
        imageURL: product.imageURL,
        quantity: quantity
      }
    });
    
    toast.success(`${product.title} added to cart!`);
  };
  
  const removeFromCart = (productId) => {
    dispatch({
      type: CART_ACTIONS.REMOVE_FROM_CART,
      payload: productId
    });
    
    toast.info('Item removed from cart');
  };
  
  const updateQuantity = (productId, quantity) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    
    dispatch({
      type: CART_ACTIONS.UPDATE_QUANTITY,
      payload: { productId, quantity }
    });
  };
  
  const clearCart = () => {
    dispatch({
      type: CART_ACTIONS.CLEAR_CART
    });
    
    // Clear localStorage
    localStorage.removeItem('cart_items');
    localStorage.removeItem('cart_total');
    
    toast.info('Cart cleared');
  };
  
  const setLoading = (loading) => {
    dispatch({
      type: CART_ACTIONS.SET_LOADING,
      payload: loading
    });
  };
  
  // Get item from cart
  const getCartItem = (productId) => {
    return state.items.find(item => item.productId === productId);
  };
  
  // Check if item is in cart
  const isInCart = (productId) => {
    return state.items.some(item => item.productId === productId);
  };
  
  const value = {
    ...state,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    setLoading,
    getCartItem,
    isInCart
  };
  
  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

// Custom hook to use cart context
export function useCart() {
  const context = useContext(CartContext);
  
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  
  return context;
} 