/** @typedef {{ id: number, slug: string, name: string, section: string, subsection?: string, price: number, oldPrice?: number, sale?: boolean, promo?: boolean, canBuy?: boolean, hasOffers?: boolean, symbol?: string, description?: string, specs?: Record<string,string>, authorId?: string, offers?: Array<{ id: number, tree: Record<string,string>, label: string, price: number, oldPrice?: number, canBuy?: boolean }> }} Product */

export const GH_BASE = process.env.SITE_BASE ?? "/lavka/";

export const categoryTree = {
  ikony: {
    name: "Иконы",
    sort: 100,
    children: {
      spasitel: "Образ Спасителя",
      bogorodichnye: "Богородичные",
      prazdnichnye: "Праздничные",
      svyatye: "Святые",
      skladni: "Складни",
    },
  },
  knigi: {
    name: "Книги",
    sort: 200,
    children: {
      bogosluzhebnye: "Богослужебные книги",
      psaltiri: "Псалтири и молитвословы",
      istoriya: "История старообрядчества",
    },
  },
  odezhda: {
    name: "Одежда",
    sort: 300,
    children: {
      kosovorotki: "Косоворотки",
      platki: "Платки",
    },
  },
  domashnyaya: {
    name: "Домашняя утварь",
    sort: 400,
    children: {
      lampady: "Лампады",
      podsvechniki: "Подсвечники",
      kioty: "Киоты",
    },
  },
  svechi: {
    name: "Свечи и ладан",
    sort: 500,
    children: {
      voskovye: "Свечи восковые",
      ladan: "Ладан",
    },
  },
  lestovki: {
    name: "Лестовки",
    sort: 600,
    children: {
      kozhanye: "Кожаные",
      bisernye: "Бисерные",
    },
  },
  kresty: {
    name: "Нательные кресты",
    sort: 700,
    children: {
      serebryanye: "Серебряные",
      derevyannye: "Деревянные",
    },
  },
  utvar: {
    name: "Богослужебная утварь",
    sort: 800,
    children: {
      kadila: "Кадила",
      oblacheniya: "Облачения",
    },
  },
};

export const sidebarNewsLinks = [
  { title: "Новые поступления", href: "news/novye-postupleniya/" },
  { title: "События", href: "news/sobytiya/" },
  { title: "Анонсы", href: "news/anonsy/" },
];

export const demoNews = {
  "novye-postupleniya": {
    title: "Новые поступления",
    items: [
      {
        date: "15.06.2026",
        title: "Поступили иконы «Казанская» и «Николай Чудотворец»",
        text: "В лавку привезли новые образа в каноничной древлеправославной традиции — темпера, золочение, аккуратная упаковка для отправки.",
      },
      {
        date: "02.06.2026",
        title: "Новый тираж Псалтири толковой",
        text: "Поступил тираж богослужебной книги с толкованиями святых отцов — твёрдый переплёт, крупный шрифт.",
      },
    ],
  },
  sobytiya: {
    title: "События",
    items: [
      {
        date: "20.05.2026",
        title: "Лавка на Рогожском посёлке — режим работы в праздники",
        text: "В период больших церковных праздников лавка работает по расширенному графику. Уточняйте по телефону +7 (495) 740-06-03.",
      },
    ],
  },
  anonsy: {
    title: "Анонсы",
    items: [
      {
        date: "01.07.2026",
        title: "Летняя распродажа церковной утвари",
        text: "С 1 июля скидки до 30% на подсвечники, лампады и ладан. Подробности — на странице «Скидки».",
      },
    ],
  },
};

