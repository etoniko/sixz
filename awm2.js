(function () {
  'use strict';

  var screens = document.querySelectorAll('.screen');
  var toastEl = document.getElementById('toast');
  var navBtns = document.querySelectorAll('.nav button');
  var fabTasks = document.getElementById('fab-tasks');
  var hiddenScan = document.getElementById('hidden-scan');

  var multiMode = 'close';
  var geAccepted = false;
  var geItems = 0;
  var toastTimer;

  function toast(msg) {
    toastEl.textContent = msg;
    toastEl.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { toastEl.classList.remove('show'); }, 2400);
  }

  function showScreen(id) {
    screens.forEach(function (s) {
      s.classList.toggle('on', s.id === id);
    });
    navBtns.forEach(function (b) {
      b.classList.toggle('on', b.dataset.nav === id);
    });
    fabTasks.classList.toggle('show', id === 'screen-ge' || id === 'screen-multi');
    focusScan();
  }

  function focusScan() {
    if (hiddenScan) {
      hiddenScan.value = '';
      setTimeout(function () { hiddenScan.focus(); }, 80);
    }
  }

  navBtns.forEach(function (btn) {
    btn.addEventListener('click', function () {
      showScreen(btn.dataset.nav);
    });
  });

  document.querySelectorAll('[data-go]').forEach(function (el) {
    el.addEventListener('click', function () {
      showScreen(el.dataset.go);
      if (el.dataset.toast) toast(el.dataset.toast);
    });
  });

  /* Multi tabs */
  document.querySelectorAll('.mode-tabs button').forEach(function (btn) {
    btn.addEventListener('click', function () {
      multiMode = btn.dataset.mode;
      document.querySelectorAll('.mode-tabs button').forEach(function (b) {
        b.classList.toggle('on', b === btn);
      });
      updateMultiPreview();
    });
  });

  function updateMultiPreview() {
    var from = parseInt(document.getElementById('ge-from').value, 10) || 37400;
    var to = parseInt(document.getElementById('ge-to').value, 10) || 37470;
    var prev = document.getElementById('multi-preview');
    var titles = {
      close: 'Закрыть пустые ГЕ',
      bind: 'Привязать к 0-0-1',
      product: 'Привязать товар на ГЕ'
    };
    var lines = {
      close: 'Пустых к закрытию: <strong>48</strong> · с товаром (пропуск): 2',
      bind: 'Привязка <strong>' + (to - from + 1) + '</strong> ГЕ → место <strong>0-0-1</strong>',
      product: 'Стул PLAYOKAY · 10 шт/ГЕ · всего <strong>700</strong> шт'
    };
    document.getElementById('btn-multi-run').textContent =
      multiMode === 'close' ? 'ЗАКРЫТЬ ' + Math.max(0, to - from + 1) + ' ГЕ' :
      multiMode === 'bind' ? 'ПРИВЯЗАТЬ ' + (to - from + 1) + ' ГЕ' :
      'ПРИВЯЗАТЬ К ' + (to - from + 1) + ' ГЕ';

    prev.innerHTML = '<div style="margin-bottom:4px;font-weight:700;color:#7acc00">' + titles[multiMode] + '</div>' + lines[multiMode];
  }

  ['ge-from', 'ge-to'].forEach(function (id) {
    var el = document.getElementById(id);
    if (el) el.addEventListener('input', updateMultiPreview);
  });

  document.getElementById('btn-multi-run').addEventListener('click', function () {
    var ok = document.getElementById('chk-verify').checked;
    if (!ok) {
      toast('Отметьте «Цифры проверены»');
      return;
    }
    toast('Готово · мульти-операция выполнена');
    showScreen('screen-home');
  });

  /* Priemka GE */
  document.getElementById('btn-add-item').addEventListener('click', function () {
    geItems += 10;
    document.getElementById('ge-count').textContent = geItems;
    document.getElementById('ge-bar').style.width = Math.min(100, (geItems / 10) * 100) + '%';
    if (geItems >= 10) {
      geAccepted = true;
      var b = document.getElementById('btn-ge-done');
      b.classList.remove('btn-ge--idle');
      b.classList.add('btn-ge--ready');
      b.innerHTML = '<span class="material-symbols-outlined">check_circle</span> ГЕ ПРИНЯТА ✓';
      toast('Товар принят — можно закрыть ГЕ');
    }
  });

  document.getElementById('btn-ge-done').addEventListener('click', function () {
    if (!geAccepted) {
      toast('Сначала примите товар (+10 шт)');
      return;
    }
    toast('ГЕ №37442 закрыта');
    showScreen('screen-home');
  });

  /* Tasks — debounce click */
  var scrollLock = false;
  var taskList = document.getElementById('task-scroll');
  if (taskList) {
    taskList.addEventListener('scroll', function () {
      scrollLock = true;
      clearTimeout(taskList._t);
      taskList._t = setTimeout(function () { scrollLock = false; }, 350);
    });
  }

  document.querySelectorAll('.task-item').forEach(function (item) {
    item.addEventListener('click', function () {
      if (scrollLock) {
        toast('Подождите — скролл…');
        return;
      }
      toast('Задание: ' + item.dataset.task);
      if (item.dataset.go) showScreen(item.dataset.go);
    });
  });

  document.querySelectorAll('.chip').forEach(function (chip) {
    chip.addEventListener('click', function () {
      document.querySelectorAll('.chip').forEach(function (c) { c.classList.remove('chip--on'); });
      chip.classList.add('chip--on');
      toast('Избранное: ' + chip.textContent);
    });
  });

  hiddenScan.addEventListener('keydown', function (e) {
    if (e.key === 'Enter' && hiddenScan.value.trim()) {
      toast('Скан: ' + hiddenScan.value.trim());
      hiddenScan.value = '';
    }
  });

  document.getElementById('fab-tasks').addEventListener('click', function () {
    showScreen('screen-tasks');
  });

  document.getElementById('btn-login').addEventListener('click', function () {
    toast('Добро пожаловать в AWM 2.0');
    showScreen('screen-home');
  });

  updateMultiPreview();
  showScreen('screen-login');
})();
