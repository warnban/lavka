(function () {
  "use strict";

  if (window.__rogoDemoMode) return;
  window.__rogoDemoMode = true;

  var BASKET_KEY = "rogo_demo_basket";
  var FAV_KEY = "rogo_favorites";

  function readBasket() {
    try {
      return JSON.parse(localStorage.getItem(BASKET_KEY) || "{}") || {};
    } catch (e) {
      return {};
    }
  }

  function writeBasket(items) {
    localStorage.setItem(BASKET_KEY, JSON.stringify(items || {}));
    updateCartBadges(items);
    document.dispatchEvent(new CustomEvent("OnBasketChange"));
  }

  function basketCount(items) {
    items = items || readBasket();
    return Object.values(items).reduce(function (sum, q) {
      return sum + (parseFloat(q) || 0);
    }, 0);
  }

  function updateCartBadges(items) {
    var count = Math.round(basketCount(items));
    ["topbarCartBadge", "bottomCartBadge"].forEach(function (id) {
      var el = document.getElementById(id);
      if (!el) return;
      if (count > 0) {
        el.textContent = String(count);
        el.hidden = false;
      } else {
        el.hidden = true;
      }
    });
  }

  function readFavIds() {
    try {
      var parsed = JSON.parse(localStorage.getItem(FAV_KEY) || "[]");
      return Array.isArray(parsed) ? parsed.map(Number).filter(Boolean) : [];
    } catch (e2) {
      return [];
    }
  }

  function writeFavIds(ids) {
    localStorage.setItem(FAV_KEY, JSON.stringify(ids || []));
    if (window.RogoFavoritesConfig) {
      window.RogoFavoritesConfig.ids = ids;
      window.RogoFavoritesConfig.total = ids.length;
    }
  }

  function basePrefix() {
    var base = document.querySelector("base");
    if (!base || !base.href) return "./";
    try {
      var u = new URL(base.href);
      return u.pathname.endsWith("/") ? u.pathname : u.pathname + "/";
    } catch (e3) {
      return "/lavka/";
    }
  }

  window.RogoCatalogConfig = {
    ajaxUrl: "demo://basket",
    cartUrl: basePrefix() + "personal/cart/",
    items: readBasket(),
  };

  window.RogoFavoritesConfig = {
    ajaxUrl: "demo://favorites",
    pageUrl: basePrefix() + "favorites/",
    ids: readFavIds(),
    authorized: false,
    total: readFavIds().length,
  };

  window.BX = {
    bitrix_sessid: function () {
      return "demo";
    },
    onCustomEvent: function (name, handler) {
      document.addEventListener(name, handler);
    },
    ajax: function (opts) {
      var url = opts.url || "";
      var data = opts.data || {};
      var ok = function (payload) {
        opts.onsuccess && opts.onsuccess(payload);
      };
      var fail = function (msg) {
        opts.onfailure && opts.onfailure(msg);
      };

      if (url.indexOf("basket") >= 0 || url === "demo://basket" || (window.RogoCatalogConfig && url === window.RogoCatalogConfig.ajaxUrl)) {
        var items = readBasket();
        var id = parseInt(data.id, 10);
        if (data.action === "add") {
          items[id] = (parseFloat(items[id]) || 0) + (parseFloat(data.quantity) || 1);
        } else if (data.action === "set") {
          var q = parseFloat(data.quantity) || 0;
          if (q > 0) items[id] = q;
          else delete items[id];
        }
        writeBasket(items);
        window.RogoCatalogConfig.items = items;
        ok({ STATUS: "OK", ITEMS: items, PRODUCT_QUANTITY: items[id] || 0 });
        return;
      }

      if (url.indexOf("favorites") >= 0 || url === "demo://favorites" || (window.RogoFavoritesConfig && url === window.RogoFavoritesConfig.ajaxUrl)) {
        var ids = readFavIds();
        var pid = parseInt(data.id, 10);
        if (data.action === "toggle" && pid) {
          var idx = ids.indexOf(pid);
          if (idx >= 0) ids.splice(idx, 1);
          else ids.push(pid);
        } else if (data.action === "sync" && data.ids) {
          try {
            ids = JSON.parse(data.ids).map(Number).filter(Boolean);
          } catch (e4) {
            /* keep */
          }
        }
        writeFavIds(ids);
        ok({ STATUS: "OK", ITEMS: ids });
        return;
      }

      fail("Unknown demo endpoint");
    },
  };

  var catalogPromise = fetch(document.querySelector("base") ? new URL("assets/data/catalog.json", document.baseURI).href : "assets/data/catalog.json")
    .then(function (r) {
      return r.json();
    })
    .catch(function () {
      return { products: [] };
    });

  window.RogoDemoCatalogPromise = catalogPromise;

  var nativeFetch = window.fetch.bind(window);
  window.fetch = function (input, init) {
    var href = typeof input === "string" ? input : input.url;
    if (href && href.indexOf("search-suggest.json") >= 0) {
      return catalogPromise.then(function (catalog) {
        var u = new URL(href, window.location.href);
        var q = (u.searchParams.get("q") || "").trim().toLowerCase();
        var items = (catalog.products || [])
          .filter(function (p) {
            return !q || p.name.toLowerCase().indexOf(q) >= 0;
          })
          .slice(0, 8)
          .map(function (p) {
            return { NAME: p.name, URL: p.url, PRICE: p.pricePrint, PICTURE: "" };
          });
        return new Response(JSON.stringify({ STATUS: "OK", ITEMS: items, QUERY: q }), {
          headers: { "Content-Type": "application/json" },
        });
      });
    }
    return nativeFetch(input, init);
  };

  document.addEventListener("DOMContentLoaded", function () {
    updateCartBadges(readBasket());
  });
  updateCartBadges(readBasket());
})();
