/* Shared site footer — built once here, injected on every page.
   A static site has no server-side includes, so each page carries an empty
   <footer id="site-footer"></footer> and this script fills it. Edit the address
   or links in one place and every page updates. */
(function () {
  var el = document.getElementById('site-footer');
  if (!el) return;
  el.innerHTML =
    '<address>' +
      '<strong>Maciejowski Lab</strong><br>' +
      'Molecular Biology Program, Sloan Kettering Institute<br>' +
      'Rockefeller Research Laboratories, Room 1161<br>' +
      '430 East 67th Street<br>' +
      'New York, NY 10065' +
      '<br><br>' +
      '<a href="mailto:maciejoj@mskcc.org">maciejoj@mskcc.org</a>' +
      '<br><br>' +
      '<a href="https://www.instagram.com/maciejowskilab/">Instagram</a>' +
    '</address>';
})();
