import {
  categoryTree,
  sectionIcons,
  authors,
  products,
  heroSlides,
  formatPrice,
  discountPercent,
  productUrl,
  isSubsectionCode,
  productsInSection,
  saleProducts,
  getProductBySlug,
  sectionProductCount,
  pluralProducts,
  sidebarNewsLinks,
  demoNews,
  GH_BASE,
} from "./data.mjs";

export function esc(s) {
  return String(s ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

export function iconSvg(code, className = "icon") {
  const path = sectionIcons[code] || sectionIcons.ikony;
  return `<svg class="${className}" viewBox="0 0 24 24"><path d="${path}"/></svg>`;
}

function productPlaceholder(section, size = "card") {
  const cls = size === "gallery" ? "icon gallery__placeholder-icon" : "icon card__placeholder-icon";
  return iconSvg(section, cls);
}

export function renderSidebarNews() {
  const links = sidebarNewsLinks
    .map((item) => `<a href="${item.href}" class="catmenu__sub-link">${esc(item.title)}</a>`)
    .join("");
  return `<div class="sidebar-news"><div class="sidebar-news__head">Новости</div><div class="catmenu__sub sidebar-news__links">${links}</div></div>`;
}

const cartSvg =
  '<svg class="icon" viewBox="0 0 24 24"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/></svg>';

export function navClass(active, key) {
  return active === key ? " is-active" : "";
}

export function renderTopbar() {
  return `<form class="topbar__search" action="search/" method="get" role="search">
  <div class="topbar__search-field">
    <svg class="icon topbar__search-icon" viewBox="0 0 24 24" aria-hidden="true"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
    <input class="topbar__search-input" type="search" name="q" id="topbarSearchInput" value="" placeholder="Поиск…" autocomplete="off" aria-label="Поиск по каталогу" maxlength="120">
  </div>
</form>`;
}

export function renderContacts() {
  return `<div class="topbar__contacts">
  <a href="tel:+74957400603" class="topbar__contact"><svg class="icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.9.34 1.85.57 2.81.7A2 2 0 0 1 22 16.92z"/></svg>+7 (495) 740-06-03</a>
  <a href="mailto:shop@rogozhskaya-lavka.ru" class="topbar__contact topbar__contact--email"><svg class="icon" viewBox="0 0 24 24" aria-hidden="true"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 7-10 6L2 7"/></svg>shop@rogozhskaya-lavka.ru</a>
  <span class="topbar__hours"><svg class="icon" viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></svg>Пн–Сб 10:00–19:00</span>
</div>`;
}

export function renderAuth() {
  return `<div class="topbar__auth">
  <a href="personal/private/" class="topbar__auth-link">Войти</a>
  <span class="topbar__auth-sep" aria-hidden="true">|</span>
  <a href="personal/private/#register" class="topbar__auth-link">Зарегистрироваться</a>
</div>`;
}

export function renderCartTopbar() {
  return `<a href="personal/cart/" class="icon-btn" aria-label="Корзина" id="topbarCartLink">${cartSvg}<span class="icon-btn__badge" id="topbarCartBadge" hidden>0</span></a>`;
}

export function renderCartBottom(activeCart) {
  return `<a href="personal/cart/" class="bottom-nav__item${activeCart ? " is-active" : ""}" id="bottomCartLink">
  <span class="icon-badge">${cartSvg}<span id="bottomCartBadge" hidden>0</span></span>Корзина</a>`;
}

export function renderHeader(navActive) {
  return `<header class="header">
  <div class="topbar">
    <div class="container topbar__inner">
      <div class="topbar__left">${renderTopbar()}</div>
      <div class="topbar__center">${renderContacts()}</div>
      <div class="topbar__right">${renderAuth()}${renderCartTopbar()}</div>
    </div>
  </div>
  <div class="logobar">
    <div class="container logobar__inner">
      <button class="logo__burger" id="burger" aria-label="Меню" type="button"><svg class="icon" viewBox="0 0 24 24" style="width:26px;height:26px"><path d="M3 6h18M3 12h18M3 18h18"/></svg></button>
      <a href="./" class="logo logo--mobile"><span class="logo__cross">☦</span><span class="logo__text">Рогожская Лавка</span></a>
    </div>
  </div>
  <nav class="nav">
    <div class="container nav__inner">
      <a href="./" class="logo logo--nav"><span class="logo__cross">☦</span><span class="logo__text">Рогожская Лавка</span></a>
      <ul class="nav__list">
        <li><a href="./" class="nav__link${navClass(navActive, "home")}">Главная</a></li>
        <li><a href="catalog/" class="nav__link${navClass(navActive, "catalog")}">Каталог</a></li>
        <li><a href="about/" class="nav__link${navClass(navActive, "about")}">О нас</a></li>
        <li><a href="sale/" class="nav__link${navClass(navActive, "sale")}">Скидки</a></li>
        <li><a href="about/delivery/" class="nav__link${navClass(navActive, "delivery")}">Доставка</a></li>
      </ul>
    </div>
  </nav>
</header>`;
}

export function renderSidebar(activeParent = "", activeSub = "", homeMode = false) {
  const accordion = homeMode ? " catmenu--accordion" : "";
  const sidebarClass = homeMode ? " sidebar sidebar--home-catalog" : " sidebar";
  let html = `<aside class="${sidebarClass}">`;
  html += renderSidebarNews();
  html += `<nav class="catmenu${accordion}">`;
  for (const [code, cat] of Object.entries(categoryTree)) {
    const subs = Object.entries(cat.children);
    const parentActive = activeParent === code;
    const expanded = homeMode && subs.length ? " is-expanded" : "";
    html += `<div class="catmenu__item${expanded}" data-cat="${code}">`;
    if (homeMode && subs.length) {
      html += `<button type="button" class="catmenu__head catmenu__head--toggle${parentActive && !activeSub ? " is-active" : ""}" data-cat="${code}" aria-expanded="true"><span class="catmenu__label">${esc(cat.name)}</span><svg class="icon catmenu__chevron" viewBox="0 0 24 24" aria-hidden="true"><path d="M6 9l6 6 6-6"/></svg></button>`;
    } else {
      html += `<a href="catalog/${code}/" class="catmenu__head${parentActive && !activeSub ? " is-active" : ""}" data-cat="${code}"><span class="catmenu__label">${esc(cat.name)}</span></a>`;
    }
    if (subs.length) {
      html += `<div class="catmenu__sub" id="catmenu-sub-${code}">`;
      subs.forEach(([subCode, subName], index) => {
        const extra = homeMode && index >= 4 ? " catmenu__sub-link--extra" : "";
        const subActive = activeSub === subCode ? " is-active" : "";
        html += `<a href="catalog/${code}/${subCode}/" class="catmenu__sub-link${extra}${subActive}" data-sub="${subCode}">${esc(subName)}</a>`;
      });
      if (homeMode && subs.length > 4) {
        html += `<button type="button" class="catmenu__all catmenu__all--toggle" aria-expanded="false">Показать всё</button>`;
      }
      html += `</div>`;
    }
    html += `</div>`;
  }
  html += `</nav>`;
  html += `<div class="sidebar__promo"><div class="sidebar__promo-title">Нужна помощь?</div><p>Поможем выбрать икону или книгу и оформить заказ — звоните в лавку.</p><a class="sidebar__promo-phone" href="tel:+74957400603">+7 (495) 740-06-03</a></div>`;
  html += `</aside>`;
  return html;
}

export function renderFooter() {
  return `<footer class="footer">
  <div class="container">
    <div class="footer__grid">
      <div class="footer__col"><div class="footer__logo">☦ Рогожская Лавка</div><p>Старообрядческий интернет-магазин. Иконы, книги, церковная утварь и всё необходимое для молитвы и православного дома.</p></div>
      <div class="footer__col"><h4>Каталог</h4><a href="catalog/ikony/">Иконы</a><a href="catalog/knigi/">Книги</a><a href="catalog/svechi/">Свечи и ладан</a><a href="catalog/kresty/">Нательные кресты</a></div>
      <div class="footer__col"><h4>Покупателям</h4><a href="about/delivery/">Доставка и оплата</a><a href="sale/">Скидки</a><a href="about/">О нас</a><a href="about/#contacts">Контакты</a></div>
      <div class="footer__col footer__contacts"><h4>Контакты</h4><a href="tel:+74957400603">+7 (495) 740-06-03</a><a href="mailto:shop@rogozhskaya-lavka.ru">shop@rogozhskaya-lavka.ru</a></div>
    </div>
  </div>
  <div class="footer__bottom">© ${new Date().getFullYear()} Рогожская Лавка. Все права защищены.</div>
</footer>`;
}

export function renderDrawer(navActive) {
  let catmenu = "";
  for (const [code, cat] of Object.entries(categoryTree)) {
    catmenu += `<div class="catmenu__item" data-cat="${code}"><a href="catalog/${code}/" class="catmenu__head" data-cat="${code}"><span class="catmenu__label">${esc(cat.name)}</span></a>`;
    const subs = Object.entries(cat.children);
    if (subs.length) {
      catmenu += `<div class="catmenu__sub">`;
      for (const [subCode, subName] of subs) {
        catmenu += `<a href="catalog/${code}/${subCode}/" class="catmenu__sub-link" data-sub="${subCode}">${esc(subName)}</a>`;
      }
      catmenu += `</div>`;
    }
    catmenu += `</div>`;
  }
  return `<div class="overlay" id="overlay"></div>
<aside class="drawer" id="drawer">
  <div class="drawer__head"><span class="drawer__logo">☦ Рогожская Лавка</span><button class="drawer__close" id="drawerClose" aria-label="Закрыть" type="button"><svg class="icon" viewBox="0 0 24 24"><path d="M18 6 6 18M6 6l12 12"/></svg></button></div>
  <nav class="drawer__nav">
    <a href="./">Главная</a><a href="catalog/">Каталог</a><a href="about/">О нас</a><a href="sale/">Скидки</a><a href="about/delivery/">Доставка</a>
  </nav>
  <nav class="catmenu" id="drawerCatalog">${renderSidebarNews()}${catmenu}</nav>
</aside>
<nav class="bottom-nav">
  <a href="./" class="bottom-nav__item${navClass(navActive, "home")}"><svg class="icon" viewBox="0 0 24 24"><path d="M3 11l9-8 9 8"/><path d="M5 10v10h14V10"/></svg>Главная</a>
  <a href="catalog/" class="bottom-nav__item${navClass(navActive, "catalog")}"><svg class="icon" viewBox="0 0 24 24"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/></svg>Каталог</a>
  <a href="favorites/" class="bottom-nav__item${navClass(navActive, "favorites")}"><svg class="icon" viewBox="0 0 24 24"><path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.6l-1-1a5.5 5.5 0 0 0-7.8 7.8l1 1L12 21l7.8-7.6 1-1a5.5 5.5 0 0 0 0-7.8z"/></svg>Избранное</a>
  ${renderCartBottom(navActive === "cart")}
  <a href="personal/" class="bottom-nav__item${navClass(navActive, "account")}"><svg class="icon" viewBox="0 0 24 24"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>Профиль</a>
</nav>`;
}

export function renderBreadcrumbs(items) {
  const backHref = items.length > 1 && items[items.length - 2].href ? items[items.length - 2].href : "./";
  const back = items.length > 1 ? `<a href="${backHref}" class="back-btn" aria-label="Назад"><svg class="icon" viewBox="0 0 24 24" style="width:20px;height:20px"><path d="M19 12H5M12 19l-7-7 7-7"/></svg></a>` : "";
  let links = items
    .map((item, i) => {
      if (i === items.length - 1) return `<span class="is-current">${esc(item.title)}</span>`;
      const href = item.href ?? null;
      return href ? `<a href="${href}">${esc(item.title)}</a>` : esc(item.title);
    })
    .join('<span class="breadcrumbs__sep">›</span>');
  return `<div class="breadcrumbs">${back}${links}</div>`;
}

export function renderCard(p) {
  const url = productUrl(p);
  const hasDiscount = p.oldPrice && p.oldPrice > p.price;
  const pct = hasDiscount ? discountPercent(p.price, p.oldPrice) : 0;
  let badge = "";
  if (hasDiscount) badge = `<span class="card__badge">−${pct}%</span>`;
  else if (p.promo) badge = `<span class="card__badge">Акция</span>`;

  let priceHtml = `<span class="card__price-current">${formatPrice(p.price)} <small>₽</small></span>`;
  if (hasDiscount) {
    priceHtml = `<span class="card__price-old">${formatPrice(p.oldPrice)} ₽</span>${priceHtml}`;
  }

  const btn =
    p.canBuy === false
      ? `<span class="btn btn--gold card__btn" style="opacity:.6">Нет в наличии</span>`
      : p.hasOffers
        ? `<a class="btn btn--gold card__btn" href="${url}">Выбрать</a>`
        : `<div class="js-cart-host card__cart-host" data-product-id="${p.id}" data-add-class="card__btn" data-in-cart-class="card__btn"></div>`;

  return `<article class="card">
  <div class="card__media">${badge}
    <a href="${url}">${productPlaceholder(p.section)}</a>
    <button class="card__fav" type="button" aria-label="В избранное" data-product-id="${p.id}"><svg class="icon" viewBox="0 0 24 24"><path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.6l-1-1a5.5 5.5 0 0 0-7.8 7.8l1 1L12 21l7.8-7.6 1-1a5.5 5.5 0 0 0 0-7.8z"/></svg></button>
  </div>
  <div class="card__body">
    <h3 class="card__title"><a href="${url}">${esc(p.name)}</a></h3>
    <div class="card__foot"><div class="card__price">${priceHtml}</div><div class="card__actions">${btn}</div></div>
  </div>
</article>`;
}

export function renderProductGrid(list) {
  if (!list.length) return `<p class="catalog-intro">В этом разделе пока нет товаров.</p>`;
  return `<div class="product-grid">${list.map((p) => renderCard(p)).join("")}</div>`;
}

export function renderHero() {
  const slides = heroSlides
    .map((s) => {
      const cls = ["hero-slider__slide", s.style === "news" ? "hero-slider__slide--news" : "", s.style === "sale" ? "hero-slider__slide--sale" : ""]
        .filter(Boolean)
        .join(" ");
      return `<a href="${s.href}" class="${cls}"><div class="hero-slider__content">${s.tag ? `<span class="hero-slider__tag">${esc(s.tag)}</span>` : ""}<h2 class="hero-slider__title">${esc(s.title)}</h2><p class="hero-slider__text">${esc(s.text)}</p><span class="hero-slider__cta">${esc(s.cta)}</span></div></a>`;
    })
    .join("");
  return `<section class="hero-slider" id="heroSlider" style="--hero-slides: ${heroSlides.length}">
  <div class="hero-slider__viewport"><div class="hero-slider__track">${slides}</div></div>
  <div class="hero-slider__controls">
    <button class="hero-slider__arrow hero-slider__arrow--prev" type="button" aria-label="Предыдущий слайд" disabled><svg class="icon" viewBox="0 0 24 24"><path d="M19 12H5M12 19l-7-7 7-7"/></svg></button>
    <div class="hero-slider__dots"></div>
    <button class="hero-slider__arrow hero-slider__arrow--next" type="button" aria-label="Следующий слайд"><svg class="icon" viewBox="0 0 24 24"><path d="M5 12h14M12 5l7 7-7 7"/></svg></button>
  </div>
</section>`;
}

export function renderCatalogSectionCards(parentCode = null) {
  const cardClass = parentCode ? "cat-cards" : "cat-cards cat-cards--catalog";

  if (!parentCode) {
    const cards = Object.entries(categoryTree)
      .map(([code, cat]) => {
        const count = sectionProductCount(code);
        return `<a class="cat-card" href="catalog/${code}/"><div class="cat-card__media">${iconSvg(code)}</div><div class="cat-card__body"><div class="cat-card__title">${esc(cat.name)}</div>${count ? `<div class="cat-card__count">${pluralProducts(count)}</div>` : ""}</div></a>`;
      })
      .join("");
    return `<div class="${cardClass}">${cards}</div>`;
  }

  const cat = categoryTree[parentCode];
  if (!cat) return "";
  const subs = Object.entries(cat.children || {});
  if (!subs.length) return renderProductGrid(productsInSection(parentCode));

  const cards = subs
    .map(([subCode, subName]) => {
      const count = sectionProductCount(parentCode, subCode);
      return `<a class="cat-card" href="catalog/${parentCode}/${subCode}/"><div class="cat-card__media">${iconSvg(parentCode)}</div><div class="cat-card__body"><div class="cat-card__title">${esc(subName)}</div>${count ? `<div class="cat-card__count">${pluralProducts(count)}</div>` : ""}</div></a>`;
    })
    .join("");
  return `<div class="${cardClass}">${cards}</div>`;
}

export function renderHomeCatalog() {
  let rows = "";
  for (const [code, cat] of Object.entries(categoryTree)) {
    const subs = Object.entries(cat.children);
    const cards = subs.length ? subs : [[code, cat.name]];
    let cardsHtml = "";
    cards.forEach(([subCode, subName], index) => {
      const count = sectionProductCount(code, subs.length ? subCode : undefined);
      const extra = index >= 4 ? " cat-card--extra" : "";
      cardsHtml += `<a class="cat-card cat-card--compact${extra}" href="catalog/${code}/${subs.length ? subCode : ""}/"><div class="cat-card__media">${iconSvg(code)}</div><div class="cat-card__body"><div class="cat-card__title">${esc(subName)}</div>${count ? `<div class="cat-card__count">${pluralProducts(count)}</div>` : ""}</div></a>`;
    });
    rows += `<section class="home-cat-row" data-cat="${code}" id="home-cat-${code}"><h3 class="home-cat-row__title"><a href="catalog/${code}/">${esc(cat.name)}</a></h3><div class="cat-cards cat-cards--home">${cardsHtml}</div></section>`;
  }
  return `<section class="section section--home-catalog"><div class="home-cat-panel is-overview" id="homeCatalogPanel"><div class="home-cat-rows">${rows}</div></div></section>`;
}

export function renderHomePromo() {
  return `<section class="section">
  <a class="promo-banner" href="sale/">
    <div class="promo-banner__text">
      <h3>Скидки до 30%</h3>
      <p>Сезонные предложения на иконы, книги и церковную утварь</p>
    </div>
    <span class="btn btn--gold btn--lg">Смотреть скидки</span>
  </a>
</section>`;
}

export function renderLoginPage() {
  return `<div class="auth-wrap">
  <div class="auth-card">
    <div class="auth-tabs" id="authTabs">
      <button type="button" class="auth-tab is-active" data-auth="login">Вход</button>
      <button type="button" class="auth-tab" data-auth="register">Регистрация</button>
    </div>
    <div class="auth-form is-active" data-auth-form="login">
      <h2 class="auth-form__title">С возвращением</h2>
      <p class="auth-form__hint">Войдите, чтобы видеть историю заказов и избранное.</p>
      <form class="js-demo-auth-form" action="#" method="post">
        <div class="field">
          <label class="field__label">E-mail или логин</label>
          <input class="input" type="text" name="login" autocomplete="username">
        </div>
        <div class="field">
          <label class="field__label">Пароль</label>
          <input class="input" type="password" name="password" autocomplete="current-password">
        </div>
        <label class="auth-check">
          <input type="checkbox" name="remember" value="Y">
          <span>Запомнить меня</span>
        </label>
        <button type="submit" class="btn btn--gold">Войти</button>
        <p class="auth-form__link"><a href="#forgot">Забыли пароль?</a></p>
      </form>
      <div class="auth-divider">или</div>
      <a href="catalog/" class="btn btn--outline">Продолжить как гость</a>
      <div class="auth-note">При оформлении заказа гостем личный кабинет создаётся автоматически — пароль придёт на указанную почту.</div>
    </div>
    <div class="auth-form" data-auth-form="register">
      <h2 class="auth-form__title">Создать аккаунт</h2>
      <p class="auth-form__hint">Регистрация займёт меньше минуты.</p>
      <form class="js-demo-auth-form" action="#" method="post" name="regform">
        <div class="field">
          <label class="field__label">Имя *</label>
          <input class="input" type="text" name="REGISTER[NAME]" autocomplete="given-name">
        </div>
        <div class="field">
          <label class="field__label">Фамилия</label>
          <input class="input" type="text" name="REGISTER[LAST_NAME]" autocomplete="family-name">
        </div>
        <div class="field">
          <label class="field__label">E-mail *</label>
          <input class="input" type="email" name="REGISTER[EMAIL]" autocomplete="email">
        </div>
        <div class="field">
          <label class="field__label">Телефон</label>
          <input class="input" type="text" name="REGISTER[PERSONAL_PHONE]" autocomplete="tel">
        </div>
        <div class="field">
          <label class="field__label">Пароль *</label>
          <input class="input" type="password" name="REGISTER[PASSWORD]" autocomplete="new-password">
        </div>
        <div class="field">
          <label class="field__label">Подтверждение пароля *</label>
          <input class="input" type="password" name="REGISTER[CONFIRM_PASSWORD]" autocomplete="new-password">
        </div>
        <button type="submit" class="btn btn--gold">Зарегистрироваться</button>
      </form>
      <div class="auth-note">Регистрируясь, вы соглашаетесь с условиями обработки персональных данных.</div>
    </div>
  </div>
</div>
<script src="assets/js/demo-auth-page.js"></script>`;
}

export function renderHomeAbout() {
  return `<section class="section">
  <div class="home-about">
    <div class="home-about__text">
      <h2>О лавке</h2>
      <p>Мы — старообрядческая лавка при духовном центре на Рогожском посёлке. Уже много лет помогаем верующим обрести намоленные образа, богослужебные книги и всё необходимое для домашней молитвы.</p>
      <p>Каждая икона написана в каноничной древлеправославной традиции, книги изданы по старопечатным образцам.</p>
      <a href="about/" class="btn btn--outline home-about__btn">Подробнее о нас</a>
    </div>
    <div class="home-about__art">☦</div>
  </div>
</section>`;
}

export function renderAuthorBlock(authorId) {
  const author = authors[authorId];
  if (!author) return "";
  return `<section class="product__author"><h3 class="product__author-title">Об авторе</h3><p class="product__author-name">${esc(author.name)}</p><div class="product__author-text">${author.about}</div></section>`;
}

export function renderAboutContent() {
  return `<div class="prose">
  <p>«Рогожская Лавка» — это старообрядческий магазин при Рогожском посёлке, духовном центре старообрядчества в Москве. Уже много лет мы помогаем православным христианам приобретать иконы, богослужебные книги, церковную утварь и всё необходимое для молитвы и благочестивой жизни дома.</p>
  <blockquote>Мы бережно храним традицию древлеправославного письма и каноны, передаваемые из поколения в поколение.</blockquote>
  <h2>Наши ценности</h2>
  <div class="info-cards">
    <div class="info-card"><div class="info-card__icon"><svg class="icon" viewBox="0 0 24 24"><path d="M12 3v18M7 8h10M9 13h6"/></svg></div><h3>Верность канону</h3><p>Иконы пишутся по правилам древнего письма, с использованием темперы и золочения.</p></div>
    <div class="info-card"><div class="info-card__icon"><svg class="icon" viewBox="0 0 24 24"><path d="M20 6 9 17l-5-5"/></svg></div><h3>Качество</h3><p>Каждое изделие проходит проверку. Книги — от проверенных издательств.</p></div>
    <div class="info-card"><div class="info-card__icon"><svg class="icon" viewBox="0 0 24 24"><path d="M21 10c0 7-9 12-9 12s-9-5-9-12a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg></div><h3>Из сердца традиции</h3><p>Лавка находится на Рогожском посёлке — историческом центре старообрядчества.</p></div>
  </div>
  <h2>В цифрах</h2>
  <div class="info-cards">
    <div class="info-card"><div class="info-card__big">15+</div><p>лет служения покупателям</p></div>
    <div class="info-card"><div class="info-card__big">2000+</div><p>наименований в каталоге</p></div>
    <div class="info-card"><div class="info-card__big">100%</div><p>аккуратная упаковка и доставка</p></div>
  </div>
  <h2 id="contacts">Как нас найти</h2>
  <p>Адрес лавки: Москва, Рогожский посёлок. Телефон: <a href="tel:+74957400603">+7 (495) 740-06-03</a>. Электронная почта: <a href="mailto:shop@rogozhskaya-lavka.ru">shop@rogozhskaya-lavka.ru</a>. Часы работы: Пн–Сб 10:00–19:00. Самовывоз из лавки — бесплатно.</p>
</div>`;
}

export function renderDeliveryContent() {
  return `<div class="prose">
  <h2>Способы доставки</h2>
  <table class="info-table">
    <thead><tr><th>Способ</th><th>Сроки</th><th>Стоимость</th></tr></thead>
    <tbody>
      <tr><td>Самовывоз из лавки (Рогожский посёлок)</td><td>в день заказа</td><td>бесплатно</td></tr>
      <tr><td>Курьер по Москве</td><td>1–2 дня</td><td>450 ₽</td></tr>
      <tr><td>Почта России</td><td>3–10 дней</td><td>от 350 ₽</td></tr>
      <tr><td>Транспортная компания (СДЭК)</td><td>2–7 дней</td><td>по тарифу</td></tr>
    </tbody>
  </table>
  <h2>Способы оплаты</h2>
  <div class="info-cards">
    <div class="info-card"><div class="info-card__icon"><svg class="icon" viewBox="0 0 24 24"><rect x="2" y="5" width="20" height="14" rx="2"/><path d="M2 10h20"/></svg></div><h3>Картой онлайн</h3><p>Visa, Mastercard, МИР. Безопасная оплата при оформлении заказа.</p></div>
    <div class="info-card"><div class="info-card__icon"><svg class="icon" viewBox="0 0 24 24"><path d="M3 6h18v12H3zM3 10h18"/></svg></div><h3>При получении</h3><p>Наличными или картой курьеру / в отделении почты.</p></div>
    <div class="info-card"><div class="info-card__icon"><svg class="icon" viewBox="0 0 24 24"><path d="M8 3h8v4a4 4 0 0 1-8 0zM12 11v7M8 21h8"/></svg></div><h3>В лавке</h3><p>Наличными или картой при самовывозе из лавки.</p></div>
  </div>
  <h2>Упаковка и возврат</h2>
  <p>Все иконы и хрупкие изделия упаковываются в защитный материал, чтобы доставить заказ в целости и сохранности. Возврат товара возможен в течение 14 дней при сохранении товарного вида согласно законодательству РФ.</p>
</div>`;
}

export function renderNewsSection(code) {
  const section = demoNews[code];
  if (!section) return "";
  const items = section.items
    .map(
      (item) =>
        `<article class="news-item"><time class="news-item__date" datetime="${esc(item.date)}">${esc(item.date)}</time><h2 class="news-item__title">${esc(item.title)}</h2><p class="news-item__text">${esc(item.text)}</p></article>`
    )
    .join("");
  return `<div class="news-list">${items}</div>`;
}

export function renderProductPage(p) {
  const hasDiscount = p.oldPrice && p.oldPrice > p.price;
  let priceHtml = `<span class="product__price-current">${formatPrice(p.price)} <small>₽</small></span>`;
  if (hasDiscount) priceHtml = `<span class="card__price-old">${formatPrice(p.oldPrice)} ₽</span>${priceHtml}`;

  let skuHtml = "";
  let catalogJsConfig = `{ product: { ID: ${p.id}, CAN_BUY: true, ADD_URL: "" } }`;
  if (p.hasOffers && p.offers?.length) {
    const sizes = p.offers
      .map((o, i) => `<button type="button" class="size${i === 0 ? " is-active" : ""}" data-treevalue="SIZE_${o.tree.PROP_SIZE}" data-onevalue="${o.tree.PROP_SIZE}">${esc(o.label)}</button>`)
      .join("");
    skuHtml = `<div class="option"><div class="option__label">Размер:</div><div class="option__values" data-sku-line="SIZE">${sizes}</div></div>`;
    const offersJs = p.offers.map((o) => ({
      ID: o.id,
      TREE: { PROP_SIZE: o.tree.PROP_SIZE },
      CAN_BUY: o.canBuy !== false,
      ADD_URL: "",
      PRICE_PRINT: formatPrice(o.price),
      OLD_PRICE_PRINT: o.oldPrice ? formatPrice(o.oldPrice) : "",
      PHOTOS: [],
    }));
    catalogJsConfig = `{ offerSelected: 0, offers: ${JSON.stringify(offersJs)}, product: null }`;
  }

  let specsHtml = "";
  if (p.specs && Object.keys(p.specs).length) {
    specsHtml = `<div class="tabs__panel" data-panel="specs"><p>${Object.entries(p.specs)
      .map(([k, v]) => `<strong>${esc(k)}:</strong> ${esc(v)}`)
      .join("<br>")}</p></div>`;
  }

  const authorHtml = p.section === "knigi" && p.authorId ? renderAuthorBlock(p.authorId) : "";
  const related = products.filter((x) => x.section === p.section && x.id !== p.id).slice(0, 4);
  const parentName = categoryTree[p.section]?.name || p.section;

  return `${renderBreadcrumbs(
    [
      { title: "Главная", href: "./" },
      { title: "Каталог", href: "catalog/" },
      { title: parentName, href: `catalog/${p.section}/` },
      { title: p.name },
    ]
  )}
<div class="product" id="productCatalogRoot">
  <div class="gallery"><div class="gallery__main" id="galleryMain">${productPlaceholder(p.section, "gallery")}</div></div>
  <div class="product__info">
    <p class="product__title">${esc(p.name)}</p>
    <div class="product__price-row">
      <div class="product__price" id="productPrice">${priceHtml}</div>
      <span class="badge badge--stock" id="productStock"><span class="badge__dot"></span>В наличии</span>
    </div>
    ${skuHtml}
    <div class="product__buy">
      <div class="product__actions">
        <div id="productCartHost" class="js-cart-host" data-product-id="${p.hasOffers ? p.offers[0].id : p.id}"></div>
        <button type="button" class="btn btn--outline product__fav" data-product-id="${p.id}" aria-pressed="false"><svg class="icon" viewBox="0 0 24 24" style="width:20px;height:20px"><path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.6l-1-1a5.5 5.5 0 0 0-7.8 7.8l1 1L12 21l7.8-7.6 1-1a5.5 5.5 0 0 0 0-7.8z"/></svg> В избранное</button>
      </div>
      <div class="delivery-note"><svg class="icon" viewBox="0 0 24 24"><rect x="1" y="3" width="15" height="13"/><path d="M16 8h4l3 3v5h-7zM5.5 18.5a2.5 2.5 0 1 0 0 .01M18.5 18.5a2.5 2.5 0 1 0 0 .01"/></svg><p>Доставка Почтой России от 350 ₽.<br>Самовывоз из лавки — бесплатно.</p></div>
    </div>
  </div>
</div>
<div class="tabs" id="tabs">
  <div class="tabs__nav">
    <button type="button" class="tabs__btn is-active" data-tab="desc">Описание</button>
    ${specsHtml ? '<button type="button" class="tabs__btn" data-tab="specs">Характеристики</button>' : ""}
    <button type="button" class="tabs__btn" data-tab="delivery">Доставка и оплата</button>
  </div>
  <div class="tabs__panel is-active" data-panel="desc"><p>${esc(p.description || "")}</p>${authorHtml}</div>
  ${specsHtml}
  <div class="tabs__panel" data-panel="delivery"><p>Доставка Почтой России по всей стране — от 350 ₽, сроки 3–10 дней. Курьерская доставка по Москве — 450 ₽. Самовывоз из лавки на Рогожском посёлке — бесплатно. Оплата: банковской картой онлайн, при получении, наличными в лавке.</p></div>
</div>
${related.length ? `<section class="section"><div class="section__head"><h2 class="section__title section__title--ornament">Вам также понравится</h2></div><div class="product-grid product-grid--4">${related.map((r) => renderCard(r)).join("")}</div></section>` : ""}
<div class="buybar"><div class="buybar__price">${formatPrice(p.price)} ₽</div><div id="buybarCartHost" class="js-cart-host" data-product-id="${p.hasOffers ? p.offers[0].id : p.id}"></div></div>
<script>document.addEventListener("DOMContentLoaded",function(){if(window.RogoCatalog&&document.getElementById("productCatalogRoot")){window.RogoCatalog.initProduct(document.getElementById("productCatalogRoot"),${catalogJsConfig});}});</script>`;
}

export function pageLayout({
  title,
  description,
  bodyClass,
  navActive,
  useSidebar,
  sidebarParent,
  sidebarSub,
  homeSidebar,
  main,
  depth,
  withCatalogJs,
}) {
  const scripts = `<script src="assets/js/demo-mode.js"></script>
<script src="assets/js/main.js"></script>
<script src="assets/js/favorites.js"></script>
${withCatalogJs ? `<script src="assets/js/catalog.js"></script>` : ""}`;

  const baseScript = `<script>(function(){var p=location.pathname,b=(p.indexOf("/lavka/")===0||p==="/lavka"||p==="/lavka/")?"/lavka/":"/";document.write('<base href="'+b+'">');})();</script>`;

  return `<!DOCTYPE html>
<html lang="ru">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  ${baseScript}
  <title>${esc(title)}</title>
  <meta name="description" content="${esc(description || title)}">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@500;600;700&family=PT+Serif:wght@400;700&family=PT+Sans:wght@400;700&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="assets/css/reset.css">
  <link rel="stylesheet" href="assets/css/style.css">
</head>
<body class="${bodyClass}" data-personal-url="personal/" data-search-url="search/" data-search-suggest-url="assets/data/search-suggest.json">
${renderHeader(navActive)}
<div class="layout">
  <div class="container${useSidebar ? " layout__grid" : ""}">
    ${useSidebar ? renderSidebar(sidebarParent, sidebarSub, homeSidebar) : ""}
    <main>${main}</main>
  </div>
</div>
${renderFooter()}
${renderDrawer(navActive)}
${scripts}
</body>
</html>`;
}

export {
  categoryTree,
  products,
  saleProducts,
  productsInSection,
  getProductBySlug,
  isSubsectionCode,
  productUrl,
  formatPrice,
};
