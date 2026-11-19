const API_ENDPOINTS = [
  "https://dummyjson.com/products/category/tops",
  "https://dummyjson.com/products/category/womens-dresses",
  "https://dummyjson.com/products/category/womens-bags",
  "https://dummyjson.com/products/category/womens-jewellery",
];

const EXCLUDED_CATEGORIES = new Set([
  "kitchen-accessories",
  "home-decoration",
  "furniture",
  "groceries",
  "smartphones",
  "laptops",
  "tablets",
  "mobile-accessories",
  "vehicle",
  "motorcycle",
  "lighting",
  "beauty",
  "skin-care",
  "fragrances",
  "mens-shirts",
  "mens-shoes",
  "mens-watches",
]);

const EXCLUDED_KEYWORDS = [
  "sink",
  "faucet",
  "kitchen",
  "basin",
  "toilet",
  "plumbing",
  "mattress",
  "sofa",
  "couch",
  "lamp",
  "curtain",
  "charger",
  "iphone",
  "laptop",
  "macbook",
  "perfume",
  "mascara",
  "lipstick",
  "men's",
  "mens",
];

// Matches your exact uploaded filenames in cs2100-capstone
const FEATURED_BOUTIQUE_ITEMS = [
  {
    id: 9001,
    title: "MUSERA Black Fold-Over Flare Two-Piece Set",
    price: 24.0,
    rating: 4.9,
    boutiqueCategory: "Matching Sets",
    thumbnail: "musera-set.png",
    description:
      "Sculpting long-sleeve sweetheart crop top paired with fold-over waist bootcut flare pants in soft stretch fabric.",
  },
  {
    id: 9002,
    title: "AMPLOVA Cream & Black Lace Trim Mini Dress",
    price: 28.0,
    rating: 4.8,
    boutiqueCategory: "Dresses",
    thumbnail: "amplova-dress.jpg",
    description:
      "Fitted long-sleeve cream knit mini dress finished with delicate black eyelash lace along the neckline, cuffs, and hem.",
  },
  {
    id: 9003,
    title: "SLAYDIVA Brown Plaid Corset-Waist Collared Top",
    price: 18.0,
    rating: 4.9,
    boutiqueCategory: "Tops",
    thumbnail: "slaydiva-top.jpg",
    description:
      "Cap-sleeve brown tartan plaid collared blouse with a snatched pointed corset waist hem.",
  },
  {
    id: 9004,
    title: "YEOREO Tummy-Control Mini Flared Leggings",
    price: 26.0,
    rating: 4.9,
    boutiqueCategory: "Bottoms",
    thumbnail: "flated-leggings.jpg",
    description:
      "High-waisted sculpting black mini-flare leggings with a V-seam back and supportive tummy-control waistband.",
  },
  {
    id: 9005,
    title: "Seamless Butt-Lifting Wide-Leg Lounge Pants",
    price: 29.0,
    rating: 4.8,
    boutiqueCategory: "Bottoms",
    thumbnail: "wide-leg-pants.jpg",
    description:
      "Buttery-soft no-front-seam wide-leg pants in a flattering 33-inch length for everyday comfort.",
  },
  {
    id: 9006,
    title: "Black Side-Stripe Fold-Over Track Pants",
    price: 25.0,
    rating: 4.7,
    boutiqueCategory: "Bottoms",
    thumbnail: "side-stripe-pants.jpg",
    description:
      "Sporty-chic black fold-over waist flare pants accented with triple tonal racing stripes down the leg.",
  },
  {
    id: 9007,
    title: "Butter Yellow Polka-Dot & Carpe Diem Headband Set (3-Pack)",
    price: 12.0,
    rating: 4.8,
    boutiqueCategory: "Accessories",
    thumbnail: "butter-headbands.jpg",
    description:
      "Set of three wide stretch fabric headbands in brown polka-dot, pink script 'Carpe Diem', and silver eyelet grommets.",
  },
  {
    id: 9008,
    title: "Silver Rhinestone Statement Hair Clips (Pair)",
    price: 10.0,
    rating: 4.9,
    boutiqueCategory: "Accessories",
    thumbnail: "rhinestone-clips.jpg",
    description:
      "Sparkling pave crystal alligator hair barrettes with sleek silver-tone centers for glam sleek-back styles.",
  },
  {
    id: 9009,
    title: "Hot Pink Salon Sectioning Hair Clips (8-Pack)",
    price: 9.0,
    rating: 4.8,
    boutiqueCategory: "Accessories",
    thumbnail: "pink-salon-clips.jpg",
    description:
      "Set of eight glossy hot-pink alligator styling clips designed to hold curls, layers, and silk presses crease-free.",
  },
];

