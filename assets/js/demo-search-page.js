(function () {
  "use strict";

  function esc(s) {
    var d = document.createElement("div");
    d.textContent = s;
    return d.innerHTML;
  }

  document.addEventListener("DOMContentLoaded", function () {
    var box = document.getElementById("searchResults");
    var input = document.getElementById("searchPageInput");
    if (!box || !input) return;

    var params = new URLSearchParams(window.location.search);
    var q = (params.get("q") || "").trim();
    input.value = q;
    if (!q) return;

    (window.RogoDemoCatalogPromise || fetch("../assets/data/catalog.json").then(function (r) { return r.json(); })).then(function (catalog) {
      var ql = q.toLowerCase();
      var list = (catalog.products || []).filter(function (p) {
        return p.name.toLowerCase().indexOf(ql) >= 0;
      });
      if (!list.length) {
        box.innerHTML = '<p class="catalog-intro">По запросу «' + esc(q) + '» ничего не найдено.</p>';
        return;
      }
      box.innerHTML = list
        .map(function (p) {
          return (
            '<article class="card"><div class="card__media"><a href="../' +
            esc(p.url) +
            '"><span style="font-size:64px;color:var(--gold-dark)">' +
            (p.symbol || "☦") +
            '</span></a></div><div class="card__body"><h3 class="card__title"><a href="../' +
            esc(p.url) +
            '">' +
            esc(p.name) +
            '</a></h3><div class="card__foot"><div class="card__price"><span class="card__price-current">' +
            esc(p.pricePrint) +
            ' <small>₽</small></span></div><div class="card__actions"><div class="js-cart-host card__cart-host" data-product-id="' +
            p.id +
            '" data-add-class="card__btn" data-in-cart-class="card__btn"></div></div></div></div></article>'
          );
        })
        .join("");
      if (window.RogoCatalog) window.RogoCatalog.refreshAllHosts();
    });
  });
})();