export const sectionIcons = {
  ikony: "M12 3v18M7 8h10M9 13h6",
  knigi: "M4 5a2 2 0 0 1 2-2h13v18H6a2 2 0 0 1-2-2zM9 3v18",
  odezhda: "M16 4 12 7 8 4 3 7l3 3v10h12V10l3-3z",
  domashnyaya: "M8 3h8l-1 5a4 4 0 0 1 0 8l1 5H8l1-5a4 4 0 0 1 0-8z",
  svechi: "M12 2c1.5 2 3 3.5 3 6a3 3 0 0 1-6 0c0-2.5 1.5-4 3-6zM9 13h6v8H9z",
  lestovki: "M12 12m-8 0a8 8 0 1 0 16 0a8 8 0 1 0 -16 0M12 12m-3 0a3 3 0 1 0 6 0a3 3 0 1 0 -6 0",
  kresty: "M12 2v20M7 7h10M9 12h6",
  utvar: "M8 3h8v4a4 4 0 0 1-8 0zM12 11v7M8 21h8",
};

export const authors = {
  "demo-author": {
    name: "Пример автора",
    about:
      "<p>Пример биографии автора для демо-макета. В рабочем магазине текст редактируется в админке Bitrix в справочнике «Авторы книг».</p>",
  },
};

