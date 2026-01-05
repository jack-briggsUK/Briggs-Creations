// js/cart.js
// Persistent basket stored in localStorage

const CART_STORAGE_KEY = "briggs_creations_cart";

/* ================================
   Internal helpers
   ================================ */

function loadCart() {
  try {
    const cart = JSON.parse(localStorage.getItem(CART_STORAGE_KEY));
    return Array.isArray(cart) ? cart : [];
  } catch (e) {
    return [];
  }
}

function saveCart(cart) {
  localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
}

/*
Cart item shape:
{
  id: "red-squirrel",
  quantity: 2
}
*/

/* ================================
   Public API
   ================================ */

function getCart() {
  return loadCart();
}

function addToCart(productId, quantity = 1) {
  const cart = loadCart();
  const existingItem = cart.find(item => item.id === productId);

  if (existingItem) {
    existingItem.quantity += quantity;
  } else {
    cart.push({ id: productId, quantity });
  }

  saveCart(cart);
  dispatchCartUpdated();
}

function removeFromCart(productId) {
  const cart = loadCart().filter(item => item.id !== productId);
  saveCart(cart);
  dispatchCartUpdated();
}

function updateCartQuantity(productId, quantity) {
  const cart = loadCart();

  const item = cart.find(i => i.id === productId);
  if (!item) return;

  if (quantity <= 0) {
    removeFromCart(productId);
    return;
  }

  item.quantity = quantity;
  saveCart(cart);
  dispatchCartUpdated();
}

function clearCart() {
  saveCart([]);
  dispatchCartUpdated();
}

function getCartItemCount() {
  return loadCart().reduce((total, item) => total + item.quantity, 0);
}

/* ================================
   Pricing helpers
   ================================ */

function getCartItemsWithDetails() {
  if (!window.products) return [];

  return loadCart()
    .map(item => {
      const product = window.products.find(p => p.id === item.id);
      if (!product) return null;

      return {
        ...product,
        quantity: item.quantity,
        name: product.title,
        lineTotal: product.price * item.quantity
      };
    })
    .filter(Boolean);
}

function getCartSubtotal() {
  return getCartItemsWithDetails()
    .reduce((sum, item) => sum + item.lineTotal, 0);
}

function getShippingCost() {
  return getCartItemCount() > 0 ? 4.99 : 0;
}

function getCartTotal() {
  return getCartSubtotal() + getShippingCost();
}

/* ================================
   Events
   ================================ */

function dispatchCartUpdated() {
  window.dispatchEvent(new Event("cartUpdated"));
}

document.addEventListener("DOMContentLoaded", () => {
  const checkoutBtn = document.getElementById("checkout-button");
  if (checkoutBtn) {
    checkoutBtn.addEventListener("click", checkoutCart);
  }
});


async function checkoutCart() {
  const cartItems = getCartItemsWithDetails();

  const checkoutBtn = document.getElementById("checkout-button");
  if (!checkoutBtn) return;

  // Show loading state
  checkoutBtn.disabled = true;
  checkoutBtn.classList.add("loading");


  if (cartItems.length === 0) {
    alert("Your cart is empty!");
    checkoutBtn.disabled = false;
    checkoutBtn.classList.remove("loading");
    return;
  }

  // Prepare payload for Worker
  const payload = cartItems.map(item => ({
    name: item.name,
    price: item.price, // in GBP
    quantity: item.quantity
  }));

  try {
    const response = await fetch("https://stripe-checkout.charlotte-briggscreations.workers.dev", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ items: payload })
    });

    const data = await response.json();

    if (data.url) {
      // Redirect to Stripe Checkout
      window.location.href = data.url;
    } else {
      console.error("Stripe session creation failed", data);
      alert("Unable to start checkout. Please try again.");
      checkoutBtn.disabled = false;
      checkoutBtn.classList.remove("loading");
    }
  } catch (err) {
    console.error("Error during checkout:", err);
    alert("An error occurred. Please try again.");
    checkoutBtn.disabled = false;
    checkoutBtn.classList.remove("loading");
  }
}


/* ================================
   Expose API globally
   ================================ */

window.getCart = getCart;
window.addToCart = addToCart;
window.removeFromCart = removeFromCart;
window.updateCartQuantity = updateCartQuantity;
window.clearCart = clearCart;

window.getCartItemCount = getCartItemCount;
window.getCartItemsWithDetails = getCartItemsWithDetails;
window.getCartSubtotal = getCartSubtotal;
window.getShippingCost = getShippingCost;
window.getCartTotal = getCartTotal;

/* ================================
Update Heder Cart
================================ */

function updateHeaderCartCount() {
  const countEl = document.getElementById("cart-count");
  if (!countEl) return;

  const count = getCartItemCount();
  countEl.textContent = count;

  if (count === 0) {
    countEl.classList.add("is-empty");
  } else {
    countEl.classList.remove("is-empty");
  }
}

window.addEventListener("cartUpdated", updateHeaderCartCount);
document.addEventListener("DOMContentLoaded", updateHeaderCartCount);
