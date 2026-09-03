# AGENTS.md

This repo is a small, beginner-friendly walkthrough that uses Playwright
with JavaScript/Node to describe driving a real browser against the real,
live [Google Maps](https://www.google.com/maps) website and run three real
assertion-based checks.

## Source of truth

`spec/index.md` is the single source of truth for the exact three assertions
and selectors this demo checks against the live google.com/maps site. The
code in `src/demo.js` must match it exactly (expected title substring,
selectors, the search term, the URL-based zoom assertion). If the code and
`spec/index.md` ever disagree, that is a defect in one of them — fix it
before doing anything else.

## Install and run

See `README.md` for the Install and Run sections. Do not duplicate those
steps here; follow the README.

## Non-negotiable: do not change the scenario without updating the spec

Don't change the target site, the three test scenarios, or the exact
expected strings/selectors without updating `spec/index.md` first, in the
same change.

## Non-negotiable: never execute this code against live google.com/maps

This is the important difference from this workspace's other demos, such as
`demo-playwright-javascript-for-nhs-wales`, which **are** meant to be run
against their live target site. This repo is different on purpose:

Google's Terms of Service restrict automated querying of Google Maps (see
the caution in `README.md`). `src/demo.js` must never be executed against
the live google.com/maps in CI, in a scheduled job, or by any other
automated tooling. It is written for correctness from Playwright's
documented API and Google's well-known, stable accessible markup, but it is
not verified by a live run, and it must stay that way. If you want to see
whether the code still matches Google's current markup, read it and compare
it against the site by hand — do not run it as part of any automated
process.

CLAUDE.md is a pointer to this file — it is the single source of truth for
agent instructions.
