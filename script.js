// =========================
// НАСТРОЙКИ
// =========================
const SUPPORT_URL = 'https://t.me/alexeyvatutin';
const SELL_MANAGER_URL = 'https://t.me/alexeyvatutin';
const BACKEND_BASE_URL = 'https://knives-writing-fighters-reserved.trycloudflare.com';
const ACCESS_RESTRICTED_TEXT = 'Оформить заказ можно вручную.';

// Промокоды можно заменить на свои.
// Формат: КОД: размер_скидки_в_процентах
const PROMO_CODES = {
  START5: 5,
  BONUS7: 7,
  VIP10: 10,
};

const blackRussiaServers = [
  'RED', 'GREEN', 'BLUE', 'YELLOW', 'ORANGE', 'PURPLE', 'LIME', 'PINK', 'CHERRY', 'BLACK',
  'INDIGO', 'WHITE', 'MAGENTA', 'CRIMSON', 'GOLD', 'AZURE', 'PLATINUM', 'AQUA', 'GRAY', 'ICE',
  'CHILLI', 'CHOCO', 'MOSCOW', 'SPB', 'UFA', 'SOCHI', 'KAZAN', 'SAMARA', 'ROSTOV', 'ANAPA',
  'EKB', 'KRASNODAR', 'ARZAMAS', 'NOVOSIB', 'GROZNY', 'SARATOV', 'OMSK', 'IRKUTSK', 'VOLGOGRAD',
  'VORONEZH', 'BELGOROD', 'MAKHACHKALA', 'VLADIKAVKAZ', 'VLADIVOSTOK', 'KALININGRAD',
  'CHELYABINSK', 'KRASNOYARSK', 'CHEBOKSARY', 'KHABAROVSK', 'PERM', 'TULA', 'RYAZAN', 'MURMANSK',
  'PENZA', 'KURSK', 'ARKHANGELSK', 'ORENBURG', 'KIROV', 'KEMEROVO', 'TYUMEN', 'TOLYATTI',
  'IVANOVO', 'STAVROPOL', 'SMOLENSK', 'PSKOV', 'BRYANSK', 'OREL', 'YAROSLAVL', 'BARNAUL',
  'LIPETSK', 'ULYANOVSK', 'YAKUTSK', 'TAMBOV', 'BRATSK', 'ASTRAKHAN', 'CHITA', 'KOSTROMA',
  'VLADIMIR', 'KALUGA', 'NOVGOROD', 'TAGANROG', 'VOLOGDA', 'TVER', 'TOMSK', 'IZHEVSK', 'SURGUT',
  'PODOLSK', 'MAGADAN', 'CHEREPOVETS', 'NORILSK',
];

const gtaServers = [
  'Downtown', 'Strawberry', 'Vinewood', 'Blackberry', 'Insquad', 'Sunrise', 'Rainbow', 'Richman',
  'Eclipse', 'La Mesa', 'Burton', 'Rockford', 'Alta', 'Del Perro', 'Davis', 'Harmony', 'Redwood',
  'Hawick', 'Grapeseed', 'Murrieta', 'Vespucci', 'Milton', 'La Puerta', 'Senora',
];

const matreshkaServers = Array.from({ length: 34 }, (_, i) => `MATRESHKA MOBILE #${i + 1}`);

const blackRussiaPricing = [
  { min: 100, rate: 40 },
  { min: 10, rate: 45 },
  { min: 0, rate: 50 },
];

const matreshkaPricing = [
  { min: 100, rate: 70 },
  { min: 10, rate: 80 },
  { min: 0, rate: 100 },
];

const gtaPricing = [
  { min: 50, rate: 800 },
  { min: 10, rate: 900 },
  { min: 5, rate: 950 },
  { min: 0, rate: 1000 },
];

const standoffPricing = [
  { min: 0, rate: 0.55 },
];

