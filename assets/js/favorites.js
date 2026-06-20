(function () {
  "use strict";

  const STORAGE_KEY = "rogo_favorites";

  const cfg = () => window.RogoFavoritesConfig || {};

  function readLocalIds() {
    try {
      const parsed = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
      return Array.isArray(parsed) ? parsed.map((id) => parseInt(id, 10)).filter(Boolean) : [];
    } catch (e) {
      return [];
    }
  }

  function writeLocalIds(ids) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(ids || []));
  }

  function setConfigIds(ids) {
    cfg().ids = ids || [];
    cfg().total = (ids || []).length;
  }

  function isActive(productId) {
    const id = parseInt(productId, 10);
    return (cfg().ids || []).some((item) => parseInt(item, 10) === id);
  }

  function applyButtonState(btn, active) {
    btn.classList.toggle("is-active", !!active);
    btn.setAttribute("aria-pressed", active ? "true" : "false");
  }

  function applyAllButtons() {
    document.querySelectorAll(".card__fav[data-product-id], .product__fav[data-product-id]").forEach((btn) => {
      applyButtonState(btn, isActive(btn.dataset.productId));
    });
  }

  function ajaxRequest(data, onSuccess, onError) {
    if (typeof BX === "undefined" || !BX.ajax) {
      onError && onError("BX not loaded");
      return;
    }

    BX.ajax({
      method: "POST",
      dataType: "json",
      url: cfg().ajaxUrl || "/local/ajax/rogozhskaya_favorites.php",
      data: Object.assign({ sessid: BX.bitrix_sessid() }, data),
      onsuccess: function (result) {
        if (result && result.STATUS === "OK") {
          if (result.ITEMS) {
            setConfigIds(result.ITEMS);
            writeLocalIds(result.ITEMS);
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

  function syncOnLoad() {
    const localIds = readLocalIds();
    const serverIds = (cfg().ids || []).map((id) => parseInt(id, 10)).filter(Boolean);
    const merged = Array.from(new Set(serverIds.concat(localIds)));

    setConfigIds(merged);
    writeLocalIds(merged);
    applyAllButtons();

    if (!cfg().authorized) {
      if (merged.length !== serverIds.length) {
        ajaxRequest({ action: "sync", ids: JSON.stringify(merged) });
      }
      return;
    }

    if (localIds.length) {
      ajaxRequest({ action: "sync", ids: JSON.stringify(merged) }, applyAllButtons);
      return;
    }

    if (!serverIds.length && merged.length) {
      ajaxRequest({ action: "sync", ids: JSON.stringify(merged) });
    }
  }

  function toggleFavorite(btn) {
    const productId = parseInt(btn.dataset.productId, 10);
    if (!productId) {
      return;
    }

    const nextActive = !isActive(productId);
    applyButtonState(btn, nextActive);

    ajaxRequest(
      { action: "toggle", id: productId },
      function () {
        applyAllButtons();
      },
      function () {
        applyButtonState(btn, !nextActive);
      }
    );
  }

  document.addEventListener("click", function (e) {
    const btn = e.target.closest(".card__fav[data-product-id], .product__fav[data-product-id]");
    if (!btn) {
      return;
    }
    e.preventDefault();
    e.stopPropagation();
    toggleFavorite(btn);
  });

  document.addEventListener("DOMContentLoaded", syncOnLoad);
  if (document.readyState !== "loading") {
    syncOnLoad();
  }
})();
