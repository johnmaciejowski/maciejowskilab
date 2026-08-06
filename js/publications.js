/* ===================================================================
   SINGLE SOURCE OF TRUTH FOR PUBLICATIONS
   The "Recent work" block on the home page and the full Publications
   page both read from this one list, so adding a paper here updates
   both. Keep the list NEWEST FIRST.

   Each entry: { authors, title, journal, year, url }
     url = link to the paper (DOI or PubMed). Use "#" if none yet.

   TODO: replace the placeholder entries below with real papers.
   =================================================================== */
window.PUBLICATIONS = [
  { authors: "REPLACE — Author A, Author B, Maciejowski J",
    title: "Most recent paper title goes here",
    journal: "Journal", year: 2025, url: "#" },
  { authors: "REPLACE — Author A, Author B, Maciejowski J",
    title: "Second most recent paper title goes here",
    journal: "Journal", year: 2025, url: "#" },
  { authors: "REPLACE — Author A, Author B, Maciejowski J",
    title: "Third most recent paper title goes here",
    journal: "Journal", year: 2024, url: "#" }
];

/* Render up to `limit` publications into `target` (an element or its id).
   Omit `limit` to render all of them. */
window.renderPublications = function (target, limit) {
  var el = (typeof target === 'string') ? document.getElementById(target) : target;
  if (!el) return;
  var pubs = window.PUBLICATIONS.slice();
  if (limit) pubs = pubs.slice(0, limit);
  if (!pubs.length) { el.innerHTML = '<p>Publications coming soon.</p>'; return; }
  var ol = document.createElement('ol');
  ol.className = 'pub-list';
  pubs.forEach(function (p) {
    var li = document.createElement('li');
    var title = (p.url && p.url !== '#')
      ? '<a href="' + p.url + '">' + p.title + '</a>'
      : p.title;
    li.innerHTML = p.authors + '. ' + title + '. <i>' + p.journal + '</i> (' + p.year + ').';
    ol.appendChild(li);
  });
  el.innerHTML = '';
  el.appendChild(ol);
};