const games = {
  br: {
    name: 'BLACK RUSSIA',
    sellUrl: SELL_MANAGER_URL,
    servers: blackRussiaServers,
    pricing: blackRussiaPricing,
    actionBuyText: 'КУПИТЬ ВИРТЫ',
    actionSellText: 'ПРОДАТЬ ВИРТЫ',
    buyTitle: 'Купить вирты',
    amountLabel: 'Количество валюты (кк)',
    amountPlaceholder: 'Например, 10',
    buySubmitText: 'КУПИТЬ',
    rateSuffix: '₽ / 1кк',
    goldMode: false,
    autoSelectServer: '',
  },
  mat: {
    name: 'MATRESHKA RP',
    sellUrl: SELL_MANAGER_URL,
    servers: matreshkaServers,
    pricing: matreshkaPricing,
    actionBuyText: 'КУПИТЬ ВИРТЫ',
    actionSellText: 'ПРОДАТЬ ВИРТЫ',
    buyTitle: 'Купить вирты',
    amountLabel: 'Количество валюты (кк)',
    amountPlaceholder: 'Например, 10',
    buySubmitText: 'КУПИТЬ',
    rateSuffix: '₽ / 1кк',
    goldMode: false,
    autoSelectServer: '',
  },
  gta: {
    name: 'GTA 5 RP',
    sellUrl: SELL_MANAGER_URL,
    servers: gtaServers,
    pricing: gtaPricing,
    actionBuyText: 'КУПИТЬ ВИРТЫ',
    actionSellText: 'ПРОДАТЬ ВИРТЫ',
    buyTitle: 'Купить вирты',
    amountLabel: 'Количество валюты (кк)',
    amountPlaceholder: 'Например, 10',
    buySubmitText: 'КУПИТЬ',
    rateSuffix: '₽ / 1кк',
    goldMode: false,
    autoSelectServer: '',
  },
  so2: {
    name: 'STANDOFF 2',
    sellUrl: SELL_MANAGER_URL,
    servers: ['STANDOFF 2'],
    pricing: standoffPricing,
    actionBuyText: 'КУПИТЬ ГОЛДУ',
    actionSellText: 'ПРОДАТЬ ГОЛДУ',
    buyTitle: 'Купить голду',
    amountLabel: 'Количество голды',
    amountPlaceholder: 'Например, 100',
    buySubmitText: 'КУПИТЬ ГОЛДУ',
    rateSuffix: '₽ за 1 голду',
    goldMode: true,
    autoSelectServer: 'STANDOFF 2',
  },
};

// =========================
// СОСТОЯНИЕ
// =========================
const state = {
  gameKey: '',
  server: '',
  lastEdited: 'virtual',
  currentRate: 0,
  subtotal: 0,
  promoDiscount: 0,
  total: 0,
  virtualAmount: 0,
  deliveryMethod: 'trade',
};

// =========================
// TELEGRAM WEBAPP
// =========================
function initTelegram() {
  if (!window.Telegram || !window.Telegram.WebApp) return;

  try {
    Telegram.WebApp.ready();
    Telegram.WebApp.expand();

    if (Telegram.WebApp.disableVerticalSwipes) {
      Telegram.WebApp.disableVerticalSwipes();
    }
  } catch (e) {
    console.error('Telegram WebApp init error', e);
  }
}

// =========================
// ВСПОМОГАТЕЛЬНЫЕ
// =========================
function switchScreen(id) {
  document.querySelectorAll('.screen').forEach((screen) => {
    screen.classList.remove('active');
  });

  const nextScreen = document.getElementById(id);
  if (nextScreen) {
    nextScreen.classList.add('active');
  }
}

function goHome() {
  switchScreen('home');
}

function goActions() {
  if (!state.gameKey) {
    goHome();
    return;
  }

  renderActions();
  switchScreen('actions');
}

function goServers() {
  const game = currentGame();

  if (!state.gameKey) {
    goHome();
    return;
  }

  if (game && game.autoSelectServer) {
    goActions();
    return;
  }

  renderServers();
  switchScreen('servers');
}

function goInfo() {
  switchScreen('info');
}

function currentGame() {
  return games[state.gameKey];
}

function openExternal(url) {
  if (window.Telegram && Telegram.WebApp) {
    if (url.startsWith('https://t.me/') && Telegram.WebApp.openTelegramLink) {
      Telegram.WebApp.openTelegramLink(url);
      return;
    }

    if (Telegram.WebApp.openLink) {
      Telegram.WebApp.openLink(url);
      return;
    }
  }

  window.open(url, '_blank');
}

function formatMoney(value) {
  return `${Math.round(value).toLocaleString('ru-RU')} ₽`;
}

function getDeliveryMethodLabel() {
  return state.deliveryMethod === 'bank' ? 'Банком' : 'Трейдом';
}