/** @type {Product[]} */
export const products = [
  {
    id: 101,
    slug: "gospod-vsederzhitel",
    name: "Икона «Господь Вседержитель»",
    section: "ikony",
    subsection: "spasitel",
    price: 12800,
    description:
      "Икона «Господь Вседержитель» — центральный образ в православной традиции. Написана в соответствии с каноном древнего письма, с использованием темперных красок и золочения.",
    specs: {
      "Размер": "22×17 см",
      "Техника": "темпера, золочение",
      "Материал основы": "липа, левкас",
    },
  },
  {
    id: 102,
    slug: "kazanskaya-bogoroditsa",
    name: "Икона «Казанская Божия Матерь»",
    section: "ikony",
    subsection: "bogorodichnye",
    price: 9800,
    oldPrice: 11500,
    sale: true,
    promo: true,
    symbol: "☦",
    description: "Чудотворный образ Божией Матери, почитаемый в православном мире.",
    specs: { Размер: "21×18 см", Техника: "темпера" },
  },
  {
    id: 103,
    slug: "nikolay-chudotvorets",
    name: "Икона «Николай Чудотворец»",
    section: "ikony",
    subsection: "svyatye",
    price: 8500,
    symbol: "☦",
    description: "Образ святителя Николая — заступника путешественников и всех нуждающихся.",
    specs: { Размер: "18×14 см" },
  },
  {
    id: 104,
    slug: "skladen-troitsa",
    name: "Складень «Святая Троица»",
    section: "ikony",
    subsection: "skladni",
    price: 24500,
    oldPrice: 27200,
    sale: true,
    symbol: "☦",
    description: "Трёхстворчатый складень для домашней молитвы и паломничества.",
    specs: { Размер: "15×10 см (в сложенном виде)" },
  },
  {
    id: 201,
    slug: "psaltir-tolkovy",
    name: "Псалтирь толковый",
    section: "knigi",
    subsection: "psaltiri",
    price: 1890,
    oldPrice: 2100,
    sale: true,
    authorId: "demo-author",
    symbol: "📖",
    description: "Псалтирь с толкованиями святых отцов. Твёрдый переплёт, крупный шрифт.",
    specs: { Переплёт: "твёрдый", Язык: "церковнославянский", Страниц: "640" },
  },
  {
    id: 202,
    slug: "molitvoslov-domashniy",
    name: "Молитвослов домашний",
    section: "knigi",
    subsection: "psaltiri",
    price: 810,
    oldPrice: 950,
    sale: true,
    symbol: "📖",
    description: "Сборник утренних и вечерних молитв для домашнего правила.",
    specs: { Переплёт: "мягкий", Язык: "русский" },
  },
  {
    id: 203,
    slug: "liturgikon",
    name: "Литургикон",
    section: "knigi",
    subsection: "bogosluzhebnye",
    price: 4200,
    symbol: "📖",
    description: "Богослужебная книга для совершения Божественной литургии.",
    specs: { Переплёт: "кожаный", Язык: "церковнославянский" },
  },
  {
    id: 204,
    slug: "istoriya-staroobryadstva",
    name: "История старообрядчества",
    section: "knigi",
    subsection: "istoriya",
    price: 1350,
    authorId: "demo-author",
    symbol: "📖",
    description: "Введение в историю и традицию древлеправославной Церкви.",
    specs: { Переплёт: "твёрдый", Страниц: "384" },
  },
  {
    id: 301,
    slug: "kosovorotka-lnyanaya",
    name: "Косоворотка льняная",
    section: "odezhda",
    subsection: "kosovorotki",
    price: 4900,
    symbol: "👕",
    description: "Традиционная косоворотка из натурального льна.",
    specs: { Материал: "лён 100%", Пол: "мужская" },
  },
  {
    id: 302,
    slug: "platok-prazdnichnyy",
    name: "Платок праздничный",
    section: "odezhda",
    subsection: "platki",
    price: 2100,
    symbol: "🧣",
    description: "Шёлковый платок с орнаментом для храмового посещения.",
    specs: { Материал: "шёлк" },
  },
  {
    id: 303,
    slug: "tufli-ultra-layn",
    name: "Туфли Ультра Лайн",
    section: "odezhda",
    subsection: "kosovorotki",
    price: 2799,
    oldPrice: 3110,
    sale: true,
    hasOffers: true,
    symbol: "👞",
    description: "Демо-товар с выбором размера (торговые предложения).",
    specs: { "Материал верха": "кожа", Сезон: "лето" },
    offers: [
      { id: 3031, tree: { PROP_SIZE: "38" }, label: "38", price: 2799, oldPrice: 3110, canBuy: true },
      { id: 3032, tree: { PROP_SIZE: "39" }, label: "39", price: 2799, oldPrice: 3110, canBuy: true },
      { id: 3033, tree: { PROP_SIZE: "40" }, label: "40", price: 2799, oldPrice: 3110, canBuy: false },
    ],
  },
  {
    id: 401,
    slug: "lampada-mednaya",
    name: "Лампада медная",
    section: "domashnyaya",
    subsection: "lampady",
    price: 3200,
    symbol: "🕯",
    description: "Лампада для домашнего иконостаса.",
    specs: { Материал: "латунь", Высота: "18 см" },
  },
  {
    id: 402,
    slug: "podsvechnik-derevyannyy",
    name: "Подсвечник деревянный",
    section: "domashnyaya",
    subsection: "podsvechniki",
    price: 980,
    oldPrice: 1200,
    sale: true,
    symbol: "🕯",
    description: "Резной подсвечник из берёзы.",
    specs: { Материал: "дерево" },
  },
  {
    id: 501,
    slug: "svechi-voskovye-nabor",
    name: "Свечи восковые (набор 10 шт.)",
    section: "svechi",
    subsection: "voskovye",
    price: 450,
    symbol: "🕯",
    description: "Набор церковных восковых свечей.",
    specs: { Количество: "10 шт." },
  },
  {
    id: 502,
    slug: "ladan-hramovoy",
    name: "Ладан храмовой",
    section: "svechi",
    subsection: "ladan",
    price: 620,
    oldPrice: 780,
    sale: true,
    symbol: "🌿",
    description: "Натуральный ладан для домашнего кадения.",
    specs: { Вес: "100 г" },
  },
  {
    id: 601,
    slug: "lestovka-kozhanaya",
    name: "Лестовка кожаная",
    section: "lestovki",
    subsection: "kozhanye",
    price: 890,
    symbol: "📿",
    description: "Лестовка из кожи — традиционное молитвенное правило.",
    specs: { Материал: "кожа" },
  },
  {
    id: 602,
    slug: "lestovka-bisernaya",
    name: "Лестовка бисерная",
    section: "lestovki",
    subsection: "bisernye",
    price: 1150,
    oldPrice: 1280,
    sale: true,
    symbol: "📿",
    description: "Лестовка ручной работы с бисерными счётами.",
    specs: { Материал: "бисер, текстиль" },
  },
  {
    id: 701,
    slug: "krest-serebryanyy",
    name: "Крест серебряный",
    section: "kresty",
    subsection: "serebryanye",
    price: 5600,
    symbol: "✝",
    description: "Нательный крест из серебра 925 пробы.",
    specs: { Материал: "серебро 925" },
  },
  {
    id: 702,
    slug: "krest-derevyannyy",
    name: "Крест деревянный",
    section: "kresty",
    subsection: "derevyannye",
    price: 420,
    oldPrice: 520,
    sale: true,
    symbol: "✝",
    description: "Простой деревянный крест на шнурке.",
    specs: { Материал: "дерево" },
  },
  {
    id: 801,
    slug: "kadilo-mednoe",
    name: "Кадило медное",
    section: "utvar",
    subsection: "kadila",
    price: 8900,
    symbol: "⚱",
    description: "Кадило для храмового и домашнего использования.",
    specs: { Материал: "латунь" },
  },
  {
    id: 802,
    slug: "stihar-monashskiy",
    name: "Стихарь монашеский",
    section: "utvar",
    subsection: "oblacheniya",
    price: 12400,
    oldPrice: 14500,
    sale: true,
    symbol: "👘",
    description: "Стихарь для клироса и богослужения.",
    specs: { Материал: "полиэстер, хлопок" },
  },
];

