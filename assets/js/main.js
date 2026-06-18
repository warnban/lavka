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

  /* ---------- Карусель баннера на главной ---------- */
  const heroSlider = document.getElementById("heroSlider");
  if (heroSlider) {
    const slides = [...heroSlider.querySelectorAll(".hero-slider__slide")];
    const dots = [...heroSlider.querySelectorAll(".hero-slider__dot")];
    const prevBtn = heroSlider.querySelector(".hero-slider__arrow--prev");
    const nextBtn = heroSlider.querySelector(".hero-slider__arrow--next");
    let current = slides.findIndex((s) => s.classList.contains("is-active"));
    if (current < 0) current = 0;

    const goTo = (index) => {
      current = (index + slides.length) % slides.length;
      slides.forEach((s, i) => s.classList.toggle("is-active", i === current));
      dots.forEach((d, i) => d.classList.toggle("is-active", i === current));
    };

    prevBtn?.addEventListener("click", (e) => {
      e.preventDefault();
      goTo(current - 1);
    });
    nextBtn?.addEventListener("click", (e) => {
      e.preventDefault();
      goTo(current + 1);
    });
    dots.forEach((dot, i) => dot.addEventListener("click", () => goTo(i)));

    let autoplay = setInterval(() => goTo(current + 1), 6000);
    heroSlider.addEventListener("mouseenter", () => clearInterval(autoplay));
    heroSlider.addEventListener("mouseleave", () => {
      autoplay = setInterval(() => goTo(current + 1), 6000);
    });
  }

  /* ---------- Фильтры-теги (каталог) ---------- */
  const filters = document.querySelector(".filters");
  filters?.addEventListener("click", (e) => {
    const tag = e.target.closest(".filter-tag");
    if (!tag) return;
    filters.querySelectorAll(".filter-tag").forEach((t) => t.classList.remove("is-active"));
    tag.classList.add("is-active");
  });

  /* ---------- Избранное (карточки) ---------- */
  document.querySelectorAll(".card__fav").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.preventDefault();
      btn.classList.toggle("is-active");
    });
  });

  /* ---------- Галерея товара ---------- */
  const galleryMain = document.getElementById("galleryMain");
  document.querySelectorAll(".gallery__thumb").forEach((thumb) => {
    thumb.addEventListener("click", () => {
      document.querySelectorAll(".gallery__thumb").forEach((t) => t.classList.remove("is-active"));
      thumb.classList.add("is-active");
      if (galleryMain && thumb.dataset.img) galleryMain.textContent = thumb.dataset.img;
    });
  });

  /* ---------- Выбор размера ---------- */
  const sizes = document.getElementById("sizes");
  sizes?.addEventListener("click", (e) => {
    const size = e.target.closest(".size");
    if (!size) return;
    sizes.querySelectorAll(".size").forEach((s) => s.classList.remove("is-active"));
    size.classList.add("is-active");
  });

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
  document.querySelectorAll('a[aria-label="Личный кабинет"]').forEach((a) => {
    if (a.getAttribute("href") === "#" || !a.getAttribute("href")) a.setAttribute("href", "account.html");
  });
  document.querySelectorAll(".bottom-nav__item").forEach((a) => {
    if (a.textContent.trim() === "Профиль" && a.getAttribute("href") === "#") {
      a.setAttribute("href", "account.html");
    }
  });

  /* ---------- Вкладки входа / регистрации ---------- */
  const authTabs = document.getElementById("authTabs");
  authTabs?.addEventListener("click", (e) => {
    const tab = e.target.closest(".auth-tab");
    if (!tab) return;
    const id = tab.dataset.auth;
    authTabs.querySelectorAll(".auth-tab").forEach((t) => t.classList.remove("is-active"));
    document.querySelectorAll(".auth-form").forEach((f) => f.classList.remove("is-active"));
    tab.classList.add("is-active");
    document.querySelector(`.auth-form[data-auth-form="${id}"]`)?.classList.add("is-active");
  });

  /* ---------- Поиск (выпадающая строка) ---------- */
  const searchBtns = document.querySelectorAll('button[aria-label="Поиск"]');
  if (searchBtns.length) {
    const ov = document.createElement("div");
    ov.className = "search-overlay";
    ov.innerHTML =
      '<div class="container search-overlay__inner">' +
      '<svg class="icon search-overlay__icon" viewBox="0 0 24 24"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>' +
      '<input class="search-overlay__input" type="text" placeholder="Поиск по каталогу…" aria-label="Поиск по каталогу">' +
      '<button class="search-overlay__close" aria-label="Закрыть"><svg class="icon" viewBox="0 0 24 24"><path d="M18 6 6 18M6 6l12 12"/></svg></button>' +
      "</div>";
    document.body.appendChild(ov);
    const input = ov.querySelector(".search-overlay__input");
    const closeSearch = () => ov.classList.remove("is-open");
    const openSearch = () => {
      ov.classList.add("is-open");
      setTimeout(() => input.focus(), 150);
    };
    searchBtns.forEach((b) => b.addEventListener("click", openSearch));
    ov.querySelector(".search-overlay__close").addEventListener("click", closeSearch);
    input.addEventListener("keydown", (e) => {
      if (e.key === "Enter" && input.value.trim()) window.location.href = "search.html";
      if (e.key === "Escape") closeSearch();
    });
  }
});
