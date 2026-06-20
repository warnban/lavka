document.addEventListener("DOMContentLoaded", () => {
  /* ---------- Мобильное меню (drawer) ---------- */
  const burger = document.getElementById("burger");
  const drawer = document.getElementById("drawer");
  const overlay = document.getElementById("overlay");
  const drawerClose = document.getElementById("drawerClose");

  const openDrawer = () => {
    drawer?.classList.add("is-open");
    overlay?.classList.add("is-open");
    document.body.style.overflow = "hidden";
  };
  const closeDrawer = () => {
    drawer?.classList.remove("is-open");
    overlay?.classList.remove("is-open");
    document.body.style.overflow = "";
  };

  burger?.addEventListener("click", openDrawer);
  drawerClose?.addEventListener("click", closeDrawer);
  overlay?.addEventListener("click", closeDrawer);

  /* ---------- Каталог в сайдбаре и drawer: подсветка по URL ---------- */
  const normalizeCatalogPath = (path) => (path || "").replace(/\/+$/, "") || "/";

  const highlightCatalogMenu = () => {
    const params = new URLSearchParams(window.location.search);
    const path = normalizeCatalogPath(window.location.pathname);

    document.querySelectorAll(".catmenu__head[data-cat]").forEach((link) => link.classList.remove("is-active"));
    document.querySelectorAll(".catmenu__sub a[data-sub]").forEach((link) => link.classList.remove("is-active"));

    if (params.has("cat") || params.has("sub")) {
      const activeCat = params.get("cat") || "";
      const activeSub = params.get("sub") || "";
      if (activeSub) {
        document.querySelectorAll(".catmenu__sub a[data-sub]").forEach((link) => {
          if (link.dataset.sub !== activeSub) return;
          link.classList.add("is-active");
          link.closest(".catmenu__item")?.querySelector(".catmenu__head[data-cat]")?.classList.add("is-active");
        });
      } else if (activeCat) {
        document.querySelectorAll(`.catmenu__head[data-cat="${activeCat}"]`).forEach((link) => link.classList.add("is-active"));
      }
      return { activeCat, activeSub };
    }

    if (!path.startsWith("/catalog/")) {
      return { activeCat: "", activeSub: "" };
    }

    let activeSubLink = null;
    let activeSubPath = "";
    document.querySelectorAll(".catmenu__sub a[href]").forEach((link) => {
      const linkPath = normalizeCatalogPath(new URL(link.href, window.location.origin).pathname);
      if (path === linkPath || path.startsWith(linkPath + "/")) {
        if (linkPath.length >= activeSubPath.length) {
          activeSubLink = link;
          activeSubPath = linkPath;
        }
      }
    });

    if (activeSubLink) {
      activeSubLink.classList.add("is-active");
      const parentHead = activeSubLink.closest(".catmenu__item")?.querySelector(".catmenu__head[data-cat]");
      parentHead?.classList.add("is-active");
      return {
        activeCat: parentHead?.dataset.cat || "",
        activeSub: activeSubLink.dataset.sub || "",
      };
    }

    let activeCat = "";
    document.querySelectorAll(".catmenu__head[data-cat]").forEach((link) => {
      const linkPath = normalizeCatalogPath(new URL(link.href, window.location.origin).pathname);
      if (path === linkPath || path.startsWith(linkPath + "/")) {
        link.classList.add("is-active");
        activeCat = link.dataset.cat || activeCat;
      }
    });

    return { activeCat, activeSub: "" };
  };

  const { activeCat, activeSub } = highlightCatalogMenu();

  /* ---------- Главная: обзор каталога + фильтр по разделу ---------- */
  let homeCatalogFilterCat = "";

  const escapeHtml = (value) =>
    String(value)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");

  const renderHomeCatalogBreadcrumbs = (mode, sectionName = "") => {
    const nav = document.getElementById("homeCatalogNav");
    if (!nav) {
      return;
    }

    if (mode !== "expanded" || !sectionName) {
      nav.hidden = true;
      nav.innerHTML = "";
      return;
    }

    const items = [
      { title: "Главная", link: "collapse", collapse: true },
      { title: sectionName, link: "" },
    ];

    let html = '<div class="breadcrumbs">';
    html += '<a href="#" class="back-btn is-collapse" aria-label="Назад" data-home-catalog-collapse="1">';
    html += '<svg class="icon" viewBox="0 0 24 24" style="width:20px;height:20px"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>';
    html += "</a>";

    items.forEach((crumb, index) => {
      if (index > 0) {
        html += '<span class="breadcrumbs__sep">›</span>';
      }
      if (crumb.link && crumb.link !== "") {
        const href = crumb.collapse ? "#" : crumb.link;
        const collapseAttr = crumb.collapse ? ' data-home-catalog-collapse="1"' : "";
        html += `<a href="${href}"${collapseAttr}>${escapeHtml(crumb.title)}</a>`;
      } else {
        html += `<span class="is-current">${escapeHtml(crumb.title)}</span>`;
      }
    });

    html += "</div>";
    nav.innerHTML = html;
    nav.hidden = false;
  };

  const resetSidebarToggleButtons = (item, isTargetExpanded) => {
    const btn = item.querySelector(".catmenu__all--toggle");
    if (!btn) {
      return;
    }
    btn.textContent = isTargetExpanded ? "Свернуть" : "Показать всё";
    btn.setAttribute("aria-expanded", isTargetExpanded ? "true" : "false");
  };

  const setHomeCatalogView = (catCode = "", sectionName = "", options = {}) => {
    const panel = document.getElementById("homeCatalogPanel");
    const isFilter = Boolean(catCode);
    const subExpanded = isFilter && Boolean(options.subExpanded);
    homeCatalogFilterCat = catCode;

    document.querySelectorAll(".sidebar--home-catalog .catmenu__item[data-cat]").forEach((item) => {
      const isTarget = isFilter && item.dataset.cat === catCode;
      const head = item.querySelector(".catmenu__head--toggle");

      if (isFilter) {
        item.classList.toggle("is-collapsed", !isTarget);
        item.classList.toggle("is-focused", isTarget);
        item.classList.toggle("is-expanded", isTarget);
        item.classList.toggle("is-sub-expanded", isTarget && subExpanded);
        resetSidebarToggleButtons(item, isTarget && subExpanded);
        head?.setAttribute("aria-expanded", isTarget ? "true" : "false");
      } else {
        item.classList.remove("is-collapsed", "is-focused", "is-sub-expanded");
        if (item.querySelector(".catmenu__sub")) {
          item.classList.add("is-expanded");
        }
        resetSidebarToggleButtons(item, false);
        head?.setAttribute("aria-expanded", "true");
      }
    });

    document.querySelectorAll(".home-cat-row[data-cat]").forEach((row) => {
      const isTarget = isFilter && row.dataset.cat === catCode;
      row.classList.toggle("is-active", isTarget);
      row.hidden = isFilter && !isTarget;
    });

    panel?.classList.toggle("is-overview", !isFilter);
    panel?.classList.toggle("has-filter", isFilter);
    panel?.classList.toggle("is-sub-expanded", subExpanded);

    if (isFilter) {
      renderHomeCatalogBreadcrumbs("expanded", sectionName);
    } else {
      renderHomeCatalogBreadcrumbs("default");
    }
  };

  const getHomeCatalogSectionName = (item, catCode, panel) =>
    item?.querySelector(".catmenu__label")?.textContent?.trim() ||
    panel?.querySelector(`.home-cat-row[data-cat="${catCode}"]`)?.dataset.sectionName ||
    "";

  const initHomeCatalogView = () => {
    if (!document.body.classList.contains("page-home")) {
      return;
    }

    const sidebar = document.querySelector(".sidebar--home-catalog");
    const panel = document.getElementById("homeCatalogPanel");
    if (!sidebar || !panel) {
      return;
    }

    sidebar.addEventListener("click", (event) => {
      const toggleAll = event.target.closest(".catmenu__all--toggle");
      const toggleHead = event.target.closest(".catmenu__head--toggle");

      if (!toggleAll && !toggleHead) {
        return;
      }

      event.preventDefault();
      event.stopPropagation();

      const item = (toggleAll || toggleHead).closest(".catmenu__item");
      const catCode = item?.dataset.cat || "";
      const sectionName = getHomeCatalogSectionName(item, catCode, panel);

      if (!catCode) {
        return;
      }

      if (toggleAll) {
        if (homeCatalogFilterCat === catCode && item.classList.contains("is-sub-expanded")) {
          setHomeCatalogView("", "");
          return;
        }

        setHomeCatalogView(catCode, sectionName, { subExpanded: true });
        return;
      }

      if (homeCatalogFilterCat === catCode) {
        setHomeCatalogView("", "");
        return;
      }

      setHomeCatalogView(catCode, sectionName, { subExpanded: false });
    });

    document.getElementById("homeCatalogNav")?.addEventListener("click", (event) => {
      const collapseTrigger = event.target.closest("[data-home-catalog-collapse]");
      if (!collapseTrigger) {
        return;
      }
      event.preventDefault();
      setHomeCatalogView("", "");
    });

    setHomeCatalogView("", "");
  };

  initHomeCatalogView();

  /* ---------- Страница категории: заголовок и хлебные крошки из URL ---------- */
  const CAT_NAMES = {
    ikony: "Иконы",
    knigi: "Книги",
    odezhda: "Одежда",
    domashnyaya: "Домашняя утварь",
    svechi: "Свечи и ладан",
    lestovki: "Лестовки",
    kresty: "Нательные кресты",
    utvar: "Богослужебная утварь",
  };
  const SUB_NAMES = {
    spasitel: "Образ Спасителя",
    bogorodichnye: "Богородичные",
    prazdnichnye: "Праздничные",
    svyatye: "Святые",
    skladni: "Складни",
    bogosluzhebnye: "Богослужебные книги",
    psaltiri: "Псалтири и молитвословы",
    istoriya: "История старообрядчества",
    kosovorotki: "Косоворотки",
    platki: "Платки",
    lampady: "Лампады",
    podsvechniki: "Подсвечники",
    kioty: "Киоты",
    voskovye: "Свечи восковые",
    ladan: "Ладан",
    kozhanye: "Кожаные",
    bisernye: "Бисерные",
    serebryanye: "Серебряные",
    derevyannye: "Деревянные",
    kadila: "Кадила",
    oblacheniya: "Облачения",
  };

  const catTitle = document.getElementById("catTitle");
  const catCrumb = document.getElementById("catCrumb");
  if (catTitle) {
    const catName = CAT_NAMES[activeCat] || "Каталог";
    const subName = activeSub ? SUB_NAMES[activeSub] : null;
    catTitle.textContent = subName || catName;
    if (catCrumb) {
      catCrumb.innerHTML = subName
        ? `<a href="category.html${activeCat !== "ikony" ? `?cat=${activeCat}` : ""}">${catName}</a>
           <span class="breadcrumbs__sep">›</span>
           <span class="is-current">${subName}</span>`
        : `<span class="is-current">${catName}</span>`;
    }
    document.title = `${subName || catName} — Каталог — Рогожская Лавка`;
  }

  /* ---------- Карусель баннера на главной (2 блока, шаг 1, без автопрокрутки) ---------- */
  const heroSlider = document.getElementById("heroSlider");
  if (heroSlider) {
    const viewport = heroSlider.querySelector(".hero-slider__viewport");
    const track = heroSlider.querySelector(".hero-slider__track");
    const slides = track ? [...track.querySelectorAll(".hero-slider__slide")] : [];
    const dotsWrap = heroSlider.querySelector(".hero-slider__dots");
    const prevBtn = heroSlider.querySelector(".hero-slider__arrow--prev");
    const nextBtn = heroSlider.querySelector(".hero-slider__arrow--next");
    const controls = heroSlider.querySelector(".hero-slider__controls");
    let current = 0;

    const getVisibleCount = () =>
      window.matchMedia("(max-width: 768px)").matches ? 1 : 2;

    const getMaxIndex = () => Math.max(0, slides.length - getVisibleCount());

    const renderDots = () => {
      if (!dotsWrap) return;
      dotsWrap.textContent = "";
      if (slides.length <= getVisibleCount()) return;

      slides.forEach((_, i) => {
        const dot = document.createElement("button");
        dot.type = "button";
        dot.className = "hero-slider__dot";
        dot.setAttribute("aria-label", `Баннер ${i + 1}`);
        const visible = getVisibleCount();
        const isActive = i >= current && i < current + visible;
        if (isActive) dot.classList.add("is-active");
        dot.addEventListener("click", () => goTo(Math.min(i, getMaxIndex())));
        dotsWrap.appendChild(dot);
      });
    };

    const update = () => {
      if (!track || !slides.length) return;

      const visible = getVisibleCount();
      const max = getMaxIndex();
      current = Math.min(current, max);

      if (viewport) {
        const step = viewport.clientWidth / visible;
        track.style.transform = `translateX(-${current * step}px)`;
      } else {
        const shift = slides.length > 0 ? (100 / slides.length) * current : 0;
        track.style.transform = `translateX(-${shift}%)`;
      }

      prevBtn?.toggleAttribute("disabled", current <= 0);
      nextBtn?.toggleAttribute("disabled", current >= max);
      controls?.toggleAttribute("hidden", max === 0);

      renderDots();
    };

    const goTo = (index) => {
      current = Math.max(0, Math.min(index, getMaxIndex()));
      update();
    };

    prevBtn?.addEventListener("click", (e) => {
      e.preventDefault();
      goTo(current - 1);
    });
    nextBtn?.addEventListener("click", (e) => {
      e.preventDefault();
      goTo(current + 1);
    });

    window.addEventListener("resize", update);
    update();
  }

  /* ---------- Фильтры-теги (каталог) ---------- */
  const filters = document.querySelector(".filters");
  filters?.addEventListener("click", (e) => {
    const tag = e.target.closest(".filter-tag");
    if (!tag) return;
    filters.querySelectorAll(".filter-tag").forEach((t) => t.classList.remove("is-active"));
    tag.classList.add("is-active");
  });

  /* ---------- Избранное ---------- */
  /* Логика в favorites.js (AJAX + localStorage) */

  /* ---------- Галерея товара ---------- */
  const galleryMain = document.getElementById("galleryMain");
  document.querySelectorAll(".gallery__thumb").forEach((thumb) => {
    thumb.addEventListener("click", () => {
      document.querySelectorAll(".gallery__thumb").forEach((t) => t.classList.remove("is-active"));
      thumb.classList.add("is-active");
      if (!galleryMain) return;
      if (thumb.dataset.src) {
        galleryMain.innerHTML = `<img src="${thumb.dataset.src}" alt="">`;
      } else if (thumb.dataset.img) {
        galleryMain.textContent = thumb.dataset.img;
      }
    });
  });

  /* ---------- Выбор размера (только статический макет без catalog.js) ---------- */
  const sizes = document.getElementById("sizes");
  if (sizes && !document.getElementById("productCatalogRoot")) {
    sizes.addEventListener("click", (e) => {
      const size = e.target.closest(".size");
      if (!size) return;
      sizes.querySelectorAll(".size").forEach((s) => s.classList.remove("is-active"));
      size.classList.add("is-active");
    });
  }

  /* ---------- Счётчик количества ---------- */
  const qty = document.getElementById("qty");
  if (qty) {
    const input = qty.querySelector(".qty__input");
    qty.addEventListener("click", (e) => {
      const btn = e.target.closest(".qty__btn");
      if (!btn) return;
      let val = parseInt(input.value, 10) || 1;
      val += btn.dataset.act === "plus" ? 1 : -1;
      input.value = Math.max(1, val);
    });
  }

  /* ---------- Табы товара ---------- */
  const tabs = document.getElementById("tabs");
  tabs?.addEventListener("click", (e) => {
    const btn = e.target.closest(".tabs__btn");
    if (!btn) return;
    const id = btn.dataset.tab;
    tabs.querySelectorAll(".tabs__btn").forEach((b) => b.classList.remove("is-active"));
    tabs.querySelectorAll(".tabs__panel").forEach((p) => p.classList.remove("is-active"));
    btn.classList.add("is-active");
    tabs.querySelector(`.tabs__panel[data-panel="${id}"]`)?.classList.add("is-active");
  });

  /* ---------- Профиль: ведём иконку и пункт «Профиль» в кабинет ---------- */
  const personalUrl = document.body.dataset.personalUrl || "/personal/";
  document.querySelectorAll('a[aria-label="Личный кабинет"]').forEach((a) => {
    const href = a.getAttribute("href");
    if (!href || href === "#" || href.endsWith("account.html")) {
      a.setAttribute("href", personalUrl);
    }
  });
  document.querySelectorAll(".bottom-nav__item").forEach((a) => {
    if (a.textContent.trim() === "Профиль") {
      const href = a.getAttribute("href");
      if (!href || href === "#" || href.endsWith("account.html")) {
        a.setAttribute("href", personalUrl);
      }
    }
  });

  /* ---------- Вкладки входа / регистрации ---------- */
  const authTabs = document.getElementById("authTabs");
  const activateAuthTab = (id) => {
    if (!authTabs || !id) return;
    authTabs.querySelectorAll(".auth-tab").forEach((t) => {
      t.classList.toggle("is-active", t.dataset.auth === id);
    });
    document.querySelectorAll(".auth-form").forEach((f) => {
      f.classList.toggle("is-active", f.dataset.authForm === id);
    });
  };
  authTabs?.addEventListener("click", (e) => {
    const tab = e.target.closest(".auth-tab");
    if (!tab) return;
    activateAuthTab(tab.dataset.auth);
  });
  if (authTabs && window.location.hash === "#register") {
    activateAuthTab("register");
  }

  /* ---------- Поиск в topbar + подсказки ---------- */
  const searchBaseUrl = document.body.dataset.searchUrl || "/search/";
  const searchSuggestUrl = document.body.dataset.searchSuggestUrl || "/local/ajax/rogozhskaya_search_suggest.php";

  const buildSearchUrl = (query) => {
    const trimmed = String(query || "").trim();
    if (!trimmed) return searchBaseUrl;
    const url = new URL(searchBaseUrl, window.location.origin);
    url.searchParams.set("q", trimmed);
    return url.pathname + url.search;
  };

  const initSearchSuggest = (input, anchor, options = {}) => {
    if (!input || !anchor || input.dataset.suggestReady === "1") return;
    input.dataset.suggestReady = "1";

    let timer = null;
    let dropdown = null;
    let items = [];
    let activeIndex = -1;
    let lastQuery = "";
    let allUrl = "";
    let hasFetched = false;

    const ensureDropdown = () => {
      if (!dropdown) {
        dropdown = document.createElement("div");
        dropdown.className = "search-suggest";
        dropdown.hidden = true;
        if (getComputedStyle(anchor).position === "static") {
          anchor.style.position = "relative";
        }
        anchor.appendChild(dropdown);
      }
      return dropdown;
    };

    const hideSuggest = () => {
      if (dropdown) dropdown.hidden = true;
      activeIndex = -1;
    };

    const renderItems = () => {
      const dd = ensureDropdown();
      dd.textContent = "";

      if (!lastQuery) {
        hideSuggest();
        return;
      }

      if (!items.length) {
        if (!hasFetched) {
          hideSuggest();
          return;
        }
        const empty = document.createElement("div");
        empty.className = "search-suggest__empty";
        empty.textContent = "Ничего не найдено";
        dd.appendChild(empty);
        dd.hidden = false;
        return;
      }

      const head = document.createElement("div");
      head.className = "search-suggest__head";
      head.textContent = "Товары";
      dd.appendChild(head);

      items.forEach((item, index) => {
        const link = document.createElement("a");
        link.className = "search-suggest__item" + (index === activeIndex ? " is-active" : "");
        link.href = item.url;

        if (item.image) {
          const img = document.createElement("img");
          img.className = "search-suggest__img";
          img.src = item.image;
          img.alt = "";
          img.loading = "lazy";
          link.appendChild(img);
        } else {
          const icon = document.createElement("span");
          icon.className = "search-suggest__icon";
          icon.textContent = "☦";
          link.appendChild(icon);
        }

        const body = document.createElement("span");
        body.className = "search-suggest__body";
        const name = document.createElement("span");
        name.className = "search-suggest__name";
        name.textContent = item.name;
        body.appendChild(name);
        if (item.price) {
          const price = document.createElement("span");
          price.className = "search-suggest__price";
          price.textContent = item.price + " ₽";
          body.appendChild(price);
        }
        link.appendChild(body);
        dd.appendChild(link);
      });

      if (allUrl) {
        const footer = document.createElement("a");
        footer.className = "search-suggest__all";
        footer.href = allUrl;
        footer.textContent = "Показать все результаты";
        dd.appendChild(footer);
      }

      dd.hidden = false;
    };

    const fetchSuggest = (query) => {
      lastQuery = query;
      hasFetched = false;
      fetch(searchSuggestUrl + "?q=" + encodeURIComponent(query), { credentials: "same-origin" })
        .then((response) => response.json())
        .then((data) => {
          if (input.value.trim() !== lastQuery) return;
          items = Array.isArray(data.items) ? data.items : [];
          allUrl = data.allUrl || buildSearchUrl(query);
          activeIndex = -1;
          hasFetched = true;
          renderItems();
        })
        .catch(() => hideSuggest());
    };

    input.addEventListener("input", () => {
      clearTimeout(timer);
      const query = input.value.trim();
      if (query.length < 1) {
        items = [];
        lastQuery = "";
        allUrl = "";
        hasFetched = false;
        hideSuggest();
        return;
      }
      timer = setTimeout(() => fetchSuggest(query), 220);
    });

    input.addEventListener("keydown", (e) => {
      if (e.key === "ArrowDown") {
        if (!items.length) return;
        e.preventDefault();
        activeIndex = (activeIndex + 1) % items.length;
        renderItems();
      } else if (e.key === "ArrowUp") {
        if (!items.length) return;
        e.preventDefault();
        activeIndex = activeIndex <= 0 ? items.length - 1 : activeIndex - 1;
        renderItems();
      } else if (e.key === "Enter") {
        if (activeIndex >= 0 && items[activeIndex]?.url) {
          e.preventDefault();
          window.location.href = items[activeIndex].url;
          return;
        }
        if (typeof options.onSubmit === "function") {
          options.onSubmit(e);
        }
      } else if (e.key === "Escape") {
        hideSuggest();
        if (typeof options.onEscape === "function") {
          options.onEscape(e);
        }
      }
    });

    input.addEventListener("blur", () => {
      setTimeout(hideSuggest, 180);
    });

    input.addEventListener("focus", () => {
      const query = input.value.trim();
      if (query.length >= 1 && (items.length || hasFetched)) {
        renderItems();
      } else if (query.length >= 1) {
        fetchSuggest(query);
      }
    });
  };

  const topbarSearchInput = document.getElementById("topbarSearchInput");
  if (topbarSearchInput) {
    const topbarSearchField = topbarSearchInput.closest(".topbar__search-field");
    const topbarSearchForm = topbarSearchInput.closest(".topbar__search");
    initSearchSuggest(topbarSearchInput, topbarSearchField, {
      onSubmit: (e) => {
        const query = topbarSearchInput.value.trim();
        if (!query) {
          e.preventDefault();
          return;
        }
        if (topbarSearchForm) {
          e.preventDefault();
          window.location.href = buildSearchUrl(query);
        }
      },
    });
  }

  const searchPageInput = document.getElementById("searchPageInput");
  if (searchPageInput) {
    const searchPageAnchor = searchPageInput.closest(".search-form") || searchPageInput.parentElement;
    initSearchSuggest(searchPageInput, searchPageAnchor);
  }
});