export const heroSlides = [
  {
    tag: "Новинки",
    title: "Новые поступления в лавке",
    text: "Свежие иконы, богослужебные книги и церковная утварь — загляните в каталог.",
    cta: "Смотреть новинки",
    href: "catalog/",
    style: "news",
  },
  {
    tag: "Скидки",
    title: "Скидки до 30%",
    text: "Сезонные предложения на иконы, книги и церковную утварь.",
    cta: "На страницу скидок",
    href: "sale/",
    style: "sale",
  },
  {
    tag: "Книги",
    title: "Богослужебные книги",
    text: "Псалтири, молитвословы и литургиконы — по старопечатным образцам.",
    cta: "В каталог книг",
    href: "catalog/knigi/",
    style: "default",
  },
  {
    tag: "Лавка",
    title: "Рогожская Лавка",
    text: "Иконы, книги, церковная утварь и всё для молитвы — с заботой о традиции.",
    cta: "О нас",
    href: "about/",
    style: "default",
  },
];

export function formatPrice(n) {
  return String(n).replace(/\B(?=(\d{3})+(?!\d))/g, " ");
}

export function discountPercent(price, oldPrice) {
  if (!oldPrice || oldPrice <= price) return 0;
  return Math.round((1 - price / oldPrice) * 100);
}

export function productUrl(p) {
  return `catalog/${p.section}/${p.slug}/`;
}

export function isSubsectionCode(parent, code) {
  return Boolean(categoryTree[parent]?.children?.[code]);
}

export function productsInSection(parent, sub) {
  return products.filter((p) => {
    if (p.section !== parent) return false;
    if (sub) return p.subsection === sub;
    return true;
  });
}

export function saleProducts() {
  return products.filter((p) => p.sale && p.oldPrice);
}

export function getProductBySlug(parent, slug) {
  return products.find((p) => p.section === parent && p.slug === slug);
}

export function sectionProductCount(parent, sub) {
  return productsInSection(parent, sub).length;
}

export function pluralProducts(count) {
  const mod10 = count % 10;
  const mod100 = count % 100;
  if (mod10 === 1 && mod100 !== 11) return `${count} товар`;
  if (mod10 >= 2 && mod10 <= 4 && (mod100 < 12 || mod100 > 14)) return `${count} товара`;
  return `${count} товаров`;
}
