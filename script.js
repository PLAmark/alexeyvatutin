// =========================
// НАСТРОЙКИ
// =========================
const SUPPORT_URL = 'https://t.me/alexeyvatutin';
const SELL_MANAGER_URL = 'https://t.me/alexeyvatutin';

// Промокоды можно заменить на свои.
// Формат: КОД: размер_скидки_в_процентах
const PROMO_CODES = {
  START5: 5,
  BONUS7: 7,
  VIP10: 10
};

const blackRussiaServers = [
  'RED', 'GREEN', 'BLUE', 'YELLOW', 'ORANGE', 'PURPLE', 'LIME', 'PINK', 'CHERRY', 'BLACK',
  'INDIGO', 'WHITE', 'MAGENTA', 'CRIMSON', 'GOLD', 'AZURE', 'PLATINUM', 'AQUA', 'GRAY', 'ICE',
  'CHILLI', 'CHOCO', 'MOSCOW', 'SPB', 'UFA', 'SOCHI', 'KAZAN', 'SAMARA', 'ROSTOV', 'ANAPA',
  'EKB', 'KRASNODAR', 'ARZAMAS', 'NOVOSIB', 'GROZNY', 'SARATOV', 'OMSK', 'IRKUTSK', 'VOLGOGRAD',
  'VORONEZH', 'BELGOROD', 'MAKHACHKALA', 'VLADIKAVKAZ', 'VLADIVOSTOK', 'KALININGRAD', 'CHELYABINSK',
  'KRASNOYARSK', 'CHEBOKSARY', 'KHABAROVSK', 'PERM', 'TULA', 'RYAZAN', 'MURMANSK', 'PENZA', 'KURSK',
  'ARKHANGELSK', 'ORENBURG', 'KIROV', 'KEMEROVO', 'TYUMEN', 'TOLYATTI', 'IVANOVO', 'STAVROPOL',
  'SMOLENSK', 'PSKOV', 'BRYANSK', 'OREL', 'YAROSLAVL', 'BARNAUL', 'LIPETSK', 'ULYANOVSK', 'YAKUTSK',
  'TAMBOV', 'BRATSK', 'ASTRAKHAN', 'CHITA', 'KOSTROMA', 'VLADIMIR', 'KALUGA', 'NOVGOROD', 'TAGANROG',
  'VOLOGDA', 'TVER', 'TOMSK', 'IZHEVSK', 'SURGUT', 'PODOLSK', 'MAGADAN', 'CHEREPOVETS', 'NORILSK'
];

const gtaServers = [
  'Downtown', 'Strawberry', 'Vinewood', 'Blackberry', 'Insquad', 'Sunrise', 'Rainbow', 'Richman',
  'Eclipse', 'La Mesa', 'Burton', 'Rockford', 'Alta', 'Del Perro', 'Davis', 'Harmony', 'Redwood',
  'Hawick', 'Grapeseed', 'Murrieta', 'Vespucci', 'Milton', 'La Puerta', 'Senora'
];

const matreshkaServers = Array.from({ length: 34 }, (_, i) => `MATRESHKA MOBILE #${i + 1}`);

const blackRussiaPricing = [
  { min: 100, rate: 40 },
  { min: 10, rate: 45 },
  { min: 0, rate: 50 }
];

const matreshkaPricing = [
  { min: 100, rate: 70 },
  { min: 10, rate: 80 },
  { min: 0, rate: 100 }
];

const gtaPricing = [
  { min: 50, rate: 800 },
  { min: 10, rate: 900 },
  { min: 5, rate: 950 },
  { min: 0, rate: 1000 }
];

const games = {
  br: {
    name: 'BLACK RUSSIA',
    sellUrl: SELL_MANAGER_URL,
    servers: blackRussiaServers,
    pricing: blackRussiaPricing
  },
  mat: {
    name: 'MATRESHKA RP',
    sellUrl: SELL_MANAGER_URL,
    servers: matreshkaServers,
    pricing: matreshkaPricing
  },
  gta: {
    name: 'GTA 5 RP',
    sellUrl: SELL_MANAGER_URL,
    servers: gtaServers,
    pricing: gtaPricing
  }
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
  deliveryMethod: 'trade'
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
  document.querySelectorAll('.screen').forEach(screen => screen.classList.remove('active'));
  document.getElementById(id).classList.add('active');
}

function goHome() {
  switchScreen('home');
}

function goActions() {
  if (!state.gameKey) return goHome();
  renderActions();
  switchScreen('actions');
}