function sanitizeBankAccount() {
  const input = document.getElementById('bankAccount');
  if (!input) return;

  input.value = input.value.replace(/[^\d]/g, '');
}

function setDeliveryMethod(method) {
  state.deliveryMethod = method === 'bank' ? 'bank' : 'trade';

  const tradeBtn = document.getElementById('deliveryTradeBtn');
  const bankBtn = document.getElementById('deliveryBankBtn');
  const bankInput = document.getElementById('bankAccount');
  const hint = document.getElementById('deliveryHint');
  const label = document.getElementById('buyDeliveryMethodText');

  if (tradeBtn) {
    tradeBtn.classList.toggle('active', state.deliveryMethod === 'trade');
  }

  if (bankBtn) {
    bankBtn.classList.toggle('active', state.deliveryMethod === 'bank');
  }

  if (bankInput) {
    bankInput.classList.toggle('show', state.deliveryMethod === 'bank');
  }

  if (state.deliveryMethod === 'bank') {
    if (hint) {
      hint.innerText = 'Для выдачи банком укажи номер игрового банковского счёта.';
    }
  } else {
    if (bankInput) {
      bankInput.value = '';
    }

    if (hint) {
      hint.innerText = 'Выдача будет отмечена как трейд.';
    }
  }

  if (label) {
    label.innerText = getDeliveryMethodLabel();
  }
}

function getPromoPercent() {
  const promoInput = document.getElementById('promoInput');
  if (!promoInput) return 0;

  const code = promoInput.value.trim().toUpperCase();
  return PROMO_CODES[code] || 0;
}

function getPricingForVirtual(amount) {
  const game = currentGame();

  if (!game || !Array.isArray(game.pricing) || !game.pricing.length) {
    return 0;
  }

  const pricing = game.pricing.slice().sort((a, b) => b.min - a.min);
  const selected = pricing.find((item) => amount >= item.min) || pricing[pricing.length - 1];

  return selected.rate;
}

function formatAmountValue(value) {
  const num = Number(value);
  if (!Number.isFinite(num)) return '0';
  if (Number.isInteger(num)) return num.toLocaleString('ru-RU');
  return Number(num.toFixed(2)).toLocaleString('ru-RU');
}

function formatTierLabel(min, goldMode) {
  if (goldMode) {
    return `от ${formatAmountValue(min)} голды`;
  }
  return `от ${formatAmountValue(min)} кк`;
}

function calculateFromVirtual(amount) {
  const validAmount = Math.max(0, Number(amount) || 0);
  const rate = getPricingForVirtual(validAmount);
  const subtotal = validAmount * rate;
  const promoPercent = getPromoPercent();
  const promoDiscount = subtotal * promoPercent / 100;
  const total = Math.max(0, subtotal - promoDiscount);

  return {
    virtualAmount: validAmount,
    rate,
    subtotal,
    promoDiscount,
    total,
  };
}

function calculateFromMoney(moneyValue) {
  const money = Math.max(0, Number(moneyValue) || 0);
  const promoPercent = getPromoPercent();
  const game = currentGame();

  if (!game || !Array.isArray(game.pricing) || !game.pricing.length) {
    return calculateFromVirtual(0);
  }

  const pricing = game.pricing.slice().sort((a, b) => b.min - a.min);

  for (const tier of pricing) {
    const effectiveRate = tier.rate * (1 - promoPercent / 100);

    if (effectiveRate <= 0) continue;

    const virtualAmount = money / effectiveRate;
    if (virtualAmount >= tier.min) {
      return calculateFromVirtual(virtualAmount);
    }
  }

  return calculateFromVirtual(0);
}

function updateSummary(result) {
  state.currentRate = result.rate;
  state.subtotal = result.subtotal;
  state.promoDiscount = result.promoDiscount;
  state.total = result.total;
  state.virtualAmount = result.virtualAmount;

  const rateText = document.getElementById('rateText');
  const subtotalText = document.getElementById('subtotalText');
  const promoDiscountText = document.getElementById('promoDiscountText');
  const totalText = document.getElementById('totalText');
  const game = currentGame();

  if (rateText) {
    rateText.innerText = result.virtualAmount > 0 ? `${result.rate} ${game?.rateSuffix || '₽ / 1кк'}` : '—';
  }

  if (subtotalText) {
    subtotalText.innerText = formatMoney(result.subtotal);
  }

  if (promoDiscountText) {
    promoDiscountText.innerText = formatMoney(result.promoDiscount);
  }

  if (totalText) {
    totalText.innerText = formatMoney(result.total);
  }
}