const state = {
  products: [],
  activeCategory: "All",
  searchTerm: "",
  sortOrder: "featured",
  selectedProduct: null,
  lastFocusedElement: null,
};

const dom = {
  productGrid: document.getElementById("product-grid"),
  resultsCount: document.getElementById("results-count"),
  searchInput: document.getElementById("search-input"),
  sortSelect: document.getElementById("sort-select"),
  categoryButtons: document.querySelectorAll(".cat-btn"),
  modal: document.getElementById("details-modal"),
  closeModalBtn: document.getElementById("close-modal-btn"),
  modalImage: document.getElementById("modal-item-image"),
  modalCategory: document.getElementById("modal-item-category"),
  modalTitle: document.getElementById("modal-item-title"),
  modalPrice: document.getElementById("modal-item-price"),
  modalRating: document.getElementById("modal-item-rating"),
  modalDescription: document.getElementById("modal-item-description"),
  inquiryForm: document.getElementById("inquiry-form"),
  fullNameInput: document.getElementById("full-name-input"),
  fullNameError: document.getElementById("full-name-error"),
  emailInput: document.getElementById("email-input"),
  emailError: document.getElementById("email-error"),
  sizeError: document.getElementById("size-error"),
  formSuccess: document.getElementById("form-success"),
};

function isOffThemeItem(rawProduct) {
  const apiCat = (rawProduct.category || "").toLowerCase();
  if (EXCLUDED_CATEGORIES.has(apiCat)) {
    return true;
  }
  const text = `${apiCat} ${rawProduct.title || ""} ${rawProduct.description || ""}`.toLowerCase();
  return EXCLUDED_KEYWORDS.some((word) => text.includes(word));
}

function mapToBoutiqueCategory(rawProduct) {
  if (isOffThemeItem(rawProduct)) {
    return null;
  }

  const apiCat = (rawProduct.category || "").toLowerCase();
  const title = (rawProduct.title || "").toLowerCase();
  const desc = (rawProduct.description || "").toLowerCase();
  const combined = `${apiCat} ${title} ${desc}`;

  if (
    combined.includes("matching set") ||
    combined.includes("two-piece") ||
    combined.includes("co-ord") ||
    /\bset\b/.test(title)
  ) {
    return "Matching Sets";
  }
  if (apiCat === "womens-dresses" || /\bdress\b/.test(title) || /\bgown\b/.test(title)) {
    return "Dresses";
  }
  if (
    /\bskirt\b/.test(title) ||
    /\bpants?\b/.test(title) ||
    /\btrousers?\b/.test(title) ||
    /\bjeans?\b/.test(title) ||
    /\bshorts?\b/.test(title)
  ) {
    return "Bottoms";
  }
  if (apiCat === "tops") {
    return "Tops";
  }
  if (apiCat === "womens-bags" || apiCat === "womens-jewellery") {
    return "Accessories";
  }

  return null;
}

async function fetchBoutiqueInventory() {
  dom.resultsCount.textContent = "Loading boutique inventory...";

  try {
    const responses = await Promise.all(API_ENDPOINTS.map((url) => fetch(url)));
    const payloads = await Promise.all(
      responses.map((res) => {
        if (!res.ok) throw new Error(`API error: ${res.status}`);
        return res.json();
      })
    );

    const seenIds = new Set();
    const normalized = [];

    for (const payload of payloads) {
      const list = Array.isArray(payload.products) ? payload.products : [];
      for (const item of list) {
        if (seenIds.has(item.id)) continue;
        const mappedCategory = mapToBoutiqueCategory(item);
        if (!mappedCategory) continue;

        seenIds.add(item.id);
        normalized.push({
          id: item.id,
          title: item.title,
          price: Number(item.price),
          rating: Number(item.rating || 4.5),
          boutiqueCategory: mappedCategory,
          thumbnail: item.thumbnail || (item.images && item.images[0]) || "",
          description: item.description || "Boutique piece from Nina’s Kloset.",
        });
      }
    }

    state.products = [...FEATURED_BOUTIQUE_ITEMS, ...normalized];
  } catch (error) {
    state.products = [...FEATURED_BOUTIQUE_ITEMS];
    dom.resultsCount.textContent = "Loaded boutique catalog.";
  }

  updateCatalogView();
}

