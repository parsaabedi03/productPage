const LS_KEY = "products";

const emptyCartElement = document.querySelector(".emptyCart");
const checkoutBtn = document.getElementById("checkoutButton");

// Get parsed data from LocalStorage by key
const getLocalStorageData = (key) => {
  const storedData = localStorage.getItem(key);
  return storedData ? JSON.parse(storedData) : [];
};

// Show or hide the empty cart message
const toggleEmptyCartMessage = () =>
  !getLocalStorageData(LS_KEY).length
    ? emptyCartElement.classList.remove("d-none")
    : emptyCartElement.classList.add("d-none");

// Render cart items from LocalStorage into the DOM
const renderCartItems = () => {
  const products = getLocalStorageData(LS_KEY);
  const cartItemsContainer = document.querySelector(".cartItems");

  if (!products.length) return (cartItemsContainer.innerHTML = "");

  let html = "";
  products.forEach((product) => {
    html += `
      <div class="card">
        <div class="image">
          <img src="${product.image}" alt="${product.name}" />
        </div>
        <div class="cardInfo">
          <p class="productName font-montserrat-medium">${product.name}</p>
          <p class="productPrice">$ ${
            +product.price.split(" ")[1] * product.quantity
          }</p>
          <div class="quantity">
            <button class="decrease">−</button>
            <span>${product.quantity}</span>
            <button class="increase">+</button>
          </div>
        </div>
      </div>
    `;
  });
  cartItemsContainer.innerHTML = html;
};

// Calculate and display the total price of all products in the cart
const renderTotalPrice = () => {
  const products = getLocalStorageData(LS_KEY);
  const totalAmountElement = document.getElementById("totalAmount");

  let total = 0;
  products.forEach((product) => {
    total += +product.price.split(" ")[1] * product.quantity;
  });

  totalAmountElement.textContent = `$ ${total}`;
};

// Clear all cart data from LocalStorage and update the UI
const clearCart = () => {
  localStorage.clear();
  updateCartUI();
};

/**
 * Return the correct label for the decrease button
 * If quantity > 1 → minus sign, else → trash icon
 */
const getDecreaseButtonLabel = (quantity) => {
  return +quantity > 1 ? "−" : "🗑️";
};

// Attach click event listeners to increase and decrease buttons for each cart item
const attachCartItemEventListeners = () => {
  const cards = document.querySelectorAll(".card");

  cards.forEach((card) => {
    const productName = card
      .querySelector(".productName")
      .textContent.toLowerCase();
    const decreaseBtn = card.querySelector(".decrease");
    const increaseBtn = card.querySelector(".increase");
    const quantitySpan = card.querySelector("span");

    // Update decrease button icon if quantity is 1
    if (quantitySpan.textContent == 1)
      decreaseBtn.textContent = getDecreaseButtonLabel(
        quantitySpan.textContent
      );

    // Handle increase quantity
    increaseBtn.addEventListener("click", () => {
      const products = getLocalStorageData(LS_KEY);
      products.forEach((item) => {
        if (item.name === productName) {
          item.quantity += 1;
          quantitySpan.textContent = item.quantity;
          decreaseBtn.textContent = getDecreaseButtonLabel(item.quantity);
        }
      });
      localStorage.setItem(LS_KEY, JSON.stringify(products));
      updateCartUI();
    });

    // Handle decrease quantity or remove product
    decreaseBtn.addEventListener("click", () => {
      let products = getLocalStorageData(LS_KEY);

      products = products.filter((item) => {
        if (item.name === productName) {
          item.quantity -= 1;
          quantitySpan.textContent = item.quantity;
          decreaseBtn.textContent = getDecreaseButtonLabel(item.quantity);

          // Remove product if quantity is less than 1
          if (item.quantity < 1) {
            return false;
          }
        }
        return true;
      });

      localStorage.setItem(LS_KEY, JSON.stringify(products));
      updateCartUI();
    });
  });
};

/**
 * Update the entire cart UI:
 * - Empty cart message
 * - Total price
 * - Cart items list
 * - Event listeners
 */
const updateCartUI = () => {
  toggleEmptyCartMessage();
  renderTotalPrice();
  renderCartItems();
  attachCartItemEventListeners();
};

// Initialize the cart UI and checkout button functionality
window.addEventListener("load", () => {
  updateCartUI();
  checkoutBtn.addEventListener("click", clearCart);
});