function renderDiscounts() {
  const container = document.getElementById('discountsList');
  const game = currentGame();

  if (!container) return;

  if (!game || !Array.isArray(game.pricing) || !game.pricing.length) {
    container.innerHTML = '';
    return;
  }

  if (game.goldMode) {
    container.innerHTML = `
      <div class="discount-row"><span>1 голда</span><span>0.55 ₽</span></div>
      <div class="discount-row"><span>100 голды</span><span>55 ₽</span></div>
      <div class="discount-row"><span>500 голды</span><span>275 ₽</span></div>
      <div class="discount-row"><span>1000 голды</span><span>550 ₽</span></div>
    `;
    return;
  }

  const pricing = game.pricing.slice().sort((a, b) => a.min - b.min);

  const lines = pricing.map((item, index) => {
    if (index === 0) {
      const nextMin = pricing[index + 1]?.min;
      const label = nextMin ? `до ${formatAmountValue(nextMin - 0.01)} кк` : 'любой объём';
      return { label, rate: item.rate };
    }

    return {
      label: formatTierLabel(item.min, false),
      rate: item.rate,
    };
  });

  container.innerHTML = lines
    .map((item) => `
      <div class="discount-row">
        <span>${item.label}</span>
        <span>${item.rate} ₽ / 1кк</span>
      </div>
    `)
    .join('');
}

function resetBuyForm() {
  const nickname = document.getElementById('nickname');
  const promoInput = document.getElementById('promoInput');
  const virtualAmount = document.getElementById('virtualAmount');
  const moneyAmount = document.getElementById('moneyAmount');
  const bankAccount = document.getElementById('bankAccount');
  const promoStatus = document.getElementById('promoStatus');

  if (nickname) nickname.value = '';
  if (promoInput) promoInput.value = '';
  if (virtualAmount) virtualAmount.value = '';
  if (moneyAmount) moneyAmount.value = '';
  if (bankAccount) bankAccount.value = '';

  if (promoStatus) {
    promoStatus.className = 'helper-text';
    promoStatus.innerText = '';
  }

  state.lastEdited = 'virtual';
  applyGameUiTexts();
  setDeliveryMethod('trade');
  updateSummary(calculateFromVirtual(0));
  renderDiscounts();
}

function injectDynamicStyles() {
  if (document.getElementById('dynamic-so2-styles')) return;

  const style = document.createElement('style');
  style.id = 'dynamic-so2-styles';
  style.textContent = `
    .btn-game-so2 {
      background: linear-gradient(135deg, #394252, #151a22);
      box-shadow:
        0 12px 28px rgba(0, 0, 0, 0.24),
        0 0 18px rgba(207, 160, 58, 0.14),
        0 0 34px rgba(207, 160, 58, 0.10);
    }

    .btn-game-so2:hover {
      filter: brightness(1.05);
    }

    .btn-gold {
      background: linear-gradient(90deg, #f3c74d, #ba7b00) !important;
      color: #241700 !important;
      text-align: center;
      box-shadow: 0 12px 30px rgba(186, 123, 0, 0.25);
    }

    .discount-row {
      display: flex;
      justify-content: space-between;
      gap: 12px;
      font-size: 14px;
      color: var(--text-muted);
    }

    .discount-row + .discount-row {
      margin-top: 8px;
    }

    .restricted-wrap {
      width: min(100%, 440px);
      margin: 0 auto;
      padding: 16px 14px 24px;
    }

    .restricted-card {
      background: rgba(14, 22, 34, 0.82);
      border: 1px solid rgba(255, 255, 255, 0.08);
      box-shadow: 0 20px 50px rgba(0, 0, 0, 0.28);
      backdrop-filter: blur(20px);
      border-radius: 24px;
      padding: 18px;
      color: #fff;
    }

    .restricted-card h2 {
      margin: 0 0 10px;
      font-size: 22px;
      font-weight: 800;
    }

    .restricted-card p {
      margin: 0;
      font-size: 14px;
      line-height: 1.5;
      color: rgba(255, 255, 255, 0.78);
    }
  `;
  document.head.appendChild(style);
}

