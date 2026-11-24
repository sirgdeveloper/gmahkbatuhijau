/* ==========================================================================
   GMAHK Batu Hijau — skrip utama
   Semua konten diambil dari data/content.json. Ubah file itu, bukan kode ini.
   ========================================================================== */
(function () {
  'use strict';

  var $ = function (id) { return document.getElementById(id); };
  var WITA_OFFSET = 8 * 60 * 60 * 1000;
  var HARI = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabat'];
  var BULAN = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];

  function esc(s) {
    return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }
  function el(tag, cls, html) {
    var e = document.createElement(tag);
    if (cls) e.className = cls;
    if (html != null) e.innerHTML = html;
    return e;
  }
  function witaNow() {
    var n = new Date();
    return new Date(n.getTime() + n.getTimezoneOffset() * 60000 + WITA_OFFSET);
  }
  function dayOfYear(d) {
    return Math.floor((Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()) - Date.UTC(d.getFullYear(), 0, 0)) / 86400000);
  }
  function tglIndo(d) {
    return HARI[d.getDay()] + ', ' + d.getDate() + ' ' + BULAN[d.getMonth()] + ' ' + d.getFullYear();
  }
  function copyText(text, toastEl, okMsg) {
    var done = function () { if (toastEl) toastEl.textContent = okMsg; };
    var fail = function () { if (toastEl) toastEl.textContent = text; };
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(done, fail);
    } else {
      var t = document.createElement('textarea');
      t.value = text; t.setAttribute('readonly', ''); t.style.position = 'absolute'; t.style.left = '-9999px';
      document.body.appendChild(t); t.select();
      try { document.execCommand('copy') ? done() : fail(); } catch (e) { fail(); }
      document.body.removeChild(t);
    }
  }
  function safeUrl(u) {
    if (!u) return '';
    return /^(https?:|mailto:|tel:|#|assets\/|\/)/i.test(u) ? u : '';
  }

  // ---------- Tema terang / gelap ----------
  var root = document.documentElement;
  try {
    var savedTheme = localStorage.getItem('gmahk-theme');
    if (savedTheme) root.setAttribute('data-theme', savedTheme);
  } catch (e) {}
  $('themeBtn').addEventListener('click', function () {
    var cur = root.getAttribute('data-theme');
    var dark = cur ? cur === 'dark' : window.matchMedia('(prefers-color-scheme: dark)').matches;
    var next = dark ? 'light' : 'dark';
    root.setAttribute('data-theme', next);
    try { localStorage.setItem('gmahk-theme', next); } catch (e) {}
  });

  // ---------- Menu mobile & tombol ke atas ----------
  var menuBtn = $('menuBtn'), nav = $('mainNav');
  menuBtn.addEventListener('click', function () {
    var open = nav.classList.toggle('open');
    menuBtn.setAttribute('aria-expanded', open ? 'true' : 'false');
  });
  nav.addEventListener('click', function (e) {
    if (e.target.tagName === 'A') { nav.classList.remove('open'); menuBtn.setAttribute('aria-expanded', 'false'); }
  });
  var toTop = $('toTop');
  window.addEventListener('scroll', function () { toTop.classList.toggle('show', window.scrollY > 600); }, { passive: true });
  toTop.addEventListener('click', function () { window.scrollTo({ top: 0, behavior: 'smooth' }); });

  // ---------- Muat konten ----------
  fetch('data/content.json', { cache: 'no-cache' })
    .then(function (r) { if (!r.ok) throw new Error('HTTP ' + r.status); return r.json(); })
    .then(init)
    .catch(function (err) {
      var box = el('div', 'error-box', '<b>Konten belum bisa dimuat.</b> Pastikan file <code>data/content.json</code> ada dan website dibuka lewat alamat web (bukan langsung dari file). Detail: ' + esc(err.message));
      document.querySelector('main').prepend(box);
    });

  function init(C) {
    document.title = 'GMAHK Batu Hijau — Gereja Masehi Advent Hari Ketujuh, Maluk, Sumbawa Barat';
    renderBeranda(C);
    renderTentang(C);
    renderPelayanan(C);
    renderBerita(C);
    renderWawasan(C);
    renderKhotbah(C);
    renderBelajar(C);
    renderJadwal(C);
    renderKesaksian(C);
    renderDokumentasi(C);
    renderMateri(C);
    renderDonasi(C);
    renderDoa(C);
    renderFooter(C);
    setupAyatHarian(C);
    setupCountdown();
    setupDevotional(C);
    setupForm(C);
    setupActiveNav();
    setupDelegation();
  }

  // ---------- Renderer ----------
  function renderBeranda(C) {
    var b = C.beranda;
    $('heroPill').textContent = b.pill;
    $('heroTitle').innerHTML = esc(b.judul) + ' <em>' + esc(b.judul_sorot) + '</em>';
    $('heroRole').textContent = b.subjudul;
    $('heroLead').textContent = b.deskripsi;
    $('heroVerse').textContent = '“' + b.ayat + '”';
    $('heroVerseRef').textContent = '— ' + b.ayat_ref;
    $('heroImg').src = b.gambar;
    $('heroImg').alt = b.gambar_alt;
    $('sabbathLabel').textContent = b.kartu_sabat_judul;
    $('sabbathDetail').textContent = b.kartu_sabat_detail;
    var duo = $('duo');
    b.kotak.forEach(function (k, i) {
      var card = el('div', 'duo-card ' + (i === 0 ? 'blue' : 'plain'));
      card.innerHTML = '<h3>' + esc(k.judul) + '</h3><p>' + esc(k.teks) + '</p><a class="btn btn-blue" href="' + esc(k.tautan) + '">' + esc(k.tombol) + '</a>';
      duo.appendChild(card);
    });
  }

  function renderTentang(C) {
    var t = C.tentang;
    $('tentangTitle').textContent = t.judul;
    $('tentangSub').textContent = t.sub;
    $('misiText').textContent = t.misi;
    $('visiText').textContent = t.visi;
    $('pastorImg').src = t.pendeta.gambar;
    $('pastorImg').alt = t.pendeta.gambar_alt;
    $('pastorName').textContent = t.pendeta.nama;
    $('pastorRole').textContent = t.pendeta.jabatan;
    $('pastorBio').textContent = t.pendeta.bio;
    $('pastorAjakan').textContent = t.pendeta.ajakan;
  }

  function renderPelayanan(C) {
    $('pelayananTitle').textContent = C.pelayanan.judul;
    $('pelayananSub').textContent = C.pelayanan.sub;
    var g = $('svcGrid');
    C.pelayanan.daftar.forEach(function (s) {
      var c = el('div', 'svc');
      c.innerHTML = '<div class="ic" aria-hidden="true">' + esc(s.ikon) + '</div><h3>' + esc(s.judul) + '</h3><p>' + esc(s.teks) + '</p>';
      g.appendChild(c);
    });
  }

  function renderBerita(C) {
    $('beritaTitle').textContent = C.berita.judul;
    $('beritaSub').textContent = C.berita.sub;
    var main = $('newsMain');
    C.berita.utama.forEach(function (n) {
      var a = el('article', 'news-card');
      a.innerHTML = '<img src="' + esc(n.gambar) + '" alt="' + esc(n.gambar_alt) + '" loading="lazy">' +
        '<div class="news-body"><span class="tag">' + esc(n.label) + '</span><h3>' + esc(n.judul) + '</h3><p>' + esc(n.teks) + '</p>' +
        '<span class="meta">' + esc(n.tanggal) + ' / ' + esc(n.penulis) + '</span></div>';
      main.appendChild(a);
    });
    var side = $('newsSide');
    C.berita.lainnya.forEach(function (n) {
      var a = el('a', 'item', '<b>' + esc(n.judul) + '</b><span>' + esc(n.tanggal) + '</span>');
      a.href = '#pelayanan';
      side.appendChild(a);
    });
  }

  function renderWawasan(C) {
    $('wawasanTitle').textContent = C.wawasan.judul;
    $('wawasanSub').textContent = C.wawasan.sub;
    var g = $('artGrid');
    C.wawasan.artikel.forEach(function (a) {
      var card = el('article', 'art');
      var tags = a.tag.map(function (t, i) { return '<span class="tag' + (i ? ' alt' : '') + '">' + esc(t) + '</span>'; }).join('');
      card.innerHTML = '<img src="' + esc(a.gambar) + '" alt="' + esc(a.gambar_alt) + '" loading="lazy">' +
        '<div class="art-body">' + tags + '<h3>' + esc(a.judul) + '</h3><p>' + esc(a.ringkas) + '</p>' +
        '<p class="more-text">' + esc(a.lanjutan) + '</p>' +
        '<button class="link-btn readmore" type="button" aria-expanded="false">Baca Selengkapnya</button>' +
        '<p class="meta" style="margin-top:12px">' + esc(a.tanggal) + ' / ' + esc(a.penulis) + '</p></div>';
      g.appendChild(card);
    });
  }

  function renderKhotbah(C) {
    var k = C.khotbah;
    $('khotbahTitle').textContent = k.judul;
    $('khotbahSub').textContent = k.sub;
    $('sermonEmpty').textContent = k.kosong;
    var f = $('filters');
    k.kategori.forEach(function (c, i) {
      var b = el('button', i === 0 ? 'active' : '', esc(c.nama));
      b.type = 'button'; b.setAttribute('data-filter', c.id);
      f.appendChild(b);
    });
    var list = $('sermonList');
    k.daftar.forEach(function (s) {
      var card = el('article', 'sermon');
      card.setAttribute('data-cat', s.kategori);
      var label = (k.kategori.filter(function (c) { return c.id === s.kategori; })[0] || { nama: s.kategori }).nama;
      card.innerHTML = '<span class="tag">' + esc(label) + '</span><h3>' + esc(s.judul) + '</h3>' +
        '<div class="scr">' + esc(s.ayat) + ' • ' + esc(s.durasi) + '</div><p>' + esc(s.teaser) + '</p>' +
        '<div class="sum"><p><b>Ringkasan:</b> ' + esc(s.ringkasan) + '</p></div>' +
        '<button class="link-btn sum-btn" type="button" aria-expanded="false">Baca ringkasan</button>';
      list.appendChild(card);
    });
  }

  function renderBelajar(C) {
    $('renunganImg').src = C.renungan.gambar;
    $('renunganImg').alt = C.renungan.gambar_alt;
    $('devNote').textContent = C.renungan.catatan;
  }

  function renderJadwal(C) {
    $('jadwalTitle').textContent = C.jadwal.judul;
    $('jadwalSub').textContent = C.jadwal.sub;
    var g = $('schedGrid');
    C.jadwal.kelompok.forEach(function (k) {
      var d = el('div', 'day');
      d.innerHTML = '<h3>' + esc(k.nama) + '</h3><ul>' + k.item.map(function (i) {
        return '<li><span>' + esc(i.acara) + '</span><b>' + esc(i.waktu) + '</b></li>';
      }).join('') + '</ul>';
      g.appendChild(d);
    });
  }

  function renderKesaksian(C) {
    $('kesaksianTitle').textContent = C.kesaksian.judul;
    $('kesaksianSub').textContent = C.kesaksian.sub;
    var g = $('testiGrid');
    C.kesaksian.daftar.forEach(function (t) {
      var f = el('figure');
      f.innerHTML = '<blockquote>' + esc(t.isi) + '</blockquote><figcaption>' + esc(t.nama) + '<span>' + esc(t.keterangan) + '</span></figcaption>';
      g.appendChild(f);
    });
  }

  function renderDokumentasi(C) {
    $('dokTitle').textContent = C.dokumentasi.judul;
    $('dokSub').textContent = C.dokumentasi.sub;
    var g = $('gallery');
    var items = C.dokumentasi.daftar || [];
    items.forEach(function (d) {
      var f = el('figure');
      var media = d.gambar ? '<img src="' + esc(d.gambar) + '" alt="' + esc(d.judul) + '" loading="lazy">' : '';
      var link = safeUrl(d.tautan) ? ' <a href="' + esc(d.tautan) + '" target="_blank" rel="noopener">Buka</a>' : '';
      f.innerHTML = media + '<figcaption><b>' + esc(d.judul) + '</b><br>' + esc(d.keterangan || '') + link + '</figcaption>';
      g.appendChild(f);
    });
    var empty = $('galleryEmpty');
    empty.hidden = items.length > 0;
    empty.textContent = C.dokumentasi.kosong;
  }

  function renderMateri(C) {
    $('materiTitle').textContent = C.materi.judul;
    $('materiSub').textContent = C.materi.sub;
    var g = $('fileGrid');
    C.materi.daftar.forEach(function (m) {
      var c = el('div', 'file');
      var btn = safeUrl(m.tautan) ? '<a class="btn btn-blue" href="' + esc(m.tautan) + '" target="_blank" rel="noopener">Buka / Unduh</a>' : '';
      c.innerHTML = '<span class="ftype">' + esc(m.jenis) + '</span><h4>' + esc(m.judul) + '</h4><p>' + esc(m.keterangan || '') + '</p>' + btn;
      g.appendChild(c);
    });
    var empty = $('fileEmpty');
    empty.hidden = C.materi.daftar.length > 0;
    empty.textContent = C.materi.kosong;
  }

  function renderDonasi(C) {
    var d = C.donasi;
    $('donasiTitle').textContent = d.judul;
    $('donasiSub').textContent = d.sub;
    $('donasiCatatan').textContent = d.catatan;
    $('donasiPanduan').innerHTML = d.panduan.map(function (p) { return '<li>' + esc(p) + '</li>'; }).join('');
    $('donBank').textContent = d.bank;
    $('donNumber').textContent = d.nomor_rekening;
    $('donName').textContent = d.atas_nama;
    $('copyRek').addEventListener('click', function () {
      copyText(d.nomor_rekening, $('donToast'), 'Nomor rekening tersalin.');
    });
    $('copyDetail').addEventListener('click', function () {
      copyText(d.bank + ' a/n ' + d.atas_nama + ' — No. Rek. ' + d.nomor_rekening, $('donToast'), 'Detail rekening tersalin.');
    });
  }

  function renderDoa(C) {
    $('doaTitle').textContent = C.doa.judul;
    $('doaSub').textContent = C.doa.sub;
    var sel = $('fKat');
    C.doa.kebutuhan.forEach(function (k) { var o = el('option', '', esc(k)); o.value = k; sel.appendChild(o); });
    $('faqTitle').textContent = C.tanya_jawab.judul;
    var faq = $('faq');
    C.tanya_jawab.daftar.forEach(function (q) {
      var d = el('details');
      d.innerHTML = '<summary>' + esc(q.tanya) + '</summary><p>' + esc(q.jawab) + '</p>';
      faq.appendChild(d);
    });
  }

  function socialLinks(C) {
    var s = C.sosial || {};
    var items = [
      ['Facebook', s.facebook], ['Instagram', s.instagram], ['YouTube', s.youtube],
      ['TikTok', s.tiktok], ['Saluran WhatsApp', s.saluran_whatsapp], ['Spotify', s.spotify]
    ];
    return items.filter(function (i) { return safeUrl(i[1]); }).map(function (i) {
      return '<a href="' + esc(i[1]) + '" target="_blank" rel="noopener">' + esc(i[0]) + '</a>';
    }).join('');
  }

  function renderFooter(C) {
    var g = C.gereja;
    $('cPastor').textContent = C.tentang.pendeta.nama;
    $('cWa').textContent = g.whatsapp || 'Hubungi melalui formulir doa di halaman ini';
    $('cEmail').textContent = g.email || 'Hubungi melalui formulir doa di halaman ini';
    $('cLokasi').textContent = g.lokasi;
    $('cJam').textContent = g.jam_respons;
    $('cDarurat').textContent = g.catatan_darurat;
    $('fLokasi').textContent = g.lokasi_singkat;
    $('fTentang').textContent = g.footer_tentang;
    $('fCopy').textContent = g.hak_cipta;
    var sc = socialLinks(C);
    $('socialContact').innerHTML = sc;
    $('socialFooter').innerHTML = sc;
    document.querySelector('meta[name="description"]').setAttribute('content', g.deskripsi_meta);
  }

  // ---------- Ayat hari ini (berganti tiap pergantian hari WITA) ----------
  function setupAyatHarian(C) {
    var list = C.ayat_harian, bg = $('dvBg'), text = $('dvText'), ref = $('dvRef'), theme = $('dvTheme'), dateEl = $('dvDate'), toast = $('dvToast');
    var cfg = C.ayat_harian_gambar || {};
    var currentKey = '', current = null;
    // Gambar latar: foto acak open source (Lorem Picsum) dengan seed harian, jadi sama seharian lalu berganti.
    function setBackground(verse, w) {
      var fallback = verse.gambar;
      bg.alt = '';
      if (cfg.aktif === false) { bg.src = fallback; return; }
      var seed = (cfg.awalan_seed || 'gmahk') + '-' + w.getFullYear() + '-' + (w.getMonth() + 1) + '-' + w.getDate();
      var base = (cfg.sumber || 'https://picsum.photos').replace(/\/+$/, '');
      var url = base + '/seed/' + encodeURIComponent(seed) + '/' + (cfg.lebar || 1600) + '/' + (cfg.tinggi || 900);
      bg.onerror = function () { bg.onerror = null; bg.src = fallback; };
      bg.src = url;
    }
    function render() {
      var w = witaNow();
      var key = w.getFullYear() + '-' + w.getMonth() + '-' + w.getDate();
      if (key === currentKey) return;
      currentKey = key;
      current = list[dayOfYear(w) % list.length];
      text.textContent = '“' + current.teks + '”';
      ref.textContent = current.ref + ' (TB)';
      theme.textContent = current.tema;
      dateEl.textContent = 'Ayat Hari Ini • ' + tglIndo(w);
      setBackground(current, w);
      toast.textContent = '';
    }
    render();
    setInterval(render, 60000);
    document.addEventListener('visibilitychange', function () { if (!document.hidden) render(); });
    $('dvCopy').addEventListener('click', function () {
      if (!current) return;
      copyText('“' + current.teks + '” — ' + current.ref + ' (TB)', toast, 'Ayat hari ini tersalin. Tuhan memberkati!');
    });
  }

  // ---------- Hitung mundur ke Sabat berikutnya (08.30 WITA) ----------
  function setupCountdown() {
    var cd = $('countdown');
    function msToNext() {
      var w = witaNow();
      var target = new Date(w.getTime());
      target.setHours(8, 30, 0, 0);
      var add = (6 - w.getDay() + 7) % 7;
      if (add === 0 && w >= target) add = 7;
      target.setDate(target.getDate() + add);
      return target - w;
    }
    function tick() {
      var s = Math.max(0, Math.floor(msToNext() / 1000));
      var dd = Math.floor(s / 86400), hh = Math.floor(s % 86400 / 3600), mm = Math.floor(s % 3600 / 60), ss = s % 60;
      cd.textContent = dd > 0 ? dd + ' hari ' + hh + ' jam lagi' : hh + ' jam ' + mm + ' mnt ' + ss + ' dtk';
    }
    tick();
    setInterval(tick, 1000);
  }

  // ---------- Renungan: bergilir, bisa diganti manual ----------
  function setupDevotional(C) {
    var list = C.renungan.daftar, idx = witaNow().getDay() % list.length;
    var v = $('devVerse'), r = $('devRef'), b = $('devBody'), d = $('devDate'), toast = $('toast');
    function render() { v.textContent = list[idx].ayat; r.textContent = list[idx].ref; b.textContent = list[idx].isi; }
    var w = witaNow();
    d.textContent = 'Renungan • ' + tglIndo(w);
    render();
    $('nextVerse').addEventListener('click', function () { idx = (idx + 1) % list.length; render(); toast.textContent = ''; });
    $('copyVerse').addEventListener('click', function () {
      copyText(list[idx].ayat + ' — ' + list[idx].ref, toast, 'Ayat tersalin. Tuhan memberkati!');
    });
  }

  // ---------- Formulir doa: WhatsApp atau Email ----------
  function setupForm(C) {
    var form = $('prayForm'), mail = $('mailBtn'), toast = $('formToast');
    var waNum = (C.gereja.whatsapp || '').replace(/[^0-9]/g, '');
    var email = (C.gereja.email || '').trim();
    var emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    if (!waNum) $('waBtn').textContent = 'Kirim via WhatsApp (belum tersedia)';
    if (emailOk) mail.hidden = false;

    function buildMsg() {
      var nama = $('fNama').value.trim() || '(tanpa nama)';
      var kat = $('fKat').value;
      var pesan = $('fPesan').value.trim() || '(belum menulis pesan)';
      return 'Shalom GMAHK Batu Hijau, saya ' + nama + '.\nKebutuhan: ' + kat + '\nPesan: ' + pesan;
    }
    function refreshMail() {
      if (!emailOk) return;
      mail.href = 'mailto:' + email + '?subject=' + encodeURIComponent($('fKat').value + ' — Formulir Doa GMAHK Batu Hijau') + '&body=' + encodeURIComponent(buildMsg());
    }
    ['fNama', 'fKat', 'fPesan'].forEach(function (id) { $(id).addEventListener('input', refreshMail); $(id).addEventListener('change', refreshMail); });
    mail.addEventListener('click', refreshMail);
    refreshMail();

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      if (!waNum) {
        toast.textContent = emailOk
          ? 'Nomor WhatsApp gereja belum tersedia. Silakan gunakan tombol Kirim via Email.'
          : 'Nomor WhatsApp dan email gereja belum tersedia. Silakan sampaikan pesan Anda langsung saat beribadah.';
        return;
      }
      window.open('https://wa.me/' + waNum + '?text=' + encodeURIComponent(buildMsg()), '_blank', 'noopener');
      toast.textContent = 'Membuka WhatsApp dengan pesan yang sudah tersusun…';
    });
  }

  // ---------- Interaksi: baca selengkapnya, filter, ringkasan ----------
  function setupDelegation() {
    document.addEventListener('click', function (e) {
      var rm = e.target.closest ? e.target.closest('.readmore') : null;
      if (rm) {
        var t = rm.parentElement.querySelector('.more-text');
        var open = t.classList.toggle('open');
        rm.textContent = open ? 'Tutup' : 'Baca Selengkapnya';
        rm.setAttribute('aria-expanded', open ? 'true' : 'false');
        return;
      }
      var fb = e.target.closest ? e.target.closest('.filters button') : null;
      if (fb) {
        document.querySelectorAll('.filters button').forEach(function (x) { x.classList.remove('active'); });
        fb.classList.add('active');
        var f = fb.getAttribute('data-filter'), n = 0;
        document.querySelectorAll('.sermon').forEach(function (s) {
          var show = f === 'semua' || s.getAttribute('data-cat') === f;
          s.style.display = show ? '' : 'none';
          if (show) n++;
        });
        $('sermonEmpty').style.display = n ? 'none' : 'block';
        return;
      }
      var sb = e.target.closest ? e.target.closest('.sum-btn') : null;
      if (sb) {
        var sum = sb.parentElement.querySelector('.sum');
        var o = sum.classList.toggle('open');
        sb.textContent = o ? 'Tutup ringkasan' : 'Baca ringkasan';
        sb.setAttribute('aria-expanded', o ? 'true' : 'false');
      }
    });
  }

  // ---------- Tautan menu aktif saat menggulir ----------
  function setupActiveNav() {
    if (!('IntersectionObserver' in window)) return;
    var links = Array.prototype.slice.call(nav.querySelectorAll('a[href^="#"]'));
    var map = {};
    links.forEach(function (a) { map[a.getAttribute('href').slice(1)] = a; });
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (!en.isIntersecting) return;
        links.forEach(function (a) { a.classList.remove('active'); });
        if (map[en.target.id]) map[en.target.id].classList.add('active');
      });
    }, { rootMargin: '-45% 0px -50% 0px' });
    Object.keys(map).forEach(function (id) { var s = $(id); if (s) io.observe(s); });
  }
})();
