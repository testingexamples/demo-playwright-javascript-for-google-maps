#!/usr/bin/env node

///
// Demo of Playwright browser automation with JavaScript, using the real,
// live Google Maps website <https://www.google.com/maps> as a real-world
// example.
//
// This is a beginner-friendly walkthrough: each step is commented so you can
// follow along and adapt the pattern to your own site.
//
// IMPORTANT: Google's Terms of Service restrict automated querying of
// Google Maps. This file is written and reviewed for correctness, but it
// is deliberately NOT meant to be run repeatedly, or at all, in CI or other
// automated tooling against the live google.com/maps. See README.md and
// AGENTS.md for the full caution.
//
// Please see the file README.md for more information.
//
// ## Tracking
//
//   * Package: demo-playwright-javascript-for-google-maps
//   * Version: 1.0.0
//   * Created: 2026-09-03T00:00:00Z
//   * Updated: 2026-09-03T00:00:00Z
//   * License: GPL-2.0-or-greater or for custom license contact us
//   * Contact: Joel Parker Henderson (joel@joelparkerhenderson.com)
///

// Import Playwright.
import { chromium } from 'playwright';

// Import strict assert, renamed for convenience as assert.
// We use this to verify each step actually did what we expect.
import { strict as assert } from 'assert';

async function demo() {

    // Launch a browser. Set headless to true if you don't want to watch it.
    const browser = await chromium.launch({
        headless: false,
    });

    const context = await browser.newContext();
    const page = await context.newPage();

    try {

        ///
        // Step 1: Connect to the Google Maps home page, then verify the
        // page title is what we expect.
        //
        // Note: we assert the title *contains* "Google Maps" rather than
        // equals it exactly, because Google Maps sometimes appends a
        // current place name or search term to the tab title.
        ///

        await page.goto('https://www.google.com/maps');

        const homeTitle = await page.title();
        console.log(`Home page title: "${homeTitle}"`);
        assert.ok(
            homeTitle.includes('Google Maps'),
            `Expected page title to contain "Google Maps", got "${homeTitle}"`
        );
        console.log('✅ Home page title contains "Google Maps".');

        ///
        // Step 2: Use the search box to search for "Cardiff Castle".
        //
        // Note on the selector: we target the search box by its accessible
        // name, `[aria-label="Search Google Maps"]`, rather than a
        // generated class name (Google Maps' CSS classes are minified and
        // change between deploys, so they are not stable selectors). An
        // aria-label is part of the accessible markup, put there for
        // screen readers, and is far more stable over time — the same
        // lesson documented on
        // https://testingexamples.github.io/examples/google-maps/.
        //
        // Note on the assertion: most of the map surface itself renders to
        // a <canvas> element (or WebGL), so it cannot be inspected the way
        // a normal DOM element can — you cannot "find" a pin or a street
        // label with a locator. Instead we assert against the URL, which
        // Google Maps updates to encode the search query as you navigate
        // to a results/place page. That is a more honestly reliable signal
        // here than trying to find a DOM element inside the results panel,
        // whose structure and class names shift often.
        ///

        const searchBox = page.locator('[aria-label="Search Google Maps"]');
        await searchBox.fill('Cardiff Castle');
        await searchBox.press('Enter');
        await page.waitForLoadState('load');

        const searchUrl = page.url();
        console.log(`URL after search: "${searchUrl}"`);
        assert.ok(
            searchUrl.includes('Cardiff'),
            `Expected URL to contain "Cardiff", got "${searchUrl}"`
        );
        console.log('✅ URL after search contains "Cardiff".');

        ///
        // Step 3: Click the "Zoom in" button, then verify the URL's
        // embedded zoom level increased.
        //
        // Note: Google Maps encodes the current view in the URL as
        // `@<lat>,<lng>,<zoom>z`, for example `@51.4816,-3.1791,15z`. This
        // is a deliberately URL-based assertion strategy: since the map
        // surface itself is a <canvas> and not directly inspectable via
        // DOM assertions, we read the zoom level back out of the URL
        // rather than trying to assert against the rendered map.
        ///

        const zoomLevelPattern = /@[-0-9.]+,[-0-9.]+,([0-9.]+)z/;

        const beforeMatch = zoomLevelPattern.exec(page.url());
        assert.ok(beforeMatch, `Expected URL to contain a zoom level, got "${page.url()}"`);
        const zoomBefore = Number(beforeMatch[1]);
        console.log(`Zoom level before: ${zoomBefore}`);

        await page.locator('[aria-label="Zoom in"]').click();
        await page.waitForTimeout(1000); // let the URL settle after the zoom animation

        const afterMatch = zoomLevelPattern.exec(page.url());
        assert.ok(afterMatch, `Expected URL to contain a zoom level, got "${page.url()}"`);
        const zoomAfter = Number(afterMatch[1]);
        console.log(`Zoom level after: ${zoomAfter}`);

        assert.ok(
            zoomAfter > zoomBefore,
            `Expected zoom level to increase, got ${zoomBefore} -> ${zoomAfter}`
        );
        console.log('✅ Zoom level increased after clicking "Zoom in".');

        console.log('\nAll checks passed. 🎉');

    } catch (err) {
        console.log(err.message);
        console.log(err.stack);
        process.exitCode = 1;
    } finally {
        await browser.close();
    }

}

demo().catch((err) => {
    console.error(err);
    process.exitCode = 1;
});
