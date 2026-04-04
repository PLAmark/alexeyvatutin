// ===== СОСТОЯНИЕ =====
let game = '';
let server = '';
let amount = 0;

// ===== ДАННЫЕ =====
const brColors = ["RED","GREEN","BLUE","YELLOW","ORANGE","PURPLE","LIME","PINK","CHERRY","BLACK","INDIGO","WHITE","MAGENTA","CRIMSON","GOLD","AZURE","PLATINUM","AQUA","GRAY","ICE"];

const brCities = ["CHILLI","CHOCO","MOSCOW","SPB","UFA","SOCHI","KAZAN","SAMARA","ROSTOV","ANAPA","EKB","KRASNODAR","ARZAMAS","NOVOSIB","GROZNY","SARATOV","OMSK","IRKUTSK","VOLGOGRAD","VORONEZH","BELGOROD","MAKHACHKALA","VLADIKAVKAZ","VLADIVOSTOK","KALININGRAD","CHELYABINSK","KRASNOYARSK","CHEBOKSARY","KHABAROVSK","PERM","TULA","RYAZAN","MURMANSK","PENZA","KURSK","ARKHANGELSK","ORENBURG","KIROV","KEMEROVO","TYUMEN","TOLYATTI","IVANOVO","STAVROPOL","SMOLENSK","PSKOV","BRYANSK","OREL","YAROSLAVL","BARNAUL","LIPETSK","ULYANOVSK","YAKUTSK","TAMBOV","BRATSK","ASTRAKHAN","CHITA","KOSTROMA","VLADIMIR","KALUGA","NOVGOROD","TAGANROG","VOLOGDA","TVER","TOMSK","IZHEVSK","SURGUT","PODOLSK","MAGADAN","CHEREPOVETS","NORILSK"];

// ===== НАВИГАЦИЯ =====
function switchScreen(id) {
  document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
  document.getElementById(id).classList.add('active');
}

function goHome() { switchScreen('home'); }
function goServers() { switchScreen('servers'); }

// ===== МОДАЛКА =====
function openServers(g) {
  game = g;

  document.getElementById('modal').style.display = 'flex';

  document.getElementById('modalGame').innerText =
    g === 'gta' ? 'GTA 5 RP' : 'BLACK RUSSIA';
}

function closeModal() {
  document.getElementById('modal').style.display = 'none';
}

function chooseAction(type) {
  closeModal();

  if (type === 'buy') {
    switchScreen('servers');
    loadServers();
  }

  if (type === 'sell') {
    alert('Продажа скоро будет доступна');
  }
}

// ===== СЕРВЕРА =====
function loadServers() {
  const el = document.getElementById('serversList');

  el.innerHTML = `
    <input id="search" placeholder="Поиск сервера..." oninput="filterServers()">
    <div id="serversContainer"></div>
  `;

  let list = game === 'gta'
    ? ['Downtown','Strawberry','Vinewood']
    : [...brColors, ...brCities];

  renderServers(list);
}

function renderServers(list) {
  const container = document.getElementById('serversContainer');
  container.innerHTML = '';

  list.forEach(name => {
    let div = document.createElement('div');
    div.className = 'btn server-btn';
    div.innerText = name;

    div.onclick = () => openBuy(name);

    container.appendChild(div);
  });
}

function filterServers() {
  const value = document.getElementById('search').value.toLowerCase();

  let all = game === 'gta'
    ? ['Downtown','Strawberry','Vinewood']
    : [...brColors, ...brCities];

  renderServers(all.filter(s => s.toLowerCase().includes(value)));
}

// ===== ПОКУПКА =====
function openBuy(s) {
  server = s;
  switchScreen('buy');
}

// ===== ЦЕНА =====
function updatePrice() {
  const val = parseInt(document.getElementById('amountInput').value) || 0;

  let base = val * 50;
  let per = 50;

  if (val >= 100) per = 35;
  else if (val >= 50) per = 40;
  else if (val >= 10) per = 45;

  let total = val * per;

  document.getElementById('priceText').innerText =
    `Цена: ${total} ₽ (${per}₽/кк)`;

  document.getElementById('oldPrice').innerText =
    per !== 50 ? `Без скидки: ${base} ₽` : '';

  amount = total;
}

// ===== ПОКУПКА =====
function buy() {
  let nick = document.getElementById('nickname').value;
  let millions = document.getElementById('amountInput').value;

  if (!nick) return alert('Введите ник');
  if (!millions) return alert('Введите количество');

  alert(`Заказ оформлен`);
}

// ===== ПРОЧЕЕ =====
function openSupport() {
  window.open("https://t.me/your_support");
}

function openInfo() {
  switchScreen('info');
}
