export const metrics = [
  { label: 'После очистки', value: '41', note: 'Запрос остался после удаления мусора и дублей.' },
  { label: 'Кластеры', value: '17', note: 'Сгруппированы по интенту, сущности и бизнес-сценарию.' },
  { label: 'Спорные кейсы', value: '6', note: 'Отправлены в ручной QA вместо автоматического publish.' },
  { label: 'AI-ready blocks', value: '23', note: 'FAQ, definitions, compare-блоки и entity answers.' },
]

export const stages = [
  {
    id: 'normalize',
    index: '01',
    title: 'Нормализация и дедупликация',
    tag: 'Input control',
    automation: 'LLM + rules',
    description:
      'Сырые запросы приводятся к каноническому виду. Удаляются орфографические повторы, мусорные хвосты, нерелевантные гео и новостные примеси.',
    tasks: [
      'чистит стоп-слова и дубли формулировок',
      'отсекает новостные и некоммерческие хвосты',
      'нормализует бренд, атрибут и гео',
    ],
    checks: [
      'нет ли потери бизнес-ценного long-tail запроса',
      'не склеены ли разные сущности в один normalized form',
      'гео-слой вынесен в отдельное поле',
    ],
    output: '{"normalized":"пластиковые окна на балкон","geo":"moskva"}',
  },
  {
    id: 'entities',
    index: '02',
    title: 'Извлечение сущностей и модификаторов',
    tag: 'Semantic parsing',
    automation: 'LLM structured output',
    description:
      'Система выделяет объект спроса, атрибуты, материал, сценарий использования и региональность. Это база для правильной типизации страницы.',
    tasks: [
      'делит запрос на entity / attribute / modifier',
      'ловит сценарии вроде balkon, cottage, office',
      'сохраняет значения в JSON-структуру',
    ],
    checks: [
      'атрибут не должен подменять основную сущность',
      'модификаторы цены не должны ломать интент',
      'синонимы сведены к словарной форме',
    ],
    output: '{"entity":"окна","material":"пвх","use_case":"балкон"}',
  },
  {
    id: 'intent',
    index: '03',
    title: 'Классификация интента',
    tag: 'Demand modeling',
    automation: 'LLM + whitelist',
    description:
      'Запросу назначается намерение: коммерческое, сравнительное, информационное, гео-коммерческое или сервисное. Без этого кластеры начинают каннибализировать друг друга.',
    tasks: [
      'размечает dominant intent',
      'фиксирует second intent для mixed queries',
      'помечает спорные случаи для человека',
    ],
    checks: [
      'commercial vs informational не смешаны',
      'comparison не отправлен в категорию',
      'faq-intent не поглощен landing page',
    ],
    output: '{"intent":"commercial","secondary_intent":"geo"}',
  },
  {
    id: 'page-type',
    index: '04',
    title: 'Определение типа страницы',
    tag: 'Architecture decision',
    automation: 'Rule-based with LLM hints',
    description:
      'Для каждого кластера выбирается шаблон страницы: категория, тег, фильтр, comparison, FAQ или региональная посадочная. Решение привязано к шаблону сайта, а не к абстрактной SERP-логике.',
    tasks: [
      'сопоставляет intent с доступными template types',
      'запрещает создание мусорных URL',
      'маркирует already-covered pages',
    ],
    checks: [
      'страница не дублирует существующий URL',
      'объем спроса оправдывает отдельный template',
      'фильтр не превращается в тонкую категорию',
    ],
    output: '{"page_type":"subcategory","publish_decision":"create"}',
  },
  {
    id: 'naming',
    index: '05',
    title: 'Canonical label, H1 и URL',
    tag: 'Output synthesis',
    automation: 'LLM templating',
    description:
      'На выходе формируются читаемые названия кластера, человекочитаемый H1, Title и предлагаемая URL-структура без переспама.',
    tasks: [
      'собирает cluster label для таблиц и аналитики',
      'генерирует H1 по стандарту бренда',
      'создает slug для нового URL',
    ],
    checks: [
      'нет SEO-канцелярита в H1',
      'slug консистентен с архитектурой',
      'title не обещает то, чего нет на странице',
    ],
    output:
      '{"cluster_label":"пластиковые окна для балкона","url":"/plastikovye-okna/balkon/"}',
  },
  {
    id: 'qa',
    index: '06',
    title: 'Conflict check и ручной QA',
    tag: 'Release gate',
    automation: 'Human in the loop',
    description:
      'Финальный слой проверяет каннибализацию, дубли с каталогом, неочевидные конфликты интентов и бизнес-ценность страницы до публикации.',
    tasks: [
      'подсвечивает overlap по кластеру и slug',
      'сравнивает с текущим каталогом',
      'отправляет спорные строки на ручное ревью',
    ],
    checks: [
      'каждый URL имеет уникальный job to be done',
      'нет дубля page type + geo + entity',
      'страница понятна и людям, и LLM-интерфейсам',
    ],
    output: '{"status":"approved_with_review","reason":"geo overlap checked"}',
  },
]

