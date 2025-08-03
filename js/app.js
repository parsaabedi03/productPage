// Get references to DOM elements for search and filter functionality
const searchByName = document.getElementById("searchByName");
const buttons = document.querySelectorAll(".searchByCategory button");
const priceButton = document.getElementById("priceButton");
const cards = document.querySelectorAll(".card");

// Retrieve products from localStorage, or return empty array if none exist
const getLocalStorage = () => {
  const localStorageData = localStorage.getItem("products");
  return localStorageData ? JSON.parse(localStorageData) : [];
};

// Filter cards by product name as user types in the search input
const searchName = (event) => {
  const searchValue = event.target.value.toLowerCase();
  cards.forEach((card) => {
    const cardName = card.querySelector("h3").textContent.toLowerCase();
    if (cardName.includes(searchValue)) {
      card.style.display = "block";
    } else {
      card.style.display = "none";
    }
  });
};

// Filter cards by category when a category button is clicked
const searchCategory = (button) => {
  buttons.forEach((item) => item.classList.remove("active"));
  button.classList.add("active");

  const buttonCategory = button.dataset.category;
  cards.forEach((card) => {
    const cardCategory = card.dataset.category;
    if (buttonCategory === "all") {
      card.style.display = "block";
      return;
    }
    if (buttonCategory === cardCategory) {
      card.style.display = "block";
    } else {
      card.style.display = "none";
    }
  });
};

// Filter cards by price when the price search button is clicked
const searchPrice = () => {
  const searchByPrice = +document.getElementById("searchByPrice").value;
  cards.forEach((card) => {
    const priceProduct = +card.querySelector("p").textContent.split(" ")[1];

    if (!searchByPrice) {
      card.style.display = "block";
      return;
    }

    if (searchByPrice === priceProduct) {
      card.style.display = "block";
    } else {
      card.style.display = "none";
    }
  });
};

// Add selected product to localStorage cart, or update quantity if it already exists
const addToCart = (card) => {
  const localStorageData = getLocalStorage();
  const productImage = card.querySelector("img").getAttribute("src");
  const productName = card.querySelector("h3").textContent;
  const productPrice = card.querySelector("p").textContent;

  const existingProduct = localStorageData.find(
    (item) => item.name === productName
  );
  // If product already exists in localStorage, update its quantity
  if (existingProduct) {
    existingProduct.quantity += 1;
    localStorage.setItem("products", JSON.stringify(localStorageData));
    return;
  }

  // If product does not exist, add it to localStorage
  localStorageData.push({
    image: productImage,
    name: productName,
    price: productPrice,
    quantity: 1,
  });
  localStorage.setItem("products", JSON.stringify(localStorageData));
};

// Set up event listeners after the page loads
window.addEventListener("load", () => {
  cards.forEach((card) => {
    const addToCartButton = card.querySelector(".addToCart");
    addToCartButton.addEventListener("click", () => addToCart(card));
  });
  buttons.forEach((button) => {
    button.addEventListener("click", () => searchCategory(button));
  });
  searchByName.addEventListener("keyup", searchName);
  priceButton.addEventListener("click", searchPrice);
});