function ensureStandoffButton() {
  if (document.querySelector('.btn-game-so2')) return;

  const gtaButton = document.querySelector('.btn-game-gta');
  if (!gtaButton) return;

  const button = document.createElement('button');
  button.className = 'btn btn-game btn-game-so2';
  button.type = 'button';
  button.innerHTML = `
    <span class="game-left">
      <span class="game-icon">
        <img src="standoff.svg" alt="STANDOFF 2">
      </span>
      <span class="game-meta">
        <span class="game-name">STANDOFF 2</span>
        <span class="game-note">Покупка и продажа голды</span>
      </span>
    </span>
    <span class="game-arrow">›</span>
  `;
  button.addEventListener('click', () => selectGame('so2'));

  gtaButton.insertAdjacentElement('afterend', button);
}

function applyGameUiTexts() {
  const game = currentGame();
  if (!game) return;

  const actionsScreen = document.getElementById('actions');
  const serversScreen = document.getElementById('servers');
  const buyScreen = document.getElementById('buy');

  if (actionsScreen) {
    const actionButtons = actionsScreen.querySelectorAll('.stack > .btn');
    const actionsFooter = actionsScreen.querySelector('.footer');

    if (actionButtons.length >= 2) {
      actionButtons[0].innerText = game.actionBuyText;
      actionButtons[0].classList.toggle('btn-gold', !!game.goldMode);
      actionButtons[0].classList.toggle('btn-primary', !game.goldMode);
      actionButtons[0].classList.add('center');

      actionButtons[1].innerText = game.actionSellText;
    }

    if (actionsFooter) {
      actionsFooter.innerText = game.autoSelectServer
        ? 'Продажа переводит пользователя в Telegram к менеджеру. Покупка открывает форму заявки.'
        : 'Продажа переводит пользователя в Telegram к менеджеру. Покупка открывает выбор сервера и форму заявки.';
    }
  }

  if (serversScreen) {
    const sectionTitle = serversScreen.querySelector('.section-title');
    const heading = serversScreen.querySelector('h2');

    if (sectionTitle) {
      sectionTitle.innerText = game.buyTitle;
    }

    if (heading) {
      heading.innerText = game.autoSelectServer ? 'Подтверждение товара' : 'Выбор сервера';
    }
  }

  if (buyScreen) {
    const sectionTitle = buyScreen.querySelector('.section-title');
    const heading = buyScreen.querySelector('h2');
    const rows = buyScreen.querySelectorAll('.selected-box .selected-row');
    const amountLabel = buyScreen.querySelector('label[for="virtualAmount"]');
    const amountInput = document.getElementById('virtualAmount');
    const submitBtn = buyScreen.querySelector('button[onclick="buy()"]') || buyScreen.querySelector('.btn-primary, .btn-gold');
    const footer = buyScreen.querySelector('.footer');

    if (sectionTitle) {
      sectionTitle.innerText = 'Оформление заказа';
    }

    if (heading) {
      heading.innerText = game.buyTitle;
    }

    if (rows.length >= 2) {
      const secondLabel = rows[1].querySelector('span');
      if (secondLabel) {
        secondLabel.innerText = game.autoSelectServer ? 'Товар' : 'Сервер';
      }
    }

    if (amountLabel) {
      amountLabel.innerText = game.amountLabel;
    }

    if (amountInput) {
      amountInput.placeholder = game.amountPlaceholder;
    }

    if (submitBtn) {
      submitBtn.innerText = game.buySubmitText;
      submitBtn.classList.toggle('btn-gold', !!game.goldMode);
      submitBtn.classList.toggle('btn-primary', !game.goldMode);
      submitBtn.classList.add('center');
    }

    if (footer) {
      footer.innerText = game.goldMode
        ? 'Можно ввести количество голды или сумму в рублях — второе поле пересчитается автоматически.'
        : 'Можно ввести либо количество виртов, либо сумму в рублях — второе поле пересчитается автоматически.';
    }
  }
}

// =========================
// ГЛАВНЫЙ ПОТОК
// =========================
function selectGame(key) {
  state.gameKey = key;
  state.server = '';
  renderActions();
  resetBuyForm();
  switchScreen('actions');
}