export const queryRows = [
  {
    raw: 'купить пластиковые окна на балкон москва',
    intent: 'commercial + geo',
    pageType: 'subcategory',
    cluster: 'пластиковые окна для балкона',
  },
  {
    raw: 'окна пвх в коттедж цена',
    intent: 'commercial',
    pageType: 'scenario landing',
    cluster: 'пвх окна для коттеджа',
  },
  {
    raw: 'какие окна лучше пластиковые или алюминиевые',
    intent: 'comparison',
    pageType: 'compare page',
    cluster: 'пластиковые vs алюминиевые окна',
  },
  {
    raw: 'срок службы пластиковых окон',
    intent: 'informational',
    pageType: 'faq / guide',
    cluster: 'срок службы пластиковых окон',
  },
  {
    raw: 'окна rehau официальный дилер москва',
    intent: 'brand + geo',
    pageType: 'brand landing',
    cluster: 'окна rehau в москве',
  },
]

export const clusterJourney = [
  {
    step: '01',
    title: 'Сбор',
    body: 'Запрос "купить пластиковые окна на балкон москва" попал из search suggest и категории конкурента.',
  },
  {
    step: '02',
    title: 'Очистка',
    body: 'Система убрала лишний глагол "купить" из cluster label, но сохранила коммерческий intent в метаданных.',
  },
  {
    step: '03',
    title: 'Сущности',
    body: 'Entity = окна, material = пвх, use_case = балкон, geo = Москва.',
  },
  {
    step: '04',
    title: 'Тип страницы',
    body: 'Выбран subtype landing, потому что сценарий "балкон" устойчив и поддерживается ассортиментом.',
  },
  {
    step: '05',
    title: 'Название',
    body: 'H1: "Пластиковые окна для балкона". Title и description генерируются уже по шаблону карточки.',
  },
  {
    step: '06',
    title: 'URL',
    body: 'Создан slug `/plastikovye-okna/balkon/`, потому что он не конфликтует с общей категорией и понятен модели.',
  },
]

export const architectureNodes = [
  {
    title: 'Категория',
    reason: 'Закрывает базовый коммерческий спрос и служит хабом для сценариев и брендов.',
    url: '/plastikovye-okna/',
  },
  {
    title: 'Сценарная посадочная',
    reason: 'Отдельный URL под use-case с четким ассортиментом и коммерческими блоками.',
    url: '/plastikovye-okna/balkon/',
  },
  {
    title: 'Брендовая страница',
    reason: 'Работает для навигационного и бренд-коммерческого спроса.',
    url: '/plastikovye-okna/rehau/',
  },
  {
    title: 'Comparison page',
    reason: 'Снимает сравнительный интент и не смешивается с продажей.',
    url: '/compare/plastikovye-vs-alyuminievye-okna/',
  },
  {
    title: 'FAQ / guide',
    reason: 'Повышает LLM-видимость за счет ясных ответов и структурированных сущностей.',
    url: '/faq/srok-sluzhby-plastikovyh-okon/',
  },
]

export const checks = [
  {
    title: 'Спорные кластеры',
    body: 'Человек проверяет, где одинаковая сущность может вести в разный page type из-за контекста запроса.',
  },
  {
    title: 'Бизнес-ценность',
    body: 'Не каждый кластер с частотностью должен стать URL. Нужна оценка ассортимента, маржи и шаблонной поддержки.',
  },
  {
    title: 'Каннибализация',
    body: 'Только вручную видно, когда два seemingly different labels на деле бьются за один и тот же job to be done.',
  },
  {
    title: 'Качество LLM-выхода',
    body: 'Проверяются H1, slug и объяснение решений. Модель должна помогать, а не плодить псевдо-SEO конструкции.',
  },
]

export const prompts = [
  {
    tag: 'Prompt 01',
    title: 'Очистка мусорных запросов',
    body: 'Роль: senior semantic analyst. На вход подается массив запросов. На выходе только JSON с полями keep, reason, normalized.',
  },
  {
    tag: 'Prompt 02',
    title: 'Intent classification',
    body: 'LLM получает запрос, entity и modifiers. Возвращает dominant_intent, secondary_intent и confidence без свободного текста.',
  },
  {
    tag: 'Prompt 03',
    title: 'Page type decision',
    body: 'Выбор между category, filter, brand, compare, faq и no-page с обязательным объяснением publish_decision.',
  },
  {
    tag: 'Prompt 04',
    title: 'H1 без SEO-шизофрении',
    body: 'Ограничения: человекочитаемость, максимум 70 символов, без повторов города и лишних коммерческих хвостов.',
  },
]
