import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import {
  pageLayout,
  renderHero,
  renderHomeCatalog,
  renderHomePromo,
  renderHomeAbout,
  renderBreadcrumbs,
  renderProductGrid,
  renderProductPage,
  renderCard,
  renderAboutContent,
  renderDeliveryContent,
  renderNewsSection,
  renderCatalogSectionCards,
  renderLoginPage,
  categoryTree,
  products,
  saleProducts,
  productsInSection,
  getProductBySlug,
  isSubsectionCode,
  esc,
} from "./render.mjs";
import { productUrl, formatPrice, demoNews } from "./data.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");

function writePage(relPath, html) {
  const full = path.join(root, relPath);
  fs.mkdirSync(path.dirname(full), { recursive: true });
  fs.writeFileSync(full, html, "utf8");
  console.log(" wrote", relPath);
}

function depthFromPath(relPath) {
  const dir = path.dirname(relPath);
  if (dir === ".") return 0;
  return dir.split(/[/\\]/).filter(Boolean).length;
}

// --- index ---
writePage(
  "index.html",
  pageLayout({
    title: "Рогожская Лавка — старообрядческий интернет-магазин",
    description: "Иконы, богослужебные книги, церковная утварь и всё для молитвы.",
    bodyClass: "page-home",
    navActive: "home",
    useSidebar: true,
    homeSidebar: true,
    depth: 0,
    withCatalogJs: true,
    main: `${renderHero()}${renderHomeCatalog()}${renderHomePromo()}${renderHomeAbout()}`,
  })
);

// --- catalog root ---
writePage(
  "catalog/index.html",
  pageLayout({
    title: "Каталог — Рогожская Лавка",
    bodyClass: "page-catalog",
    navActive: "catalog",
    useSidebar: true,
    depth: 1,
    withCatalogJs: true,
    main: `${renderBreadcrumbs([{ title: "Главная", href: "./" }, { title: "Каталог" }])}
${renderCatalogSectionCards()}`,
  })
);

// --- category & product pages ---
for (const [parentCode, cat] of Object.entries(categoryTree)) {
  const parentDepth = 2;
  writePage(
    `catalog/${parentCode}/index.html`,
    pageLayout({
      title: `${cat.name} — Рогожская Лавка`,
      bodyClass: "page-catalog",
      navActive: "catalog",
      useSidebar: true,
      sidebarParent: parentCode,
      depth: parentDepth,
      withCatalogJs: true,
      main: `${renderBreadcrumbs([{ title: "Главная", href: "./" }, { title: "Каталог", href: "catalog/" }, { title: cat.name }])}
${renderCatalogSectionCards(parentCode)}`,
    })
  );

  for (const [subCode, subName] of Object.entries(cat.children)) {
    writePage(
      `catalog/${parentCode}/${subCode}/index.html`,
      pageLayout({
        title: `${subName} — ${cat.name}`,
        bodyClass: "page-catalog",
        navActive: "catalog",
        useSidebar: true,
        sidebarParent: parentCode,
        sidebarSub: subCode,
        depth: 3,
        withCatalogJs: true,
        main: `${renderBreadcrumbs([
          { title: "Главная", href: "./" },
          { title: "Каталог", href: "catalog/" },
          { title: cat.name, href: `catalog/${parentCode}/` },
          { title: subName },
        ])}
${renderProductGrid(productsInSection(parentCode, subCode))}`,
      })
    );
  }

  for (const p of productsInSection(parentCode)) {
    if (isSubsectionCode(parentCode, p.slug)) continue;
    writePage(
      `catalog/${parentCode}/${p.slug}/index.html`,
      pageLayout({
        title: `${p.name} — Рогожская Лавка`,
        bodyClass: "page-product",
        navActive: "catalog",
        useSidebar: true,
        sidebarParent: parentCode,
        sidebarSub: p.subsection || "",
        depth: 3,
        withCatalogJs: true,
        main: renderProductPage(p),
      })
    );
  }
}

// --- sale ---
writePage(
  "sale/index.html",
  pageLayout({
    title: "Скидки — Рогожская Лавка",
    bodyClass: "page-sale",
    navActive: "sale",
    useSidebar: true,
    depth: 1,
    withCatalogJs: true,
    main: `${renderBreadcrumbs([{ title: "Главная", href: "./" }, { title: "Скидки" }])}
${renderProductGrid(saleProducts())}`,
  })
);

// --- favorites ---
writePage(
  "favorites/index.html",
  pageLayout({
    title: "Избранное — Рогожская Лавка",
    bodyClass: "page-favorites",
    navActive: "favorites",
    useSidebar: false,
    depth: 1,
    withCatalogJs: true,
    main: `${renderBreadcrumbs([{ title: "Главная", href: "./" }, { title: "Избранное" }])}
<p class="catalog-intro">Товары, которые вы сохранили — нажмите на сердечко в каталоге, чтобы добавить или убрать.</p>
<div id="favoritesGrid" class="product-grid" data-empty-html="<div class=&quot;account-empty&quot;><p>В избранном пока пусто.</p><a href=&quot;catalog/&quot; class=&quot;btn btn--gold&quot;>Перейти в каталог</a></div>"></div>
<script src="assets/js/demo-favorites-page.js"></script>`,
  })
);

