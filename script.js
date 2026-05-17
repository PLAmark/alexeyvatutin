// =========================
// НАСТРОЙКИ & ДАННЫЕ
// =========================
const SUPPORT_URL = 'https://t.me/alexeyvatutin';
const SELL_MANAGER_URL = 'https://t.me/alexeyvatutin';
const BACKEND_BASE_URL = 'https://api.alexeyvatutin.com';

const PROMO_CODES = { START5: 5, BONUS7: 7, VIP10: 10 };

const blackRussiaServers = [
  'RED', 'GREEN', 'BLUE', 'YELLOW', 'ORANGE', 'PURPLE', 'LIME', 'PINK', 'CHERRY', 'BLACK',
  'INDIGO', 'WHITE', 'MAGENTA', 'CRIMSON', 'GOLD', 'AZURE', 'PLATINUM', 'AQUA', 'GRAY', 'ICE',
  'CHILLI', 'CHOCO', 'MOSCOW', 'SPB', 'UFA', 'SOCHI', 'KAZAN', 'SAMARA', 'ROSTOV', 'ANAPA'
];
const gtaServers = ['Downtown', 'Strawberry', 'Vinewood', 'Blackberry', 'Insquad', 'Sunrise', 'Rainbow', 'Richman', 'Eclipse', 'La Mesa'];
const matreshkaServers = Array.from({ length: 20 }, (_, i) => `SERVER #${i + 1}`);

const games = {
  br: {
    name: 'BLACK RUSSIA', sellUrl: SELL_MANAGER_URL, servers: blackRussiaServers,
    pricing: [{ min: 100, rate: 40 }, { min: 10, rate: 45 }, { min: 0, rate: 50 }],
    color: '#e63946', rateSuffix: '₽ / 1кк', amountLabel: 'Валюта (кк)'
  },
  mat: {
    name: 'MATRESHKA RP', sellUrl: SELL_MANAGER_URL, servers: matreshkaServers,
    pricing: [{ min: 100, rate: 70 }, { min: 10, rate: 80 }, { min: 0, rate: 100 }],
    color: '#8a2be2', rateSuffix: '₽ / 1кк', amountLabel: 'Валюта (кк)'
  },
  gta: {
    name: 'GTA 5 RP', sellUrl: SELL_MANAGER_URL, servers: gtaServers,
    pricing: [{ min: 50, rate: 800 }, { min: 10, rate: 900 }, { min: 0, rate: 1000 }],
    color: '#f5a623', rateSuffix: '₽ / 1кк', amountLabel: 'Валюта (кк)'
  },
  so2: {
    name: 'STANDOFF 2', sellUrl: SELL_MANAGER_URL, servers: ['STANDOFF 2'],
    pricing: [{ min: 0, rate: 0.55 }],
    color: '#5c6bc0', rateSuffix: '₽ / 1г', amountLabel: 'Голда', autoServer: 'STANDOFF 2'
  }
};

const state = {
  gameKey: '', server: '', lastEdited: 'virtual', currentRate: 0,
  subtotal: 0, promoDiscount: 0, total: 0, virtualAmount: 0, deliveryMethod: 'trade'
};

// =========================
// НАВИГАЦИЯ & UI
// =========================
function switchScreen(id) {
  document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
  document.getElementById(id).classList.add('active');
  window.scrollTo(0, 0);
}

function goHome() { 
  document.documentElement.style.setProperty('--accent-game', '#4da6ff');
  document.getElementById('ambientGlow').style.opacity = '0.08';
  switchScreen('home'); 
}

function selectGame(key) {
  state.gameKey = key;
  state.server = '';
  const game = games[key];
  
  // Set glow color
  document.documentElement.style.setProperty('--accent-game', game.color);
  document.getElementById('ambientGlow').style.opacity = '0.15';

  document.getElementById('actionsTitle').innerText = game.name;
  document.getElementById('actionsGameBadge').innerText = game.name;
  
  resetBuyForm();
  switchScreen('actions');
}

function goActions() { switchScreen('actions'); }
function goServers() { switchScreen('servers'); }

