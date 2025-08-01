const searchByName = document.getElementById("searchByName");
const buttons = document.querySelectorAll(".searchByCategory button");
const priceButton = document.getElementById("priceButton");

const cards = document.querySelectorAll(".card");

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

searchByName.addEventListener("keyup", searchName);
buttons.forEach((button) => {
  button.addEventListener("click", () => searchCategory(button));
});
priceButton.addEventListener("click", searchPrice);
