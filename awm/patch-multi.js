const fs = require('fs');
const p = require('path').join(__dirname, 'problemy-awm-report.html');
let h = fs.readFileSync(p, 'utf8');
const start = h.indexOf('      <!-- 6 -->');
const end = h.indexOf('      <footer class="footer-doc">');
if (start < 0 || end < 0) {
  console.error('markers not found', start, end);
  process.exit(1);
}
const block = `      <!-- 6 — Мульти-операции -->
      <article class="issue page-break" id="p6">
        <div class="issue-head">
          <span class="issue-num">6</span>
          <h3>Мульти-операции с ГЕ: закрытие · привязка к месту · привязка товара</h3>
        </div>
        <div class="issue-body">
          <div class="block">
            <div class="block-title">Общая идея</div>
            <p>Три похожие проблемы — кладовщик повторяет одно действие <strong>десятки раз</strong>. Решение: режим <strong>«Мульти»</strong> — диапазон ГЕ (от / до), превью, одна кнопка. <a href="multi-report.html" style="color:#33691e;font-weight:700">Подробнее и макеты →</a></p>
          </div>
          <div class="block">
            <div class="block-title">6A · Закрытие пустых ГЕ</div>
            <p>30 паллет принято, ~50 лишних пустых ГЕ. <strong>Решение:</strong> диапазон №37431…№37480 или чекбоксы → «Закрыть выбранные» (только пустые).</p>
          </div>
          <div class="block">
            <div class="block-title">6B · Привязка к 0-0-1 (Разгрузка)</div>
            <p>~70 ГЕ по одной. <strong>Решение:</strong> №37400…№37470 → привязка к 0-0-1, превью списка, импорт из задания.</p>
          </div>
          <div class="block">
            <div class="block-title">6C · Товар на множество ГЕ</div>
            <p>70 ГЕ × 10 стульев ≈ 23 мин. <strong>Решение:</strong> один товар + qty + диапазон → одна операция, шаблон, экономия 15–18 мин.</p>
          </div>
          <div class="mockup-gallery">
            <figure class="mockup-item"><img src="./photo/multi-close.png" alt="6A"><figcaption>6A · Закрыть пустые ГЕ</figcaption></figure>
            <figure class="mockup-item"><img src="./photo/multi-bind-place.png" alt="6B"><figcaption>6B · 71 ГЕ → 0-0-1</figcaption></figure>
            <figure class="mockup-item"><img src="./photo/multi-bind-product.png" alt="6C"><figcaption>6C · 700 стульев / 70 ГЕ</figcaption></figure>
          </div>
          <figure class="mockup-wide"><img src="./photo/multi-all.png" alt="Все"><figcaption><a href="multi-mockup.html">multi-mockup.html</a></figcaption></figure>
        </div>
      </article>

`;
h = h.slice(0, start) + block + h.slice(end);
fs.writeFileSync(p, h);
console.log('OK: merged пункты 6–8 в один');
