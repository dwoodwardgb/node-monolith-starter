import { html } from "./html";

type scriptSpec =
  | string
  | {
      src: string;
      async: true;
    }
  | {
      src: string;
      deferd: true;
    };

export default function layout(
  {
    stylesheets = [],
    scripts = [],
  }: {
    stylesheets?: string[];
    scripts?: scriptSpec[];
  },
  main
) {
  return html`
    <!DOCTYPE html>
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.ico" />
        <meta name="theme-color" content="#000000" />
        <meta name="description" content="Node monolith starter" />
        <link rel="manifest" href="/manifest.json" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta charset="UTF-8" />
        <title>Node Monolith Starter</title>

        ${stylesheets.map((s) => html`<link rel="stylesheet" href="${s}" />`)}

        <link rel="stylesheet" href="/stylesheets/main.css" />

        ${scripts.map((s) =>
          typeof s === "string"
            ? html`<script src="${s}"></script>`
            : s && s["async"]
            ? html`<script src="${s.src}" async></script>`
            : html`<script src="${s.src}" defer></script>`
        )}
      </head>
      <body>
        <header>Header</header>
        <main>${main}</main>
        <footer>Footer</footer>
      </body>
    </html>
  `;
}
