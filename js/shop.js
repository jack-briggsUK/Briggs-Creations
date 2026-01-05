// shop.js

const productGrid = document.getElementById("product-grid");

// Init
document.addEventListener("DOMContentLoaded", () => {
  renderProducts();
});

// Render all products from products.js
function renderProducts() {
  if (!productGrid || !Array.isArray(products)) return;

  productGrid.innerHTML = "";

  products.forEach(product => {
    const card = document.createElement("div");
    card.className = "product-card";

    card.innerHTML = `
      <a href="product.html?id=${product.id}" class="product-image">
        <img src="${product.image}" alt="${product.title}" loading="lazy" />
      </a>

      <div class="product-info">
        <h3>${product.title}</h3>
        <p class="price">£${product.price.toFixed(2)}</p>

        <div class="product-actions">
          <a href="product.html?id=${product.id}" class="btn-secondary">View</a>
          <button
            class="btn-primary"
            type="button"
            data-id="${product.id}"
          >
            Add to basket
          </button>
        </div>
      </div>
    `;

    productGrid.appendChild(card);
  });

  bindAddToCartButtons();
}

// Add to cart buttons + animations
function bindAddToCartButtons() {
  const buttons = document.querySelectorAll("button[data-id]");

  buttons.forEach(button => {
    button.addEventListener("click", () => {
      const productId = button.getAttribute("data-id");

      addToCart(productId, 1);

      // Button feedback (✓ Added)
      button.classList.add("added");
      setTimeout(() => {
        button.classList.remove("added");
      }, 1200);

      // Basket count bump
      const countEl = document.getElementById("cart-count");
      if (countEl) {
        countEl.classList.remove("bump");
        void countEl.offsetWidth; // force reflow
        countEl.classList.add("bump");
      }
    });
  });
}
