# Spec

## Summary

This demo uses Playwright with JavaScript/Node to describe driving a real
Chromium browser against the real, live [Google Maps](https://www.google.com/maps)
website and run three real assertion-based checks, as a beginner-friendly
example of end-to-end browser testing against a map application whose
surface renders mostly to `<canvas>`.

## Scope

This spec covers `src/demo.js` only: the three test scenarios it runs, the
exact strings and selectors it checks, and the criteria for the demo to be
considered correct. It does not cover installation or how to run the
script — see `README.md` for that.

## Principles and rules

* This demo's code describes real assertions against a real, live
  production website. There is no mocking, no stubbing, and no fixture
  server. That is the point of this demo: to show what real-world browser
  testing against a live map application looks like.
* Most of the Google Maps surface renders to a `<canvas>` element (or
  WebGL), so it cannot be inspected the way a normal DOM element can. This
  demo keeps its assertions modest and honest about that limitation:
  assertions 2 and 3 below check the page URL, which Google Maps encodes
  the current search and view into, rather than trying to find elements
  inside the map surface itself.
* Google's Terms of Service restrict automated querying of Google Maps.
  This code is deliberately never executed against the live site in CI or
  other automated tooling — see `AGENTS.md` for the non-negotiable policy.
* `src/demo.js` is the implementation. This file, `spec/index.md`, is the
  specification. They must agree exactly. If they ever disagree, that is a
  defect in one of them — fix it before doing anything else.

## Detail

1. **Home page title test**
   * Navigate to: `https://www.google.com/maps`
   * Assert the page title contains the exact substring: `Google Maps`

2. **Search box test**
   * From the home page, locate the search box with selector
     `[aria-label="Search Google Maps"]` — a stable accessible-name
     selector, preferred over a generated class name because Google Maps'
     CSS classes are minified and change between deploys while
     `aria-label` values are part of the accessible markup and stay stable
     (see the comment in `src/demo.js`)
   * Fill it with the exact text: `Cardiff Castle`
   * Press `Enter` in the search box
   * Wait for the resulting page to load
   * Assert the resulting page's URL contains the exact substring:
     `Cardiff` (Google Maps encodes the search query into the URL; this is
     the more honestly reliable assertion here than inspecting a results
     panel whose DOM structure shifts often — see the comment in
     `src/demo.js`)

3. **Zoom test**
   * Read the zoom level `z` out of the current URL, which Google Maps
     encodes as `@<lat>,<lng>,<zoom>z`
   * Click the element matching selector `[aria-label="Zoom in"]`
   * Read the zoom level `z` out of the resulting URL the same way
   * Assert the resulting zoom level is greater than the zoom level before
     the click (a deliberately URL-based assertion strategy, since the map
     surface itself is a `<canvas>` and not directly inspectable via DOM
     assertions — see the comment in `src/demo.js`)

## Acceptance criteria

* The code in `src/demo.js` is syntactically correct, matches this spec
  exactly (expected title substring, selectors, the search term, the
  URL-based zoom assertion), and is written from Playwright's documented
  API and Google's well-known, stable accessible markup.
* This demo's acceptance criteria are deliberately **not** "all 3 checks
  pass when run against the live site." Per `AGENTS.md`, this code must
  never be executed against the live google.com/maps in CI or other
  automated tooling, because Google's Terms of Service restrict automated
  querying of Google Maps.

## Related topics

* [../README.md](../README.md)
* [../AGENTS.md](../AGENTS.md)

## Sources

* <https://www.google.com/maps>
* <https://testingexamples.github.io/examples/google-maps/>
