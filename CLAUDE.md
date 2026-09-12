# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```
npm start   # CRA dev server (localhost:3000)
npm build   # production build to build/
```

No lint or test scripts/config exist in this repo — there are no automated tests to run.

The app calls its own `/api/reading` Vercel function, so full AI-reading behavior only works when deployed to Vercel (or run via `vercel dev`) with `REACT_APP_ANTHROPIC_KEY` set; `npm start` alone will 404 on that endpoint and fall through to the local fallback message engine (see below), which is fine for UI work.

## Architecture

Single-page Create React App with no router, no state library, and no build tooling beyond `react-scripts`. Everything lives in four files:

- **`src/App.jsx`** — the entire UI and all state (`useState` only). Owns the question → cards → AI reading flow and the "draw extra advice cards" flow.
- **`src/cards.js`** — the 78-card Waite deck: name, Korean name, static fallback `reading` text, and an inline SVG illustration per card. Exports `CARDS`, `POS` (position labels 과거/현재/미래), `pick3()`.
- **`src/synthesis.js`** — the non-AI fallback message generator (`getSynthesis`) plus question analysis (`analyzeQuestion`, `extractKeyword`).
- **`api/reading.js`** — Vercel serverless function that proxies `POST /api/reading` to `https://api.anthropic.com/v1/messages`, injecting `REACT_APP_ANTHROPIC_KEY` server-side so the key never reaches the browser.

### Reading flow

1. User types a question. `analyzeQuestion` (synthesis.js) classifies it into a category — 연애·관계 / 직업·학업 / 기타 — by counting keyword hits from two hardcoded Korean keyword lists (work keywords win ties).
2. `pick3()` draws 3 random cards (과거/현재/미래), revealed with staggered `setTimeout`s for the flip animation.
3. App builds a Korean prompt embedding the question, category, and the 3 cards' names/readings, and POSTs it to `/api/reading` requesting `claude-sonnet-5`.
4. If the API call fails or returns no text (offline, key missing, rate limit, etc.), `App.jsx` falls back to `getSynthesis(cards, category, question)` instead of showing an error.
5. "조언 듣기" (advice) repeats the same pattern with 3 more cards (excluding the first 3) with a separate prompt/fallback (`_extraFallback`).

### Fallback message engine (`synthesis.js`)

`getSynthesis` resolves a message through a strict priority chain (documented step-by-step in `docs/타로리딩_알고리즘.md`):

1. **intent override** — `extractKeyword` first checks the question for an intent (compare/when/how/why/who/possible/advice via regex) and a subject keyword (남자친구, 면접, 취업, etc.); if an intent is found, `intentMsg` picks a message keyed by `intent × category × future-card-theme`.
2. **exact combo** — each of the 3 drawn cards maps to one of 15 themes (`getT`); the past-present-future theme key (e.g. `'new-inner-growth'`) is looked up in `exactLove`/`exactWork`/`exactEtc`.
3. **category default** — if no exact combo matches, falls back to `byLove`/`byWork`/`byEtc`, keyed by the *future* card's theme only; entries are `[keywordAwareFn, genericString]` pairs, resolved based on whether `extractKeyword` found a subject word.
4. **generic fallback** — a single templated sentence built from the 3 cards' Korean names.

`docs/종합메시지_243개.md` is a **human-readable mirror** of this data (all message strings from steps 2–4) for review — it is not loaded by the app. If you edit the message pools in `synthesis.js`, update that doc to match, or note that it's now stale.

### Card data style (`cards.js`)

Deliberately terse/minified (single-letter helper functions like `C`, `lb`, `sR`, `s5`, `cR`, `cU`, `sW`, `pN`, `wN`, `mN`, one-line card objects) to keep 78 hand-drawn SVG card definitions manageable in one file. Match this style when adding/editing cards rather than expanding it into verbose JSX — the existing helpers (ring/star/cup/sword/wand/pentacle/moon/body primitives) cover most iconography needed for new cards.

Light mode is achieved by CSS-filtering the same dark-drawn SVGs (`invert(0.92) hue-rotate(180deg) saturate(1.15) brightness(1.03)` in `App.jsx`) rather than drawing separate light-mode art — keep new card colors within the palette (`G`/`B`/`R`/`Gr`/`P` constants) so the filter continues to look correct.

## Deployment

- GitHub push to `main` → Vercel auto-redeploys (https://hermithouse.vercel.app).
- The Anthropic API key is stored only as a Vercel environment variable (`REACT_APP_ANTHROPIC_KEY`), read server-side in `api/reading.js`.