function openBuyFlow() {
  const game = games[state.gameKey];
  if (game.autoServer) {
    selectServer(game.autoServer);
  } else {
    document.getElementById('serversGameBadge').innerText = game.name;
    renderServers(game.servers);
    switchScreen('servers');
  }
}

// =========================
// ВЫБОР СЕРВЕРА
// =========================
function generateFakeOnline(str) {
  // Generate consistent pseudo-random number based on string length and chars
  let hash = 0;
  for (let i = 0; i < str.length; i++) { hash = str.charCodeAt(i) + ((hash << 5) - hash); }
  return 800 + (Math.abs(hash) % 200);
}

function renderServers(list) {
  const container = document.getElementById('serversContainer');
  container.innerHTML = '';
  
  if (!list.length) {
    container.innerHTML = '<div class="text-center text-sm mt-4">Ничего не найдено</div>';
    return;
  }

  list.forEach(name => {
    const online = generateFakeOnline(name);
    const div = document.createElement('div');
    div.className = 'server-card';
    div.innerHTML = `
      <span class="server-name">${name}</span>
      <div class="online-badge"><i class="dot"></i>${online}</div>
    `;
    div.onclick = () => selectServer(name);
    container.appendChild(div);
  });
}

function filterServers() {
  const q = document.getElementById('serverSearch').value.toLowerCase();
  const filtered = games[state.gameKey].servers.filter(s => s.toLowerCase().includes(q));
  renderServers(filtered);
}

// =========================
// ОФОРМЛЕНИЕ ЗАКАЗА
// =========================
function selectServer(serverName) {
  state.server = serverName;
  const game = games[state.gameKey];
  
  document.getElementById('buyGameName').innerText = game.name;
  document.getElementById('buyServerName').innerText = serverName;
  document.querySelector('label[for="virtualAmount"]').innerText = game.amountLabel;
  
  setDeliveryMethod('trade');
  renderDiscounts();
  switchScreen('buy');
}

function setDeliveryMethod(method) {
  state.deliveryMethod = method;
  document.getElementById('deliveryTradeBtn').classList.toggle('active', method === 'trade');
  document.getElementById('deliveryBankBtn').classList.toggle('active', method === 'bank');
  document.getElementById('bankAccountWrap').style.display = method === 'bank' ? 'block' : 'none';
  document.getElementById('buyDeliveryMethodText').innerText = method === 'bank' ? 'Банком' : 'Трейдом';
  document.getElementById('deliveryHint').innerText = method === 'bank' ? 'Укажите счет в игре.' : 'Выдача будет отмечена как трейд.';
}

function sanitizeBankAccount() {
  const input = document.getElementById('bankAccount');
  input.value = input.value.replace(/[^\d]/g, '');
}

// =========================
// КАЛЬКУЛЯТОР & ТАРИФЫ
// =========================
function renderDiscounts() {
  const game = games[state.gameKey];
  const container = document.getElementById('discountsList');
  container.innerHTML = game.pricing.slice().sort((a,b)=>a.min-b.min).map((p, i, arr) => {
    const label = i===0 ? (arr.length>1 ? `До ${arr[1].min} кк` : 'Любой объем') : `От ${p.min} кк`;
    return `<div class="discount-row"><span>${label}</span><span>${p.rate} ${game.rateSuffix}</span></div>`;
  }).join('');
}

function getPromoPercent() {
  const code = document.getElementById('promoInput').value.trim().toUpperCase();
  return PROMO_CODES[code] || 0;
}

function handlePromoInput() {
  const code = document.getElementById('promoInput').value.trim().toUpperCase();
  const status = document.getElementById('promoStatus');
  
  if (!code) { status.innerText = ''; status.className = 'input-hint mt-1'; }
  else if (PROMO_CODES[code]) { status.innerText = `Применена скидка ${PROMO_CODES[code]}%`; status.className = 'input-hint mt-1 success'; }
  else { status.innerText = 'Промокод не найден'; status.className = 'input-hint mt-1 error'; }
  
  state.lastEdited === 'money' ? updateFromMoney() : updateFromVirtual();
}

