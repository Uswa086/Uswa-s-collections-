
const WHATSAPP = "923157540218";
const EMAIL = "uswanazish311@gmail.com";

// Sample prices in Pakistani rupees.
// Change these prices to match your real products.
const products = [
  {
    id: 1, name: "Floral Printed Lawn", category: "Ladies",
    fabric: "Printed Lawn", price: 2850, tag: "Bestseller",
    description: "Elegant floral print for summer wear.",
    image: "https://images.unsplash.com/photo-1590736969955-71cc94901144?auto=format&fit=crop&w=700&q=85"
  },
  {
    id: 2, name: "Classic Cotton", category: "Ladies",
    fabric: "Cotton", price: 2450, tag: "Popular",
    description: "Comfortable cotton in an elegant style.",
    image: "https://images.unsplash.com/photo-1528459801416-a9e53bbf4e17?auto=format&fit=crop&w=700&q=85"
  },
  {
    id: 3, name: "Premium Wash & Wear", category: "Gents",
    fabric: "Wash & Wear", price: 2750, tag: "New",
    description: "A versatile fabric for everyday use.",
    image: "https://images.unsplash.com/photo-1523381210434-271e8be1f52b?auto=format&fit=crop&w=700&q=85"
  },
  {
    id: 4, name: "Sand Cotton", category: "Gents",
    fabric: "Cotton", price: 2150, tag: "Classic",
    description: "A neutral shade with a timeless look.",
    image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&w=700&q=85"
  },
  {
    id: 5, name: "Midnight Black Fabric", category: "Gents",
    fabric: "Wash & Wear", price: 2950, tag: "Premium",
    description: "A refined dark fabric option.",
    image: "https://images.unsplash.com/photo-1598033129183-c4f50c736f10?auto=format&fit=crop&w=700&q=85"
  },
  {
    id: 6, name: "Rose Garden Print", category: "Ladies",
    fabric: "Digital Print Lawn", price: 3250, tag: "New",
    description: "Beautiful pink floral-inspired print.",
    image: "https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=700&q=85"
  },
  {
    id: 7, name: "Ivory Cotton", category: "Ladies",
    fabric: "Cotton", price: 1950, tag: "Essential",
    description: "A light shade for versatile styling.",
    image: "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?auto=format&fit=crop&w=700&q=85"
  },
  {
    id: 8, name: "Royal Blue Cotton", category: "Gents",
    fabric: "Cotton", price: 2550, tag: "Popular",
    description: "A rich blue color option.",
    image: "https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=700&q=85"
  }
];

const $ = selector => document.querySelector(selector);
const cart = new Map();
const wishlist = new Set();

let selectedCategory = "All";
let searchText = "";

function money(amount) {
  return "Rs. " + amount.toLocaleString("en-PK");
}

function safe(value) {
  return String(value).replace(/[&<>"']/g, char => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;",
    '"': "&quot;", "'": "&#039;"
  })[char]);
}

function showToast(message) {
  const toast = $("#toast");
  toast.textContent = message;
  toast.classList.add("show");

  clearTimeout(showToast.timer);
  showToast.timer = setTimeout(() => {
    toast.classList.remove("show");
  }, 2500);
}

function getVisibleProducts() {
  let list = products.filter(product => {
    const categoryMatches =
      selectedCategory === "All" ||
      product.category === selectedCategory;

    const searchableText =
      `${product.name} ${product.fabric} ${product.category} ${product.description}`.toLowerCase();

    return categoryMatches &&
      searchableText.includes(searchText.toLowerCase());
  });

  const sort = $("#sortFilter").value;

  if (sort === "low") {
    list.sort((a, b) => a.price - b.price);
  } else if (sort === "high") {
    list.sort((a, b) => b.price - a.price);
  }

  return list;
}

function renderProducts() {
  const list = getVisibleProducts();

  $("#emptyMessage").hidden = list.length > 0;

  $("#productGrid").innerHTML = list.map(product => `
    <article class="product-card">
      <div class="product-image-wrap">
        <img
          class="product-image"
          src="${safe(product.image)}"
          alt="${safe(product.name)} unstitched fabric"
          loading="lazy"
        >
        <span class="product-tag">${safe(product.tag)}</span>

        <button
          class="wish ${wishlist.has(product.id) ? "active" : ""}"
          data-wish="${product.id}"
          aria-label="Toggle wishlist"
        >${wishlist.has(product.id) ? "♥" : "♡"}</button>
      </div>

      <div class="product-info">
        <span class="product-category">
          ${safe(product.category)} · ${safe(product.fabric)}
        </span>

        <h3>${safe(product.name)}</h3>
        <p class="product-description">${safe(product.description)}</p>
        <div class="price">${money(product.price)}</div>

        <div class="product-actions">
          <button class="add-btn" data-add="${product.id}">
            Add to Bag +
          </button>
          <button class="details-btn" data-quick="${product.id}">
            Quick Order
          </button>
        </div>
      </div>
    </article>
  `).join("");
}

function addToCart(id) {
  const product = products.find(item => item.id === Number(id));
  if (!product) return;

  const existing = cart.get(product.id);

  cart.set(product.id, {
    product,
    quantity: existing ? existing.quantity + 1 : 1
  });

  renderCart();
  showToast(`${product.name} added to your bag.`);
}

function getCartItems() {
  return [...cart.values()];
}

function getTotal() {
  return getCartItems().reduce(
    (total, item) => total + item.product.price * item.quantity,
    0
  );
}

