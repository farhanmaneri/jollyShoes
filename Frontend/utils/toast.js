// utils/toast.js - Complete Toast Manager
import toast from "react-hot-toast";

class ToastManager {
  // Dismiss all toasts
  static dismissAll() {
    toast.dismiss();
  }

  // Success toast with unique ID
  static success(message, options = {}) {
    const id = `success-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    return toast.success(message, {
      id,
      duration: 2000,
      icon: "✅",
      style: {
        background: "#10B981",
        color: "#fff",
        fontWeight: "600",
      },
      ...options
    });
  }

  // Error toast with unique ID
  static error(message, options = {}) {
    const id = `error-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    return toast.error(message, {
      id,
      duration: 3000,
      icon: "❌",
      style: {
        background: "#EF4444",
        color: "#fff",
        fontWeight: "600",
      },
      ...options
    });
  }

  // Info toast with unique ID
  static info(message, options = {}) {
    const id = `info-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    return toast(message, {
      id,
      duration: 2500,
      icon: "ℹ️",
      style: {
        background: "#3B82F6",
        color: "#fff",
        fontWeight: "600",
      },
      ...options
    });
  }

  // Warning toast with unique ID
  static warning(message, options = {}) {
    const id = `warning-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    return toast(message, {
      id,
      duration: 3000,
      icon: "⚠️",
      style: {
        background: "#F59E0B",
        color: "#fff",
        fontWeight: "600",
      },
      ...options
    });
  }

  // Loading toast
  static loading(message, options = {}) {
    const id = `loading-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    return toast.loading(message, {
      id,
      style: {
        background: "#6B7280",
        color: "#fff",
        fontWeight: "600",
      },
      ...options
    });
  }

  // Dismiss specific toast
  static dismiss(toastId) {
    if (toastId) {
      toast.dismiss(toastId);
    } else {
      toast.dismiss();
    }
  }

  // Navigation helper - dismisses toasts before navigation
  static navigateWithDismiss(navigate, path, delay = 100) {
    this.dismissAll();
    setTimeout(() => {
      navigate(path);
    }, delay);
  }

  // Cart specific toasts
  static cartSuccess(message, icon = "🛒") {
    return this.success(message, { 
      icon, 
      duration: 2000,
      style: {
        background: "#059669",
        color: "#fff",
        fontWeight: "600",
      }
    });
  }

  static cartError(message, icon = "🚫") {
    return this.error(message, { 
      icon, 
      duration: 3000,
      style: {
        background: "#DC2626",
        color: "#fff",
        fontWeight: "600",
      }
    });
  }

  static stockError(message, icon = "📦") {
    return this.warning(message, { 
      icon, 
      duration: 3000,
      style: {
        background: "#D97706",
        color: "#fff",
        fontWeight: "600",
      }
    });
  }

  // Product specific toasts
  static productAdded(productName) {
    return this.cartSuccess(`${productName} added to cart!`, "🛒");
  }

  static productRemoved(productName) {
    return this.success(`${productName} removed from cart`, "🗑️");
  }

  static quantityUpdated(action) {
    const message = action === "increase" ? "Quantity increased!" : "Quantity decreased!";
    const icon = action === "increase" ? "➕" : "➖";
    return this.success(message, { icon, duration: 1500 });
  }

  // Size selection toasts
  static selectSize() {
    return this.error("Please select a size first", { 
      icon: "📏",
      duration: 3000 
    });
  }

  static sizeOutOfStock(size) {
    return this.stockError(`Size ${size} is out of stock`, "📦");
  }

  static notEnoughStock() {
    return this.stockError("Not enough stock available", "⚠️");
  }

  // Admin toasts
  static adminSuccess(message, icon = "⚡") {
    return this.success(message, { 
      icon,
      duration: 2500,
      style: {
        background: "#7C3AED",
        color: "#fff",
        fontWeight: "600",
      }
    });
  }

  static adminError(message, icon = "⚠️") {
    return this.error(message, { 
      icon,
      duration: 4000 
    });
  }

  // Promise toast for async operations
  static promise(promise, messages) {
    const loadingId = `promise-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    
    return toast.promise(promise, {
      loading: messages.loading || "Loading...",
      success: messages.success || "Success!",
      error: messages.error || "Something went wrong",
    }, {
      id: loadingId,
      style: {
        fontWeight: "600",
      },
      success: {
        duration: 2000,
        icon: "✅",
      },
      error: {
        duration: 4000,
        icon: "❌",
      },
    });
  }

  // Batch operations
  static showMultiple(toasts) {
    toasts.forEach((toastConfig, index) => {
      setTimeout(() => {
        const { type, message, options = {} } = toastConfig;
        switch (type) {
          case 'success':
            this.success(message, options);
            break;
          case 'error':
            this.error(message, options);
            break;
          case 'info':
            this.info(message, options);
            break;
          case 'warning':
            this.warning(message, options);
            break;
          default:
            this.info(message, options);
        }
      }, index * 200); // Stagger toasts by 200ms
    });
  }

  // Clear cart confirmation
  static confirmClearCart() {
    return this.success("Cart cleared successfully!", {
      icon: "🧹",
      duration: 2000,
      style: {
        background: "#059669",
        color: "#fff",
        fontWeight: "600",
      }
    });
  }

  // Checkout toasts
  static checkoutSuccess() {
    return this.success("Redirecting to checkout...", {
      icon: "💳",
      duration: 2000,
      style: {
        background: "#7C3AED",
        color: "#fff",
        fontWeight: "600",
      }
    });
  }
}

export default ToastManager;