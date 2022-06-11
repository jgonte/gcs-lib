/**
 * Lightweight demo/story browser in plain JavaScript, no dependencies.
 */

// Semi-private fields stored via Symbol keys on an element instance.
const defaultPathKey = Symbol();
const linksKey = Symbol();
const pathKey = Symbol();

// The template for the component's shadow tree.
const template = `
  <style>
    :host {
      display: grid;
      grid-template-columns: auto 1fr;
      overflow: hidden;
    }
    [part~="navigation"] {
      position: relative;
      overflow: auto;
    }
    #toolbar {
      display: grid;
      position: sticky;
      top: 0;
      width: 100%;
    }
    #closeButton {
      background: none;
      border: none;
      color: inherit;
      margin: 0.5em;
      position: absolute;
      right: 0;
    }
    [part~="frame"] {
      border: none;
      height: 100%;
      position: relative;
      width: 100%;
    }
  </style>
  <nav id="navigation" part="navigation">
    <div id="toolbar">
      <button id="closeButton">⨉</button>
    </div>
    <slot></slot>
  </nav>
  <iframe id="frame" part="frame"></iframe>
`;

// The story browsing web component.
export default class StoryBrowser extends HTMLElement {
  constructor() {
    super();

    this[defaultPathKey] = null;
    this[linksKey] = [];
    this[pathKey] = getPathFromHash(window.location.hash);

    // Attach shadow and copy template into it.
    const root = this.attachShadow({ mode: "open" });
    root.innerHTML = template;

    // Clicking close button navigates to current page (without frame).
    root.getElementById("closeButton")?.addEventListener("click", () => {
      if (this[pathKey]) {
        window.location = this[pathKey];
      }
    });

    // When the frame loads a page, use the page's title as the document title.
    const frame = root.getElementById("frame");
    frame?.addEventListener("load", () => {
      document.title = frame.contentDocument.title;
    });

    // If links assigned to default slot change, highlight the current link.
    root.querySelector("slot")?.addEventListener("slotchange", () => {
      refreshLinks(this);
    });

    // When hash changes, load the indicated page.
    window.addEventListener("hashchange", () => {
      this[pathKey] =
        getPathFromHash(window.location.hash) || this[defaultPathKey];
      render(this);
    });

    render(this);
  }
}

// Given a URL hash, return the value of any `path` parameter in it.
function getPathFromHash(hash) {
  const match = /#path=(?<path>[^&]+)/.exec(hash);
  return match?.groups?.path;
}

// Highlight any navigation links that point to the current page.
function highlighCurrentLink(element) {
  const links = element[linksKey];
  const path = element[pathKey];
  let currentLink;
  if (links && path) {
    // Mark any links which are current.
    const expectedHash = `#path=${path}`;
    links.forEach((link) => {
      const current = link.hash === expectedHash;
      link.classList.toggle("current", current);
      if (current && !currentLink) {
        currentLink = link;
      }
    });
    // Scroll the (first) current link into view.
    if (currentLink) {
      currentLink.scrollIntoView({ block: "nearest" });
    }
  }
}

// Following a change in the set of nodes assigned to the default slot,
// extract the set of anchor tags in that collection of nodes.
function refreshLinks(element) {
  const slot = element.shadowRoot.querySelector("slot");

  const links = [];
  slot.assignedElements({ flatten: true }).forEach((el) => {
    if (el instanceof HTMLAnchorElement) {
      // This element is itself a link.
      links.push(el);
    }
    if (el instanceof HTMLElement) {
      // Add any links inside this element
      links.push(...el.querySelectorAll("a"));
    }
  });
  element[linksKey] = links;

  // Use first link as default path.
  element[defaultPathKey] = getPathFromHash(links[0].hash);

  // Use the default path as a path if we don't have a path already.
  if (element[defaultPathKey] && !element[pathKey]) {
    element[pathKey] = element[defaultPathKey];
  }

  render(element);
}

// Update the shadow tree after a change in path or link set.
function render(element) {
  // Show the indicated story in the frame.
  const path = element[pathKey];
  const frame = element.shadowRoot.getElementById("frame");
  if (frame.contentDocument.location.pathname !== path) {
    // Use `replace` to avoid affecting browser history.
    frame.contentWindow.location.replace(path);
  }

  highlighCurrentLink(element);
}