function getVisibleProducts() {
  const query = state.searchTerm.trim().toLowerCase();

  const filtered = state.products.filter((product) => {
    const matchesCategory =
      state.activeCategory === "All" || product.boutiqueCategory === state.activeCategory;
    const matchesSearch =
      query === "" ||
      product.title.toLowerCase().includes(query) ||
      product.boutiqueCategory.toLowerCase().includes(query) ||
      product.description.toLowerCase().includes(query);

    return matchesCategory && matchesSearch;
  });

  const sorted = [...filtered];
  if (state.sortOrder === "price-asc") {
    sorted.sort((a, b) => a.price - b.price);
  } else if (state.sortOrder === "price-desc") {
    sorted.sort((a, b) => b.price - a.price);
  } else if (state.sortOrder === "rating-desc") {
    sorted.sort((a, b) => b.rating - a.rating);
  }

  return sorted;
}

function buildProductCard(product) {
  const card = document.createElement("article");
  card.className = "product-card";

  const mediaWrap = document.createElement("div");
  mediaWrap.className = "card-media";

  const img = document.createElement("img");
  img.src = product.thumbnail;
  img.alt = product.title;
  img.loading = "lazy";

  const viewBtn = document.createElement("button");
  viewBtn.type = "button";
  viewBtn.className = "view-btn";
  viewBtn.textContent = "View";
  viewBtn.setAttribute("aria-label", `View details for ${product.title}`);
  viewBtn.addEventListener("click", () => openDetailsModal(product, viewBtn));

  mediaWrap.append(img, viewBtn);

  const body = document.createElement("div");
  body.className = "card-body";

  const badge = document.createElement("span");
  badge.className = "badge";
  badge.textContent = product.boutiqueCategory;

  const title = document.createElement("h3");
  title.className = "card-title";
  title.textContent = product.title;

  const footerRow = document.createElement("div");
  footerRow.className = "card-footer-row";

  const price = document.createElement("p");
  price.className = "card-price";
  price.textContent = `$${product.price.toFixed(2)}`;

  const rating = document.createElement("p");
  rating.className = "card-rating";
  rating.textContent = `★ ${product.rating.toFixed(1)}`;

  footerRow.append(price, rating);
  body.append(badge, title, footerRow);
  card.append(mediaWrap, body);

  return card;
}

function updateCatalogView() {
  const visibleProducts = getVisibleProducts();
  const fragment = document.createDocumentFragment();

  if (visibleProducts.length === 0) {
    const empty = document.createElement("p");
    empty.className = "empty-message";
    empty.textContent = "No boutique items match your current search or category filter.";
    fragment.appendChild(empty);
  } else {
    for (const product of visibleProducts) {
      fragment.appendChild(buildProductCard(product));
    }
  }

  dom.productGrid.replaceChildren(fragment);
  dom.resultsCount.textContent = `Showing ${visibleProducts.length} of ${state.products.length} boutique pieces`;
}

function openDetailsModal(product, triggerElement) {
  state.selectedProduct = product;
  state.lastFocusedElement = triggerElement;

  dom.modalImage.src = product.thumbnail;
  dom.modalImage.alt = product.title;
  dom.modalCategory.textContent = product.boutiqueCategory;
  dom.modalTitle.textContent = product.title;
  dom.modalPrice.textContent = `$${product.price.toFixed(2)}`;
  dom.modalRating.textContent = `Customer Rating: ${product.rating.toFixed(1)} / 5.0`;
  dom.modalDescription.textContent = product.description;

  resetFormState();
  dom.modal.hidden = false;
  dom.closeModalBtn.focus();
}

