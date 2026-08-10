import lzString from 'lz-string';

// ============================================================
//  1. СЛОВАРЬ УДАРЕНИЙ (для правильного произношения)
// ============================================================
const STRESS_MAP = [
  // Глаголы
  ['звонит', 'звонИт'],
  ['понял', 'понЯл'], ['поняла', 'понЯла'], ['поняли', 'понЯли'],
  ['помог', 'помОг'], ['помогла', 'помОгла'], ['помогли', 'помОгли'],
  ['сказал', 'сказАл'], ['сказала', 'сказАла'], ['сказали', 'сказАли'],
  ['написал', 'написАл'], ['написала', 'написАла'], ['написали', 'написАли'],
  ['сделал', 'сделАл'], ['сделала', 'сделАла'], ['сделали', 'сделАли'],
  ['услышал', 'услышАл'], ['услышала', 'услышАла'], ['услышали', 'услышАли'],
  ['решил', 'решИл'], ['решила', 'решИла'], ['решили', 'решИли'],
  ['хотел', 'хотЕл'], ['хотела', 'хотЕла'], ['хотели', 'хотЕли'],
  ['взял', 'взЯл'], ['взяла', 'взЯла'], ['взяли', 'взЯли'],
  ['дал', 'дАл'], ['дала', 'дАла'], ['дали', 'дАли'],
  ['видел', 'видЕл'], ['видела', 'видЕла'], ['видели', 'видЕли'],
  ['знал', 'знАл'], ['знала', 'знАла'], ['знали', 'знАли'],
  ['любил', 'любИл'], ['любила', 'любИла'], ['любили', 'любИли'],
  ['люблю', 'люблЮ'], ['любишь', 'любИшь'], ['любит', 'любИт'],
  ['любим', 'любИм'], ['любите', 'любИте'], ['любят', 'любЯт'],
  ['жду', 'ждУ'], ['ждёшь', 'ждЁшь'], ['ждёт', 'ждЁт'],
  ['ждём', 'ждЁм'], ['ждёте', 'ждЁте'], ['ждут', 'ждУт'],
  ['иду', 'идУ'], ['идёшь', 'идЁшь'], ['идёт', 'идЁт'],
  ['идём', 'идЁм'], ['идёте', 'идЁте'], ['идут', 'идУт'],
  ['ем', 'ем'], ['ешь', 'ешь'], ['ест', 'ест'], ['едят', 'едЯт'],
  ['сплю', 'сплЮ'], ['спишь', 'спИшь'], ['спит', 'спИт'],
  ['спим', 'спИм'], ['спите', 'спИте'], ['спят', 'спЯт'],
  // Существительные
  ['воздух', 'вОздух'], ['красивый', 'крАсивый'],
  ['красивая', 'крАсивая'], ['красивое', 'крАсивое'], ['красивые', 'крАсивые'],
  ['шарф', 'шАрф'], ['торты', 'тОрты'], ['река', 'рЕка'],
  ['балкон', 'бАлкон'], ['визитка', 'вИзИтка'], ['договор', 'договОр'],
  ['квартира', 'квАртира'], ['мальчик', 'мАльчик'],
  ['местоположение', 'мЕстоположение'], ['начал', 'нАчал'],
  ['неделя', 'нЕделя'], ['поезд', 'пОезд'], ['помнить', 'пОмнить'],
  ['порядок', 'пОрядок'], ['почта', 'пОчта'], ['ребёнок', 'рЕбёнок'],
  ['родственник', 'рОдственник'], ['сегодня', 'сЕгодня'],
  ['сердце', 'сЕрдце'], ['средство', 'срЕдство'], ['таможня', 'тАможня'],
  ['творог', 'твОрог'], ['узлов', 'узлОв'], ['фасоль', 'фАсоль'],
  ['хвоя', 'хвОя'], ['черпать', 'чЕрпать'], ['эксперт', 'экспЕрт'],
  ['ягода', 'ягОда'],
  // Прилагательные
  ['большой', 'бОльшОй'], ['большая', 'бОльшАя'],
  ['большое', 'бОльшОе'], ['большие', 'бОльшИе'],
  ['длинный', 'длиннЫй'], ['длинная', 'длиннАя'],
  ['длинное', 'длиннОе'], ['длинные', 'длиннЫе'],
  ['короткий', 'кОроткИй'], ['короткая', 'кОроткАя'],
  ['короткое', 'кОроткОе'], ['короткие', 'кОроткИе'],
  ['новый', 'нОвЫй'], ['новая', 'нОвАя'],
  ['новое', 'нОвОе'], ['новые', 'нОвЫе'],
  ['старый', 'стАрЫй'], ['старая', 'стАрАя'],
  ['старое', 'стАрОе'], ['старые', 'стАрЫе'],
  ['хороший', 'хорОшИй'], ['хорошая', 'хорОшАя'],
  ['хорошее', 'хорОшОе'], ['хорошие', 'хорОшИе'],
  // Наречия
  ['вчера', 'вчЕра'], ['завтра', 'зАвтра'], ['далеко', 'дАлеко'],
  ['близко', 'блИзко'], ['быстро', 'бЫстро'], ['медленно', 'мЕдленнО'],
];

function escapeRegExp(string) {
  const BS = String.fromCharCode(92);
  return string.split('').map(ch => {
    if ('*+?[](){}|^$.'.indexOf(ch) !== -1) return BS + ch;
    return ch;
  }).join('');
}

