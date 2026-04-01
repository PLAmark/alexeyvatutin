const tg = window.Telegram.WebApp;
tg.expand();

// КЛИК ПО ИГРЕ
function selectGame(game) {
  if (game === 'gta') {
    tg.showAlert('Вы выбрали GTA 5 RP');

    // пример перехода
    window.location.href = 'gta.html';
  }

  if (game === 'br') {
    tg.showAlert('Вы выбрали Black Russia');

    window.location.href = 'br.html';
  }
}

// КОПИРОВАНИЕ ССЫЛКИ
function copyLink() {
  const link = "https://t.me/your_bot?start=ref123"; // ЗАМЕНИ НА СВОЮ

  navigator.clipboard.writeText(link)
    .then(() => {
      tg.showAlert("Ссылка скопирована!");
    })
    .catch(() => {
      alert("Ошибка копирования");
    });
}
