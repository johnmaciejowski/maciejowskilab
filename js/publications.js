/* Renders publications from window.PUBLICATIONS (see publications-data.js, which is
   generated from publications.json at build time). One data source feeds both the
   full Publications page and the "Recent work" block on the home page. */
(function () {
  var DATA = window.PUBLICATIONS;

  function esc(s) {
    return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  }

  function pad2(n) { return (n < 10 ? '0' : '') + n; }

  // Stable sort, most recent year first.
  function byYearDesc(items) {
    return items
      .map(function (it, i) { return { it: it, i: i }; })
      .sort(function (a, b) { return (b.it.year - a.it.year) || (a.i - b.i); })
      .map(function (x) { return x.it; });
  }

  function entryHTML(p) {
    var s = '<span class="pub-cite">' +
      esc(p.authors) + '. ' + esc(p.title) + '. ' +
      '<em class="pub-venue">' + esc(p.venue) + '</em> ' + p.year;
    if (p.detail) s += ';' + esc(p.detail);
    s += '.</span>';
    var links = '';
    if (p.doi) {
      links += '<a class="pub-link" href="https://doi.org/' + esc(p.doi) + '">DOI</a>';
    }
    if (p.pmid) {
      links += '<a class="pub-link" href="https://pubmed.ncbi.nlm.nih.gov/' + esc(p.pmid) + '/">PubMed ' + esc(p.pmid) + '</a>';
    }
    if (links) s += '<span class="pub-links">' + links + '</span>';
    return s;
  }

  function listOf(items) {
    var ol = document.createElement('ol');
    ol.className = 'pub-list';
    byYearDesc(items).forEach(function (p) {
      var li = document.createElement('li');
      li.innerHTML = entryHTML(p);
      ol.appendChild(li);
    });
    return ol;
  }

  // Full Publications page: each section in the file's order, reverse-chron within.
  window.renderAllPublications = function (target) {
    var el = (typeof target === 'string') ? document.getElementById(target) : target;
    if (!el || !DATA) return;
    el.innerHTML = '';
    var n = 0;
    DATA.sections.forEach(function (sec) {
      var items = DATA.items.filter(function (p) { return p.section === sec.id; });
      if (!items.length) return;
      n += 1;
      var section = document.createElement('section');
      section.className = 'pub-section';
      section.id = sec.id;
      var h2 = document.createElement('h2');
      h2.className = 'pub-h';
      h2.innerHTML = '<span class="pub-num">' + pad2(n) + '</span>' +
        '<span class="pub-label">' + esc(sec.label) + '</span>' +
        '<span class="pub-count">' + items.length + '</span>';
      section.appendChild(h2);
      section.appendChild(listOf(items));
      el.appendChild(section);
    });
  };

  // Home page: the N most recent entries overall.
  window.renderRecentPublications = function (target, limit) {
    var el = (typeof target === 'string') ? document.getElementById(target) : target;
    if (!el || !DATA) return;
    var recent = byYearDesc(DATA.items).slice(0, limit || 3);
    el.innerHTML = '';
    el.appendChild(listOf(recent));
  };
})();