// Применяем ударения. Словарь имеет смысл только для русского языка.
function applyStress(text) {
  let result = text;
  const sorted = STRESS_MAP.slice().sort((a, b) => b[0].length - a[0].length);
  for (const [from, to] of sorted) {
    const regex = new RegExp(
      '(^|\\s|[,.;:!?\u2014\u2013\u00AB\u00BB\\-])' +
      escapeRegExp(from) +
      '($|\\s|[,.;:!?\u2014\u2013\u00AB\u00BB\\-])',
      'gi'
    );
    result = result.replace(regex, (match, p1, p2) => p1 + to + p2);
  }
  return result;
}

// Проверка, содержит ли текст кириллицу (тогда ударения уместны)
function isRussian(text) {
  return /[а-яё]/i.test(text);
}

// Применяем ударения только для русского текста
function maybeApplyStress(text) {
  return isRussian(text) ? applyStress(text) : text;
}

// ============================================================
//  2. ДЕКОДИРОВАНИЕ ДАННЫХ ИЗ ССЫЛКИ
//  Формат всегда JSON + LZ-String (универсально для всех языков)
// ============================================================
function decodeData(encoded) {
  const decompressed = lzString.decompressFromEncodedURIComponent(encoded);
  if (!decompressed) return null;
  try {
    return JSON.parse(decompressed);
  } catch (e) {
    return null;
  }
}

// ============================================================
//  3. ПОИСК ГОЛОСА ПО ЯЗЫКУ И ПОЛУ
// ============================================================
function findVoice(lang = 'ru-RU', gender = 'male') {
  const voices = window.speechSynthesis.getVoices();
  const langBase = String(lang).split('-')[0].toLowerCase();
  const langVoices = voices.filter(v =>
    (v.lang || '').toLowerCase().split('-')[0] === langBase
  );

  const maleNames = ['pavel', 'yuri', 'dmitry', 'google', 'alexander', 'boris', 'denis',
    'male', 'mikhail', 'nikolay', 'sergey', 'vladimir', 'artem', 'roman'];
  const femaleNames = ['milena', 'irina', 'seda', 'ailina', 'alena', 'alexandra',
    'anastasia', 'darya', 'ekaterina', 'olga', 'svetlana', 'tatyana', 'female',
    'polina', 'marina', 'arina', 'zina', 'filiz'];

  const names = gender === 'male' ? maleNames : femaleNames;
  for (const name of names) {
    const found = langVoices.find(v => v.name.toLowerCase().includes(name));
    if (found) return found;
  }
  return langVoices[0] || null;
}

// ============================================================
//  4. ОСНОВНЫЕ ФУНКЦИИ ДЛЯ РАЗРАБОТЧИКОВ
// ============================================================

/**
 * Декодирует данные из ссылки WanderVoice и возвращает объект { text, settings }.
 * @param {string} link - ссылка вида https://vk.com/app54714168#data=...
 * @returns {{ text?: string, settings?: Object } | null}
 */
export function decodeWanderLink(link) {
  const hash = link.split('#')[1] || '';
  const params = new URLSearchParams(hash);
  const encoded = params.get('data');
  if (!encoded) return null;
  return decodeData(encoded);
}

/**
 * Воспроизводит голос из ссылки WanderVoice.
 * Явные options имеют приоритет над настройками из ссылки.
 * @param {string} link - ссылка с данными
 * @param {Object} options - переопределяющие настройки (необязательно)
 * @param {number} options.rate - скорость речи (0.5–2.0)
 * @param {number} options.pitch - высота тона (0.5–2.0)
 * @param {string} options.gender - 'male' или 'female'
 * @param {string} options.lang - язык BCP 47, напр. 'ru-RU' (по умолчанию 'ru-RU')
 * @returns {boolean} - удалось ли начать воспроизведение
 */
export function playVoiceFromLink(link, options = {}) {
  if (!window.speechSynthesis) {
    console.warn('SpeechSynthesis не поддерживается в этом браузере');
    return false;
  }

  const decoded = decodeWanderLink(link);
  if (!decoded || !decoded.text) {
    console.warn('Не удалось декодировать ссылку');
    return false;
  }

  if (window.speechSynthesis.speaking) {
    window.speechSynthesis.cancel();
  }

  const text = maybeApplyStress(decoded.text);
  const utterance = new SpeechSynthesisUtterance(text);

  const settings = decoded.settings || {};

  // Приоритет: options > настройки из ссылки > значения по умолчанию
  const rate = options.rate !== undefined ? options.rate : (settings.rate !== undefined ? settings.rate : 1);
  const pitch = options.pitch !== undefined ? options.pitch : (settings.pitch !== undefined ? settings.pitch : 1);
  const lang = options.lang || settings.lang || 'ru-RU';
  const gender = options.gender || settings.gender || 'male';

  utterance.lang = lang;
  utterance.rate = rate;
  utterance.pitch = pitch;

  const voice = findVoice(lang, gender);
  if (voice) utterance.voice = voice;

  window.speechSynthesis.speak(utterance);
  return true;
}

/**
 * Получить только текст из ссылки (без настроек).
 * @param {string} link
 * @returns {string | null}
 */
export function getTextFromLink(link) {
  const decoded = decodeWanderLink(link);
  return decoded ? (decoded.text || null) : null;
}

/**
 * Получить настройки из ссылки (rate, pitch, gender, lang).
 * @param {string} link
 * @returns {Object | null}
 */
export function getSettingsFromLink(link) {
  const decoded = decodeWanderLink(link);
  return decoded ? decoded.settings : null;
}