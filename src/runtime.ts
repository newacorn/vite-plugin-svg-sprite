function createAddSymbol() {
  if (typeof window === 'undefined' || typeof document === 'undefined') {
    return () => {};
  }

  const idSet: Set<string> = (
    (window as any)._SVG_SPRITE_IDS_ = (window as any)._SVG_SPRITE_IDS_ || new Set()
  );

  const root = document.createElementNS('http://www.w3.org/2000/svg', 'svg') as SVGSVGElement;
  root.style.position = 'absolute';
  root.style.width = '0';
  root.style.height = '0';

  function insertRoot() {
    document.body.insertBefore(root, document.body.firstChild);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', insertRoot);
  } else {
    insertRoot();
  }

  return function addSymbol(symbol: string, id: string) {
    if (idSet.has(id) || document.getElementById(id)) {
      console.warn(`Icon #${id} was duplicately registered. It must be globally unique.`);
    }
    idSet.add(id);

    root.insertAdjacentHTML('beforeend', symbol);

    const el = root.lastChild;

    return function dispose() {
      idSet.delete(id);
      el?.remove();
    };
  };
}

export default createAddSymbol();