function goServers() {
  if (!state.gameKey) return goHome();
  renderServers();
  switchScreen('servers');
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

function formatVirtual(value) {
  if (!Number.isFinite(value) || value <= 0) return '0';
  return Number(value.toFixed(2)).toLocaleString('ru-RU');
}

function getDeliveryMethodLabel() {
  return state.deliveryMethod === 'bank' ? 'Банком' : 'Трейдом';
}

function sanitizeBankAccount() {
  const input = document.getElementById('bankAccount');
  input.value = input.value.replace(/[^\d]/g, '');
}

function setDeliveryMethod(method) {
  state.deliveryMethod = method === 'bank' ? 'bank' : 'trade';

  const tradeBtn = document.getElementById('deliveryTradeBtn');
  const bankBtn = document.getElementById('deliveryBankBtn');
  const bankInput = document.getElementById('bankAccount');
  const hint = document.getElementById('deliveryHint');
  const label = document.getElementById('buyDeliveryMethodText');

  tradeBtn.classList.toggle('active', state.deliveryMethod === 'trade');
  bankBtn.classList.toggle('active', state.deliveryMethod === 'bank');
  bankInput.classList.toggle('show', state.deliveryMethod === 'bank');

  if (state.deliveryMethod === 'bank') {
    hint.innerText = 'Для выдачи банком укажи номер игрового банковского счёта.';
  } else {
    bankInput.value = '';
    hint.innerText = 'Выдача будет отмечена как трейд.';
  }

  if (label) {
    label.innerText = getDeliveryMethodLabel();
  }
}

function getPromoPercent() {
  const code = document.getElementById('promoInput').value.trim().toUpperCase();
  return PROMO_CODES[code] || 0;
}

function getPricingForVirtual(amount) {
  const game = currentGame();
  if (!game || !Array.isArray(game.pricing) || !game.pricing.length) return 0;

  const pricing = game.pricing.slice().sort((a, b) => b.min - a.min);
  const selected = pricing.find(item => amount >= item.min) || pricing[pricing.length - 1];
  return selected.rate;
}

function formatKkLabel(value) {
  return Number(Number(value).toFixed(2)).toLocaleString('ru-RU');
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
    total
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

  document.getElementById('rateText').innerText = result.virtualAmount > 0
    ? `${result.rate} ₽ / 1кк`
    : '—';
  document.getElementById('subtotalText').innerText = formatMoney(result.subtotal);
  document.getElementById('promoDiscountText').innerText = formatMoney(result.promoDiscount);
  document.getElementById('totalText').innerText = formatMoney(result.total);
}

function renderDiscounts() {
  const container = document.getElementById('discountsList');
  const game = currentGame();

  if (!game || !Array.isArray(game.pricing) || !game.pricing.length) {
    container.innerHTML = '';
    return;
  }

  const pricing = game.pricing.slice().sort((a, b) => a.min - b.min);
  const lines = pricing.map((item, index) => {
    if (index === 0) {
      const nextMin = pricing[index + 1]?.min;
      const label = nextMin
        ? `до ${formatKkLabel(nextMin - 0.01)} кк`
        : 'любой объём';
      return { label, rate: item.rate };
    }

    return {
      label: `от ${formatKkLabel(item.min)} кк`,
      rate: item.rate
    };
  });

  container.innerHTML = lines
    .map(item => `
      <div class="discount-line">
        <span>${item.label}</span>
        <strong>${item.rate} ₽ / 1кк</strong>
      </div>
    `)
    .join('');
}

function resetBuyForm() {
  document.getElementById('nickname').value = '';
  document.getElementById('promoInput').value = '';
  document.getElementById('virtualAmount').value = '';
  document.getElementById('moneyAmount').value = '';
  document.getElementById('bankAccount').value = '';
  document.getElementById('promoStatus').className = 'helper-text';
  document.getElementById('promoStatus').innerText = '';
  state.lastEdited = 'virtual';
  setDeliveryMethod('trade');
  updateSummary(calculateFromVirtual(0));
  renderDiscounts();
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
  document.getElementById('actionsTitle').innerText = game.name;
  document.getElementById('actionsGameBadge').innerText = game.name;
}

function openBuyFlow() {
  if (!state.gameKey) return;
  renderServers();
  switchScreen('servers');
}

function renderServers(filteredList) {
  const game = currentGame();
  if (!filteredList) {
    document.getElementById('serverSearch').value = '';
  }
  const list = filteredList || game.servers;
  document.getElementById('serversGameBadge').innerText = game.name;

  const container = document.getElementById('serversContainer');
  container.innerHTML = '';

  if (!list.length) {
    container.innerHTML = '<p class="muted-center">Ничего не найдено по этому запросу.</p>';
    return;
  }

  list.forEach(name => {
    const button = document.createElement('button');
    button.className = 'btn server-btn';
    button.innerHTML = `<strong>${name}</strong><small>Нажми, чтобы перейти к оформлению</small>`;
    button.onclick = () => selectServer(name);
    container.appendChild(button);
  });
}

function filterServers() {
  const value = document.getElementById('serverSearch').value.trim().toLowerCase();
  const game = currentGame();
  const filtered = game.servers.filter(server => server.toLowerCase().includes(value));
  renderServers(filtered);
}

function selectServer(serverName) {
  state.server = serverName;
  document.getElementById('buyGameName').innerText = currentGame().name;
  document.getElementById('buyServerName').innerText = serverName;
  document.getElementById('buyDeliveryMethodText').innerText = getDeliveryMethodLabel();
  renderDiscounts();
  switchScreen('buy');
}

function handlePromoInput() {
  const promoEl = document.getElementById('promoStatus');
  const code = document.getElementById('promoInput').value.trim().toUpperCase();

  promoEl.className = 'helper-text';
  promoEl.innerText = '';

  if (!code) {
    promoEl.innerText = '';
  } else if (PROMO_CODES[code]) {
    promoEl.className = 'helper-text success';
    promoEl.innerText = `Промокод активирован: скидка ${PROMO_CODES[code]}%`;
  } else {
    promoEl.className = 'helper-text warning';
    promoEl.innerText = 'Промокод не найден. Заказ будет оформлен без скидки.';
  }

  if (state.lastEdited === 'money') {
    updateFromMoney();
  } else {
    updateFromVirtual();
  }
}

function updateFromVirtual() {
  state.lastEdited = 'virtual';
  const virtualValue = document.getElementById('virtualAmount').value;
  const result = calculateFromVirtual(virtualValue);
  document.getElementById('moneyAmount').value = result.total > 0 ? Math.round(result.total) : '';
  updateSummary(result);
}

function updateFromMoney() {
  state.lastEdited = 'money';
  const moneyValue = document.getElementById('moneyAmount').value;
  const result = calculateFromMoney(moneyValue);
  document.getElementById('virtualAmount').value = result.virtualAmount > 0 ? Number(result.virtualAmount.toFixed(2)).toString() : '';
  updateSummary(result);
}

function sellVirts() {
  if (!state.gameKey) return;
  openExternal(currentGame().sellUrl);
}

function openSupport() {
  openExternal(SUPPORT_URL);
}

function openInfo() {
  switchScreen('info');
}

function buy() {
  const nickname = document.getElementById('nickname').value.trim();
  const promoCode = document.getElementById('promoInput').value.trim().toUpperCase();
  const bankAccount = document.getElementById('bankAccount').value.trim();

  if (!state.gameKey) return alert('Сначала выбери игру.');
  if (!state.server) return alert('Сначала выбери сервер.');
  if (!nickname) return alert('Введите игровой ник.');
  if (state.deliveryMethod === 'bank' && !bankAccount) return alert('Укажите номер игрового банковского счёта.');
  if (state.deliveryMethod === 'bank' && !/^\d+$/.test(bankAccount)) return alert('Номер банковского счёта должен состоять только из цифр.');
  if (!state.virtualAmount || state.virtualAmount <= 0) return alert('Введите количество виртов или сумму оплаты.');

  const payload = {
    type: 'buy_order',
    game: currentGame().name,
    server: state.server,
    nickname,
    deliveryMethod: state.deliveryMethod,
    deliveryMethodLabel: getDeliveryMethodLabel(),
    bankAccount: state.deliveryMethod === 'bank' ? bankAccount : null,
    promoCode: promoCode || null,
    virtualAmountKK: Number(state.virtualAmount.toFixed(2)),
    ratePerKK: state.currentRate,
    subtotalRub: Math.round(state.subtotal),
    promoDiscountRub: Math.round(state.promoDiscount),
    totalRub: Math.round(state.total)
  };

  if (window.Telegram && Telegram.WebApp && Telegram.WebApp.sendData) {
    Telegram.WebApp.sendData(JSON.stringify(payload));
    alert('Заявка отправлена в бота.');
    return;
  }

  alert(
    `Заявка сформирована:\n\n` +
    `Игра: ${payload.game}\n` +
    `Сервер: ${payload.server}\n` +
    `Ник: ${payload.nickname}\n` +
    `Получение: ${payload.deliveryMethodLabel}\n` +
    `${payload.bankAccount ? `Счёт: ${payload.bankAccount}\n` : ''}` +
    `Количество: ${payload.virtualAmountKK} кк\n` +
    `К оплате: ${payload.totalRub} ₽`
  );
}

initTelegram();
setDeliveryMethod('trade');
updateSummary({
  virtualAmount: 0,
  rate: 0,
  subtotal: 0,
  promoDiscount: 0,
  total: 0
});
