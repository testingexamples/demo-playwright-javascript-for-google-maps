---
name: demo-playwright-javascript-for-google-maps-skill
description: Explains the Playwright + JavaScript/Node demo that describes testing the real, live Google Maps website; invoke when someone wants to understand what this demo checks, adapt its real-world assertion-testing pattern (including its canvas/URL-based assertion strategy) to a different live site, or asks why this repo's code is not meant to be run.
---

# Demo Playwright JavaScript for Google Maps — skill

## What this demo teaches

This repo is a beginner-friendly example of **real-world, assertion-based
browser testing against a live, production website whose main surface
renders to `<canvas>`** (no mocks, no fixtures), written for Google Maps. It
uses Playwright with JavaScript/Node to describe driving a real Chromium
browser to <https://www.google.com/maps> and checking three things a
visitor might actually do:

1. The home page title contains `Google Maps`.
2. Typing `Cardiff Castle` into the search box
   (`[aria-label="Search Google Maps"]`) and pressing Enter leads to a URL
   that contains `Cardiff`.
3. Clicking "Zoom in" (`[aria-label="Zoom in"]`) increases the zoom level
   encoded in the URL (`@lat,lng,zoomz`).

Because most of the map itself renders to `<canvas>` (or WebGL) rather than
inspectable DOM elements, this demo leans on stable `aria-label` selectors
for controls and on the page URL (which Google Maps encodes the current
search and view into) for assertions, instead of trying to find pins or
streets on the map surface.

## Important: this demo is deliberately not run

Unlike other demos in this workspace, this code is **not meant to be
executed against the live google.com/maps**, in CI or otherwise, because
Google's Terms of Service restrict automated querying of Google Maps. It
was written and reviewed for correctness from Playwright's documented API
and Google's well-known, stable accessible markup — not verified by a live
run. See `README.md` and `AGENTS.md` for the full caution and policy.

## Adapting the pattern to a different real site

1. Pick a real target site you're allowed to test against, and confirm its
   terms of service permit automated testing.
2. If the site renders to `<canvas>` or otherwise resists DOM inspection,
   look for a URL-encoded state (like Google Maps' `@lat,lng,zoomz`) or
   stable `aria-label` controls you can assert against instead.
3. Pick 2-4 small, real user actions and write down the exact expected
   titles/text/selectors *before* writing code — that becomes your spec.
4. Copy the structure of `src/demo.js`: launch a browser, navigate, assert,
   print a checkmark, move to the next step, close the browser in a
   `finally` block.
5. Keep every expected string exact and verbatim between your spec and your
   code, the same way this repo keeps `spec/index.md` and `src/demo.js` in
   agreement.

This skill summarizes the repo. `AGENTS.md` and `spec/index.md` are the
source of truth — if this skill's summary ever disagrees with those, they
win.