// --- news ---
for (const [code, section] of Object.entries(demoNews)) {
  writePage(
    `news/${code}/index.html`,
    pageLayout({
      title: `${section.title} — Рогожская Лавка`,
      bodyClass: "page-news",
      navActive: "",
      useSidebar: true,
      depth: 2,
      main: `${renderBreadcrumbs([{ title: "Главная", href: "./" }, { title: section.title }])}
${renderNewsSection(code)}`,
    })
  );
}

// --- about / delivery / search / personal ---
writePage(
  "about/index.html",
  pageLayout({
    title: "О нас — Рогожская Лавка",
    bodyClass: "page-about",
    navActive: "about",
    useSidebar: true,
    depth: 1,
    main: `${renderBreadcrumbs([{ title: "Главная", href: "./" }, { title: "О нас" }])}
${renderAboutContent()}`,
  })
);

writePage(
  "about/delivery/index.html",
  pageLayout({
    title: "Доставка и оплата — Рогожская Лавка",
    bodyClass: "page-delivery",
    navActive: "delivery",
    useSidebar: true,
    depth: 2,
    main: `${renderBreadcrumbs([{ title: "Главная", href: "./" }, { title: "Доставка и оплата" }])}
${renderDeliveryContent()}`,
  })
);

writePage(
  "search/index.html",
  pageLayout({
    title: "Поиск — Рогожская Лавка",
    bodyClass: "page-search",
    navActive: "catalog",
    useSidebar: false,
    depth: 1,
    withCatalogJs: true,
    main: `${renderBreadcrumbs([{ title: "Главная", href: "./" }, { title: "Поиск" }])}
<form class="search-form" action="./" method="get" role="search"><input type="search" name="q" id="searchPageInput" class="search-form__input" placeholder="Введите запрос…" autocomplete="off"><button type="submit" class="btn btn--gold">Найти</button></form>
<div id="searchResults" class="product-grid" style="margin-top:24px"></div>
<script src="assets/js/demo-search-page.js"></script>`,
  })
);

writePage(
  "personal/cart/index.html",
  pageLayout({
    title: "Корзина — Рогожская Лавка",
    bodyClass: "page-cart",
    navActive: "cart",
    useSidebar: false,
    depth: 2,
    withCatalogJs: true,
    main: `${renderBreadcrumbs([{ title: "Главная", href: "./" }, { title: "Корзина" }])}
<div id="demoCartPage"></div>
<script src="assets/js/demo-cart-page.js"></script>`,
  })
);

writePage(
  "personal/private/index.html",
  pageLayout({
    title: "Вход — Рогожская Лавка",
    bodyClass: "page-login",
    navActive: "account",
    useSidebar: false,
    depth: 2,
    main: `${renderBreadcrumbs([{ title: "Главная", href: "./" }, { title: "Вход" }])}
${renderLoginPage()}`,
  })
);

writePage(
  "personal/index.html",
  pageLayout({
    title: "Личный кабинет — Рогожская Лавка",
    bodyClass: "page-account",
    navActive: "account",
    useSidebar: false,
    depth: 1,
    main: `${renderBreadcrumbs([{ title: "Главная", href: "./" }, { title: "Личный кабинет" }])}
<p>Перейдите в <a href="personal/cart/">корзину</a> или <a href="favorites/">избранное</a>.</p>`,
  })
);

writePage(
  "404.html",
  pageLayout({
    title: "Страница не найдена",
    bodyClass: "page-404",
    navActive: "",
    useSidebar: false,
    depth: 0,
    main: `<div class="status"><h1 class="status__title">Страница не найдена</h1><p class="status__text">К сожалению, запрошенная страница не существует. Вернитесь на главную или загляните в каталог.</p><div class="status__actions"><a href="./" class="btn btn--gold">На главную</a><a href="catalog/" class="btn btn--outline">В каталог</a></div></div>`,
  })
);

// --- catalog.json for search / demo ---
const catalogExport = {
  products: products.map((p) => ({
    id: p.id,
    name: p.name,
    url: productUrl(p),
    price: p.price,
    pricePrint: formatPrice(p.price),
  })),
};
fs.writeFileSync(path.join(root, "assets/data/catalog.json"), JSON.stringify(catalogExport, null, 2), "utf8");
console.log(" wrote assets/data/catalog.json");

// Remove obsolete flat pages
for (const obsolete of ["category.html", "product.html", "catalog.html", "sale.html", "about.html", "delivery.html", "cart.html", "login.html", "account.html", "search.html", "thank-you.html"]) {
  const p = path.join(root, obsolete);
  if (fs.existsSync(p)) {
    fs.unlinkSync(p);
    console.log(" removed", obsolete);
  }
}

console.log("\nDone. Open index.html or deploy to GitHub Pages with base /lavka/");
