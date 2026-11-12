# playwright-qa-suite

[![Playwright Tests](../../actions/workflows/playwright.yml/badge.svg)](../../actions/workflows/playwright.yml)

End-to-end tests written with [Playwright](https://playwright.dev) and JavaScript.
The tests run against a small practice site that lives in this repo (`app/`), so
nothing depends on an external website being up.

## What is covered

| Spec file                    | Feature                                                    |
| ---------------------------- | ---------------------------------------------------------- |
| `tests/login.spec.js`        | Login, logout, redirect for unauthenticated users          |
| `tests/forms.spec.js`        | Text, email, select, radio, checkbox, date, validation     |
| `tests/windows.spec.js`      | New tab, popup window, multiple pages, isolated contexts   |
| `tests/dialogs.spec.js`      | Alert, confirm, prompt                                     |
| `tests/frames.spec.js`       | Form inside an iframe                                      |
| `tests/files.spec.js`        | File upload and download                                   |
| `tests/table.spec.js`        | Row count, filtering, sorting                              |
| `tests/interactions.spec.js` | Drag and drop, hover, keyboard, double and right click     |
| `tests/dynamic.spec.js`      | Waiting for loaders, delayed elements, network mocking     |
| `tests/navigation.spec.js`   | Page title, links, back navigation, 404                    |
| `tests/api.spec.js`          | GET and POST requests without a browser                    |

## Project layout

```
.
├── .github/workflows/playwright.yml   CI pipeline
├── app/                               practice site + tiny Node server
├── pages/                             page objects (login, register)
├── tests/                             spec files
└── playwright.config.js
```

## Getting started

You need Node.js 18 or newer.

```bash
npm install
npx playwright install
npm test
```

Playwright starts the practice site on port 3000 by itself. To use another port:

```bash
PORT=4000 npm test
```

## Useful commands

```bash
npm run test:chromium         # one browser only
npm run test:headed           # watch the browser
npm run test:ui               # Playwright UI mode
npx playwright test tests/forms.spec.js
npx playwright test -g "popup"
npm run report                # open the last HTML report
npm start                     # run the practice site on its own
```

## CI

The workflow in `.github/workflows/playwright.yml` runs on every push and pull
request to `main`. Each browser (Chromium, Firefox, WebKit) runs as a separate
job, and the HTML report is uploaded as a build artifact you can download from
the run page.

Test credentials for the login page: `tester` / `secret123`.
