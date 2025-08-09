const STORAGE_KEY = "products";

// Load products stored in localStorage
const loadCartProducts = () => {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
  } catch {
    return [];
  }
};

// Save products list to localStorage
const saveCartProducts = (products) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(products));
};

// Get references to DOM elements
const searchByName = document.getElementById("searchByName");
const buttons = document.querySelectorAll(".searchByCategory button");
const priceButton = document.getElementById("priceButton");
const cards = document.querySelectorAll(".card");

// Filter products based on search input by name
const searchName = (event) => {
  const searchValue = event.target.value.toLowerCase();
  cards.forEach((card) => {
    const cardName = card.querySelector("h3").textContent.toLowerCase();
    card.style.display = cardName.includes(searchValue) ? "block" : "none";
  });
};

// Filter products by category when category button is clicked
const searchCategory = (button) => {
  buttons.forEach((item) => item.classList.remove("active"));
  button.classList.add("active");

  const category = button.dataset.category;
  cards.forEach((card) => {
    const cardCategory = card.dataset.category;
    if (category === "all" || category === cardCategory) {
      card.style.display = "block";
    } else {
      card.style.display = "none";
    }
  });
};

// Filter products based on price input
const searchPrice = () => {
  const priceInput = +document.getElementById("searchByPrice").value;
  cards.forEach((card) => {
    const priceText = card.querySelector("p").textContent;
    const price = +priceText.split(" ")[1];
    if (!priceInput || priceInput === price) {
      card.style.display = "block";
    } else {
      card.style.display = "none";
    }
  });
};

// Add a new product to cart or increase quantity if it already exists
const addProductToCart = (card) => {
  const products = loadCartProducts();

  const product = {
    image: card.querySelector("img").src,
    name: card.querySelector("h3").textContent.toLowerCase(),
    price: card.querySelector("p").textContent.toLowerCase(),
    quantity: 1,
  };

  const existingProduct = products.find((p) => p.name === product.name);
  if (existingProduct) {
    existingProduct.quantity++;
  } else {
    products.push(product);
  }

  saveCartProducts(products);

  const quantityContainer = card.querySelector(".quantity");
  const addButton = card.querySelector(".addToCart");
  const quantitySpan = quantityContainer.querySelector("span");
  const reduceBtn = quantityContainer.querySelector(".reduce");

  quantityContainer.classList.remove("d-none");
  addButton.classList.add("d-none");
  quantitySpan.textContent = existingProduct ? existingProduct.quantity : 1;
  reduceBtn.textContent = getReduceButtonSymbol(quantitySpan.textContent);
};

// Get the symbol for the reduce button based on current quantity
const getReduceButtonSymbol = (quantity) => {
  return +quantity > 1 ? "−" : "🗑️";
};

// Increase the quantity of a product in the cart and update the UI
const increaseQuantity = (card) => {
  const products = loadCartProducts();
  const productName = card.querySelector("h3").textContent.toLowerCase();
  const quantitySpan = card.querySelector(".quantity span");
  const reduceBtn = card.querySelector(".quantity .reduce");

  const product = products.find((p) => p.name === productName);
  if (product) {
    product.quantity++;
    saveCartProducts(products);

    quantitySpan.textContent = product.quantity;
    reduceBtn.textContent = getReduceButtonSymbol(product.quantity);
  }
};

// Decrease the quantity of a product in the cart, update UI or remove product if quantity reaches zero
const decreaseQuantity = (card) => {
  const products = loadCartProducts();
  const productName = card.querySelector("h3").textContent.toLowerCase();
  const quantityContainer = card.querySelector(".quantity");
  const quantitySpan = quantityContainer.querySelector("span");
  const reduceBtn = quantityContainer.querySelector(".reduce");
  const addButton = card.querySelector(".addToCart");

  const productIndex = products.findIndex((p) => p.name === productName);
  if (productIndex > -1) {
    products[productIndex].quantity--;

    if (products[productIndex].quantity < 1) {
      products.splice(productIndex, 1);
      quantityContainer.classList.add("d-none");
      addButton.classList.remove("d-none");
    } else {
      quantitySpan.textContent = products[productIndex].quantity;
      reduceBtn.textContent = getReduceButtonSymbol(
        products[productIndex].quantity
      );
    }

    saveCartProducts(products);
  }
};

// Initialize cart UI on page load to display correct product quantities
const initializeCartUI = () => {
  const products = loadCartProducts();

  cards.forEach((card) => {
    const productName = card.querySelector("h3").textContent.toLowerCase();
    const quantityContainer = card.querySelector(".quantity");
    const addButton = card.querySelector(".addToCart");
    const quantitySpan = quantityContainer.querySelector("span");
    const reduceBtn = quantityContainer.querySelector(".reduce");

    const product = products.find((p) => p.name === productName);
    if (product) {
      quantityContainer.classList.remove("d-none");
      addButton.classList.add("d-none");
      quantitySpan.textContent = product.quantity;
      reduceBtn.textContent = getReduceButtonSymbol(product.quantity);
    }
  });
};

// Attach event listeners to each card's buttons
const attachCardEventListeners = () => {
  cards.forEach((card) => {
    const addBtn = card.querySelector(".addToCart");
    const addQtyBtn = card.querySelector(".add");
    const reduceQtyBtn = card.querySelector(".reduce");

    addBtn.addEventListener("click", () => addProductToCart(card));
    addQtyBtn.addEventListener("click", () => increaseQuantity(card));
    reduceQtyBtn.addEventListener("click", () => decreaseQuantity(card));
  });
};

// Main setup on page load
window.addEventListener("load", () => {
  attachCardEventListeners();
  initializeCartUI();

  buttons.forEach((button) => {
    button.addEventListener("click", () => searchCategory(button));
  });
  searchByName.addEventListener("keyup", searchName);
  priceButton.addEventListener("click", searchPrice);
});
