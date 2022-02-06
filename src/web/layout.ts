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
    isAuthenticated,
    stylesheets = [],
    scripts = [],
  }: {
    isAuthenticated?: boolean;
    stylesheets?: string[];
    scripts?: scriptSpec[];
  },
  main: unknown
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

        <link href="/public/dist/main.css" rel="stylesheet" />
        ${stylesheets.map((s) => html`<link rel="stylesheet" href="${s}" />`)}

        ${scripts.map((s) =>
          typeof s === "string"
            ? html`<script src="${s}"></script>`
            : s && s["async"]
            ? html`<script src="${s.src}" async></script>`
            : html`<script src="${s.src}" defer></script>`
        )}
      </head>
      <body class="p-4 space-y-4">
        <header>
          <nav>
            <ul class="flex flex-row space-x-4">
              <li class="border-black border-b-2 border-dashed">
                <a href="/">Home</a>
              </li>
              ${isAuthenticated
                ? html`
                    <li class="border-black border-b-2 border-dashed">
                      <a href="/profile">Profile</a>
                    </li>
                    <li class="border-black border-b-2 border-dashed">
                      <a href="/logout">Logout</a>
                    </li>
                  `
                : html`
                    <li class="border-black border-b-2 border-dashed">
                      <a href="/login">Login</a>
                    </li>
                  `}
              <li class="border-black border-b-2 border-dashed">
                <a href="/checkout">Sample Checkout</a>
              </li>
            </ul>
          </nav>
        </header>
        <main class="space-y-4">${main}</main>
        <!-- <footer>Footer</footer> -->
      </body>
    </html>
  `;
}
