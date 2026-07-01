const snacks = [
  { id: "chips", name: "Nacho Chips", price: 1.50, stock: 14, category: "salty", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/69/Potato-Chips.jpg/500px-Potato-Chips.jpg" },
  { id: "cookie", name: "Chocolate Chip Cookie", price: 1.25, stock: 9, category: "sweet", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b9/Toll_House_cookies.jpg/500px-Toll_House_cookies.jpg" },
  { id: "punch", name: "Fruit Punch Box", price: 1.00, stock: 18, category: "drinks", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/cd/600sojudrinkbox.jpg/500px-600sojudrinkbox.jpg" },
  { id: "granola", name: "Granola Bar", price: 1.25, stock: 5, category: "sweet", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/f/fb/Granola_bar.jpg/500px-Granola_bar.jpg" },
  { id: "pretzels", name: "Pretzel Cup", price: 1.00, stock: 11, category: "salty", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/30/BrezelnSalz02_%28cropped%29.JPG/500px-BrezelnSalz02_%28cropped%29.JPG" },
  { id: "crackers", name: "Cheddar Crackers", price: 1.50, stock: 7, category: "salty", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/46/Cheez-It-Crackers.jpg/500px-Cheez-It-Crackers.jpg" },
  { id: "gummies", name: "Gummy Bears", price: 1.25, stock: 0, category: "sweet", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a6/Oursons_g%C3%A9latine_march%C3%A9_Rouffignac.jpg/500px-Oursons_g%C3%A9latine_march%C3%A9_Rouffignac.jpg" },
  { id: "apple-juice", name: "Apple Juice", price: 1.00, stock: 16, category: "drinks", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/1a/Applejuice_f83e1c36ea.png/500px-Applejuice_f83e1c36ea.png" },
  { id: "popcorn", name: "Popcorn Bag", price: 1.25, stock: 3, category: "salty", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d2/Popcorn_up_close_salted_and_air_popped.jpg/500px-Popcorn_up_close_salted_and_air_popped.jpg" },
  { id: "brownie", name: "Brownie Bite", price: 1.75, stock: 8, category: "sweet", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/68/Chocolatebrownie.JPG/500px-Chocolatebrownie.JPG" },
  { id: "water", name: "Water Bottle", price: 1.00, stock: 22, category: "drinks", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b1/Bottled_water.jpg/500px-Bottled_water.jpg" },
  { id: "trail-mix", name: "Trail Mix", price: 1.75, stock: 4, category: "salty", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/f/fd/2021-05-15_04_45_03_A_sample_of_Kirkland_Trail_Mix_in_the_Dulles_section_of_Sterling%2C_Loudoun_County%2C_Virginia.jpg/500px-2021-05-15_04_45_03_A_sample_of_Kirkland_Trail_Mix_in_the_Dulles_section_of_Sterling%2C_Loudoun_County%2C_Virginia.jpg" },
  { id: "crispy", name: "Rice Crispy Treat", price: 1.50, stock: 6, category: "sweet", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/cd/RKTsquares.jpg/500px-RKTsquares.jpg" },
  { id: "lemonade", name: "Lemonade", price: 1.25, stock: 10, category: "drinks", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/94/Mint_lemonade.jpg/500px-Mint_lemonade.jpg" },
  { id: "muffins", name: "Mini Muffin Pack", price: 1.50, stock: 12, category: "sweet", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4c/02116jfMuffins_in_Philippinesfvf_02.jpg/500px-02116jfMuffins_in_Philippinesfvf_02.jpg" }
];

const menuGrid = document.querySelector("#menu-grid");
const searchInput = document.querySelector("#snack-search");
const resultCount = document.querySelector("#result-count");
const emptyState = document.querySelector("#empty-state");
const filterButtons = document.querySelectorAll(".filter-button");
const checkoutDialog = document.querySelector("#checkout-dialog");
const checkoutForm = document.querySelector("#checkout-form");
const closeCheckout = document.querySelector("#close-checkout");
const checkoutTitle = document.querySelector("#checkout-title");
const orderItems = document.querySelector("#order-items");
const orderTotal = document.querySelector("#order-total");
const cartCount = document.querySelector("#cart-count");
const cartTotal = document.querySelector("#cart-total");
const openCheckoutButton = document.querySelector("#open-checkout");
const studentName = document.querySelector("#student-name");
const deliveryLocation = document.querySelector("#delivery-location");
const paymentMethod = document.querySelector("#payment-method");
const toast = document.querySelector("#toast");

let activeFilter = "all";
const cart = new Map();

function formatMoney(value) {
  return `$${value.toFixed(2)}`;
}

function stockLabel(stock) {
  if (stock <= 0) return { text: "Out of stock", className: "out" };
  if (stock <= 5) return { text: `${stock} left`, className: "low" };
  return { text: "In stock", className: "stock" };
}

function getCartQuantity(snackId) {
  return cart.get(snackId) || 0;
}

function getCartItems() {
  return snacks
    .map((snack) => ({ ...snack, quantity: getCartQuantity(snack.id) }))
    .filter((snack) => snack.quantity > 0);
}

function getCartTotals() {
  return getCartItems().reduce(
    (totals, snack) => {
      totals.quantity += snack.quantity;
      totals.price += snack.quantity * snack.price;
      return totals;
    },
    { quantity: 0, price: 0 }
  );
}

function renderMenu() {
  const query = searchInput.value.trim().toLowerCase();
  const filtered = snacks.filter((snack) => {
    const matchesSearch = snack.name.toLowerCase().includes(query) || snack.category.includes(query);
    const matchesFilter =
      activeFilter === "all" ||
      snack.category === activeFilter ||
      (activeFilter === "in-stock" && snack.stock > 0);

    return matchesSearch && matchesFilter;
  });

  menuGrid.innerHTML = "";
  filtered.forEach((snack) => {
    const stock = stockLabel(snack.stock);
    const quantity = getCartQuantity(snack.id);
    const remaining = snack.stock - quantity;
    const card = document.createElement("article");
    card.className = "snack-card";
    card.innerHTML = `
      <img class="snack-image" src="${snack.image}" alt="${snack.name}" loading="lazy" />
      <div class="snack-body">
        <div class="snack-name-row">
          <h3>${snack.name}</h3>
          <span class="price">${formatMoney(snack.price)}</span>
        </div>
        <div class="meta">
          <span class="pill ${stock.className}">${stock.text}</span>
          <span class="pill">${snack.category}</span>
        </div>
      </div>
      <button class="buy-button" type="button" ${remaining <= 0 ? "disabled" : ""}>
        ${snack.stock <= 0 ? "Unavailable" : quantity > 0 ? `Add another (${quantity})` : "Add to order"}
      </button>
    `;

    card.querySelector(".buy-button").addEventListener("click", () => addToCart(snack.id));
    menuGrid.appendChild(card);
  });

  resultCount.textContent = `${filtered.length} snack${filtered.length === 1 ? "" : "s"} shown`;
  emptyState.hidden = filtered.length > 0;
}

function renderCartSummary() {
  const totals = getCartTotals();
  cartCount.textContent = `${totals.quantity} item${totals.quantity === 1 ? "" : "s"}`;
  cartTotal.textContent = formatMoney(totals.price);
}

function renderOrderItems() {
  const items = getCartItems();
  orderItems.innerHTML = "";

  if (items.length === 0) {
    orderItems.innerHTML = `<p class="empty-state compact">Your order is empty.</p>`;
    orderTotal.textContent = formatMoney(0);
    checkoutTitle.textContent = "Checkout";
    return;
  }

  items.forEach((snack) => {
    const item = document.createElement("div");
    item.className = "order-item";
    item.innerHTML = `
      <img src="${snack.image}" alt="${snack.name}" />
      <div>
        <strong>${snack.name}</strong>
        <span>${formatMoney(snack.price)} each</span>
      </div>
      <div class="quantity-controls" aria-label="${snack.name} quantity">
        <button type="button" data-action="decrease" aria-label="Remove one ${snack.name}">-</button>
        <span>${snack.quantity}</span>
        <button type="button" data-action="increase" aria-label="Add one ${snack.name}">+</button>
      </div>
      <button class="remove-button" type="button" aria-label="Remove ${snack.name}">Remove</button>
    `;

    item.querySelector('[data-action="decrease"]').addEventListener("click", () => changeQuantity(snack.id, -1));
    item.querySelector('[data-action="increase"]').addEventListener("click", () => changeQuantity(snack.id, 1));
    item.querySelector(".remove-button").addEventListener("click", () => removeFromCart(snack.id));
    orderItems.appendChild(item);
  });

  const totals = getCartTotals();
  orderTotal.textContent = formatMoney(totals.price);
  checkoutTitle.textContent = `Checkout ${totals.quantity} item${totals.quantity === 1 ? "" : "s"}`;
}

function renderAll() {
  renderMenu();
  renderCartSummary();
  renderOrderItems();
}

function addToCart(snackId) {
  const snack = snacks.find((item) => item.id === snackId);
  if (!snack) return;

  const currentQuantity = getCartQuantity(snackId);
  if (currentQuantity >= snack.stock) {
    showToast(`${snack.name} is sold out for this order.`);
    return;
  }

  cart.set(snackId, currentQuantity + 1);
  renderAll();
  showToast(`${snack.name} added to your order.`);
}

function changeQuantity(snackId, change) {
  const snack = snacks.find((item) => item.id === snackId);
  if (!snack) return;

  const nextQuantity = getCartQuantity(snackId) + change;
  if (nextQuantity <= 0) {
    cart.delete(snackId);
  } else if (nextQuantity <= snack.stock) {
    cart.set(snackId, nextQuantity);
  } else {
    showToast(`Only ${snack.stock} ${snack.name} available.`);
  }

  renderAll();
}

function removeFromCart(snackId) {
  const snack = snacks.find((item) => item.id === snackId);
  cart.delete(snackId);
  renderAll();
  if (snack) showToast(`${snack.name} removed from your order.`);
}

function openCheckout() {
  if (getCartTotals().quantity === 0) {
    showToast("Add at least one snack to your order first.");
    return;
  }

  renderOrderItems();
  checkoutDialog.showModal();
  studentName.focus();
}

function showToast(message) {
  toast.textContent = message;
  toast.classList.add("show");
  window.setTimeout(() => toast.classList.remove("show"), 3200);
}

checkoutForm.addEventListener("submit", (event) => {
  event.preventDefault();

  const items = getCartItems();
  if (items.length === 0) {
    showToast("Add at least one snack to your order first.");
    return;
  }

  items.forEach((item) => {
    const snack = snacks.find((snackItem) => snackItem.id === item.id);
    if (snack) snack.stock -= item.quantity;
  });

  const totals = getCartTotals();
  const location = deliveryLocation.value.trim();
  cart.clear();
  checkoutDialog.close();
  checkoutForm.reset();
  renderAll();
  showToast(`Order placed: ${totals.quantity} snack${totals.quantity === 1 ? "" : "s"} (${formatMoney(totals.price)}) will be delivered to ${location}.`);
});

searchInput.addEventListener("input", renderMenu);

filterButtons.forEach((button) => {
  button.addEventListener("click", () => {
    filterButtons.forEach((filterButton) => filterButton.classList.remove("active"));
    button.classList.add("active");
    activeFilter = button.dataset.filter;
    renderMenu();
  });
});

openCheckoutButton.addEventListener("click", openCheckout);
closeCheckout.addEventListener("click", () => checkoutDialog.close());

renderAll();