function renderActions() {
  const game = currentGame();
  if (!game) return;

  const actionsTitle = document.getElementById('actionsTitle');
  const actionsGameBadge = document.getElementById('actionsGameBadge');

  if (actionsTitle) {
    actionsTitle.innerText = game.name;
  }

  if (actionsGameBadge) {
    actionsGameBadge.innerText = game.name;
  }

  applyGameUiTexts();
}

function openBuyFlow() {
  if (!state.gameKey) return;

  const game = currentGame();
  if (!game) return;

  if (game.autoSelectServer) {
    selectServer(game.autoSelectServer);
    return;
  }

  renderServers();
  switchScreen('servers');
}

function renderServers(filteredList) {
  const game = currentGame();
  if (!game) return;

  if (game.autoSelectServer) {
    selectServer(game.autoSelectServer);
    return;
  }

  const serverSearch = document.getElementById('serverSearch');
  const serversGameBadge = document.getElementById('serversGameBadge');
  const container = document.getElementById('serversContainer');

  if (!filteredList && serverSearch) {
    serverSearch.value = '';
  }

  if (serversGameBadge) {
    serversGameBadge.innerText = game.name;
  }

  if (!container) return;

  const list = filteredList || game.servers;
  container.innerHTML = '';

  if (!list.length) {
    container.innerHTML = '<div class="empty-state">Ничего не найдено по этому запросу.</div>';
    return;
  }

  list.forEach((name) => {
    const button = document.createElement('button');
    button.className = 'btn server-btn';
    button.innerHTML = `
      <span>${name}</span>
      <small>Нажми, чтобы перейти к оформлению</small>
    `;
    button.onclick = () => selectServer(name);
    container.appendChild(button);
  });
}

function filterServers() {
  const serverSearch = document.getElementById('serverSearch');
  const game = currentGame();
  if (!serverSearch || !game) return;

  const value = serverSearch.value.trim().toLowerCase();
  const filtered = game.servers.filter((server) => server.toLowerCase().includes(value));
  renderServers(filtered);
}

function selectServer(serverName) {
  state.server = serverName;

  const buyGameName = document.getElementById('buyGameName');
  const buyServerName = document.getElementById('buyServerName');
  const buyDeliveryMethodText = document.getElementById('buyDeliveryMethodText');
  const game = currentGame();

  if (buyGameName && game) {
    buyGameName.innerText = game.name;
  }

  if (buyServerName) {
    buyServerName.innerText = serverName;
  }

  if (buyDeliveryMethodText) {
    buyDeliveryMethodText.innerText = getDeliveryMethodLabel();
  }

  applyGameUiTexts();
  renderDiscounts();
  switchScreen('buy');
}

function handlePromoInput() {
  const promoEl = document.getElementById('promoStatus');
  const promoInput = document.getElementById('promoInput');

  if (!promoEl || !promoInput) return;

  const code = promoInput.value.trim().toUpperCase();
  promoEl.className = 'helper-text';
  promoEl.innerText = '';

  if (!code) {
    promoEl.innerText = '';
  } else if (PROMO_CODES[code]) {
    promoEl.className = 'helper-text success';
    promoEl.innerText = `Промокод активирован: скидка ${PROMO_CODES[code]}%`;
  } else {
    promoEl.className = 'helper-text warning';
    promoEl.innerText = 'Промокод не найден.\nЗаказ будет оформлен без скидки.';
  }

  if (state.lastEdited === 'money') {
    updateFromMoney();
  } else {
    updateFromVirtual();
  }
}

function updateFromVirtual() {
  state.lastEdited = 'virtual';

  const virtualAmount = document.getElementById('virtualAmount');
  const moneyAmount = document.getElementById('moneyAmount');
  if (!virtualAmount || !moneyAmount) return;

  const result = calculateFromVirtual(virtualAmount.value);
  moneyAmount.value = result.total > 0 ? Math.round(result.total) : '';
  updateSummary(result);
}

function updateFromMoney() {
  state.lastEdited = 'money';

  const virtualAmount = document.getElementById('virtualAmount');
  const moneyAmount = document.getElementById('moneyAmount');
  if (!virtualAmount || !moneyAmount) return;

  const result = calculateFromMoney(moneyAmount.value);
  virtualAmount.value = result.virtualAmount > 0 ? Number(result.virtualAmount.toFixed(2)).toString() : '';
  updateSummary(result);
}

