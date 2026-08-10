# WanderVoice

Клиентская библиотека для воспроизведения голосовых сообщений из ссылок WanderVoice в браузере. Поддерживает **любые языки** (мультиязычность) через `SpeechSynthesis` API.

## Установка

```bash
npm install wandervoice
```

## Использование

```javascript
import { playVoiceFromLink, decodeWanderLink, getTextFromLink } from 'wandervoice';

// Ссылка из WanderVoice
const link = 'https://vk.com/app54714168#data=...';

// Воспроизвести голос (настройки по умолчанию, русский)
playVoiceFromLink(link);

// Воспроизвести с другими настройками
playVoiceFromLink(link, { rate: 1.2, pitch: 0.8, gender: 'female' });

// Воспроизвести на другом языке
playVoiceFromLink(link, { lang: 'en-US', gender: 'male' });

// Декодировать ссылку — получить объект { text, settings }
const decoded = decodeWanderLink(link);
console.log(decoded.text, decoded.settings);

// Получить только текст (без настроек)
const rawText = getTextFromLink(link);

// Получить настройки (rate, pitch, gender, lang)
const settings = getSettingsFromLink(link);
```

## API

### `playVoiceFromLink(link, options)`

Воспроизводит голос из ссылки. Явные `options` имеют приоритет над настройками, сохранёнными в ссылке.

- `link` (string) — ссылка WanderVoice.
- `options` (object) — необязательные настройки:
  - `rate` (number) — скорость речи (0.5–2.0, по умолчанию 1).
  - `pitch` (number) — высота тона (0.5–2.0, по умолчанию 1).
  - `gender` (string) — 'male' или 'female' (по умолчанию 'male').
  - `lang` (string) — язык BCP 47, например `'ru-RU'`, `'en-US'`, `'fr-FR'` (по умолчанию `'ru-RU'`).

### `decodeWanderLink(link)`

Возвращает объект `{ text, settings }` или `null`.

### `getTextFromLink(link)`

Возвращает только текст из ссылки или `null`.

### `getSettingsFromLink(link)`

Возвращает объект настроек `{ rate, pitch, gender, lang }` или `null`.

## Формат данных

Данные в ссылке кодируются как **JSON + LZ-String** — это универсально и безопасно для всех языков (кириллица, латиница, иероглифы и т.д.).

Ударения из словаря применяются **только для русского текста** (автоматически определяется по наличию кириллицы), поэтому для других языков текст не искажается.

## Лицензия

MIT