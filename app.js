(function () {
  "use strict";

  const STORAGE_KEY = "qitaf-cart-v1";
  const SHIPPING = 25;
  const FREE_SHIP = 300;

  const PRODUCTS = {
    sukkari: {
      id: "sukkari",
      name: "سكري فاخر",
      category: "تمور",
      price: 185,
      image: "img/sukkari.jpg",
      origin: "عنيزة وبريدة — القصيم",
      weight: "علبة خشب · ١ كجم",
      blurb: "حبّات ذهبية تُرصف كما تُقدَّم للضيف.",
      desc: "سكري القصيم يُقطف حين يكتسي ذهبًا ويصير لينه كريمًا. نختار الحبّات الكبيرة اللامعة من بساتين عنيزة وبريدة، ونرصفها في علبة خشب داكنة تليق بالمجلس. حلاوة صافية بلا إضافة سكر، ومذاق يُعرف من أول تمرة.",
    },
    ajwa: {
      id: "ajwa",
      name: "عجوة المدينة",
      category: "تمور",
      price: 220,
      image: "img/ajwa.jpg",
      origin: "المدينة المنورة",
      weight: "وعاء سيراميك · ٧٥٠ جم",
      blurb: "ليّنة داكنة من نخيل طيبة.",
      desc: "عجوة تُجنى من مزارع معروفة في طيبة، ليّنة داكنة تحتفظ برطوبتها حتى تُفتح العلبة. تُهدى في رمضان وتُقدَّم في الفرح والعزاء سواء. تمرٌ يُقصد لا يُشترى وزنًا.",
    },
    honey: {
      id: "honey",
      name: "عسل السدر",
      category: "عسل",
      price: 260,
      image: "img/honey.jpg",
      origin: "مواسم زهر السدر",
      weight: "وعاء زجاج · ٥٠٠ جم",
      blurb: "كثافة ذهبية من موسم الزهر لا من الخلطات.",
      desc: "عسل سدر يُقطف في موسمه، كثيف الذهبيّة، برائحة خفيفة تبقى على الملعقة. لا خلطات ولا تسخين يفسد الأصل. يُسكب على التمر أو يُهدى وحده في وعاء زجاج داكن وغطاء ذهبي.",
    },
    coffee: {
      id: "coffee",
      name: "قهوة دار قِطاف",
      category: "قهوة",
      price: 95,
      image: "img/coffee.jpg",
      origin: "تحميص الدار — الرياض",
      weight: "كيس قماش · ٢٥٠ جم",
      blurb: "تحميص هادئ مع هيل، لمجالس الضيافة.",
      desc: "حبّات تُحمَّص على مهل في الدار، بلمسة هيل لا تطغى على الأصل. تُقدَّم مع التمر لا بعده، في دلة تملأ المجلس قبل أن يتكلم أحد. قهوة للضيف، لا لآلة المكتب.",
    },
    gift: {
      id: "gift",
      name: "صندوق الضيافة",
      category: "هدايا",
      price: 420,
      image: "img/gift.jpg",
      origin: "تجميع الدار — الرياض",
      weight: "صندوق جلدي · تشكيلة كاملة",
      blurb: "سكري وعجوة وعسل في غلاف يُفتح كسلام.",
      desc: "يُجهَّز في الدار: سكري فاخر، عجوة المدينة، وعسل سدر، داخل غلاف جلدي بنقش ذهبي مستوحى من العمارة النجدية. يُفتح في المجلس لا في المطبخ، ويُحفظ بعد ذلك لأنه أجمل من أن يُرمى. هدية تسبق الكلام.",
    },
    mix: {
      id: "mix",
      name: "مائدة الضيف",
      category: "هدايا",
      price: 310,
      image: "img/mix.jpg",
      origin: "تجميع الدار — الرياض",
      weight: "صينية ضيافة · تشكيلة",
      blurb: "تمر وتين وفستق يُصفّون معًا للمائدة.",
      desc: "صينية تُرصف كما تُرصف المائدة: تمر ذهبي، تين مجفف، فستق، وملعقة عسل صغيرة. ليست وزنًا يُباع، بل ترتيبًا يُقدَّم. مناسبة للمجالس الصغيرة وللإفطار في رمضان.",
    },
  };

  const FEATURED = ["sukkari", "ajwa", "gift"];
  const ORDER = ["sukkari", "ajwa", "honey", "coffee", "gift", "mix"];

  const els = {
    views: document.querySelectorAll("[data-view]"),
    navLinks: document.querySelectorAll("[data-nav]"),
    featuredGrid: document.getElementById("featured-grid"),
    shopGrid: document.getElementById("shop-grid"),
    shopCount: document.getElementById("shop-count"),
    chips: document.querySelectorAll(".chip"),
    overlay: document.getElementById("overlay"),
    modal: document.getElementById("product-modal"),
    modalImage: document.getElementById("modal-image"),
    modalCategory: document.getElementById("modal-category"),
    modalName: document.getElementById("modal-name"),
    modalOrigin: document.getElementById("modal-origin"),
    modalWeight: document.getElementById("modal-weight"),
    modalDesc: document.getElementById("modal-desc"),
    modalPrice: document.getElementById("modal-price"),
    modalQty: document.getElementById("modal-qty"),
    modalAdd: document.getElementById("modal-add"),
    cartOpen: document.getElementById("cart-open"),
    cartDrawer: document.getElementById("cart-drawer"),
    cartBody: document.getElementById("cart-body"),
    cartFoot: document.getElementById("cart-foot"),
    cartBadge: document.getElementById("cart-badge"),
    toast: document.getElementById("toast"),
    menu: document.getElementById("mobile-menu"),
    menuOpen: document.getElementById("menu-open"),
    menuClose: document.getElementById("menu-close"),
  };

  let cart = loadCart();
  let filter = "الكل";
  let modalId = null;
  let lastFocus = null;
  let layer = null;
  let toastTimer = 0;

  function loadCart() {
    try {
      const raw = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
      return Array.isArray(raw) ? raw.filter((row) => PRODUCTS[row.id] && row.qty > 0) : [];
    } catch {
      return [];
    }
  }

  function saveCart() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(cart));
  }

  function cartCount() {
    return cart.reduce((n, row) => n + row.qty, 0);
  }

  function formatPrice(n) {
    return String(n);
  }

  function productCard(id) {
    const p = PRODUCTS[id];
    return `<article class="product-card">
      <button class="product-card-media" type="button" data-open="${p.id}" aria-label="تفاصيل ${p.name}">
        <img src="${p.image}" alt="${p.name}">
      </button>
      <div class="product-card-body">
        <p class="product-cat">${p.category}</p>
        <h3>${p.name}</h3>
        <p class="product-blurb">${p.blurb}</p>
        <p class="price">${formatPrice(p.price)} <span>ر.س</span></p>
        <div class="product-card-actions">
          <button class="btn btn-ghost" type="button" data-open="${p.id}">تفاصيل</button>
          <button class="btn btn-solid" type="button" data-add="${p.id}">أضف للسلة</button>
        </div>
      </div>
    </article>`;
  }

  function renderFeatured() {
    els.featuredGrid.innerHTML = FEATURED.map(productCard).join("");
  }

  function renderShop() {
    const ids = ORDER.filter((id) => filter === "الكل" || PRODUCTS[id].category === filter);
    els.shopGrid.innerHTML = ids.map(productCard).join("");
    const noun = ids.length === 1 ? "صنف" : "أصناف";
    els.shopCount.textContent =
      filter === "الكل" ? `${ids.length} ${noun} في الدار` : `${ids.length} ${noun} في ${filter}`;
  }

  function updateBadge() {
    const n = cartCount();
    els.cartBadge.hidden = n === 0;
    els.cartBadge.textContent = String(n);
    els.cartBadge.classList.remove("pop");
    void els.cartBadge.offsetWidth;
    if (n) els.cartBadge.classList.add("pop");
    els.cartOpen.setAttribute("aria-label", n ? `السلة، ${n} عناصر` : "فتح السلة");
  }

  function addToCart(id, qty) {
    const amount = Math.max(1, Math.min(12, qty || 1));
    const row = cart.find((item) => item.id === id);
    if (row) row.qty = Math.min(12, row.qty + amount);
    else cart.push({ id, qty: amount });
    saveCart();
    updateBadge();
    renderCart();
    toast(`أُضيف ${PRODUCTS[id].name} إلى السلة`);
  }

  function setQty(id, qty) {
    const row = cart.find((item) => item.id === id);
    if (!row) return;
    row.qty = Math.max(1, Math.min(12, qty));
    saveCart();
    updateBadge();
    renderCart();
  }

  function removeFromCart(id) {
    cart = cart.filter((item) => item.id !== id);
    saveCart();
    updateBadge();
    renderCart();
  }

  function totals() {
    const sub = cart.reduce((n, row) => n + PRODUCTS[row.id].price * row.qty, 0);
    const ship = sub === 0 || sub >= FREE_SHIP ? 0 : SHIPPING;
    return { sub, ship, total: sub + ship };
  }

  function renderCart() {
    if (els.cartDrawer.dataset.success === "1") return;
    if (!cart.length) {
      els.cartBody.innerHTML = `<div class="cart-empty">
        <p>السلة فارغة. زُر المتجر واختر للضيف.</p>
        <button class="btn btn-solid" type="button" data-nav="shop">المتجر</button>
      </div>`;
      els.cartFoot.innerHTML = "";
      return;
    }

    els.cartBody.innerHTML = cart
      .map((row) => {
        const p = PRODUCTS[row.id];
        return `<article class="cart-item">
          <img src="${p.image}" alt="">
          <div>
            <h3>${p.name}</h3>
            <p class="product-cat">${p.category}</p>
            <div class="cart-item-meta">
              <span>${formatPrice(p.price * row.qty)} ر.س</span>
              <span>× ${row.qty}</span>
            </div>
            <div class="qty" style="margin-top:10px">
              <button type="button" data-qty-minus="${p.id}" aria-label="إنقاص">−</button>
              <input value="${row.qty}" readonly aria-label="كمية ${p.name}">
              <button type="button" data-qty-plus="${p.id}" aria-label="زيادة">+</button>
            </div>
            <button class="cart-remove" type="button" data-remove="${p.id}">إزالة</button>
          </div>
        </article>`;
      })
      .join("");

    const t = totals();
    const shipLabel = t.ship === 0 ? "مجاني" : `${formatPrice(t.ship)} ر.س`;
    const note =
      t.sub >= FREE_SHIP
        ? "الشحن مجاني لهذا الطلب."
        : `أضف ${formatPrice(FREE_SHIP - t.sub)} ر.س لشحن مجاني.`;

    els.cartFoot.innerHTML = `
      <div class="cart-lines">
        <div><span>المجموع الفرعي</span><span>${formatPrice(t.sub)} ر.س</span></div>
        <div><span>الشحن داخل المملكة</span><span>${shipLabel}</span></div>
        <div class="cart-total"><span>الإجمالي</span><span>${formatPrice(t.total)} ر.س</span></div>
      </div>
      <p class="ship-note">${note}</p>
      <button class="btn btn-solid btn-full" type="button" id="checkout-btn">إتمام الطلب</button>
    `;
  }

  function checkout() {
    if (!cart.length) return;
    const order = "QT-" + String(Math.floor(1000 + Math.random() * 9000));
    els.cartDrawer.dataset.success = "1";
    els.cartBody.innerHTML = `<div class="success">
      <p class="eyebrow">تم تسجيل الطلب</p>
      <h3>شكرًا لضيافتك</h3>
      <p>رقم الطلب</p>
      <p class="order-no">${order}</p>
      <p>سنتواصل لتأكيد التوصيل داخل المملكة خلال يوم عمل.</p>
      <p class="demo-note">طلب تجريبي — لا يوجد دفع حقيقي</p>
    </div>`;
    els.cartFoot.innerHTML = `<button class="btn btn-ghost btn-full" type="button" id="reset-cart">طلب جديد</button>`;
    cart = [];
    saveCart();
    updateBadge();
  }

  function resetSuccess() {
    delete els.cartDrawer.dataset.success;
    renderCart();
  }

  function toast(message) {
    els.toast.textContent = message;
    els.toast.hidden = false;
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => {
      els.toast.hidden = true;
    }, 2200);
  }

  function currentView() {
    const hash = (location.hash || "#home").replace("#", "");
    if (hash === "featured") return "home";
    return ["home", "shop", "story"].includes(hash) ? hash : "home";
  }

  function showView(name, push) {
    const view = ["home", "shop", "story"].includes(name) ? name : "home";
    els.views.forEach((panel) => {
      const on = panel.dataset.view === view;
      panel.hidden = !on;
      panel.classList.toggle("is-active", on);
    });
    els.navLinks.forEach((link) => {
      const match = link.getAttribute("data-nav") === view;
      if (link.classList.contains("nav-link")) {
        if (match) link.setAttribute("aria-current", "page");
        else link.removeAttribute("aria-current");
      }
    });
    if (push !== false && location.hash.replace("#", "") !== view) {
      history.replaceState(null, "", "#" + view);
    }
    closeMenu();
    if (view === "shop") window.scrollTo({ top: 0, behavior: "instant" in window ? "instant" : "auto" });
  }

  function openLayer(which) {
    lastFocus = document.activeElement;
    layer = which;
    els.overlay.hidden = false;
    document.body.classList.add("is-locked");
    if (which === "modal") {
      els.modal.hidden = false;
      els.modalAdd.focus();
    } else {
      els.cartDrawer.hidden = false;
      els.cartOpen.setAttribute("aria-expanded", "true");
      const closeBtn = els.cartDrawer.querySelector("[data-close]");
      if (closeBtn) closeBtn.focus();
    }
  }

  function closeLayers() {
    els.modal.hidden = true;
    els.cartDrawer.hidden = true;
    els.overlay.hidden = true;
    els.cartOpen.setAttribute("aria-expanded", "false");
    document.body.classList.remove("is-locked");
    layer = null;
    if (lastFocus && typeof lastFocus.focus === "function") lastFocus.focus();
  }

  function openModal(id) {
    const p = PRODUCTS[id];
    if (!p) return;
    modalId = id;
    els.modalImage.src = p.image;
    els.modalImage.alt = p.name;
    els.modalCategory.textContent = p.category;
    els.modalName.textContent = p.name;
    els.modalOrigin.textContent = p.origin;
    els.modalWeight.textContent = p.weight;
    els.modalDesc.textContent = p.desc;
    els.modalPrice.textContent = formatPrice(p.price);
    els.modalQty.value = "1";
    openLayer("modal");
  }

  function openCart() {
    delete els.cartDrawer.dataset.success;
    renderCart();
    openLayer("cart");
  }

  function openMenu() {
    els.menu.hidden = false;
    els.menuOpen.setAttribute("aria-expanded", "true");
    document.body.classList.add("is-locked");
    els.menuClose.focus();
  }

  function closeMenu() {
    els.menu.hidden = true;
    els.menuOpen.setAttribute("aria-expanded", "false");
    if (els.modal.hidden && els.cartDrawer.hidden) {
      document.body.classList.remove("is-locked");
    }
  }

  function clampQty(value) {
    const n = parseInt(value, 10);
    if (Number.isNaN(n)) return 1;
    return Math.max(1, Math.min(12, n));
  }

  document.addEventListener("click", (event) => {
    const nav = event.target.closest("[data-nav]");
    if (nav) {
      event.preventDefault();
      const name = nav.getAttribute("data-nav");
      if (name === "shop" && layer === "cart") closeLayers();
      showView(name);
      return;
    }

    const openId = event.target.closest("[data-open]");
    if (openId) {
      openModal(openId.getAttribute("data-open"));
      return;
    }

    const addId = event.target.closest("[data-add]");
    if (addId) {
      addToCart(addId.getAttribute("data-add"), 1);
      return;
    }

    if (event.target.closest("[data-close]")) {
      closeLayers();
      return;
    }

    const minus = event.target.closest("[data-qty-minus]");
    if (minus) {
      const id = minus.getAttribute("data-qty-minus");
      const row = cart.find((item) => item.id === id);
      if (row) setQty(id, row.qty - 1);
      return;
    }

    const plus = event.target.closest("[data-qty-plus]");
    if (plus) {
      const id = plus.getAttribute("data-qty-plus");
      const row = cart.find((item) => item.id === id);
      if (row) setQty(id, row.qty + 1);
      return;
    }

    const remove = event.target.closest("[data-remove]");
    if (remove) {
      removeFromCart(remove.getAttribute("data-remove"));
      return;
    }

    if (event.target.id === "checkout-btn") {
      checkout();
      return;
    }

    if (event.target.id === "reset-cart") {
      resetSuccess();
    }
  });

  els.cartOpen.addEventListener("click", openCart);
  els.menuOpen.addEventListener("click", openMenu);
  els.menuClose.addEventListener("click", closeMenu);
  els.overlay.addEventListener("click", closeLayers);

  els.modalAdd.addEventListener("click", () => {
    if (!modalId) return;
    addToCart(modalId, clampQty(els.modalQty.value));
    closeLayers();
  });

  document.getElementById("qty-minus").addEventListener("click", () => {
    els.modalQty.value = String(clampQty(Number(els.modalQty.value) - 1));
  });
  document.getElementById("qty-plus").addEventListener("click", () => {
    els.modalQty.value = String(clampQty(Number(els.modalQty.value) + 1));
  });
  els.modalQty.addEventListener("change", () => {
    els.modalQty.value = String(clampQty(els.modalQty.value));
  });

  els.chips.forEach((chip) => {
    chip.addEventListener("click", () => {
      filter = chip.getAttribute("data-filter");
      els.chips.forEach((c) => {
        const on = c === chip;
        c.classList.toggle("is-active", on);
        c.setAttribute("aria-pressed", on ? "true" : "false");
      });
      renderShop();
    });
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      if (!els.menu.hidden) closeMenu();
      else if (layer) closeLayers();
    }
  });

  window.addEventListener("hashchange", () => showView(currentView(), false));

  renderFeatured();
  renderShop();
  updateBadge();
  showView(currentView(), false);
})();
