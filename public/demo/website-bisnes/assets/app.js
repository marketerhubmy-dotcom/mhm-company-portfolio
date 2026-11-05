// Klinik Nadi Harmoni — DEMO. No data is sent anywhere.
(function () {
  'use strict';

  // Opening hours (fictional). Day index: 0 = Ahad ... 6 = Sabtu. Minutes since midnight.
  var HOURS = {
    0: [540, 780],   // Ahad 9:00–13:00
    1: [510, 1260],  // Isnin 8:30–21:00
    2: [510, 1260],
    3: [510, 1260],
    4: [510, 1260],
    5: [510, 1260],  // Jumaat
    6: [540, 1020],  // Sabtu 9:00–17:00
  };
  var DAYS = ['Ahad', 'Isnin', 'Selasa', 'Rabu', 'Khamis', 'Jumaat', 'Sabtu'];

  // Current time in Malaysia regardless of the visitor's own timezone.
  function nowMY() {
    var parts = new Intl.DateTimeFormat('en-GB', { timeZone: 'Asia/Kuala_Lumpur', weekday: 'short', hour: '2-digit', minute: '2-digit', hour12: false, year: 'numeric', month: '2-digit', day: '2-digit' }).formatToParts(new Date());
    var get = function (t) { return (parts.find(function (p) { return p.type === t; }) || {}).value; };
    var wd = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].indexOf(get('weekday'));
    var h = parseInt(get('hour'), 10) % 24, m = parseInt(get('minute'), 10);
    return { day: wd, minutes: h * 60 + m, iso: get('year') + '-' + get('month') + '-' + get('day') };
  }
  var fmt = function (mins) { var h = Math.floor(mins / 60), m = mins % 60; return (h < 10 ? '0' : '') + h + ':' + (m < 10 ? '0' : '') + m; };

  // Mobile menu
  var btn = document.querySelector('.menu-btn'), nav = document.getElementById('nav');
  if (btn && nav) {
    btn.addEventListener('click', function () {
      var open = nav.classList.toggle('open');
      btn.setAttribute('aria-expanded', String(open));
      btn.setAttribute('aria-label', open ? 'Tutup menu' : 'Buka menu');
    });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && nav.classList.contains('open')) { nav.classList.remove('open'); btn.setAttribute('aria-expanded', 'false'); btn.focus(); } });
  }

  // Live open/closed status + highlight today
  var n = nowMY();
  var today = HOURS[n.day];
  var isOpen = today && n.minutes >= today[0] && n.minutes < today[1];
  document.querySelectorAll('[data-open-status]').forEach(function (el) {
    var dot = el.querySelector('.dot'), txt = el.querySelector('[data-status-text]');
    if (dot) dot.classList.toggle('open', !!isOpen);
    if (txt) {
      if (isOpen) txt.textContent = 'Buka sekarang · tutup ' + fmt(today[1]);
      else {
        var next = null;
        for (var i = 0; i < 8 && !next; i++) {
          var d = (n.day + i) % 7, hrs = HOURS[d];
          if (hrs && (i > 0 || n.minutes < hrs[0])) next = (i === 0 ? 'hari ini' : i === 1 ? 'esok' : DAYS[d]) + ' ' + fmt(hrs[0]);
        }
        txt.textContent = 'Tutup sekarang · buka ' + next;
      }
    }
  });
  document.querySelectorAll('[data-day]').forEach(function (row) { if (Number(row.getAttribute('data-day')) === n.day) { row.classList.add('today'); row.setAttribute('aria-current', 'date'); } });

  // Appointment form
  var form = document.getElementById('appt-form');
  if (!form) return;
  var date = form.querySelector('#appt-date'), slotsBox = form.querySelector('#appt-slots'), out = document.getElementById('appt-preview');
  date.min = n.iso;
  var maxD = new Date(n.iso + 'T00:00:00'); maxD.setDate(maxD.getDate() + 30);
  date.max = maxD.toISOString().slice(0, 10);

  function renderSlots() {
    slotsBox.innerHTML = '';
    if (!date.value) { slotsBox.innerHTML = '<p class="hint">Pilih tarikh dahulu.</p>'; return; }
    var d = new Date(date.value + 'T00:00:00').getDay(), hrs = HOURS[d];
    var count = 0;
    for (var t = hrs[0]; t + 30 <= hrs[1]; t += 30) {
      var past = date.value === n.iso && t <= n.minutes + 30;
      var id = 'slot-' + t;
      var label = document.createElement('label'); label.className = 'slot';
      label.innerHTML = '<input type="radio" name="slot" id="' + id + '" value="' + fmt(t) + '"' + (past ? ' disabled' : '') + '><span>' + fmt(t) + '</span>';
      slotsBox.appendChild(label);
      if (!past) count++;
    }
    if (!count) slotsBox.innerHTML = '<p class="hint">Tiada slot lagi untuk tarikh ini. Sila pilih tarikh lain.</p>';
  }
  date.addEventListener('change', renderSlots);
  renderSlots();

  function setErr(name, msg) {
    var el = form.querySelector('[data-err="' + name + '"]'), input = form.querySelector('[name="' + name + '"]');
    if (el) el.textContent = msg || '';
    if (input) { if (msg) input.setAttribute('aria-invalid', 'true'); else input.removeAttribute('aria-invalid'); }
  }

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var f = new FormData(form), ok = true, first = null;
    var need = { nama: 'Sila isi nama pesakit.', telefon: 'Sila isi nombor telefon.', perkhidmatan: 'Pilih jenis rawatan.', tarikh: 'Pilih tarikh.', slot: 'Pilih masa.' };
    Object.keys(need).forEach(function (k) {
      var v = (f.get(k) || '').toString().trim();
      var bad = !v || (k === 'telefon' && v.replace(/\D/g, '').length < 9);
      setErr(k, bad ? (k === 'telefon' && v ? 'Nombor telefon tidak lengkap.' : need[k]) : '');
      if (bad) { ok = false; first = first || form.querySelector('[name="' + k + '"]') || slotsBox; }
    });
    if (!ok) { if (first && first.focus) first.focus(); return; }
    var lines = [
      'Salam Klinik Nadi Harmoni,',
      'Saya ingin membuat temujanji:',
      '',
      '• Nama: ' + f.get('nama'),
      '• Telefon: ' + f.get('telefon'),
      '• Rawatan: ' + f.get('perkhidmatan'),
      '• Tarikh: ' + new Date(f.get('tarikh') + 'T00:00:00').toLocaleDateString('ms-MY', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }),
      '• Masa: ' + f.get('slot'),
    ];
    var note = (f.get('catatan') || '').toString().trim();
    if (note) lines.push('• Catatan: ' + note.slice(0, 300));
    out.hidden = false;
    out.querySelector('pre').textContent = lines.join('\n');
    out.focus();
  });
})();
