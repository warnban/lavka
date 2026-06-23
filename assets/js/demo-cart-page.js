(function () {
  "use strict";

  var BASKET_KEY = "rogo_demo_basket";

  function readBasket() {
    try {
      return JSON.parse(localStorage.getItem(BASKET_KEY) || "{}") || {};
    } catch (e) {
      return {};
    }
  }

  function writeBasket(items) {
    localStorage.setItem(BASKET_KEY, JSON.stringify(items || {}));
    if (window.RogoCatalogConfig) window.RogoCatalogConfig.items = items;
    document.dispatchEvent(new CustomEvent("OnBasketChange"));
  }

  function esc(s) {
    var d = document.createElement("div");
    d.textContent = s;
    return d.innerHTML;
  }

  function formatPrice(n) {
    return String(Math.round(n)).replace(/\B(?=(\d{3})+(?!\d))/g, " ");
  }

  function catalogUrl() {
    var base = document.querySelector("base");
    if (base && base.href) {
      try {
        return new URL("catalog/", base.href).pathname;
      } catch (e2) {
        /* fall through */
      }
    }
    return "catalog/";
  }

  function renderEmpty(box) {
    box.innerHTML =
      '<p class="catalog-intro">Корзина пуста. Загляните в <a href="' +
      esc(catalogUrl()) +
      '">каталог</a> — там иконы, книги, свечи и многое другое.</p>' +
      '<a href="' +
      esc(catalogUrl()) +
      '" class="btn btn--gold">Перейти в каталог</a>';
  }

  function renderCart(box, catalog) {
    var items = readBasket();
    var byId = {};
    (catalog.products || []).forEach(function (p) {
      byId[p.id] = p;
    });

    var rows = [];
    var total = 0;
    var count = 0;

    Object.keys(items).forEach(function (id) {
      var qty = parseFloat(items[id]) || 0;
      if (qty <= 0) return;
      var p = byId[id];
      if (!p) return;
      var lineTotal = (p.price || 0) * qty;
      total += lineTotal;
      count += qty;
      rows.push({
        id: id,
        qty: qty,
        product: p,
        lineTotal: lineTotal,
      });
    });

    if (!rows.length) {
      renderEmpty(box);
      return;
    }

    var itemsHtml = rows
      .map(function (row) {
        var p = row.product;
        return (
          '<div class="cart-item" data-id="' +
          esc(row.id) +
          '">' +
          '<div class="cart-item__media"><a href="' +
          esc(p.url) +
          '"><span style="font-size:36px;color:var(--gold-dark)">☦</span></a></div>' +
          '<div class="cart-item__info">' +
          '<div class="cart-item__title"><a href="' +
          esc(p.url) +
          '">' +
          esc(p.name) +
          "</a></div>" +
          "</div>" +
          '<div class="cart-item__controls">' +
          '<div class="qty" data-id="' +
          esc(row.id) +
          '">' +
          '<button type="button" class="qty__btn" data-action="minus" aria-label="Меньше">−</button>' +
          '<input type="text" class="qty__input" value="' +
          row.qty +
          '" readonly aria-label="Количество">' +
          '<button type="button" class="qty__btn" data-action="plus" aria-label="Больше">+</button>' +
          "</div>" +
          '<div class="cart-item__price">' +
          formatPrice(row.lineTotal) +
          " ₽</div>" +
          '<button type="button" class="cart-item__remove" data-action="remove" aria-label="Удалить">' +
          '<svg class="icon" viewBox="0 0 24 24" style="width:20px;height:20px"><path d="M18 6 6 18M6 6l12 12"/></svg>' +
          "</button>" +
          "</div>" +
          "</div>"
        );
      })
      .join("");

    box.innerHTML =
      '<div class="cart">' +
      '<div class="cart__main">' +
      '<div class="cart__items">' +
      itemsHtml +
      "</div>" +
      '<a href="' +
      esc(catalogUrl()) +
      '" class="btn btn--outline" style="margin-top:6px">← Продолжить покупки</a>' +
      "</div>" +
      '<aside class="cart__aside">' +
      '<div class="summary">' +
      '<div class="summary__title">Ваш заказ</div>' +
      '<div class="summary__row"><span>Скидка</span><span>−0 ₽</span></div>' +
      '<div class="summary__row"><span>Доставка</span><span>рассчитывается при оформлении</span></div>' +
      '<div class="promo">' +
      '<input class="input" type="text" placeholder="Промокод" disabled>' +
      '<button type="button" class="btn btn--outline" disabled>ОК</button>' +
      "</div>" +
      '<div class="summary__row summary__row--total"><span>Итого</span><span>' +
      formatPrice(total) +
      " ₽</span></div>" +
      '<button type="button" class="btn btn--gold btn--block js-demo-checkout" style="margin-top:16px">Оформить заказ</button>' +
      '<p class="auth-note" style="margin-top:12px">Демо-макет: оформление заказа не подключено.</p>' +
      "</div>" +
      "</aside>" +
      "</div>";

    box.querySelector(".js-demo-checkout")?.addEventListener("click", function () {
      window.alert("Демо-макет: оформление заказа не подключено.");
    });

    box.addEventListener("click", function (e) {
      var btn = e.target.closest("[data-action]");
      if (!btn) return;
      var item = btn.closest(".cart-item");
      if (!item) return;
      var id = item.getAttribute("data-id");
      var basket = readBasket();
      var qty = parseFloat(basket[id]) || 0;
      var action = btn.getAttribute("data-action");

      if (action === "remove") {
        delete basket[id];
      } else if (action === "plus") {
        basket[id] = qty + 1;
      } else if (action === "minus") {
        qty -= 1;
        if (qty > 0) basket[id] = qty;
        else delete basket[id];
      }

      writeBasket(basket);
      renderCart(box, catalog);
    });
  }

  document.addEventListener("DOMContentLoaded", function () {
    var box = document.getElementById("demoCartPage");
    if (!box) return;

    var load = window.RogoDemoCatalogPromise || fetch(new URL("assets/data/catalog.json", document.baseURI || location.href)).then(function (r) {
      return r.json();
    });

    load
      .then(function (catalog) {
        renderCart(box, catalog);
      })
      .catch(function () {
        renderEmpty(box);
      });

    document.addEventListener("OnBasketChange", function () {
      load.then(function (catalog) {
        renderCart(box, catalog);
      });
    });
  });
})();
