// O jsdom não tem algumas APIs do navegador que os componentes usam.
if (!Element.prototype.scrollIntoView) Element.prototype.scrollIntoView = () => undefined;

if (typeof window.matchMedia !== "function") {
  window.matchMedia = (query: string) =>
    ({
      matches: false,
      media: query,
      onchange: null,
      addEventListener: () => undefined,
      removeEventListener: () => undefined,
      addListener: () => undefined,
      removeListener: () => undefined,
      dispatchEvent: () => false,
    }) as MediaQueryList;
}

// <dialog>: o jsdom não implementa showModal e close.
const proto = (globalThis.HTMLDialogElement ?? HTMLElement).prototype as HTMLDialogElement;
if (!proto.showModal) {
  proto.showModal = function (this: HTMLDialogElement) {
    this.setAttribute("open", "");
  };
  proto.close = function (this: HTMLDialogElement) {
    this.removeAttribute("open");
  };
}
