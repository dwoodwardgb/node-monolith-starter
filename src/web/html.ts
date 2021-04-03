import escapeHtml from "escape-html";

class EscapedString {
  constructor(private value: string) {}
  toString() {
    return this.value;
  }
}

function renderLeaf(leaf: EscapedString | any) {
  if (leaf instanceof EscapedString) {
    return leaf.toString();
  } else {
    return escapeHtml("" + leaf);
  }
}

export function html(outer: TemplateStringsArray, ...inner) {
  let result = "";
  let outerIndex = 0;
  let innerIndex = 0;
  while (outerIndex < outer.length || innerIndex < inner.length) {
    if (outerIndex < outer.length) {
      result += outer[outerIndex];
      outerIndex += 1;
    }
    if (innerIndex < inner.length) {
      let cur = inner[innerIndex];
      if (!(cur instanceof Array)) {
        cur = [cur];
      }
      result += cur.map(renderLeaf).join("\n");
      innerIndex += 1;
    }
  }
  return new EscapedString(result);
}

export function renderHtml(html) {
  return html.toString();
}