function getRate(amount) {
  const pricing = games[state.gameKey].pricing.slice().sort((a,b)=>b.min-a.min);
  const tier = pricing.find(p => amount >= p.min) || pricing[pricing.length-1];
  return tier.rate;
}

function updateFromVirtual() {
  state.lastEdited = 'virtual';
  const vAmount = Math.max(0, Number(document.getElementById('virtualAmount').value) || 0);
  const rate = getRate(vAmount);
  const subtotal = vAmount * rate;
  const discount = subtotal * (getPromoPercent() / 100);
  const total = Math.max(0, subtotal - discount);
  
  document.getElementById('moneyAmount').value = total > 0 ? Math.round(total) : '';
  updateTotals(subtotal, discount, total);
}

function updateFromMoney() {
  state.lastEdited = 'money';
  const mAmount = Math.max(0, Number(document.getElementById('moneyAmount').value) || 0);
  const discount = getPromoPercent();
  const pricing = games[state.gameKey].pricing.slice().sort((a,b)=>b.min-a.min);
  
  let vAmount = 0;
  for (const tier of pricing) {
    const effRate = tier.rate * (1 - discount/100);
    if(effRate <= 0) continue;
    let tempV = mAmount / effRate;
    if (tempV >= tier.min) { vAmount = tempV; break; }
  }
  
  const subtotal = vAmount * getRate(vAmount);
  const discAmt = subtotal * (discount / 100);
  document.getElementById('virtualAmount').value = vAmount > 0 ? Number(vAmount.toFixed(2)) : '';
  updateTotals(subtotal, discAmt, mAmount);
}

function updateTotals(sub, disc, tot) {
  state.virtualAmount = Number(document.getElementById('virtualAmount').value);
  document.getElementById('subtotalText').innerText = `${Math.round(sub).toLocaleString('ru-RU')} ₽`;
  document.getElementById('promoDiscountText').innerText = `${Math.round(disc).toLocaleString('ru-RU')} ₽`;
  document.getElementById('totalText').innerText = `${Math.round(tot).toLocaleString('ru-RU')} ₽`;
}

function resetBuyForm() {
  document.getElementById('nickname').value = '';
  document.getElementById('promoInput').value = '';
  document.getElementById('virtualAmount').value = '';
  document.getElementById('moneyAmount').value = '';
  document.getElementById('bankAccount').value = '';
  document.getElementById('promoStatus').innerText = '';
  updateTotals(0,0,0);
}

// =========================
// ВНЕШНИЕ ССЫЛКИ & API
// =========================
function openExternal(url) {
  if (window.Telegram && Telegram.WebApp && Telegram.WebApp.openLink) Telegram.WebApp.openLink(url);
  else window.open(url, '_blank');
}
function sellVirts() { openExternal(games[state.gameKey].sellUrl); }
function openSupport() { openExternal(SUPPORT_URL); }

// Инфо-экраны
function openOrderGuide() { switchScreen('orderGuide'); }
function openDeliveryInfo() { switchScreen('deliveryInfo'); }
function openRefundInfo() { switchScreen('refundInfo'); }
function openInfo() { switchScreen('info'); }

async function buy() {
  const nick = document.getElementById('nickname').value.trim();
  if (!nick) return alert('Введите игровой ник');
  if (state.deliveryMethod === 'bank' && !document.getElementById('bankAccount').value.trim()) return alert('Укажите счет');
  if (!state.virtualAmount || state.virtualAmount <= 0) return alert('Введите сумму');
  
  // В реальном проекте здесь будет отправка данных на BACKEND_BASE_URL
  alert(`Заказ оформлен!\nИгра: ${games[state.gameKey].name}\nСервер: ${state.server}\nНик: ${nick}\nСумма: ${document.getElementById('totalText').innerText}`);
}

// Init Telegram
if (window.Telegram && Telegram.WebApp) {
  Telegram.WebApp.ready();
  Telegram.WebApp.expand();
}