function sellVirts() {
  if (!state.gameKey) return;

  const game = currentGame();
  if (!game) return;

  openExternal(game.sellUrl);
}

function openSupport() {
  openExternal(SUPPORT_URL);
}

function openInfo() {
  switchScreen('info');
}

function openPrivacyPolicy() {
  switchScreen('privacy');
}

function openUserAgreement() {
  switchScreen('agreement');
}

async function buy() {
  const game = currentGame();
  const nicknameInput = document.getElementById('nickname');
  const promoInput = document.getElementById('promoInput');
  const bankAccountInput = document.getElementById('bankAccount');

  if (!game) {
    alert('Сначала выбери игру.');
    return;
  }

  if (game.autoSelectServer && !state.server) {
    state.server = game.autoSelectServer;
  }

  const nickname = nicknameInput ? nicknameInput.value.trim() : '';
  const promoCode = promoInput ? promoInput.value.trim().toUpperCase() : '';
  const bankAccount = bankAccountInput ? bankAccountInput.value.trim() : '';

  if (!state.server) {
    alert('Сначала выбери сервер.');
    return;
  }

  if (!nickname) {
    alert('Введите игровой ник.');
    return;
  }

  if (state.deliveryMethod === 'bank' && !bankAccount) {
    alert('Укажите номер игрового банковского счёта.');
    return;
  }

  if (state.deliveryMethod === 'bank' && !/^\d+$/.test(bankAccount)) {
    alert('Номер банковского счёта должен состоять только из цифр.');
    return;
  }

  if (!state.virtualAmount || state.virtualAmount <= 0) {
    alert('Введите количество валюты или сумму оплаты.');
    return;
  }

  const amountValue = Number(state.virtualAmount.toFixed(2));
  const deliveryLabel = getDeliveryMethodLabel();

  const payload = {
    game: game.name,
    server: state.server,
    nickname: nickname,
    promo: promoCode || '',
    amount_kk: amountValue,
    delivery_type: deliveryLabel,
    bank_account: state.deliveryMethod === 'bank' ? bankAccount : ''
  };

  try {
    const headers = {
      'Content-Type': 'application/json'
    };

    if (window.Telegram && Telegram.WebApp && Telegram.WebApp.initData) {
      headers['X-Telegram-Init-Data'] = Telegram.WebApp.initData;
    }

    const response = await fetch(`${BACKEND_BASE_URL}/api/create-order`, {
      method: 'POST',
      headers,
      body: JSON.stringify(payload)
    });

    const data = await response.json();

    if (!response.ok || !data.ok) {
      throw new Error(data.error || 'Не удалось создать заказ');
    }

    if (window.Telegram && Telegram.WebApp && Telegram.WebApp.openLink) {
      Telegram.WebApp.openLink(data.payment_url);
    } else {
      window.open(data.payment_url, '_blank', 'noopener,noreferrer');
    }
  } catch (error) {
    alert(`Не удалось создать заказ: ${error.message}`);
  }
}

async function checkAccess() {
  if (!(window.Telegram && Telegram.WebApp && Telegram.WebApp.initData)) {
    return;
  }

  try {
    const response = await fetch(`${BACKEND_BASE_URL}/api/access`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Telegram-Init-Data': Telegram.WebApp.initData
      },
      body: '{}'
    });

    const data = await response.json();

    if (!response.ok) {
      console.error('Access check failed', data);
      return;
    }

    if (data.allowed === false) {
      document.body.innerHTML = `
        <div class="restricted-wrap">
          <div class="restricted-card">
            <h2>Ведутся технические работы</h2>
            <p>${data.message || ACCESS_RESTRICTED_TEXT}</p>
          </div>
        </div>
      `;
    }
  } catch (e) {
    console.error('Access check error', e);
  }
}

function bootstrap() {
  injectDynamicStyles();
  ensureStandoffButton();
  initTelegram();
  applyGameUiTexts();
  setDeliveryMethod('trade');
  updateSummary({
    virtualAmount: 0,
    rate: 0,
    subtotal: 0,
    promoDiscount: 0,
    total: 0,
  });
  renderDiscounts();
  checkAccess();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', bootstrap);
} else {
  bootstrap();
}
