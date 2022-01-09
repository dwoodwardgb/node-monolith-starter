import { html } from "../web/html";
import layout from "../web/layout";

export default () =>
  layout(
    { isAuthenticated: !!user },
    html`
      <section>
        <h1>Profile for ${user.nickname}</h1>
        <div>email: ${user.email}</div>
        ${user.addresses.length > 0
          ? html`<section>
              <h2>Addresses</h2>
              <ul>
                ${user.addresses.map((a) => html`<li>${a.city}</li>`)}
              </ul>
            </section>`
          : ""}
      </section>
    `
  );