function renderCart() {
  const items = getCartItems();

  $("#cartCount").textContent = items.reduce(
    (total, item) => total + item.quantity, 0
  );

  $("#cartTotal").textContent = money(getTotal());

  $("#cartItems").innerHTML = items.length
    ? items.map(({ product, quantity }) => `
      <div class="cart-line">
        <img src="${safe(product.image)}" alt="${safe(product.name)}">

        <div>
          <h4>${safe(product.name)}</h4>
          <p>${money(product.price)} each</p>

          <div class="qty">
            <button data-qty="${product.id}" data-change="-1">−</button>
            <span>${quantity}</span>
            <button data-qty="${product.id}" data-change="1">+</button>
          </div>
        </div>

        <button class="remove" data-remove="${product.id}">×</button>
      </div>
    `).join("")
    : "<p>Your shopping bag is empty. Add a fabric to get started.</p>";

  $("#whatsappOrder").disabled = items.length === 0;
  $("#emailOrder").disabled = items.length === 0;
}

function openCart() {
  $("#cartPanel").classList.add("open");
  $("#overlay").classList.add("show");
}

function closeCart() {
  $("#cartPanel").classList.remove("open");
  $("#overlay").classList.remove("show");
}

function buildOrderMessage() {
  const items = getCartItems();

  const lines = items.map(({ product, quantity }) =>
    `${product.name} (${product.category}, ${product.fabric}) x ${quantity} = ${money(product.price * quantity)}`
  );

  return `Assalam-o-Alaikum Uswa Collections!

I would like to place an order:

${lines.join("\n")}

Estimated subtotal: ${money(getTotal())}

Please confirm product availability, delivery charges, payment method and delivery time.

Name:
City and delivery address:
Preferred payment: Cash on Delivery / Easypaisa / JazzCash / Bank Transfer`;
}

function orderOnWhatsApp() {
  if (cart.size === 0) {
    showToast("Please add a product to your bag first.");
    return;
  }

  const url = `https://wa.me/${WHATSAPP}?text=${encodeURIComponent(buildOrderMessage())}`;
  window.open(url, "_blank", "noopener");
}

function orderByEmail() {
  if (cart.size === 0) {
    showToast("Please add a product to your bag first.");
    return;
  }

  const subject = "Order Request - Uswa Collections";
  const body = buildOrderMessage();

  window.location.href =
    `mailto:${EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}

// Product card actions
$("#productGrid").addEventListener("click", event => {
  const add = event.target.closest("[data-add]");
  const wish = event.target.closest("[data-wish]");
  const quick = event.target.closest("[data-quick]");

  if (add) addToCart(add.dataset.add);

  if (wish) {
    const id = Number(wish.dataset.wish);

    if (wishlist.has(id)) {
      wishlist.delete(id);
      showToast("Removed from wishlist.");
    } else {
      wishlist.add(id);
      showToast("Added to wishlist.");
    }

    renderProducts();
  }

  if (quick) {
    const product = products.find(
      item => item.id === Number(quick.dataset.quick)
    );

    if (product) {
      const message =
        `Assalam-o-Alaikum! I am interested in ${product.name}, ${product.fabric}, listed at ${money(product.price)}. Please confirm availability.`;

      window.open(
        `https://wa.me/${WHATSAPP}?text=${encodeURIComponent(message)}`,
        "_blank",
        "noopener"
      );
    }
  }
});

// Shopping cart quantity and remove actions
$("#cartItems").addEventListener("click", event => {
  const quantityButton = event.target.closest("[data-qty]");
  const removeButton = event.target.closest("[data-remove]");

  if (quantityButton) {
    const id = Number(quantityButton.dataset.qty);
    const item = cart.get(id);

    if (!item) return;

    item.quantity += Number(quantityButton.dataset.change);

    if (item.quantity <= 0) {
      cart.delete(id);
    }

    renderCart();
  }

  if (removeButton) {
    cart.delete(Number(removeButton.dataset.remove));
    renderCart();
  }
});

// Search, category filters and price sorting
$("#search").addEventListener("input", event => {
  searchText = event.target.value.trim();
  renderProducts();
});

$("#categoryFilter").addEventListener("change", event => {
  selectedCategory = event.target.value;
  renderProducts();
});

$("#sortFilter").addEventListener("change", renderProducts);

// Clicking a collection banner filters the catalogue
document.querySelectorAll("[data-category]").forEach(link => {
  link.addEventListener("click", () => {
    selectedCategory = link.dataset.category;
    $("#categoryFilter").value = selectedCategory;
    renderProducts();
  });
});

// Navigation on mobile
$("#menuBtn").addEventListener("click", () => {
  $("#nav").classList.toggle("open");
});

document.querySelectorAll("#nav a").forEach(link => {
  link.addEventListener("click", () => {
    $("#nav").classList.remove("open");
  });
});

// Cart controls
$("#cartBtn").addEventListener("click", openCart);
$("#closeCart").addEventListener("click", closeCart);
$("#overlay").addEventListener("click", closeCart);
$("#whatsappOrder").addEventListener("click", orderOnWhatsApp);
$("#emailOrder").addEventListener("click", orderByEmail);

// Newsletter opens an email request.
// It does not save email addresses to a database.
$("#newsletterForm").addEventListener("submit", event => {
  event.preventDefault();

  const email = $("#newsletterEmail").value.trim();
  if (!email) return;

  const subject = "Newsletter Subscription Request";
  const body = `Hello Uswa Collections,\nPlease add my email to your updates list: ${email}`;

  window.location.href =
    `mailto:${EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

  showToast("Your email app will open to prepare the request.");
});

// Footer year and initial page rendering
$("#year").textContent = new Date().getFullYear();

renderProducts();
renderCart();
  
