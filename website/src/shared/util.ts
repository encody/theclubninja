export function bound(min: number, x: number, max: number): number {
  return Math.min(max, Math.max(x, min));
}

export function multiple(x: number, factor: number) {
  return Math.floor(x / factor) * factor;
}

interface Orderable {
  order: number;
}

export function orderable(a: Orderable, b: Orderable) {
  return a.order - b.order;
}

export function deepEquals<T>(a: T, b: T): boolean {
  const tA = typeof a;
  const tB = typeof b;

  if (tA !== tB) {
    return false;
  }

  if (tA !== 'object') {
    return a === b;
  }

  const keysA = Object.keys(a).sort();
  const keysB = Object.keys(b).sort();

  if (keysA.length !== keysB.length) {
    return false;
  }

  for (let i = 0; i < keysA.length; i++) {
    const keyA = keysA[i];
    const keyB = keysB[i];

    if (keyA !== keyB || !deepEquals((a as any)[keyA], (b as any)[keyA])) {
      return false;
    }
  }

  return true;
}
