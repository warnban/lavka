# Рогожская Лавка — демо-макет

Статический HTML-прототип интернет-магазина. Визуально и по структуре соответствует рабочему сайту на Bitrix (`shop.local`), но работает на **GitHub Pages** без сервера.

## Что работает в демо

- Каталог с 8 разделами и демо-товарами в каждой категории
- Страница **Скидки** с зачёркнутыми ценами
- Карточки товаров в актуальной вёрстке (`card__foot`, кнопка «В корзину»)
- Корзина и избранное через `localStorage` (без Bitrix)
- Блок **«Об авторе»** у книг с автором
- Поиск по демо-каталогу

## Сборка страниц

HTML генерируется из данных и шаблонов:

```bash
node tools/build.mjs
```

После изменения `tools/data.mjs` или шаблонов в `tools/render.mjs` перезапустите сборку.

## GitHub Pages

1. Settings → Pages → Deploy from branch → `main` / root  
2. Сайт: `https://warnban.github.io/newlavka/` (или `https://warnban.github.io/lavka/`)

`<base href>` определяется автоматически по пути GitHub Pages (`/newlavka/`, `/lavka/` и т.д.).

Для сборки под фиксированный префикс: `SITE_BASE=/newlavka/ node tools/build.mjs`

## Структура URL (как на Bitrix)

| Страница | Путь |
|----------|------|
| Главная | `/lavka/` |
| Каталог | `/lavka/catalog/` |
| Раздел | `/lavka/catalog/ikony/` |
| Подраздел | `/lavka/catalog/knigi/psaltiri/` |
| Товар | `/lavka/catalog/ikony/gospod-vsederzhitel/` |
| Скидки | `/lavka/sale/` |
| Избранное | `/lavka/favorites/` |

## Файлы

| Путь | Назначение |
|------|------------|
| `tools/data.mjs` | Демо-товары, категории, слайды |
| `tools/render.mjs` | HTML-шаблоны |
| `tools/build.mjs` | Генератор страниц |
| `assets/js/demo-mode.js` | Корзина/избранное/поиск без Bitrix |
| `assets/css/style.css` | Общие стили (синхрон с шаблоном Bitrix) |
