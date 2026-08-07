#!/usr/bin/env python3
"""Single-source publications build.

Reads publications.json (the one source of truth), fetches PMIDs from NCBI
E-utilities keyed on DOI (cached in tools/.pmid-cache.json so re-runs are fast
and deterministic), and writes STATIC HTML into:
  - publications.html   (full list, grouped by section, reverse-chron within)
  - index.html          (Home "Recent work": the 3 most recent overall)

Each page carries markers; only the region between them is rewritten:
  publications.html : <div id="publications" class="pub-body"> ... </div>
  index.html        : <div id="recent-publications"> ... </div>

One-command update:  python3 tools/build_publications.py
No runtime JavaScript renders publications anymore.
"""
import json, os, re, sys, time, urllib.parse, urllib.request

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SRC = os.path.join(ROOT, "publications.json")
PUBS = os.path.join(ROOT, "publications.html")
INDEX = os.path.join(ROOT, "index.html")
CACHE = os.path.join(os.path.dirname(os.path.abspath(__file__)), "pmid-cache.json")
ESEARCH = "https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esearch.fcgi"


def fetch_pmid(doi):
    q = urllib.parse.urlencode({
        "db": "pubmed", "term": doi + "[doi]", "retmode": "json",
        "tool": "maciejowskilab-site", "email": "maciejoj@mskcc.org",
    })
    with urllib.request.urlopen(ESEARCH + "?" + q, timeout=30) as r:
        ids = json.load(r).get("esearchresult", {}).get("idlist", [])
    return ids[0] if ids else None


def pmids_for(pubs):
    cache = {}
    if os.path.exists(CACHE):
        cache = json.load(open(CACHE))
    changed = False
    for p in pubs:
        doi = p["doi"]
        if doi not in cache:
            cache[doi] = fetch_pmid(doi)          # None if not in PubMed
            changed = True
            time.sleep(0.4)                        # NCBI: stay under 3 req/sec
    if changed:
        json.dump(cache, open(CACHE, "w"), indent=2, ensure_ascii=False)
    return cache


def year_desc(items):
    # Python's sort is stable, so equal years keep publications.json order.
    return sorted(items, key=lambda p: -p["year"])


def entry(p, pmid, indent):
    cite = "%s. %s. <em class=\"pub-venue\">%s</em> %s" % (
        p["authors"], p["title"], p["venue"], p["year"])
    if p.get("detail"):
        cite += ";" + p["detail"]
    cite += "."
    links = '<a class="pub-link" target="_blank" rel="noopener" href="https://doi.org/%s">DOI</a>' % p["doi"]
    if pmid:
        links += '<a class="pub-link" target="_blank" rel="noopener" href="https://pubmed.ncbi.nlm.nih.gov/%s/">PubMed %s</a>' % (pmid, pmid)
    return ('%s<li><span class="pub-cite">%s</span>'
            '<span class="pub-links">%s</span></li>') % (indent, cite, links)


def build_pubs_body(data, pmids):
    L = ["        <!-- STATIC HTML generated from publications.json (single source of truth).",
         "             Regenerate this markup with the build step; do not hand-edit entries. -->"]
    n = 0
    for sec in data["sections"]:
        items = year_desc([p for p in data["publications"] if p["section"] == sec["id"]])
        if not items:
            continue
        n += 1
        L.append('        <section class="pub-section" id="%s">' % sec["id"])
        L.append('          <h2 class="pub-h"><span class="pub-num">%02d</span>'
                 '<span class="pub-label">%s</span>'
                 '<span class="pub-count">%d</span></h2>' % (n, sec["label"], len(items)))
        L.append('          <ol class="pub-list">')
        for p in items:
            L.append(entry(p, pmids.get(p["doi"]), "            "))   # 12 spaces
        L.append("          </ol>")
        L.append("        </section>")
    return "\n".join(L)


def build_home_body(data, pmids, limit=3):
    recent = year_desc(list(data["publications"]))[:limit]
    L = ["          <!-- STATIC HTML: 3 most recent from publications.json. Regenerate with the build step. -->",
         '          <ol class="pub-list">']
    for p in recent:
        L.append(entry(p, pmids.get(p["doi"]), "          "))         # 10 spaces
    L.append("        </ol>")
    return "\n".join(L)


def splice(path, open_tag_re, close, body):
    html = open(path, encoding="utf-8").read()
    pat = re.compile("(" + open_tag_re + r"\n).*?(\n" + re.escape(close) + ")", re.DOTALL)
    if not pat.search(html):
        sys.exit("marker not found in %s" % path)
    new = pat.sub(lambda m: m.group(1) + body + m.group(2), html, count=1)
    if new != html:
        open(path, "w", encoding="utf-8").write(new)
    return new != html


def main():
    data = json.load(open(SRC, encoding="utf-8"))
    pmids = pmids_for(data["publications"])
    c1 = splice(PUBS, r'<div id="publications" class="pub-body">',
                "      </div>", build_pubs_body(data, pmids))
    c2 = splice(INDEX, r'<div id="recent-publications">',
                "        </div>", build_home_body(data, pmids))
    got = sum(1 for p in data["publications"] if pmids.get(p["doi"]))
    print("publications: %d entries, %d with PMIDs" % (len(data["publications"]), got))
    print("publications.html %s | index.html %s" % (
        "updated" if c1 else "unchanged", "updated" if c2 else "unchanged"))


if __name__ == "__main__":
    main()
