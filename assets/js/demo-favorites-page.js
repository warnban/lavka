(function () {
  "use strict";

  function readFavIds() {
    try {
      var parsed = JSON.parse(localStorage.getItem("rogo_favorites") || "[]");
      return Array.isArray(parsed) ? parsed.map(Number).filter(Boolean) : [];
    } catch (e) {
      return [];
    }
  }

  function esc(s) {
    var d = document.createElement("div");
    d.textContent = s;
    return d.innerHTML;
  }

  document.addEventListener("DOMContentLoaded", function () {
    var grid = document.getElementById("favoritesGrid");
    if (!grid) return;

    var ids = readFavIds();
    if (!ids.length) {
      grid.outerHTML =
        '<div class="account-empty"><p>В избранном пока пусто.</p><a href="../catalog/" class="btn btn--gold">Перейти в каталог</a></div>';
      return;
    }

    Promise.all([window.RogoDemoCatalogPromise || fetch("../assets/data/catalog.json").then(function (r) { return r.json(); })]).then(function (res) {
      var catalog = res[0];
      var byId = {};
      (catalog.products || []).forEach(function (p) {
        byId[p.id] = p;
      });
      var html = "";
      ids.forEach(function (id) {
        var p = byId[id];
        if (!p) return;
        html +=
          '<article class="card"><div class="card__media"><a href="../' +
          esc(p.url) +
          '"><span style="font-size:64px;color:var(--gold-dark)">' +
          (p.symbol || "☦") +
          '</span></a><button class="card__fav is-active" type="button" aria-label="В избранное" data-product-id="' +
          id +
          '"><svg class="icon" viewBox="0 0 24 24"><path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.6l-1-1a5.5 5.5 0 0 0-7.8 7.8l1 1L12 21l7.8-7.6 1-1a5.5 5.5 0 0 0 0-7.8z"/></svg></button></div><div class="card__body"><h3 class="card__title"><a href="../' +
          esc(p.url) +
          '">' +
          esc(p.name) +
          '</a></h3><div class="card__foot"><div class="card__price"><span class="card__price-current">' +
          esc(p.pricePrint) +
          ' <small>₽</small></span></div><div class="card__actions"><div class="js-cart-host card__cart-host" data-product-id="' +
          id +
          '" data-add-class="card__btn" data-in-cart-class="card__btn"></div></div></div></div></article>';
      });
      grid.innerHTML = html || '<p class="catalog-intro">Сохранённые товары недоступны.</p>';
      if (window.RogoCatalog) window.RogoCatalog.refreshAllHosts();
    });
  });
})();
