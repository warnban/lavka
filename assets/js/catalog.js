(function () {
  "use strict";

  const cfg = () => window.RogoCatalogConfig || {};
  const cartIconSmall =
    '<svg class="icon" viewBox="0 0 24 24" style="width:18px;height:18px"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/></svg>';

  function getItems() {
    return cfg().items || {};
  }

  function setItems(items) {
    cfg().items = items || {};
  }

  function getQty(productId) {
    return parseFloat(getItems()[String(productId)] || getItems()[productId] || 0) || 0;
  }

  function setQty(productId, qty) {
    const items = Object.assign({}, getItems());
    if (qty > 0) {
      items[productId] = qty;
    } else {
      delete items[productId];
    }
    setItems(items);
  }

  function ajaxRequest(data, onSuccess, onError) {
    if (typeof BX === "undefined" || !BX.ajax) {
      onError && onError("BX not loaded");
      return;
    }

    BX.ajax({
      method: "POST",
      dataType: "json",
      url: cfg().ajaxUrl || "/local/ajax/rogozhskaya_basket.php",
      data: Object.assign({ sessid: BX.bitrix_sessid() }, data),
      onsuccess: function (result) {
        if (result && result.STATUS === "OK") {
          if (result.ITEMS) {
            setItems(result.ITEMS);
          }
          if (typeof BX !== "undefined") {
            BX.onCustomEvent("OnBasketChange");
          }
          onSuccess && onSuccess(result);
        } else {
          onError && onError((result && result.MESSAGE) || "Unknown error");
        }
      },
      onfailure: function () {
        onError && onError("Network error");
      },
    });
  }

  function buildAddButton(productId, label, extraClass) {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "btn btn--gold js-cart-add " + (extraClass || "");
    btn.dataset.productId = String(productId);
    const isCardBtn = String(extraClass || "").split(/\s+/).includes("card__btn");
    if (isCardBtn) {
      btn.textContent = label || "В корзину";
    } else {
      btn.innerHTML = cartIconSmall + " " + (label || "В корзину");
    }
    return btn;
  }

  function buildInCartControl(productId, qty, extraClass) {
    const wrap = document.createElement("div");
    wrap.className = "cart-btn is-in-cart " + (extraClass || "");
    wrap.dataset.productId = String(productId);

    const label = document.createElement("a");
    label.className = "cart-btn__label";
    label.href = cfg().cartUrl || "/personal/cart/";
    label.textContent = "В корзине";

    const qtyBox = document.createElement("div");
    qtyBox.className = "cart-btn__qty";

    const minus = document.createElement("button");
    minus.type = "button";
    minus.className = "cart-btn__btn";
    minus.dataset.act = "minus";
    minus.setAttribute("aria-label", "Меньше");
    minus.textContent = "−";

    const count = document.createElement("span");
    count.className = "cart-btn__count";
    count.textContent = String(qty);

    const plus = document.createElement("button");
    plus.type = "button";
    plus.className = "cart-btn__btn";
    plus.dataset.act = "plus";
    plus.setAttribute("aria-label", "Больше");
    plus.textContent = "+";

    qtyBox.append(minus, count, plus);
    wrap.append(label, qtyBox);
    return wrap;
  }

  function mountControl(host, productId, qty, options) {
    productId = parseInt(productId, 10);
    if (!host || !productId) return;

    const opts = options || {};
    const addClass = opts.addClass || "";
    const inCartClass = opts.inCartClass || "";

    host.innerHTML = "";
    host.dataset.productId = String(productId);
    host.classList.add("js-cart-host");

    if (qty > 0) {
      host.appendChild(buildInCartControl(productId, qty, inCartClass));
    } else {
      host.appendChild(buildAddButton(productId, opts.addLabel || "В корзину", addClass));
    }
  }

  function refreshHost(host) {
    const productId = parseInt(host.dataset.productId, 10);
    if (!host || !productId) return;
    mountControl(host, productId, getQty(productId), {
      addClass: host.dataset.addClass || "",
      inCartClass: host.dataset.inCartClass || "",
      addLabel: host.dataset.addLabel || "В корзину",
    });
  }

  function refreshAllHosts() {
    document.querySelectorAll(".js-cart-host").forEach(refreshHost);
  }

  function addProduct(productId, quantity, host, onDone) {
    const btn = host && host.querySelector(".js-cart-add");
    if (btn) btn.classList.add("is-loading");

    ajaxRequest(
      { action: "add", id: productId, quantity: quantity || 1 },
      function (result) {
        if (btn) btn.classList.remove("is-loading");
        const qty = result.PRODUCT_QUANTITY || getQty(productId);
        if (host) {
          mountControl(host, productId, qty, {
            addClass: host.dataset.addClass || "card__btn",
            inCartClass: host.dataset.inCartClass || "card__btn",
          });
        } else {
          refreshAllHosts();
        }
        onDone && onDone(result);
      },
      function (msg) {
        if (btn) btn.classList.remove("is-loading");
        console.error("Basket add error:", msg);
      }
    );
  }

  function setProductQuantity(productId, quantity, host) {
    ajaxRequest(
      { action: "set", id: productId, quantity: quantity },
      function (result) {
        const qty = result.PRODUCT_QUANTITY || 0;
        if (host) {
          mountControl(host, productId, qty, {
            addClass: host.dataset.addClass || "card__btn",
            inCartClass: host.dataset.inCartClass || "card__btn",
          });
        } else {
          refreshAllHosts();
        }
      },
      function (msg) {
        console.error("Basket update error:", msg);
      }
    );
  }

  function Product(root, config) {
    this.root = root;
    this.config = config || {};
    this.offers = config.offers || [];
    this.offerSelected = config.offerSelected || 0;
    this.selectedTree = {};
    this.quantityInput = root.querySelector(".qty__input");
    this.priceNode = root.querySelector("#productPrice");
    this.stockNode = root.querySelector("#productStock");
    this.cartHost = root.querySelector("#productCartHost");
    this.galleryMain = document.getElementById("galleryMain");
    this.buybar = document.querySelector(".buybar");
    this.buybarPrice = this.buybar ? this.buybar.querySelector(".buybar__price") : null;
    this.buybarHost = this.buybar ? this.buybar.querySelector("#buybarCartHost") : null;

    if (this.offers.length) {
      this.initOffers();
    } else if (config.product) {
      this.initSimple(config.product);
    }

    if (this.cartHost) {
      this.cartHost.dataset.addClass = "";
      this.cartHost.dataset.inCartClass = "";
      this.cartHost.dataset.addLabel = "В корзину";
      this.refreshCartHost();
    }
    if (this.buybarHost) {
      this.buybarHost.dataset.addLabel = config.buyLabel || "В корзину";
      this.refreshBuybarHost();
    }
    scheduleProductBuyLayout(this.root);
  }

  Product.prototype.getCurrentProductId = function () {
    if (this.offers.length) {
      const offer = this.offers[this.offerSelected];
      return offer ? offer.ID : 0;
    }
    return this.config.product ? this.config.product.ID : 0;
  };

  Product.prototype.initSimple = function (product) {
    this.productId = product.ID;
  };

  Product.prototype.initOffers = function () {
    const offer = this.offers[this.offerSelected];
    if (offer && offer.TREE) {
      this.selectedTree = Object.assign({}, offer.TREE);
    }
    this.root.querySelectorAll("[data-treevalue]").forEach((el) => {
      el.addEventListener("click", () => this.onSkuClick(el));
    });
    this.syncSkuActiveState();
    this.updateUI();
  };

  Product.prototype.onSkuClick = function (el) {
    const treeValue = el.getAttribute("data-treevalue");
    if (!treeValue) return;
    const parts = treeValue.split("_");
    if (parts.length < 2) return;
    this.selectedTree["PROP_" + parts[0]] = parts[1];
    const group = el.closest(".option__values");
    if (group) {
      group.querySelectorAll(".size").forEach((node) => node.classList.remove("is-active"));
    }
    el.classList.add("is-active");
    const idx = this.findOfferIndex();
    if (idx >= 0) {
      this.offerSelected = idx;
      this.updateUI();
    }
  };

  Product.prototype.findOfferIndex = function () {
    return this.offers.findIndex((offer) => {
      if (!offer.TREE) return false;
      return Object.keys(this.selectedTree).every(
        (key) => String(offer.TREE[key]) === String(this.selectedTree[key])
      );
    });
  };

  Product.prototype.syncSkuActiveState = function () {
    this.root.querySelectorAll("[data-treevalue]").forEach((el) => {
      const treeValue = el.getAttribute("data-treevalue");
      if (!treeValue) return;
      const parts = treeValue.split("_");
      if (parts.length < 2) return;
      const isActive = String(this.selectedTree["PROP_" + parts[0]]) === String(parts[1]);
      el.classList.toggle("is-active", isActive);
    });
  };

  Product.prototype.getQuantity = function () {
    if (!this.quantityInput) return 1;
    const val = parseInt(this.quantityInput.value, 10);
    return Math.max(1, val || 1);
  };

  Product.prototype.refreshCartHost = function () {
    const productId = this.getCurrentProductId();
    if (!this.cartHost || !productId) return;
    this.cartHost.dataset.productId = String(productId);
    const offer = this.getCurrentOffer();
    const canBuy = offer ? offer.CAN_BUY : this.config.product && this.config.product.CAN_BUY;
    if (!canBuy) {
      this.cartHost.innerHTML =
        '<span class="btn btn--gold" style="opacity:.6;pointer-events:none">Нет в наличии</span>';
      scheduleProductBuyLayout(this.root);
      return;
    }
    mountControl(this.cartHost, productId, getQty(productId), {
      addLabel: "В корзину",
    });
    scheduleProductBuyLayout(this.root);
  };

  Product.prototype.refreshBuybarHost = function () {
    const productId = this.getCurrentProductId();
    if (!this.buybarHost || !productId) return;
    this.buybarHost.dataset.productId = String(productId);
    const offer = this.getCurrentOffer();
    const canBuy = offer ? offer.CAN_BUY : this.config.product && this.config.product.CAN_BUY;
    if (!canBuy) {
      this.buybarHost.innerHTML = "";
      return;
    }
    mountControl(this.buybarHost, productId, getQty(productId), { addLabel: "В корзину" });
  };

  Product.prototype.getCurrentOffer = function () {
    return this.offers[this.offerSelected] || null;
  };

  Product.prototype.updateUI = function () {
    const offer = this.getCurrentOffer();
    if (!offer) return;

    if (this.priceNode) {
      this.priceNode.innerHTML = formatPriceHtml(offer.PRICE_PRINT, offer.OLD_PRICE_PRINT);
    }
    if (this.stockNode) {
      this.stockNode.innerHTML =
        '<span class="badge__dot"></span> ' + (offer.CAN_BUY ? "В наличии" : "Нет в наличии");
    }
    if (this.buybarPrice && offer.PRICE_PRINT) {
      this.buybarPrice.textContent = offer.PRICE_PRINT.replace(/\s*₽\s*$/, "").trim() + " ₽";
    }
    if (this.galleryMain && offer.PHOTOS && offer.PHOTOS.length) {
      this.galleryMain.innerHTML = '<img src="' + offer.PHOTOS[0] + '" alt="" itemprop="image">';
    }
    this.refreshCartHost();
    this.refreshBuybarHost();
  };

  function formatPriceHtml(pricePrint, oldPricePrint) {
    const price = pricePrint ? pricePrint.replace(/\s*₽\s*$/, "").trim() : "";
    if (!price) return "";
    let html = "";
    if (oldPricePrint) {
      const oldPrice = oldPricePrint.replace(/\s*₽\s*$/, "").trim();
      if (oldPrice) {
        html += '<span class="card__price-old">' + oldPrice + " ₽</span>";
      }
    }
    html += '<span class="product__price-current">' + price + " <small>₽</small></span>";
    return html;
  }

  function syncProductBuyLayout(scope) {
    const root = scope && scope.querySelector ? scope : document;

    root.querySelectorAll(".product__buy").forEach((buy) => {
      const actions = buy.querySelector(".product__actions");
      const delivery = buy.querySelector(".delivery-note");
      if (!actions || !delivery) return;
      delivery.style.removeProperty("width");
      const width = Math.ceil(actions.getBoundingClientRect().width);
      if (width > 0) {
        delivery.style.width = width + "px";
      }
    });

    root.querySelectorAll(".product__info").forEach((info) => {
      if (info.querySelector(".product__buy")) return;
      const actions = info.querySelector(":scope > .product__actions");
      const delivery = info.querySelector(":scope > .delivery-note");
      if (!actions || !delivery) return;
      delivery.style.removeProperty("width");
      const width = Math.ceil(actions.getBoundingClientRect().width);
      if (width > 0) {
        delivery.style.width = width + "px";
      }
    });
  }

  function scheduleProductBuyLayout(scope) {
    requestAnimationFrame(() => {
      syncProductBuyLayout(scope);
      requestAnimationFrame(() => syncProductBuyLayout(scope));
    });
  }

  function initList() {
    document.querySelectorAll(".js-cart-host").forEach((host) => {
      refreshHost(host);
    });
    scheduleProductBuyLayout();

    if (!window.__rogoProductBuyResizeBound) {
      window.__rogoProductBuyResizeBound = true;
      let resizeTimer = 0;
      window.addEventListener("resize", () => {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(() => scheduleProductBuyLayout(), 100);
      });
    }

    document.addEventListener("click", (e) => {
      const addBtn = e.target.closest(".js-cart-add");
      if (addBtn) {
        e.preventDefault();
        const host = addBtn.closest(".js-cart-host");
        const productId = parseInt(addBtn.dataset.productId || host?.dataset.productId, 10);
        if (!productId) return;
        addProduct(productId, 1, host);
        return;
      }

      const qtyBtn = e.target.closest(".cart-btn__btn");
      if (qtyBtn) {
        e.preventDefault();
        const wrap = qtyBtn.closest(".cart-btn");
        const host = qtyBtn.closest(".js-cart-host");
        const productId = parseInt(wrap?.dataset.productId || host?.dataset.productId, 10);
        if (!productId) return;
        const countEl = wrap.querySelector(".cart-btn__count");
        let qty = parseInt(countEl?.textContent, 10) || 0;
        qty += qtyBtn.dataset.act === "plus" ? 1 : -1;
        setProductQuantity(productId, qty, host);
      }
    });
  }

  function initProduct(root, config) {
    if (!root || !config) return;
    return new Product(root, config);
  }

  window.RogoCatalog = {
    addProduct: addProduct,
    setProductQuantity: setProductQuantity,
    refreshAllHosts: refreshAllHosts,
    Product: Product,
    initProduct: initProduct,
    initList: initList,
    syncProductBuyLayout: syncProductBuyLayout,
  };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initList);
  } else {
    initList();
  }
})();