function closeDetailsModal() {
  dom.modal.hidden = true;
  if (state.lastFocusedElement) {
    state.lastFocusedElement.focus();
  }
}

function resetFormState() {
  dom.inquiryForm.reset();
  dom.formSuccess.hidden = true;
  dom.formSuccess.textContent = "";
  setInputError(dom.fullNameInput, dom.fullNameError, "");
  setInputError(dom.emailInput, dom.emailError, "");
  dom.sizeError.textContent = "";
}

function setInputError(inputEl, errorEl, message) {
  const invalid = Boolean(message);
  inputEl.setAttribute("aria-invalid", String(invalid));
  errorEl.textContent = message;
}

function validateInquiryForm() {
  let valid = true;
  let firstInvalid = null;

  const fullName = dom.fullNameInput.value.trim();
  if (fullName.length < 2 || !/^[a-zA-Z\s'-]+$/.test(fullName)) {
    setInputError(
      dom.fullNameInput,
      dom.fullNameError,
      "Please enter your full name using at least 2 letters."
    );
    valid = false;
    firstInvalid ??= dom.fullNameInput;
  } else {
    setInputError(dom.fullNameInput, dom.fullNameError, "");
  }

  const email = dom.emailInput.value.trim();
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    setInputError(
      dom.emailInput,
      dom.emailError,
      "Please enter a valid email address (e.g., name@domain.com)."
    );
    valid = false;
    firstInvalid ??= dom.emailInput;
  } else {
    setInputError(dom.emailInput, dom.emailError, "");
  }

  const selectedSize = dom.inquiryForm.querySelector('input[name="size"]:checked');
  if (!selectedSize) {
    dom.sizeError.textContent = "Please select a garment size (XS, S, M, L, or XL).";
    valid = false;
    firstInvalid ??= dom.inquiryForm.querySelector('input[name="size"]');
  } else {
    dom.sizeError.textContent = "";
  }

  if (firstInvalid) {
    firstInvalid.focus();
  }

  return valid;
}

function registerEventListeners() {
  dom.searchInput.addEventListener("input", (event) => {
    state.searchTerm = event.target.value;
    updateCatalogView();
  });

  dom.categoryButtons.forEach((button) => {
    button.addEventListener("click", () => {
      state.activeCategory = button.dataset.category;
      dom.categoryButtons.forEach((btn) => {
        const isCurrent = btn === button;
        btn.classList.toggle("active", isCurrent);
        btn.setAttribute("aria-pressed", String(isCurrent));
      });
      updateCatalogView();
    });
  });

  dom.sortSelect.addEventListener("change", (event) => {
    state.sortOrder = event.target.value;
    updateCatalogView();
  });

  dom.closeModalBtn.addEventListener("click", closeDetailsModal);
  dom.modal.addEventListener("click", (event) => {
    if (event.target === dom.modal) {
      closeDetailsModal();
    }
  });
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && !dom.modal.hidden) {
      closeDetailsModal();
    }
  });

  dom.fullNameInput.addEventListener("input", () =>
    setInputError(dom.fullNameInput, dom.fullNameError, "")
  );
  dom.emailInput.addEventListener("input", () =>
    setInputError(dom.emailInput, dom.emailError, "")
  );
  dom.inquiryForm.querySelectorAll('input[name="size"]').forEach((radio) => {
    radio.addEventListener("change", () => {
      dom.sizeError.textContent = "";
    });
  });

  dom.inquiryForm.addEventListener("submit", (event) => {
    event.preventDefault();
    dom.formSuccess.hidden = true;

    if (!validateInquiryForm()) {
      return;
    }

    const fullName = dom.fullNameInput.value.trim();
    const email = dom.emailInput.value.trim();
    const size = dom.inquiryForm.querySelector('input[name="size"]:checked').value;
    const itemTitle = state.selectedProduct ? state.selectedProduct.title : "selected item";

    dom.formSuccess.textContent = `Thank you, ${fullName}! Your inquiry for "${itemTitle}" (Size ${size}) has been sent to ${email}.`;
    dom.formSuccess.hidden = false;
    dom.inquiryForm.reset();
  });
}

registerEventListeners();
fetchBoutiqueInventory();
