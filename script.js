<script>
// ===== СОСТОЯНИЕ =====
let game = '';
let server = '';
let amount = 0;

// ===== ДАННЫЕ BLACK RUSSIA =====
const brColors = [
"RED","GREEN","BLUE","YELLOW","ORANGE","PURPLE","LIME","PINK",
"CHERRY","BLACK","INDIGO","WHITE","MAGENTA","CRIMSON","GOLD",
"AZURE","PLATINUM","AQUA","GRAY","ICE"
];

const brCities = [
"CHILLI","CHOCO","MOSCOW","SPB","UFA","SOCHI","KAZAN","SAMARA",
"ROSTOV","ANAPA","EKB","KRASNODAR","ARZAMAS","NOVOSIB","GROZNY",
"SARATOV","OMSK","IRKUTSK","VOLGOGRAD","VORONEZH","BELGOROD",
"MAKHACHKALA","VLADIKAVKAZ","VLADIVOSTOK","KALININGRAD",
"CHELYABINSK","KRASNOYARSK","CHEBOKSARY","KHABAROVSK","PERM",
"TULA","RYAZAN","MURMANSK","PENZA","KURSK","ARKHANGELSK",
"ORENBURG","KIROV","KEMEROVO","TYUMEN","TOLYATTI","IVANOVO",
"STAVROPOL","SMOLENSK","PSKOV","BRYANSK","OREL","YAROSLAVL",
"BARNAUL","LIPETSK","ULYANOVSK","YAKUTSK","TAMBOV","BRATSK",
"ASTRAKHAN","CHITA","KOSTROMA","VLADIMIR","KALUGA","NOVGOROD",
"TAGANROG","VOLOGDA","TVER","TOMSK","IZHEVSK","SURGUT",
"PODOLSK","MAGADAN","CHEREPOVETS","NORILSK"
];

// ===== ПЕРЕКЛЮЧЕНИЕ ЭКРАНОВ =====
function switchScreen(id) {
  document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
  document.getElementById(id).classList.add('active');
}

function goHome() { switchScreen('home'); }
function goServers() { switchScreen('servers'); }

// ===== ОТКРЫТЬ СЕРВЕРА =====
function openServers(g) {
  game = g;
  switchScreen('servers');
  loadServers();
}

// ===== ЗАГРУЗКА СЕРВЕРОВ =====
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

// ===== ОТРИСОВКА =====
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

// ===== ПОИСК =====
function filterServers() {
  const value = document.getElementById('search').value.toLowerCase();

  let all = game === 'gta'
    ? ['Downtown','Strawberry','Vinewood']
    : [...brColors, ...brCities];

  const filtered = all.filter(s => s.toLowerCase().includes(value));

  renderServers(filtered);
}

// ===== ПОКУПКА =====
function openBuy(s) {
  server = s;
  switchScreen('buy');
  loadAmounts();
}

// ===== СУММЫ =====
function loadAmounts() {
  const el = document.getElementById('amounts');
  el.innerHTML = '';

  let prices = [100, 300, 500, 1000];

  prices.forEach(p => {
    let div = document.createElement('div');
    div.className = 'btn';
    div.innerText = p + ' ₽';

    div.onclick = () => {
      amount = p;
      alert('Выбрано: ' + p + ' ₽');
    };

    el.appendChild(div);
  });
}

// ===== ПОКУПКА =====
function buy() {
  let nick = document.getElementById('nickname').value;

  if (!nick) return alert('Введите ник');
  if (!amount) return alert('Выберите сумму');

  alert(`Покупка:\nИгра: ${game}\nСервер: ${server}\nНик: ${nick}\nСумма: ${amount}₽`);

  // 👉 ВСТАВЬ СВОЮ ССЫЛКУ ОПЛАТЫ НИЖЕ
  // window.location.href = "https://your-payment-link";
}
</script>
