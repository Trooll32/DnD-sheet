# Что вставить в репозиторий

Добавь файлы:

- `src/builder/builderState.js`
- `src/builder/builderActions.js`
- `src/builder/builderValidators.js`
- `src/builder/finalizeCharacter.js`
- `src/ui/builderView.js`
- `src/ui/builderApp.js`
- `src/ui/builder.css`

## Как подключить

Тебе нужен HTML entrypoint, например `builder.html`:

```html
<!doctype html>
<html lang="ru">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>DnD Builder</title>
  <link rel="stylesheet" href="./src/ui/builder.css" />
</head>
<body>
  <div id="builder-root"></div>
  <script type="module">
    import { mountBuilderApp } from './src/ui/builderApp.js';
    mountBuilderApp(document.getElementById('builder-root'));
  </script>
</body>
</html>
```

## Что уже совместимо с твоим engine

- Используется `createEmptyState()` из `src/engine/state.js`
- Используется `recalculate()` из `src/engine/derived.js`
- Используется `CLASSES` из `src/engine/compendium.js`
- Для preview и финального объекта используется твоя реальная форма state/derived

## Ограничения текущего engine

Сейчас в твоём `compendium.js` нет массива species/backgrounds, поэтому builder заполняет их как текстовые поля.

## Что делает кнопка финала

На последнем шаге builder делает:

1. `finalizeBuilderDraft(draft)`
2. `initStore(finalState)`
3. `importCharacter(JSON.stringify(finalState))`

То есть он реально кладёт собранного персонажа в твой store.
