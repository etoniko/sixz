(function () {
  'use strict';

  var current = 'login';
  var moveStep = 0;

  var screens = {
    login: document.getElementById('screen-login'),
    welcome: document.getElementById('screen-welcome'),
    menu: document.getElementById('screen-menu'),
    priemka: document.getElementById('screen-priemka'),
    move: document.getElementById('screen-move'),
    journal: document.getElementById('screen-journal'),
    labels: document.getElementById('screen-labels')
  };

  var toastEl = document.getElementById('toast');
  var overlay = document.getElementById('overlay');
  var badgeInp = document.getElementById('badge-inp');
  var badgeArea = document.getElementById('badge-area');
  var welcomeMsg = document.getElementById('welcome-msg');
  var moveBody = document.getElementById('move-body');
  var priemkaInp = document.getElementById('priemka-inp');

  var PRODUCTS = [
    { name: 'Сапборд Motiways', code: 'CH25092507 (400000006342)', ean: '...6955', qty: '1.000' },
    { name: 'Беговел детский Playokay', code: 'ZY251230-9P', ean: '(400000006513) ...7969', qty: '7.000' }
  ];

  var MOVE = [
    'Отсканируйте ШК исходного места',
    'Отсканируйте ШК товара',
    'Отсканируйте ШК целевого места'
  ];

  var toastTimer;

  function toast(msg) {
    toastEl.textContent = msg;
    toastEl.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { toastEl.classList.remove('show'); }, 2500);
  }

  function show(name) {
    if (!screens[name]) return;
    if (screens[current]) screens[current].classList.remove('active');
    current = name;
    screens[name].classList.add('active');

    if (name === 'login') {
      badgeInp.value = '';
      badgeArea.classList.remove('active');
    }
    if (name === 'priemka') {
      setTimeout(function () { priemkaInp.focus(); }, 100);
    }
    if (name === 'move') {
      moveStep = 0;
      renderMove();
    }
  }

  function greeting() {
    var h = new Date().getHours();
    if (h < 12) return 'Доброе утро';
    if (h < 18) return 'Добрый день';
    return 'Добрый вечер';
  }

  function doLogin() {
    var val = badgeInp.value.trim();
    var name = val ? val.replace(/^BADGE/i, '').trim() : 'Daraseliya. N';
    if (!name) name = 'Daraseliya. N';
    welcomeMsg.textContent = greeting() + ', ' + name;
    show('welcome');
    toast('Вход выполнен');
  }

  function renderMove() {
    var ph = MOVE[moveStep] || MOVE[0];
    var html = '<label class="field-box"><input type="text" class="field-inp move-inp" placeholder="' + ph + '" autocomplete="off" id="move-inp"></label>';

    if (moveStep >= 1) {
      html += '<div class="move-meta"><p>ГЕ №217384</p><p>Место: 07-44-02-10</p></div>';
      html += PRODUCTS.map(function (p) {
        return '<div class="prod-card"><b>' + p.name + '</b><span class="q">' + p.qty + '</span><span class="c">' + p.code + '</span><span class="e">' + p.ean + '</span></div>';
      }).join('');
    }

    if (moveStep >= 1) {
      html += '<button type="button" class="btn-fill-green" id="move-all">Переместить ГЕ целиком</button>';
    }

    moveBody.innerHTML = html;

    var inp = document.getElementById('move-inp');
    var btnAll = document.getElementById('move-all');

    if (inp) {
      setTimeout(function () { inp.focus(); }, 80);
      inp.addEventListener('keydown', onMoveKey);
      inp.addEventListener('blur', function () {
        if (inp.value.trim() && moveStep < 2) return;
      });
    }

    if (btnAll) {
      btnAll.addEventListener('click', function () {
        toast('ГЕ перемещён');
        show('menu');
      });
    }
  }

  function onMoveKey(e) {
    if (e.key !== 'Enter') return;
    var inp = document.getElementById('move-inp');
    if (!inp || !inp.value.trim()) {
      toast('Введите или отсканируйте код');
      return;
    }
    e.preventDefault();
    toast('Скан: ' + inp.value.trim());

    if (moveStep >= 2) {
      toast('Перемещение завершено');
      setTimeout(function () { show('menu'); }, 600);
      return;
    }

    moveStep++;
    renderMove();
  }

  /* === Кнопки входа === */
  document.getElementById('btn-enter').addEventListener('click', doLogin);
  document.getElementById('btn-welcome-ok').addEventListener('click', function () {
    show('menu');
  });

  badgeArea.addEventListener('click', function () {
    badgeArea.classList.add('active');
    badgeInp.focus();
  });

  badgeInp.addEventListener('keydown', function (e) {
    if (e.key === 'Enter') {
      e.preventDefault();
      doLogin();
    }
  });

  document.getElementById('btn-scanner').addEventListener('click', function () {
    badgeArea.classList.add('active');
    badgeInp.focus();
    toast('Сканируйте бейдж или нажмите ВОЙТИ');
  });

  /* === Навигация по меню (делегирование) === */
  document.getElementById('phone').addEventListener('click', function (e) {
    var row = e.target.closest('.menu-row');
    if (row && row.dataset.screen) {
      show(row.dataset.screen);
      toast('Открыто');
      return;
    }

    var back = e.target.closest('.btn-back');
    if (back && back.dataset.screen) {
      show(back.dataset.screen);
      return;
    }

    var foot = e.target.closest('[data-toast]');
    if (foot) toast(foot.getAttribute('data-toast'));
  });

  document.getElementById('btn-logout-login').addEventListener('click', function () {
    toast('Выход');
    show('login');
  });

  document.getElementById('btn-logout-menu').addEventListener('click', function () {
    toast('Выход');
    show('login');
  });

  /* Приёмка */
  document.getElementById('btn-euro').addEventListener('click', function () {
    toast('Евро поддон');
  });

  document.getElementById('btn-company').addEventListener('click', function () {
    toast('Компания');
  });

  priemkaInp.addEventListener('keydown', function (e) {
    if (e.key === 'Enter' && priemkaInp.value.trim()) {
      toast('ГЕ: ' + priemkaInp.value.trim());
      priemkaInp.value = '';
    }
  });

  /* Меню кнопки */
  document.getElementById('btn-screensaver').addEventListener('click', function () {
    overlay.classList.add('show');
  });

  overlay.addEventListener('click', function () {
    overlay.classList.remove('show');
  });

  document.getElementById('btn-wifi').addEventListener('click', function () {
    toast('WiFi: складская сеть');
  });

  document.getElementById('btn-scanner-menu').addEventListener('click', function () {
    toast('Сканер активен');
    if (current === 'priemka') priemkaInp.focus();
    else if (current === 'move') {
      var mi = document.getElementById('move-inp');
      if (mi) mi.focus();
    }
  });

  document.getElementById('btn-print').addEventListener('click', function () {
    var li = document.getElementById('labels-inp');
    toast(li && li.value.trim() ? 'Печать: ' + li.value.trim() : 'Печать этикетки');
  });

  document.getElementById('labels-inp').addEventListener('keydown', function (e) {
    if (e.key === 'Enter' && e.target.value.trim()) {
      toast('Печать: ' + e.target.value.trim());
    }
  });

  /* Старт */
  show('login');
  setTimeout(function () { badgeInp.focus(); }, 300);
})();
