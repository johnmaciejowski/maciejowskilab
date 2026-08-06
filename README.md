# Maciejowski Lab website

A static website for the Maciejowski Lab. It is plain HTML and CSS with no build
step — the files you edit are the files that get served.

The site is hosted with GitHub Pages and is reachable at both
[maciejowskilab.org](https://maciejowskilab.org) and
[johnmaciejowski.github.io/maciejowskilab](https://johnmaciejowski.github.io/maciejowskilab).
Because it must work at both addresses, **all internal links use relative paths**
(for example `people.html` or `../index.html`), never paths that begin with `/`.

## Structure

```
index.html            Home page
people.html           Lab members
join.html             Openings / how to apply
publications.html     Publication list
research/             One page per research area
  immunity.html
  apobec3a.html
  ecdna.html
css/style.css         Shared stylesheet
images/people/        Photos of lab members
images/research/      Figures and images for research pages
```

Every page shares the same navigation bar. If you add or rename a page, update
the `<nav>` block in each HTML file so the menus stay in sync.

## How to add a lab member

1. Save the member's photo in `images/people/` (for example
   `images/people/jane-doe.jpg`).
2. Open `people.html` and add an entry with the person's name, role, and a
   reference to their photo. Copy the format of an existing entry.
3. Use a relative path for the image, for example
   `<img src="images/people/jane-doe.jpg" alt="Jane Doe">`.

## How to add a publication

1. Open `publications.html`.
2. Add a new entry with the authors, title, journal, year, and a link to the
   paper (DOI or PubMed). Copy the format of an existing entry.
3. Keep entries in a consistent order (for example newest first).

## How to deploy

There is nothing to build. To publish changes:

1. Commit your changes.
2. Push to the `main` branch.

GitHub Pages automatically rebuilds and redeploys the site a minute or two after
each push to `main`. No other steps are required.

```
git add .
git commit -m "Describe your change"
git push origin main
```
